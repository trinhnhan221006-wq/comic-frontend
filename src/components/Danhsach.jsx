import React from "react";
import "./Danhsach.css";

function Danhsach() {
  return (
    <div className="container">

      {/* Search */}
      <div className="row">
        <button className="btn-search">TÌM KIẾM</button>
        <input type="text" placeholder="Nhập từ khóa" />
      </div>

      {/* Trạng thái */}
      <div className="box">
        <div className="title">Trạng Thái</div>
        <div className="grid">
          <label><input type="checkbox" /> Chưa bắt đầu</label>
          <label><input type="checkbox" /> Đã dừng</label>
          <label><input type="checkbox" /> Hoàn lại</label>
          <label><input type="checkbox" /> Đang thực hiện</label>
          <label><input type="checkbox" /> Hoàn thành</label>
          <label><input type="checkbox" /> Có Truyện Chữ</label>
        </div>
      </div>

      {/* Thể loại */}
      <div className="box">
        <div className="title">Thể Loại</div>
        <div className="grid">
          <label><input type="checkbox" /> Anime</label>
          <label><input type="checkbox" /> Drama</label>
          <label><input type="checkbox" /> Josei</label>
          <label><input type="checkbox" /> Manhwa</label>
          <label><input type="checkbox" /> One Shot</label>
          <label><input type="checkbox" /> Shounen</label>
          <label><input type="checkbox" /> Webtoons</label>
          <label><input type="checkbox" /> Shoujo</label>
          <label><input type="checkbox" /> Harem</label>
          <label><input type="checkbox" /> Ecchi</label>
          <label><input type="checkbox" /> Mature</label>
          <label><input type="checkbox" /> Slice of life</label>
          <label><input type="checkbox" /> Isekai</label>
          <label><input type="checkbox" /> Manga</label>
          <label><input type="checkbox" /> Manhua</label>
          <label><input type="checkbox" /> Hành Động</label>
          <label><input type="checkbox" /> Phiêu Lưu</label>
          <label><input type="checkbox" /> Hài Hước</label>
          <label><input type="checkbox" /> Võ Thuật</label>
          <label><input type="checkbox" /> Huyền Bí</label>
          <label><input type="checkbox" /> Lãng Mạn</label>
        </div>
      </div>

      {/* Sắp xếp */}
      <div className="box">
        <div className="title">Sắp Xếp</div>
        <div className="grid">
          <label><input type="checkbox" /> Lượt xem</label>
          <label><input type="checkbox" /> Lượt đánh giá</label>
          <label><input type="checkbox" /> Lượt theo dõi</label>
          <label><input type="checkbox" /> Ngày cập nhật</label>
          <label><input type="checkbox" /> Truyện mới</label>
        </div>
      </div>

      {/* Nội dung */}
      <div className="content">
        <h3>Nội Dung</h3>
        <p>Khu Vực Hiển Thị Kết Quả Tìm Kiếm...</p>
      </div>

    </div>
  );
}

export default Danhsach;