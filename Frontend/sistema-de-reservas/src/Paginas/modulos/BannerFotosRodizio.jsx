import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import '../css/tailwind.css';
import foto1 from '../imagens/foto1.jpg';
import foto2 from '../imagens/foto2.jpeg';
import foto3 from '../imagens/foto3.jpeg';
import foto4 from '../imagens/foto4.jpeg';
import foto5 from '../imagens/foto5.jpg';
import foto6 from '../imagens/foto6.jpg';
import foto7 from '../imagens/foto7.jpg';
import foto8 from '../imagens/foto8.jpg';

const BannerFotosRodizio = () => {
    const fotos = [foto1, foto2, foto3, foto4, foto5, foto6, foto7, foto8];

    return (
        <div className="flex flex-col items-center justify-center p-4 border-t-5 border-white w-full h-full" style={{background: 'linear-gradient(to bottom, #FB923C, #FDBA74)'}}>
            <div className="mx-20 w-full h-13" style={{backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: '10px', borderRadius: '5px', marginBottom: '20px'}}>
                <h1 className="text-3xl font-bold mb-1 text-orange-500 font-cursive text-center">Venha provar nossos sabores!</h1>
            </div>
            <Carousel autoPlay infiniteLoop useKeyboardArrows dynamicHeight className="max-w-full">
                {fotos.map((foto, index) => (
                    <div key={index}>
                        <img src={foto} alt={`Foto ${index + 1}`} className="max-h-[500px] object-cover w-full" />
                    </div>
                ))}
            </Carousel>
            <style jsx>{`
                .carousel .thumbs {
                    justify-content: center !important;
                }
                .carousel .thumbs img {
                    height: 100px !important;
                }
                .carousel .slide {
                    max-width: 100% !important;
                }
                .carousel .slide img {
                    object-fit: cover;
                    max-height: 500px;
                    width: 100%;
                }
            `}</style>
        </div>
    );
};

export default BannerFotosRodizio;