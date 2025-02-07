import React, { useContext, useEffect, useState } from "react";
import { bookContext } from "../context/bookContext";
import { useParams } from "react-router-dom";
import Book1 from "../assets/Book1.png";

const BookDetail = () => {
  const { bookId } = useParams();
  const { books } = useContext(bookContext);
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      setLoading(true);
      try {
        if (books.length > 0) {
          const foundBook = books.find((item) => item._id === bookId);
          if (foundBook) {
            setBook(foundBook);
          } else {
            setError("Book Not Found");
          }
        } else {
          // Fetch books from API as a fallback
          const response = await fetch(
            "https://book-inventry-api.onrender.com/api/books"
          );
          if (!response.ok) throw new Error("Failed to fetch books.");
          const data = await response.json();

          const foundBook = data.find((item) => item._id === bookId);
          if (foundBook) {
            setBook(foundBook);
          } else {
            setError("Book Not Found");
          }
        }
      } catch (err) {
        setError("An error occurred while fetching the book details.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [bookId, books]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="text-xl text-gray-600">Loading book details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-600">
        <span className="text-xl">{error}</span>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-600">
        <span className="text-xl">Book Not Found</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-md p-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">{book.title}</h1>

        <div className="w-full h-80 mb-6 overflow-hidden rounded-md">
          <img
            src={
              book.image === ""
                ? Book1
                : `https://book-inventry-api.onrender.com${book.image}`
            }
            alt={book.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="text-gray-600 mb-4">
          <p className="text-xl">
            <span className="font-semibold">Author:</span> {book.author}
          </p>
          <p className="text-lg">
            <span className="font-semibold">Published Year:</span> {book.year}
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Description</h2>
          <p className="text-gray-600 leading-relaxed">{book.description}</p>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
