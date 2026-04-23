import { useEffect, useState } from "react";
import { getComics } from "../services/api";
import { useLocation, useNavigate } from "react-router-dom";
import Banner from "../components/Banner";
import "./Home.css";
import axios from "axios";

// Dán hàm này ở ngoài, bên trên Component Home
const decodeUnicode = (text) => {
  if (!text) return "";
  const txt = document.createElement("textarea");
  txt.innerHTML = text;
  return txt.value;
};

const Home = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const keyword = query.get("q") || "";

  const [activeTab, setActiveTab] = useState("thang");
  const [recentComics, setRecentComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topComics, setTopComics] = useState([]);
  const [allComics, setAllComics] = useState([]);
  const [featuredComics, setFeaturedComics] = useState([]);
  // Biến lưu trang hiện tại (mặc định là trang 1)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // Số truyện 1 trang

  // Biến lưu tổng số trang (mặc định là 1, sẽ được API cập nhật)
  const totalPages = Math.ceil(allComics.length / itemsPerPage) || 1;

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
    comic.title.toLowerCase().includes(keyword.toLowerCase()),
  );

  // 3. GỌI API ĐÚNG 1 LẦN DUY NHẤT LÚC LOAD TRANG
  useEffect(() => {
    const fetchWpData = async () => {
      setLoading(true);
      try {
        // DÙNG LẠI HÀM GETCOMICS CỦA BRO (Tuyệt đối an toàn)
        const data = await getComics();

        if (data && data.length > 0) {
          const formattedComics = data.map((item) => {
            // Ép kiểu mảng chapters (Lấy tối đa 2 chap mới nhất)
            return {
              id: item.id,
              title: decodeUnicode(item.title),
              image:
                item.thumbnail ||
                "https://via.placeholder.com/150x200/333/fff?text=No+Image",
              views: item.views || 0, // Lấy data thật 100%
              followers: item.likes || 0, // Lấy data thật 100%
              chapters: item.chapters || [], // Mảng 2 chap mới nhất từ WordPress gửi lên
            };
          });

          // Lưu toàn bộ 16+ bộ truyện vào kho
          setAllComics(formattedComics);

          // Xử lý 3 truyện nổi bật (Top 3)
          const top3Comics = formattedComics.slice(0, 3);
          for (let comic of top3Comics) {
            try {
              const descRes = await axios.get(
                `http://truyentranhlocal.local/wp-json/truyen/v1/mota/${comic.id}`,
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
  }, []); // Ngoặc rỗng = Chỉ chạy 1 lần

  // 4. MỖI KHI BẤM CHUYỂN TRANG -> CẮT 12 BỘ RA HIỂN THỊ
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    // Cắt dữ liệu từ kho allComics đổ vào recentComics để vẽ ra màn hình
    setRecentComics(allComics.slice(startIndex, endIndex));
  }, [currentPage, allComics]);

  // 🔄 TOP
  useEffect(() => {
    const fetchTopComics = async () => {
      try {
        const res = await axios.get(
          "http://truyentranhlocal.local/wp-json/truyen/v1/top-truyen",
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
              <div key={comic.id} className="comic-card-dark">
                {/* Phần ảnh bìa và Thống kê */}
                <div
                  className="card-thumb"
                  onClick={() => navigate(`/comic/${comic.id}`)}
                >
                  <img
                    src={comic.image || "https://placehold.co/150x220/333/FFF?text=No+Image"}
                    alt={comic.title}
                  />

                  {/* Thanh đen mờ dưới đáy ảnh hiện View và Follow */}
                  <div className="card-stats">
                    <span>👁️ {formatNumber(comic.views)}</span>
                    <span>🔖 {formatNumber(comic.followers)}</span>
                  </div>
                </div>

                {/* Phần thông tin và 2 Chap mới nhất */}
                <div className="card-info">
                  <h3 onClick={() => navigate(`/comic/${comic.id}`)} style={{ cursor: "pointer" }}>
                    {comic.title}
                  </h3>

                  <div className="chapter-list">
                    {comic.chapters &&
                      comic.chapters.length > 0 &&
                      comic.chapters.map((chap, idx) => (
                        <div
                          key={idx}
                          className="chapter-item"
                          onClick={(e) => {
                            e.stopPropagation(); 
                            navigate(`/comic/${comic.id}/chapter/${chap.id}`);
                          }}
                          style={{ cursor: "pointer" }}
                        >
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
                      src={comic.thumbnail || "https://placehold.co/50x65/333/FFF?text=Top"}
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
      {/* THANH CHUYỂN TRANG*/}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginTop: "40px",
          paddingBottom: "40px",
          position: "relative",
          zIndex: 999,
        }}
      >
        <button
          className="btn btn-secondary"
          disabled={currentPage === 1}
          onClick={() => {
            setCurrentPage(currentPage - 1);
            window.scrollTo({ top: 0, behavior: "smooth" }); // Cuộn mượt lên đầu
          }}
          style={{
            cursor: currentPage === 1 ? "not-allowed" : "pointer",
            padding: "10px 20px",
          }}
        >
          « Trang trước
        </button>

        <span
          style={{
            color: "white",
            alignSelf: "center",
            fontWeight: "bold",
            fontSize: "1.1rem",
          }}
        >
          Trang {currentPage} / {totalPages}
        </span>

        <button
          className="btn btn-danger"
          disabled={currentPage === totalPages}
          onClick={() => {
            setCurrentPage(currentPage + 1);
            window.scrollTo({ top: 0, behavior: "smooth" }); // Cuộn mượt lên đầu
          }}
          style={{
            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
            padding: "10px 20px",
          }}
        >
          Trang sau »
        </button>
      </div>
    </div>
  );
};

export default Home;
