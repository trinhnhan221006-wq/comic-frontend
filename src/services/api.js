import axios from "axios";

const API_URL = "http://truyentranhlocal.local/wp-json/toocheke/v1";

// 1. Tạo biến api để dùng cho trang ComicDetail
const api = axios.create({
  baseURL: API_URL,
});

// 2. Giữ nguyên hàm getComics cũ của bạn cho trang Home
export const getComics = async () => {
  try {
    const response = await axios.get(`${API_URL}/manga-series`);
    return response.data.series || [];
  } catch (error) {
    console.error("Lỗi kết nối Toocheke:", error);
    return [];
  }
};
export const getComicDetail = async (id) => {
    try {
        // Tuyệt chiêu: Gọi lại danh sách truyện (API đang chạy thành công)
        const response = await axios.get(`${API_URL}/manga-series`);
        const allComics = response.data.series || [];
        
        // Dùng hàm .find() của Javascript để tự mò ra truyện có ID khớp với URL
        // Ép kiểu toString() để tránh lỗi so sánh chữ và số
        const comic = allComics.find(item => item.id.toString() === id.toString());
        
        return comic;
    } catch (error) {
        console.error("Lỗi khi lấy chi tiết truyện:", error);
        return null;
    }
};
export const getChapterImages = async (comicId, chapterId) => {
    try {
        // TẠM THỜI: Trả về mảng ảnh giả lập để test giao diện
        // Sáng mai Nhân sẽ thay phần này bằng lệnh gọi axios lấy data thật từ WordPress
        return [
            "https://via.placeholder.com/800x1200/1a1a1a/e50914?text=Trang+1+-+Chuong+" + chapterId,
            "https://via.placeholder.com/800x1200/222222/ffffff?text=Trang+2",
            "https://via.placeholder.com/800x1200/1a1a1a/e50914?text=Trang+3"
        ];
    } catch (error) {
        console.error("Lỗi khi tải ảnh chương:", error);
        return [];
    }
};

// 3. Bây giờ dòng này mới có tác dụng vì 'api' đã được tạo ở bước 1
export default api;
