import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-b from-blue-50 to-white">
      <main className="max-w-4xl mx-auto text-center px-4 py-12">
        <h1 className="text-5xl md:text-6xl font-bold text-blue-600 mb-4">
          📚 Welcome to LibManager
        </h1>

        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          A modern library management system designed to make book discovery and
          reservations simple and efficient.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/books"
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-md"
          >
            Browse Books
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-3">🔍</div>
            <h3 className="font-bold text-lg text-blue-600 mb-2">
              Search & Discover
            </h3>
            <p className="text-gray-600">
              Find books by title, author, or publisher with our powerful search
              and filter system.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-3">📖</div>
            <h3 className="font-bold text-lg text-blue-600 mb-2">
              Easy Reservations
            </h3>
            <p className="text-gray-600">
              Reserve books in just one click and track your reservations in
              real-time.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-3">⚙️</div>
            <h3 className="font-bold text-lg text-blue-600 mb-2">
              Admin Control
            </h3>
            <p className="text-gray-600">
              Admins can manage the library&apos;s collection and all
              reservations efficiently.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
