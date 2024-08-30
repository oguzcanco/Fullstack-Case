'use client';

import { useState, useEffect } from 'react';
import { publicApi } from '@/lib/publicApi';
import ContentRow from '@/components/ContentRow';

export default function CategoryContents({ params }) {
    const [contents, setContents] = useState([]);
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategoryContents = async () => {
            try {
                setLoading(true);
                const response = await publicApi('get', `/categories/${params.id}`);
                ('API yanıtı:', response);

                if (response && response.data && response.data.contents) {
                    setContents(response.data.contents);
                    setCategory(response.data.category || null);
                } else {
                    setContents([]);
                    setError('API yanıtı beklenen formatta değil.');
                }
            } catch (error) {
                console.error('Kategori içerikleri yüklenirken hata oluştu:', error);
                setError('İçerikler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryContents();
    }, [params.id]);

    if (loading) {
        return <div className="text-center py-10">Yükleniyor...</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">{category ? `${category.name} Kategorisi İçerikleri` : 'Kategori İçerikleri'}</h1>
            {contents && contents.length > 0 ? (
                <div className="space-y-6">
                    {contents.map((post) => (
                        <ContentRow key={post.id} post={post} />
                    ))}
                </div>
            ) : (
                <p className="text-center py-10">Bu kategoride henüz içerik bulunmamaktadır.</p>
            )}
        </div>
    );
}
