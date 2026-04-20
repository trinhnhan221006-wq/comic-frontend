import React from "react";
import { Outlet } from "react-router-dom";
import Container from "react-bootstrap/Container";
import { Row, Col } from "react-bootstrap";

import Header from "./Header";
import Footer from "./Footer";

const LayoutMaster = () => {
  <div
    style={{ backgroundColor: "#121212", minHeight: "100vh", color: "#ffffff" }}
  >
    <Container>
      <Header />
      <Row style={{ minHeight: "90vh" }}>
        <Outlet />
      </Row>
      <Footer />
    </Container>
  </div>;
};

export default LayoutMaster;
