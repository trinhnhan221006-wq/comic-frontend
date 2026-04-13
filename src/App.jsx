import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Footer from './components/Footer'; // 1. Import Footer vào đây
import Dangnhap from './components/Dangnhap';
import Dangki from './components/Dangki';
<<<<<<< HEAD
import Danhsach from './components/Danhsach';
=======
import ComicDetail from './pages/ComicDetail';
import Chapter from './pages/Chapter';
>>>>>>> 44d06dfee4bf2f8509509050f78a1c9565afee8f
import 'bootstrap/dist/css/bootstrap.min.css';
function App() {
  return (
    <Router>
      <div className="app-wrapper">
        {/* Header luôn hiển thị ở mọi trang */}
        <Header /> 

        {/* Khu vực thay đổi nội dung tùy theo đường dẫn URL */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Dangnhap" element ={<Dangnhap/>}/>
          <Route path="/Dangki" element ={<Dangki/>}/>
<<<<<<< HEAD
          <Route path="/Danhsach" element={<Danhsach/>}/>
=======
          <Route path="comic/:id" element={<ComicDetail />} />
          <Route path="comic/:id/chapter/:chapterId" element={<Chapter />} />
>>>>>>> 44d06dfee4bf2f8509509050f78a1c9565afee8f
          {/* Cấu hình sẵn để sau này làm Trang Chi tiết truyện */}
          {/* <Route path="/comic/:id" element={<ComicDetail />} /> */}
        </Routes>
        {/* 2. Footer luôn nằm ở dưới cùng */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;