'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useDropzone } from 'react-dropzone';
import 'react-image-crop/dist/ReactCrop.css';

const createSlug = (text) => {
    const turkishChars = { 'ı': 'i', 'ğ': 'g', 'ü': 'u', 'ş': 's', 'ö': 'o', 'ç': 'c', 'İ': 'I', 'Ğ': 'G', 'Ü': 'U', 'Ş': 'S', 'Ö': 'O', 'Ç': 'C' };
    return text
        .toString()
        .toLowerCase()
        .replace(/[ıİğĞüÜşŞöÖçÇ]/g, match => turkishChars[match])
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');
};

export default function AddContent() {
    const [content, setContent] = useState({
        user_id: '',
        title: '',
        slug: '',
        summary: '',
        content: '',
        status: 'published',
        categories: []
    });
    const [categories, setCategories] = useState([]);
    const [featuredImage, setFeaturedImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [crop, setCrop] = useState({ unit: '%', width: 100, aspect: 16 / 9 });
    const [galleryImages, setGalleryImages] = useState([]);
    const [authors, setAuthors] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/categories');
                setCategories(response.data.map(category => ({
                    value: category.id,
                    label: category.name
                })));
            } catch (error) {
                console.error('Kategoriler yüklenirken hata oluştu:', error);
                toast.error('Kategoriler yüklenirken bir hata oluştu.');
            }
        };

        const fetchAuthors = async () => {
            try {
                const response = await api.post('/authors');
                setAuthors(response.data.map(author => ({
                    value: author.id,
                    label: author.name,
                    role: author.role
                })));
            } catch (error) {
                console.error('Yazarlar yüklenirken hata oluştu:', error);
                toast.error('Yazarlar yüklenirken bir hata oluştu.');
            }
        };

        fetchCategories();
        fetchAuthors();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target ? e.target : e;
        setContent(prev => {
            const updatedContent = { ...prev, [name]: value };
            if (name === 'title') {
                updatedContent.slug = createSlug(value);
            }
            return updatedContent;
        });
    };

    const handleCategoryChange = (selectedOptions) => {
        setContent(prev => ({ ...prev, categories: selectedOptions.map(option => option.value) }));
    };

    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        setFeaturedImage(file);
        const reader = new FileReader();
        reader.onload = () => {
            setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {'image/*': []},
        multiple: false
    });

    const onGalleryDrop = useCallback((acceptedFiles) => {
        setGalleryImages(acceptedFiles);
    }, []);

    const { getRootProps: getGalleryRootProps, getInputProps: getGalleryInputProps, isDragActive: isGalleryDragActive } = useDropzone({
        onDrop: onGalleryDrop,
        accept: {'image/*': []},
        multiple: true
    });

    const removeGalleryImage = (index) => {
        setGalleryImages(prevImages => prevImages.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.user_id || !content.title || !content.summary || !content.content || content.categories.length === 0) {
            toast.error('Lütfen tüm gerekli alanları doldurun.');
            return;
        }
        try {
            const formData = new FormData();
            Object.keys(content).forEach(key => {
                if (key === 'categories') {
                    content[key].forEach((categoryId, index) => {
                        formData.append(`category_ids[${index}]`, categoryId);
                    });
                } else if (key !== 'slug') {
                    formData.append(key, content[key]);
                }
            });
            if (featuredImage) {
                formData.append('featured_image', featuredImage);
            }
            galleryImages.forEach((image, index) => {
                formData.append(`gallery[${index}]`, image);
            });

            const response = await api.post('/contents', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success('Makale başarıyla eklendi');
            router.push('/panel/contents');

            if (response.data && response.data.id) {
                await uploadGalleryImages(response.data.id);
            }
        } catch (error) {
            console.error('Makale eklenirken hata oluştu:', error);
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(`Hata: ${error.response.data.message}`);
            } else {
                toast.error('Makale eklenirken bir hata oluştu.');
            }
        }
    };

    const uploadGalleryImages = async (contentId) => {
        for (let i = 0; i < galleryImages.length; i++) {
            const formData = new FormData();
            formData.append('image', galleryImages[i]);
            formData.append('image_order', i + 1);

            try {
                await api.post(`/contents/${contentId}/gallery`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            } catch (error) {
                console.error('Galeri resmi yükleme hatası:', error);
            }
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Makale Oluştur</h1>
                <Link href="/panel/contents" className="bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-600 transition">
                    Geri Dön
                </Link>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-md mb-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">Yazar</label>
                        <Select
                            id="author"
                            name="author"
                            options={authors}
                            value={authors.find(author => author.value === content.user_id)}
                            onChange={(selectedOption) => handleChange({ target: { name: 'user_id', value: selectedOption.value } })}
                            className="basic-single"
                            classNamePrefix="select"
                            getOptionLabel={(option) => `${option.label} ${option.role ? `(${option.role.name})` : ''}`}
                        />
                    </div>
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
                        <input type="text" id="title" name="title" value={content.title} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                    <div>
                        <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                        <input type="text" id="slug" name="slug" value={content.slug} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-gray-100" />
                    </div>
                    <div>
                        <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">Özet</label>
                        <input type="text" id="summary" name="summary" value={content.summary} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">İçerik</label>
                        <CKEditor
                            editor={ClassicEditor}
                            data={content.content}
                            onChange={(event, editor) => {
                                const data = editor.getData();
                                setContent(prev => ({ ...prev, content: data }));
                            }}
                            config={{
                                toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote'],
                                heading: {
                                    options: [
                                        { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                                        { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                                        { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' }
                                    ]
                                }
                            }}
                        />
                    </div>
                    <div>
                        <label htmlFor="featured_img" className="block text-sm font-medium text-gray-700 mb-1">Öne Çıkan Görsel</label>
                        <div 
                            {...getRootProps()} 
                            className="dropzone border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-500 transition-colors duration-300"
                        >
                            <input {...getInputProps()} />
                            {isDragActive ? (
                                <p className="text-indigo-500">Resmi buraya bırakın...</p>
                            ) : (
                                <p>Resmi sürükleyip bırakın veya tıklayarak seçin</p>
                            )}
                            {previewImage && (
                                <img src={previewImage} alt="Preview" className="mt-4 mx-auto max-w-full h-auto" style={{maxHeight: '300px'}} />
                            )}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Durum</label>
                        <select id="status" name="status" value={content.status} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                            <option value="published">Yayınlandı</option>
                            <option value="draft">Taslak</option>
                            <option value="archived">Arşivlendi</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="categories" className="block text-sm font-medium text-gray-700 mb-1">Kategoriler</label>
                        <Select
                            id="categories"
                            name="categories"
                            isMulti
                            options={categories}
                            value={categories.filter(category => content.categories.includes(category.value))}
                            onChange={handleCategoryChange}
                            className="basic-multi-select"
                            classNamePrefix="select"
                        />
                    </div>
                    <div>
                        <label htmlFor="gallery" className="block text-sm font-medium text-gray-700 mb-1">Galeri</label>
                        <div {...getGalleryRootProps()} className="dropzone border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-500 transition-colors duration-300">
                            <input {...getGalleryInputProps()} />
                            {isGalleryDragActive ? (
                                <p className="text-indigo-500">Resimleri buraya bırakın...</p>
                            ) : (
                                <p>Resimleri sürükleyip bırakın veya tıklayarak seçin</p>
                            )}
                        </div>
                        {galleryImages.length > 0 && (
                            <div className="mt-4 grid grid-cols-3 gap-4">
                                {galleryImages.map((file, index) => (
                                    <div key={index} className="relative">
                                        <img 
                                            src={URL.createObjectURL(file)} 
                                            alt={`Gallery preview ${index + 1}`} 
                                            className="w-full h-32 object-cover rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeGalleryImage(index)}
                                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 m-1 hover:bg-red-600 focus:outline-none"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="flex items-center space-x-4">
                        <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600 transition">Kaydet</button>
                        <button type="reset" className="bg-gray-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-600 transition">Temizle</button>
                    </div>
                </form>
            </div>
        </div>
    );
}