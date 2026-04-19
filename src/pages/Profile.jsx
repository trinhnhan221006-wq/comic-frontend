import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, ProgressBar, Row, Col, Badge } from "react-bootstrap";

const Profile = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      // 1. Lấy Lệnh Bài từ trong túi (localStorage) ra
      const token = localStorage.getItem("userToken");

      // Nếu không có Token -> Đá văng ra trang đăng nhập
      if (!token) {
        alert("Đạo hữu chưa đăng nhập! Vui lòng đăng nhập để vào Động Phủ.");
        navigate("/dangnhap");
        return;
      }

      try {
        // 2. GỌI API CÓ KÈM THEO TOKEN (Tuyệt kỹ bảo mật JWT)
        const response = await axios.get(
          "http://truyentranhlocal.local/wp-json/tu-tien/v1/ho-so",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Kẹp Token vào Header
            },
          },
        );

        // Hứng dữ liệu trả về
        setProfileData(response.data);
      } catch (error) {
        console.error("Lỗi lấy hồ sơ:", error);
        // Nếu Token hết hạn hoặc sai lệch -> Vứt bỏ và bắt đăng nhập lại
        if (error.response?.status === 401 || error.response?.status === 403) {
          alert(
            "Lệnh bài đã hết hạn hoặc không hợp lệ, vui lòng đăng nhập lại!",
          );
          localStorage.removeItem("userToken");
          localStorage.removeItem("userPhone");
          navigate("/dangnhap");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // Hiệu ứng chờ khi đang tải dữ liệu
  if (loading)
    return (
      <div
        className="text-center mt-5"
        style={{ color: "#00e676", fontSize: "20px" }}
      >
        Đang vận công dò xét Đan Điền...
      </div>
    );

  if (!profileData) return null;

  // Tính toán % thanh kinh nghiệm để hiển thị
  const expPercent = Math.min(
    (profileData.exp / profileData.exp_next_level) * 100,
    100,
  );

  return (
    <div
      style={{
        backgroundColor: "#121212",
        minHeight: "100vh",
        padding: "40px 20px",
        color: "white",
      }}
    >
      <Card
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          backgroundColor: "#1e1e1e",
          color: "white",
          border: "1px solid #333",
        }}
      >
        <Card.Body>
          {/* KHU VỰC THÔNG TIN TU VI */}
          <Row className="align-items-center mb-4">
            <Col xs={12} md={3} className="text-center mb-3 mb-md-0">
              <img
                src="https://via.placeholder.com/150x150/e50914/ffffff?text=Tu+Tiên"
                alt="Avatar"
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  border: "4px solid #e50914",
                }}
              />
            </Col>
            <Col xs={12} md={9}>
              <h2 style={{ color: "#00e676", fontWeight: "bold" }}>
                Đạo hữu {profileData.phone.slice(-4)}
              </h2>
              <h5 className="mb-3">
                Cảnh Giới:{" "}
                <Badge bg="danger" style={{ fontSize: "16px" }}>
                  {profileData.canh_gioi}
                </Badge>
              </h5>

              <div>
                <div
                  className="d-flex justify-content-between mb-1"
                  style={{ fontSize: "14px", color: "#ccc" }}
                >
                  <span>
                    Tu vi: {profileData.exp} / {profileData.exp_next_level} EXP
                  </span>
                  <span>{Math.round(expPercent)}%</span>
                </div>
                {/* Thanh tiến trình tu luyện */}
                <ProgressBar
                  variant="success"
                  now={expPercent}
                  style={{ height: "12px", backgroundColor: "#333" }}
                />
              </div>
            </Col>
          </Row>

          <hr style={{ borderColor: "#444" }} />

          {/* KHU VỰC TÀI SẢN (TRUYỆN & LỊCH SỬ) */}
          <Row>
            <Col md={12}>
              {" "}
              {/* Đổi thành 12 để nó rộng toàn màn hình */}
              <h4
                style={{
                  borderBottom: "2px solid red",
                  paddingBottom: "10px",
                  marginBottom: "20px",
                }}
              >
                📚 Tàng Kinh Các (Truyện Theo Dõi)
              </h4>
              {profileData.theo_doi && profileData.theo_doi.length > 0 ? (
                <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
                  {profileData.theo_doi.map((comic) => (
                    <div
                      key={comic.id}
                      style={{
                        width: "120px",
                        cursor: "pointer",
                        textAlign: "center",
                      }}
                      onClick={() => navigate(`/comic/${comic.id}`)} // Bấm vào là bay tới đọc luôn
                    >
                      <img
                        src={comic.image}
                        alt={comic.title}
                        style={{
                          width: "100%",
                          height: "160px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          border: "1px solid #444",
                        }}
                      />
                      <p
                        style={{
                          fontSize: "13px",
                          marginTop: "8px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {comic.title}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: "gray", fontStyle: "italic" }}>
                  Đạo hữu chưa thu thập bộ chân kinh nào!
                </p>
              )}
            </Col>

            <Col md={12} className="mt-4">
              <h4
                style={{
                  borderBottom: "2px solid red",
                  paddingBottom: "10px",
                  marginBottom: "20px",
                }}
              >
                ⏳ Nhật Ký Tu Luyện (Lịch sử đọc)
              </h4>

              {profileData.lich_su && profileData.lich_su.length > 0 ? (
                <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                  {profileData.lich_su.map((comic) => (
                    <div
                      key={comic.id}
                      style={{
                        width: "180px",
                        backgroundColor: "#252525",
                        borderRadius: "10px",
                        padding: "10px",
                        cursor: "pointer",
                        transition: "0.3s",
                      }}
                      onClick={() => navigate(`/comic/${comic.id}`)}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.transform = "scale(1.05)")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    >
                      <img
                        src={comic.image}
                        alt={comic.title}
                        style={{
                          width: "100%",
                          height: "220px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                      <div style={{ marginTop: "10px" }}>
                        <h6
                          style={{
                            fontSize: "14px",
                            color: "#00e676",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            marginBottom: "5px",
                          }}
                        >
                          {comic.title}
                        </h6>
                        <p
                          style={{ fontSize: "12px", color: "#ccc", margin: 0 }}
                        >
                          🔖 Đã đọc:{" "}
                          <span style={{ color: "red", fontWeight: "bold" }}>
                            {comic.last_chapter}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: "gray", fontStyle: "italic" }}>
                  Đạo hữu chưa để lại dấu vết tu luyện nào!
                </p>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Profile;
