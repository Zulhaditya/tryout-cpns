'use client';

import { useEffect, useState } from 'react';
import FormSoal from '@/components/FormSoal';

type Paket = {
  id: number;
  name: string;
  description: string;
};

type Question = {
  id: number;
  question: string;
  category: string;
  sub_category: string;
  options: string[];
  answer: string;
  explanation: string;
};

export default function CreateSoalPage() {
  const [pakets, setPakets] = useState<Paket[]>([]);
  const [selectedPaket, setSelectedPaket] = useState<Paket | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    category: '',
    sub_category: '',
    question: '',
    options: ['', '', '', '', ''],
    answer: '',
    explanation: '',
  });

  useEffect(() => {
    const fetchPackages = async () => {
      const res = await fetch('/api/packages');
      const data = await res.json();
      setPakets(data);
    };
    fetchPackages();
  }, []);

  const handleSelect = (paket: Paket) => {
    setSelectedPaket(paket);
    fetchQuestions(paket.id);
    setShowForm(false);
    setEditingQuestionId(null);
  };

  const fetchQuestions = async (packageId: number) => {
    const res = await fetch(`/api/questions?package_id=${packageId}`);
    const data = await res.json();
    setQuestions(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEdit = (question: Question) => {
    setFormData({
      category: question.category,
      sub_category: question.sub_category,
      question: question.question,
      options: question.options,
      answer: question.answer,
      explanation: question.explanation
    });
    setEditingQuestionId(question.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus soal ini?')) return;

    const res = await fetch(`/api/questions/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      fetchQuestions(selectedPaket!.id);
    } else {
      alert('Gagal menghapus soal.');
    }
  };

  return (
    <div className="grid grid-cols-[minmax(auto,200px)_1.5fr_1fr] gap-6 p-6">
      {/* Kolom kiri: daftar paket */}
      <div className="space-y-4">
        <h1 className="text-xl font-bold">Daftar Paket</h1>
        <ul className="space-y-2">
          {pakets.map((paket) => (
            <li
              key={paket.id}
              className={`border rounded p-3 cursor-pointer ${selectedPaket?.id === paket.id ? 'bg-blue-100' : ''
                }`}
              onClick={() => handleSelect(paket)}
            >
              <p className="font-semibold">{paket.name}</p>
              <p className="text-sm text-gray-600">{paket.description}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Kolom tengah: aksi dan form */}
      <div className="space-y-4">
        {selectedPaket ? (
          <>
            <h2 className="text-lg font-semibold">
              {editingQuestionId ? 'Edit Soal' : 'Tambah Soal'} ke:{' '}
              <span className="text-blue-700">{selectedPaket.name}</span>
            </h2>
            {!showForm ? (
              <button
                onClick={() => {
                  setFormData({
                    category: '',
                    sub_category: '',
                    question: '',
                    options: ['', '', '', '', ''],
                    answer: '',
                    explanation: '',
                  });
                  setShowForm(true);
                  setEditingQuestionId(null);
                }}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                ➕ Tambah Soal Baru
              </button>
            ) : (
              <FormSoal
                packageId={selectedPaket.id}
                onSoalSaved={() => {
                  setShowForm(false);
                  fetchQuestions(selectedPaket.id);
                }}
                editingQuestion={questions.find(q => q.id === editingQuestionId) || null}
                clearEdit={() => {
                  setEditingQuestionId(null);
                  setShowForm(false);
                }}
              />
            )}
          </>
        ) : (
          <p>Pilih paket terlebih dahulu untuk menambah soal.</p>
        )}
      </div>

      {/* Kolom kanan: daftar soal */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Daftar Soal</h2>
        {selectedPaket ? (
          questions.length > 0 ? (
            <ul className="space-y-2">
              {questions.map((q, idx) => (
                <li key={q.id} className="border p-3 rounded space-y-1">
                  <p className="font-medium">
                    #{idx + 1} [{q.category}] {q.sub_category}
                  </p>
                  <p className="text-sm text-gray-700">{q.question.slice(0, 100)}...</p>
                  <div className="flex gap-2 text-sm mt-1">
                    <button
                      onClick={() => handleEdit(q)}
                      className="text-blue-600 hover:underline"
                    >
                      🖊 Edit
                    </button>
                    <button
                      onClick={() => handleDelete(q.id)}
                      className="text-red-600 hover:underline"
                    >
                      🗑 Hapus
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>Belum ada soal dalam paket ini.</p>
          )
        ) : (
          <p>Pilih paket terlebih dahulu.</p>
        )}
      </div>
    </div>
  );
}

