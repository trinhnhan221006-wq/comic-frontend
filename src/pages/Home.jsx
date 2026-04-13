import { useEffect, useState } from "react";
import { getComics } from "../services/api";
import Banner from "../components/Banner";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("thang");
  const [recentComics, setRecentComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topComics, setTopComics] = useState([]);

  // Hàm xử lý mã Unicode (ví dụ: \u00e0i -> ài)
  const decodeUnicode = (str) => {
    try {
      return JSON.parse(`"${str}"`);
    } catch (e) {
      return str;
    }
  };

  useEffect(() => {
    const fetchWpData = async () => {
      setLoading(true);
      try {
        const data = await getComics();
        console.log("Dữ liệu Toocheke nhận được:", data);

        if (data && data.length > 0) {
          const formattedComics = data.map((item) => {
            return {
              id: item.id,
              // Giải mã tên truyện để hiện đúng tiếng Việt có dấu
              title: decodeUnicode(item.title),
              image: item.thumbnail,
              views: "10K",
              likes: "1K",
              chapters: [{ name: "Chương 1", time: "Vừa xong" }],
            };
          });
          setRecentComics(formattedComics);
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWpData();
  }, []);

  useEffect(() => {
  const fetchTopComics = async () => {
    try {
      const res = await axios.get('http://truyentranhlocal.local/wp-json/truyen/v1/top-truyen');
      setTopComics(res.data);
    } catch (error) {
      console.error("Lỗi lấy bảng xếp hạng:", error);
    }
  };
  fetchTopComics();
}, []);

  return (
    <div
      style={{
        backgroundColor: "#121212",
        minHeight: "100vh",
        paddingBottom: "30px",
      }}
    >
      <Banner />

      <div className="home-layout">
        {/* --- CỘT TRÁI: Truyện mới cập nhật --- */}
        <div className="main-content">
          <h2 className="section-title">
            <span>Cập Nhật Gần Đây</span>
          </h2>

          {loading && (
            <p style={{ color: "white", padding: "20px" }}>
              Đang kết nối đến WordPress...
            </p>
          )}

          {!loading && recentComics.length === 0 && (
            <p style={{ color: "red", padding: "20px" }}>
              Không tìm thấy truyện nào. Hãy kiểm tra lại API hoặc tạo truyện
              trong Toocheke!
            </p>
          )}

          <div className="comic-grid">
            {recentComics.map((comic) => (
              <div
                key={comic.id}
                className="comic-card-dark"
                onClick={() => navigate(`/comic/${comic.id}`)}
              >
                <div className="card-thumb">
                  {/* Sử dụng ảnh thật từ thumbnail WordPress */}
                  <img src={comic.image} alt={comic.title} />
                  <div className="card-stats">
                    <span>👁️ {comic.views}</span>
                    <span>❤️ {comic.likes}</span>
                  </div>
                </div>

                <div className="card-info">
                  <h3>{comic.title}</h3>
                  <div className="chapter-list">
                    {comic.chapters.map((chap, index) => (
                      <div key={index} className="chapter-item">
                        <span className="chapter-name">{chap.name}</span>
                        <span className="chapter-time">{chap.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- CỘT PHẢI: Bảng xếp hạng --- */}
        <div className="sidebar">
          <div className="top-widget">
            <div className="top-tabs">
              <button
                className={`tab-btn ${activeTab === "thang" ? "active" : ""}`}
                onClick={() => setActiveTab("thang")}
              >
                Top Tháng
              </button>
              <button
                className={`tab-btn ${activeTab === "tuan" ? "active" : ""}`}
                onClick={() => setActiveTab("tuan")}
              >
                Top Tuần
              </button>
              <button
                className={`tab-btn ${activeTab === "ngay" ? "active" : ""}`}
                onClick={() => setActiveTab("ngay")}
              >
                Top Ngày
              </button>
            </div>

            <div className="top-list">
              {topComics.map((comic, index) => (
                <div 
                  key={comic.id} 
                  className="top-item" 
                  onClick={() => navigate(`/comic/${comic.id}`)} 
                  style={{ cursor: 'pointer' }} // Thêm hiệu ứng trỏ chuột và bấm vào để đọc truyện
                >
                  <div className="top-rank">0{index + 1}</div>
                  
                  {/* Sửa thành comic.thumbnail để lấy ảnh thật từ API */}
                  <img
                    src={comic.thumbnail || "https://via.placeholder.com/50x65/222/fff?text=No+Image"}
                    alt={comic.title}
                    className="top-thumb"
                  />
                  
                  <div className="top-detail">
                    <h4>{comic.title}</h4>
                    <p>
                      {/* Tạm ẩn Chapter, chỉ hiện View từ DB */}
                      👁️ {comic.views} lượt xem
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
