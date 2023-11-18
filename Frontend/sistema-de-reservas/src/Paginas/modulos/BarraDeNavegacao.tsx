import React from 'react';
import '../css/tailwind.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignInAlt, faPizzaSlice } from '@fortawesome/free-solid-svg-icons';

const BarraDeNavegacao = () => {
  return (
    <div>
      <nav style={{opacity: 0.85, boxShadow: '0 4px 4px 4px rgba(0, 0, 0, 0.25)'}} className="bg-orange-500 h-10 flex justify-between items-center px-10">
        <a href="/" className="text-black text-lg flex items-center mr-4">
          <FontAwesomeIcon icon={faPizzaSlice} className="mr-2" />
          Pizzaria
        </a>
        <div className="flex space-x-4">
          <div className="text-black flex items-center">
            <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
            <a href="/login">Logar</a>
          </div>
          <div className="text-black flex items-center">
            <FontAwesomeIcon icon={faUser} className="mr-2" />
            <a href="/cadastro">Registrar</a>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default BarraDeNavegacao;