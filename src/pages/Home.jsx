import { useEffect, useState } from "react";
import { getComics } from "../services/api";
import { useLocation, useNavigate } from "react-router-dom";
import Banner from "../components/Banner";
import "./Home.css";
import axios from "axios";

const Home = () => {
  const navigate = useNavigate();

  // 🔎 Lấy keyword từ URL (?q=...)
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const keyword = query.get("q") || "";

  const [activeTab, setActiveTab] = useState("thang");
  const [recentComics, setRecentComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topComics, setTopComics] = useState([]);
  const [featuredComics, setFeaturedComics] = useState([]);

  // 🔥 Decode Unicode
  const decodeUnicode = (str) => {
    try {
      return JSON.parse(`"${str}"`);
    } catch (e) {
      return str;
    }
  };

  // 🔥 FILTER SEARCH
  const filteredComics = recentComics.filter((comic) =>
    comic.title.toLowerCase().includes(keyword.toLowerCase())
  );

  // 🔄 Load truyện
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
            views: "10K",
            likes: "1K",
            chapters: [{ name: "Chương mới", time: "Vừa xong" }],
          }));

          setRecentComics(formattedComics);

          // 🎯 Banner (3 truyện đầu)
          const top3Comics = formattedComics.slice(0, 3);

          for (let comic of top3Comics) {
            try {
              const descRes = await axios.get(
                `http://truyentranhlocal.local/wp-json/truyen/v1/mota/${comic.id}`
              );
              comic.description = descRes.data.description;
            } catch {
              comic.description =
                "Đang cập nhật nội dung cho bộ truyện này...";
            }
          }

          setFeaturedComics(top3Comics);
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWpData();
  }, []);

  // 🔄 Load bảng xếp hạng
  useEffect(() => {
    const fetchTopComics = async () => {
      try {
        const res = await axios.get(
          "http://truyentranhlocal.local/wp-json/truyen/v1/top-truyen"
        );
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
      {/* Banner */}
      <Banner comics={featuredComics} />

      <div className="home-layout">
        {/* LEFT */}
        <div className="main-content">
          <h2 className="section-title">
            <span>
              {keyword ? `Kết quả tìm kiếm: "${keyword}"` : "Cập Nhật Gần Đây"}
            </span>
          </h2>

          {loading && (
            <p style={{ color: "white", padding: "20px" }}>
              Đang tải dữ liệu...
            </p>
          )}

          {!loading && filteredComics.length === 0 && (
            <p style={{ color: "red", padding: "20px" }}>
              Không tìm thấy truyện phù hợp
            </p>
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

        {/* RIGHT */}
        <div className="sidebar">
          <div className="top-widget">
            <div className="top-tabs">
              <button
                className={`tab-btn ${
                  activeTab === "thang" ? "active" : ""
                }`}
                onClick={() => setActiveTab("thang")}
              >
                Top Tháng
              </button>
              <button
                className={`tab-btn ${
                  activeTab === "tuan" ? "active" : ""
                }`}
                onClick={() => setActiveTab("tuan")}
              >
                Top Tuần
              </button>
              <button
                className={`tab-btn ${
                  activeTab === "ngay" ? "active" : ""
                }`}
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
                  style={{ cursor: "pointer" }}
                >
                  <div className="top-rank">0{index + 1}</div>

                  <img
                    src={
                      comic.thumbnail ||
                      "https://via.placeholder.com/50x65/222/fff?text=No+Image"
                    }
                    alt={comic.title}
                    className="top-thumb"
                  />

                  <div className="top-detail">
                    <h4>{comic.title}</h4>
                    <p>👁️ {comic.views} lượt xem</p>
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