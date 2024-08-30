'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { toast } from 'react-toastify';
import Link from 'next/link';

export default function EditCategory({ params }) {
    const router = useRouter();
    const [category, setCategory] = useState({ name: '', description: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await api.get(`/panel/categories/${params.id}`, {
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                setCategory(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Kategori yüklenirken hata oluştu:', error);
                toast.error('Kategori yüklenirken bir hata oluştu.');
                router.push('/panel/categories');
            }
        };

        fetchCategory();
    }, [params.id, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/categories/${params.id}`, category, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            toast.success('Kategori başarıyla güncellendi.');
            router.push('/panel/categories');
        } catch (error) {
            console.error('Kategori güncellenirken hata oluştu:', error);
            toast.error('Kategori güncellenirken bir hata oluştu.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCategory(prev => ({ ...prev, [name]: value }));
    };

    if (loading) {
        return <div>Yükleniyor...</div>;
    }

    return (
        <div className="container mx-auto py-12 px-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Kategori Düzenle</h1>
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
                    Güncelle
                </button>
            </form>
        </div>
    );
}