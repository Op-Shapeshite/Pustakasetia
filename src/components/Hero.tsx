import svgPaths from "../imports/svg-zx896x9umy";
import img210056973109789661 from "figma:asset/54108510d10b2729401ffa3ce32f1faab0dc973b.png";

function Ellipse() {
  return (
    <div className="relative size-[80px] md:size-[100px] lg:size-[126.349px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 127 127">
        <g>
          <mask height="127" id="mask0_1_9085" maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }} width="127" x="0" y="0">
            <circle cx="63.1745" cy="63.1745" fill="#061354" r="63.1745" />
          </mask>
          <g mask="url(#mask0_1_9085)">
            <line stroke="white" strokeWidth="3" x1="-7.57677" x2="-7.57678" y1="-28.7501" y2="154.342" />
            <line stroke="white" strokeWidth="3" x1="4.52452" x2="4.52451" y1="-28.7468" y2="154.346" />
            <line stroke="white" strokeWidth="3" x1="16.6319" x2="16.6319" y1="-28.7487" y2="154.344" />
            <line stroke="white" strokeWidth="3" x1="28.7393" x2="28.7392" y1="-28.7506" y2="154.342" />
            <line stroke="white" strokeWidth="3" x1="40.8405" x2="40.8405" y1="-28.7472" y2="154.345" />
            <line stroke="white" strokeWidth="3" x1="52.9479" x2="52.9479" y1="-28.7492" y2="154.343" />
            <line stroke="white" strokeWidth="3" x1="65.0492" x2="65.0492" y1="-28.7458" y2="154.347" />
            <line stroke="white" strokeWidth="3" x1="77.1582" x2="77.1581" y1="-28.7466" y2="154.346" />
            <line stroke="white" strokeWidth="3" x1="89.2639" x2="89.2639" y1="-28.7496" y2="154.343" />
            <line stroke="white" strokeWidth="3" x1="101.367" x2="101.367" y1="-28.7452" y2="154.347" />
            <line stroke="white" strokeWidth="3" x1="113.473" x2="113.473" y1="-28.7482" y2="154.344" />
            <line stroke="white" strokeWidth="3" x1="124.203" x2="124.203" y1="-21.2106" y2="161.882" />
            <line stroke="white" strokeWidth="3" x1="136.929" x2="136.929" y1="-28.7499" y2="154.343" />
          </g>
        </g>
      </svg>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden py-8 md:py-12 lg:py-16">
      {/* Decorative Background Elements */}
      <div className="absolute right-0 top-10 md:top-20 w-1/2 h-[300px] md:h-[400px] lg:h-[500px] opacity-50 pointer-events-none hidden md:block">
        <div className="absolute top-1/4 right-[10%] rotate-[23.846deg] scale-y-[-100%]">
          <svg className="w-[200px] lg:w-[400px] h-auto" fill="none" preserveAspectRatio="none" viewBox="0 0 692 612">
            <path d={svgPaths.p18f428c0} stroke="#BAEF02" strokeLinecap="round" strokeWidth="250" />
          </svg>
        </div>
        <div className="absolute top-1/3 right-[5%] rotate-[312.459deg] scale-y-[-100%]">
          <svg className="w-[150px] lg:w-[300px] h-auto" fill="none" preserveAspectRatio="none" viewBox="0 0 842 430">
            <path d={svgPaths.p29353a80} stroke="#4039E8" strokeLinecap="round" strokeWidth="250" />
          </svg>
        </div>
        <div className="absolute top-1/2 right-[15%] rotate-[324.914deg]">
          <Ellipse />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 relative z-10">
            <h1 className="font-['Poppins',sans-serif] text-[#221f30] text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight">
              Jelajahi koleksi buku terbaik kami untuk Anda
            </h1>
            <p className="font-['Poppins',sans-serif] text-[#2f2f2f] text-base md:text-lg lg:text-xl leading-relaxed">
              Pustaka Setia menghadirkan berbagai koleksi buku untuk memberikan ilmu yang mendalam dan bacaan bermakna. Temukan inspirasi baru melalui pilihan buku terbaik kami.
            </p>
            <button className="bg-[#ffcc00] text-[#2f2f2f] font-['Poppins',sans-serif] px-8 py-3 md:px-10 md:py-4 rounded-full hover:opacity-90 transition-opacity shadow-lg">
              Jelajahi Sekarang
            </button>

            {/* Decorative circle for mobile */}
            <div className="absolute -left-10 top-0 rotate-[324.914deg] opacity-30 md:hidden">
              <Ellipse />
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="relative w-full aspect-[743/652] max-w-[600px] mx-auto shadow-[4px_7px_50px_0px_rgba(0,0,0,0.25)] rounded-lg overflow-hidden">
              <img 
                src={img210056973109789661} 
                alt="Books showcase" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
