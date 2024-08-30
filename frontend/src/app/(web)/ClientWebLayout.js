'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useLogout } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function ClientWebLayout({ children }) {
    const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const logout = useLogout();
    const router = useRouter();

    const toggleHamburger = () => {
        setIsHamburgerOpen(prevState => !prevState);
    };

    useEffect(() => {
        const checkLoginStatus = () => {
            const token = localStorage.getItem('token');
            const role = localStorage.getItem('userRole');
            setIsLoggedIn(!!token);
            setUserRole(role);
        };

        checkLoginStatus();

        // Özel event dinleyicisi
        const handleLoginEvent = () => {
            checkLoginStatus();
        };

        window.addEventListener('storage', checkLoginStatus);
        window.addEventListener('loginCompleted', handleLoginEvent);

        return () => {
            window.removeEventListener('storage', checkLoginStatus);
            window.removeEventListener('loginCompleted', handleLoginEvent);
        };
    }, []);

    const handleAuthAction = () => {
        if (isLoggedIn) {
            logout();
            setIsLoggedIn(false);
            setUserRole(null);
            localStorage.removeItem('token');
            localStorage.removeItem('userRole');
            router.push('/');
        } else {
            router.push('/login');
        }
    };

    return (
        <div className={`bg-gray-50 font-['Poppins']`}>
            <nav className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 sticky top-0 z-50">
                <div className="container mx-auto flex justify-between items-center">
                    <Link href="/" className="text-2xl font-bold">BlogLogo</Link>
                    <div className="flex items-center space-x-4">
                        <button 
                            onClick={() => setIsHamburgerOpen(true)}
                            className="text-white focus:outline-none md:hidden"
                            aria-label="Toggle menu"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <div className="hidden md:flex items-center space-x-4">
                            <ul className="flex space-x-4">
                                <li><Link href="/" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Ana Sayfa</Link></li>
                                <li><Link href="/contents" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Makaleler</Link></li>
                                <li><Link href="/categories" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Kategoriler</Link></li>
                            </ul>
                            <div className="flex space-x-2">
                                <button 
                                    onClick={handleAuthAction} 
                                    className={`${isLoggedIn ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white px-4 py-2 rounded`}
                                >
                                    {isLoggedIn ? 'Çıkış Yap' : 'Giriş Yap'}
                                </button>
                                {!isLoggedIn && (
                                    <Link href="/register" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                                        Kayıt Ol
                                    </Link>
                                )}
                                {isLoggedIn && userRole === 'admin' && (
                                    <Link href="/admin/panel" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                                        Admin Paneli
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hamburger Menü */}
            <div className={`fixed inset-0 bg-gray-800 bg-opacity-75 z-50 transition-opacity duration-300 ${isHamburgerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className={`fixed right-0 top-0 bottom-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ${isHamburgerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="p-4">
                        <button onClick={toggleHamburger} className="absolute top-4 right-4 text-gray-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <ul className="mt-8 space-y-4">
                            <li><Link href="/" className="text-gray-600 hover:text-gray-900" onClick={toggleHamburger}>Ana Sayfa</Link></li>
                            <li><Link href="/contents" className="text-gray-600 hover:text-gray-900" onClick={toggleHamburger}>Makaleler</Link></li>
                            <li><Link href="/categories" className="text-gray-600 hover:text-gray-900" onClick={toggleHamburger}>Kategoriler</Link></li>
                        </ul>
                        <div className="mt-8 space-y-4">
                            <button 
                                onClick={() => { handleAuthAction(); toggleHamburger(); }}
                                className={`w-full ${isLoggedIn ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white px-4 py-2 rounded`}
                            >
                                {isLoggedIn ? 'Çıkış Yap' : 'Giriş Yap'}
                            </button>
                            {!isLoggedIn && (
                                <Link href="/register" className="block w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-center" onClick={toggleHamburger}>
                                    Kayıt Ol
                                </Link>
                            )}
                            {isLoggedIn && userRole === 'admin' && (
                                <Link href="/admin/panel" className="block w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-center" onClick={toggleHamburger}>
                                    Admin Paneli
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 py-8">
                {children}
            </main>

            <footer className="bg-gray-800 text-white py-8">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-between">
                        <div className="w-full md:w-1/3 mb-6 md:mb-0">
                            <h4 className="text-xl font-bold mb-4">Hakkımızda</h4>
                            <p className="text-gray-400">Kısa bir açıklama metni buraya gelecek.</p>
                        </div>
                        <div className="w-full md:w-1/3 mb-6 md:mb-0">
                            <h4 className="text-xl font-bold mb-4">Hızlı Bağlantılar</h4>
                            <ul className="space-y-2">
                                <li><Link href="/privacy-policy" className="text-gray-400 hover:text-white transition">Gizlilik Politikası</Link></li>
                                <li><Link href="/terms-of-service" className="text-gray-400 hover:text-white transition">Kullanım Şartları</Link></li>
                                <li><Link href="/contact" className="text-gray-400 hover:text-white transition">İletişim</Link></li>
                            </ul>
                        </div>
                        <div className="w-full md:w-1/3">
                            <h4 className="text-xl font-bold mb-4">Bizi Takip Edin</h4>
                            <div className="flex space-x-4">
                                <a href="#" className="text-gray-400 hover:text-white transition"><i className="fab fa-facebook-f"></i></a>
                                <a href="#" className="text-gray-400 hover:text-white transition"><i className="fab fa-twitter"></i></a>
                                <a href="#" className="text-gray-400 hover:text-white transition"><i className="fab fa-instagram"></i></a>
                                <a href="#" className="text-gray-400 hover:text-white transition"><i className="fab fa-linkedin-in"></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-700 mt-8 pt-8 text-sm text-center text-gray-400">
                    <p>&copy; 2024 Blog Adı. Tüm hakları saklıdır.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
