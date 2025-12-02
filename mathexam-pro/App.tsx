import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

// Nhập các trang vào để định tuyến
import HomePage from './pages/HomePage';
import ExamPage from './pages/ExamPage';
import ResultPage from './pages/ResultPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage'; // Quan trọng: Trang đăng nhập mới tạo

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        {/* Trang chủ: Ai vào cũng thấy */}
        <Route path="/" element={<HomePage />} />
        
        {/* Trang đăng nhập: Để nhập mật khẩu */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Trang Admin: Chỉ vào được khi đã đăng nhập (code trong AdminPage sẽ kiểm tra) */}
        <Route path="/admin" element={<AdminPage />} />
        
        {/* Trang làm bài thi: Cần mã đề (examId) */}
        <Route path="/exam/:examId" element={<ExamPage />} />
        
        {/* Trang kết quả: Cần mã đề (examId) */}
        <Route path="/result/:examId" element={<ResultPage />} />
        
        {/* Nếu gõ đường dẫn linh tinh thì tự động quay về trang chủ */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;