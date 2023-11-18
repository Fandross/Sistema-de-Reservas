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

// Função para verificar e cadastrar o usuário admin
const checkAndCreateAdminUser = async () => {
  try {
    // Verificar se o usuário admin já existe
    const response = await fetch('http://127.0.0.1:5000/usuarios/admin');
    if (!response.ok) {
      // Se não existir, cadastrar o usuário admin com senha 'admin'
      await fetch('http://127.0.0.1:5000/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin',
          password: 'admin',
        }),
      });
    }
  } catch (error) {
    console.error('Erro ao verificar/cadastrar usuário admin:', error);
  }
};

function App() {
  const [backendMessage, setBackendMessage] = useState('');
  const [eventos, setEventos] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [detalhesEvento, setDetalhesEvento] = useState(null);
  const [emailUsuario, setEmailUsuario] = useState('');
  const [registroAberto, setRegistroAberto] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar e cadastrar o usuário admin
    checkAndCreateAdminUser();
    const storedToken = localStorage.getItem('token');
    let userEmail = ""
    if (storedToken) {
      const decodedToken = parseJwt(storedToken);
      let userEmail = decodedToken.email;
      setEmailUsuario(userEmail);
      console.log(userEmail)
      fetch('http://127.0.0.1:5000/', {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${storedToken}`,
        },
      })
        .then(response => response.text())
        .then(message => setBackendMessage(message))
        .catch(error => console.error('Erro ao obter dados do backend:', error));
    }

    setIsAdmin(emailUsuario === 'admin');
    console.log(isAdmin)

    fetch('http://127.0.0.1:5000/eventos', { credentials: 'include' })
      .then(response => response.json())
      .then(data => {
        console.log('Lista de Eventos:', data);
        setEventos(data);
      })
      .catch(error => console.error('Erro ao obter lista de eventos:', error));
  }, [emailUsuario]);


  const handleDetalhesEvento = (eventoId) => {
    fetch(`http://127.0.0.1:5000/eventos/${eventoId}/detalhes`)
      .then(response => response.json())
      .then(data => setDetalhesEvento(data))
      .catch(error => console.error('Erro ao obter detalhes do evento:', error));
  };

  const handleRegistrarEvento = (eventoId, nomeUsuario) => {
    const emailConfirmacao = window.prompt('Digite seu email novamente para confirmar o registro:');

    if (emailConfirmacao !== emailUsuario) {
      alert('Os emails não coincidem. Tente novamente.');
      return;
    }

    fetch(`http://127.0.0.1:5000/eventos/${eventoId}/registrar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        emailUsuario: emailUsuario,
      }),
    })
      .then(response => response.json())
      .then(data => {
        alert(data.mensagem);
        fetch('http://127.0.0.1:5000/eventos')
          .then(response => response.json())
          .then(data => {
            console.log('Lista de Eventos:', data);
            setEventos(data);
          })
          .catch(error => console.error('Erro ao obter lista de eventos:', error));
      })
      .catch(error => console.error('Erro ao registrar no evento:', error));
  };

  const handleExcluirReserva = (eventoId, nomeReserva) => {
    fetch(`http://127.0.0.1:5000/eventos/${eventoId}/excluir-reserva/${encodeURIComponent(nomeReserva)}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(data => {
        alert(data.mensagem);
        handleDetalhesEvento(eventoId);
      })
      .catch(error => console.error('Erro ao excluir reserva:', error));
  };

  return (
    <Router>
      <Routes>
        <Route path="/home" element={
          (
            <div>
              {isAdmin && (
                <div>
                  <h2>Mensagem do Backend:</h2> <p>{backendMessage}</p>
                </div>
              )}

              <header>
                <h1>Espaco das Massas UNP</h1>
              </header>
              <h2>Lista de Eventos:</h2>
              <ul>
                {eventos.map(evento => (
                  <li key={evento.id}>
                    {evento.nome} - {evento.data} às {evento.horario} ({evento.capacidade} vagas)
                    <button onClick={() => handleDetalhesEvento(evento.id)}>Ver Detalhes</button>
                    {!isAdmin && (
                      <button onClick={() => {
                        handleRegistrarEvento(evento.id, emailUsuario);
                        setRegistroAberto(false);
                      }}>Registrar</button>
                    )}
                  </li>
                ))}
              </ul>

              {detalhesEvento && (
                <div>
                  <h2>Detalhes do Evento:</h2>
                  <p>Nome: {detalhesEvento.evento.nome}</p>
                  <p>Data: {detalhesEvento.evento.data}</p>
                  <p>Horário: {detalhesEvento.evento.horario}</p>
                  <p>Capacidade: {detalhesEvento.evento.capacidade}</p>

                  <h3>Reservas:</h3>
                  <ul>
                    {detalhesEvento.reservas.map(reserva => (
                      <li key={reserva.emailUsuario}>
                        {reserva.emailUsuario}{' '}
                        {isAdmin && (
                          <>
                            <button onClick={() => handleExcluirReserva(detalhesEvento.evento.id, reserva.emailUsuario)}>Excluir</button>{' '}
                          </>
                        )}
                        {registroAberto && !isAdmin && (
                          <button onClick={() => {
                            handleRegistrarEvento(detalhesEvento.evento.id, emailUsuario);
                            setRegistroAberto(false);
                          }}>Registrar</button>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </div>
          )
        } />
        <Route path="/cadastro" element={<Cadastro isAdmin={isAdmin} nomeUsuario={emailUsuario} onLogin={setEmailUsuario} setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/login" element={<Login nomeUsuario={emailUsuario} setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/" element={<Home nomeUsuario={emailUsuario} isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/dashboard" element={<Dashboard nomeUsuario={emailUsuario} isAdmin={isAdmin} />} />
      </Routes>
    </Router>
  );
}

export default App;