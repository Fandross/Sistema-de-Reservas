// No componente Home.js
import React, { useState } from 'react';

function Home({ nomeUsuario, isAuthenticated }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const mensagem = nomeUsuario !== "Default"
  ? `Você está logado como ${nomeUsuario} !`
  : 'Você está logado como Default!';

    const handleLogin = () => {
        return console.log("LOGOU");
    };

    return (
        <div>
            <h2>Ola</h2>
            {(
                <div>
                    <h2>Mensagem do Backend:</h2> <p>{mensagem}</p>
                </div>
            )}
        </div>
    );
}
export default Home;
