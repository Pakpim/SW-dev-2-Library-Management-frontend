import { FormEvent, useState } from "react";
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
import Compressor from "compressorjs";

export default function BookCreateDialog({
  createBook,
  books,
}: {
  createBook: (
    book: Omit<Book, "_id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  books: Book[];
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [isbn, setIsbn] = useState<string>("");
  const [publisher, setPublisher] = useState<string>("");
  const [availableAmount, setAvailableAmount] = useState<number>(1);
  const [coverPicture, setCoverPicture] = useState<File | undefined>();
  const [validTitle, setValidTitle] = useState<boolean>(true);
  const [validIsbn, setValidIsbn] = useState<boolean>(true);

  function convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  }

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const image = e.target.files[0];
      new Compressor(image, {
        quality: 0.2,
        success: (compressedResult: File) => {
          // compressedResult has the compressed file.
          // Use the compressed file to upload the images to your server.
          setCoverPicture(compressedResult);
        },
      });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const base64Image = await convertToBase64(coverPicture!);
    createBook({
      title: title,
      author: author,
      ISBN: isbn,
      publisher: publisher,
      availableAmount: availableAmount,
      coverPicture: base64Image,
    });
    resetForm();
    setOpen(false);
  };

  const resetForm = () => {
    setTitle("");
    setAuthor("");
    setIsbn("");
    setPublisher("");
    setAvailableAmount(0);
    setCoverPicture(undefined);
    setValidTitle(true);
    setValidIsbn(true);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen(!open), resetForm();
      }}>
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
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label
                htmlFor="coverPicture"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Cover Picture
              </label>
              <input
                required
                placeholder="choose file"
                type="file"
                accept="image/*"
                id="coverPicture"
                onChange={handleUpload}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                htmlFor="title"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Book title
              </label>
              <input
                required
                id="title"
                value={title}
                onChange={(e) => {
                  if (books.find((book) => book.title === e.target.value)) {
                    setValidTitle(false);
                  } else {
                    setValidTitle(true);
                  }
                  setTitle(e.target.value);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {!validTitle && (
                <label className="text-red-600 text-sm">
                  Title already exists. Please use a different title.
                </label>
              )}
            </div>
            <div className="grid gap-2">
              <label
                htmlFor="author"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Author
              </label>
              <input
                required
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
                required
                id="isbn"
                value={isbn}
                onChange={(e) => {
                  if (books.find((book) => book.ISBN === e.target.value)) {
                    setValidIsbn(false);
                  } else {
                    setValidIsbn(true);
                  }
                  setIsbn(e.target.value);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {!validIsbn && (
                <label className="text-red-600 text-sm">
                  ISBN already exists. Please use a different ISBN.
                </label>
              )}
            </div>
            <div className="grid gap-2">
              <label
                htmlFor="publisher"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Publisher
              </label>
              <input
                required
                id="publisher"
                value={publisher}
                onChange={(e) => {
                  setPublisher(e.target.value);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid gap-2">
              <label
                htmlFor="availableAmount"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Available Amount
              </label>
              <input
                required
                type="number"
                id="availableAmount"
                min={0}
                value={availableAmount}
                onChange={(e) => {
                  setAvailableAmount(e.target.value as unknown as number);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose
              className="px-4 py-2 text-white bg-yellow-400 rounded-md hover:bg-yellow-500"
              onClick={resetForm}>
              Cancel
            </DialogClose>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              disabled={!validTitle || !validIsbn}>
              ok
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
