import { useState } from "react";
import {setAccessTokenMemory} from "./AuthContext";

const API_URL = "http://localhost:8080/api/v1";

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(API_URL + '/auth/login', {
      method: 'POST',
      credentials: 'include', // önemli
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      const data = await res.json();
      setAccessTokenMemory(data.accessToken);
      setMessage('Login successful');
    } else {
      setMessage('Login failed');
    }
  };

  return (
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
        <button type="submit">Login</button>
        <p>{message}</p>
      </form>
  );
}

export default LoginForm;
