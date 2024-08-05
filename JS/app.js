let listaProductos = [];

// Agregar
function agregarProducto() {
    let nombreProducto = prompt("Ingrese el nombre del producto:");
    let cantidadProducto = prompt("Ingrese la cantidad del producto:");

    if (isNaN(cantidadProducto) || cantidadProducto.trim() === "") {
        alert("La cantidad debe ser un número válido.");
        return;
    }

    cantidadProducto = parseFloat(cantidadProducto);

   listaProductos.push({ nombre: nombreProducto, cantidad: cantidadProducto });

    alert(`Producto "${nombreProducto}" con cantidad de ${cantidadProducto} añadida.`);
}

// Eliminar
function eliminarProducto() {
    let index = parseInt(prompt('Introduce el índice del producto a eliminar:'), 10);

    if (isNaN(index) || index < 1 || index > listaProductos.length) {
        alert('Índice inválido.');
    } else {
        let eliminarProd = listaProductos.splice(index - 1, 1)[0];
        alert(`Producto eliminado: ${eliminarProd.nombre} - Cantidad: ${eliminarProd.cantidad}`);
    }
}

// MOstrar - suma
function mostrarListaProductos() {
    if (listaProductos.length === 0) {
        alert("No hay productos en la lista.");
        return;
    }

    let mensaje = "Lista de productos:\n";
    let sumaCantidades = 0;

    listaProductos.forEach((producto, index) => {
        mensaje += `${index + 1}. ${producto.nombre} - Cantidad: ${producto.cantidad}\n`;
        sumaCantidades += producto.cantidad;
    });

    mensaje += `\nCantidad total de productos: ${sumaCantidades}`;

    alert(mensaje);
}

while (true) {
    let accion = prompt("¿Qué desea hacer? Indique el número de la opción deseada\n1. Agregar un producto\n2. Eliminar producto de la lista\n3. Mostrar lista de productos\n4. Salir");

    switch (accion) {
        case "1":
            agregarProducto();
            break;
        case "2":
            eliminarProducto();
            break;
        case "3":
            mostrarListaProductos();
            break;
        case "4":
            alert("Saliendo...");
            break;
        default:
            alert("Opción no válida. Intente de nuevo.");
    }

    if (accion === "4") break;
}