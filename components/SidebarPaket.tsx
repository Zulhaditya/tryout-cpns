'use client';

import { useState } from 'react';
import Link from 'next/link';

interface PaketSidebarProps {
  onPaketCreated: (id: number, name: string) => void;
}

export default function PaketSidebar({ onPaketCreated }: PaketSidebarProps) {
  const [form, setForm] = useState({ name: '', description: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/packages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      const data = await res.json();
      onPaketCreated(data.id, form.name);
      setForm({ name: '', description: '' });
    } else {
      alert('Gagal membuat paket');
    }
  };

  return (
    <aside className="w-1/4 border-r p-4">
      <h2 className="font-bold text-lg mb-4">Buat Paket Baru</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="text"
          name="name"
          placeholder="Nama Paket"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <textarea
          name="description"
          placeholder="Deskripsi"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded w-full">
          Simpan Paket
        </button>
      </form>

      <div>
        <Link
          href="/admin/view-soal"
        >
          Paket premium 1
        </Link>
      </div>
    </aside>
  );
}

