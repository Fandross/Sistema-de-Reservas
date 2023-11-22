import React from 'react';
import '../css/tailwind.css';
import bannerImage from '../imagens/Banner.jpeg';
import bannerImage2 from '../imagens/Banner2.webp';

const Banner = () => {
    return (
        <div className="relative overflow-hidden bg-orange-400" >
            <img src={bannerImage} alt="Banner" className="w-full max-h-[400px] object-cover" style={{clipPath: 'polygon(0 0, 100% 0, 100% 75%, 0 100%)', opacity: 0.65}} />
        </div>
    );
};

export default Banner;