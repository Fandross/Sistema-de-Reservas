import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from "./Paginas/Home.tsx"
import Login from './Paginas/Login.jsx'
import Cadastro from './Paginas/Cadastro.tsx';
import Dashboard from './Paginas/Dashboard.jsx';

function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(window.atob(base64));
}

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [emailUsuario, setEmailUsuario] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      const decodedToken = parseJwt(storedToken);
      let userEmail = decodedToken.email;
      setEmailUsuario(userEmail);
      console.log('Usuario logado como: ', userEmail);
      fetch('http://127.0.0.1:5000/', {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${storedToken}`,
        },
      })
        .then(response => response.text())
        .catch(error => console.error('Erro ao obter dados do backend:', error));
    }

    setIsAdmin(emailUsuario === 'admin');
    console.log('O usuario é um administrador? ', isAdmin);
  }, [emailUsuario, isAdmin]); // Adicionado isAdmin à lista de dependências

  return (
    <Router>
      <Routes>
        <Route path="/cadastro" element={<Cadastro isAdmin={isAdmin} nomeUsuario={emailUsuario} onLogin={setEmailUsuario} setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/login" element={<Login nomeUsuario={emailUsuario} setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/" element={<Home nomeUsuario={emailUsuario} isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/dashboard" element={<Dashboard nomeUsuario={emailUsuario} isAdmin={isAdmin} />} />
      </Routes>
    </Router>
  );
}

export default App;