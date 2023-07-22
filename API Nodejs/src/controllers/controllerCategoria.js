const {pool} = require('../db/database');


const getCategorias = async (req, res) => {
    const respond = await pool.query('SELECT * FROM categorias');
    res.status(200).json(respond.rows);
};

const postCategorias = async (req, res) => {
    const {nombre} = req.body;
    await pool.query('INSERT INTO categorias (nombre)' +  
        'VALUES ($1)', [nombre]);
    res.status(200).json({
        message: 'Categoria agregada',
        body: {
            categoria: {nombre}
        }
    });
};

const getCategoriaPorId = async (req, res) => {
    const id = req.params.id;
    const respond = await pool.query('SELECT * FROM categorias WHERE idCategoria = $1', [id]);
    res.status(200).json(respond.rows[0]);
};

const deleteCategoria = async (req, res) => {
    const id = req.params.id;
    await pool.query('DELETE FROM categorias WHERE idCategoria = $1', [id]);
    res.status(200).json(`Categoria ${id} eliminada`);
};

const putCategoria = async (req, res) => {
    const id = req.params.id;
    const {nombre} = req.body;
    await pool.query('UPDATE categorias SET nombre = $1 WHERE idCategoria = $2', [nombre, id]);
    res.status(200).json(
        `Categoria ${id} actualizada`
    );
};

module.exports = {
    getCategorias,
    postCategorias,
    getCategoriaPorId,
    deleteCategoria,
    putCategoria
};