import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { parseDocx } from '../utils/docxParser';
import { saveExam } from '../services/data';
import { ExamData, Question, AnswerKey } from '../types';
import MathText from '../components/MathText';
import { doc, setDoc } from 'firebase/firestore'; 
import { db } from '../firebase'; 

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Kiểm tra đăng nhập
  useEffect(() => {
      const isAdmin = localStorage.getItem('isAdmin');
      if (!isAdmin) {
          navigate('/login');
      }
  }, [navigate]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  
  const [title, setTitle] = useState("Đề thi mới");
  const [duration, setDuration] = useState(45);
  const [grade, setGrade] = useState("12");
  const [examType, setExamType] = useState("Kiểm tra thường xuyên"); 
  const [chapter, setChapter] = useState("Chương 1"); 

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<AnswerKey[]>([]);

  const grades = ["6", "7", "8", "9", "10", "11", "12", "Luyện thi THPT"];
  const examTypes = ["Kiểm tra thường xuyên", "Giữa kỳ 1", "Cuối kỳ 1", "Giữa kỳ 2", "Cuối kỳ 2", "Thử THPT QG"];
  const chapters = ["Chương 1", "Chương 2", "Chương 3", "Chương 4", "Chương 5", "Chương 6", "Chương 7", "Chương 8"];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setError(null);
    setShowEditor(false);
    try {
      if (file.name.endsWith('.docx')) {
        const parsed = await parseDocx(file);
        setQuestions((parsed.questions as Question[]) || []);
        setAnswers((parsed.answers as AnswerKey[]) || []);
        setTitle(file.name.replace('.docx', ''));
        setShowEditor(true);
      } else {
        setError("Vui lòng chọn file .docx");
      }
    } catch (err: any) {
      setError("Lỗi: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  const handleManualCreate = () => {
      setTitle("Đề thi thủ công");
      setQuestions([]);
      setAnswers([]);
      setShowEditor(true);
      setError(null);
  };

  const addQuestion = () => {
      const newId = `q_manual_${Date.now()}`;
      setQuestions([...questions, {
          id: newId, number: questions.length + 1, text: "Nhập nội dung...",
          options: [{id:'A',text:'A'},{id:'B',text:'B'},{id:'C',text:'C'},{id:'D',text:'D'}]
      }]);
      setAnswers([...answers, { questionId: newId, correctOptionId: 'A', solutionText: '' }]);
  };

  const removeQuestion = (index: number) => {
      const newQs = [...questions]; newQs.splice(index, 1);
      newQs.forEach((q, i) => q.number = i + 1);
      setQuestions(newQs);
      const newAns = [...answers]; newAns.splice(index, 1);
      setAnswers(newAns);
  };

  const handleSave = async () => {
    if (questions.length === 0) { setError("Đề thi chưa có câu hỏi!"); return; }
    
    // --- SỬA LỖI Ở ĐÂY ---
    // Nếu không phải kiểm tra thường xuyên, ta gán là chuỗi rỗng "" (không được để undefined)
    const finalChapter = examType === "Kiểm tra thường xuyên" ? chapter : ""; 

    try {
      setLoading(true);
      const newExamId = `exam_${Date.now()}`;
      const newExam: ExamData = {
        id: newExamId, 
        title, 
        durationMinutes: duration,
        grade, 
        examType, 
        subject: 'Toán',
        chapter: finalChapter, // Lưu giá trị đã xử lý
        questions, 
        answers, 
        createdAt: Date.now()
      };

      await setDoc(doc(db, "dethi", newExamId), newExam);
      saveExam(newExam); 
      alert("Lưu thành công!");
      navigate('/');
    } catch (e) {
      console.error(e);
      alert("Lỗi lưu: " + e);
    } finally {
      setLoading(false);
    }
  };

  const updateQuestion = (i: number, f: string, v: string) => { const n=[...questions]; (n[i] as any)[f]=v; setQuestions(n); };
  const updateOption = (qi: number, oi: number, v: string) => { const n=[...questions]; n[qi].options[oi].text=v; setQuestions(n); };
  const updateAnswer = (qid: string, f: string, v: string) => { const n=[...answers]; (n.find(a=>a.questionId===qid) as any)[f]=v; setAnswers(n); };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-blue-600 p-6 flex justify-between items-center text-white">
          <h1 className="text-2xl font-bold">Admin Panel - An Phúc Education</h1>
          <button onClick={() => { localStorage.removeItem('isAdmin'); navigate('/'); }} className="bg-red-500 px-4 py-2 rounded text-sm font-bold">Đăng xuất</button>
        </div>

        <div className="p-8">
            {!showEditor ? (
                <div className="text-center py-10 space-y-6">
                    <div className="bg-blue-50 border-2 border-dashed border-blue-300 rounded-xl p-10 max-w-2xl mx-auto">
                        <input type="file" accept=".docx" onChange={handleFileUpload} className="hidden" id="file-upload" />
                        <label htmlFor="file-upload" className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-full cursor-pointer hover:bg-blue-700">
                          {loading ? "Đang xử lý..." : "Chọn File .docx"}
                        </label>
                    </div>
                    <button onClick={handleManualCreate} className="text-blue-600 font-bold hover:underline">Tạo thủ công</button>
                </div>
            ) : (
                <div className="animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-6 bg-gray-50 rounded-lg border">
                        <div className="md:col-span-2">
                            <label className="font-bold block mb-1">Tên Đề Thi</label>
                            <input type="text" value={title} onChange={e=>setTitle(e.target.value)} className="w-full border p-2 rounded" />
                        </div>
                        <div>
                            <label className="font-bold block mb-1">Khối Lớp</label>
                            <select value={grade} onChange={e=>setGrade(e.target.value)} className="w-full border p-2 rounded">
                                {grades.map(g=><option key={g} value={g}>{g}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="font-bold block mb-1">Loại Kỳ Thi</label>
                            <select value={examType} onChange={e=>setExamType(e.target.value)} className="w-full border p-2 rounded">
                                {examTypes.map(t=><option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        
                        {examType === "Kiểm tra thường xuyên" && (
                             <div>
                                <label className="font-bold block mb-1 text-purple-700">Chọn Chương</label>
                                <select value={chapter} onChange={e=>setChapter(e.target.value)} className="w-full border p-2 rounded border-purple-300 bg-purple-50">
                                    {chapters.map(c=><option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        )}
                        <div>
                            <label className="font-bold block mb-1">Thời gian (phút)</label>
                            <input type="number" value={duration} onChange={e=>setDuration(Number(e.target.value))} className="w-full border p-2 rounded" />
                        </div>
                    </div>

                    <div className="mb-4 flex justify-between items-center">
                        <h2 className="font-bold text-xl">Câu hỏi ({questions.length})</h2>
                        <button onClick={addQuestion} className="bg-green-100 text-green-700 px-3 py-1 rounded font-bold">+ Thêm câu</button>
                    </div>

                     <div className="space-y-6">
                        {questions.map((q, idx) => {
                             const ans = answers.find(a => a.questionId === q.id);
                             return (
                                 <div key={q.id} className="border p-4 rounded-lg bg-white shadow-sm">
                                     <div className="flex justify-between mb-2">
                                         <span className="font-bold text-blue-800">Câu {idx+1}</span>
                                         <div className="flex gap-2 items-center">
                                            <span className="text-sm">Đáp án:</span>
                                            <select value={ans?.correctOptionId} onChange={e=>updateAnswer(q.id,'correctOptionId',e.target.value)} className="border rounded bg-green-50 font-bold text-green-700">
                                                {['A','B','C','D'].map(o=><option key={o} value={o}>{o}</option>)}
                                            </select>
                                            <button onClick={()=>removeQuestion(idx)} className="text-red-500 ml-2">Xóa</button>
                                         </div>
                                     </div>
                                     <div className="grid md:grid-cols-2 gap-4">
                                        <textarea value={q.text} onChange={e=>updateQuestion(idx,'text',e.target.value)} className="w-full border p-2 rounded text-sm" rows={3} placeholder="Nội dung câu hỏi..." />
                                        <div className="space-y-1">
                                            {q.options.map((opt,oidx)=>(
                                                <div key={opt.id} className="flex gap-2 items-center">
                                                    <span className={`font-bold w-6 text-center ${ans?.correctOptionId===opt.id?'text-green-600':'text-gray-400'}`}>{opt.id}</span>
                                                    <input value={opt.text} onChange={e=>updateOption(idx,oidx,e.target.value)} className="border p-1 rounded flex-1 text-sm" />
                                                </div>
                                            ))}
                                        </div>
                                     </div>
                                     <div className="mt-2">
                                         <textarea value={ans?.solutionText} onChange={e=>updateAnswer(q.id,'solutionText',e.target.value)} className="w-full border p-2 rounded bg-blue-50 text-sm" rows={2} placeholder="Lời giải chi tiết..." />
                                     </div>
                                     <div className="mt-2 bg-gray-50 p-2 text-sm text-gray-500 rounded"><MathText content={q.text} /></div>
                                 </div>
                             )
                        })}
                     </div>

                    <div className="sticky bottom-0 bg-white border-t p-4 mt-8 flex justify-end gap-4 shadow-lg">
                        <button onClick={()=>setShowEditor(false)} className="px-6 py-2 rounded font-bold text-gray-600">Hủy</button>
                        <button onClick={handleSave} className="bg-blue-600 text-white px-6 py-2 rounded font-bold shadow hover:bg-blue-700">LƯU ĐỀ THI</button>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;