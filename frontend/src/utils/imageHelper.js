export function getImageUrl(imagePath) {
    if (!imagePath) return "https://via.placeholder.com/300";
    
    if (imagePath.startsWith('http')) {
        return imagePath;
    }
    
    return `${process.env.NEXT_PUBLIC_API_URL}/images/${imagePath.split('/').pop()}`;
}
