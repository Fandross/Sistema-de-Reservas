// Cadastro.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Cadastro({ isAdmin, nomeUsuario, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const handleCadastro = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/cadastro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Se o cadastro for bem-sucedido, atualize o nome do usuário e armazene o token

        console.log('Token recebido:', data.token);
        onLogin(email);
        localStorage.setItem('token', data.token);
        
        alert('Cadastro realizado com sucesso!');
        navigate('/home');
      } else {
        alert('Email já cadastrado!');
      }
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
    }
  };
  

  console.log(isAdmin);

  return (
    <div>
      {isAdmin && <div>Administrador Logado! {nomeUsuario}</div>}

      <div>{nomeUsuario}</div>

      <h2>Cadastro</h2>
      <form>
        <label>Email:</label>
        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button type="button" onClick={handleCadastro}>
          Cadastrar
        </button>
      </form>
    </div>
  );
}

export default Cadastro;
