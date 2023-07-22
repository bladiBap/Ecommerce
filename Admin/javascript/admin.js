const PRODUCTOS = document.getElementById("view-products");
const MODAL_CONTAINER = document.getElementById("container-modal");
const MODAL_DELETE = document.getElementById("modal-confirm");
const MODAL = document.getElementById("modal");
const HEAD = document.getElementById("head");
const TITLE_HEAD = document.getElementById("titleHead");

const PRECIO = document.getElementById('precio');
const CANTIDAD = document.getElementById('cantidad');
const NOMBRE = document.getElementById('nombre');
const DESCRIPCION = document.getElementById('descripcion');
const IMAGEN = document.getElementById('imagenProducto');
const CATEGORIA = document.getElementById('categorias');

const SPAN_NOMBRE = document.getElementById('spanNombre');
const SPAN_DESCRIPCION = document.getElementById('spanDescripcion');
const SPAN_CATEGORIA = document.getElementById('spanCategoria');
const SPAN_PRECIO = document.getElementById('spanPrecio');
const SPAN_CANTIDAD = document.getElementById('spanCantidad');
const SPAN_IMAGEN = document.getElementById('spanImagen');

let idproducto = 0;
let modeAdd = false;
let modeEdition = false;

PRECIO.addEventListener('input', verificarPrecio);
CANTIDAD.addEventListener('input', verificarCantidad);
NOMBRE.addEventListener('input', verificarNombre);
DESCRIPCION.addEventListener('input', verificarDescripcion);
IMAGEN.addEventListener('change', verificarImagen);

const cargarProductos = async () => {
    const respond = await fetch('http://localhost:3000/productos');
    HEAD.style.visibility = "visible";
    TITLE_HEAD.innerHTML = "Productos";
    if (respond.status == 200) {
        const data = await respond.json();
        let html = `<div class="conteiner-product-item"  id="adminProductos">`;
        if (data.length == 0) {
            html = `<h1>No hay productos</h1>
                    </div>`;
            PRODUCTOS.innerHTML = html;
            return;
        }
        data.forEach(producto => {
            html += `
            <div class="product-item border-none-radius">
                <div class="imgDef"><img class="product-image radius" src="${producto.imagen}" alt="aire acondicionado"></div>
                <div class = "btnContent">
                <h3>${producto.nombre}</h3>
                <button class="border-none-radius" style="background-color: rgb(186,162,255);" onclick = "openModalEliminar(    ${producto.idproducto})">Eliminar</button>
                <button class="border-none-radius" onclick = "openModalEditar(${producto.idproducto})">Editar</button>
                </div>
            </div>`;
        });
        html += `</div>`;
        PRODUCTOS.innerHTML = html;
    }
};

const cargarProductoById = async (id) => {
    const respond = await fetch(`http://localhost:3000/productos/${id}`);
    if (respond.status == 200) {
        const productoJson = await respond.json();
        document.getElementById("nombre").value = productoJson.nombre;
        document.getElementById("descripcion").value = productoJson.descripcion;
        document.getElementById("precio").value = productoJson.precio;
        document.getElementById("cantidad").value = productoJson.cantidad;
        document.getElementById("preview").src = productoJson.imagen;
        const categoriaRespond = await fetch(`http://localhost:3000/categorias`);
        if (categoriaRespond.status == 200) {
            const categoriaJson = await categoriaRespond.json();
            let html = '';
            categoriaJson.forEach(categoria => {
                if (categoria.idcategoria == productoJson.fkcategoria) {
                    html += `<option value="${categoria.idcategoria}" selected>${categoria.nombre}</option>`;
                } else {
                    html += `<option value="${categoria.idcategoria}">${categoria.nombre}</option>`;
                }
            });
            document.getElementById("categorias").innerHTML = html;
        }
    }
};


async function openModalEliminar(id) {
    let sepuede = await sePuedeElimnar(id);
    if (!sepuede) {
        showToast("Producto en compra");
        return;
    }

    MODAL_DELETE.classList.add("show-modal");
    let html = `
    <h1>¿Esta seguro de eliminar el producto?</h1>
    <div class="container-botones-delete">
        <button style="background-color: rgb(93, 152, 215);" onclick = "deleteProduct(${id})">Si</button>
        <button style="background-color: rgb(17, 111, 234);" onclick = "closeModalDel()">No</button>
    </div>`;
    document.getElementById("container-modal-delete").innerHTML = html;
    document.getElementById("modal-confirm").classList.add("show-modal");
}

