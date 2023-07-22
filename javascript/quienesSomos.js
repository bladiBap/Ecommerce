
isLogin();
function isLogin() {
    if (localStorage.getItem("inicioSesion") == "true") {
        document.getElementById("withUser").classList.remove("ocultar");
        document.getElementById("withoutUser").classList.add("ocultar");
        return;
    }
    document.getElementById("withUser").classList.add("ocultar");
    document.getElementById("withoutUser").classList.remove("ocultar");

}

function logout() {
    localStorage.setItem("inicioSesion", "false");
    localStorage.setItem("id", "");
    localStorage.setItem("nombre", "");
    localStorage.setItem("apellido", "");
    localStorage.setItem("email", "");
    localStorage.setItem("carrito", "[]");
    window.location.href = '../pages/login.html';
}

function toLogin(){
    window.location.href = '../pages/login.html';
}