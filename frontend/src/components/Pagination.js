export default function Pagination({ currentPage, lastPage, onPageChange, links }) {
    return (
        <nav className="flex justify-center mt-8">
            <ul className="flex space-x-2">
                {links.map((link, index) => (
                    <li key={index}>
                        {link.url ? (
                            <button
                                className={`px-3 py-1 rounded ${
                                    link.active
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                                onClick={() => onPageChange(link.url.split('=')[1])}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ) : (
                            <span
                                className="px-3 py-1 rounded bg-gray-100 text-gray-400"
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        )}
                    </li>
                ))}
            </ul>
        </nav>
    );
}