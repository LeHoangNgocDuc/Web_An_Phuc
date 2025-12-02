import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExamData } from '../types';
import { db } from '../firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

const GRADES = [
  { id: '6', label: 'Lớp 6' }, { id: '7', label: 'Lớp 7' }, { id: '8', label: 'Lớp 8' },
  { id: '9', label: 'Lớp 9' }, { id: '10', label: 'Lớp 10' }, { id: '11', label: 'Lớp 11' },
  { id: '12', label: 'Lớp 12' }, { id: 'THPT', label: 'TN THPT' },
];

const EXAM_TYPES = [
  'Kiểm tra thường xuyên', 'Giữa kỳ 1', 'Cuối kỳ 1', 'Giữa kỳ 2', 'Cuối kỳ 2', 'Thử THPT QG'
];

const CHAPTERS = [
    "Chương 1", "Chương 2", "Chương 3", "Chương 4", "Chương 5", "Chương 6", "Chương 7", "Chương 8"
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState<ExamData[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedGrade, setSelectedGrade] = useState(GRADES[0].id);
  const [selectedExamType, setSelectedExamType] = useState(EXAM_TYPES[0]);
  const [selectedChapter, setSelectedChapter] = useState(CHAPTERS[0]); // Mới: Lọc chương

  const fetchExams = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "dethi"));
      const data = querySnapshot.docs.map(doc => {
        const d = doc.data();
        return {
          id: doc.id,
          title: d.title || "Đề chưa có tên",
          durationMinutes: d.durationMinutes || 45,
          questions: d.questions || [],
          grade: d.grade || "Khác",
          examType: d.examType || "Khác",
          chapter: d.chapter || "", // Lấy chương
          subject: d.subject || "Toán",
        } as ExamData;
      });
      setExams(data);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  useEffect(() => { fetchExams(); }, []);

  const filteredExams = exams.filter(exam => {
    let examGradeNormalized = exam.grade;
    if (exam.grade === "Luyện thi THPT") examGradeNormalized = "THPT";
    
    const matchGrade = examGradeNormalized === selectedGrade;
    const matchType = exam.examType === selectedExamType;
    
    // Logic lọc chương: Chỉ áp dụng nếu đang chọn "Kiểm tra thường xuyên"
    let matchChapter = true;
    if (selectedExamType === 'Kiểm tra thường xuyên') {
        matchChapter = exam.chapter === selectedChapter;
    }

    return matchGrade && matchType && matchChapter;
  });

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      {/* HEADER */}
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src="/logo.png" alt="Logo" className="h-16 w-auto bg-white rounded-full p-1 shadow-md" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold uppercase">Trung tâm Toán An Phúc Education</h1>
              <p className="text-sm opacity-90">"Vững kiến thức - Chắc tương lai"</p>
              <div className="text-xs mt-1 flex gap-4 opacity-80">
                  <span>📍 Lô 19 ô DC 16 Vĩnh Trường, Nha Trang</span>
                  <span>📞 0972.466.347 - 0834.23.02.87</span>
              </div>
            </div>
          </div>
          <button onClick={() => navigate('/admin')} className="text-white hover:bg-blue-700 p-2 rounded-full transition-colors" title="Admin">
             <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>
          </button>
        </div>
      </header>

      {/* NAVBAR */}
      <nav className="bg-gray-800 text-white shadow-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto">
          <ul className="flex space-x-1 whitespace-nowrap font-medium text-sm md:text-base">
            <li><a href="#" className="block px-4 py-3 bg-gray-900"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg></a></li>
            {['Toán 6', 'Toán 7', 'Toán 8', 'Toán 9', 'Toán 10', 'Toán 11', 'Toán 12'].map(item => (
                <li key={item}><a href="#" className={`block px-5 py-3 hover:bg-gray-700 transition-colors ${selectedGrade === item.replace('Toán ','') ? 'bg-red-600 font-bold' : ''}`} onClick={(e) => { e.preventDefault(); setSelectedGrade(item.replace('Toán ','')); }}>{item}</a></li>
            ))}
             <li><a href="#" className="block px-5 py-3 hover:bg-gray-700 transition-colors flex items-center gap-1"><span className="bg-white text-gray-800 rounded px-1 text-xs">▶</span> E-LEARNING</a></li>
             <li className="ml-auto"><a href="#" className="block px-5 py-3 bg-red-600 font-bold flex items-center">THI TRỰC TUYẾN</a></li>
          </ul>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8 flex-grow w-full">
        {/* KHUNG PHÒNG THI ONLINE */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-blue-600 pl-3">Phòng Thi Online</h2>
                {/* Bộ lọc Lớp (nhỏ gọn) */}
                <div className="flex flex-wrap justify-center gap-2">
                    {GRADES.map((grade) => (
                    <button key={grade.id} onClick={() => setSelectedGrade(grade.id)} className={`px-4 py-1 rounded-full text-sm font-bold border ${selectedGrade === grade.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}>
                        {grade.label}
                    </button>
                    ))}
                </div>
            </div>

            {/* Bộ lọc Loại Kỳ Thi */}
            <div className="bg-gray-50 px-6 pt-4">
                <div className="flex flex-wrap gap-6 border-b border-gray-300">
                    {EXAM_TYPES.map((type) => (
                    <button key={type} onClick={() => setSelectedExamType(type)} className={`pb-3 text-sm font-bold transition-all relative ${selectedExamType === type ? 'text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}>
                        {type}
                        {selectedExamType === type && <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-700 rounded-t-lg"></span>}
                    </button>
                    ))}
                </div>
            </div>

            {/* Bộ lọc Chương (Chỉ hiện khi chọn Kiểm tra thường xuyên) */}
            {selectedExamType === 'Kiểm tra thường xuyên' && (
                <div className="bg-purple-50 px-6 py-4 animate-fade-in">
                    <div className="flex flex-wrap gap-3 justify-center">
                        {CHAPTERS.map(ch => (
                            <button key={ch} onClick={() => setSelectedChapter(ch)} className={`px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm ${selectedChapter === ch ? 'bg-purple-600 text-white transform scale-105' : 'bg-white text-purple-800 border border-purple-200 hover:bg-purple-100'}`}>
                                {ch}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* DANH SÁCH ĐỀ THI */}
            <div className="p-6 bg-gray-50 min-h-[300px]">
                {loading ? <div className="text-center py-10">Đang tải...</div> : filteredExams.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">Chưa có đề thi nào cho mục này.</div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredExams.map((exam) => (
                        <div key={exam.id} className="bg-white rounded-xl shadow hover:shadow-xl transition-all border border-gray-100 group">
                            <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center relative rounded-t-xl">
                                <span className="text-white text-5xl opacity-20 font-serif">$\sum$</span>
                                {exam.chapter && <span className="absolute top-2 right-2 bg-purple-600 text-white text-[10px] px-2 py-1 rounded-full uppercase font-bold shadow">{exam.chapter}</span>}
                            </div>
                            <div className="p-5">
                                <h3 className="font-bold text-gray-800 mb-2 h-12 line-clamp-2">{exam.title}</h3>
                                <div className="flex gap-4 text-xs text-gray-500 mb-4">
                                    <span>⏱ {exam.durationMinutes} phút</span>
                                    <span>📝 {exam.questions.length} câu</span>
                                </div>
                                <button onClick={() => navigate(`/exam/${exam.id}`)} className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors">
                                    Làm bài ngay
                                </button>
                            </div>
                        </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
      </main>

      <footer className="bg-gray-900 text-gray-400 py-6 text-center text-sm">
          <p>© 2025 Trung tâm Toán An Phúc Education.</p>
      </footer>
    </div>
  );
};

export default HomePage;