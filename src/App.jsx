import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Footer from './components/Footer'; // 1. Import Footer vào đây

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        {/* Header luôn hiển thị ở mọi trang */}
        <Header /> 

        {/* Khu vực thay đổi nội dung tùy theo đường dẫn URL */}
        <Routes>
          <Route path="/" element={<Home />} />
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