'use client';

import { useState, useEffect } from 'react';
import { publicApi } from '@/lib/publicApi';
import { getImageUrl } from '@/utils/imageHelper'; // Bu satırı ekleyin
import Image from 'next/image';
import styles from './styles.module.css';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


export default function ContentDetail({ params }) {
    const [content, setContent] = useState(null);
    const [galleryImages, setGalleryImages] = useState([]);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await publicApi('get', `/contents/${params.slug}`);
                setContent(response.data);
                setGalleryImages(response.data.gallery || []);
            } catch (error) {
                console.error('İçerik yüklenirken hata oluştu:', error);
            }
        };

        fetchContent();
    }, [params.slug]);

    if (!content) {
        return <div>Yükleniyor...</div>;
    }

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    return (
        <div className="desktop-container">
            <section className="container mx-auto py-12 px-4">
                <div className="text-center md:text-left">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{content.title}</h1>
                    <div className="flex flex-wrap items-center justify-center md:justify-start space-x-4 text-sm text-gray-600 mb-6">
                        <p>{content.user.name}</p>
                        <span>|</span>
                        <p>{new Date(content.created_at).toLocaleDateString()}</p>
                        <span>|</span>
                        <div className="flex flex-wrap gap-2">
                            {content.categories.map(category => (
                                <span key={category.id} className="bg-gray-200 px-2 py-1 rounded-full text-xs">
                                    {category.name}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <Image
                        className={`w-full rounded-lg shadow-lg object-cover ${styles.contentImage}`}
                        src={getImageUrl(content.featured_image)}
                        alt={content.title}
                        width={800}
                        height={400}
                    />
                </div>

                <div className="text-gray-700 leading-relaxed space-y-6">
                    <p className="font-bold text-xl">{content.summary}</p>
                    <div dangerouslySetInnerHTML={{ __html: content.content }} />
                </div>

                {/* Slider ekleniyor */}
                {galleryImages.length > 0 && (
                    <div className="mt-8">
                        <h2 className="text-2xl font-bold mb-4">Galeri</h2>
                        <Slider {...sliderSettings}>
                            {galleryImages.map((image, index) => (
                                <div key={index}>
                                    <Image
                                        src={getImageUrl(image.image_path)}
                                        alt={`Gallery image ${index + 1}`}
                                        width={800}
                                        height={400}
                                        className="w-full h-auto object-cover rounded-lg"
                                    />
                                </div>
                            ))}
                        </Slider>
                    </div>
                )}
            </section>
        </div>
    );
}