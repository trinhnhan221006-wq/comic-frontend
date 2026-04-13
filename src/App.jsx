import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Footer from './components/Footer';
import Dangnhap from './components/Dangnhap';
import Dangki from './components/Dangki';
import Danhsach from './components/Danhsach';
import ComicDetail from './pages/ComicDetail';
import Chapter from './pages/Chapter';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        {/* Header luôn hiển thị ở mọi trang */}
        <Header /> 

        {/* Khu vực thay đổi nội dung */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Dangnhap" element={<Dangnhap />} />
          <Route path="/Dangki" element={<Dangki />} />
          <Route path="/Danhsach" element={<Danhsach />} />
          <Route path="/comic/:id" element={<ComicDetail />} />
          <Route path="/comic/:id/chapter/:chapterId" element={<Chapter />} />
        </Routes>

        {/* Footer luôn nằm dưới */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;