'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { toast } from 'react-toastify';

export default function ContentCategories() {
    const router = useRouter();
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/categories');
                setCategories(response.data);
            } catch (error) {
                console.error('Kategoriler yüklenirken hata oluştu:', error);
                toast.error('Kategoriler yüklenirken bir hata oluştu.');
            }
        };

        fetchCategories();
    }, []);

    const handleDelete = async (categoryId) => {
        if (window.confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) {
            try {
                await api.delete(`/category/${categoryId}`);
                setCategories(categories.filter(category => category.id !== categoryId));
                toast.success('Kategori başarıyla silindi');
            } catch (error) {
                console.error('Kategori silinirken hata oluştu:', error);
                let errorMessage = 'Kategori silinirken bir hata oluştu.';
                
                if (error.response) {
                    if (error.response.status === 403) {
                        errorMessage = 'Bu işlem için yetkiniz yok.';
                    } else if (error.response.data && error.response.data.message) {
                        errorMessage = error.response.data.message;
                    }
                } else if (error.message) {
                    errorMessage = error.message;
                }
                
                toast.error(`Hata: ${errorMessage}`);
            }
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">İçerik Kategorileri</h1>
                <Link href="/panel/categories/add" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                    Yeni Kategori Ekle
                </Link>
            </div>
            {categories.length > 0 ? (
                <ul className="space-y-4">
                    {categories.map((category) => (
                        <li key={category.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition duration-300 ease-in-out">
                            <div>
                                <p className='text-lg font-medium text-gray-700'>{category.name}</p>
                                <small>{category.description}</small>
                            </div>
                            <div className="space-x-2">
                                <Link href={`/panel/categories/edit/${category.id}`} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition duration-300 ease-in-out">
                                    Düzenle
                                </Link>
                                <button onClick={() => handleDelete(category.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition duration-300 ease-in-out">
                                    Sil
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500 text-center py-4">Henüz kategori bulunmamaktadır.</p>
            )}
        </div>
    );
}