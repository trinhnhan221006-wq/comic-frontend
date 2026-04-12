import React from 'react'
import { Card,Form,Button,Row,Col} from 'react-bootstrap';
import { Link } from "react-router-dom";

const DangKi = () => {
    return (
        <>
            <Card style={{ width: "600px", height: "550px"}} className='mx-auto' >
      <Card.Body>
        <h3 className='text-center'> Đăng ký tài khoản </h3>
        <p className='text-center'>Đăng ký để mua và theo dõi quá trình đọc truyện</p>
        <Form.Control type="text" style={{ width: "400px" }} className='mx-auto' placeholder="Số điện thoại" /> <br/>
        <Form.Control type="text" style={{ width: "400px" }} className='mx-auto' placeholder="Mật khẩu" />
        <p className='text-Secondary' style={{paddingLeft: "90px"}}> Mật khẩu bao gồm ít nhất 6 kí tự</p>
        <div style={{ textAlign: "center"}}>
         <Button variant="danger" style={{ width: "400px"}}>Đăng ký</Button></div><br/>
         <p className='text-center'>Hoặc đăng ký với</p>
          <Row style={{ textAlign: "center"}}>
        <Col> <Button variant="danger">Facebook</Button></Col>   
        <Col> <Button   variant="danger">Google</Button></Col>
      </Row>
      <br/> <p className='text-center'>Bằng việc nhấn “Đăng ký”, bạn đã đọc và đồng ý<br/> với điều kiện và điều khoản</p>
       <hr/>
       <Row style={{ textAlign: "center"}}>
        <Col> <p style={{paddingLeft: "80px",paddingTop: "6px"}}>Bạn đã có tài khoản?</p></Col>   
        <Col>
         <Link to="/dangnhap">
         <Button style={{paddingRight: "120px"}} variant="link">Đăng nhập ngay</Button>
         </Link>
         </Col>
      </Row>
      </Card.Body>
    </Card>

        </>
    )
}

export default DangKi;