'use client';

import '@/app/globals.css';
import Navbar from '@/components/panel/Navbar';
import Footer from '@/components/panel/Footer';

export default function PanelLayout({ children }) {
    return (
        <div className="bg-gray-100 font-['Poppins'] min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow container mx-auto mt-8 px-4">
                {children}
            </main>
            <Footer />
        </div>
    );
}