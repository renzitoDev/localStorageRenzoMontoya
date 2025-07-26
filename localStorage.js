//variables globales
const d = document;
let nombrePro = d.querySelector("#nombrePro");
let precioPro = d.querySelector("#precioPro");
let imagenPro = d.querySelector("#imagenPro");
let descripcionPro = d.querySelector("#descripcionPro");
let btnGuardar = d.querySelector(".btnGuardar");
let tabla = d.querySelector(".table > tbody");

// Variables adicionales para las nuevas funcionalidades
let btnBuscar = d.querySelector("#btnBuscar");
let btnMostrarTodos = d.querySelector("#btnMostrarTodos");
let btnExportarPDF = d.querySelector("#btnExportarPDF");
let buscador = d.querySelector("#buscador");

//validar datos del formulario
btnGuardar.addEventListener("click", ()=>{
    ValidarDatos();
    mostrarDatos();
});
//evento para detectar cuando se recargue la pagina
d.addEventListener("DOMContentLoaded", ()=>{
    mostrarDatos();
});

function ValidarDatos() {
    let producto;
    if ( nombrePro.value && precioPro.value && descripcionPro.value && imagenPro.value ) {
       producto = {
        nombre : nombrePro.value,
        precio : precioPro.value,
        imagen : imagenPro.value,
        descripcion : descripcionPro.value
       }
       //llamar funcion guardarDatos
        guardarDatos( producto );
    }else{
        alert("Todos los campos son Obligatorios");
    }
    //borrar datos del formulario
    nombrePro.value = "";
    precioPro.value = "";
    imagenPro.value = "";
    descripcionPro.value = "";
    //mostar datos en consola
    console.log(producto);
    
}

//funcion para guardar datos en localStorage
function guardarDatos( pro ) {
    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    productos.push( pro );
    //guardar producto en localStorage
    localStorage.setItem("productos", JSON.stringify(productos) );
    alert("productos guardados con exito");
}

//funcion para mostrar los datos guardados en localStorage
function mostrarDatos() {
    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    tabla.innerHTML = ""; // Limpiar tabla
    
    productos.forEach((producto, i) => {
        let fila = d.createElement("tr");
        fila.innerHTML = `
            <td>${producto.nombre}</td>
            <td>$${producto.precio}</td>
            <td><img src="${producto.imagen}" alt="${producto.nombre}" width="50" height="50"></td>
            <td>${producto.descripcion}</td>
            <td>
                <button class="btn-crud btn-editar" onclick="editarProducto(${i})">✏️ Editar</button>
                <button class="btn-crud btn-eliminar" onclick="eliminarProducto(${i})">🗑️ Eliminar</button>
            </td>
        `;
        tabla.appendChild(fila);
    });
}


// Eventos para las nuevas funcionalidades
btnBuscar.addEventListener("click", buscarProductos);
btnMostrarTodos.addEventListener("click", mostrarDatos);
btnExportarPDF.addEventListener("click", exportarPDF);
buscador.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        buscarProductos();
    }
});

// Función para exportar a PDF
function exportarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    
    if (productos.length === 0) {
        alert("No hay productos para exportar");
        return;
    }
    
    // Título del PDF
    doc.setFontSize(18);
    doc.text("Lista de Productos", 20, 20);
    
    // Preparar datos para la tabla
    const columns = ["Nombre", "Precio", "Descripción"];
    const rows = productos.map(producto => [
        producto.nombre,
        `$${producto.precio}`,
        producto.descripcion
    ]);
    
    // Crear tabla
    doc.autoTable({
        head: [columns],
        body: rows,
        startY: 30,
        theme: 'striped',
        styles: {
            fontSize: 10,
            cellPadding: 5
        },
        headStyles: {
            fillColor: [22, 160, 133],
            textColor: 255
        }
    });
    
    // Agregar fecha de generación
    const fecha = new Date().toLocaleDateString();
    doc.setFontSize(10);
    doc.text(`Generado el: ${fecha}`, 20, doc.lastAutoTable.finalY + 20);
    
    // Descargar PDF
    doc.save("lista-productos.pdf");
}