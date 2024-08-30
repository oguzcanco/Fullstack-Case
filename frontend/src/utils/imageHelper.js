export function getImageUrl(imagePath) {
    if (!imagePath) return "https://via.placeholder.com/333";
    
    if (imagePath.startsWith('http')) {
        return imagePath;
    }
    return `http://laravel:8001/api/images/${imagePath}`;
}
