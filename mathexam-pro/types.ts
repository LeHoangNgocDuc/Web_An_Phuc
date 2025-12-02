export interface QuestionOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  number: number;
  text: string;
  options: QuestionOption[];
}

export interface AnswerKey {
  questionId: string;
  correctOptionId: string;
  solutionText?: string;
}

export interface ExamData {
  id: string;
  title: string;
  durationMinutes: number;
  grade?: string;       // Khối lớp (6, 7, 8...)
  examType?: string;    // Loại thi (Giữa kỳ, Cuối kỳ...)
  subject?: string;     // Môn (Toán)
  chapter?: string;     // <-- MỚI THÊM: Ví dụ "Chương 1"
  questions: Question[];
  answers: AnswerKey[];
  createdAt: number;
}

export interface UserSubmission {
  examId: string;
  answers: Record<string, string>;
  startTime: number;
  submitTime: number;
  score?: number;
}