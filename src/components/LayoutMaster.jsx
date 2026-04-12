import React from "react";
import { Outlet } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import {Row,Col} from 'react-bootstrap';

import Header from "./Header";
import Footer from "./Footer";


const LayoutMaster = () => {
    return (
        <>
            <Container>
                <Header />
              < Row style={{height: "90vh"}}>
              <Outlet />
              </Row>
                <Footer />
            </Container>
        </>
    )
}

export default LayoutMaster;