document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('username');
    const usernameDisplay = document.getElementById('usernameDisplay');
    let productos = [];

    if (username) {
        usernameDisplay.textContent = username;
    } else {
        window.location.href = '../index.html';
    }

    const mostrarResultados = (resultados) => {
        const contenedor = document.getElementById('resultados');
        contenedor.innerHTML = '';

        if (resultados.length === 0) {
            contenedor.innerHTML = '<p>No se encontraron resultados.</p>';
            return;
        }

        resultados.forEach(producto => {
            const item = document.createElement('div');
            item.className = 'resultadoItem';
            item.innerHTML = `
                <div class="prodouctoInfo">
                    <div class="productoDetalles">
                        <h3>${producto.producto}</h3>
                    </div>
                    <div class="productImagenCont">
                        <div class="productoImagen">
                            <img src="../imagenes/${producto.imagen}" alt="${producto.producto}" class="productoImagen" />
                        </div>
                    </div>
                    <div class="productoDetalles">
                        <div class="productoDimensiones">
                            ${producto.ancho} x ${producto.alto} x ${producto.profundidad} mm
                        </div>
                        <div class="productoColores">
                            <strong>Colores:</strong> ${producto.colores}
                        </div>
                    </div>
                    <div class="productoPresupuestoCont">
                        <div class="productoPresupuesto">
                            <strong>Presupuestar</strong><br>
                            Cantidad:<br>
                            <input class="inputText" type="number" min="1" dataProducto="${producto.producto}" placeholder="Cantidad a imprimir" /><br>
                            <div class="productoPrecios">
                                <strong>Precio Unitario:</strong> <span class="precioUnitario" dataProducto="${producto.producto}">0</span><br>
                                <strong>Total: $</strong> <span class="precio" dataProducto="${producto.producto}">0</span>
                            </div>
                        </div>
                        <div class="guardarBtnCont">
                            <img src="../imagenes/carritoBlanco.svg" alt="Guardar" class="guardarBtn" dataProducto="${producto.producto}" />
                        </div>
                    </div>
                </div>
            `;
            contenedor.appendChild(item);
        });

        document.querySelectorAll('.inputText').forEach(input => {
            input.addEventListener('input', actualizarPrecio);
        });

        document.querySelectorAll('.guardarBtn').forEach(button => {
            button.addEventListener('click', guardarProducto);
        });
    };

    const actualizarPrecio = (event) => {
        const cantidad = parseFloat(event.target.value) || 0;
        const productoNombre = event.target.getAttribute('dataProducto');
        const producto = productos.find(p => p.producto === productoNombre && p.Laboratorio === username);

        if (producto) {
            let precioUnitario = producto.precio1;

            if (cantidad <= 3000) {
                precioUnitario = producto.precio3;
            } else if (cantidad <= 10000) {
                precioUnitario = producto.precio2;
            }

            const precioTotal = precioUnitario * cantidad;
            document.querySelector(`.precioUnitario[dataProducto="${productoNombre}"]`).textContent = precioUnitario.toFixed(2);
            document.querySelector(`.precio[dataProducto="${productoNombre}"]`).textContent = precioTotal.toFixed(2);
        }
    };

    const buscar = () => {
        const nombreBuscado = document.getElementById('busquedaNombre').value.toLowerCase();
        const resultados = productos.filter(producto =>
            producto.producto.toLowerCase().includes(nombreBuscado) &&
            producto.Laboratorio.toLowerCase() === username.toLowerCase()
        );
        mostrarResultados(resultados);
    };

    const mostrarProductos = () => {
        const laboratorioSeleccionado = localStorage.getItem('username');
        if (!laboratorioSeleccionado) {
            alert('No se ha seleccionado ningún laboratorio.');
            return;
        }
        const productosFiltrados = productos.filter(p => p.Laboratorio === laboratorioSeleccionado);
        mostrarResultados(productosFiltrados);
    };

    document.getElementById('buscar').addEventListener('click', buscar);

    // Cambia la forma de llamar a mostrarProductos para evitar el error
    const mostrarButton = document.getElementById('mostrarProductosButton'); // Asegúrate de tener este botón en tu HTML
    if (mostrarButton) {
        mostrarButton.addEventListener('click', mostrarProductos);
    }

    const cargarProductos = async () => {
        try {
            const response = await fetch('../JSON/productos.json');
            if (!response.ok) {
                throw new Error('No se pudo cargar el archivo JSON');
            }
            productos = await response.json();
            mostrarProductos();
        } catch (error) {
            console.error('Error al cargar los productos:', error);
            alert('Hubo un problema al cargar los productos. Por favor, inténtelo de nuevo más tarde.');
        }
    };

    cargarProductos();

    const guardarProducto = (event) => {
        const productoNombre = event.target.getAttribute('dataProducto');
        const cantidad = parseFloat(document.querySelector(`.inputText[dataProducto="${productoNombre}"]`).value) || 0;
        const precioTotal = parseFloat(document.querySelector(`.precio[dataProducto="${productoNombre}"]`).textContent) || 0;

        if (cantidad <= 0) {
            Swal.fire({
                icon: 'error',
                title: 'Cantidad Inválida',
                text: 'La cantidad debe ser mayor que cero.',
            });
            return;
        }

        const productoGuardar = {
            nombre: productoNombre,
            cantidad: cantidad,
            precioTotal: precioTotal
        };

        let productosGuardados = JSON.parse(localStorage.getItem('productosGuardados')) || [];
        productosGuardados.push(productoGuardar);
        localStorage.setItem('productosGuardados', JSON.stringify(productosGuardados));

        Swal.fire({
            icon: 'success',
            title: 'Producto Guardado',
            text: 'El producto ha sido guardado exitosamente.',
        });
    };
});