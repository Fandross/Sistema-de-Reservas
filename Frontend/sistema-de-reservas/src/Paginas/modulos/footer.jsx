import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignInAlt, faPizzaSlice, faSignOutAlt, faTachometerAlt } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
    return (
        <footer className="bg-orange-300 p-4 text-center text-black">
            <a href="/" className="text-black text-lg items-center">
                <FontAwesomeIcon icon={faPizzaSlice} className="mr-2" />
                Pizzaria
            </a>
            <p>© 2022 Todos os direitos reservados.</p>
        </footer>
    );
};

export default Footer;