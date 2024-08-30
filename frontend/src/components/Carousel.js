'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Carousel.module.css';
import { publicApi } from '../lib/publicApi'; // Bu satırı ekleyin
import { getImageUrl } from '../utils/imageHelper';

export default function Carousel() {
    const [posts, setPosts] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchFeaturedContents = async () => {
            try {
                const response = await publicApi('get', '/featured-contents');
                const validContents = response.data.filter(item => item && item.content && item.content.title && item.content.featured_image);
                setPosts(validContents.map(item => ({
                    id: item.id,
                    title: item.content.title,
                    excerpt: item.content.summary,
                    imageUrl: item.content.featured_image,
                    slug: item.content.slug
                })));
            } catch (error) {
                console.error('Öne çıkan içerikler yüklenirken hata oluştu:', error);
            }
        };

        fetchFeaturedContents();
    }, []);

    const nextItem = () => {
        if (posts.length > 1) {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % posts.length);
        }
    };

    const prevItem = () => {
        if (posts.length > 1) {
            setCurrentIndex((prevIndex) => (prevIndex - 1 + posts.length) % posts.length);
        }
    };


    return (
        <div id="blogCarousel" className="bg-gradient-to-br from-blue-400 to-purple-500 text-white py-10 my-8 rounded-lg shadow-lg relative overflow-hidden">
            <div className="container mx-auto px-4 desktop-container">
                {posts.map((post, index) => (
                <div key={post.id} className={`${styles.carouselItem} ${index === currentIndex ? 'active flex' : 'hidden'} flex-col md:flex-row items-center`}>
                    <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
                        <Link href={`/contents/${post.id}`}>
                            <Image src={getImageUrl(post.imageUrl)} alt={post.title} width={600} height={400} className="rounded-lg shadow-md w-full h-64 object-cover" />
                        </Link>
                    </div>
                    <div className="md:w-1/2 text-center md:text-left">
                        <Link href={`/contents/${post.id}`}>
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h2>
                        </Link>
                        <p className="text-xl mb-8">{post.excerpt}</p>
                        <Link href={`/contents/${post.id}`} className="bg-white text-purple-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition">
                            Daha Fazla
                        </Link>
                    </div>
                </div>
                ))}
            </div>
            <button onClick={prevItem} className={`${styles.carouselControl} ${styles.left} absolute top-1/2 left-4 transform -translate-y-1/2 text-white text-4xl`}>&lt;</button>
            <button onClick={nextItem} className={`${styles.carouselControl} ${styles.right} absolute top-1/2 right-4 transform -translate-y-1/2 text-white text-4xl`}>&gt;</button>
        </div>
    );
}
