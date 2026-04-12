import axios from 'axios';

const API_URL = 'http://truyentranhlocal.local/wp-json/toocheke/v1';

export const getComics = async () => {
    try {
        const response = await axios.get(`${API_URL}/manga-series`);
        // Vì dữ liệu nằm trong response.data.series, chúng ta phải trỏ vào đó
        return response.data.series || []; 
    } catch (error) {
        console.error("Lỗi kết nối Toocheke:", error);
        return [];
    }
};