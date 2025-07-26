//variables globales
const d = document;
let nombrePro = d.querySelector("#nombrePro");
let precioPro = d.querySelector("#precioPro");
let imagenPro = d.querySelector("#imagenPro");
let descripcionPro = d.querySelector("#descripcionPro");
let btnGuardar = d.querySelector(".btnGuardar");
let btnCancelar = d.querySelector(".btnCancelar");
let tabla = d.querySelector(".table > tbody");

// Variables adicionales para las nuevas funcionalidades
let btnBuscar = d.querySelector("#btnBuscar");
let btnMostrarTodos = d.querySelector("#btnMostrarTodos");
let btnExportarPDF = d.querySelector("#btnExportarPDF");
let buscador = d.querySelector("#buscador");

// Variables para controlar el modo de edición
let modoEdicion = false;
let indiceEdicion = -1;

//validar datos del formulario
btnGuardar.addEventListener("click", ()=>{
    ValidarDatos();
    mostrarDatos();
});

// Evento para el botón cancelar
btnCancelar.addEventListener("click", () => {
    // Limpiar formulario
    nombrePro.value = "";
    precioPro.value = "";
    imagenPro.value = "";
    descripcionPro.value = "";
    
    resetearModoEdicion();
    btnCancelar.style.display = "none";
});

//evento para detectar cuando se recargue la pagina
d.addEventListener("DOMContentLoaded", ()=>{
    mostrarDatos();
});

// Eventos para las nuevas funcionalidades
btnBuscar.addEventListener("click", buscarProductos);
btnMostrarTodos.addEventListener("click", mostrarDatos);
btnExportarPDF.addEventListener("click", exportarPDF);
buscador.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        buscarProductos();
    }
});

function ValidarDatos() {
    let producto;
    if (nombrePro.value && precioPro.value && descripcionPro.value && imagenPro.value) {
        producto = {
            nombre: nombrePro.value,
            precio: precioPro.value,
            imagen: imagenPro.value,
            descripcion: descripcionPro.value
        }
        
        // Verificar si está en modo edición
        if (modoEdicion) {
            actualizarProducto(indiceEdicion, producto);
        } else {
            //llamar funcion guardarDatos (nuevo producto)
            guardarDatos(producto);
        }
        
        //borrar datos del formulario
        nombrePro.value = "";
        precioPro.value = "";
        imagenPro.value = "";
        descripcionPro.value = "";
        
        // Resetear modo edición
        resetearModoEdicion();
        btnCancelar.style.display = "none";
        
    } else {
        alert("Todos los campos son Obligatorios");
    }
    //mostar datos en consola
    console.log(producto);
}

//funcion para guardar datos en localStorage
function guardarDatos(pro) {
    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    productos.push(pro);
    //guardar producto en localStorage
    localStorage.setItem("productos", JSON.stringify(productos));
    alert("Producto guardado con éxito");
}

// CRUD - Función para actualizar producto
function actualizarProducto(indice, productoActualizado) {
    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    
    // Reemplazar el producto en la posición específica
    productos[indice] = productoActualizado;
    
    localStorage.setItem("productos", JSON.stringify(productos));
    alert("Producto actualizado exitosamente");
    
    mostrarDatos();
}

// Función para resetear el modo edición
function resetearModoEdicion() {
    modoEdicion = false;
    indiceEdicion = -1;
    btnGuardar.textContent = "Guardar Producto";
    btnGuardar.classList.remove("btn-warning");
    btnGuardar.classList.add("btn-primary");
}

