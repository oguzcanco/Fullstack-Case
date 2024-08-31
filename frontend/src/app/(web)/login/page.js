'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuthRedirect } from '@/lib/authRedirect';
import { FaSpinner } from 'react-icons/fa';

export default function Login() {
    useAuthRedirect(); // Bu satırı ekleyin

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const response = await api.post('/auth/login', { email, password });
            if (response.data.user && response.data.access_token) {
                localStorage.setItem('token', response.data.access_token);
                localStorage.setItem('userRole', response.data.user.role_id); // Kullanıcı rolünü kaydet
                document.cookie = `token=${response.data.access_token}; path=/; max-age=3600; SameSite=Strict; Secure`;

                window.dispatchEvent(new Event('loginCompleted'));

                if (
                    response.data.user.role_id === 1 ||
                    response.data.user.role_id === 2 ||
                    response.data.user.role_id === 3
                ) {
                    router.push('/panel');
                } else {
                    router.push('/');
                }
            } else {
                setError('Geçersiz yanıt alındı. Lütfen tekrar deneyin.');
            }
        } catch (error) {
            console.error('Login error:', error);
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Hesabınıza giriş yapın
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <input type="hidden" name="remember" value="true" />
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email-address" className="sr-only">E-posta adresi</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="E-posta adresi"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Şifre</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Şifre"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <FaSpinner className="animate-spin mr-2" />
                            ) : null}
                            {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                        </button>
                    </div>
                </form>
                {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}
            </div>
        </div>
    );
}