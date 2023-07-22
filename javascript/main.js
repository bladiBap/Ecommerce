const MODAL = document.getElementById("modal");
const MENU_CATEGORIAS = document.getElementById("aside");
const MAIN = document.getElementById("main");
const HEADER = document.getElementById("header");
const LISTCATEGORIAS = document.getElementById("Categorias");
const NOMBRECATEGORIA = document.getElementById("nombreCategoria");
const VIEW_PRODUCTOS = document.getElementById("view-products");
const DESCRIPCION = document.getElementById("descripcion");
const PRECIO = document.getElementById("precio");
const CANTIDAD = document.getElementById("Cantidad");
const MODAL_CONTAINER = document.getElementById("container-modal");
const OPTIONS = document.getElementById("infoCarrito");
const MODAL_PAGAR = document.getElementById("modalPagar");

const SPAN_NRO_TARJETA = document.getElementById("spanNroTarjeta");
const SPAN_FECHA_EXPIRACION = document.getElementById("spanFechaExpiracion");
const SPAN_CVV = document.getElementById("spanCvv");

const TARJETA = document.getElementById("tarjeta");
const EXPIRACION = document.getElementById("expiracion");
const CVV = document.getElementById("cvv");

isLogin();

function isLogin() {
    if (localStorage.getItem("inicioSesion") == "true") {
        document.getElementById("withUser").classList.remove("ocultar");
        document.getElementById("ventas").classList.remove("ocultar");
        document.getElementById("withoutUser").classList.add("ocultar");
        return;
    }
    document.getElementById("withUser").classList.add("ocultar");
    document.getElementById("ventas").classList.add("ocultar");
    document.getElementById("withoutUser").classList.remove("ocultar");

}

function logout() {
    localStorage.setItem("inicioSesion", "false");
    localStorage.setItem("id", "");
    localStorage.setItem("nombre", "");
    localStorage.setItem("apellido", "");
    localStorage.setItem("email", "");
    localStorage.setItem("carrito", "[]");
    window.location.href = 'pages/quienes-somos.html';
}

let tarjeta_input = document.getElementById('tarjeta');
tarjeta_input.addEventListener('input', function () {
    let numeroTarjeta = tarjeta_input.value.replace(/\s/g, '');
    numeroTarjeta = numeroTarjeta.replace(/\D/g, '');
    numeroTarjeta = numeroTarjeta.replace(/(\d{4})(?!$)/g, '$1 ');
    tarjeta_input.value = numeroTarjeta;

    if (TARJETA.value == "" || TARJETA.value.length < 19) {
        TARJETA.classList.remove("borderNone");
        TARJETA.classList.add("error");
        SPAN_NRO_TARJETA.style.visibility = "visible";
    } else {
        TARJETA.classList.remove("error");
        TARJETA.classList.add("borderNone");
        SPAN_NRO_TARJETA.style.visibility = "hidden";
    }
});

let expiracionInput = document.getElementById('expiracion');
expiracionInput.addEventListener('input', function () {
    let fechaExpiracion = expiracionInput.value;
    fechaExpiracion = fechaExpiracion.replace(/[^\d/]/g, '');
    if (fechaExpiracion.length > 2 && fechaExpiracion.charAt(2) !== '/') {
        fechaExpiracion = fechaExpiracion.slice(0, 2) + '/' + fechaExpiracion.slice(2);
    }
    if (EXPIRACION.value == "" || EXPIRACION.value.length < 7) {
        EXPIRACION.classList.remove("borderNone");
        EXPIRACION.classList.add("error");
        SPAN_FECHA_EXPIRACION.style.visibility = "visible";
    } else {
        EXPIRACION.classList.remove("error");
        EXPIRACION.classList.add("borderNone");
        SPAN_FECHA_EXPIRACION.style.visibility = "hidden";
    }
    expiracionInput.value = fechaExpiracion;
});

let cvvInput = document.getElementById('cvv');
cvvInput.addEventListener('input', function () {
    let cvv = cvvInput.value;
    cvv = cvv.replace(/[^\d]/g, '');
    if (CVV.value == "" || CVV.value.length < 3) {
        CVV.classList.remove("borderNone");
        CVV.classList.add("error");
        SPAN_CVV.style.visibility = "visible";
    } else {
        CVV.classList.remove("error");
        CVV.classList.add("borderNone");
        SPAN_CVV.style.visibility = "hidden";
    }
    cvvInput.value = cvv;
});

