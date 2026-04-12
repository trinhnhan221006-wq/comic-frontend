import { useEffect, useState } from "react";
import { getComics } from "../services/api"; 
import Banner from "../components/Banner"; 
import "./Home.css";

const Home = () => {
  const [activeTab, setActiveTab] = useState("thang");
  const [recentComics, setRecentComics] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Dữ liệu giả cho Cột Phải (Bảng xếp hạng)
  const topComics = [
    { id: 101, title: "Bách Luyện Thành Thần", chapter: "Chapter 1295", views: "702K", image: "https://via.placeholder.com/50x65/222/fff?text=Top+1" },
    { id: 102, title: "Đại Phụng Đả Canh Nhân", chapter: "Chapter 623", views: "529K", image: "https://via.placeholder.com/50x65/222/fff?text=Top+2" },
    { id: 103, title: "Tinh Giáp Hồn Tướng", chapter: "Chapter 357", views: "531K", image: "https://via.placeholder.com/50x65/222/fff?text=Top+3" },
    { id: 104, title: "Từ Kỵ Luật Ta Đây", chapter: "Chapter 132", views: "89K", image: "https://via.placeholder.com/50x65/222/fff?text=Top+4" },
    { id: 105, title: "Mỗi Tuần Ta Có Một Nghề", chapter: "Chapter 891", views: "359K", image: "https://via.placeholder.com/50x65/222/fff?text=Top+5" },
  ];

  return (
    <div>
      <Banner />
      
      <div className="home-layout">
        {/* --- CỘT TRÁI: Truyện mới cập nhật --- */}
        <div className="main-content">
          <h2 className="section-title">
            <span>Cập Nhật Gần Đây</span>
          </h2>

          {loading && (
            <p style={{ color: "white", padding: "20px" }}>Đang kết nối đến WordPress...</p>
          )}

          {!loading && recentComics.length === 0 && (
            <p style={{ color: "red", padding: "20px" }}>
              Không tìm thấy truyện nào. Hãy kiểm tra lại API hoặc tạo truyện trong Toocheke!
            </p>
          )}

          <div className="comic-grid">
            {recentComics.map((comic) => (
              <div key={comic.id} className="comic-card-dark">
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
                <div key={comic.id} className="top-item">
                  <div className="top-rank">0{index + 1}</div>
                  <img src={comic.image} alt={comic.title} className="top-thumb" />
                  <div className="top-detail">
                    <h4>{comic.title}</h4>
                    <p>{comic.chapter} • 👁️ {comic.views}</p>
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