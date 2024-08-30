'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { toast } from 'react-toastify';

export default function PanelContents() {
    const [contents, setContents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchContents = async () => {
            try {
                const response = await api.get('/contents', {
                    params: { page: currentPage }
                });
                const { data, last_page, current_page } = response.data;
                if (Array.isArray(data)) {
                    setContents(data);
                } else {
                    console.error('Beklenmeyen veri yapısı:', data);
                    setContents([]);
                }
                setTotalPages(last_page || 1);
                setCurrentPage(current_page || 1);
            } catch (error) {
                console.error('İçerikler yüklenirken hata oluştu:', error);
                setContents([]);
                setTotalPages(1);
            }
        };

        fetchContents();
    }, [currentPage]);

    const handleDelete = async (contentId) => {
        if (window.confirm('Bu makaleyi silmek istediğinizden emin misiniz?')) {
            try {
                await api.delete(`/content/${contentId}`);
                setContents(contents.filter(content => content.id !== contentId));
                toast.success('Makale başarıyla silindi.');
            } catch (error) {
                console.error('Makale silinirken hata oluştu:', error);
                
                let errorMessage = 'Makale silinirken bir hata oluştu.';
                if (error.response && error.response.data && error.response.data.error) {
                    errorMessage = error.response.data.error;
                } else if (error.message) {
                    errorMessage = error.message;
                }
                
                toast.error(`Hata: ${errorMessage}`);
            }
        }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Makale Yönetimi</h1>
            <Link href="/panel/contents/add" className="inline-block mb-6 bg-green-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600 transition">
                Oluştur
            </Link>

            <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-4">Mevcut Makaleler</h2>
                {contents.length > 0 ? (
                    <>
                        <ul className="space-y-4 mb-6">
                            {contents.map((content) => (
                                <li key={content.id} className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-4">
                                    <div className="flex flex-col">
                                        <span className="text-lg font-medium text-gray-700 mb-2 md:mb-0">{content.title}</span>
                                        <small>{content.excerpt || 'İçerik özeti bulunmuyor.'}</small>
                                    </div>
                                    <div className="space-x-2">
                                        <Link href={`/panel/contents/edit/${content.id}`} className="hidden bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition">
                                            Düzenle
                                        </Link>
                                        <button onClick={() => handleDelete(content.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">
                                            Sil
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center space-x-2">
                                <button
                                    onClick={handlePrevPage}
                                    disabled={currentPage === 1}
                                    className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                                >
                                    Önceki
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`px-3 py-1 rounded ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                    >
                                        {page}
                                    </button>
                                ))}
                                <button
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages}
                                    className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                                >
                                    Sonraki
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <p>Henüz içerik bulunmamaktadır.</p>
                )}
            </div>
        </>
    );
}