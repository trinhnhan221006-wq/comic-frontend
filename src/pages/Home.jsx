import { useEffect, useState } from "react";
import { getComics } from "../services/api";
import { useLocation, useNavigate } from "react-router-dom";
import Banner from "../components/Banner";
import "./Home.css";
import axios from "axios";

const Home = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const keyword = query.get("q") || "";

  const [activeTab, setActiveTab] = useState("thang");
  const [recentComics, setRecentComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topComics, setTopComics] = useState([]);
  const [featuredComics, setFeaturedComics] = useState([]);

  // 🔥 format số
  const formatNumber = (num) => {
    if (!num) return "0";
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num;
  };

  // 🔥 decode unicode
  const decodeUnicode = (str) => {
    try {
      return JSON.parse(`"${str}"`);
    } catch {
      return str;
    }
  };

  // 🔎 FILTER
  const filteredComics = recentComics.filter((comic) =>
    comic.title.toLowerCase().includes(keyword.toLowerCase())
  );

  // 🔄 LOAD TRUYỆN
  useEffect(() => {
    const fetchWpData = async () => {
      setLoading(true);
      try {
        const data = await getComics();

        if (data && data.length > 0) {
          const formattedComics = data.map((item) => ({
            id: item.id,
            title: decodeUnicode(item.title),
            image: item.thumbnail,

            // ✅ lấy dữ liệu thật nếu có
            views: item.views || 0,
            likes: item.likes || 0,

            // ✅ CHAP ĐẦU TIÊN
            chapter: item.chapter || "Chương 1",
            time: item.time || "Mới cập nhật",
          }));

          setRecentComics(formattedComics);

          const top3Comics = formattedComics.slice(0, 3);

          for (let comic of top3Comics) {
            try {
              const descRes = await axios.get(
                `http://truyentranhlocal.local/wp-json/truyen/v1/mota/${comic.id}`
              );
              comic.description = descRes.data.description;
            } catch {
              comic.description = "Đang cập nhật nội dung...";
            }
          }

          setFeaturedComics(top3Comics);
        }
      } catch (error) {
        console.error("Lỗi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWpData();
  }, []);

  // 🔄 TOP
  useEffect(() => {
    const fetchTopComics = async () => {
      try {
        const res = await axios.get(
          "http://truyentranhlocal.local/wp-json/truyen/v1/top-truyen"
        );
        setTopComics(res.data);
      } catch (error) {
        console.error("Lỗi top:", error);
      }
    };
    fetchTopComics();
  }, []);

  return (
    <div style={{ backgroundColor: "#121212", minHeight: "100vh" }}>
      <Banner comics={featuredComics} />

      <div className="home-layout">
        {/* LEFT */}
        <div className="main-content">
          <h2 className="section-title">
            <span>
              {keyword ? `Kết quả: "${keyword}"` : "Cập nhật gần đây"}
            </span>
          </h2>

          {loading && <p style={{ color: "white" }}>Đang tải...</p>}

          {!loading && filteredComics.length === 0 && (
            <p style={{ color: "red" }}>Không tìm thấy truyện</p>
          )}

          <div className="comic-grid">
            {filteredComics.map((comic) => (
              <div
                key={comic.id}
                className="comic-card-dark"
                onClick={() => navigate(`/comic/${comic.id}`)}
              >
                <div className="card-thumb">
                  <img src={comic.image} alt={comic.title} />

                  {/* 👁️ ❤️ */}
                  <div className="card-stats">
                    <span>👁️ {formatNumber(comic.views)}</span>
                    <span>❤️ {formatNumber(comic.likes)}</span>
                  </div>
                </div>

                <div className="card-info">
                  <h3>{comic.title}</h3>

                  {/* 🔥 CHAP HIỆN NGOÀI */}
                  <div className="chapter-item">
                    <span className="chapter-name">
                      {comic.chapter}
                    </span>
                    <span className="chapter-time">
                      {comic.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
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
      {topComics
        .filter((comic) => comic.type === activeTab || !comic.type) 
        .map((comic, index) => (
          <div
            key={comic.id}
            className="top-item"
            onClick={() => navigate(`/comic/${comic.id}`)}
            style={{ cursor: "pointer" }}
          >
            <div className="top-rank">0{index + 1}</div>

            <img
              src={comic.thumbnail}
              alt={comic.title}
              className="top-thumb"
            />

            <div className="top-detail">
              <h4>{comic.title}</h4>
              <p>👁️ {formatNumber(comic.views)}</p>
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