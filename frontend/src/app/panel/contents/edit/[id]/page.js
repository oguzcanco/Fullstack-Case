'use client';

import { useState, useEffect } from 'react';
import api from '../../../../../lib/api';
import { useRouter } from 'next/navigation';

export default function EditContent({ params }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchContent = async () => {
        try {
            const response = await api.get(`/contents/${params.id}`);
            setTitle(response.data.title);
            setContent(response.data.content);
        } catch (error) {
            console.error('İçerik yüklenirken hata oluştu:', error);
        }
        };

        fetchContent();
    }, [params.id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        await api.put(`/contents/${params.id}`, { title, content });
        router.push('/panel/contents');
        } catch (error) {
        console.error('İçerik güncellenirken hata oluştu:', error);
        }
    };

    return (
        <div>
        <h1 className="text-3xl font-bold mb-4">İçerik Düzenle</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
            <label htmlFor="title" className="block mb-2">Başlık</label>
            <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border rounded"
                required
            />
            </div>
            <div>
            <label htmlFor="content" className="block mb-2">İçerik</label>
            <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-2 border rounded"
                rows="10"
                required
            ></textarea>
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            İçerik Güncelle
            </button>
        </form>
        </div>
    );
}