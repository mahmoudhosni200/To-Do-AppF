import { Link, useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';

const NavBar = () => {
    const history = useHistory();
    const [username, setUsername] = useState(null);

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  window.location.reload();   
}


    return (
       <nav className="navbar">
            <Link to="/">To-Do List App</Link>
            {username ? (
                <>
                <span className="username">Hello, {username}</span>
                <button onClick={handleLogout}>Log Out</button>
                </>
            ) : (
                <button onClick={() => history.push('/signin')}>Sign In</button>
            )}
        </nav>


    );
};

export default NavBar;
