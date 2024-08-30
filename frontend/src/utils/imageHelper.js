export function getImageUrl(imagePath) {
    console.log(imagePath);
    if (!imagePath) return "https://via.placeholder.com/333";
    
    if (imagePath.startsWith('http')) {
        return imagePath;
    }
    console.log(`${process.env.NEXT_PUBLIC_API_URL}/images/${imagePath}`);
    return `${process.env.NEXT_PUBLIC_API_URL}/images/${imagePath}`;
}
