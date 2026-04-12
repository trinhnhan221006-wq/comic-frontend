import React, { useState, useEffect } from 'react';
import './Banner.css';

const Banner = () => {
    // Dữ liệu giả lập cho Banner
    const bannerData = [
        {
            id: 1,
            tag: "WAKA ĐỀ XUẤT",
            title: "Yêu Kiều",
            desc: "Châu Dịch là tay công tử ăn chơi có tiếng trong giới, ai ai cũng nghĩ hắn chỉ quan tâm đến việc lên giường chứ chẳng hề có cảm xúc gì. Tới ngày nọ, một đoạn video được tung ra...",
            image: "https://via.placeholder.com/300x450/ff9999/ffffff?text=Yeu+Kieu"
        },
        {
            id: 2,
            tag: "TRUYỆN MỚI",
            title: "Đấu Phá Thương Khung",
            desc: "Tại nơi đây, võ giả quyết định mọi thứ. Tiêu Viêm, một thiên tài tu luyện bỗng nhiên trở thành phế vật, chịu đủ mọi sự chế giễu. Khám phá hành trình lấy lại vinh quang của cậu.",
            image: "https://via.placeholder.com/300x450/99ccff/ffffff?text=Dau+Pha"
        },
        {
            id: 3,
            tag: "HOT NHẤT",
            title: "Thợ Săn Quái Vật",
            desc: "Khi cánh cổng nối liền thế giới thực và hầm ngục quái vật mở ra, những người thức tỉnh năng lực được gọi là Thợ Săn. Sung Jin Woo, thợ săn hạng E yếu nhất...",
            image: "https://via.placeholder.com/300x450/ffcc99/ffffff?text=Tho+San"
        }
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    // Hiệu ứng tự động chuyển Slide mỗi 4 giây
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % bannerData.length);
        }, 4000);
        return () => clearInterval(timer); // Xóa bộ đếm khi tắt component
    }, [bannerData.length]);

    // Hàm để tính toán vị trí của ảnh Trước và Sau
    const getPrevIndex = () => (currentIndex === 0 ? bannerData.length - 1 : currentIndex - 1);
    const getNextIndex = () => (currentIndex === bannerData.length - 1 ? 0 : currentIndex + 1);

    const activeItem = bannerData[currentIndex];

    return (
        <div className="banner-wrapper">
            {/* Ảnh nền làm mờ ở phía sau */}
            <div 
                className="banner-bg-blur" 
                style={{ backgroundImage: `url(${activeItem.image})` }}
            ></div>

            <div className="banner-container">
                {/* PHẦN TRÁI: Nội dung chữ */}
                <div className="banner-content">
                    <span className="banner-tag">{activeItem.tag}</span>
                    <h1 className="banner-title">{activeItem.title}</h1>
                    <p className="banner-desc">{activeItem.desc}</p>
                    
                    <div className="banner-actions">
                        <button className="btn-read">📖 Đọc truyện</button>
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
                            src={bannerData[getPrevIndex()].image} 
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
                            src={bannerData[getNextIndex()].image} 
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