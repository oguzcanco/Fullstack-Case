import { NextResponse } from 'next/server';

export async function middleware(request) {
    const token = request.cookies.get('token')?.value || request.headers.get('Authorization')?.split(' ')[1];

    if (request.nextUrl.pathname.startsWith('/panel')) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        try {
            const response = await fetch(`${process.env.NEXT_MIDDLEWARE_API_URL}/auth/verify-token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Token doğrulanamadı!');
            }

            const data = await response.json();
            const userRole = data.role;

            if (userRole === 'admin') {
                return NextResponse.next();
            }

            if (userRole === 'lead-editor') {
                if (request.nextUrl.pathname.startsWith('/panel/users')) {
                    return NextResponse.redirect(new URL('/panel', request.url));
                }
            } else if (userRole === 'editor') {
                if (request.nextUrl.pathname.startsWith('/panel/users') || 
                    request.nextUrl.pathname.startsWith('/panel/categories')) {
                    return NextResponse.redirect(new URL('/panel', request.url));
                }
            } else {
                // Tanımlanmamış roller için panel erişimi engellenir
                return NextResponse.redirect(new URL('/', request.url));
            }

            if (!checkRoleAccess(userRole, request.nextUrl.pathname)) {
                return NextResponse.redirect(new URL('/panel', request.url));
            }

            return NextResponse.next();
        } catch (error) {
            console.error('Token doğrulama hatası:', error.message);
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

function checkRoleAccess(userRole, pathname) {
    const roleAccess = {
        'admin': ['/panel'],
        'lead-editor': ['/panel', '/panel/contents', '/panel/categories'],
        'editor': ['/panel', '/panel/contents'],
    };

    const allowedPaths = roleAccess[userRole] || [];
    return allowedPaths.some(path => pathname.startsWith(path));
}

export const config = {
    matcher: ['/panel/:path*'],
};