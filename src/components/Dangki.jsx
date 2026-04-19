import React, { useState } from 'react';
import { Card, Form, Button, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

const DangKi = () => {
    const navigate = useNavigate();
    // Khởi tạo các biến lưu trữ dữ liệu người dùng gõ
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // Hàm gọi API khi bấm nút Đăng ký
    const handleRegister = async () => {
        if (!phone || !password) {
            alert("Vui lòng nhập đủ Số điện thoại và Mật khẩu!");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('http://truyentranhlocal.local/wp-json/tu-tien/v1/dang-ky', {
                username: phone, 
                password: password
            });
            
            alert(response.data.message); // Báo thành công
            navigate('/dangnhap'); // Chuyển sang trang đăng nhập
            
        } catch (error) {
            alert(error.response?.data?.message || "Có lỗi xảy ra khi tạo tài khoản!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Card style={{ width: "600px", height: "550px" }} className='mx-auto' >
                <Card.Body>
                    <h3 className='text-center'> Đăng ký tài khoản </h3>
                    <p className='text-center'>Đăng ký để mua và theo dõi quá trình đọc truyện</p>
                    
                    {/* Bắt sự kiện người dùng gõ vào ô SĐT */}
                    <Form.Control 
                        type="text" 
                        style={{ width: "400px" }} 
                        className='mx-auto' 
                        placeholder="Số điện thoại" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    /> <br />
                    
                    {/* Đã sửa thành type="password" và bắt sự kiện gõ */}
                    <Form.Control 
                        type="password" 
                        style={{ width: "400px" }} 
                        className='mx-auto' 
                        placeholder="Mật khẩu" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <p className='text-Secondary' style={{ paddingLeft: "90px" }}> Mật khẩu bao gồm ít nhất 6 kí tự</p>
                    
                    <div style={{ textAlign: "center" }}>
                        {/* Thêm onClick gọi hàm handleRegister */}
                        <Button 
                            variant="danger" 
                            style={{ width: "400px" }} 
                            onClick={handleRegister}
                            disabled={loading}
                        >
                            {loading ? "Đang tạo tài khoản..." : "Đăng ký"}
                        </Button>
                    </div><br />
                    
                    <p className='text-center'>Hoặc đăng ký với</p>
                    <Row style={{ textAlign: "center" }}>
                        <Col> <Button variant="danger">Facebook</Button></Col>
                        <Col> <Button variant="danger">Google</Button></Col>
                    </Row>
                    <br /> <p className='text-center'>Bằng việc nhấn “Đăng ký”, bạn đã đọc và đồng ý<br /> với điều kiện và điều khoản</p>
                    <hr />
                    <Row style={{ textAlign: "center" }}>
                        <Col> <p style={{ paddingLeft: "80px", paddingTop: "6px" }}>Bạn đã có tài khoản?</p></Col>
                        <Col>
                            <Link to="/dangnhap">
                                <Button style={{ paddingRight: "120px" }} variant="link">Đăng nhập ngay</Button>
                            </Link>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </>
    )
}

export default DangKi;