// Auto-import tất cả bộ đề thi
// Để thêm bộ đề mới: tạo file .json trong thư mục này và import vào đây

import cnpmck from './CNPMP_Cuoi_Ky';
import tracnghiemtoeicp1 from './TA_309_cau_p1.json';
import tracnghiemtoeicp2 from './TA_309_cau_p2.json';


// Mảng này tự động được đọc để hiển thị trang chủ
// Thứ tự trong mảng = thứ tự hiển thị trên trang chủ
const allQuizzes = [
  cnpmck,
  tracnghiemtoeicp1,
  tracnghiemtoeicp2
];

export default allQuizzes;
