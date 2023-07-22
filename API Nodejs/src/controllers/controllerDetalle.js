const {pool} = require('../db/database');


const postDetalle = async (req, res) => {
    let {fkUsuario, total, fecha} = req.body;
    total = parseFloat(total);
    let iddetalle =  await pool.query('INSERT INTO detalles (fkUsuario, total, fecha)' +
        'VALUES ($1, $2, $3) returning idDetalle', 
        [fkUsuario, total, fecha]
    ).then(res => {
        console.log(res.rows[0].iddetalle);
        return res.rows[0].iddetalle;
    }).catch(err => {
        console.log(err);
    });
    iddetalle = parseInt(iddetalle);
    res.status(200).json({
        "message": 'success',
        "idDetalle": iddetalle
    });
};

const  getDetalleByUser = async (req, res) => {
    const id = req.params.id;
    let listaFactura = [];
    const detallesId = await pool.query('select d.iddetalle  from detalles d where d.fkusuario = $1', [id]);
    console.log(detallesId);
    if (detallesId.rows.length == 0) {
        res.status(200).json({
            "message": 'success',
            "facturas": listaFactura
        });
    }
    let  limite = detallesId.rows.length;
    detallesId.rows.forEach(async detalle => {
        const factura = await pool.query('select  * from detalles d join usuarios u on u.idUsuario = d.fkUsuario where d.iddetalle = $1', [detalle.iddetalle]);
        let idDetalle = factura.rows[0].iddetalle;
        let total = factura.rows[0].total;
        let fecha = factura.rows[0].fecha;
        let nombre = factura.rows[0].nombre;
        let apellido = factura.rows[0].apellido;
        let listaCompra = [];
        const compras = await pool.query('select c.subtotal, c.cantidad, p.nombre, p.imagen, p.precio from compras c join productos p on p.idproducto = c.fkproducto where c.fkdetalle = $1', [idDetalle]);
        compras.rows.forEach( async compra => {
            let subtotal = compra.subtotal;
            let cantidad = compra.cantidad;
            let productojs = {
                "nombre": compra.nombre,
                "imagen": compra.imagen,
                "precio": compra.precio
            }
            listaCompra.push({
                "subtotal":subtotal,
                "cantidad":cantidad,
                "producto": productojs
            });
        });
        
        listaFactura.push({
            "iddetalle":idDetalle,
            "total":total,
            "fecha":fecha,
            "nombre":nombre,
            "apellido":apellido,
            "compras": listaCompra
        });
        if (limite == 1) {
            res.status(200).json({
                "message": 'success',
                "facturas": listaFactura
            });
        }
        limite--;
    });
};

const getAllIdClient = async (req, res) => {
    const respond = await pool.query('select distinct d.fkusuario  from detalles d;');
    res.status(200).json({
        "message": 'success',
        "id": respond.rows
    });
};

const getListClientes = async (req, res) => {
    const id = req.params.id;
    const respond = await pool.query('select distinct u.idusuario, count(d.fkusuario) as cantidad_compras , sum(d.total) as total_compras, concat_ws(\' \', u.nombre, u.apellido) as nombre from detalles d join usuarios u on u.idusuario = d.fkusuario where u.idusuario  = $1 group by u.idusuario;', [id]);
    
    res.status(200).json({
        "message": 'success',
        "id": respond.rows
    });
};


module.exports = {
    postDetalle,
    getDetalleByUser,
    getAllIdClient,
    getListClientes
};
