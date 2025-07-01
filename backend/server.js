const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const { body, validationResult } = require('express-validator');
const sudo = require('sudo-prompt');

const app = express();
const PORT = process.env.PORT || 4000;
const options = { name: 'MongoDB Service Controller' };

// Función para iniciar MongoDB
function startMongo() {
    return new Promise((resolve, reject) => {
        sudo.exec('net start MongoDB', options, (error, stdout, stderr) => {
            if (error) return reject(error);
            console.log('MongoDB iniciado');
            resolve(stdout);
        });
    });
}

// Función para detener MongoDB
function stopMongo() {
    return new Promise((resolve, reject) => {
        sudo.exec('net stop MongoDB', options, (error, stdout, stderr) => {
            if (error) return reject(error);
            console.log('MongoDB detenido');
            resolve(stdout);
        });
    });
}

async function main() {
    try {
        await startMongo();

        await mongoose.connect('mongodb://localhost:27017/users', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Conectado a MongoDB');

        app.use(cors());
        app.use(express.json());

        const userSchema = new mongoose.Schema({
            username: { type: String, required: true, maxlength: 20 },
            email: { type: String, required: true, unique: true },
            password: { type: String, required: true },
            createdAt: { type: Date, default: Date.now },
        });

        const User = mongoose.model('User', userSchema, 'usuarios');

        app.post(
            '/api/register',
            [
                body('username').trim().notEmpty().withMessage('El nombre de usuario es requerido').isLength({ max: 20 }),
                body('email').isEmail().withMessage('Email inválido'),
                body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
            ],
            async (req, res) => {
                const errors = validationResult(req);
                if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });

                const { username, email, password } = req.body;

                try {
                    const existingUser = await User.findOne({ email });
                    if (existingUser) return res.status(400).json({ error: 'El correo ya está registrado' });

                    const salt = await bcrypt.genSalt(10);
                    const hashedPassword = await bcrypt.hash(password, salt);

                    const newUser = new User({ username, email, password: hashedPassword });
                    await newUser.save();

                    return res.status(201).json({ message: 'Usuario registrado exitosamente' });
                } catch (err) {
                    return res.status(500).json({ error: 'Error interno del servidor' });
                }
            }
        );

        app.post('/api/login', async (req, res) => {
            const { email, password } = req.body;
            try {
                const user = await User.findOne({ email });
                if (!user) return res.status(400).json({ error: 'Credenciales incorrectas' });

                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) return res.status(400).json({ error: 'Credenciales incorrectas' });

                return res.status(200).json({ message: 'Inicio de sesión exitoso', username: user.username });
            } catch (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error interno del servidor' });
            }
        });

        const server = app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });

        process.on('SIGINT', async () => {
            console.log('\nDeteniendo servidor y MongoDB...');
            await stopMongo();
            server.close(() => {
                console.log('Servidor cerrado');
                process.exit(0);
            });
        });

    } catch (err) {
        console.error('Error al iniciar MongoDB o el servidor:', err);
        process.exit(1);
    }
}

main();
