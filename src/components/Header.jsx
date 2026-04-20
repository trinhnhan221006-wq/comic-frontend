import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();

  // 🔎 SEARCH
  const [showSearch, setShowSearch] = useState(false);
  const [keyword, setKeyword] = useState("");

  const comics = [
    "Naruto",
    "One Piece",
    "Dragon Ball",
    "Attack on Titan",
    "Doraemon",
    "Thám tử lừng danh Conan",
    "Jujutsu Kaisen",
  ];

  const filteredComics = comics.filter((comic) =>
    comic.toLowerCase().includes(keyword.toLowerCase()),
  );

  // 🔐 LOGIN
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userPhone, setUserPhone] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const phone = localStorage.getItem("userPhone");
    if (token) {
      setIsLoggedIn(true);
      setUserPhone(phone || "");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userPhone");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <header className="main-header">
      <div className="header-container">
        {/* LEFT */}
        <div className="header-left">
          <Link to="/" className="logo">
            <span style={{ color: "#6b7280" }}>Góc</span>Truyện
          </Link>

          <nav className="main-nav">
            <Link to="/" className="nav-link active">
              TRANG CHỦ
            </Link>
            <Link to="/Danhsach" className="nav-link">
              DANH SÁCH
            </Link>
          </nav>
        </div>

        {/* RIGHT */}
        <div className="header-right" style={{ position: "relative" }}>
          {/* 🔍 SEARCH */}
          <button
            className="icon-btn"
            onClick={() => setShowSearch(!showSearch)}
          >
            🔍
          </button>

          {showSearch && (
            <div
              style={{
                position: "absolute",
                top: "40px",
                right: 0,
                width: "250px",
                background: "#fff",
                border: "1px solid #ddd",
                padding: "10px",
                borderRadius: "5px",
                zIndex: 1000,
              }}
            >
              <input
                type="text"
                placeholder="Tìm truyện..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
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
                  marginBottom: "5px",
                }}
              />

              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {keyword &&
                  (filteredComics.length > 0 ? (
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
                          cursor: "pointer",
                        }}
                      >
                        {comic}
                      </li>
                    ))
                  ) : (
                    <li style={{ padding: "6px" }}>Không tìm thấy</li>
                  ))}
              </ul>
            </div>
          )}

          {/* 🔐 AUTH */}
          {!isLoggedIn ? (
            <div className="auth-links">
              <Link to="/Dangnhap" className="auth-btn login-btn">
                Đăng nhập
              </Link>
              <Link to="/Dangki" className="auth-btn register-btn">
                Đăng ký
              </Link>
            </div>
          ) : (
            <div onClick={() => navigate("/profile")}
            style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <span
                style={{ color: "#fff", fontSize: "14px", fontWeight: "bold" }}
              >
                {JSON.parse(localStorage.getItem("user"))?.display_name
                  ? JSON.parse(localStorage.getItem("user")).display_name
                  : `Đạo hữu ${userPhone ? userPhone.slice(-4) : ""}`}
              </span>

              <img
                src={
                  JSON.parse(localStorage.getItem("user"))?.avatar ||
                  "https://placehold.co/40x40/333/FFF?text=U"
                }
                alt="Avatar"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />

              <button onClick={handleLogout}>Đăng xuất</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