//funcion para mostrar los datos guardados en localStorage
function mostrarDatos() {
    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    tabla.innerHTML = ""; // Limpiar tabla
    
    productos.forEach((producto, i) => {
        let fila = d.createElement("tr");
        fila.innerHTML = `
            <td>${i + 1}</td>
            <td>${producto.nombre}</td>
            <td>$${producto.precio}</td>
            <td>${producto.descripcion}</td>
            <td><img src="${producto.imagen}" alt="${producto.nombre}" width="50" height="50" class="img-thumbnail"></td>
            <td>
                <button class="btn btn-sm btn-warning me-1" onclick="editarProducto(${i})">✏️ Editar</button>
                <button class="btn btn-sm btn-danger" onclick="eliminarProducto(${i})">🗑️ Eliminar</button>
            </td>
        `;
        tabla.appendChild(fila);
    });
    
    // Mostrar mensaje si no hay productos
    if (productos.length === 0) {
        let fila = d.createElement("tr");
        fila.innerHTML = `<td colspan="6" class="text-center text-muted">No hay productos registrados</td>`;
        tabla.appendChild(fila);
    }
}

// CRUD - Función para eliminar producto
function eliminarProducto(indice) {
    if (confirm("¿Estás seguro de que quieres eliminar este producto?")) {
        let productos = JSON.parse(localStorage.getItem("productos")) || [];
        productos.splice(indice, 1);
        localStorage.setItem("productos", JSON.stringify(productos));
        mostrarDatos();
        alert("Producto eliminado exitosamente");
    }
}

// CRUD - Función para editar producto
function editarProducto(indice) {
    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    let producto = productos[indice];
    
    // Llenar el formulario con los datos del producto
    nombrePro.value = producto.nombre;
    precioPro.value = producto.precio;
    imagenPro.value = producto.imagen;
    descripcionPro.value = producto.descripcion;
    
    // Activar modo edición
    modoEdicion = true;
    indiceEdicion = indice;
    
    // Cambiar el texto del botón
    btnGuardar.textContent = "Actualizar Producto";
    btnGuardar.classList.remove("btn-primary");
    btnGuardar.classList.add("btn-warning");
    
    // Mostrar botón cancelar
    btnCancelar.style.display = "inline-block";
    
    // Scroll al formulario
    nombrePro.scrollIntoView({ behavior: 'smooth' });
}

// Función de búsqueda
function buscarProductos() {
    const termino = buscador.value.toLowerCase().trim();
    
    if (!termino) {
        mostrarDatos();
        return;
    }
    
    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    let productosFiltrados = productos.filter(producto => 
        producto.nombre.toLowerCase().includes(termino) ||
        producto.descripcion.toLowerCase().includes(termino) ||
        producto.precio.toString().includes(termino)
    );
    
    mostrarProductosFiltrados(productosFiltrados);
}

// Función para mostrar productos filtrados
function mostrarProductosFiltrados(productos) {
    tabla.innerHTML = "";
    
    if (productos.length === 0) {
        let fila = d.createElement("tr");
        fila.innerHTML = `<td colspan="6" class="text-center text-muted">No se encontraron productos</td>`;
        tabla.appendChild(fila);
        return;
    }
    
    productos.forEach((producto, i) => {
        // Obtener el índice original del producto
        let todosLosProductos = JSON.parse(localStorage.getItem("productos")) || [];
        let indiceOriginal = todosLosProductos.findIndex(p => 
            p.nombre === producto.nombre && 
            p.precio === producto.precio && 
            p.descripcion === producto.descripcion &&
            p.imagen === producto.imagen
        );
        
        let fila = d.createElement("tr");
        fila.innerHTML = `
            <td>${i + 1}</td>
            <td>${producto.nombre}</td>
            <td>$${producto.precio}</td>
            <td>${producto.descripcion}</td>
            <td><img src="${producto.imagen}" alt="${producto.nombre}" width="50" height="50" class="img-thumbnail"></td>
            <td>
                <button class="btn btn-sm btn-warning me-1" onclick="editarProducto(${indiceOriginal})">✏️ Editar</button>
                <button class="btn btn-sm btn-danger" onclick="eliminarProducto(${indiceOriginal})">🗑️ Eliminar</button>
            </td>
        `;
        tabla.appendChild(fila);
    });
}

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
    const columns = ["#", "Nombre", "Precio", "Descripción"];
    const rows = productos.map((producto, i) => [
        i + 1,
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
