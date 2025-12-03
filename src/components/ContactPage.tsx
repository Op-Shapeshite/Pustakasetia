import { useState } from "react";
import imgRectangle1304 from "figma:asset/5356fe8fc2ba02e35b411522adcb69849c779ed7.png";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Send WhatsApp message
    const message = `Halo, saya ${formData.name}. ${formData.message}`;
    const whatsappUrl = `https://api.whatsapp.com/send?phone=6282116109258&text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative w-full h-[300px] md:h-[400px] lg:h-[450px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src={imgRectangle1304} 
            alt="Books background" 
            className="w-full h-full object-cover"
          />
        </div>
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />
        
        {/* Content */}
        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
          <h1 className="font-['Poppins',sans-serif] text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-4 md:mb-6">
            Kontak - Pustaka setia
          </h1>
          <p className="font-['Poppins',sans-serif] text-[#fbfaf6] text-sm md:text-base lg:text-lg max-w-3xl leading-relaxed">
            Jika Anda mempunyai pertanyaan seputar layanan maupun produk kami, hubungi admin kami. Kami di sini siap untuk membantu Anda.
          </p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="w-full py-8 md:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Side - Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="font-['Neue_Montreal',sans-serif] text-[#2f2f2f] text-3xl md:text-4xl lg:text-5xl mb-4">
                  Hubungi Kami
                </h2>
                <p className="font-['Neue_Montreal',sans-serif] text-[#2f2f2f] text-base md:text-lg leading-relaxed">
                  kesempatan untuk terhubung dan mendapatkan bantuan atau informasi lebih lanjut. Jangan ragu untuk menghubungi kami.
                </p>
              </div>

              {/* Office */}
              <div className="space-y-3">
                <h3 className="font-['Neue_Montreal',sans-serif] text-[#2f2f2f] text-lg md:text-xl">
                  Office
                </h3>
                <p className="font-['Neue_Montreal',sans-serif] text-[#2f2f2f] text-base">
                  Bandung, ID
                </p>
                <p className="font-['Neue_Montreal',sans-serif] text-[#2f2f2f] text-base leading-relaxed">
                  Jl. BKR No.162-164, Cigereleng, Kec. Regol, Kota Bandung, Jawa Barat 40253
                </p>
              </div>

              {/* Consultation */}
              <div className="space-y-3">
                <h3 className="font-['Neue_Montreal',sans-serif] text-[#2f2f2f] text-lg md:text-xl">
                  Konsultasi
                </h3>
                <p className="font-['Neue_Montreal',sans-serif] text-[#2f2f2f] text-base">
                  Info Layanan
                </p>
                <p className="font-['Neue_Montreal',sans-serif] text-[#2f2f2f] text-base">
                  <span className="text-base">(+62) 821 1610 9258</span>
                  <span className="text-sm ml-1">(Official Whatsapp)</span>
                </p>
                
                {/* WhatsApp Button */}
                <a
                  href="https://api.whatsapp.com/send?phone=6282116109258"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#eef9f6] text-[#6dc2aa] px-6 py-3 rounded-[5px] hover:opacity-90 transition-opacity"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 0C4.477 0 0 4.477 0 10c0 1.89.525 3.66 1.438 5.168L0 20l4.99-1.416C6.425 19.46 8.155 20 10 20c5.523 0 10-4.477 10-10S15.523 0 10 0zm5.478 14.31c-.241.678-1.198 1.242-1.959 1.405-.52.11-1.197.198-3.48-.748-2.91-1.206-4.78-4.173-4.923-4.364-.14-.19-1.157-1.54-1.157-2.94 0-1.4.732-2.09 1.011-2.376.232-.238.62-.357.989-.357.12 0 .228.006.327.011.263.012.395.028.568.442.216.519.74 1.807.805 1.939.065.132.109.286.022.463-.087.177-.13.287-.26.442-.13.154-.272.345-.389.463-.13.132-.265.275-.114.54.15.264.67 1.105 1.437 1.789.987.879 1.817 1.152 2.08 1.282.262.13.415.109.568-.065.154-.175.657-.767.832-1.031.175-.264.35-.22.59-.132.24.087 1.525.72 1.787.85.262.131.437.197.502.306.065.11.065.633-.176 1.31z"/>
                  </svg>
                  <span className="font-['Poppins',sans-serif] text-base">Whatsapp Now</span>
                </a>
              </div>
            </div>

            {/* Right Side - Contact Form */}
            <div className="bg-white rounded-[24px] shadow-lg p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                  <input
                    type="text"
                    placeholder="Nama Lengkap"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full bg-[#f7f7f7] rounded-[8px] px-6 py-5 font-['Poppins',sans-serif] text-[#2f2f2f] placeholder:text-[#b4b4b4] text-base shadow-[4px_4px_15px_4px_rgba(0,0,0,0.1)] border-none focus:outline-none focus:ring-2 focus:ring-[#ffcc00]"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <input
                    type="email"
                    placeholder="Alamat Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full bg-[#f7f7f7] rounded-[8px] px-6 py-5 font-['Poppins',sans-serif] text-[#2f2f2f] placeholder:text-[#b4b4b4] text-base shadow-[4px_4px_15px_4px_rgba(0,0,0,0.1)] border-none focus:outline-none focus:ring-2 focus:ring-[#ffcc00]"
                  />
                </div>

                {/* Message Field */}
                <div>
                  <textarea
                    placeholder="Beritahu Kami Tentang Pesan Anda"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={5}
                    className="w-full bg-[#f7f7f7] rounded-[8px] px-6 py-5 font-['Poppins',sans-serif] text-[#2f2f2f] placeholder:text-[#b4b4b4] text-base shadow-[4px_4px_15px_4px_rgba(0,0,0,0.1)] border-none focus:outline-none focus:ring-2 focus:ring-[#ffcc00] resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-[#ffcc00] text-[#2f2f2f] font-['Poppins',sans-serif] px-8 py-4 rounded-[100px] hover:opacity-90 transition-opacity shadow-lg text-lg md:text-xl"
                >
                  Kirim Pesan
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
