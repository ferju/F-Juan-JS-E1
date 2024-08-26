const users = [
    { lab: 'GBT', password: '123456' },
    { lab: 'Knight', password: '654321' },
    { lab: 'Rafo', password: '987654' }
];

document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const username = document.getElementById('usLaboratorio').value;
    const password = document.getElementById('contraseña').value;
    const errorMessage = document.getElementById('error-message');

    errorMessage.textContent = '';

    const usuarioLab = users.find(user => user.lab === username && user.password === password);

    if (usuarioLab) {
        localStorage.setItem('username', username);
        window.location.href = 'paginas/cliente.html';
    } else {
        errorMessage.textContent = 'Usuario o contraseña incorrectos.';
    }
});






