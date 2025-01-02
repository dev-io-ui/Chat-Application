async function handleLogin(e){
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    const emailError = document.getElementById('emailError');
    emailError.textContent = '';

    if ( !email || !password) {
        alert('Please fill in all fields.');
        return;
    }

    // const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    // if (!emailPattern.test(email)) {
    //     emailError.textContent = 'Please enter a valid email.';
    //     return;
    // }

    const userData = {
        email,
        password,
    };

    try {
        const response = await axios.post('http://localhost:3000/user/login', userData);

        if (response.status === 200) {
            localStorage.setItem("token", result.data.token);
            alert('Login successful!');
            // window.location.href = './homePage.html';
            console.log('User Login:', response.data);
        } else {
            alert('Something went wrong. Please try again.');
        }
    } catch (error) {
        console.error('Error during signup:', error);
        alert('Error: Unable to complete signup. Please try again later.');
    }
}

document.getElementById('loginForm').addEventListener("submit",handleLogin);