const cargarProductos = async () => {
    const respond = await fetch('http://localhost:3000/productos');
    ocultarOpcionPagar();
    if (respond.status == 200) {
        const data = await respond.json();
        let html = `<div id="productos" class="conteiner-product-item">`;
        data.forEach(producto => {
            html += `
            <div class="product-item border-none-radius">
                <div class="imgDef"> <img class="product-image radius" src="${producto.imagen}" alt="aire acondicionado"></div>
                <div class = "btnContent">
                    <h3>${producto.nombre}</h3>
                    <p>Precio: ${producto.precio} Bs</p>
                    <button class="border-none-radius" onclick = "openModal(${producto.idproducto})"> <i></i> Agregar</button>
                </div>
            </div>
            `;
        });
        html += `</div>`;
        VIEW_PRODUCTOS.innerHTML = html;
        NOMBRECATEGORIA.innerHTML = "Todos los productos";
    }

    if (localStorage.getItem("carrito") == null) {
        localStorage.setItem("carrito", "[]");
    }
};

const cargarProducto = async (id) => {
    const respond = await fetch(`http://localhost:3000/productos/${id}`);
    if (respond.status == 200) {
        const productoJson = await respond.json();
        let html = `
            <div class="container-image">
                <img src="${productoJson.imagen}" alt="aire">
            </div>
            <div class="modal-information" id="ModalInformation">
                <h1>${productoJson.nombre}</h1>
                <p id = "descripcion">${productoJson.descripcion}</p>
                <p id = "precio" style="font-weight: 700; font-size: 16px;">Precio: ${productoJson.precio} Bs.</p>
                <div class="container-cantidad">
                    <label for="Cantidad">Cantidad</label>
                    <input type="number" placeholder="Cantidad" id="Cantidad" min="1" max="10" value="1" style="width: 150px;">
                </div>
                <div class="container-botones">
                    <button style="background-color: green;"onclick = "addToCarrito(${productoJson.idproducto}, '${productoJson.nombre}', '${productoJson.descripcion}',${productoJson.precio})">Agregar</button>
                    <button style="background-color: red;" onclick = "closeModal()">Cancelar</button>
                </div>
            </div>`;
        MODAL_CONTAINER.innerHTML = html;
    }
};



const cargarCategorias = async () => {
    const respond = await fetch(`http://localhost:3000/categorias`);
    if (respond.status == 200) {
        const data = await respond.json();
        let html = '';
        data.forEach(categoria => {
            html += `<li> <button class="border-none-radius" onclick = "cargarProductosPorCategorias(${categoria.idcategoria}, '${categoria.nombre}')" >${categoria.nombre}</button> </li>`;
        })
        LISTCATEGORIAS.innerHTML = html;
    }
}

const cargarProductosPorCategorias = async (id, nombre) => {
    const respond = await fetch(`http://localhost:3000/productos/categoria/${id}`);
    ocultarOpcionPagar();
    if (respond.status == 200) {
        const data = await respond.json();
        let html = `<div id="productos" class="conteiner-product-item">`;
        if (data.length == 0) {
            html += `<h1 class="vacio">No hay productos</h1>`;
            html += `</div>`;
            VIEW_PRODUCTOS.innerHTML = html;
            NOMBRECATEGORIA.innerHTML = nombre;
            return;
        }
        data.forEach(producto => {
            html += `
            <div class="product-item border-none-radius">
                <div class="imgDef"> <img class="product-image radius" src="${producto.imagen}" alt="aire acondicionado"></div>
                <div class = "btnContent">
                    <h3>${producto.nombre}</h3>
                    <p>Precio: ${producto.precio} Bs</p>
                    <button class="border-none-radius" onclick = "openModal(${producto.idproducto})"> <i></i> Agregar</button>
                </div>
            </div>
            `;
        });
        html += `</div>`;
        VIEW_PRODUCTOS.innerHTML = html;
        NOMBRECATEGORIA.innerHTML = nombre;
    }
}

