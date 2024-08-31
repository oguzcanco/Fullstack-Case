'use client';

import Navbar from '@/components/web/Navbar';
import Footer from '@/components/web/Footer';

export default function ClientWebLayout({ children }) {
    return (
        <div className={`bg-gray-50 font-['Poppins']`}>
            <Navbar />
            <main className="container mx-auto px-4 py-8">
                {children}
            </main>
            <Footer />
        </div>
    );
}