const sePuedeElimnar = async (id) => {
    const respond = await fetch(`http://localhost:3000/compra/isvalite/${id}`);
    if (respond.status == 200) {
        const data = await respond.json();
        if (data.isvalite === false) {
            return false;
        }
        return true;
    }
};

function closeModalDel() {
    MODAL_DELETE.classList.remove("show-modal");
}

const deleteProduct = async (id) => {
    const respond = await fetch(`http://localhost:3000/productos/${id}`,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        });
    if (respond.status == 200) {
        closeModalDel();
        cargarProductos();
    }
};


function openModalEditar(id) {
    idproducto = id;
    document.getElementById("btnAcept").innerHTML = "Guardar";
    cargarProductoById(id);
    cleanError();
    MODAL.classList.add("show-modal");
    modeAdd = false;
    modeEdition = true;
}

function closeModal() {
    MODAL.classList.remove("show-modal");
    SPAN_NOMBRE.style.visibility = "hidden";
    SPAN_DESCRIPCION.style.visibility = "hidden";
    SPAN_CATEGORIA.style.visibility = "hidden";
    SPAN_PRECIO.style.visibility = "hidden";
    SPAN_CANTIDAD.style.visibility = "hidden";
    SPAN_IMAGEN.style.visibility = "hidden";
}

function saveModal() {
    cleanError();
    if (!verificarCampos()) {
        return;
    }
    let imagen = document.getElementById("imagenProducto").files[0];
    if (modeAdd && !modeEdition) {
        getBase64(imagen).then(
            data => {
                imagenBase64 = data;
                addProducto(imagenBase64);
            }).catch(
                error => {
                    alert(error);
                }
            );
    } else if (!modeAdd && modeEdition) {
        getBase64(imagen).then(
            data => {
                imagenBase64 = data;
                editProducto(imagenBase64);
            }).catch(
                error => {
                    alert(error);
                }
            );
    }
}

function getBase64(file) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () {
                resolve(reader.result);
            };
            reader.onerror = function (error) {
                reject(error);
            };
        });
    });
}

const addProducto = async (img) => {
    const categoria = document.getElementById("categorias").value;
    const nombre = document.getElementById("nombre").value;
    const descripcion = document.getElementById("descripcion").value;
    const precio = document.getElementById("precio").value;
    const cantidad = document.getElementById("cantidad").value;

    const jsonProduct = {
        "fkcategoria": categoria,
        "nombre": nombre,
        "descripcion": descripcion,
        "cantidad": cantidad,
        "precio": precio,
        "imagen": img
    };

    const respond = await fetch("http://localhost:3000/productos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(jsonProduct)
    });

    if (respond.status == 200) {
        closeModal();
        cargarProductos();
    }
};



