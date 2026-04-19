import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const navigate = useNavigate();
    
    // 1. Tạo state kiểm tra trạng thái đăng nhập
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userPhone, setUserPhone] = useState('');

    // 2. Mỗi khi Header xuất hiện, kiểm tra xem có "Lệnh Bài" (Token) trong túi không
    useEffect(() => {
        const token = localStorage.getItem('userToken');
        const phone = localStorage.getItem('userPhone');
        if (token) {
            setIsLoggedIn(true);
            setUserPhone(phone);
        }
    }, []);

    // 3. Hàm Đăng xuất (Vứt bỏ Lệnh bài)
    const handleLogout = () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userPhone');
        setIsLoggedIn(false);
        navigate('/'); // Đẩy về trang chủ
    };

    return (
        <header className="main-header">
            <div className="header-container">
                
                {/* CỤM BÊN TRÁI: Logo và Menu chính */}
                <div className="header-left">
                    <Link to="/" className="logo">
                        <span style={{ color: '#6b7280' }}>Góc</span>Truyện
                    </Link>
                    
                    <nav className="main-nav">
                        <Link to="/" className="nav-link active">TRANG CHỦ</Link>
                        <Link to="/Danhsach" className="nav-link">DANH SÁCH</Link>
                    </nav>
                </div>

                {/* CỤM BÊN PHẢI: Tìm kiếm và Tài khoản */}
                <div className="header-right">
                    <button className="icon-btn" title="Tìm kiếm">🔍</button>
                    
                    {/* KHU VỰC HIỂN THỊ ĐỘNG */}
                    {!isLoggedIn ? (
                        // Nếu CHƯA có Token -> Hiện 2 nút Đăng nhập/Đăng ký như cũ
                        <div className="auth-links">
                            <Link to="/Dangnhap" className="auth-btn login-btn">Đăng nhập</Link>
                            <Link to="/Dangki" className="auth-btn register-btn">Đăng ký</Link>
                        </div>
                    ) : (
                        // Nếu ĐÃ có Token -> Hiện Avatar và Nút Đăng xuất
                        <div className="user-profile-menu" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <span style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>
                                Đạo hữu {userPhone.slice(-4)} {/* Chỉ hiện 4 số cuối cho ngầu và bảo mật */}
                            </span>
                            
                            {/* Avatar: Bấm vào sẽ bay sang Trang cá nhân (Động phủ) */}
                            <img 
                                src="https://via.placeholder.com/40x40/e50914/ffffff?text=U" 
                                alt="Avatar" 
                                title="Vào Động Phủ"
                                style={{ width: '38px', height: '38px', borderRadius: '50%', cursor: 'pointer', border: '2px solid #e50914' }} 
                                onClick={() => navigate('/profile')} 
                            />
                            
                            {/* Nút Đăng xuất */}
                            <button 
                                onClick={handleLogout}
                                style={{ 
                                    backgroundColor: 'transparent', 
                                    border: '1px solid #6b7280', 
                                    color: '#6b7280', 
                                    padding: '5px 12px', 
                                    borderRadius: '15px', 
                                    cursor: 'pointer', 
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    transition: '0.3s'
                                }}
                                onMouseOver={(e) => { e.target.style.color = '#fff'; e.target.style.borderColor = '#fff'; }}
                                onMouseOut={(e) => { e.target.style.color = '#6b7280'; e.target.style.borderColor = '#6b7280'; }}
                            >
                                Đăng xuất
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </header>
    );
};

export default Header;