// Login.js
import React, { useState } from 'react';

// Importe useNavigate no lugar de useHistory
import { useNavigate } from 'react-router-dom';

function Login({nomeUsuario, onLogin}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Substitua useHistory por useNavigate
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Autenticação bem-sucedida, atualize o nome do usuário e armazene o token
        console.log('Token recebido:', data.token);
        // onLogin(email);
        localStorage.setItem('token', data.token);
        console.log('Logado!')
        navigate('/home');
      } else {
        // Exiba uma mensagem de erro
        alert(data.mensagem);
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form>
        <label>Email:</label>
        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button type="button" onClick={handleLogin}>
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
