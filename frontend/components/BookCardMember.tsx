// import { User } from "@/lib/auth";
// import { Book } from "@/lib/book";

// export default function BookCardMember({book, user}:{book:Book, user:User}){
//     return (
//       <div
//         key={book._id}
//         className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
//         {/* Book Cover */}
//         <div className="relative h-48 bg-gray-200 overflow-hidden">
//           <img
//             src={book.coverPicture}
//             alt={book.title}
//             className="w-full h-full object-cover"
//             onError={(e) => {
//               const img = e.target as HTMLImageElement;
//               img.src =
//                 "data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22150%22%3E%3Crect fill=%22%23ddd%22 width=%22100%22 height=%22150%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2214%22 fill=%22%23999%22 text-anchor=%22middle%22 dy=%22.3em%22%3ENo Image%3C/text%3E%3C/svg%3E";
//             }}
//           />
//         </div>

//         {/* Book Info */}
//         <div className="p-4 space-y-2">
//           <h3 className="font-bold text-gray-900 line-clamp-2">{book.title}</h3>
//           <p className="text-sm text-gray-600">
//             <span className="font-semibold">Author:</span> {book.author}
//           </p>
//           <p className="text-sm text-gray-600">
//             <span className="font-semibold">Publisher:</span> {book.publisher}
//           </p>
//           <p className="text-sm text-gray-600">
//             <span className="font-semibold">ISBN:</span> {book.ISBN}
//           </p>
//           <p className="text-sm font-semibold">
//             Available:{" "}
//             <span
//               className={
//                 book.availableAmount > 0 ? "text-green-600" : "text-red-600"
//               }>
//               {book.availableAmount}
//             </span>
//           </p>

//           {/* Reserve Button (for members only) */}
//           {user && user.role === "member" && (
//             <button
//               onClick={() => handleReserveBook(book._id)}
//               disabled={
//                 book.availableAmount === 0 || reservingBookId === book._id
//               }
//               className="w-full mt-4 py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition">
//               {reservingBookId === book._id ? "Reserving..." : "Reserve"}
//             </button>
//           )}
//         </div>
//       </div>
//     );
// }
