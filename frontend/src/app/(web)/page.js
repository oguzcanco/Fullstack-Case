'use client';

import { useState, useEffect } from 'react';
import { publicApi } from '@/lib/publicApi';
import Link from 'next/link';
import Carousel from '@/components/Carousel';
import ContentRow from '@/components/ContentRow';

export default function Home() {
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [latestPosts, setLatestPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        //const featuredResponse = await publicApi('get', '/contents/featured');
        //setFeaturedPosts(featuredResponse.data);

        const latestResponse = await publicApi('get', '/contents/latest-content');
        setLatestPosts(latestResponse.data);
      } catch (error) {
        console.error('API isteği başarısız oldu:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="desktop-container">
        <Carousel posts={featuredPosts} />
      </div>
      
      <div className="desktop-container">
        <section className="container mx-auto py-8 px-4">
          <h3 className="text-center text-2xl font-bold mb-12 text-gray-800">Son Yayınlanan Gönderiler</h3>
          <div className="space-y-8">
            {latestPosts.map((post) => (
              <ContentRow key={post.id} post={post} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/contents" className="inline-block bg-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-purple-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg">
              Tüm Gönderileri Gör
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}