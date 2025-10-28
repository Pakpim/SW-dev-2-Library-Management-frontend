import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-b from-blue-50 to-white">
      <main className="max-w-4xl mx-auto text-center px-4 py-12">
        <h1 className="text-5xl md:text-6xl font-bold text-blue-600 mb-4">
          📚 404 Not Found
        </h1>
        <Link
          href="/"
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-md"
        >
          Go to Home
        </Link>
      </main>
    </div>
  );
}
