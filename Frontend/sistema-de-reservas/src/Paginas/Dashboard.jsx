import React, { useState, useEffect } from 'react';
import BarraDeNavegacao from './modulos/BarraDeNavegacao.tsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

function Dashboard({ isAdmin }) {
  const [eventos, setEventos] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [reservasAtivas, setReservasAtivas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState('');

  // Função para decodificar o token JWT
  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

  // Função para executar o teste
  const executarTesteUnitario = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/rodar-teste-unitario');
      const data = await response.text();
      console.log(data); // Console para o mostrar o teste
    } catch (error) {
      console.error('Erro ao executar o teste unitário:', error);
    }
  };

  // UseEffect para obter os logs
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/logs');
        const data = await response.text();
        setLogs(data);
      } catch (error) {
        console.error('Erro ao obter logs:', error);
      }
    };

    fetchLogs();
  }, []);

  // UseEffect para obter os dados
  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventosResponse = await fetch('http://127.0.0.1:5000/eventos', { credentials: 'include' });
        const eventosData = await eventosResponse.json();
        setEventos(eventosData);

        // Inicializar reservas para cada evento
        const reservasInicializadas = eventosData.map(evento => ({ evento, reservas: [] }));
        setReservas(reservasInicializadas);

        if (!isAdmin) {
          // Obter o token JWT do Local Storage
          const jwtToken = localStorage.getItem('token');

          const reservasResponse = await fetch('http://127.0.0.1:5000/reservas', {
            credentials: 'include',
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          });

          const reservasData = await reservasResponse.json();
          setReservasAtivas(reservasData);

          // Obter o email do usuário do token JWT
          const decodedToken = parseJwt(jwtToken);
          const emailUsuarioLogado = decodedToken.email;

          // Atualizar reservas do usuário
          setReservas((prevReservas) => {
            const novasReservas = prevReservas.map((prevReserva) => {
              const reservasUsuario = reservasData.filter(
                (reserva) =>
                  reserva.evento.id === prevReserva.evento.id &&
                  reserva.emailUsuario === emailUsuarioLogado
              );

              return {
                evento: prevReserva.evento,
                reservas: reservasUsuario,
              };
            });

            return novasReservas;
          });
        }
      } catch (error) {
        console.error('Erro ao obter dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAdmin]);

  const handleExcluirReserva = async (eventoId, emailUsuario) => {
    try {
      // Requisição para excluir a reserva
      const response = await fetch(`http://127.0.0.1:5000/eventos/${eventoId}/excluir-reserva/${encodeURIComponent(emailUsuario)}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      console.log(data.mensagem);

      // Atualizar a lista de reservas após a exclusão
      setReservas((prevReservas) => {
        const novasReservas = prevReservas.map((prevReserva) => {
          if (prevReserva.evento.id === eventoId) {
            // Atualiza as reservas para o evento específico
            const novasReservasEvento = prevReserva.reservas.filter(reserva => reserva.emailUsuario !== emailUsuario);
            return { ...prevReserva, reservas: novasReservasEvento };
          }
          return prevReserva;
        });

        return novasReservas;
      });
    } catch (error) {
      console.error('Erro ao excluir reserva:', error);
    }
  };

  return (
    <div className="bg-orange-400 min-h-screen w-full flex flex-col items-center justify-center">
      <BarraDeNavegacao />
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6 mt-8">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <h3 className="text-xl font-bold mb-4">Eventos:</h3>
            <ul className="list-disc pl-5">
              {eventos.map(evento => (
                <li key={evento.id}>
                  {evento.nome} - {evento.data} às {evento.horario} ({evento.capacidade} vagas)
                </li>
              ))}
            </ul>

            {/* Admin Page */}
            {isAdmin && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Reservas:</h2>
                {reservasAtivas && reservasAtivas.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {reservasAtivas.map((reserva) => (
                      <li key={`${reserva.evento.id}-${reserva.emailUsuario}`} className="mb-2 flex justify-between items-center">
                        <span>{`${reserva.emailUsuario} - ${reserva.evento.nome}`}</span>
                        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={() => handleExcluirReserva(reserva.evento.id, reserva.emailUsuario)}>
                          Excluir Reserva
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Nenhuma reserva ativa.</p>
                )}
                <div className="mt-8">
                  <h2 className="text-2xl font-bold mb-4">Logs:</h2>
                  {logs.length > 0 ? (
                    <ul className="list-disc pl-5">
                      <a href="http://127.0.0.1:5000/logs" target="_blank" rel="noopener noreferrer" style={{
                        display: 'inline-block',
                        padding: '10px 20px',
                        color: '#fff',
                        backgroundColor: '#007BFF',
                        border: 'none',
                        borderRadius: '4px',
                        textDecoration: 'none',
                        textAlign: 'center',
                        fontSize: '16px',
                      }}>
                        Abrir relatório
                      </a> <br />
                      <button onClick={executarTesteUnitario} style={{
                        display: 'inline-block',
                        padding: '10px 20px',
                        color: '#fff',
                        backgroundColor: '#32CD32',
                        border: 'none',
                        borderRadius: '4px',
                        textDecoration: 'none',
                        textAlign: 'center',
                        fontSize: '14px',
                        marginTop: '10px',
                      }}>
                        Executar Teste Unitário
                      </button>
                    </ul>
                  ) : (
                    <p>Nenhum log disponível.</p>
                  )}
                </div>
              </div>
            )}

            {/* User Page */}
            {!isAdmin && (
              <div className="mt-8">
                {reservas.length > 0 ? (
                  <div>
                    <h2 className="text-1xl font-bold mb-4">Seus Eventos:</h2>
                    <ul className="list-disc pl-5">
                      {reservas.map(({ evento, reservas: reservasEvento }) => (
                        reservasEvento.length > 0 && (
                          <li key={evento.id}>
                            {`${evento.nome} - ${evento.data} às ${evento.horario} (${evento.capacidade} vagas)`} <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                          </li>
                        )
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p>Você ainda não fez reservas em nenhum evento.</p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
