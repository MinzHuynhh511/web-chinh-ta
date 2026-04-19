// Auto-import tất cả bộ đề thi
// Để thêm bộ đề mới: tạo file .json trong thư mục này và import vào đây

import luyentap from './luyen-tap.json';
import tracnghiemtoeic from './TRẮC NGHIỆM TA.json';

// Mảng này tự động được đọc để hiển thị trang chủ
// Thứ tự trong mảng = thứ tự hiển thị trên trang chủ
const allQuizzes = [
  luyentap,
  tracnghiemtoeic
];

export default allQuizzes;
