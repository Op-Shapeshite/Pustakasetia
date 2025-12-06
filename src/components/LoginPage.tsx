import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import imgPustakaSetiaTracing1 from "figma:asset/a236558e0f6a9a9f56ec11523f0449430ba96187.png";

interface LoginPageProps {
  onBack: () => void;
  onLoginSuccess: () => void;
}

export default function LoginPage({ onBack, onLoginSuccess }: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      alert("Mohon isi username dan password!");
      return;
    }

    // Simulate login (you can connect to backend here)
    alert(`Login berhasil! Selamat datang, ${username}`);
    
    // Redirect to dashboard after successful login
    onLoginSuccess();
  };

  return (
    <div className="bg-[#f6f8fd] min-h-screen w-full flex items-center justify-center px-4 py-8">
      {/* Login Card */}
      <div className="bg-white rounded-[24px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] w-full max-w-[550px] px-6 sm:px-8 md:px-12 lg:px-16 py-12 md:py-16">
        {/* Logo */}
        <div className="flex justify-center mb-8 md:mb-12">
          <img 
            src={imgPustakaSetiaTracing1} 
            alt="Pustaka Setia Logo" 
            className="w-[70px] h-[64px] sm:w-[85px] sm:h-[78px] object-cover"
          />
        </div>

        {/* Title */}
        <h1 className="font-['Poppins',sans-serif] font-medium text-[#2f2f2f] text-[36px] sm:text-[40px] md:text-[48px] text-center mb-8 md:mb-12">
          Log In
        </h1>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6 md:space-y-8">
          {/* Username Field */}
          <div>
            <label 
              htmlFor="username" 
              className="font-['Poppins',sans-serif] font-medium text-[#2f2f2f] text-[18px] md:text-[20px] block mb-3"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username"
              className="w-full h-[50px] bg-white border border-[#cdcdcd] rounded-[7px] px-6 font-['Poppins',sans-serif] text-[16px] text-[#2f2f2f] placeholder:text-[#a7a7a7] focus:outline-none focus:border-[#ffcc00] transition-colors"
            />
          </div>

          {/* Password Field */}
          <div>
            <label 
              htmlFor="password" 
              className="font-['Poppins',sans-serif] font-medium text-[#2f2f2f] text-[18px] md:text-[20px] block mb-3"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="w-full h-[50px] bg-white border border-[#cdcdcd] rounded-[7px] px-6 pr-12 font-['Poppins',sans-serif] text-[16px] text-[#2f2f2f] placeholder:text-[#a7a7a7] focus:outline-none focus:border-[#ffcc00] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a7a7a7] hover:text-[#2f2f2f] transition-colors"
              >
                {showPassword ? (
                  <Eye className="w-5 h-5" />
                ) : (
                  <EyeOff className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full h-[50px] bg-[#ffcc00] rounded-[7px] font-['Poppins',sans-serif] font-semibold text-[#2f2f2f] text-[18px] md:text-[20px] hover:opacity-90 transition-opacity mt-8 md:mt-12"
          >
            Login Now
          </button>
        </form>

        {/* Back to Home Link */}
        <button
          onClick={onBack}
          className="w-full text-center font-['Poppins',sans-serif] text-[#a7a7a7] text-[14px] md:text-[16px] mt-6 hover:text-[#2f2f2f] transition-colors"
        >
          Kembali ke Beranda
        </button>
      </div>
    </div>
  );
}