const {Router} = require('express');
const router = Router();

const {getProductos, postProductos, getProductoPorId, deleteProducto, putProducto, getProductosPorCategoria} = require('../controllers/controllerProducto');
const {getCategorias, postCategorias, getCategoriaPorId, deleteCategoria, putCategoria} = require('../controllers/controllerCategoria');
const {getUsuarios, postUsuarios, getUsuarioPorId, deleteUsuario, putUsuario, checkUsuario, checkCorreo, loginAdmin} = require('../controllers/controllerUsuario');
const {postDetalle, getDetalleByUser, getAllIdClient, getListClientes} = require('../controllers/controllerDetalle');
const {postCompra, getIsValiteDelete} = require('../controllers/controllerCompra');
//Productos
router.get('/productos',getProductos);
router.post('/productos',postProductos);
router.get('/productos/:id',getProductoPorId);
router.delete('/productos/:id',deleteProducto);
router.put('/productos/:id',putProducto);
router.get('/productos/categoria/:id',getProductosPorCategoria);
//Categorias
router.get('/categorias',getCategorias);
router.post('/categorias',postCategorias);
router.get('/categorias/:id',getCategoriaPorId);
router.delete('/categorias/:id',deleteCategoria);
router.put('/categorias/:id',putCategoria);
//Usuarios
router.get('/usuarios',getUsuarios);
router.post('/usuarios',postUsuarios);
router.get('/usuarios/:id',getUsuarioPorId);
router.delete('/usuarios/:id',deleteUsuario);
router.put('/usuarios/:id',putUsuario);
router.post('/usuarios/login',checkUsuario);
router.post('/usuarios/correo/veri',checkCorreo);
router.post('/usuarios/login/admin',loginAdmin);
//Detalle
router.post('/detalle', postDetalle);
router.get('/detalle/:id', getDetalleByUser);
router.get('/detalle', getAllIdClient);
router.get('/detalle/cliente/de/:id', getListClientes);
//Compra
router.post('/compra', postCompra);
router.get('/compra/isvalite/:id', getIsValiteDelete);

module.exports = router;