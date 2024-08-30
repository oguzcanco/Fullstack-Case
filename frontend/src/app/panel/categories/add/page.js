'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { toast } from 'react-toastify';
import Link from 'next/link';

export default function CreateCategory() {
    const router = useRouter();
    const [category, setCategory] = useState({ name: '', description: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/categories', category, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            toast.success('Kategori başarıyla oluşturuldu.');
            router.push('/panel/categories');
        } catch (error) {
            console.error('Kategori oluşturulurken hata oluştu:', error);
            toast.error('Kategori oluşturulurken bir hata oluştu.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCategory(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="container mx-auto py-12 px-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Yeni Kategori Oluştur</h1>
                <Link href="/panel/categories" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition">
                    Geri Dön
                </Link>
            </div>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="mb-4">
                    <label htmlFor="name" className="block mb-2">Kategori Adı</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={category.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="description" className="block mb-2">Açıklama</label>
                    <textarea
                        id="description"
                        name="description"
                        value={category.description}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded"
                        rows="4"
                    ></textarea>
                </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Oluştur
                </button>
            </form>
        </div>
    );
}