'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useAppState } from "@/contexts/AppStateContext";
import { useToast } from "@/contexts/ToastContext";

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, clearCart } = useAppState();
  const { showToast } = useToast();
  const [isMobile, setIsMobile] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: ""
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const handleRemoveItem = (itemId: number) => {
    removeFromCart(itemId);
  };

  const handleBack = () => {
    router.push('/products');
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const subtotal = calculateTotal();
  const shipping = 15000;
  const total = subtotal + shipping;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.address) {
      showToast("Mohon lengkapi semua data!", "warning");
      return;
    }

    let message = `*PESANAN BUKU*\\n\\n`;
    message += `*Data Penerima:*\\n`;
    message += `Nama: ${formData.name}\\n`;
    message += `Telepon: ${formData.phone}\\n`;
    message += `Alamat: ${formData.address}\\n\\n`;
    message += `*Detail Pesanan:*\\n`;

    cart.forEach((item, index) => {
      message += `\\n${index + 1}. ${item.title}\\n`;
      message += `   Harga: Rp${item.price.toLocaleString('id-ID')}\\n`;
      message += `   Jumlah: ${item.quantity}\\n`;
    });

    message += `\\n*Ringkasan:*\\n`;
    message += `Sub Total: Rp${subtotal.toLocaleString('id-ID')}\\n`;
    message += `Ongkos Kirim: Rp${shipping.toLocaleString('id-ID')}\\n`;
    message += `*Total: Rp${total.toLocaleString('id-ID')}*`;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=6282116109258&text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    clearCart();
    setFormData({ name: "", phone: "", address: "" });
    showToast("Pesanan berhasil dikirim!", "success");
  };

  if (cart.length === 0) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center py-12">
        <div className="max-w-md text-center space-y-4">
          <p className="font-['Poppins',sans-serif] text-2xl text-[#2f2f2f]">
            Keranjang Kosong
          </p>
          <p className="font-['Poppins',sans-serif] text-gray-500">
            Belum ada buku yang ditambahkan ke keranjang
          </p>
          <button
            onClick={handleBack}
            className="bg-[#ffcc00] text-[#2f2f2f] font-['Poppins',sans-serif] px-8 py-3 rounded-[6px] hover:opacity-90 transition-opacity"
          >
            Lihat Produk
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-6 md:py-8 lg:py-12 relative bg-neutral-50 font-['Poppins',sans-serif]">
      {/* "Menu Keranjang" Title for Mobile, "Pesanan Saya" for Desktop */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h1 className="font-medium text-[24px] md:text-[36px] text-black">
            {isMobile ? "Menu Keranjang" : "Pesanan Saya"}
          </h1>
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="h-6 w-6 text-[#2f2f2f]" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Column - Cart Items */}
          <div className="space-y-6">
            <div className="bg-white border border-[#d9d9d9] rounded-[24px] shadow-lg overflow-hidden">
              {/* Desktop Header */}
              <div className="hidden lg:flex items-center gap-6 px-6 py-4 bg-neutral-50 border-b border-gray-100 text-sm font-medium text-gray-500">
                <div className="w-24 flex-shrink-0">Produk</div>
                <div className="flex-1 grid grid-cols-12 gap-4">
                  <div className="col-span-4">Judul Buku</div>
                  <div className="col-span-3">Cetakan</div>
                  <div className="col-span-3">ISBN</div>
                  <div className="col-span-2">Harga</div>
                </div>
                <div className="w-5"></div>
              </div>

              <div className="p-4 md:p-6 space-y-6 lg:space-y-0 lg:divide-y lg:divide-gray-100">
                {cart.map((item) => (
                  <div key={item.id} className="flex flex-col lg:flex-row gap-4 lg:items-center pb-6 lg:pb-4 lg:pt-4 border-b border-gray-200 lg:border-none last:border-b-0 last:pb-0 relative">
                    {/* Book Cover */}
                    <div className="flex gap-4 lg:w-24 flex-shrink-0">
                      {item.image && (
                        <div className="w-24 lg:w-24 flex-shrink-0">
                          <div className="aspect-[3/4] rounded-[8px] overflow-hidden border border-gray-100 shadow-sm">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Book Details */}
                    {isMobile ? (
                      // Mobile View: Stacked Label : Value (Optimized)
                      <div className="flex-1 space-y-2 text-sm text-[#2f2f2f]">
                        <div className="font-semibold text-base pr-8">{item.title}</div>
                        {item.author && <div className="text-gray-500 text-xs mb-2">{item.author}</div>}

                        <div className="grid grid-cols-[80px,1fr] gap-x-2 gap-y-1">
                          <span className="text-gray-500">Cetakan</span>
                          <span>{item.edition || "Ke-1. 2025"}</span>

                          <span className="text-gray-500">ISBN</span>
                          <span>{item.isbn || "978-979-000-000-0"}</span>

                          <span className="text-gray-500">Harga</span>
                          <span className="font-semibold text-green-600">Rp{item.price.toLocaleString('id-ID')}</span>

                          {item.quantity > 1 && (
                            <>
                              <span className="text-gray-500">Jumlah</span>
                              <span>{item.quantity}</span>
                            </>
                          )}
                        </div>
                      </div>
                    ) : (
                      // Desktop View: Table Grid (Aligned with Header)
                      <div className="flex-1 grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-4 pr-4">
                          <p className="text-sm font-semibold text-[#2f2f2f] line-clamp-2 mb-1">{item.title}</p>
                          <p className="text-xs text-gray-400 line-clamp-1">{item.author || "Penulis"}</p>
                        </div>
                        <div className="col-span-3">
                          <p className="text-sm text-gray-600">{item.edition || "Ke-1. 2025"}</p>
                        </div>
                        <div className="col-span-3">
                          <p className="text-sm text-gray-600">{item.isbn || "978-979-000-000-0"}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-sm font-bold text-green-600">
                            Rp{item.price.toLocaleString('id-ID')}
                          </p>
                          {item.quantity > 1 && <p className="text-xs text-gray-400 mt-1">x{item.quantity}</p>}
                        </div>
                      </div>
                    )}

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="absolute top-0 right-0 lg:static lg:p-2 hover:bg-red-50 rounded-full transition-colors group"
                      title="Hapus"
                    >
                      <Trash2 className="h-5 w-5 text-gray-300 group-hover:text-red-500 transition-colors" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Form and Summary */}
          <div className="space-y-6">
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-gray-500 mb-2 block">Nama Penerima</label>
                <input
                  type="text"
                  placeholder="Masukkan nama penerima"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full bg-white border border-[#d9d9d9] rounded-[8px] px-4 py-3 text-sm text-gray-500 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffcc00]"
                />
              </div>

              <div>
                <label className="text-sm text-gray-500 mb-2 block">No. Telephone</label>
                <input
                  type="tel"
                  placeholder="Masukkan nomber telephone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="w-full bg-white border border-[#d9d9d9] rounded-[8px] px-4 py-3 text-sm text-gray-500 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffcc00]"
                />
              </div>

              <div>
                <label className="text-sm text-gray-500 mb-2 block">Alamat Kirim</label>
                <textarea
                  placeholder="Masukkan alamat kirim lengkap"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                  rows={4}
                  className="w-full bg-white border border-[#d9d9d9] rounded-[8px] px-4 py-3 text-sm text-gray-500 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffcc00] resize-none"
                />
              </div>

              {/* Price Summary */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <p className="text-black text-base md:text-lg">Sub Harga</p>
                  <p className="text-black text-base md:text-lg">Rp{subtotal.toLocaleString('id-ID')}</p>
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-black text-base md:text-lg">Ongkos Kirim</p>
                  <p className="text-black text-base md:text-lg">Rp{shipping.toLocaleString('id-ID')}</p>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-gray-200 text-[#2f2f2f]">
                  <p className="text-lg md:text-[20px] font-medium">Total Harga</p>
                  <p className="text-lg md:text-[20px] font-medium">Rp{total.toLocaleString('id-ID')}</p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-green-500 text-white font-medium text-lg md:text-xl px-8 py-4 rounded-[6px] hover:bg-green-600 transition-colors"
              >
                Pesan Sekarang
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
