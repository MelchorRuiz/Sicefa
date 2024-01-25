
var empleados = [];

// sirve para guardar el empleado que se seleciona
var indiceEmpleadoSeleccionado;

// variables globales de los inputs
var nombre;
var a_paterno;
var a_materno;
var genero;
var fecha_nacimiento;
var rfc;
var curp;
var domicilio;
var codigo_postal;
var ciudad;
var estado;
var telefono;
var fecha_ingreso;
var puesto;
var salario;
var email;
var codigo;
var nombreUsuario;
var contrasenia;
var rol;
var activo;
var data;
var previewImage;

// Funcion de inicio
export function añadirCampos(){
    
    // Obtiene lis elementos del DOM y los guarda en variables
    nombre = document.getElementById("nombre");
    a_paterno = document.getElementById("a_paterno");
    a_materno = document.getElementById("a_materno");
    genero = document.getElementById("genero");
    fecha_nacimiento = document.getElementById("fecha_nacimiento");
    rfc = document.getElementById("rfc");
    curp = document.getElementById("curp");
    domicilio = document.getElementById("domicilio");
    codigo_postal = document.getElementById("codigo-postal");
    ciudad = document.getElementById("ciudad");
    estado = document.getElementById("estado");
    telefono = document.getElementById("telefono");
    fecha_ingreso = document.getElementById("fecha_ingreso");
    puesto = document.getElementById("puesto");
    salario = document.getElementById("salario");
    email = document.getElementById("email");
    codigo = document.getElementById("codigo");
    nombreUsuario = document.getElementById("nombreUsuario");
    contrasenia = document.getElementById("contrasenia");
    rol = document.getElementById("rol");
    activo = document.getElementById("activo");
    data = document.getElementById("txtData");
    previewImage = document.getElementById("previewImage");

    // Limpiar inputs
    cleanInputs();
    
    // Caragar datos desde la bd
    fetch("../api/restempleado/getall")
    .then(response => {
        return response.json();
    }).then(
        function(jsondata){
            empleados = jsondata;
            loadTable();
        }
    );
}

export function addEmpleado(){
    // Recuperar datos de los inputs y asignarlos a su valor correspondiente
    let empleado = {
        "puesto": puesto.value,
        "email": email.value,
        "salarioBruto": salario.value,
        "persona": {
            "nombre": nombre.value,
            "apellidoPaterno": a_paterno.value,
            "apellidoMaterno": a_materno.value,
            "genero": genero.value,
            "fechaNacimiento": parseDate(fecha_nacimiento.value),
            "rfc": rfc.value,
            "curp": curp.value,
            "domicilio": domicilio.value,
            "codigoPostal": codigo_postal.value,
            "ciudad": ciudad.value,
            "estado": estado.value,
            "telefono": telefono.value,
            "foto": data.value
        },
        "usuario": {
            "nombreUsuario": nombreUsuario.value,
            "contrasenia": contrasenia.value,
            "rol": rol.value
        },
        "sucursal": {
            "nombre": getCookie("sucursal")
        }
    };

    console.log(empleado);

    // Añadir sucursal a la BD
    const params = {e: JSON.stringify(empleado)};
    
    const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: new URLSearchParams(params)
    };
    
    fetch("../api/restempleado/insert", options)
    .then(response => response.json())
    .then(response => {
        console.log(response);
        // Añadir sucursal al arreglo
        empleados.push(empleado);
        // Cargar Tabla
        añadirCampos();
        // Aplicar filtro de busqueda
        searchEmpleado();
        // Borrar texto del los inputs
        cleanInputs();
        if (response.error){
            toastr["error"]("Empleado no agregado correctamente", "Operacion Fallida");
        } else {
            toastr["success"]("Empleado agregado correctamente", "Operacion Exitosa");
        }
        
        // Estableser el indice seleccionado en nulo,
        // Por si tenia algun valor
        indiceEmpleadoSeleccionado = null;
        closeModal();
    });
}


