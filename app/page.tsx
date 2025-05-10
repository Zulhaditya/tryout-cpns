import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Tryout CPNS Online</h1>
        <p className="mb-6">Tes pengetahuan Anda untuk persiapan CPNS</p>
        <Link
          href="/quiz"
          className="px-6 py-3 mr-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Mulai Tryout
        </Link>
        <Link
          href="/admin"
          className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800"
        >
          Admin
        </Link>
      </div>
    </div>
  );
}
