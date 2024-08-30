'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import '@/app/globals.css';
import Link from 'next/link';
import { useLogout } from '@/lib/auth';
import api from '@/lib/api';

export default function PanelLayout({ children }) {
    const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
    const toggleHamburger = () => {
        setIsHamburgerOpen(prevState => !prevState);
    };

    const router = useRouter();
    const logout = useLogout();
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const response = await api.get('/user');
                if (response.data && response.data.role) {
                    setUserRole(response.data.role.name);
                } else {
                    setUserRole(null);
                }
            } catch (error) {
                if (error.response) {
                    console.log('Error response:', error.response);
                }
                if (error.response && error.response.status === 401) {
                    console.log('Unauthorized, redirecting to login...');
                    localStorage.removeItem('token');
                    router.push('/login');
                }
            }
        };

        fetchUserRole();
    }, []);

    useEffect(() => {
        console.log('Current userRole:', userRole);
    }, [userRole]);

    return (
        <div className="bg-gray-100 font-['Poppins']">
            <nav className="bg-gray-800 text-white p-4 sticky top-0 z-50">
                <div className="container mx-auto flex justify-between items-center">
                    <Link href="/panel" className="text-xl font-bold">Admin Panel</Link>
                    <div className="hidden md:flex items-center space-x-4">
                        <Link href="/" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Ana Sayfa</Link>
                        {(userRole === 'editor' || userRole === 'lead-editor' || userRole === 'admin') && (
                            <Link href="/panel/contents" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Makale Yönetimi</Link>
                        )}
                        {(userRole === 'lead-editor' || userRole === 'admin') && (
                            <Link href="/panel/categories" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Kategori Yönetimi</Link>
                        )}
                        {userRole === 'admin' && (
                            <Link href="/panel/users" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Kullanıcı Yönet</Link>
                        )}
                        <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">Çıkış Yap</button>
                    </div>
                    <div className="md:hidden">
                        <button 
                            onClick={() => setIsHamburgerOpen(true)}
                            className="text-white focus:outline-none"
                            aria-label="Toggle menu"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </nav>
            {/* Hamburger Menü (Sadece mobil görünümde) */}
            <div className={`md:hidden fixed inset-0 bg-gray-800 bg-opacity-75 z-50 transition-opacity duration-300 ${isHamburgerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className={`fixed right-0 top-0 bottom-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ${isHamburgerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="p-4">
                        <button onClick={() => setIsHamburgerOpen(false)} className="absolute top-4 right-4 text-gray-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <ul className="mt-8 space-y-4">
                            <li><Link href="/" className="block py-2 px-4 text-gray-700 hover:bg-gray-100" onClick={() => setIsHamburgerOpen(false)}>Ana Sayfa</Link></li>
                            {(userRole === 'editor' || userRole === 'lead-editor' || userRole === 'admin') && (
                                <li><Link href="/panel/contents" className="block py-2 px-4 text-gray-700 hover:bg-gray-100" onClick={() => setIsHamburgerOpen(false)}>Makale Yönetimi</Link></li>
                            )}
                            {(userRole === 'lead-editor' || userRole === 'admin') && (
                                <li><Link href="/panel/categories" className="block py-2 px-4 text-gray-700 hover:bg-gray-100" onClick={() => setIsHamburgerOpen(false)}>Kategori Yönetimi</Link></li>
                            )}
                            {userRole === 'admin' && (
                                <li><Link href="/panel/users" className="block py-2 px-4 text-gray-700 hover:bg-gray-100" onClick={() => setIsHamburgerOpen(false)}>Kullanıcı Yönet</Link></li>
                            )}
                            <li>
                                <button onClick={() => { logout(); setIsHamburgerOpen(false); }} className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
                                    Çıkış Yap
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <main className="container mx-auto mt-8 px-4">
                {children}
            </main>

            <footer className="bg-gray-800 text-white py-4 mt-8">
                <div className="container mx-auto text-center">
                    <p>&copy; 2024 Admin Panel. Tüm hakları saklıdır.</p>
                </div>
            </footer>
        </div>
    );
}