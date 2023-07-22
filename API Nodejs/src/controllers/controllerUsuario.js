const e = require('express');
const { pool } = require('../db/database');

const getUsuarios = async (req, res) => {
    const respond = await pool.query('SELECT * FROM usuarios');
    res.status(200).json(respond.rows);
};

const postUsuarios = async (req, res) => {
    const { nombre, apellido, correo, contrasena } = req.body;

    const email = await pool.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);

    if (email.rows.length > 0) {
        return res.status(400).send('correo');
    }

    await pool.query('INSERT INTO usuarios (nombre, apellido, correo, contrasena, isadmin)' +
        'VALUES ($1, $2, $3, $4, $5)', [nombre, apellido, correo, contrasena, false]);
    res.status(200).json({
        message: 'Usuario agregado',
        body: {
            usuario: { nombre, apellido, correo, contrasena }
        }
    });
};

const getUsuarioPorId = async (req, res) => {
    const id = req.params.id;
    const respond = await pool.query('SELECT * FROM usuarios WHERE idUsuario = $1', [id]);
    res.status(200).json(respond.rows[0]);
};

const deleteUsuario = async (req, res) => {
    const id = req.params.id;
    await pool.query('DELETE FROM usuarios WHERE idUsuario = $1', [id]);
    res.status(200).json(`Usuario ${id} eliminado`);
};

const putUsuario = async (req, res) => {
    const id = req.params.id;
    const { nombre, apellidoP, apellidoM, correo, contrasena } = req.body;
    await pool.query('UPDATE usuarios SET nombre = $1, apellidoP = $2,apellidoM = $3, correo = $4, contrasena = $5 WHERE idUsuario = $6', [nombre, apellidoP, apellidoM, correo, contrasena, id]);
    res.status(200).json(
        `Usuario ${id} actualizado`
    );
};

const checkUsuario = async (req, res) => {
    const { email, password } = req.body;
    const respond = await pool.query('SELECT * FROM usuarios WHERE correo = $1 AND contrasena = $2', [email, password]);
    if (respond.rows.length > 0) {
        res.status(200).json({
            "succes": true,
            "body": respond.rows[0]
        });
    } else {
        res.status(404).json({
            "succes": false
        });
    }
}

const checkCorreo = async (req, res) => {
    const {email} = req.body;
    const respond = await pool.query('SELECT * FROM usuarios WHERE correo = $1', [email]);
    if (respond.rows.length > 0) {
        res.status(200).json({
            "succes": true,
            "body": respond.rows[0]
        });
    } else {
        res.status(200).json({
            "succes": false
        });
    }
};

const loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    const respond = await pool.query('SELECT * FROM usuarios WHERE correo = $1 AND contrasena = $2 AND isadmin = $3', [email, password, true]);
    if (respond.rows.length > 0) {
        res.status(200).json({
            "succes": true,
            "body": respond.rows[0]
        });
    } else {
        res.status(404).json({
            "succes": false
        });
    }
};

module.exports = {
    getUsuarios,
    postUsuarios,
    getUsuarioPorId,
    deleteUsuario,
    putUsuario,
    checkUsuario,
    checkCorreo,
    loginAdmin
};