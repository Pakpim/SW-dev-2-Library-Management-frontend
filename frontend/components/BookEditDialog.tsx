import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { Book } from "@/lib/book";

export default function BookEditDialog({
  book,
  updateBook,
}: {
  book: Book;
  updateBook: (id: string, data: Partial<Book>) => Promise<void>;
}) {
  const [name, setName] = useState<string>(book.title);
  const [author, setAuthor] = useState<string>(book.author);
  const [isbn, setIsbn] = useState<string>(book.ISBN);
  // return <button>edit</button>;
  return (
    <Dialog>
      <DialogTrigger className="flex-1 px-4 py-2 text-white rounded-md bg-blue-400 hover:bg-blue-500">
        Edit
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Book</DialogTitle>
          <DialogDescription>
            Make changes to the book details here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label
              htmlFor="name"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Book Name
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid gap-2">
            <label
              htmlFor="author"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Author
            </label>
            <input
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid gap-2">
            <label
              htmlFor="isbn"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              ISBN
            </label>
            <input
              id="isbn"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose>Cancel</DialogClose>
          <DialogClose
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            onClick={() => {
              updateBook(book._id, {
                title: name,
                author: author,
                ISBN: isbn,
              });
            }}>
            ok
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