const editProducto = async (imagen) => {
    const categoria = document.getElementById("categorias").value;
    const nombre = document.getElementById("nombre").value;
    const descripcion = document.getElementById("descripcion").value;
    const precio = document.getElementById("precio").value;
    const cantidad = document.getElementById("cantidad").value;

    const jsonProduct = {
        "fkcategoria": categoria,
        "nombre": nombre,
        "descripcion": descripcion,
        "cantidad": cantidad,
        "precio": precio,
        "imagen": imagen
    };

    const respond = await fetch(`http://localhost:3000/productos/${idproducto}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(jsonProduct)
    });

    if (respond.status == 200) {
        closeModal();
        cargarProductos();
    }
};

function adicionar() {
    document.getElementById("btnAcept").innerHTML = "Agregar";
    cleanModal();
    cargarCategorias();
    cleanError();
    MODAL.classList.add("show-modal");
    modeAdd = true;
    modeEdition = false;
}

const cargarCategorias = async () => {
    const respond = await fetch('http://localhost:3000/categorias');
    if (respond.status == 200) {
        const categoriaJson = await respond.json();
        let html = '';
        categoriaJson.forEach(categoria => {
            html += `<option value="${categoria.idcategoria}">${categoria.nombre}</option>`;
        });
        document.getElementById("categorias").innerHTML = html;
        document.getElementById("categorias").selectedIndex = 0;
    }
};

function cleanModal() {
    document.getElementById("nombre").value = "";
    document.getElementById("descripcion").value = "";
    document.getElementById("precio").value = "0";
    document.getElementById("cantidad").value = "1";
    document.getElementById("preview").src = "#";
    document.getElementById("imagenProducto").value = '';
}

function previewImage(event) {
    const input = event.target;
    const preview = document.getElementById('preview');

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        preview.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function verificarCampos() {
    const nombre = document.getElementById("nombre").value;
    const descripcion = document.getElementById("descripcion").value;
    const precio = document.getElementById("precio").value;
    const cantidad = document.getElementById("cantidad").value;
    const imagen = document.getElementById("imagenProducto").files[0];
    const categoria = document.getElementById("categorias").value;

    addClassError("nombre");
    addClassError("descripcion");
    addClassError("precio");
    addClassError("cantidad");
    addClassError("imagen");

    if (nombre == "" || descripcion == "" || precio == "" || cantidad == "" || imagen == "" || categoria == "" || imagen == "" || imagen === undefined || imagen === null) {
        return false;
    }
    return true;
}

function addClassError(id) {
    const nombre = document.getElementById("nombre").value;
    const descripcion = document.getElementById("descripcion").value;
    const precio = document.getElementById("precio").value;
    const cantidad = document.getElementById("cantidad").value;
    const imagen = document.getElementById("imagenProducto").files[0];

    if (nombre == "" && id == "nombre") {
        NOMBRE.classList.add("error");
        SPAN_NOMBRE.style.visibility = "visible";
    } else if (nombre != "" && id == "nombre") {
        NOMBRE.classList.remove("error");
        SPAN_NOMBRE.style.visibility = "hidden";
    }

    if (descripcion == "" && id == "descripcion") {
        DESCRIPCION.classList.add("error");
        SPAN_DESCRIPCION.style.visibility = "visible";
    } else if (descripcion != "" && id == "descripcion") {
        DESCRIPCION.classList.remove("error");
        SPAN_DESCRIPCION.style.visibility = "hidden";
    }

    if (precio == 0 && id == "precio") {
        PRECIO.classList.add("error");
        SPAN_PRECIO.style.visibility = "visible";
    } else if (precio != 0 && id == "precio") {
        PRECIO.classList.remove("error");
        SPAN_PRECIO.style.visibility = "hidden";
    }

    if (cantidad == 0 && id == "cantidad") {
        CANTIDAD.classList.add("error");
        SPAN_CANTIDAD.style.visibility = "visible";
    } else if (cantidad != 0 && id == "cantidad") {
        CANTIDAD.classList.remove("error");
        SPAN_CANTIDAD.style.visibility = "hidden";
    }

    if ((imagen == "" || imagen === undefined || imagen === null) && id == "imagen") {
        const preview = document.getElementById('preview');
        preview.src = "#";
        SPAN_IMAGEN.style.visibility = "visible";
    } else if (imagen != "" && id == "imagen") {
        SPAN_IMAGEN.style.visibility = "hidden";
    }
}

function verificarPrecio(event) {
    const valor = event.target.value;
    addClassError('precio');
    if (valor < 0) {
        event.target.value = 0;
    }
    if (valor > 10000) {
        event.target.value = 10000;
    }
}

function verificarCantidad(event) {
    const valor = event.target.value;
    addClassError('cantidad');
    if (valor < 0) {
        event.target.value = 0;
    }
    if (valor > 100) {
        event.target.value = 100;
    }
}

function verificarNombre(event) {
    addClassError('nombre');
}

function verificarDescripcion(event) {
    addClassError('descripcion');
}

function verificarImagen(event) {
    addClassError('imagen');
}

function cleanError() {
    NOMBRE.classList.remove("error");
    DESCRIPCION.classList.remove("error");
    PRECIO.classList.remove("error");
    CANTIDAD.classList.remove("error");
}

function compras() {
    HEAD.style.visibility = "hidden";
    TITLE_HEAD.innerHTML = "Ventas";
    getAllUserByFactura();
}

const getAllUserByFactura = async () => {
    let clientes = await getAllIdClient();
    let html = `<div class="venta-container">`;
    if (clientes.length == 0) {
        html += `<h1 class="title">No hay ventas</h1>`;
        PRODUCTOS.innerHTML = html;
        return;
    }
    for (let i = 0; i < clientes.length; i++) {
        const respond = await fetch(`http://localhost:3000/detalle/${clientes[i]}`);
        if (respond.status == 200) {
            const detalle = await respond.json();
            let facturas = detalle.facturas;
            html += getHtmlVentas(facturas);
        }
    }
    html += `</div>`;
    PRODUCTOS.innerHTML = html;
};

