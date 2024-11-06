import React, { useEffect, useState } from 'react';
import image1 from '../assest/banner/w-img1.jpg';
import image2 from '../assest/banner/w-img2.jpg';
import image3 from '../assest/banner/w-img3.jpg';
import image1Mobile from '../assest/banner/img1_mobile.jpg';
import image2Mobile from '../assest/banner/img2_mobile.webp';
import image3Mobile from '../assest/banner/img3_mobile.jpg';
import image4Mobile from '../assest/banner/img4_mobile.jpg';
import image5Mobile from '../assest/banner/img5_mobile.png';

const BannerProduct = () => {
    const [currentImage, setCurrentImage] = useState(0);

    const desktopImages = [image1, image2, image3];
    const mobileImages = [
        image1Mobile,
        image2Mobile,
        image3Mobile,
        image4Mobile,
        image5Mobile,
    ];

    const nextImage = () => {
        setCurrentImage((prev) => (prev + 1) % desktopImages.length);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            nextImage();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const handleDotClick = (index) => {
        setCurrentImage(index);
    };

    return (
        <div className='container mx-auto px-4 rounded'>
            <div className='h-[520px] md:h-90 w-full bg-slate-200 relative overflow-hidden'>
                {/* Desktop and tablet version */}
                <div className='hidden md:flex h-full w-full'>
                    {desktopImages.map((imageURL, index) => (
                        <div
                            className='w-full h-full min-w-full transition-all'
                            key={imageURL}
                            style={{ transform: `translateX(-${currentImage * 100}%)` }}
                        >
                            <img src={imageURL} className='w-full h-full object-cover' alt={`banner-${index}`} />
                        </div>
                    ))}
                </div>

                {/* Mobile version */}
                <div className='flex h-full w-full overflow-hidden md:hidden'>
                    {mobileImages.map((imageURL, index) => (
                        <div
                            className='w-full h-full min-w-full transition-all'
                            key={imageURL}
                            style={{ transform: `translateX(-${currentImage * 100}%)` }}
                        >
                            <img src={imageURL} className='w-full h-full object-cover' alt={`banner-mobile-${index}`} />
                        </div>
                    ))}
                </div>

                {/* Dots for navigation */}
                <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2'>
                    {(desktopImages.length > 0 ? desktopImages : mobileImages).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => handleDotClick(index)}
                            className={`w-3 h-3 rounded-full ${currentImage === index ? 'bg-black' : 'bg-gray-400'}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BannerProduct;
