import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { tangViewTruyen, tangExpUser } from '../services/api';
import { getComicDetail } from '../services/api';


const Chapter = () => {
  const { id, chapterId } = useParams();
  const navigate = useNavigate();

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chapterList, setChapterList] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false); // ✅ FIX

  // 🔥 LẤY ẢNH VÀ TĂNG VIEW
  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://truyentranhlocal.local/wp-json/wp/v2/manga-chapter-api/${chapterId}`
        );
        setImages(res.data?.images_url || []);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    fetchImages(); // Gọi API lấy ảnh

    // 🚀 ĐẶT LỆNH TĂNG VIEW Ở NGAY ĐÂY:
    // Đảm bảo có comicId thì mới gọi hàm để tránh lỗi
    if (id && chapterId) {
      // 1. Tăng view cho truyện (Khách nào cũng tăng)
      tangViewTruyen(id);
      
      // 2. Bơm EXP cho Đạo hữu (Đã đăng nhập mới tăng)
      tangExpUser(id, `Chương ${chapterId}`);
    }

  // 💡 Nhớ kẹp thêm comicId vào cái mảng ngoặc vuông này nhé
  }, [chapterId, id]);
// Lấy thêm các thông tin này từ API (hoặc truyền qua thẻ Link) để lưu lịch sử cho đẹp
  // LƯU LỊCH SỬ ĐỌC (ĐÃ FIX LẤY ẢNH THẬT)
  useEffect(() => {
    const saveHistory = () => {
        if (id && chapterId) {
            // 1. Mở gói hàng tạm thời ra lấy ảnh thật và tên thật
            const truyenTam = JSON.parse(localStorage.getItem('truyen_tam_thoi')) || {};
            const realTitle = truyenTam.title || "Truyện Đang Đọc";
            const realImage = truyenTam.image || "https://placehold.co/150x220/333/FFF?text=No+Image";

            // 2. Lấy cuốn sổ lịch sử
            let history = JSON.parse(localStorage.getItem('lich_su_doc')) || [];
            
            // 3. Xóa lịch sử cũ của bộ này đi (nếu có)
            history = history.filter(item => item.comicId !== id);
            
            // 4. Ghi data THẬT lên dòng đầu tiên
            history.unshift({
                comicId: id,
                chapterId: chapterId,
                comicTitle: realTitle,           
                chapterName: "Chương " + chapterId,
                image: realImage,                
                time: new Date().getTime()
            });

            // Chỉ giữ 50 bộ
            if (history.length > 50) history.pop();
            
            // Cất sổ
            localStorage.setItem('lich_su_doc', JSON.stringify(history));
        }
    };

    saveHistory();
  }, [id, chapterId]);

  // 🔥 DANH SÁCH CHƯƠNG
  useEffect(() => {
    const fetchChapterList = async () => {
      try {
        const res = await axios.get(
          `http://truyentranhlocal.local/wp-json/wp/v2/manga-chapter-api?manga_series=${id}`
        );
        setChapterList(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchChapterList();
  }, [id]);

  // 🔥 CLICK NGOÀI ĐÓNG DROPDOWN
  useEffect(() => {
    const close = () => setShowDropdown(false);

    if (showDropdown) {
      document.addEventListener("click", close);
    }

    return () => document.removeEventListener("click", close);
  }, [showDropdown]);

  // 🔥 CHUYỂN CHƯƠNG
  const handleNavigate = (type) => {
    const index = chapterList.findIndex(
      (c) => c.id === Number(chapterId)
    );

    if (index === -1) return;

    if (type === "next" && index > 0) {
      navigate(`/comic/${id}/chapter/${chapterList[index - 1].id}`);
    }

    if (type === "prev" && index < chapterList.length - 1) {
      navigate(`/comic/${id}/chapter/${chapterList[index + 1].id}`);
    }
  };

  return (
    <div style={{ background: "#000", minHeight: "100vh" }}>
      {/* HEADER */}
      <div
        style={{
          background: "#111",
          padding: 15,
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        {/* BREADCRUMB */}
        <div style={{ color: "#aaa", marginBottom: 10 }}>
          <span onClick={() => navigate("/")}>Trang Chủ</span> ›{" "}
          <span onClick={() => navigate(`/comic/${id}`)}>Truyện</span> ›{" "}
          <span style={{ color: "red" }}>Chương {chapterId}</span>
        </div>

        {/* CONTROLS */}
        <div style={{ display: "flex", justifyContent: "center", gap: 60 }}>
          
          {/* TRƯỚC */}
          <div onClick={() => handleNavigate("prev")} style={{ cursor: "pointer", color: "#ccc", textAlign: "center" }}>
            <div>⏮</div>
            <small>TRƯỚC</small>
          </div>

          {/* ☰ DROPDOWN */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              setShowDropdown(!showDropdown);
            }}
            style={{ position: "relative", cursor: "pointer", color: "#ccc", textAlign: "center" }}
          >
            <div>☰</div>
            <small>CHƯƠNG</small>

            {showDropdown && (
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  position: "absolute",
                  top: 40,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 250,
                  maxHeight: 300,
                  overflowY: "auto",
                  background: "#1a1a1a",
                  border: "1px solid #333",
                  borderRadius: 6,
                }}
              >
                {chapterList.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      navigate(`/comic/${id}/chapter/${c.id}`);
                      setShowDropdown(false);
                    }}
                    style={{
                      padding: 10,
                      borderBottom: "1px solid #333",
                      color:
                        c.id === Number(chapterId) ? "red" : "#ccc",
                      cursor: "pointer",
                    }}
                  >
                    {c.title?.rendered || `Chương ${c.id}`}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SAU */}
          <div onClick={() => handleNavigate("next")} style={{ cursor: "pointer", color: "#ccc", textAlign: "center" }}>
            <div>⏭</div>
            <small>SAU</small>
          </div>

        </div>
      </div>

      {/* ẢNH */}
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        {loading ? (
          <p style={{ color: "#fff" }}>Loading...</p>
        ) : (
          images.map((img, i) => (
            <img key={i} src={img} style={{ width: "100%" }} />
          ))
        )}
      </div>
    </div>
  );
};

export default Chapter;