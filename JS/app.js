document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault(); 

    const username = document.getElementById('usLaboratorio').value;
    const password = document.getElementById('contraseña').value;
    const errorMessage = document.getElementById('error-message');

    errorMessage.textContent = '';

    try {
        // Cargar el archivo JSON con fetch
        const response = await fetch('../JSON/usuario.json');
        if (!response.ok) {
            throw new Error('Error al cargar los datos');
        }

        const users = await response.json();

        // Buscar el usuario en los datos cargados
        const usuarioLab = users.find(user => user.lab === username && user.password === password);

        if (usuarioLab) {
            localStorage.setItem('username', username);
            window.location.href = '../paginas/cliente.html';
        } else {
            errorMessage.textContent = 'Usuario o contraseña incorrectos.';
        }
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        errorMessage.textContent = 'Error al procesar la solicitud.';
    }
});