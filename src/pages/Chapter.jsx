import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getChapterImages } from "../services/api";
import axios from "axios";

const Chapter = () => {
  // Lấy cả ID truyện và số chương từ đường dẫn
  const { id, chapterId } = useParams();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chapterList, setChapterList] = useState([]);

  useEffect(() => {
    // 1. Dùng cái này để lấy dữ liệu ảnh
    const fetchImages = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://truyentranhlocal.local/wp-json/wp/v2/manga-chapter-api/${chapterId}`,
        );

        // Lấy trực tiếp mảng ảnh mà Nhân vừa tạo ra
        const imgUrls = res.data?.images_url || [];

        console.log("Ảnh truyện 'tươi sống' đã về:", imgUrls);
        setImages(imgUrls);
      } catch (err) {
        console.error("Lỗi rồi hai bro ơi:", err);
      }
      setLoading(false);
    };
    fetchImages();
  }, [chapterId]);

  // 2. THÊM MỚI: Lấy danh sách toàn bộ chương của bộ truyện này
  useEffect(() => {
    const fetchChapterList = async () => {
      try {
        // Dùng cái link API Nhân đã thông nòng đêm qua
        const res = await axios.get(
          `http://truyentranhlocal.local/wp-json/wp/v2/manga-chapter-api?manga_series=${id}`,
        );
        setChapterList(res.data);
      } catch (err) {
        console.error("Lỗi lấy danh sách chương:", err);
      }
    };
    fetchChapterList();
  }, [id]);

  // 3. Hàm xử lý logic chuyển chương
  const handleNavigate = (direction) => {
    if (chapterList.length === 0) return;

    // Tìm xem chương hiện tại đang đứng ở vị trí số mấy trong mảng
    // Lưu ý: params từ URL là dạng chuỗi (string), nên cần ép kiểu (Number)
    const currentIndex = chapterList.findIndex(
      (chap) => chap.id === Number(chapterId),
    );

    if (currentIndex === -1) return;

    if (direction === "next") {
      // Vì mảng đang xếp từ Mới -> Cũ (vd: [Chap 4, Chap 3, Chap 2, Chap 1])
      // Đang ở Chap 1 (index 3), muốn sang Chap 2 thì phải LÙI index lại (index 2)
      if (currentIndex > 0) {
        const nextChapterId = chapterList[currentIndex - 1].id;
        navigate(`/comic/${id}/chapter/${nextChapterId}`);
      } else {
        alert("Bạn đã đọc đến chương mới nhất!");
      }
    } else if (direction === "prev") {
      // Đang ở Chap 2 (index 2), muốn về Chap 1 thì phải TĂNG index lên (index 3)
      if (currentIndex < chapterList.length - 1) {
        const prevChapterId = chapterList[currentIndex + 1].id;
        navigate(`/comic/${id}/chapter/${prevChapterId}`);
      } else {
        alert("Đây là chương đầu tiên rồi!");
      }
    }
  };

  // Gọi API tăng view một cách thầm lặng khi Vui vào đọc truyện
  useEffect(() => {
    if (id) {
      // Dùng axios.post vì nãy Nhân cấu hình 'methods' => 'POST'
      axios
        .post(`http://truyentranhlocal.local/wp-json/truyen/v1/tang-view/${id}`)
        .then((response) => {
          // Bật console log lên xem view nó nhảy chưa (xong rồi thì xóa đi cho sạch)
          console.log(
            "Đã tăng view! Số view hiện tại:",
            response.data.new_views,
          );
        })
        .catch((err) => {
          console.error("Lỗi đếm view:", err);
        });
    }
  }, [id]); // id ở đây là ID của bộ truyện (ví dụ: 64)

  // THÊM ĐOẠN NÀY VÀO TRONG COMPONENT:
  useEffect(() => {
    const tangTuVi = async () => {
      // Lấy Lệnh Bài
      const token = localStorage.getItem("userToken");

      // Nếu là "người phàm" (chưa đăng nhập) thì không cho tu luyện
      if (!token) return;

      try {
        await axios.post(
          "http://truyentranhlocal.local/wp-json/tu-tien/v1/cong-exp",
          {
            comic_id: id, // Gửi ID truyện (lấy từ useParams)
            chapter_name: chapterData?.title, // Gửi tên chương đang đọc
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        // (Tùy chọn): Có thể dùng console.log để Vui kiểm tra ngầm xem điểm lên chưa
        console.log("🔥 Đã hấp thu đan dược: Tu vi +10!");
      } catch (error) {
        console.error("Vận công tẩu hỏa nhập ma (Lỗi cộng điểm):", error);
      }
    };

    // Gọi hàm này ngay khi truy cập vào trang Đọc Truyện
    tangTuVi();
  }, []);

  return (
    <div
      style={{
        backgroundColor: "#000",
        minHeight: "100vh",
        paddingBottom: "50px",
      }}
    >
      {/* THANH ĐIỀU HƯỚNG TRÊN CÙNG (Dính chặt trên top khi cuộn) */}
      <div
        style={{
          backgroundColor: "#1a1a1a",
          padding: "15px 20px",
          position: "sticky",
          top: 0,
          zIndex: 100,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #333",
        }}
      >
        <Link
          to={`/comic/${id}`}
          style={{
            color: "#e50914",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          ⬅ Trở về truyện
        </Link>
        <span style={{ color: "#fff", fontSize: "1.2rem" }}>
          Chương {chapterId}
        </span>
        <div style={{ color: "#888", fontSize: "0.9rem" }}>Báo lỗi</div>
      </div>

      {/* KHU VỰC HIỂN THỊ ẢNH TRUYỆN */}
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {loading ? (
          <p style={{ color: "#fff", textAlign: "center", padding: "50px" }}>
            Đang tải hình ảnh...
          </p>
        ) : (
          images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Trang ${index + 1}`}
              style={{ width: "100%", display: "block", objectFit: "contain" }}
            />
          ))
        )}
      </div>

      {/* THANH ĐIỀU HƯỚNG DƯỚI CÙNG */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginTop: "40px",
        }}
      >
        <button
          onClick={() => handleNavigate("prev")}
          style={{
            padding: "10px 20px",
            backgroundColor: "#333",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Chương Trước
        </button>
        <button
          onClick={() => handleNavigate("next")}
          style={{
            padding: "10px 20px",
            backgroundColor: "#e50914",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Chương Tiếp Theo
        </button>
      </div>
    </div>
  );
};

export default Chapter;