function getHtmlVentas(ventas) {
    let html = ``;
    ventas.forEach(factura => {
        html += `<h1 class = "factura-fecha" style="white-space: pre;">Nombre:${factura.nombre} ${factura.apellido}     Fecha:${factura.fecha}  <p>Total:${factura.total} Bs.</p> </h1>`;
        html += `<div class="item-venta">`;
        let compras = factura.compras
        compras.forEach(compra => {
            html += `<div class="product-item border-none-radius" style="min-width: 240px;max-width: 240px; background-color: rgb(234, 234, 235);">
                        <div class="imgDef"> <img class="product-image radius" src="${compra.producto.imagen}"></div>
                            <div class="btnContent">
                                <h3>${compra.producto.nombre}</h3>
                                <p>Subt:${(compra.subtotal).toFixed(2)} Bs.</p>
                                <p>Cantidad:${compra.cantidad}</p>
                                <p>Precio:${compra.producto.precio} Bs.</p>
                            </div>
                        </div>`;
        });
        html += `</div>`;
    });
    return html;
}

const getAllIdClient = async () => {
    const respond = await fetch('http://localhost:3000/detalle');
    if (respond.status == 200) {
        let clientes = await respond.json();
        let ids = [];
        clientes.id.forEach(cliente => {
            ids.push(cliente.fkusuario);
        });
        return ids;
    }
    return null;
};


function listaClientes() {
    HEAD.style.visibility = "hidden";
    TITLE_HEAD.innerHTML = "Clientes";
    getListClientes();
}

const getListClientes = async () => {
    const respond = await fetch('http://localhost:3000/usuarios');
    if (respond.status == 200) {
        let data = await respond.json();
        let html = `<div class="conteiner-product-item"  id="adminProductos">`;
        if (data.length == 0) {
            html = `<h1>No hay Clientes</h1>
                    </div>`;
            PRODUCTOS.innerHTML = html;
            return;
        }
        for (let i = 0; i < data.length; i++) {
            let cliente = await getInfoClienteHTML(data[i].idusuario);
            if (data[i].isadmin) {
                if (cliente[0] == undefined || cliente[0] == null || cliente[0] == "") {
                    html += `
                    <div class="client_list_item border-none-radius" style="background-color: rgb(93, 152, 215);max-height: 150px;">
                        <h3>Admin</h3>
                        <h3>Nombre: ${data[i].nombre} ${data[i].apellido}</h3>
                        <h3>Nro de Compras: 0 </h3>
                        <h3>Total: 0 Bs </h3>
                    </div>`;
                    continue;
                }
                html += `
                    <div class="client_list_item border-none-radius" style="background-color: rgb(93, 152, 215);max-height: 150px;">
                        <h3>Admin</h3>
                        <h3>Nombre: ${cliente[0].nombre}</h3>
                        <h3>Nro de Compras: ${cliente[0].cantidad_compras} </h3>
                        <h3>Total: ${cliente[0].total_compras} Bs </h3>

                    </div>`;
            } else {
                if (cliente[0] == undefined || cliente[0] == null || cliente[0] == "") {
                    html += `
                    <div class="client_list_item border-none-radius" style="max-height: 150px;">
                        <h3>Cliente</h3>
                        <h3>Nombre: ${data[i].nombre} ${data[i].apellido}</h3>
                        <h3>Nro de Compras: 0 </h3>
                        <h3>Total: 0 Bs </h3>
                    </div>`;
                    continue;
                }
                html += `
                    <div class="client_list_item border-none-radius" style="max-height: 150px;">
                        <h3>Cliente</h3>
                        <h3>Nombre: ${cliente[0].nombre}</h3>
                        <h3>Nro de Compras: ${cliente[0].cantidad_compras} </h3>
                        <h3>Total: ${cliente[0].total_compras} Bs </h3>
                    </div>`;
            }
        }
        html += `</div>`;
        PRODUCTOS.innerHTML = html;
    }
};

const getInfoClienteHTML = async (id) => {
    const respond = await fetch(`http://localhost:3000/detalle/cliente/de/${id}`);
    if (respond.status == 200) {
        let cliente = await respond.json();
        let clienteId = cliente.id;
        return clienteId;
    }
    return null;
};

function showToast(message) {
    const toastElement = document.getElementById('toast');
    toastElement.innerHTML = message;
    toastElement.classList.add('showToast');
    setTimeout(() => {
        toastElement.classList.remove('showToast');
    }, 2000);
}

function cerrarAdmin() {
    window.location.href = "http://127.0.0.1:5501/pages/login.html";
}








