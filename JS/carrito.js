
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