const {pool} = require('../db/database');

const postCompra = async (req, res) => {
    let {fkProducto, fkDetalle, fecha, subtotal, cantidad} = req.body;
    subtotal = parseFloat(subtotal);
    await pool.query('INSERT INTO compras (fkProducto, fkDetalle, fecha, subtotal, cantidad)' +
        'VALUES ($1, $2, $3, $4, $5)', [fkProducto, fkDetalle, fecha, subtotal, cantidad]);
    
    res.status(200).json({
        message: 'success'
    });
};

const getIsValiteDelete = async (req, res) => {
    let {id} = req.params;
    const response = await pool.query('SELECT * FROM compras WHERE fkProducto = $1', [id]);
    if (response.rowCount > 0) {
        res.status(200).json({
            message: 'success',
            isvalite: false
        });
    }else{
        res.status(200).json({
            message: 'success',
            isvalite: true
        });
    }
};

module.exports = {
    postCompra,
    getIsValiteDelete
};