'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { toast } from 'react-toastify';
import Link from 'next/link';

export default function EditUser({ params }) {
    const [user, setUser] = useState({ name: '', email: '', role_id: '' });
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchUserAndRoles = async () => {
            try {
                const [userResponse, rolesResponse] = await Promise.all([
                    api.get(`/edit-user/${params.id}`),
                    api.get('/roles')
                ]);
                setUser(userResponse.data);
                setRoles(rolesResponse.data);
                setLoading(false);
            } catch (error) {
                console.error('Veri yüklenirken hata oluştu:', error);
                toast.error('Kullanıcı bilgileri yüklenirken bir hata oluştu.');
                router.push('/panel/users');
            }
        };

        fetchUserAndRoles();
    }, [params.id, router]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prevUser => ({
            ...prevUser,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/users/${params.id}`, user);
            toast.success('Kullanıcı başarıyla güncellendi');
            router.push('/panel/users');
        } catch (error) {
            console.error('Kullanıcı güncellenirken hata oluştu:', error);
            toast.error('Kullanıcı güncellenirken bir hata oluştu.');
        }
    };

    if (loading) {
        return <div>Yükleniyor...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Kullanıcı Düzenle</h1>
                <Link href="/panel/users" className="bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-600 transition">
                    Geri Dön
                </Link>
            </div>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Ad</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={user.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 font-bold mb-2">E-posta</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="role_id" className="block text-gray-700 font-bold mb-2">Rol</label>
                    <select
                        id="role_id"
                        name="role_id"
                        value={user.role_id}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        required
                    >
                        <option value="">Rol seçin</option>
                        {roles.map((role) => (
                            <option key={role.id} value={role.id}>{role.name}</option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition">
                    Kullanıcıyı Güncelle
                </button>
            </form>
        </div>
    );
}