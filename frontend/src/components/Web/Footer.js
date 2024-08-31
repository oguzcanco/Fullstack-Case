import Link from 'next/link';

export default function Footer() {
    return (
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
    );
}