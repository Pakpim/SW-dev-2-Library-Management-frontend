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
import Dropzone from "react-dropzone";
import { DropzoneContent, DropzoneEmptyState } from "./ui/shadcn-io/dropzone";

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
  const [coverPicture, setCoverPicture] = useState<File | undefined>();

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCoverPicture(e.target.files[0]);
    }
  };

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
              htmlFor="coverPicture"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Cover Picture
            </label>
            <input
              type="file"
              accept="image/*"
              id="coverPicture"
              onChange={handleUpload}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {coverPicture && (
              <img
                src={URL.createObjectURL(coverPicture)}
                alt="Cover Preview"
                className="mt-2 h-32 object-contain"
              />
            )}
          </div>
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
                coverPicture: coverPicture
                  ? URL.createObjectURL(coverPicture)
                  : "",
              });
            }}>
            ok
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
