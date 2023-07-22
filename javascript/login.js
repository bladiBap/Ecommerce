const MODAL_REGISTER = document.getElementById("modal-register");
const FORM = document.getElementById("form");

const EMAIL = document.getElementById("email");

const NOMBRE = document.getElementById("name");
const APELLIDO = document.getElementById("lastname");
const EMAIL_NEW = document.getElementById("emailNew");

const ES_ADMIN = document.getElementById("soyAdmin");


const password = document.getElementById("password");
const passwordNew = document.getElementById("passwordNew");
const passworsRepNew = document.getElementById("passwordRepet");

const visibility_password = document.getElementById("visibility");
const visibility_passwordNew = document.getElementById("visibilityNew");
const visibility_passwordRepNew = document.getElementById("visibilityRepNew");

const invName = document.getElementById("invName");
const invLastName = document.getElementById("invLastName");
const invEmail = document.getElementById("invEmail");
const invPassNew = document.getElementById("invPassNew");
const invPassRepNew = document.getElementById("invPassNewRepet");

let visibilityPassword = false;
let visibilityPasswordNew = false;
let visibilityPasswordRepNew = false;

let clickLogin = false;
let clickRegister = false;
let booEmail = false;
let booPass = false;
let isValidatePasswordNew = false;
let isValidatePasswordRepNew = false;


EMAIL.addEventListener('input', () => {
    if(!clickLogin){
        return;
    }

    let regexCorreo = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    let email = EMAIL.value.toString() + "";

    if (regexCorreo.test(email)  && email.length > 5 && booPass) {
        document.getElementById("errorLogin").classList.add("disNone");
        booEmail = true;
    } else {
        document.getElementById("errorLogin").classList.remove("disNone");
        booEmail = false;
    }
});

password.addEventListener('input', () => {
    if(!clickLogin){
        return;
    }

    let pass = password.value.toString() + "";
    if (pass.length > 5) {
        document.getElementById("errorLogin").classList.add("disNone");
        booPass = true;
    } else {
        document.getElementById("errorLogin").classList.remove("disNone");
        booPass = false;
    }
});

EMAIL_NEW.addEventListener('input', () => {
    if (!clickRegister) {
        return;
    }

    let regexCorreo = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    let email = EMAIL_NEW.value.toString() + "";

    if (regexCorreo.test(email) && email.length > 5) {
        invEmail.classList.add("disNone");
    } else {
        invEmail.classList.remove("disNone");
    }
});

NOMBRE.addEventListener('input', () => {
    if (!clickRegister) {
        return;
    }
    let regexNombre = /^[a-zA-Z\s]*$/;
    let nombre = NOMBRE.value.toString() + "";
    if (regexNombre.test(nombre) && nombre.length > 2) {
        invName.classList.add("disNone");
    } else {
        invName.classList.remove("disNone");
    }
});

APELLIDO.addEventListener('input', () => {
    if (!clickRegister) {
        return;
    }

    let regexApellido = /^[a-zA-Z\s]*$/;
    let apellido = APELLIDO.value.toString() + "";
    if (regexApellido.test(apellido) &&  apellido.length > 2) {
        invLastName.classList.add("disNone");
    } else {
        invLastName.classList.remove("disNone");
    }

});

passwordNew.addEventListener('input', () => {
    if (!clickRegister) {
        return;
    }
    let pass = passwordNew.value.toString() + "";
    if (pass.length > 5 && document.getElementById("passwordRepet").value.toString()  == pass) {
        invPassNew.classList.add("disNone");
        invPassRepNew.classList.add("disNone");
        isValidatePasswordNew = true;
    } else {
        invPassNew.classList.remove("disNone");
        invPassRepNew.classList.remove("disNone");
        isValidatePasswordNew = false;
    }
});

passworsRepNew.addEventListener('input', () => {
    if (!clickRegister) {
        return;
    }
    let pass = passworsRepNew.value.toString() + "";
    if (pass.length > 5 && document.getElementById("passwordNew").value.toString()  == pass) {
        invPassNew.classList.add("disNone");
        invPassRepNew.classList.add("disNone");
        isValidatePasswordRepNew = true;
    } else {
        invPassNew.classList.remove("disNone");
        invPassRepNew.classList.remove("disNone");
        isValidatePasswordRepNew = false;
    }
});


function openModalRegister() {
    MODAL_REGISTER.classList.add("show-modal");
}

function changeViewPassword(id) {
    if (id == 1) {
        changeViewPasswordByID(visibilityPassword, visibility_password, password);
        visibilityPassword = !visibilityPassword;
        return;
    }
    if (id == 2) {
        changeViewPasswordByID(visibilityPasswordNew, visibility_passwordNew, passwordNew);
        visibilityPasswordNew = !visibilityPasswordNew;
        return;
    }
    if (id == 3) {
        changeViewPasswordByID(visibilityPasswordRepNew, visibility_passwordRepNew, passworsRepNew);
        visibilityPasswordRepNew = !visibilityPasswordRepNew;
        return;
    }
}

