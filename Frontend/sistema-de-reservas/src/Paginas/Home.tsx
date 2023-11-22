// No componente Home.js
import './css/tailwind.css';
import React, { useState } from 'react';
import BarraDeNavegacao from './modulos/BarraDeNavegacao.tsx';
import BannerDeEventos from './modulos/BannerDeEventos.tsx';
import BannerPrincipal from './modulos/BannerPrincipal.jsx';
import BannerFotosRodizio from './modulos/BannerFotosRodizio.jsx';
import Footer from './modulos/footer.jsx';

function Home() {

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
            <div>
                <BannerFotosRodizio />
            </div>
            <div>
                <Footer />
            </div>
        </div>
    );
}

export default Home;
