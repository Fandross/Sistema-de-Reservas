import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BarraDeNavegacao from './modulos/BarraDeNavegacao.tsx';

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
        console.log('Token recebido:', data.token);
        onLogin(email);
        localStorage.setItem('token', data.token);
        
        alert('Cadastro realizado com sucesso!');
        navigate('/');
      } else {
        alert('Email já cadastrado!');
      }
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
    }
  };

  return (
    <div className="bg-orange-400 min-h-screen flex flex-col items-center justify-center">
      <BarraDeNavegacao />
      <form className="w-full max-w-sm bg-white rounded-lg shadow-md p-6 mt-8">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">Senha:</label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="flex items-center justify-between">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" onClick={handleCadastro}>
            Cadastrar
          </button>
        </div>
      </form>
    </div>
  );
}

export default Cadastro;