export function selectEmpleado(index){

    let empleado = empleados[index]

    nombre.value = empleado.persona.nombre;
    a_paterno.value = empleado.persona.apellidoPaterno;
    a_materno.value = empleado.persona.apellidoMaterno;
    genero.value = empleado.persona.genero;
    fecha_nacimiento.value = empleado.persona.fechaNacimiento;
    puesto.value = empleado.puesto;
    salario.value = empleado.salarioBruto;
    rfc.value = empleado.persona.rfc;
    curp.value = empleado.persona.curp;
    telefono.value = empleado.persona.telefono;
    fecha_ingreso.value = empleado.fechaIngreso;
    estado.value = empleado.persona.estado;
    ciudad.value = empleado.persona.ciudad;
    codigo_postal.value = empleado.persona.codigoPostal;
    domicilio.value = empleado.persona.domicilio;
    email.value = empleado.email;
    codigo.value = empleado.codigo;
    nombreUsuario.value = empleado.usuario.nombreUsuario;
    contrasenia.value = empleado.usuario.contrasenia;
    rol.value = empleado.usuario.rol;

    if (empleado.persona.foto === ""){
        data.value = "";
        previewImage.src = '../img/placeholderPerson.png';
    } else {
        data.value = empleado.persona.foto;
        previewImage.src = empleado.persona.foto;
    }

    let deleteButton = document.getElementById("deleteButton");
    if (empleado.activo === 1){
        let html = '<i class="fa-solid fa-circle-minus"></i> <span>Eliminar</span>'
        activo.value = "Activo";
        deleteButton.onclick = controller.deleteEmpleado;
        deleteButton.innerHTML = html;
    } else {
        let html = '<i class="fa-solid fa-circle-check"></i> <span>Reactivar</span>'
        activo.value = "Inactivo";
        deleteButton.onclick = controller.reactivateEmpleado;
        deleteButton.innerHTML = html;
    }

    indiceEmpleadoSeleccionado = index;
    showModalEdit();
}
export function reactivateEmpleado(){
    // Reactivar en la bd
    fetch("../api/restempleado/reactivate?idE=" + empleados[indiceEmpleadoSeleccionado].idEmpleado)
    .then(response => {
        return response.json();
    }).then(
        function(jsondata){
            // Cambiar el estatus de la sucursal seleccionada a 1
            empleados[indiceEmpleadoSeleccionado].activo = 1;
            console.log(jsondata)
            // Establecer el valor del indice seleccionado en nulo
            indiceEmpleadoSeleccionado = null;
            // Cargar Tabla
            loadTable();
            // Aplicar filtro de busqueda
            searchEmpleado();
            // Borrar texto del los inputs
            cleanInputs();
            let deleteButton = document.getElementById("deleteButton");
            let html = '<i class="fa-solid fa-circle"></i> <span>-</span>';
            deleteButton.onclick = null;
            deleteButton.innerHTML = html;
            toastr["success"]("Empleado reactivado correctamente", "Operacion Exitosa");
            closeModal();
        }
    ); 
}
export function deleteEmpleado(){
    // Eliminar en la bd
    fetch("../api/restempleado/delete?idE=" + empleados[indiceEmpleadoSeleccionado].idEmpleado)
    .then(response => {
        return response.json();
    }).then(
        function(jsondata){
            // Cambiar el estatus de la sucursal seleccionada a 0
            empleados[indiceEmpleadoSeleccionado].activo = 0;
            console.log(jsondata)
            // Establecer el valor del indice seleccionado en nulo
            indiceEmpleadoSeleccionado = null;
            // Cargar Tabla
            loadTable();
            // Aplicar filtro de busqueda
            searchEmpleado();
            // Borrar texto del los inputs
            cleanInputs();
            let deleteButton = document.getElementById("deleteButton");
            let html = '<i class="fa-solid fa-circle"></i> <span>-</span>';
            deleteButton.onclick = null;
            deleteButton.innerHTML = html;
            toastr["info"]("Empleado eliminado correctamente", "Operacion Exitosa");
            closeModal();
        }
    );
}

export function editEmpleado(){
    // Recuperar datos de los inputs y asignarlos a su valor correspondiente
    let empleado = {
        "idEmpleado": empleados[indiceEmpleadoSeleccionado].idEmpleado,
        "codigo": empleados[indiceEmpleadoSeleccionado].codigo,
        "fechaIngreso": parseDate(fecha_ingreso.value),
        "puesto": puesto.value,
        "email": email.value,
        "salarioBruto": salario.value,
        "activo": empleados[indiceEmpleadoSeleccionado].activo,
        "persona": {
            "idPersona": empleados[indiceEmpleadoSeleccionado].persona.idPersona,
            "nombre": nombre.value,
            "apellidoPaterno": a_paterno.value,
            "apellidoMaterno": a_materno.value,
            "genero": genero.value,
            "fechaNacimiento": parseDate(fecha_nacimiento.value),
            "rfc": rfc.value,
            "curp": curp.value,
            "domicilio": domicilio.value,
            "codigoPostal": codigo_postal.value,
            "ciudad": ciudad.value,
            "estado": estado.value,
            "telefono": telefono.value,
            "foto": data.value
        },
        "usuario": {
            "idUsuario": empleados[indiceEmpleadoSeleccionado].usuario.idUsuario,
            "nombreUsuario": nombreUsuario.value,
            "contrasenia": contrasenia.value,
            "rol": rol.value
        },
        "sucursal": {
            "nombre": getCookie("sucursal")
        }
    };


    // Añadir sucursal a la BD
    const params = {e: JSON.stringify(empleado)};
    
    const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: new URLSearchParams(params)
    };
    
    fetch("../api/restempleado/edit", options)
    .then(response => response.json())
    .then(response => {
        console.log(response);
        // Añadir sucursal al arreglo
        empleados[indiceEmpleadoSeleccionado] = empleado;
        // Cargar Tabla
        loadTable();
        // Aplicar filtro de busqueda
        searchEmpleado();

        empleados[indiceEmpleadoSeleccionado].persona.fechaNacimiento = fecha_nacimiento.value;
        empleados[indiceEmpleadoSeleccionado].fechaIngreso = fecha_ingreso.value;
        // Borrar texto del los inputs
        cleanInputs();
        toastr["success"]("Empleado modificado correctamente", "Operacion Exitosa");
        // Estableser el indice seleccionado en nulo,
        // Por si tenia algun valor
        indiceEmpleadoSeleccionado = null;
        closeModal();
    });

}

