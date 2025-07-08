const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const { body, validationResult } = require('express-validator');
const sudo = require('sudo-prompt');

const app = express();
const PORT = process.env.PORT || 4000;
const options = { name: 'MongoDB Service Controller' };

// --- Modelo User ---
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, maxlength: 20 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    profilePhoto: { type: String, default: null },
});

const User = mongoose.model('User', userSchema, 'usuarios');

// --- Middlewares ---
app.use(cors());
app.use(express.json());

// --- Rutas ---

// Registro
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

// Login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'Credenciales incorrectas' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Credenciales incorrectas' });

        return res.status(200).json({ message: 'Inicio de sesión exitoso', username: user.username, userId: user._id.toString() });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Actualizar foto perfil
app.post('/api/users/:id/photo', async (req, res) => {
    const { photo } = req.body;
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { profilePhoto: photo }, { new: true });
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
        return res.status(200).json({ message: 'Foto actualizada', profilePhoto: user.profilePhoto });
    } catch (err) {
        return res.status(500).json({ error: 'Error guardando foto' });
    }
});

// Obtener foto perfil
app.get('/api/users/:id/photo', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('profilePhoto');
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
        return res.status(200).json({ profilePhoto: user.profilePhoto });
    } catch (err) {
        return res.status(500).json({ error: 'Error obteniendo foto' });
    }
});

// Cambiar correo electrónico
app.post('/api/users/:id/change-email', async (req, res) => {
    const { currentEmail, newEmail, password } = req.body;
    const userId = req.params.id;

    if (!currentEmail || !newEmail || !password) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

        if (user.email !== currentEmail) {
            return res.status(400).json({ error: 'El correo actual no es correcto' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'La contraseña no es correcta' });

        const emailUsed = await User.findOne({ email: newEmail });
        if (emailUsed && emailUsed._id.toString() !== userId) {
            return res.status(400).json({ error: 'El nuevo correo ya está registrado por otro usuario' });
        }

        user.email = newEmail;
        await user.save();

        return res.status(200).json({ message: 'Correo actualizado correctamente' });
    } catch (err) {
        console.error('Error al cambiar el correo:', err);
        return res.status(500).json({ error: 'Error al cambiar el correo' });
    }
});

// --- Funciones para iniciar y detener MongoDB (Windows service) ---
function startMongo() {
    return new Promise((resolve, reject) => {
        sudo.exec('net start MongoDB', options, (error, stdout, stderr) => {
            if (error) return reject(error);
            console.log('MongoDB iniciado');
            resolve(stdout);
        });
    });
}

function stopMongo() {
    return new Promise((resolve, reject) => {
        sudo.exec('net stop MongoDB', options, (error, stdout, stderr) => {
            if (error) return reject(error);
            console.log('MongoDB detenido');
            resolve(stdout);
        });
    });
}

// --- Arrancar servidor y conectar a MongoDB ---
async function main() {
    try {
        await startMongo();

        await mongoose.connect('mongodb://localhost:27017/users', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Conectado a MongoDB');

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
