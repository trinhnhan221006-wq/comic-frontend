import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Thêm công cụ chuyển trang
import './Banner.css';

// Nhận mảng "comics" từ trang Home truyền xuống
const Banner = ({ comics }) => {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);

    // Kích hoạt auto-slide mỗi 4 giây
    useEffect(() => {
        // Nếu chưa có dữ liệu thì không chạy hiệu ứng
        if (!comics || comics.length === 0) return;

        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % comics.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [comics]); // Lắng nghe sự thay đổi của mảng comics

    // Kiểm tra an toàn: Nếu không có truyện nào thì ẩn Banner
    if (!comics || comics.length === 0) return null;

    // Tính toán vị trí ảnh
    const getPrevIndex = () => (currentIndex === 0 ? comics.length - 1 : currentIndex - 1);
    const getNextIndex = () => (currentIndex === comics.length - 1 ? 0 : currentIndex + 1);

    // Truyện đang được hiển thị ở giữa
    const activeItem = comics[currentIndex];

    return (
        <div className="banner-wrapper">
            {/* Ảnh nền làm mờ */}
            <div 
                className="banner-bg-blur" 
                style={{ backgroundImage: `url(${activeItem.image})` }}
            ></div>

            <div className="banner-container">
                {/* PHẦN TRÁI: Nội dung chữ */}
                <div className="banner-content">
                    <span className="banner-tag">TRUYỆN MỚI</span>
                    <h1 className="banner-title">{activeItem.title}</h1>
                    
                    {/* Render HTML mô tả an toàn */}
                    <div 
                        className="banner-desc" 
                        dangerouslySetInnerHTML={{ __html: activeItem.description }}
                        style={{ maxHeight: '80px', overflow: 'hidden', textOverflow: 'ellipsis' }}
                    />
                    
                    <div className="banner-actions">
                        {/* NÚT ĐỌC TRUYỆN: Chuyển hướng sang ID của truyện đang hiển thị */}
                        <button 
                            className="btn-read"
                            onClick={() => navigate(`/comic/${activeItem.id}`)}
                        >
                            📖 Đọc truyện
                        </button>
                        <button className="btn-heart">🤍</button>
                    </div>
                </div>

                {/* PHẦN PHẢI: Hiệu ứng ảnh 3D */}
                <div className="banner-slider">
                    <button 
                        className="slide-btn prev-btn" 
                        onClick={() => setCurrentIndex(getPrevIndex())}
                    >❮</button>

                    <div className="images-stack">
                        {/* Ảnh Trước */}
                        <img 
                            src={comics[getPrevIndex()].image} 
                            className="stack-img img-prev" 
                            alt="prev" 
                        />
                        {/* Ảnh Hiện tại (To nhất, ở giữa) */}
                        <img 
                            src={activeItem.image} 
                            className="stack-img img-active" 
                            alt="active" 
                        />
                        {/* Ảnh Sau */}
                        <img 
                            src={comics[getNextIndex()].image} 
                            className="stack-img img-next" 
                            alt="next" 
                        />
                    </div>

                    <button 
                        className="slide-btn next-btn" 
                        onClick={() => setCurrentIndex(getNextIndex())}
                    >❯</button>
                </div>
            </div>
        </div>
    );
};

export default Banner;