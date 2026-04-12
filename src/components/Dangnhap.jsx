import React from 'react'
import { Card,Form,Button,Row,Col} from 'react-bootstrap';
import { Link } from "react-router-dom";

const DangNhap = () => {
    return (
        <>
            <Card style={{ width: "600px", height: "550px"}} className='mx-auto' >
      <Card.Body>
        <h3 className='text-center'> Đăng nhập </h3>
        <p className='text-center'>Đăng nhập với mật khẩu</p>
        <Form.Control type="text" style={{ width: "400px" }} className='mx-auto' placeholder="Tên đăng nhập/Số điện thoại" /> <br/>
        <Form.Control type="text" style={{ width: "400px" }} className='mx-auto' placeholder="Mật khẩu" />
        <p className='text-danger' style={{paddingLeft: "350px"}}> Quên mật khẩu</p>
        <div style={{ textAlign: "center"}}>
         <Button variant="danger" style={{ width: "400px"}}>Đăng nhập</Button></div><br/>
         <p className='text-center'>Hoặc đăng nhập  với</p>
          <Row style={{ textAlign: "center"}}>
        <Col> <Button variant="danger">Facebook</Button></Col>   
        <Col> <Button   variant="danger">Google</Button></Col>
      </Row>
    
       <hr/>
       <Row style={{ textAlign: "center"}}>
        <Col> <p style={{paddingLeft: "80px",paddingTop: "6px"}}>Bạn chưa có tài khoản?</p></Col>   
        <Col> 
        <Link to="/dangki">
        <Button style={{paddingRight: "120px"}} variant="link">Đăng kí ngay</Button>
        </Link>
        </Col>
      </Row>
      </Card.Body>
    </Card>

        </>
    )
}

export default DangNhap;