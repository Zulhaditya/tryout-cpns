"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type TabType = 'hasil' | 'analisis';

export default function ResultPage() {
  const [activeTab, setActiveTab] = useState<TabType>('hasil');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const userAnswers = JSON.parse(localStorage.getItem('quizAnswers') || '{}');

  // state untuk list pertanyaan di database
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const currentQuestion = questions[currentQuestionIndex];

  // Hitung skor
  const score = questions.filter(q => userAnswers[q.id] === q.answer).length;
  const totalQuestions = questions.length;
  const percentage = (score / totalQuestions) * 100;

  useEffect(() => {
    const fetchQuestions = async (packageId: number) => {
      try {
        const res = await fetch(`/api/questions?package_id=${packageId}`);
        const data = await res.json();
        setQuestions(data);
      } catch (err) {
        alert("Gagal mengambil data soal.");
      } finally {
        setLoading(false);
      }
    };

    // ambil data paket 11
    fetchQuestions(11);
  }, []);

  // Fungsi untuk menentukan style jawaban
  const getAnswerStyle = (optionIndex: number) => {
    const optionLetter = String.fromCharCode(65 + optionIndex);
    const isUserAnswer = userAnswers[currentQuestion.id] === optionLetter;
    const isCorrectAnswer = currentQuestion.answer === optionLetter;

    if (isCorrectAnswer) {
      return "bg-green-100 border-green-500 text-green-800";
    } else if (isUserAnswer && !isCorrectAnswer) {
      return "bg-red-100 border-red-500 text-red-800";
    }
    return "border-gray-200";
  };

  const navigateToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  if (loading) return <p>Memuat soal...</p>;
  if (!questions.length) return <p>Soal tidak ditemukan</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">Hasil Tryout CPNS</h1>

        {/* Tab Navigation */}
        <div className="flex border-b mb-6">
          <button
            onClick={() => setActiveTab('hasil')}
            className={`px-4 py-2 font-medium ${activeTab === 'hasil' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          >
            Hasil
          </button>
          <button
            onClick={() => setActiveTab('analisis')}
            className={`px-4 py-2 font-medium ${activeTab === 'analisis' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          >
            Analisis
          </button>
        </div>

        {activeTab === 'hasil' ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Daftar Soal */}
            <div className="md:col-span-1 space-y-4">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="font-semibold mb-2">Daftar Soal</h3>
                <div className="grid grid-cols-5 gap-2">
                  {questions.map((q, index) => {
                    const isCorrect = userAnswers[q.id] === q.answer;
                    return (
                      <button
                        key={q.id}
                        onClick={() => navigateToQuestion(index)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${currentQuestionIndex === index
                          ? 'bg-blue-500 text-white'
                          : isCorrect
                            ? 'bg-green-100 text-green-800'
                            : userAnswers[q.id]
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100'
                          }`}
                      >
                        {index + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Konten Utama */}
            <div className="md:col-span-3">
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-lg mb-4">
                  {currentQuestionIndex + 1}. {currentQuestion.question}
                </h2>

                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => {
                    const optionLetter = String.fromCharCode(65 + index);
                    return (
                      <div
                        key={index}
                        className={`p-3 border rounded-lg ${getAnswerStyle(index)}`}
                      >
                        <div className="flex items-center">
                          <div className={`flex-shrink-0 h-6 w-6 rounded-full border flex items-center justify-center mr-3 ${currentQuestion.answer === optionLetter
                            ? 'bg-green-500 text-white border-green-500'
                            : userAnswers[currentQuestion.id] === optionLetter
                              ? 'bg-red-500 text-white border-red-500'
                              : 'border-gray-300'
                            }`}>
                            {optionLetter}
                          </div>
                          <span>{option}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="font-medium text-green-800">Jawaban benar:</p>
                  <p className="text-green-600 mb-3">
                    {currentQuestion.answer}. {currentQuestion.options[currentQuestion.answer.charCodeAt(0) - 65]}
                  </p>
                  <p>
                    {currentQuestion.explanation}
                  </p>
                </div>
              </div>

              <div className="flex justify-between mt-4">
                <button
                  onClick={() => setCurrentQuestionIndex(prev => Math.max(prev - 1, 0))}
                  disabled={currentQuestionIndex === 0}
                  className={`px-4 py-2 rounded-md ${currentQuestionIndex === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                >
                  Sebelumnya
                </button>
                <button
                  onClick={() => setCurrentQuestionIndex(prev => Math.min(prev + 1, questions.length - 1))}
                  disabled={currentQuestionIndex === questions.length - 1}
                  className={`px-4 py-2 rounded-md ${currentQuestionIndex === questions.length - 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                >
                  Berikutnya
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Tab Analisis */
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-6">Analisis Hasil</h2>

            {/* Ringkasan Skor */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-800">Skor Anda</h3>
                <p className="text-3xl font-bold text-blue-600">
                  {score}/{totalQuestions}
                </p>
                <p className="text-blue-500">{percentage.toFixed(1)}%</p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-green-800">Jawaban Benar</h3>
                <p className="text-3xl font-bold text-green-600">{score}</p>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-medium text-red-800">Jawaban Salah</h3>
                <p className="text-3xl font-bold text-red-600">{totalQuestions - score}</p>
              </div>
            </div>

            {/* Tempat untuk komponen analisis tambahan */}
            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4">Analisis Kategori Soal</h3>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p>Grafik dan analisis mendalam akan ditampilkan di sini</p>
                {/* Tambahkan komponen analisis di sini */}
              </div>
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/"
                className="px-4 mr-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Kembali ke Home
              </Link>
              <Link
                href="/quiz"
                className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
              >
                Coba Lagi
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
