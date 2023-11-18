import React, { useState, useEffect } from 'react';

function Dashboard({ isAdmin }) {
  const [eventos, setEventos] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [reservasAtivas, setReservasAtivas] = useState([]);

  // Função para decodificar o token JWT
  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    const carregarEventos = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/eventos', { credentials: 'include' });
        const data = await response.json();
        setEventos(data);

        // Inicializar reservas para cada evento
        const reservasInicializadas = data.map(evento => ({ evento, reservas: [] }));
        setReservas(reservasInicializadas);
      } catch (error) {
        console.error('Erro ao obter lista de eventos:', error);
      }
    };

    // Carregar a lista de eventos
    carregarEventos();
  }, []); // Sem dependências, executará apenas uma vez ao montar o componente

  useEffect(() => {
    if (!isAdmin) {
      const carregarReservasUsuario = async () => {
        try {
          // Obter o token JWT do Local Storage
          const jwtToken = localStorage.getItem('token');
          console.log('Token JWT:', jwtToken);

          const response = await fetch('http://127.0.0.1:5000/reservas', {
            credentials: 'include',
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          });

          const data = await response.json();
          console.log('Reservas do usuário:', data);
          setReservasAtivas(data);

          // Obter o email do usuário do token JWT
          const decodedToken = parseJwt(jwtToken);
          const emailUsuarioLogado = decodedToken.email;
          console.log('Email do usuário logado:', emailUsuarioLogado);

          // Atualizar reservas do usuário
          setReservas((prevReservas) => {
            const novasReservas = prevReservas.map((prevReserva) => {
              const reservasUsuario = data.filter(
                (reserva) =>
                  reserva.evento.id === prevReserva.evento.id &&
                  reserva.emailUsuario === emailUsuarioLogado
              );

              return {
                evento: prevReserva.evento,
                reservas: reservasUsuario,
              };
            });

            console.log('Reservas do usuário 2:', novasReservas);

            return novasReservas;
          });
        } catch (error) {
          console.error('Erro ao obter lista de reservas do usuário:', error);
        }
      };

      carregarReservasUsuario();
    }
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
    <div>
      <h2>Dashboard</h2>

      <h3>Eventos:</h3>
      <ul>
        {eventos.map(evento => (
          <li key={evento.id}>
            {evento.nome} - {evento.data} às {evento.horario} ({evento.capacidade} vagas)
          </li>
        ))}
      </ul>

      {/* Admin Page */}
      {isAdmin && (
        <div>
          <h2>Reservas:</h2>
          {reservasAtivas && reservasAtivas.length > 0 ? (
            <ul>
              {reservasAtivas.map((reserva) => (
                <li key={`${reserva.evento.id}-${reserva.emailUsuario}`}>
                  {`${reserva.emailUsuario} - ${reserva.evento.nome} - `}
                  <button onClick={() => handleExcluirReserva(reserva.evento.id, reserva.emailUsuario)}>
                    Excluir Reserva
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>Nenhuma reserva disponível.</p>
          )}
        </div>
      )}


      {/* User Page */}
      {!isAdmin && (
        <div>
          {reservas.length > 0 ? (
            <div>
              <h2>Seus Eventos:</h2>
              <ul>
                {reservas.map(({ evento, reservas: reservasEvento }) => (
                  reservasEvento.length > 0 && (
                    <li key={evento.id}>
                      {`${evento.nome} - ${evento.data} às ${evento.horario} (${evento.capacidade} vagas)`}
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
    </div>
  );
}

export default Dashboard;
