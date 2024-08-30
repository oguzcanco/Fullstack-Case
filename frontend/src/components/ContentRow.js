import Image from 'next/image';
import Link from 'next/link';
import { getImageUrl } from '../utils/imageHelper';

export default function ContentRow({ post }) {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden transition transform hover:scale-105">
            <div className="md:flex">
                    <div className="md:flex-shrink-0">
                    <Link href={`/contents/${post.id}`}>
                        <Image 
                            className="h-48 w-full object-cover md:w-48" 
                            src={getImageUrl(post.featured_image)}
                            alt={post.title} 
                            width={300} 
                            height={192} 
                        />
                    </Link>
                </div>
                <div className="p-8">
                    <div className="flex flex-wrap gap-2 mb-2">
                        {post.categories.map((category) => (
                            <span key={category.id} className="underline uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                                {category.name}
                            </span>
                        ))}
                    </div>
                    <Link href={`/contents/${post.id}`} className="block mt-1 text-lg leading-tight font-medium text-black hover:underline">
                        {post.title}
                    </Link>
                    <p className="mt-2 text-gray-500">{post.summary}</p>
                    <div className="mt-4 flex items-center">
                        <div className="flex items-center text-sm">
                            <p className="text-gray-900 leading-none">{post.user.name}</p>
                            <span className="text-gray-600 mx-2">|</span>
                            <p className="text-gray-600">{new Date(post.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}