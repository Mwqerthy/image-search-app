import React, { useState } from 'react';
import { FaLinkedin, FaDownload } from "react-icons/fa";
import axios from 'axios';

// Spinner Component
const Spinner: React.FC = () => (
    <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
    </div>
);

const ImageSearchHomepage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [isSearchPerformed, setIsSearchPerformed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

    const handleImageDownload = async (imageUrl: string) => {
        try {
            const response = await axios({
                method: 'get',
                url: imageUrl,
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `image-${Date.now()}.jpg`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed', error);
        }
    };

    const fetchImages = async (query: string) => {
        setIsLoading(true);
        setImages([]);
        setIsSearchPerformed(true);

        try {
            const response = await axios.get('https://api.unsplash.com/search/photos', {
                params: {
                    query: query,
                    per_page: 6,
                    orientation: 'squarish',
                },
                headers: {
                    Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
                },
            });

            const fetchedImages = response.data.results.map((photo: any) =>
                photo.urls.regular
            );
            setImages(fetchedImages);
        } catch (error) {
            console.error('Error fetching images:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            fetchImages(searchQuery);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-white">
            <header className="container mx-auto px-4 py-6 flex justify-between items-center">
                <div className="text-3xl font-bold text-blue-600">
                    <span className="sr-only">Logo</span>
                    🔍
                </div>
            </header>

            <main className="flex-grow container mx-auto px-4">
                <section className="text-center py-20">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-blue-900 mb-4">
                        Discover Stunning Images, Instantly.
                    </h1>
                    <p className="text-xl text-blue-700 mb-8">
                        Unleash your creativity with our vast collection of high-quality images.
                    </p>
                    <div className="flex justify-center">
                        <input
                            value={searchQuery}
                            onChange={handleSearchChange}
                            type="text"
                            placeholder="Search for stunning images..."
                            className="w-full max-w-2xl px-6 py-4 text-lg rounded-l-full border-2 border-blue-300 focus:outline-none focus:border-blue-500 transition-colors"
                        />
                        <button
                            onClick={handleSearchSubmit}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-r-full transition-colors"
                        >
                            Search
                        </button>
                    </div>
                </section>

                {/* Conditional rendering for loading, results, and messages */}
                {isLoading ? (
                    <Spinner />
                ) : !isSearchPerformed ? (
                    <section className="py-16">
                        <h2 className="text-3xl font-bold text-blue-900 mb-8 text-center">Trending Images</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="relative overflow-hidden rounded-lg shadow-lg group">
                                    <a
                                        href={`https://picsum.photos/seed/${i ** 3}/400/300`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <img
                                            src={`https://picsum.photos/seed/${i ** 3}/400/300`}
                                            alt={`Placeholder ${i}`}
                                            className="w-full h-64 object-cover transition-transform group-hover:scale-105"
                                        />
                                    </a>
                                    <button
                                        onClick={() =>
                                            handleImageDownload(
                                                `https://picsum.photos/seed/${i ** 3}/400/300`
                                            )
                                        }
                                        className="absolute top-4 right-4 bg-white/80 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    >
                                        <FaDownload className="text-blue-600 text-xl" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                ) : images.length > 0 ? (
                    <section className="py-16">
                        <h2 className="text-3xl font-bold text-blue-900 mb-8 text-center">
                            Search Results for "{searchQuery}"
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {images.map((imageUrl, index) => (
                                <div
                                    key={index}
                                    className="relative overflow-hidden rounded-lg shadow-lg group"
                                >
                                    <a href={imageUrl} target="_blank" rel="noopener noreferrer">
                                        <img
                                            src={imageUrl}
                                            alt={`Search result ${index + 1}`}
                                            className="w-full h-64 object-cover transition-transform group-hover:scale-105"
                                        />
                                    </a>
                                    <button
                                        onClick={() => handleImageDownload(imageUrl)}
                                        className="absolute top-4 right-4 bg-white/80 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    >
                                        <FaDownload className="text-blue-600 text-xl" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                ) : (
                    <p className="text-center text-gray-600">
                        No images found.
                    </p>
                )}
            </main>

            <footer className="bg-blue-900 text-white py-8">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="flex space-x-6 text-2xl text-gray-300">
                            <a
                                href="https://www.linkedin.com/in/mikiyas-adane-6670bb255/"
                                className="hover:text-blue-300 transition-colors"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <FaLinkedin />
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default ImageSearchHomepage;
