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
        <div className="flex flex-col items-center p-4 bg-orange-500 border-t-5 border-white max-w-full">
            <h1 className="text-3xl font-bold mb-4 text-white font-cursive">Venha provar nossos sabores!</h1>
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