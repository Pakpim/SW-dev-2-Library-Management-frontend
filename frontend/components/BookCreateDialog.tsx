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

export default function BookCreateDialog({
  createBook,
}: {
  createBook: (
    book: Omit<Book, "_id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
}) {
  const [name, setName] = useState<string>("");
  const [author, setAuthor] = useState<string>("book.author");
  const [isbn, setIsbn] = useState<string>("book.ISBN");

  return (
    <Dialog>
      <DialogTrigger className="px-4 py-2 text-white rounded-md bg-blue-600 hover:bg-blue-700">
        New Book
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Book</DialogTitle>
          <DialogDescription>
            Fill in the details of the new book here. Click save when you're
            done.
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
              createBook({
                title: name,
                author: author,
                ISBN: isbn,
                publisher: "string",
                availableAmount: 0,
                coverPicture: "string",
              });
            }}>
            ok
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
