const SignUp = () => {
    const url = "https://mahmoudd123.pythonanywhere.com/user/signup/";
        const token = localStorage.getItem('token');

    const headers = {
        "Content-Type": "application/json",
        'Authorization': `Token ${token}`
    };
    const body = {
        username: "",
        email: "",
        password: ""
    };
    const handleSignUp = () => {
        const username = document.querySelector('input[type="text"]').value;
        const email = document.querySelector('input[type="email"]').value;
        const password = document.querySelector('input[type="password"]').value;

        body.username = username;
        body.email = email;
        body.password = password;

        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, email, password })
        })
        .then(async response => {
            const data = await response.json();
            if (response.ok && data.success) {
                alert("Sign Up Successful!");
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', data.username);
                window.location.href = "/";
            } else {
                alert("Sign Up Failed: " + (data.errors ? JSON.stringify(data.errors) : data.message));
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("An error occurred during sign up.");
        });
    }


    return (
        <div className="signup">
            <h1>Sign Up</h1>
            <input required type="text" placeholder="Username" />
            <input required type="email" placeholder="Email" />
            <input required type="password" placeholder="Password" />
            <button onClick={handleSignUp} >Sign Up</button>
            <p>Already have an account? <a href="/signin">Sign In</a></p>
        </div>
    );
}
 
export default SignUp;