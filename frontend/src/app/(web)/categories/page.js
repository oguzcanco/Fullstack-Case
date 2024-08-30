'use client';

import { useState, useEffect } from 'react';
import { publicApi } from '@/lib/publicApi';
import Link from 'next/link';

export default function Categories() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await publicApi('get', '/categories');
                setCategories(response.data);
            } catch (error) {
                console.error('Kategoriler yüklenirken hata oluştu:', error);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div className="container mx-auto py-12 px-4">
            <h1 className="text-3xl font-bold text-center mb-8">Kategoriler</h1>
            <div className="flex flex-wrap justify-center gap-4">
                {categories.map((category) => (
                    <Link 
                        key={category.id} 
                        href={`/category/${category.id}`}
                        className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 text-center"
                    >
                        <h2 className="text-xl font-semibold mb-2">{category.name}</h2>
                        <p className="text-sm text-gray-600">{category.description}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}