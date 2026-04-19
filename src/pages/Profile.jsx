import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, ProgressBar, Row, Col, Badge, Container } from 'react-bootstrap';
import './Profile.css'; // Nhớ import CSS mới

const Profile = () => {
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('userToken');
            if (!token) { navigate('/dangnhap'); return; }

            try {
                const response = await axios.get('http://truyentranhlocal.local/wp-json/tu-tien/v1/ho-so', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProfileData(response.data);
            } catch (error) {
                console.error("Lỗi:", error);
                navigate('/dangnhap');
            } finally { setLoading(false); }
        };
        fetchProfile();
    }, [navigate]);

    if (loading) return <div className="loading-txt">Đang dò xét Đan Điền...</div>;
    if (!profileData) return null;

    const expPercent = Math.min((profileData.exp / profileData.exp_next_level) * 100, 100);

    return (
        <div className="profile-wrapper">
            <Container>
                <Card className="profile-card">
                    <Card.Body className="p-5">
                        {/* HEADER: THÔNG TIN NHÂN VẬT */}
                        <Row className="align-items-center mb-5">
                            <Col md={3} className="avatar-zone text-center">
                                <img src={`https://ui-avatars.com/api/?name=${profileData.phone}&background=random&size=150`} alt="Avatar" />
                            </Col>
                            <Col md={9}>
                                <h1 className="display-5 fw-bold text-white mb-2">Đạo Hữu: {profileData.phone}</h1>
                                <div className="mb-4">
                                    <Badge className="canh-gioi-badge">{profileData.canh_gioi}</Badge>
                                </div>
                                <div className="exp-section">
                                    <div className="d-flex justify-content-between mb-2">
                                        <span>Tu Vi: {profileData.exp} / {profileData.exp_next_level} EXP</span>
                                        <span className="text-success">{Math.round(expPercent)}%</span>
                                    </div>
                                    <ProgressBar now={expPercent} className="exp-bar" children={<div className="exp-bar-fill" style={{width: `${expPercent}%`, height: '100%'}} />} />
                                </div>
                            </Col>
                        </Row>

                        {/* BODY: TÀNG KINH CÁC & NHẬT KÝ */}
                        <Row>
                            {/* Nhật ký Tu Luyện (Lịch sử) */}
                            <Col lg={12} className="mb-5">
                                <h2 className="section-title">⏳ Nhật Ký Tu Luyện</h2>
                                <div className="d-flex gap-4 flex-wrap">
                                    {profileData.lich_su.map(comic => (
                                        <div key={comic.id} className="comic-item-card" onClick={() => navigate(`/comic/${comic.id}`)}>
                                            <img src={comic.image} alt={comic.title} width="100%" height="220px" style={{objectFit: 'cover'}} />
                                            <h6 className="text-truncate mt-2">{comic.title}</h6>
                                            <span className="chapter-badge">🔖 {comic.last_chapter}</span>
                                        </div>
                                    ))}
                                </div>
                            </Col>

                            {/* Tàng Kinh Các (Theo dõi) */}
                            <Col lg={12}>
                                <h2 className="section-title">📚 Tàng Kinh Các</h2>
                                <div className="d-flex gap-4 flex-wrap">
                                    {profileData.theo_doi.map(comic => (
                                        <div key={comic.id} className="comic-item-card" onClick={() => navigate(`/comic/${comic.id}`)}>
                                            <img src={comic.image} alt={comic.title} width="100%" height="220px" style={{objectFit: 'cover'}} />
                                            <h6 className="text-truncate mt-2">{comic.title}</h6>
                                        </div>
                                    ))}
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