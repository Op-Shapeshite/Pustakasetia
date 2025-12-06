import { useState } from "react";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import Footer from "./components/Footer";
import AboutPage from "./components/AboutPage";
import ProductsPage from "./components/ProductsPage";
import ContactPage from "./components/ContactPage";
import CartPage from "./components/CartPage";
import BookDetailPage from "./components/BookDetailPage";
import LoginPage from "./components/LoginPage";
import DashboardPage from "./components/DashboardPage";

interface Book {
  id: number;
  image: string;
  title: string;
  author: string;
  price: string;
  pages?: number;
  size?: string;
  edition?: string;
  isbn?: string;
  paperType?: string;
  synopsis?: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<"home" | "about" | "products" | "contact" | "cart" | "detail" | "login" | "dashboard">("home");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [previousPage, setPreviousPage] = useState<"home" | "products">("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleBookClick = (book: Book, fromPage: "home" | "products") => {
    setSelectedBook(book);
    setPreviousPage(fromPage);
    setCurrentPage("detail");
    window.scrollTo(0, 0);
  };

  const handleBackFromDetail = () => {
    setCurrentPage(previousPage);
    setSelectedBook(null);
    window.scrollTo(0, 0);
  };

  const handleBackFromLogin = () => {
    setCurrentPage("home");
    window.scrollTo(0, 0);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setCurrentPage("dashboard");
    window.scrollTo(0, 0);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage("home");
    window.scrollTo(0, 0);
  };

  return (
    <div className="bg-neutral-50 min-h-screen w-full overflow-x-hidden">
      {currentPage !== "dashboard" && <Header currentPage={currentPage} onNavigate={setCurrentPage} />}
      {currentPage === "home" ? (
        <HomePage onBookClick={(book) => handleBookClick(book, "home")} />
      ) : currentPage === "about" ? (
        <AboutPage />
      ) : currentPage === "products" ? (
        <ProductsPage onBookClick={(book) => handleBookClick(book, "products")} />
      ) : currentPage === "contact" ? (
        <ContactPage />
      ) : currentPage === "cart" ? (
        <CartPage onBack={() => setCurrentPage("products")} />
      ) : currentPage === "login" ? (
        <LoginPage onBack={handleBackFromLogin} onLoginSuccess={handleLoginSuccess} />
      ) : currentPage === "dashboard" ? (
        <DashboardPage onLogout={handleLogout} onNavigate={setCurrentPage} />
      ) : currentPage === "detail" && selectedBook ? (
        <BookDetailPage book={selectedBook} onBack={handleBackFromDetail} />
      ) : null}
      {currentPage !== "detail" && currentPage !== "login" && currentPage !== "dashboard" && <Footer onNavigate={setCurrentPage} />}
    </div>
  );
}