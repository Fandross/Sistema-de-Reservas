// No componente Home.js
import './css/tailwind.css';
import React, { useState } from 'react';
import BarraDeNavegacao from './modulos/BarraDeNavegacao.tsx';
import BannerDeEventos from './modulos/BannerDeEventos.tsx';
import BannerPrincipal from './modulos/BannerPrincipal.jsx';

function Home() {
    const [mensagem, setMensagem] = useState('');

    const handleLogin = () => {
        console.log("LOGOU");
    };

    return (
        <div>
            <header>
                <BarraDeNavegacao />
            </header>
            <div className=''>
                <BannerPrincipal />
            </div>
            <div>

                <BannerDeEventos/>
            </div>

        </div>
    );
}

export default Home;
