"use client";

import { useState, useEffect } from "react";
import QuestionCard from "../../components/QuestionCard";
import Timer from "../../components/Timer";
import { useRouter } from "next/navigation";
import Link from "next/link";

type AnswerStatus = "answered" | "unanswered" | "ragu";

export default function QuizPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [pertanyaanRagu, setPertanyaanRagu] = useState<Record<number, boolean>>({});
  const router = useRouter();

  // state untuk list pertanyaan di database
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

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

  // handler untuk jawaban yang dipilih (A/B/C/D/E)
  const handleAnswer = (selectedOption: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: selectedOption,
    }));

    setPertanyaanRagu((prev) => {
      const newRagu = { ...prev };
      delete newRagu[currentQuestion.id];
      return newRagu;
    })
  };

  // navigasi ke soal berikutnya
  const handleNext = () => {
    if (isLastQuestion) {
      // simpan jawaban ke localStorage sebelum navigasi
      localStorage.setItem("quizAnswers", JSON.stringify(userAnswers));
      localStorage.setItem("quizRagu", JSON.stringify(pertanyaanRagu));
      router.push("/quiz/hasil");
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0));
  }

  const handleRagu = () => {
    setPertanyaanRagu((prev) => ({
      ...prev,
      [currentQuestion.id]: true,
    }));
    handleNext();
  };

  const handleTimeUp = () => {
    localStorage.setItem("quizAnswers", JSON.stringify(userAnswers));
    localStorage.setItem("quizRagu", JSON.stringify(pertanyaanRagu));
    router.push("/quiz/result");
  };

  const getQuestionStatus = (questionId: number): AnswerStatus => {
    if (userAnswers[questionId]) return "answered";
    if (pertanyaanRagu[questionId]) return "ragu";
    return "unanswered";
  };

  const navigateToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };


  if (loading) return <p>Memuat soal...</p>;
  if (!questions.length) return <p>Soal tidak ditemukan</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">Tryout CPNS</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1 space-y-4">
            <Timer initialTime={6000} onTimeUp={handleTimeUp} />
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="font-semibold mb-2">Daftar Soal</h3>
              <div className="grid grid-cols-5 gap-2">
                {questions.map((q, index) => {
                  const status = getQuestionStatus(q.id);
                  const bgColor = {
                    answered: "bg-green-100 text-green-800",
                    unanswered: "bg-red-100 text-red-800",
                    ragu: "bg-yellow-100 text-gray-800",
                  }[status];
                  return (
                    <button
                      key={q.id}
                      onClick={() => navigateToQuestion(index)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${currentQuestionIndex === index
                        ? "bg-blue-500 text-white"
                        : bgColor
                        }`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="md:col-span-3">
            <QuestionCard
              question={currentQuestion.question}
              questionNumber={currentQuestionIndex + 1}
              options={currentQuestion.options}
              selectedAnswer={userAnswers[currentQuestion.id] || null}
              onAnswer={handleAnswer}
              isRagu={pertanyaanRagu[currentQuestion.id] || false}
            />

            <div className="flex justify-end">
              <Link
                href="/"
                className="px-4 mr-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Batalkan
              </Link>
              <button
                onClick={handleRagu}
                className="px-4 py-2 mr-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Ragu-ragu
              </button>
              <button
                onClick={handlePrev}
                className={`px-4 py-2 rounded-md mr-4 ${currentQuestionIndex === 0 ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                disabled={currentQuestionIndex === 0}
              >
                Sebelumnya
              </button>
              <button
                onClick={handleNext}
                className={`px-4 py-2 rounded-md ${!userAnswers[currentQuestion.id]
                  ? "bg-green-300 hover:bg-green-400"
                  : "bg-green-500 hover:bg-green-600 text-white"
                  }`}
              >
                {isLastQuestion ? "Selesai" : "Lanjut"}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
