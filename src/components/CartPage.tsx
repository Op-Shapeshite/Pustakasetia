import { useState, useEffect } from "react";
import { ArrowLeft, Trash2 } from "lucide-react";
import { getCartItems, removeFromCart, getCartTotal, clearCart, CartItem } from "../utils/cartStorage";

interface CartPageProps {
  onBack: () => void;
}

export default function CartPage({ onBack }: CartPageProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: ""
  });

  useEffect(() => {
    loadCart();
    
    // Listen for cart updates
    const handleCartUpdate = () => {
      loadCart();
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const loadCart = () => {
    const items = getCartItems();
    setCartItems(items);
  };

  const handleRemoveItem = (itemId: number) => {
    removeFromCart(itemId);
    loadCart();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.address) {
      alert("Mohon lengkapi semua data!");
      return;
    }

    // Prepare WhatsApp message
    let message = `*PESANAN BUKU*\n\n`;
    message += `*Data Penerima:*\n`;
    message += `Nama: ${formData.name}\n`;
    message += `Telepon: ${formData.phone}\n`;
    message += `Alamat: ${formData.address}\n\n`;
    message += `*Detail Pesanan:*\n`;
    
    cartItems.forEach((item, index) => {
      message += `\n${index + 1}. ${item.title}\n`;
      message += `   Harga: ${item.price}\n`;
      message += `   Jumlah: ${item.quantity}\n`;
    });
    
    const subtotal = getCartTotal();
    const shipping = 15000;
    const total = subtotal + shipping;
    
    message += `\n*Ringkasan:*\n`;
    message += `Sub Total: Rp${subtotal.toLocaleString('id-ID')}\n`;
    message += `Ongkos Kirim: Rp${shipping.toLocaleString('id-ID')}\n`;
    message += `*Total: Rp${total.toLocaleString('id-ID')}*`;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=6282116109258&text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    // Clear cart after order
    clearCart();
    loadCart();
    setFormData({ name: "", phone: "", address: "" });
  };

  const subtotal = getCartTotal();
  const shipping = 15000;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
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
            onClick={onBack}
            className="bg-[#ffcc00] text-[#2f2f2f] font-['Poppins',sans-serif] px-8 py-3 rounded-[6px] hover:opacity-90 transition-opacity"
          >
            Lihat Produk
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-6 md:py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h1 className="font-['Poppins',sans-serif] text-2xl md:text-3xl lg:text-4xl text-black">
            Pesanan Saya
          </h1>
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="h-6 w-6 text-[#2f2f2f]" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Column - Cart Items */}
          <div className="space-y-6">
            <div className="bg-white border border-[#d9d9d9] rounded-[24px] shadow-lg p-4 md:p-6">
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-6 border-b border-gray-200 last:border-b-0 last:pb-0">
                    {/* Book Cover */}
                    <div className="w-24 md:w-32 flex-shrink-0">
                      <div className="aspect-[170/248] rounded-[12px] overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Book Details */}
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="font-['Poppins',sans-serif] text-[#2f2f2f] text-sm md:text-base mb-1">
                          Judul Buku
                        </p>
                        <p className="font-['Poppins',sans-serif] text-[#2f2f2f] text-xs md:text-sm line-clamp-3">
                          {item.title}
                        </p>
                      </div>

                      <div>
                        <p className="font-['Poppins',sans-serif] text-[#2f2f2f] text-sm md:text-base mb-1">
                          Cetakan
                        </p>
                        <p className="font-['Poppins',sans-serif] text-gray-500 text-xs md:text-sm">
                          {item.edition || "Ke-1. 2025"}
                        </p>
                      </div>

                      <div>
                        <p className="font-['Poppins',sans-serif] text-[#2f2f2f] text-sm md:text-base mb-1">
                          ISBN
                        </p>
                        <p className="font-['Poppins',sans-serif] text-gray-500 text-xs md:text-sm">
                          {item.isbn || "978-979-076-799-1"}
                        </p>
                      </div>

                      <div>
                        <p className="font-['Poppins',sans-serif] text-[#2f2f2f] text-sm md:text-base mb-1">
                          Harga
                        </p>
                        <p className="font-['Poppins',sans-serif] text-[#2f2f2f] text-xs md:text-sm">
                          {item.price}
                        </p>
                        {item.quantity > 1 && (
                          <p className="font-['Poppins',sans-serif] text-gray-500 text-xs">
                            x{item.quantity}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="flex-shrink-0 p-2 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <Trash2 className="h-5 w-5 text-red-500" />
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
                <label className="font-['Poppins',sans-serif] text-sm text-gray-500 mb-2 block">
                  Nama Penerima
                </label>
                <input
                  type="text"
                  placeholder="Masukkan nama penerima"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full bg-white border border-[#d9d9d9] rounded-[8px] px-4 py-3 font-['Poppins',sans-serif] text-sm text-gray-500 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffcc00]"
                />
              </div>

              <div>
                <label className="font-['Poppins',sans-serif] text-sm text-gray-500 mb-2 block">
                  No. Telephone
                </label>
                <input
                  type="tel"
                  placeholder="Masukkan nomber telephone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="w-full bg-white border border-[#d9d9d9] rounded-[8px] px-4 py-3 font-['Poppins',sans-serif] text-sm text-gray-500 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffcc00]"
                />
              </div>

              <div>
                <label className="font-['Poppins',sans-serif] text-sm text-gray-500 mb-2 block">
                  Alamat Kirim
                </label>
                <textarea
                  placeholder="Masukkan alamat kirim lengkap"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                  rows={4}
                  className="w-full bg-white border border-[#d9d9d9] rounded-[8px] px-4 py-3 font-['Poppins',sans-serif] text-sm text-gray-500 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffcc00] resize-none"
                />
              </div>

              {/* Price Summary */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <p className="font-['Poppins',sans-serif] text-black text-base md:text-lg">
                    Sub Harga
                  </p>
                  <p className="font-['Poppins',sans-serif] text-black text-base md:text-lg">
                    Rp{subtotal.toLocaleString('id-ID')}
                  </p>
                </div>

                <div className="flex justify-between items-center">
                  <p className="font-['Poppins',sans-serif] text-black text-base md:text-lg">
                    Ongkos Kirim
                  </p>
                  <p className="font-['Poppins',sans-serif] text-black text-base md:text-lg">
                    Rp{shipping.toLocaleString('id-ID')}
                  </p>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <p className="font-['Poppins',sans-serif] text-black text-lg md:text-xl">
                    Total Harga
                  </p>
                  <p className="font-['Poppins',sans-serif] text-black text-lg md:text-xl">
                    Rp{total.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-green-500 text-white font-['Poppins',sans-serif] text-lg md:text-xl px-8 py-4 rounded-[6px] hover:bg-green-600 transition-colors"
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
