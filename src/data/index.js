// Auto-import tất cả bộ đề thi
// Để thêm bộ đề mới: tạo file .json trong thư mục này và import vào đây

import congNghePhanMem from './cong-nghe-phan-mem.json';
import coSoDuLieu from './co-so-du-lieu.json';
import mangMayTinh from './mang-may-tinh.json';
import kiemThuPhanMem from './kiem-thu-phan-mem.json';
import nhapMonWeb from './nhap-mon-web.json';

// Mảng này tự động được đọc để hiển thị trang chủ
// Thứ tự trong mảng = thứ tự hiển thị trên trang chủ
const allQuizzes = [
  congNghePhanMem,
  coSoDuLieu,
  mangMayTinh,
  kiemThuPhanMem,
  nhapMonWeb
];

export default allQuizzes;
