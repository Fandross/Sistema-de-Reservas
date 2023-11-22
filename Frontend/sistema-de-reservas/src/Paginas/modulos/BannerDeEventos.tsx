import React, { useState, useEffect, memo } from 'react';
import '../css/tailwind.css';

interface Evento {
    id: number;
    nome: string;
    data: string;
    horario: string;
    capacidade: number;
}

const BannerDeEventos = memo(() => {
    const [eventos, setEventos] = useState<Evento[]>([]);

    useEffect(() => {
        fetch('http://127.0.0.1:5000/eventos')
            .then(response => response.json())
            .then(data => (setEventos(data)));
    }, []);

    const parseJwt = (token) => {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(window.atob(base64));
    };

    const handleRegistrarEvento = (eventoId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Você precisa estar logado para registrar um evento.');
            return;
        }

        const decodedToken = parseJwt(token);
        const emailUsuario = decodedToken.email;

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
                    setEventos(data);
                })
                .catch(error => console.error('Erro ao obter lista de eventos:', error));
        })
        .catch(error => console.error('Erro ao registrar no evento:', error));
    };

    return (
        <div className="flex flex-row flex-wrap justify-center items-start p-4 bg-orange-400">
            {eventos.map((evento: Evento) => (
                <div key={evento.id} className="card max-w-[95%] md:max-w-[700px] lg:max-w-[30%] w-[95%] justify-center md:px-10 self-center mx-[auto] bg-white shadow-[0_4px_4px_4px_rgba(0,0,0,0.25)] rounded-[0.3em] flex border-4 border-[#fff] m-[1em]">
                    <div className="flex flex-col p-2 justify-between">
                        <div className="card flex flex-col justify-between pl-[0.2em] pt-[1em]">
                            <h3 className="h3 text-[#EB9B00] md:text-[24px] font-bold">{evento.nome}</h3>
                            <p>Data: {evento.data}</p>
                            <p>Horário: {evento.horario}</p>
                            <p>Capacidade: {evento.capacidade}</p>
                        </div>
                        <div className="flex justify-center my-5 w-[80%]">
                            <button onClick={() => handleRegistrarEvento(evento.id)} className="min-w-[40%] px-[1em] py-[0.3em] w-[80%] self-center md:text-[19px] text-center bg-[#EB9B00] text-white rounded-[0.3em]">Reservar</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
});

export default BannerDeEventos;