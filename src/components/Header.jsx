import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {

    const navigate = useNavigate();

    const [showSearch, setShowSearch] = useState(false);
    const [keyword, setKeyword] = useState("");

    // Danh sách gợi ý (có thể bỏ sau này khi dùng API)
    const comics = [
        "Naruto",
        "One Piece",
        "Dragon Ball",
        "Attack on Titan",
        "Doraemon",
        "Thám tử lừng danh Conan",
        "Jujutsu Kaisen"
    ];

    const filteredComics = comics.filter((comic) =>
        comic.toLowerCase().includes(keyword.toLowerCase())
    );

    return (
        <header className="main-header">
            <div className="header-container">
                
                {/* LEFT */}
                <div className="header-left">
                    <Link to="/" className="logo">
                        <span style={{ color: '#6b7280' }}>Góc</span>Truyện
                    </Link>
                    
                    <nav className="main-nav">
                        <Link to="/" className="nav-link active">TRANG CHỦ</Link>
                        <Link to="/Danhsach" className="nav-link">DANH SÁCH</Link>
                    </nav>
                </div>

                {/* RIGHT */}
                <div className="header-right" style={{ position: "relative" }}>

                    {/* NÚT SEARCH */}
                    <button 
                        className="icon-btn" 
                        onClick={() => setShowSearch(!showSearch)}
                    >
                        🔍
                    </button>

                    {/* SEARCH BOX */}
                    {showSearch && (
                        <div style={{
                            position: "absolute",
                            top: "40px",
                            right: 0,
                            width: "250px",
                            background: "#fff",
                            border: "1px solid #ddd",
                            padding: "10px",
                            borderRadius: "5px",
                            zIndex: 1000
                        }}>
                            <input
                                type="text"
                                placeholder="Tìm truyện..."
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}

                                // 🔥 ENTER để search
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && keyword.trim() !== "") {
                                        navigate(`/search?q=${keyword}`);
                                        setShowSearch(false);
                                    }
                                }}

                                style={{
                                    width: "100%",
                                    padding: "8px",
                                    border: "1px solid #ccc",
                                    borderRadius: "5px",
                                    marginBottom: "5px"
                                }}
                            />

                            {/* KẾT QUẢ GỢI Ý */}
                            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                {keyword && (
                                    filteredComics.length > 0 ? (
                                        filteredComics.map((comic, index) => (
                                            <li
                                                key={index}
                                                onClick={() => {
                                                    navigate(`/search?q=${comic}`);
                                                    setKeyword("");
                                                    setShowSearch(false);
                                                }}
                                                style={{
                                                    padding: "6px",
                                                    borderBottom: "1px solid #eee",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                {comic}
                                            </li>
                                        ))
                                    ) : (
                                        <li style={{ padding: "6px" }}>
                                            Không tìm thấy
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>
                    )}

                    {/* AUTH */}
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