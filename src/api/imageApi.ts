import axios from 'axios';

const API_KEY = 'your-google-api-key';
const CSE_ID = 'your-custom-search-engine-id';

export const searchImages = async (query: string) => {
    const url = `https://www.googleapis.com/customsearch/v1`;
    const params = {
        key: API_KEY,
        cx: CSE_ID,
        q: query,
        searchType: 'image',
    };

    try {
        const response = await axios.get(url, { params });
        return response.data.items.map((item: any) => ({
            title: item.title,
            link: item.link,
            thumbnail: item.image.thumbnailLink,
        }));
    } catch (error) {
        console.error('Error fetching images:', error);
        return [];
    }
};