const subirCompras = async (compras) => {
    let idUsuario = localStorage.getItem("id");
    let totalDetalle = total(compras);
    let jsonData = JSON.stringify({
        fkUsuario: idUsuario,
        total: totalDetalle,
        fecha: new Date().toISOString().slice(0, 10)
    });

    const options = {
        method: 'POST',
        body: jsonData,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    const idDetail = await fetch(`http://localhost:3000/detalle`, options);
    if (idDetail.status == 200) {
        let id = await idDetail.json();
        let idDel = id.idDetalle;
        let fechas = new Date().toISOString().slice(0, 10);
        compras.forEach(async compra => {
            let jsonData = JSON.stringify({
                fkProducto: compra.id,
                fkDetalle: idDel,
                fecha : fechas,
                subtotal: compra.cantidad * compra.precio,
                cantidad: compra.cantidad
            });
            const options = {
                method: 'POST',
                body: jsonData,
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            const respond = await fetch(`http://localhost:3000/compra`, options);
            if (respond.status == 200) {

            }
        });
    }
}

function toCarrito() {
    let productos = localStorage.getItem("carrito");
    let jsonProductos = JSON.parse(productos);
    let html = `<div id="productos" class="conteiner-product-item">`;
    NOMBRECATEGORIA.innerHTML = "Carrito";
    mostrarOpcionPagar();
    if (jsonProductos.length == 0) {
        html = `<h1 class="vacio">No hay productos en el carrito</h1>`;
        html += `</div>`;
        VIEW_PRODUCTOS.innerHTML = html;
    } else {
        let limite = jsonProductos.length;
        jsonProductos.forEach(async producto => {
            const respond = await fetch(`http://localhost:3000/productos/${producto.id}`);
            if (respond.status == 200) {
                let productoJson = await respond.json();
                let subtotal = (producto.cantidad * producto.precio).toFixed(2);
                html += `
                <div class="product-item border-none-radius">
                    <div class="imgDef"><img class="product-image radius" src="${productoJson.imagen}" alt="aire acondicionado"></div>
                    <div class = "btnContent">
                    <h3>${producto.nombre}</h3>
                    <p>Cantidad: ${producto.cantidad}</p>
                    <p>Subt: ${subtotal} Bs</p>
                    <p>Precio: ${producto.precio} Bs</p>
                    <button class="border-none-radius" style="background-color: rgb(186,162,255);" onclick = "openModalConfirm(${productoJson.idproducto})"> <i></i> Eliminar</button>
                    <button class="border-none-radius" onclick = "openModalEdition(${productoJson.idproducto})">Editar</button>
                    </div>
                </div>
                `;

                if (limite == 1) {
                    html += `</div>`;
                    VIEW_PRODUCTOS.innerHTML = html;
                }
                limite--;
            }
        });
        
    }
    NOMBRECATEGORIA.innerHTML = "Carrito";
    OPTIONS.innerHTML = `
        <h2 id="total">Total: ${total(jsonProductos)} Bs</h2>
        <button class="border-none-radius" onclick = "openModalPagar()">Pagar</button>
    `;
}

function ocultarOpcionPagar() {
    document.getElementById("infoCarrito").style.display = "none";
}

function mostrarOpcionPagar() {
    document.getElementById("infoCarrito").style.display = "flex";
}

function total(jsonProductos) {
    let total = 0;
    jsonProductos.forEach(producto => {
        total += producto.precio * producto.cantidad;
    });
    return total.toFixed(2);
}

function openModalConfirm(id) {
    let html = `
    <h1>¿Esta seguro de eliminar el producto?</h1>
    <div class="container-botones-delete">
        <button style="background-color: rgb(93, 152, 215);" onclick = "deleteProduct(${id})">Si</button>
        <button style="background-color: rgb(17, 111, 234);" onclick = "closeModalDel()">No</button>
    </div>`;
    document.getElementById("container-modal-delete").innerHTML = html;
    document.getElementById("modal-confirm").classList.add("show-modal");
}
function closeModalDel() {
    document.getElementById("modal-confirm").classList.remove("show-modal");
}
function deleteProduct(id) {
    let productos = localStorage.getItem("carrito");
    let jsonProductos = JSON.parse(productos);
    let producto = jsonProductos.find(producto => producto.id == id);
    let index = jsonProductos.indexOf(producto);
    jsonProductos.splice(index, 1);
    localStorage.setItem("carrito", JSON.stringify(jsonProductos));
    closeModalDel();
    toCarrito();
}

async function openModalEdition(id) {
    let productos = localStorage.getItem("carrito");
    let jsonProductos = JSON.parse(productos);
    let producto = jsonProductos.find(producto => producto.id == id);
    let imagen = await getImagen(id);
    let html = `
        <div class="container-image">
            <img src="${imagen}" id="imgMo" alt="aire">
        </div>
        <div class="modal-information" id="ModalInformation">
            <h1>Informacion</h1>
            <p id = "descripcion" style="margin-bottom: 20px;">${producto.descripcion}</p>
            <p id = "precio" style="font-weight: 700; font-size: 16px;">Precio: ${producto.precio} Bs.</p>
            <div class="container-cantidad">
                <label for="Cantidad">Cantidad</label>
                <input type="number" placeholder="Cantidad" id="Cantidad" min="1" max="10" value="${producto.cantidad}" style="width: 150px;">
            </div>
            <div class="container-botones">
                <button style="background-color: green;"onclick = "addSaveEdition(${producto.id})">Guardar</button>
                <button style="background-color: red;" onclick = "closeModal()">Cancelar</button>
            </div>
        </div>`;
    MODAL_CONTAINER.innerHTML = html;
    MODAL.classList.add("show-modal");
}

const getImagen = async (id) => {
    const respond = await fetch(`http://localhost:3000/productos/${id}`);
    if (respond.status == 200) {
        const productoJson = await respond.json();
        return productoJson.imagen;
    }
};


function addSaveEdition(id) {
    let cantidad = document.getElementById("Cantidad").value;
    if (cantidad < 1 ) {
        showToast("Seleccione 1 o mas");
        return;
    }

    if(cantidad > 10){
        showToast("No puede seleccionar mas de 10");
        return;
    }

    let productos = localStorage.getItem("carrito");
    let jsonProductos = JSON.parse(productos);
    let producto = jsonProductos.find(producto => producto.id == id);
    producto.cantidad = cantidad;
    document.getElementById("total").innerHTML = `Total: ${total(jsonProductos)} Bs`;
    localStorage.setItem("carrito", JSON.stringify(jsonProductos));
    MODAL.classList.remove("show-modal");
    toCarrito();
}

//Modal pagar

function openModalPagar() {
    let productos = localStorage.getItem("carrito");
    let jsonProductos = JSON.parse(productos);

    let id = localStorage.getItem("id");
    if (id == null || id == "") {
        showToast("Inicie sesion");
        return;
    }

    if (jsonProductos.length == 0) {
        showToast("Carrito vacio");
        return;
    }
    
    document.getElementById("totalPagar").innerHTML = `${total(jsonProductos)}`;
    addListaCompra();
    document.getElementById("modal-pagar").classList.add("show-modal");
}

function addListaCompra(){
    let productos = localStorage.getItem("carrito");
    let jsonProductos = JSON.parse(productos);
    let html = "";
    jsonProductos.forEach(producto => {
        html += `
            <div class="listaItemCompra"><p>${producto.nombre}</p>  <p>${producto.cantidad} Unid.</p></div>
        `;
    });

    document.getElementById("listaCompra").innerHTML = html;
}

function closeModalPagar() {
    document.getElementById("modal-pagar").classList.remove("show-modal");
    TARJETA.classList.remove("error");
    TARJETA.classList.add("borderNone")
    EXPIRACION.classList.remove("error");
    EXPIRACION.classList.add("borderNone");
    CVV.classList.remove("error");
    CVV.classList.add("borderNone");
    TARJETA.value = "";
    EXPIRACION.value = "";
    CVV.value = "";
}

function pagar() {
    let isValited = true;

    if (TARJETA.value == "" || TARJETA.value.length < 19) {
        TARJETA.classList.remove("borderNone");
        TARJETA.classList.add("error");
        SPAN_NRO_TARJETA.style.visibility = "visible";
        isValited = false;
    } else {
        TARJETA.classList.remove("error");
        TARJETA.classList.add("borderNone");
        SPAN_NRO_TARJETA.style.visibility = "hidden";
    }

    if (CVV.value == "" || CVV.value.length < 3) {
        CVV.classList.remove("borderNone");
        CVV.classList.add("error");
        SPAN_CVV.style.visibility = "visible";
        isValited = false;
    } else {
        CVV.classList.remove("error");
        CVV.classList.add("borderNone");
        SPAN_CVV.style.visibility = "hidden";
    }

    if (EXPIRACION.value == "" || EXPIRACION.value.length < 7) {
        EXPIRACION.classList.remove("borderNone");
        EXPIRACION.classList.add("error");
        SPAN_FECHA_EXPIRACION.style.visibility = "visible";
        isValited = false;
    } else {
        EXPIRACION.classList.remove("error");
        EXPIRACION.classList.add("borderNone");
        SPAN_FECHA_EXPIRACION.style.visibility = "hidden";
    }

    if (!isValited) {
        return;
    }
    let productos = localStorage.getItem("carrito");
    let jsonProductos = JSON.parse(productos);
    subirCompras(jsonProductos);

    jsonProductos = [];
    localStorage.setItem("carrito", JSON.stringify(jsonProductos));
    closeModalPagar();
    toCarrito();
}

function toVentas () {
    let idUser = localStorage.getItem("id")
    OPTIONS.innerHTML = ``;
    getVentasByUser(idUser);
    
}

const getVentasByUser = async (id) => {
    const respond = await fetch(`http://localhost:3000/detalle/${id}`);
    if (respond.status == 200){
        const ventas = await respond.json();
        let facturas  = ventas.facturas;
        let html = "";
        NOMBRECATEGORIA.innerHTML = `Mis ventas`;
        if (facturas == null || facturas == undefined || facturas.length == 0){
            html = `<h1 class="vacio" >No hay  ventas</h1>`;
            VIEW_PRODUCTOS.innerHTML = html;
            return;
        }
        html += `<div class="venta-container">`;
        facturas.forEach(factura => {
            html += `<h1 class = "factura-fecha"> ${factura.fecha} <p>Total compra ${factura.total} Bs.</p> </h1>`;
            html += `<div class="item-venta">`;
            let compras = factura.compras
            compras.forEach(compra => {
                html += `<div class="product-item border-none-radius" style="min-width: 240px;max-width: 240px;">
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
        html += `</div>`;
        VIEW_PRODUCTOS.innerHTML = html;
    }
}

function toLogin() {
    window.location.href = "../pages/login.html";
}

function openModal(id) {
    cargarProducto(id);
    MODAL.classList.add("show-modal");
}

function closeModal() {
    MODAL.classList.remove("show-modal");
}

function showMenuMobile() {
    MENU_CATEGORIAS.classList.add("show-menu-categories");
    MAIN.classList.add("desableClickAll");
    HEADER.classList.add("desableClickAll");
}

function closeMenuMobile() {
    MENU_CATEGORIAS.classList.remove("show-menu-categories");
    MENU_CATEGORIAS.classList.add("close-menu-categories");
    MAIN.classList.remove("desableClickAll");
    HEADER.classList.remove("desableClickAll");
}

function addToCarrito(id, nombre, descripcion, precio) {
    let cantidad = document.getElementById("Cantidad").value;
    if(cantidad <= 0){
        showToast("Seleccione 1 o mas");
        return;
    }
    if(cantidad > 10){
        showToast("No puede seleccionar mas de 10");
        return;
    }

    let productos = localStorage.getItem("carrito");
    let jsonProductos = JSON.parse(productos);
    if (jsonProductos == null) {
        jsonProductos = [];
        localStorage.setItem("carrito", JSON.stringify(jsonProductos));
    } else {
        if (jsonProductos.some(producto => producto.id === id)) {
            jsonProductos.forEach(producto => {
                if (producto.id === id) {
                    producto.cantidad = parseInt(producto.cantidad) + parseInt(cantidad);
                }
            });
        } else {
            jsonProductos.push({
                "id": id, "cantidad": cantidad,
                "nombre": nombre, "precio": precio,
                "descripcion": descripcion
            });

        }
        localStorage.setItem("carrito", JSON.stringify(jsonProductos));
    }
    closeModal();
}

window.addEventListener('resize', function () {
    let anchoPantalla = window.innerWidth;
    if (anchoPantalla > 900 && MENU_CATEGORIAS.classList.contains('close-menu-categories')) {
        MENU_CATEGORIAS.classList.remove('close-menu-categories');
    }
});

function showToast(message) {
    const toastElement = document.getElementById('toast');
    toastElement.innerHTML = message;
    toastElement.classList.add('showToast');
    setTimeout(() => {
        toastElement.classList.remove('showToast');
    }, 2000);
}


