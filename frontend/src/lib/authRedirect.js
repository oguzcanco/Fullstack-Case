import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAuthRedirect() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userRole = localStorage.getItem('userRole');

        if (token) {
            if (userRole === 'user') {
                router.replace('/');
            } else {
                router.replace('/panel');
            }
        }
    }, [router]);
}