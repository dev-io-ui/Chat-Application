async function handleSignUp(e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value.trim();

    const emailError = document.getElementById('emailError');
    emailError.textContent = '';

    if (!name || !email || !phone || !password) {
        alert('Please fill in all fields.');
        return;
    }

    // const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    // if (!emailPattern.test(email)) {
    //     emailError.textContent = 'Please enter a valid email.';
    //     return;
    // }

    const userData = {
        name,
        email,
        phone,
        password,
    };

    try {
        const response = await axios.post('http://localhost:4000/user/sign-up', userData);
       
        if (response.status === 201) {
            alert("sign-up successfully");
            window.location.href = './login.html';
            console.log('User created:', response.data);
        } else {
            alert('Something went wrong. Please try again.');
        }
    } catch (error) {
        console.error('Error during signup:', error);
        alert('Error: Unable to complete signup. Please try again later.');
    }
}

async function goToLogin() {
    window.location.href = './login.html';
}

document.getElementById('signupForm').addEventListener("submit",handleSignUp);
document.getElementById('goToLogin').addEventListener("click",goToLogin);