'use client';

import { useState, useEffect } from 'react';
import { publicApi } from '../../../lib/publicApi';
import ContentRow from '../../../components/ContentRow';
import Pagination from '../../../components/Pagination';

export default function Contents() {
    const [contents, setContents] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchContents(currentPage);
    }, [currentPage]);

    const fetchContents = async (page) => {
        try {
            const response = await publicApi('get', `/contents?page=${page}`);
            setContents(response.data.data);
            setPagination({
                currentPage: response.data.current_page,
                lastPage: response.data.last_page,
                total: response.data.total,
                links: response.data.links
            });
        } catch (error) {
            console.error('İçerikler yüklenirken hata oluştu:', error);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="desktop-container">
            <section className="container mx-auto py-8 px-4">
                <h3 className="text-center text-2xl font-bold mb-12 text-gray-800">Tüm Gönderiler</h3>
                <div className="space-y-8">
                    {contents.map((content) => (
                        <ContentRow key={content.id} post={content} />
                    ))}
                </div>
                {pagination && (
                    <Pagination
                        currentPage={pagination.currentPage}
                        lastPage={pagination.lastPage}
                        onPageChange={handlePageChange}
                        links={pagination.links}
                    />
                )}
            </section>
        </div>
    );
}