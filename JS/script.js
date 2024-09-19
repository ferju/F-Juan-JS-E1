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
            const response = await fetch('../JSON/productos.json'); // Adjust this path as necessary
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


document.addEventListener('DOMContentLoaded', () => {
    const contenedorGuardados = document.getElementById('contenedorGuardados');
    const totalPrecioElement = document.getElementById('totalPrecio');
    const confirmarCompraButton = document.getElementById('confirmarCompra');

    const mostrarProductosGuardados = () => {
        const productosGuardados = JSON.parse(localStorage.getItem('productosGuardados')) || [];

        if (productosGuardados.length === 0) {
            contenedorGuardados.innerHTML = '<p>No hay productos guardados.</p>';
            totalPrecioElement.textContent = 'Total Precio: $0.00';
            return;
        }

        let totalPrecio = 0;

contenedorGuardados.innerHTML = '';
productosGuardados.forEach((producto, index) => {
    const item = document.createElement('div');
    item.className = 'productoGuardado';
    item.innerHTML = `
        <div class="productoContent">
            <div class="productoInfo">
                <h3>${producto.nombre}</h3>
                <strong>Cantidad:</strong> ${producto.cantidad}<br>
                <strong>Precio Total:</strong> ${producto.precioTotal.toFixed(2)}<br>
            </div>
            <img src="../imagenes/tacho.svg" alt="Eliminar" class="eliminarImg" data-index="${index}">
        </div>
    `;
    contenedorGuardados.appendChild(item);

    totalPrecio += producto.precioTotal;
});

totalPrecioElement.textContent = `Total Precio: $${totalPrecio.toFixed(2)}`;

document.querySelectorAll('.eliminarImg').forEach(img => {
    img.addEventListener('click', eliminarProducto);
});
    };

    const eliminarProducto = async (event) => {
        const index = parseInt(event.target.getAttribute('data-index'), 10);

        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Quieres eliminar este producto del carrito?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            let productosGuardados = JSON.parse(localStorage.getItem('productosGuardados')) || [];

            productosGuardados.splice(index, 1);

            localStorage.setItem('productosGuardados', JSON.stringify(productosGuardados));

            mostrarProductosGuardados();

            Swal.fire(
                'Eliminado',
                'El producto ha sido eliminado del carrito.',
                'success'
            );
        }
    };

    const confirmarCompra = async () => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Deseas confirmar la compra?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, confirmar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            Swal.fire(
                'Compra Confirmada',
                'La compra se ha realizado exitosamente.',
                'success'
            );

            localStorage.removeItem('productosGuardados');

            mostrarProductosGuardados();
        }
    };

    confirmarCompraButton.addEventListener('click', confirmarCompra);

    mostrarProductosGuardados();
});