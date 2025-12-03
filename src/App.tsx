import { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import BookShowcase from "./components/BookShowcase";
import Footer from "./components/Footer";
import AboutPage from "./components/AboutPage";
import ProductsPage from "./components/ProductsPage";
import ContactPage from "./components/ContactPage";
import CartPage from "./components/CartPage";

export default function App() {
  const [currentPage, setCurrentPage] = useState<"home" | "about" | "products" | "contact" | "cart">("home");

  return (
    <div className="bg-neutral-50 min-h-screen w-full overflow-x-hidden">
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />
      {currentPage === "home" ? (
        <>
          <Hero />
          <Stats />
          <BookShowcase />
        </>
      ) : currentPage === "about" ? (
        <AboutPage />
      ) : currentPage === "products" ? (
        <ProductsPage />
      ) : currentPage === "contact" ? (
        <ContactPage />
      ) : (
        <CartPage onBack={() => setCurrentPage("products")} />
      )}
      <Footer onNavigate={setCurrentPage} />
    </div>
  );
}