function cleanInputs(){
    nombre.value = "";
    a_paterno.value = "";
    a_materno.value = "";
    genero.value = "";
    fecha_nacimiento.value = "";
    rfc.value = "";
    curp.value = "";
    telefono.value = "";
    estado.value = "";
    ciudad.value = "";
    codigo_postal.value = "";
    domicilio.value = "";
    fecha_ingreso.value = "";
    puesto.value = "";
    salario.value = "";
    email.value = "";
    codigo.value = "";
    nombreUsuario.value = "";
    contrasenia.value = "";
    rol.value = "";
    activo.value = "";
    data.value = "";
    previewImage.src = "../img/placeholderPerson.png";
}

export function searchEmpleado(){
    // Traer texto a buscar en minusculas para que la busqueda se indistinta de mayusculas o minuculas
    let textToSeach = document.querySelector("input[type='search']").value.toLowerCase();
    // Encontrar todas las filas que se encuentran en el tbody "tblSucursal"
    let tbody = document.getElementById("tblEmpleado");
    let rows = tbody.getElementsByTagName("tr");

    // Recorrer cada una de las filas
    for (let i = 0; i < rows.length; i++) {
        // Ocultar la fila con una propiedad CSS
        rows[i].style.display = "none"
        // Obtener todos los td dentro de esa fila
        let celdas = rows[i].getElementsByTagName("td");

        // Recorrer cada tb de la fila
        for (let j = 0; j < celdas.length; j++){

            // Obtener el texto del td en minusculas para que la busqueda se indistinta de mayusculas o minuculas
            let text = celdas[j].textContent.toLowerCase();

            // Verificar si la palabra buscada esta dentro del texto
            if (text.indexOf(textToSeach) > -1){
                // Mostrar la fila
                rows[i].style.display = "table-row"
                // Romper el ciclo
                break;
            }
        }   
    }
}


export function loadTable(){
    let html = "";
    empleados.forEach(function(empleado){

        if ((document.getElementById("mostrar-inactivos").checked || empleado.activo === 1) && empleado.sucursal.nombre === getCookie('sucursal')){
            let registro = 
            "<tr class='row-data' onclick='controller.selectEmpleado(" + empleados.indexOf(empleado) + ")'>" + 
            "<td>" + empleado.codigo +
            "</td><td>" + empleado.persona.nombre + " " + empleado.persona.apellidoPaterno + " " + empleado.persona.apellidoMaterno + 
            "</td><td>" + empleado.puesto +
            "</td><td>" + empleado.salarioBruto +
            "</td></tr>";
            html += registro;
        }
    });
    if (html === ""){
        document.getElementById("tblEmpleado").innerHTML = "<tr><td></td><td></td><td></td><td></td></tr>";
    } else {
        // Insertar el codigo html dentro de la tabla Sucursal
        document.getElementById("tblEmpleado").innerHTML = html;
    }
    searchEmpleado();
}
function getCookie(nombre) {
    var nombreCookie = nombre + "=";
    var arrayCookies = document.cookie.split(';');
    
    for (var i = 0; i < arrayCookies.length; i++) {
        var cookie = arrayCookies[i].trim();
        
        if (cookie.indexOf(nombreCookie) === 0) {
            return cookie.substring(nombreCookie.length, cookie.length);
        }
    }
    
    return " "; // Si no se encuentra la cookie
}


// Necesario para ingresar fecha a la bd
function parseDate(date){
    let newDate = "";
    newDate += date.substring(8,10);
    newDate += "/";
    newDate += date.substring(5,7);
    newDate += "/";
    newDate += date.substring(0,4);
    
    return newDate;
}
export function loadImage(){
    let inputImage = document.getElementById("txtFoto");
    if(inputImage.files && inputImage.files[0]){
        let reader = new FileReader();
        reader.onload = function(e) {
            let fotoB64 = e.target.result;
            document.getElementById("previewImage").src = fotoB64;
            document.getElementById("txtData").value = fotoB64;
        };
        
        reader.readAsDataURL(inputImage.files[0]);
    }
}
export function showModal(){
    const buttons = document.querySelectorAll("#buttons button") 

    cleanInputs();
    const modal = document.querySelector(".left");
    if (modal) {
        modal.style.visibility = "visible";
        buttons[0].disabled = false;
        buttons[1].disabled = true;
        buttons[2].disabled = true;
    }
}
export function showModalEdit(){
    const buttons = document.querySelectorAll("#buttons button");
    console.log(buttons);

    const modal = document.querySelector(".left");
    if (modal) {
        modal.style.visibility = "visible";
        buttons[0].disabled = true;
        buttons[1].disabled = false;
        buttons[2].disabled = false;
    }
}
function closeModal(){
    const modal = document.querySelector(".left");
    if (modal) {
        modal.style.visibility = "hidden";
    }
}