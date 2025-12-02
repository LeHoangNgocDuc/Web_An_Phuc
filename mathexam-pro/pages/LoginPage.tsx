import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Tài khoản: admin - Mật khẩu: anphuc01
    if (username === 'admin' && password === 'anphuc01') {
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin');
    } else {
      setError('Sai tài khoản hoặc mật khẩu!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-blue-100">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-900 mb-2">Đăng Nhập</h1>
            <p className="text-gray-500">Hệ thống quản trị An Phúc Education</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Tài khoản</label>
            <input 
              type="text" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Mật khẩu</label>
            <input 
              type="password" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          
          {error && <div className="bg-red-50 text-red-600 p-3 rounded text-sm text-center font-medium">{error}</div>}
          
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-transform transform active:scale-95 shadow-md">
            VÀO HỆ THỐNG
          </button>
        </form>
        
        <div className="mt-6 text-center">
            <button onClick={() => navigate('/')} className="text-blue-500 text-sm hover:underline font-medium">
                ← Quay về Trang chủ
            </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;