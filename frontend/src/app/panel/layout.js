'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import '@/app/globals.css';
import Link from 'next/link';
import { useLogout } from '@/lib/auth';
import api from '@/lib/api';
import Script from 'next/script';

export default function PanelLayout({ children }) {
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
                    <div className="flex items-center space-x-4">
                        <ul id="mobile-menu" className="hidden md:flex md:space-x-4">
                            {(userRole === 'editor' || userRole === 'lead-editor' || userRole === 'admin') && (
                                <li><Link href="/panel/contents" className="block py-2 px-4 hover:bg-gray-600 md:hover:bg-transparent md:hover:text-gray-300">Makale Yönetimi</Link></li>
                            )}
                            {(userRole === 'lead-editor' || userRole === 'admin') && (
                                <li><Link href="/panel/categories" className="block py-2 px-4 hover:bg-gray-600 md:hover:bg-transparent md:hover:text-gray-300">Kategori Yönetimi</Link></li>
                            )}
                            {userRole === 'admin' && (
                                <li><Link href="/panel/users" className="block py-2 px-4 hover:bg-gray-600 md:hover:bg-transparent md:hover:text-gray-300">Kullanıcı Yönet</Link></li>
                            )}
                        </ul>
                        <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">Çıkış Yap</button>
                    </div>
                </div>
            </nav>
            <main className="container mx-auto mt-8 px-4">
                {children}
            </main>

            <footer className="bg-gray-800 text-white py-4 mt-8">
                <div className="container mx-auto text-center">
                    <p>&copy; 2024 Admin Panel. Tüm hakları saklıdır.</p>
                </div>
            </footer>

            <Script id="mobile-menu-script">
                {`
                document.addEventListener('DOMContentLoaded', function() {
                    const mobileMenuButton = document.getElementById('mobile-menu-button');
                    const mobileMenu = document.getElementById('mobile-menu');

                    mobileMenuButton.addEventListener('click', function() {
                        mobileMenu.classList.toggle('hidden');
                    });
                });
                `}
            </Script>
        </div>
    );
}