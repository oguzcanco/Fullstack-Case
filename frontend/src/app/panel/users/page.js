'use client';

import { useState, useEffect } from 'react';
import api from '../../../lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function Users() {
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const router = useRouter();

    useEffect(() => {
        const controller = new AbortController();
        fetchUsers(currentPage, controller.signal);
        return () => controller.abort();
    }, [currentPage]);

    const fetchUsers = async (page, signal) => {
        try {
            const response = await api.get(`/users?page=${page}`, { signal });
            setUsers(response.data.data);
            setPagination({
                currentPage: response.data.current_page,
                lastPage: response.data.last_page,
                total: response.data.total,
                links: response.data.links
            });
        } catch (error) {
            if (error.name === 'CanceledError') {
                console.log('Fetch aborted');
            } else {
                console.error('Kullanıcılar yüklenirken hata oluştu:', error);
                if (error.response) {
                    console.log('Error status:', error.response.status);
                    console.log('Error data:', error.response.data);
                }
                if (error.response && error.response.status === 401) {
                    console.log('Unauthorized access, logging out...');
                    localStorage.removeItem('token');
                    router.push('/login');
                }
            }
        }
    };

    const handleDelete = async (userId) => {
        if (window.confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
            try {
                await api.delete(`/users/${userId}`);
                setUsers(users.filter(user => user.id !== userId));
                toast.success('Kullanıcı başarıyla silindi');
            } catch (error) {
                console.error('Kullanıcı silinirken hata oluştu:', error);
                let errorMessage = 'Kullanıcı silinirken bir hata oluştu.';
                
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
                
                if (error.response && error.response.status === 401) {
                    localStorage.removeItem('token');
                    router.push('/login');
                }
            }
        }
    };

    const handlePageChange = (page) => {
        if (typeof page === 'number') {
            setCurrentPage(page);
        } else if (page === 'Next &raquo;' && pagination.currentPage < pagination.lastPage) {
            setCurrentPage(pagination.currentPage + 1);
        } else if (page === '&laquo; Previous' && pagination.currentPage > 1) {
            setCurrentPage(pagination.currentPage - 1);
        } else {
            const pageNumber = parseInt(page);
            if (!isNaN(pageNumber)) {
                setCurrentPage(pageNumber);
            }
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Kullanıcı Yönetimi</h1>
            <Link href="/panel/users/add" className="inline-block mb-6 bg-green-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600 transition">
                Yeni Kullanıcı Ekle
            </Link>

            <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-4">Mevcut Kullanıcılar</h2>
                {users.length > 0 ? (
                    <>
                        <ul className="space-y-4">
                            {users.map((user) => (
                                <li key={user.id} className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-4">
                                    <div className="flex flex-col">
                                        <span className="text-lg font-medium text-gray-700 mb-2 md:mb-0">{user.name}</span>
                                        <small>{user.email}</small>
                                    </div>
                                    <div className="space-x-2 mt-2 md:mt-0">
                                        <Link href={`/panel/users/edit/${user.id}`} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition">
                                            Düzenle
                                        </Link>
                                        <button onClick={() => handleDelete(user.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">
                                            Sil
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        {pagination && (
                            <div className="mt-6 flex justify-center">
                                {pagination.links.map((link, index) => (
                                    <button
                                        key={index}
                                        onClick={() => link.url && handlePageChange(link.label)}
                                        disabled={!link.url}
                                        className={`mx-1 px-3 py-1 rounded ${
                                            link.active
                                                ? 'bg-blue-500 text-white'
                                                : link.url
                                                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                        }`}
                                    >
                                        {link.label === '&laquo; Previous' ? '«' : link.label === 'Next &raquo;' ? '»' : link.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <p>Henüz kullanıcı bulunmamaktadır.</p>
                )}
            </div>
        </div>
    );
}