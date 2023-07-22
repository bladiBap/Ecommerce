
const {pool} = require('../db/database');

const getProductos = async (req, res) => {
    const respond = await pool.query('SELECT * FROM productos WHERE activo = true');
    res.status(200).json(respond.rows);
};

const postProductos = async (req, res) => {
    const {fkcategoria,nombre, descripcion, cantidad,precio, imagen} = req.body;
    await pool.query('INSERT INTO productos (fkCategoria, nombre, descripcion, cantidad, precio, imagen,activo)' +  
        'VALUES ($1, $2, $3, $4, $5, $6, $7)', [fkcategoria,nombre, descripcion, cantidad,precio, imagen, true]);
    res.status(200).json({
        message: 'Producto agregado',
        body: {
            producto: {fkcategoria,nombre, descripcion, cantidad,precio}
        }
    });
};

const getProductosPorCategoria = async (req, res) => {
    const id = req.params.id;
    const respond = await pool.query('SELECT * FROM productos WHERE fkCategoria = $1 and activo =  true', [id]);
    res.status(200).json(respond.rows);
}

const getProductoPorId = async (req, res) => {
    const id = req.params.id;
    const respond = await pool.query('SELECT * FROM productos WHERE idProducto = $1', [id]);
    res.status(200).json(respond.rows[0]);
};



const deleteProducto = async (req, res) => {
    const id = req.params.id;
    await pool.query('UPDATE productos SET activo = false WHERE idProducto = $1', [id]);
    res.status(200).json(`Producto ${id} eliminado`);
};

const putProducto = async (req, res) => {
    const id = req.params.id;
    const {fkcategoria,nombre, descripcion, cantidad,precio, imagen} = req.body;
    await pool.query('UPDATE productos SET fkcategoria = $1, nombre = $2, descripcion = $3, cantidad = $4, precio = $5, imagen = $6 WHERE idProducto = $7', [fkcategoria,nombre, descripcion, cantidad,precio,imagen, id]);
    res.status(200).json(
        `Producto ${id} actualizado`
    );
};


module.exports = {
    getProductos,
    postProductos,
    getProductoPorId,
    deleteProducto,
    putProducto,
    getProductosPorCategoria
};