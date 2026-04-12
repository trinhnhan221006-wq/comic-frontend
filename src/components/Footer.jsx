import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css'; // Gọi file CSS giao diện

const Footer = () => {
    return (
        <footer className="main-footer">
            <div className="footer-content">
                <p>Copyright © 2026 - MangaLocal</p>
                <p>Email: contact@mangalocal.com</p>
                <div className="footer-links">
                    <Link to="/">Facebook</Link>
                    <span className="separator">|</span>
                    <Link to="/">Privacy Policy</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;