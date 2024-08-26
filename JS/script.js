const productos = [
    { Laboratorio: 'GBT', producto: 'Leprid', ancho: '40', alto: '85', profundidad: '40', colores: '2', precio1: 200, precio2: 300, precio3: 400, imagen: 'EST-DOLUFEVIR.png' },
    { Laboratorio: 'GBT', producto: 'Ladevina 5', ancho: '40', alto: '85', profundidad: '40', colores: '2', precio1: 200, precio2: 300, precio3: 400, imagen: 'EST-DOLUFEVIR.png' },
    { Laboratorio: 'GBT', producto: 'Ladevina 10', ancho: '40', alto: '85', profundidad: '40', colores: '2', precio1: 200, precio2: 300, precio3: 400, imagen: 'EST-DOLUFEVIR.png' },
    { Laboratorio: 'GBT', producto: 'Ladevina 15', ancho: '40', alto: '85', profundidad: '40', colores: '2', precio1: 200, precio2: 300, precio3: 400, imagen: 'EST-DOLUFEVIR.png' },
    { Laboratorio: 'GBT', producto: 'Ladevina 25', ancho: '40', alto: '85', profundidad: '40', colores: '2', precio1: 200, precio2: 300, precio3: 400, imagen: 'EST-DOLUFEVIR.png' },
    { Laboratorio: 'GBT', producto: 'Karfib', ancho: '40', alto: '85', profundidad: '40', colores: '2', precio1: 200, precio2: 300, precio3: 400, imagen: 'EST-DOLUFEVIR.png' },
    { Laboratorio: 'GBT', producto: 'Leucocalcín', ancho: '40', alto: '85', profundidad: '40', colores: '2', precio1: 200, precio2: 300, precio3: 400, imagen: 'EST-DOLUFEVIR.png' },
    { Laboratorio: 'GBT', producto: 'Rembre', ancho: '40', alto: '85', profundidad: '40', colores: '2', precio1: 200, precio2: 300, precio3: 400, imagen: 'EST-DOLUFEVIR.png' },
    { Laboratorio: 'Knight', producto: 'Leprid', ancho: '40', alto: '85', profundidad: '40', colores: '2', precio1: 200, precio2: 300, precio3: 400, imagen: 'EST-DOLUFEVIR.png' },
    { Laboratorio: 'Knight', producto: 'Ladevina 5', ancho: '40', alto: '85', profundidad: '40', colores: '2', precio1: 200, precio2: 300, precio3: 400, imagen: 'EST-DOLUFEVIR.png' },
    { Laboratorio: 'Knight', producto: 'Karfib', ancho: '40', alto: '85', profundidad: '40', colores: '2', precio1: 200, precio2: 300, precio3: 400, imagen: 'EST-DOLUFEVIR.png' },
    { Laboratorio: 'Knight', producto: 'Rembre', ancho: '40', alto: '85', profundidad: '40', colores: '2', precio1: 200, precio2: 300, precio3: 400, imagen: 'EST-DOLUFEVIR.png' }
];

document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('username');
    const usernameDisplay = document.getElementById('username-display');

    if (username) {
        usernameDisplay.textContent = username;
    } else {
        window.location.href = '../index.html';
    }

    function mostrarResultados(resultados) {
        const contenedor = document.getElementById('resultados');
        contenedor.innerHTML = '';

        if (resultados.length === 0) {
            contenedor.innerHTML = '<p>No se encontraron resultados.</p>';
            return;
        }

        resultados.forEach(producto => {
            const item = document.createElement('div');
            item.className = 'resultado-item';
            item.innerHTML = `
                <div class="producto-info">
                  <div class="producto-imagen">  <img src="../imagenes/${producto.imagen}" alt="${producto.producto}" class="producto-imagen" /> <br></div>
                    <strong>Nombre:</strong> ${producto.producto} <br>
                    <strong>Dimensiones:</strong> ${producto.ancho} x ${producto.alto} x ${producto.profundidad} <br>
                    <strong>Colores:</strong> ${producto.colores} <br>
                    <strong>Presupuestar</strong> <br>
                    Cantidad:<br> <input class="input-text" type="text" data-producto="${producto.producto}" placeholder="Cantidad a imprimir" /><br>
                    <strong>Precio Unitario:</strong> <span class="precio-unitario" data-producto="${producto.producto}">0</span><br>
                    <strong>Precio Total:</strong> <span class="precio" data-producto="${producto.producto}">0</span><br>
                </div>
            `;
            contenedor.appendChild(item);
        });

        document.querySelectorAll('.input-text').forEach(input => {
            input.addEventListener('input', actualizarPrecio);
        });
    }

    function actualizarPrecio(event) {
        const cantidad = parseFloat(event.target.value) || 0;
        const productoNombre = event.target.getAttribute('data-producto');
        const producto = productos.find(p => p.producto === productoNombre && p.Laboratorio === username);

        if (producto) {
            let precioUnitario;

            if (cantidad <= 3000) {
                precioUnitario = producto.precio3;
            } else if (cantidad <= 10000) {
                precioUnitario = producto.precio2;
            } else {
                precioUnitario = producto.precio1;
            }

            const precioTotal = precioUnitario * cantidad;
            const precioUnitarioElemento = document.querySelector(`.precio-unitario[data-producto="${productoNombre}"]`);
            const precioElemento = document.querySelector(`.precio[data-producto="${productoNombre}"]`);

            if (precioUnitarioElemento) {
                precioUnitarioElemento.textContent = precioUnitario.toFixed(2);
            }
            if (precioElemento) {
                precioElemento.textContent = precioTotal.toFixed(2);
            }
        }
    }

    function buscar() {
        const nombreBuscado = document.getElementById('busqueda-nombre').value.toLowerCase();
        const resultados = productos.filter(producto => {
            const nombreCoincide = producto.producto.toLowerCase().includes(nombreBuscado);
            const labCoincide = username ? producto.Laboratorio.toLowerCase() === username.toLowerCase() : true;
            return nombreCoincide && labCoincide;
        });
        mostrarResultados(resultados);
    }

    document.getElementById('buscar').addEventListener('click', buscar);

    function mostrarProductos() {
        const laboratorioSeleccionado = localStorage.getItem('username');
        if (!laboratorioSeleccionado) {
            alert('No se ha seleccionado ningún laboratorio.');
            return;
        }
        const productosFiltrados = productos.filter(p => p.Laboratorio === laboratorioSeleccionado);
        mostrarResultados(productosFiltrados);
    }

    document.querySelector('button[onclick="mostrarProductos()"]').addEventListener('click', mostrarProductos);
});