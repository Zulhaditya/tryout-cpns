"use client";

import { questions } from "../../../data/questions";
import { useEffect, useState } from "react";
import Link from "next/link";

// fungsi konversi indeks ke huruf (0 => "A", 1 => "B")
const indexToLetter = (index: number) => String.fromCharCode(65 + index);

export default function ResultPage() {
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [pertanyaanRagu, setPertanyaanRagu] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const savedAnswers = localStorage.getItem("quizAnswers");
    const savedRagu = localStorage.getItem("quizRagu");

    if (savedAnswers) {
      const parsedAnswers = JSON.parse(savedAnswers);
      setUserAnswers(parsedAnswers);

      let correct = 0;
      questions.forEach((q) => {
        if (parsedAnswers[q.id] === q.answer) {
          correct++;
        }
      });
      setScore(correct);
    }

    if (savedRagu) {
      setPertanyaanRagu(JSON.parse(savedRagu));
    }
  }, []);

  // dapatkan teks opsi berdasarkan ID soal dan jawaban (A/B/C/D/E)
  const getAnswerText = (questionId: number, answerLetter: string) => {
    const question = questions.find(q => q.id == questionId);
    if (!question) return "-";

    const optionIndex = answerLetter.charCodeAt(0) - 65;
    return question.options[optionIndex];
  }

  const getQuestionStatus = (questionId: number) => {
    if (userAnswers[questionId]) return "answered";
    if (pertanyaanRagu[questionId]) return "ragu";
    return "unanswered";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Hasil Tryout CPNS</h1>

        <div className="text-center mb-8">
          <p className="text-lg">Skor Anda:</p>
          <p className="text-4xl font-bold text-blue-600">
            {score} / {questions.length}
          </p>
          <p className="text-gray-600 mt-2">
            {((score / questions.length) * 100).toFixed(1)}%
          </p>
        </div>

        <div className="space-y-6">
          {questions.map((q) => {
            const userAnswerLetter = userAnswers[q.id];
            const isCorrect = userAnswerLetter === q.answer;
            const status = getQuestionStatus(q.id);
            const statusText = {
              answered: "Terjawab",
              unanswered: "Belum terjawab",
              ragu: "Ragu-ragu",
            }[status];

            return (
              <div key={q.id} className="border-b pb-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{q.question}</h3>
                  <span className={`px-2 py-1 text-xs rounded ${status === "answered"
                    ? "bg-green-100 text-green-800"
                    : status === "ragu"
                      ? "bg-gray-100 text-gray-800"
                      : "bg-red-100 text-red-800"
                    }`}>
                    {statusText}
                  </span>
                </div>
                <div className="mt-2">
                  <p>
                    <span className="font-medium">Jawaban Anda:</span>{" "}
                    <span className={isCorrect ? "text-green-600" : "text-red-600"}>
                      {userAnswerLetter
                        ? `${userAnswerLetter}. ${getAnswerText(q.id, userAnswerLetter)}`
                        : "-"}
                    </span>
                  </p>

                  {!isCorrect && (
                    <p>
                      <span className="font-medium">Jawaban benar:</span>{" "}
                      <span className="text-green-600">
                        {q.answer}. {getAnswerText(q.id, q.answer)}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            );
          })}
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
    </div>
  );
}
