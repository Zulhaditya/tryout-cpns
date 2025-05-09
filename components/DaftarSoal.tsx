'use client';

interface DaftarSoalProps {
  questions: any[];
  onEdit: (question: any) => void;
}

export default function DaftarSoal({ questions, onEdit }: DaftarSoalProps) {
  return (
    <aside className="w-1/4 border-l p-4">
      <h3 className="font-semibold text-lg mb-4">Daftar Soal</h3>
      {questions.length === 0 && <p className="text-sm text-gray-500">Belum ada soal.</p>}
      <ul className="space-y-2">
        {questions.map((q, i) => (
          <li key={q.id} className="border p-2 rounded">
            <p className="text-sm font-medium">#{i + 1} [{q.category}]</p>
            <p className="text-xs">{q.question.slice(0, 50)}...</p>
            <button
              onClick={() => onEdit(q)}
              className="text-blue-600 underline text-xs mt-1"
            >
              Edit
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

