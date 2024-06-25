document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;


    if (username === '104' && password === '1234') {
        alert('登入成功');
        localStorage.setItem('loggedInUsername', username);
        window.location.href = 'announcement.html';
    } else {
        alert('房號或密碼錯誤');
    }
});




