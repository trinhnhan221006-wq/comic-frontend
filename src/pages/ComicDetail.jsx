import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getComicDetail } from "../services/api";
import "./ComicDetail.css"; // Nhớ import file CSS nhé
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ComicDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [comic, setComic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowed, setIsFollowed] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(false);

  // 1. State để lưu trạng thái "Đang theo dõi" hay chưa
  const [isFollowing, setIsFollowing] = useState(false);

  // 2. Kiểm tra bộ nhớ lúc vừa vào trang xem trước đó đã bấm theo dõi chưa
  useEffect(() => {
    // Lấy mảng ID các truyện đã theo dõi từ localStorage (nếu không có thì trả về mảng rỗng [])
    const followedComics =
      JSON.parse(localStorage.getItem("followedComics")) || [];

    // Nếu ID của truyện hiện tại có nằm trong mảng đó -> Bật cờ "Đã theo dõi"
    if (followedComics.includes(id)) {
      setIsFollowing(true);
    }
  }, [id]);

  // HÀM XỬ LÝ KHI BẤM NÚT THEO DÕI
  const handleFollowComic = async () => {
    const token = localStorage.getItem("userToken");

    // Nếu chưa đăng nhập thì bắt đăng nhập
    if (!token) {
      alert("Đạo hữu cần đăng nhập để cất truyện vào Tàng Kinh Các!");
      return;
    }

    setLoadingFollow(true);
    try {
      const response = await axios.post(
        "http://truyentranhlocal.local/wp-json/tu-tien/v1/theo-doi",
        {
          comic_id: id, // Gửi ID của bộ truyện xuống
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Kẹp lệnh bài
          },
        },
      );

      // Nhận kết quả và cập nhật giao diện (tim đỏ / tim trắng)
      setIsFollowed(response.data.is_followed);
      alert(response.data.message);
    } catch (error) {
      console.error("Lỗi khi theo dõi:", error);
      alert("Có lỗi xảy ra, không thể niệm chú!");
    } finally {
      setLoadingFollow(false);
    }
  };

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        // 1. Lấy thông tin tổng quan của truyện (Ảnh bìa, tên, mô tả)
        const data = await getComicDetail(id);

        // 2. Gọi API Mini để lấy riêng phần mô tả
        const descRes = await axios.get(
          `http://truyentranhlocal.local/wp-json/truyen/v1/mota/${id}`,
        );

        // Gắn cái mô tả vừa lấy được vào biến data
        if (data) {
          data.description = descRes.data.description;
        }

        // 2. Gọi API lấy danh sách chương thật
        const res = await axios.get(
          `http://truyentranhlocal.local/wp-json/wp/v2/manga-chapter-api?manga_series=${id}`,
        );

        // 3. Map dữ liệu WordPress sang format của giao diện
        if (data) {
          data.chapters = res.data.map((chap) => ({
            id: chap.id,
            name: chap.title.rendered, // Tên chương thật
            created_at: new Date(chap.date).toLocaleDateString("vi-VN"), // Ngày đăng chuẩn VN
          }));
        }

        setComic(data);
      } catch (error) {
        console.error("Lỗi khi kéo dữ liệu thật:", error);
      }
      setLoading(false);
    };

    fetchDetail();
  }, [id]);

  const handleReadFirst = () => {
    // Kiểm tra xem truyện đã load xong và có chương nào chưa
    if (comic?.chapters && comic.chapters.length > 0) {
      // Mảng xếp từ mới -> cũ, nên chương 1 nằm ở vị trí CUỐI CÙNG của mảng
      const firstChapter = comic.chapters[comic.chapters.length - 1];

      // Chuyển hướng sang trang Chapter
      navigate(`/comic/${id}/chapter/${firstChapter.id}`);
    } else {
      alert("Truyện này hiện chưa có chương nào!");
    }
  };

  if (loading)
    return <div className="loading-text">Đang tải dữ liệu truyện...</div>;
  if (!comic)
    return <div className="error-text">Không tìm thấy truyện này!</div>;

  // Dữ liệu mẫu cho danh sách chương (Sau này sẽ lấy từ API)
  const dummyChapters = [153, 152, 151, 150, 149, 148, 147, 146, 145];

  return (
    <div className="detail-container">
      {/* 1. PHẦN THÔNG TIN TRUYỆN (BÊN TRÊN) */}
      <div className="info-section">
        {/* Cột trái: Ảnh bìa + Nút bấm */}
        <div className="info-left">
          <img
            src={comic.thumbnail || "https://via.placeholder.com/250x350"}
            alt="Bìa truyện"
            className="comic-cover-img"
          />
          <div className="action-buttons">
            <button
              onClick={handleFollowComic}
              disabled={loadingFollow}
              style={{
                backgroundColor: isFollowed ? "#e50914" : "#333", // Đã theo dõi thì màu đỏ, chưa thì màu xám
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              {loadingFollow
                ? "Đang niệm chú..."
                : isFollowed
                  ? "♥️ Đã Theo Dõi"
                  : "🤍 Theo Dõi"}
            </button>
            <button className="btn-notify">🔔 Thông Báo</button>
          </div>
          <button className="btn-read-first" onClick={handleReadFirst}>
            Đọc Từ Đầu
          </button>
        </div>

        {/* Cột phải: Chi tiết truyện */}
        <div className="info-right">
          <h1 className="comic-title">
            {comic.title?.rendered || comic.title}
          </h1>

          <div className="tags">
            <span className="tag">Huyền Bí</span>
            <span className="tag">Phiêu Lưu</span>
            <span className="tag">Manhwa</span>
            <span className="tag">Hành Động</span>
          </div>

          <div
            className="manga-description"
            style={{ color: "#ccc", marginTop: "20px", lineHeight: "1.6" }}
          >
            {/* Dùng dangerouslySetInnerHTML để React dịch các thẻ xuống dòng của WordPress */}
            <div
              dangerouslySetInnerHTML={{
                __html: comic?.description || "Chưa có tóm tắt nội dung.",
              }}
            />
          </div>

          <div className="meta-info">
            <p>
              <strong>Tên khác:</strong> Đang cập nhật
            </p>
            <p>
              <strong>Tác giả:</strong> Updating
            </p>
            <p>
              <strong>Trạng thái:</strong>{" "}
              <span className="status-ongoing">Đang Thực Hiện</span>
            </p>
          </div>
        </div>
      </div>

      {/* 2. PHẦN DANH SÁCH CHƯƠNG (GIỮA) */}
      <div className="chapter-section">
        <div className="section-header">
          <h2>Danh Sách Chương</h2>
        </div>

        <div className="chapter-grid">
          {/* Kiểm tra xem truyện có mảng chapters không rồi mới map() */}
          {comic.chapters && comic.chapters.length > 0 ? (
            comic.chapters.map((chap, index) => (
              <Link
                to={`/comic/${id}/chapter/${chap.id}`}
                key={index}
                className="chapter-card"
              >
                <div className="chap-info">
                  <span className="chap-number">
                    {chap.name || `Chương ${index + 1}`}
                  </span>
                  <span className="chap-time">
                    {chap.created_at || "Vừa xong"}
                  </span>
                </div>
                <span className="chap-views">👁️ Tự do</span>
              </Link>
            ))
          ) : (
            <p style={{ color: "#aaa", padding: "20px" }}>
              Truyện này chưa có chương nào, hoặc API chưa cấu hình đúng!
            </p>
          )}
        </div>
      </div>

      {/* 3. PHẦN BÌNH LUẬN (DƯỚI CÙNG) */}
      <div className="comment-section">
        <h2 className="section-header-simple">BÌNH LUẬN</h2>
        <div className="comment-box">
          <textarea placeholder="Người tiện tay vẽ hoa vẽ lá, Tôi đa tình tưởng đó là mùa xuân..."></textarea>
          <button className="btn-send">GỬI</button>
        </div>
      </div>
    </div>
  );
};

export default ComicDetail;
