import React, { useState } from "react";
import { Card, Form, Button, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const DangNhap = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!phone || !password) {
      alert("Vui lòng nhập đủ thông tin!");
      return;
    }

    setLoading(true);
    try {
      // Gọi API lấy JWT Token
      const response = await axios.post(
        "http://truyentranhlocal.local/wp-json/jwt-auth/v1/token",
        {
          username: phone,
          password: password,
        },
      );

      // Thành công: Lấy Token và lưu vào localStorage
      const token = response.data.token;
      localStorage.setItem("userToken", token);
      localStorage.setItem("userPhone", phone);

      alert("Đăng nhập thành công! Chào mừng đạo hữu.");
      navigate("/"); // Chuyển về trang chủ
    } catch (error) {
      alert("Sai số điện thoại hoặc mật khẩu! Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card style={{ width: "600px", height: "550px" }} className="mx-auto">
        <Card.Body>
          <h3 className="text-center"> Đăng nhập </h3>
          <p className="text-center">Đăng nhập với mật khẩu</p>
          <Form.Control
            type="text"
            style={{ width: "400px" }}
            className="mx-auto"
            placeholder="Tên đăng nhập/Số điện thoại"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />{" "}
          <br />
          <Form.Control
            type="password"
            style={{ width: "400px" }}
            className="mx-auto"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="text-danger" style={{ paddingLeft: "350px" }}>
            {" "}
            Quên mật khẩu
          </p>
          <div style={{ textAlign: "center" }}>
            <Button
              variant="danger"
              style={{ width: "400px" }}
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Đang xác thực..." : "Đăng nhập"}
            </Button>
          </div>
          <br />
          <p className="text-center">Hoặc đăng nhập với</p>
          <Row style={{ textAlign: "center" }}>
            <Col>
              {" "}
              <Button variant="danger">Facebook</Button>
            </Col>
            <Col>
              {" "}
              <Button variant="danger">Google</Button>
            </Col>
          </Row>
          <hr />
          <Row style={{ textAlign: "center" }}>
            <Col>
              {" "}
              <p style={{ paddingLeft: "80px", paddingTop: "6px" }}>
                Bạn chưa có tài khoản?
              </p>
            </Col>
            <Col>
              <Link to="/dangki">
                <Button style={{ paddingRight: "120px" }} variant="link">
                  Đăng kí ngay
                </Button>
              </Link>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
};

export default DangNhap;
