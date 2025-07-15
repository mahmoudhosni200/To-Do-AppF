import React, { useState } from 'react';


const SignIn = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const url = "https://mahmoudd123.pythonanywhere.com/user/login/";
    const token = localStorage.getItem('token');

    const handleSignIn = () =>{
        fetch(url, {
            method: "POST", 
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password })
        })
        .then(async response => {
            const data = await response.json();
            if (response.ok && data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', username);
                alert("Sign In Successful!");
                window.location.href = "/";
            } else {
                alert("Sign In Failed: " + data.message);
            }
        })

        .catch(error => {
            console.error("Error:", error);
            alert("An error occurred during sign in.");
        });
    }
    return (
        <div className="signin">
            <h1>Sign In</h1>
            <input type="text" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
            <button onClick={handleSignIn}>Sign In</button>
            <p>Don't have an account? <a href="/signup">Sign Up</a></p>
        </div>
    );
}
 
export default SignIn;