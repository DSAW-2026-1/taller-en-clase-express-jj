const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

const SECRET = "secreto";

// LOGIN
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === 'ADMIN' && password === 'ADMIN') {
        const token = jwt.sign({ role: 'ADMIN' }, SECRET);
        return res.status(200).json({ token });
    }

    if (username === 'USER' && password === 'USER') {
        const token = jwt.sign({ role: 'USER' }, SECRET);
        return res.status(200).json({ token });
    }

    return res.status(400).json({ message: "Invalid credentials" });
});

// MIDDLEWARE
function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Invalid token" });
        }

        req.role = decoded.role;
        next();
    });
}

// REQUEST
app.get('/request', verifyToken, (req, res) => {
    if (req.role === 'ADMIN') {
        return res.status(200).json({ message: "Hi from ADMIN" });
    }

    if (req.role === 'USER') {
        return res.status(200).json({ message: "Hi from USER" });
    }

    return res.status(401).json({ message: "You're not allowed to do this" });
});

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});