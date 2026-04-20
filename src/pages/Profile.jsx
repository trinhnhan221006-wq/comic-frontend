import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, ProgressBar, Row, Col, Badge, Container } from "react-bootstrap";
import "./Profile.css";
import { doiTenUser } from "../services/api";

const Profile = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🟢 THÊM MỚI: State để lưu lịch sử đọc
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("userToken");
      if (!token) {
        navigate("/dangnhap");
        return;
      }

      try {
        const response = await axios.get(
          "http://truyentranhlocal.local/wp-json/tu-tien/v1/ho-so",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setProfileData(response.data);
      } catch (error) {
        console.error("Lỗi:", error);
        navigate("/dangnhap");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();

    // 🟢 THÊM MỚI: Móc sổ lịch sử từ Trình duyệt ra khi load trang
    const localHistory = JSON.parse(localStorage.getItem("lich_su_doc")) || [];
    setHistory(localHistory);
  }, [navigate]);

  // Hàm xử lý khi bấm nút Đổi Tên (ĐÃ FIX ĐỒNG BỘ HEADER)
  const handleDoiTen = async () => {
    const tenMoi = prompt(
      "Đạo hữu muốn đổi tên thành gì?",
      profileData.display_name,
    );

    if (tenMoi && tenMoi.trim() !== "" && tenMoi !== profileData.display_name) {
      const result = await doiTenUser(tenMoi);
      if (result && result.success) {
        alert("Đổi tên thành công!");

        // 1. Cập nhật lại kho lưu trữ cục bộ (để Header đọc được tên mới)
        let currentUser = JSON.parse(localStorage.getItem("user")) || {};
        currentUser.display_name = result.new_name;
        localStorage.setItem("user", JSON.stringify(currentUser));
        323
        window.location.reload();
      } else {
        alert("Đổi tên thất bại. Đạo hữu vui lòng kiểm tra lại mạng!");
      }
    }
  };

  if (loading)
    return <div className="loading-txt">Đang dò xét Đan Điền...</div>;
  if (!profileData) return null;

  const expPercent = Math.min(
    (profileData.exp / profileData.exp_next_level) * 100,
    100,
  );

  return (
    <div className="profile-page">
      <Container>
        <Card className="profile-card">
          <Card.Body>
            <Row>
              {/* Phía trên giữ nguyên... */}
              <Col md={4} className="text-center">
                <div className="avatar-wrapper">
                  <img
                    src={
                      profileData.avatar || "https://via.placeholder.com/150"
                    }
                    alt="Avatar"
                    className="profile-avatar"
                  />
                </div>
              </Col>
              <Col md={8}>
                <div className="user-info text-white">
                  {" "}
                  {/* Ép trắng toàn cục */}
                  <h2 className="mb-1 d-flex align-items-center text-white">
                    {profileData.display_name}
                    <button
                      className="btn btn-sm btn-outline-warning ms-3"
                      onClick={handleDoiTen}
                    >
                      ✏️ Đổi tên
                    </button>
                  </h2>
                  <p className="text-light">{profileData.email}</p>{" "}
                  {/* Dùng text-light cho email mờ đi 1 xíu cho sang */}
                  <div className="level-badges mt-3">
                    <Badge bg="warning" text="dark" className="me-2 badge-lg">
                      Cảnh Giới: {profileData.level}
                    </Badge>
                    {/* Ép chữ trắng cho cục EXP */}
                    <Badge bg="danger" text="white" className="badge-lg">
                      EXP: {profileData.exp} / {profileData.exp_next_level}
                    </Badge>
                  </div>
                  <div className="exp-section mt-4">
                    {/* Ép trắng và in đậm cho dòng chữ Tiến độ đột phá */}
                    <div className="d-flex justify-content-between mb-1 text-white fw-bold">
                      <span>Tiến độ Đột Phá</span>
                      <span>{Math.floor(expPercent)}%</span>
                    </div>
                    <ProgressBar
                      variant="warning"
                      now={expPercent}
                      className="exp-bar"
                    />
                  </div>
                </div>
              </Col>
            </Row>

            <hr className="my-5" />

            <Row>
              {/* 🟢 THÊM MỚI: Khu vực Lịch Sử Đọc (Lấy từ LocalStorage) */}
              <Col lg={12} className="mb-5">
                <h2 className="section-title">
                  🕒 Lịch Sử Tu Luyện (Đọc gần đây)
                </h2>
                <div className="d-flex gap-4 flex-wrap">
                  {history.length > 0 ? (
                    history.map((item, index) => (
                      <div
                        key={index}
                        className="comic-item-card"
                        onClick={() =>
                          navigate(
                            `/comic/${item.comicId}/chapter/${item.chapterId}`,
                          )
                        }
                      >
                        <img
                          src={
                            item.image ||
                            "https://placehold.co/150x220/333/FFF?text=No+Image"
                          }
                          alt={item.comicTitle}
                          width="100%"
                          height="220px"
                          style={{ objectFit: "cover" }}
                        />
                        <h6 className="text-truncate mt-2">
                          {item.comicTitle}
                        </h6>
                        <span
                          className="chapter-badge text-warning"
                          style={{ fontSize: "0.85rem" }}
                        >
                          Đang đọc: {item.chapterName}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted" style={{ fontStyle: "italic" }}>
                      Đạo hữu chưa đọc bộ truyện nào.
                    </p>
                  )}
                </div>
              </Col>

              {/* Tàng Kinh Các (Theo dõi) - GIỮ NGUYÊN */}
              <Col lg={12}>
                <h2 className="section-title">
                  📚 Tàng Kinh Các (Đang theo dõi)
                </h2>
                <div className="d-flex gap-4 flex-wrap">
                  {profileData.theo_doi && profileData.theo_doi.length > 0 ? (
                    profileData.theo_doi.map((comic) => (
                      <div
                        key={comic.id}
                        className="comic-item-card"
                        onClick={() => navigate(`/comic/${comic.id}`)}
                      >
                        <img
                          src={
                            comic.image ||
                            "https://placehold.co/150x220/333/FFF?text=No+Image"
                          }
                          alt={comic.title}
                          width="100%"
                          height="220px"
                          style={{ objectFit: "cover" }}
                        />
                        <h6 className="text-truncate mt-2">{comic.title}</h6>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted" style={{ fontStyle: "italic" }}>
                      Tàng Kinh Các đang trống không.
                    </p>
                  )}
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default Profile;
