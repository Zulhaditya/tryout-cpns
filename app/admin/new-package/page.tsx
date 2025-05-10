'use client';

import { useState, useEffect } from 'react';
import PaketSidebar from '@/components/SidebarPaket';
import FormSoal from '@/components/FormSoal';
import DaftarSoal from '@/components/DaftarSoal';

export default function PaketPage() {
  const [packageId, setPackageId] = useState<number | null>(null);
  const [packageName, setPackageName] = useState('');
  const [questions, setQuestions] = useState<any[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);

  const fetchQuestions = async () => {
    if (!packageId) return;
    const res = await fetch(`/api/questions?package_id=${packageId}`);
    const data = await res.json();
    setQuestions(data);
  };

  useEffect(() => {
    fetchQuestions();
  }, [packageId]);

  const handleSoalSaved = () => {
    fetchQuestions();
  };

  return (
    <div className="flex min-h-screen">
      <PaketSidebar
        onPaketCreated={(id, name) => {
          setPackageId(id);
          setPackageName(name);
        }}
      />
      {packageId && (
        <>
          <FormSoal
            packageId={packageId}
            onSoalSaved={handleSoalSaved}
            editingQuestion={editingQuestion}
            clearEdit={() => setEditingQuestion(null)}
          />
          <DaftarSoal
            questions={questions}
            onEdit={setEditingQuestion}
          />
        </>
      )}
    </div>
  );
}

