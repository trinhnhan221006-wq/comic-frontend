import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'
const Header = () => {
    return (
        <header className="main-header">
            <div className="header-container">
                
                {/* CỤM BÊN TRÁI: Logo và Menu chính */}
                <div className="header-left">
                    {/* Chỗ này bạn có thể thay bằng thẻ <img src="..."> nếu có logo hình */}
                    <Link to="/" className="logo">
                        <span style={{ color: '#6b7280' }}>Góc</span>Truyện
                    </Link>
                    
                    <nav className="main-nav">
                        {/* Thêm class "active" cho trang hiện tại để có gạch chân */}
                        <Link to="/" className="nav-link active">TRANG CHỦ</Link>
                        <Link to="/danh-sach" className="nav-link">DANH SÁCH</Link>
                    </nav>
                </div>

                {/* CỤM BÊN PHẢI: Tìm kiếm và Tài khoản */}
                <div className="header-right">
                    <button className="icon-btn" title="Tìm kiếm">🔍</button>
                    
                    <div className="auth-links">
                        <Link to="/Dangnhap" className="auth-btn login-btn">Đăng nhập</Link>
                        <Link to="/Dangki" className="auth-btn register-btn">Đăng ký</Link>
                    </div>
                </div>

            </div>
        </header>
    );
};

export default Header;