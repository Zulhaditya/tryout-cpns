'use client';

import { useState, useEffect } from 'react';

const categories = ['TWK', 'TIU', 'TKP'];
const subCategories = [
  'Integritas', 'Penalaran Analitis', 'Pancasila', 'UUD 1945',
  'Wawasan Kebangsaan', 'Nasionalisme', 'Numerik', 'Figural'
];

interface FormSoalProps {
  packageId: number;
  onSoalSaved: () => void;
  editingQuestion?: any;
  clearEdit: () => void;
}

export default function FormSoal({ packageId, onSoalSaved, editingQuestion, clearEdit }: FormSoalProps) {
  const defaultForm = {
    category: '',
    sub_category: '',
    question: '',
    options: ['', '', '', '', ''],
    answer: '',
    explanation: '',
  };
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (editingQuestion) setForm(editingQuestion);
  }, [editingQuestion]);

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleOptionChange = (index: number, value: string) => {
    const options = [...form.options];
    options[index] = value;
    setForm({ ...form, options });
  };

  const handleReset = () => {
    setForm(defaultForm);
    clearEdit();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingQuestion?.id ? 'PUT' : 'POST';
    const url = '/api/questions';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, package_id: packageId }),
    });

    if (res.ok) {
      alert('Berhasil menyimpan soal!')
      onSoalSaved();
      handleReset();
    } else {
      alert('Gagal menyimpan soal');
    }
  };

  return (
    <section className="w-2/4 p-4">
      <form onSubmit={handleSubmit} className="space-y-2">
        <select name="category" value={form.category} onChange={handleChange} required className="w-full border p-2 rounded">
          <option value="">-- Pilih Kategori --</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>

        <select name="sub_category" value={form.sub_category} onChange={handleChange} className="w-full border p-2 rounded">
          <option value="">-- Pilih Sub-Kategori --</option>
          {subCategories.map(sub => <option key={sub} value={sub}>{sub}</option>)}
        </select>

        <textarea name="question" value={form.question} onChange={handleChange} placeholder="Pertanyaan" required className="w-full border p-2 rounded" rows={4} />

        {['A', 'B', 'C', 'D', 'E'].map((label, idx) => (
          <input
            key={label}
            type="text"
            placeholder={`Opsi ${label}`}
            value={form.options[idx]}
            onChange={e => handleOptionChange(idx, e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        ))}

        <select name="answer" value={form.answer} onChange={handleChange} required className="w-full border p-2 rounded">
          <option value="">-- Jawaban Benar --</option>
          {['A', 'B', 'C', 'D', 'E'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>

        <textarea name="explanation" value={form.explanation} onChange={handleChange} placeholder="Penjelasan" className="w-full border p-2 rounded" rows={3} />

        <div className="flex gap-2">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            {editingQuestion ? 'Simpan Perubahan' : 'Simpan Soal'}
          </button>
          <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={handleReset}>
            Reset
          </button>
        </div>
      </form>
    </section>
  );
}