function changeViewPasswordByID(visib, elementChange, elementPassowrd) {
    if (!visib) {
        elementChange.innerHTML = 'visibility';
        elementPassowrd.type = 'text';
        return;
    }
    elementChange.innerHTML = 'visibility_off';
    elementPassowrd.type = 'password';
    return;
}

function closeModalRegister() {
    cleanSpanError();
    clearFields();
    MODAL_REGISTER.classList.remove("show-modal");
}

function clearFields() {
    EMAIL_NEW.value = "";
    NOMBRE.value = "";
    APELLIDO.value = "";
    passwordNew.value = "";
    passworsRepNew.value = "";
}

function checkSession() {
    let validate = true;
    if (EMAIL.value == "" || EMAIL.value == null) {
        validate = false;
    }
    if (password.value == "" || password.value == null) {
        validate = false;
    }

    if (validate){
        document.getElementById("errorLogin").classList.add("disNone");
    }else{
        document.getElementById("errorLogin").classList.remove("disNone");
    }

    return validate;
}

function iniciarSesion() {
    clickLogin = true;
    if (!checkSession()) {
        return;
    }
    let email = EMAIL.value;
    let pass = password.value;
    if (ES_ADMIN.checked){
        loginAdmin(email, pass);
        return;
    }
    login(email, pass);
}

const loginAdmin = async (email, password) => {
    const response = await fetch('http://localhost:3000/usuarios/login/admin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "email": email, "password": password })
    });

    if (response.status == 200) {
        window.location.href = '../../Admin/admin.html';
        return;
    }
    if (response.status == 404) {
        showToast("Credenciales de Admin incorrectos");
        return;
    }
};


const login = async (email, password) => {
    const response = await fetch('http://localhost:3000/usuarios/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "email": email, "password": password })
    });

    if (response.status == 200) {
        const data = await response.json();

        localStorage.setItem('id', data.body.idusuario);
        localStorage.setItem('nombre', data.body.nombre);
        localStorage.setItem('apellido', data.body.apellido);
        localStorage.setItem('email', data.body.correo);
        localStorage.setItem('inicioSesion','true');

        window.location.href = '../index.html';
    }
    if (response.status == 404) {
        showToast("Credenciales de cliente incorrectos");
    }
};

const crearNuevoUsuario = async () => {
    let email = EMAIL_NEW.value;
    let passNew = passwordNew.value;
    let passRepNew = passworsRepNew.value;
    let nombre = NOMBRE.value;
    let apellido = APELLIDO.value;

    clickRegister = true;
    if (!checkFields(email, passNew, passRepNew, nombre, apellido)) {
        return;
    }

    const veriEmail = await fetch('http://localhost:3000/usuarios/correo/veri', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "email": email })
    });

    if (veriEmail.status == 200) {
        let respuesta = await veriEmail.json();
        if (respuesta.succes === true) {
            showToast("Correo no disponible");
            return;
        }
    }

    const response = await fetch('http://localhost:3000/usuarios', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "nombre": nombre,
            "apellido": apellido,
            "correo": email,
            "contrasena": passNew
        })
    })

    if (response.status == 200) {
        cleanSpanError();
        clearFields();
        MODAL_REGISTER.classList.remove("show-modal");
        showToast("Usuario creado");
    }
}

function checkFields(email, passNew, passRepNew, nombre, apellido) {

    let isValidate = true;
    if (email == "" || email == null || !validateEmail(email)) {
        isValidate = false;
        invEmail.classList.remove("disNone");
    } else {
        invEmail.classList.add("disNone");
    }

    if (passNew == "" || passNew == null) {
        isValidate = false;
        invPassNew.classList.remove("disNone");
    } else {
        invPassNew.classList.add("disNone");
    }

    if (passRepNew == "" || passRepNew == null) {
        isValidate = false;
        invPassRepNew.classList.remove("disNone");
    } else {
        invPassRepNew.classList.add("disNone");
    }

    if (nombre == "" || nombre == null) {
        isValidate = false;
        invName.classList.remove("disNone");
    } else {
        invName.classList.add("disNone");
    }

    if (apellido == "" || apellido == null) {
        isValidate = false;
        invLastName.classList.remove("disNone");
    } else {
        invLastName.classList.add("disNone");
    }


    return isValidate;
}

function validateEmail(email) {
    let regexCorreo = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    return regexCorreo.test(email);
}

function cleanSpanError(){
    invEmail.classList.add("disNone");
    invPassNew.classList.add("disNone");
    invPassRepNew.classList.add("disNone");
    invName.classList.add("disNone");
    invLastName.classList.add("disNone");
}

function showToast(message) {
    const toastElement = document.getElementById('toast');
    toastElement.innerHTML = message;
    toastElement.classList.add('showToast');
    setTimeout(() => {
        toastElement.classList.remove('showToast');
    }, 2000);
}





