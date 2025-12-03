import svgPaths from "../imports/svg-am5n4v6ik1";
import imgPustakaSetiaTracing2 from "figma:asset/a236558e0f6a9a9f56ec11523f0449430ba96187.png";
import img210056973109789661 from "figma:asset/54108510d10b2729401ffa3ce32f1faab0dc973b.png";
import imgWhatsAppImage20251127At53719Pm1 from "figma:asset/9820bb74109b82eae5e859e0502f9a825ad017da.png";
import imgWhatsAppImage20251127At53719Pm2 from "figma:asset/66136fdb2c447ca385752d440088596b8e740b35.png";
import imgWhatsAppImage20251127At53720Pm from "figma:asset/41b04e0368c52e1badd820f272f335a6c921e09b.png";
import imgWhatsAppImage20251127At53719Pm from "figma:asset/e2816cb4305509763ea631007eee44ecdd35441a.png";
import imgWhatsAppImage20251127At53720Pm2 from "figma:asset/c6a1e32300a872f41a1bc9bb645403444b6884c7.png";
import imgWhatsAppImage20251127At53721Pm from "figma:asset/47a129306e65f371f2d18645e7588dc532b671d8.png";
import imgWhatsAppImage20251127At53720Pm1 from "figma:asset/e139883d294c2d8c85f710519d588ed9ed48a272.png";
import imgWhatsAppImage20251127At53722Pm1 from "figma:asset/95771006c07a7a77bd105b80c1522ae8499820f2.png";

interface Book {
  id: number;
  image: string;
  title: string;
  author: string;
  price: string;
}

interface HomePageProps {
  onBookClick: (book: Book) => void;
}

const books: Book[] = [
  {
    id: 1,
    image: imgWhatsAppImage20251127At53719Pm1,
    title: "Sistem Informasi Manajemen Pendidikan",
    author: "Dr. Dadang Suhairi, S.E., M.M & Dr. Cecep Wahyu Hoerudin, M.Pd.",
    price: "Rp42.000"
  },
  {
    id: 2,
    image: imgWhatsAppImage20251127At53719Pm,
    title: "Komunikasi Organisasi",
    author: "Dr. H. Yana Sutiana, M.Ag.",
    price: "Rp68.000"
  },
  {
    id: 3,
    image: imgWhatsAppImage20251127At53719Pm2,
    title: "Hukum Perkawinan Islam dan Isu-Isu Kontemporer Hukum Keluarga",
    author: "Dr. Beni Ahmad Saebani, M.Si.",
    price: "Rp78.000"
  },
  {
    id: 4,
    image: imgWhatsAppImage20251127At53720Pm,
    title: "Metode Penelitian Hukum Pendekatan Yuridis Normatif",
    author: "Dr. Beni Ahmad Saebani, M.Si.",
    price: "Rp68.000"
  },
  {
    id: 5,
    image: imgWhatsAppImage20251127At53720Pm2,
    title: "Ilmu Sosial Dasar",
    author: "Dr. Beni Ahmad Saebani, M.Si.",
    price: "Rp48.000"
  },
  {
    id: 6,
    image: imgWhatsAppImage20251127At53721Pm,
    title: "Fiqih Muamalah Klasik dan Kontemporer",
    author: "Prof. Dr. H. Koko Komaruddin, M.Pd.",
    price: "Rp70.000"
  },
  {
    id: 7,
    image: imgWhatsAppImage20251127At53720Pm1,
    title: "Sosiologi Ekonomi Memaksimalkan Keuntungan dan Meminimalkan Risiko",
    author: "Dr. Dedah Jubaedah, M.Si.",
    price: "Rp53.000"
  },
  {
    id: 8,
    image: imgWhatsAppImage20251127At53722Pm1,
    title: "EYD Pedoman Umum Ejaan Bahasa Indonesia Yang Disempurnakan",
    author: "Pustaka Setia",
    price: "Rp25.000"
  }
];

function Ellipse() {
  return (
    <div className="relative size-[126.349px]">
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

function StreamlinePlumpAiTechnologySpark() {
  return (
    <div className="absolute left-[921px] overflow-clip size-[55px] top-[702px]">
      <div className="absolute inset-[3.64%_3.64%_5.45%_5.45%]">
        <div className="absolute inset-[-3%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 53 53">
            <g>
              <path d={svgPaths.p12442280} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
              <path d={svgPaths.p220c6880} stroke="white" strokeWidth="3" />
              <path d={svgPaths.pa117540} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

function StashTargetLight() {
  return (
    <div className="absolute left-[725px] size-[69px] top-[238px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 69 69">
        <g>
          <path d={svgPaths.p399d1600} fill="white" />
          <path d={svgPaths.p1f8253c0} fill="white" />
        </g>
      </svg>
    </div>
  );
}

function ArcticonsRewards() {
  return (
    <div className="absolute left-[1352px] size-[57px] top-[321px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 57 57">
        <g>
          <path d={svgPaths.p2dacb980} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
        </g>
      </svg>
    </div>
  );
}

function Group24() {
  return (
    <div className="absolute h-[48.354px] left-[1192px] top-[230px] w-[46.599px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 47 49">
        <g>
          <ellipse cx="2.84143" cy="2.58312" fill="white" rx="2.84143" ry="2.58312" />
          <ellipse cx="16.4801" cy="2.58312" fill="white" rx="2.84143" ry="2.58312" />
          <ellipse cx="30.1188" cy="2.58312" fill="white" rx="2.84143" ry="2.58312" />
          <ellipse cx="43.7575" cy="2.58312" fill="white" rx="2.84143" ry="2.58312" />
          <ellipse cx="2.84143" cy="17.048" fill="white" rx="2.84143" ry="2.58312" />
          <ellipse cx="16.4801" cy="17.048" fill="white" rx="2.84143" ry="2.58312" />
          <ellipse cx="30.1188" cy="17.048" fill="white" rx="2.84143" ry="2.58312" />
          <ellipse cx="43.7575" cy="17.048" fill="white" rx="2.84143" ry="2.58312" />
          <ellipse cx="2.84143" cy="31.5167" fill="white" rx="2.84143" ry="2.58312" />
          <ellipse cx="16.4801" cy="31.5167" fill="white" rx="2.84143" ry="2.58312" />
          <ellipse cx="30.1188" cy="31.5167" fill="white" rx="2.84143" ry="2.58312" />
          <ellipse cx="43.7575" cy="31.5167" fill="white" rx="2.84143" ry="2.58312" />
          <ellipse cx="2.84143" cy="45.7706" fill="white" rx="2.84143" ry="2.58312" />
          <ellipse cx="16.4801" cy="45.7706" fill="white" rx="2.84143" ry="2.58312" />
          <ellipse cx="30.1188" cy="45.7706" fill="white" rx="2.84143" ry="2.58312" />
          <ellipse cx="43.7575" cy="45.7706" fill="white" rx="2.84143" ry="2.58312" />
        </g>
      </svg>
    </div>
  );
}

function Group25() {
  return (
    <div className="absolute h-[48.354px] left-[1080px] top-[620px] w-[46.599px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 47 49">
        <g>
          <ellipse cx="2.84143" cy="2.58312" fill="white" rx="2.84143" ry="2.58312" />
          <ellipse cx="16.4801" cy="2.58312" fill="white" rx="2.84143" ry="2.58312" />
          <ellipse cx="30.1188" cy="2.58312" fill="white" rx="2.84143" ry="2.58312" />
          <ellipse cx="43.7575" cy="2.58312" fill="white" rx="2.84143" ry="2.58312" />
          <ellipse cx="2.84143" cy="17.048" fill="white" rx="2.84143" ry="2.58312" />
          <ellipse cx="16.4801" cy="17.048" fill="white" rx="2.84143" ry="2.58312" />
          <ellipse cx="30.1188" cy="17.048" fill="white" rx="2.84143" ry="2.58312" />
          <ellipse cx="43.7575" cy="17.048" fill="white" rx="2.84143" ry="2.58312" />
          <ellipse cx="2.84143" cy="31.5167" fill="white" rx="2.84143" ry="2.58312" />
          <ellipse cx="16.4801" cy="31.5167" fill="white" rx="2.84143" ry="2.58312" />
          <ellipse cx="30.1188" cy="31.5167" fill="white" rx="2.84143" ry="2.58312" />
          <ellipse cx="43.7575" cy="31.5167" fill="white" rx="2.84143" ry="2.58312" />
          <ellipse cx="2.84143" cy="45.7706" fill="white" rx="2.84143" ry="2.58312" />
          <ellipse cx="16.4801" cy="45.7706" fill="white" rx="2.84143" ry="2.58312" />
          <ellipse cx="30.1188" cy="45.7706" fill="white" rx="2.84143" ry="2.58312" />
          <ellipse cx="43.7575" cy="45.7706" fill="white" rx="2.84143" ry="2.58312" />
        </g>
      </svg>
    </div>
  );
}

export default function HomePage({ onBookClick }: HomePageProps) {
  return (
    <div className="bg-neutral-50 relative w-full min-h-screen">
      {/* Hero Section - Jelajahi Koleksi */}
      <div className="relative pt-[23px] pb-[60px]">
        {/* Decorative Background Elements - allowed to use absolute */}
        <div className="absolute flex h-[508.47px] items-center justify-center left-[789.76px] top-[330.65px] w-[549.369px]" style={{ "--transform-inner-width": "441.09375", "--transform-inner-height": "360.9375" } as React.CSSProperties}>
          <div className="flex-none rotate-[23.846deg] scale-y-[-100%]">
            <div className="h-[360.958px] relative w-[441.096px]">
              <div className="absolute inset-[-34.64%_-28.34%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 692 612">
                  <path d={svgPaths.p18f428c0} stroke="#BAEF02" strokeLinecap="round" strokeWidth="250" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute flex h-[557.254px] items-center justify-center left-[916.69px] top-[337px] w-[531.392px]" style={{ "--transform-inner-width": "591.515625", "--transform-inner-height": "179.015625" } as React.CSSProperties}>
          <div className="flex-none rotate-[312.459deg] scale-y-[-100%]">
            <div className="h-[179.025px] relative w-[591.521px]">
              <div className="absolute inset-[-69.82%_-21.19%_-69.83%_-21.13%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 842 430">
                  <path d={svgPaths.p29353a80} stroke="#4039E8" strokeLinecap="round" strokeWidth="250" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute flex items-center justify-center left-[1289.79px] size-[176.016px] top-[454.38px]" style={{ "--transform-inner-width": "126.34375", "--transform-inner-height": "126.34375" } as React.CSSProperties}>
          <div className="flex-none rotate-[324.914deg]">
            <Ellipse />
          </div>
        </div>

        {/* Book Stack Image - allowed to use absolute */}
        <div className="absolute h-[652px] left-[550px] top-[161px] w-[743px]">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <img alt="" className="absolute h-full left-[-12.42%] max-w-none top-0 w-[131.68%]" src={img210056973109789661} />
          </div>
        </div>

        {/* Content Container - using margin/padding */}
        <div className="relative pl-[100px] pt-[177px]">
          {/* Hero Text */}
          <p className="font-['Poppins:SemiBold',sans-serif] leading-[normal] not-italic text-[#221f30] text-[52px] w-[520px]">
            Jelajahi koleksi buku terbaik kami untuk Anda
          </p>
          
          {/* Description */}
          <p className="font-['Poppins:Regular',sans-serif] leading-[normal] mt-[80px] not-italic text-[#2f2f2f] text-[20px] w-[500px]">
            Pustaka Setia menghadirkan berbagai koleksi buku untuk memberikan ilmu yang mendalam dan bacaan bermakna. Temukan inspirasi baru melalui pilihan buku terbaik kami.
          </p>

          {/* CTA Button */}
          <div className="mt-[80px] h-[60px] w-[250px] relative">
            <div className="absolute bg-[#ffcc00] inset-0 rounded-[100px]" />
            <p className="absolute font-['Poppins:SemiBold',sans-serif] leading-[normal] left-1/2 not-italic text-[#2f2f2f] text-[20px] text-center text-nowrap top-[calc(50%-15px)] translate-x-[-50%] whitespace-pre">
              Jelajahi Sekarang
            </p>
          </div>
        </div>

        {/* Decorative Icons - allowed to use absolute */}
        <div className="absolute contents left-[906px] top-[688px]">
          <div className="absolute bg-[#ffcc00] left-[906px] rounded-[14px] shadow-[4px_7px_20px_0px_rgba(0,0,0,0.25)] size-[80px] top-[688px]" />
          <StreamlinePlumpAiTechnologySpark />
        </div>

        <div className="absolute contents left-[720px] top-[233px]">
          <div className="absolute bg-[#5a71fe] left-[720px] rounded-[14px] shadow-[4px_7px_20px_0px_rgba(0,0,0,0.25)] size-[80px] top-[233px]" />
          <StashTargetLight />
        </div>

        <div className="absolute contents left-[1340px] top-[309px]">
          <div className="absolute bg-[#ff91ab] left-[1340px] rounded-[14px] shadow-[4px_7px_20px_0px_rgba(0,0,0,0.25)] size-[80px] top-[309px]" />
          <ArcticonsRewards />
        </div>

        <Group24 />
        <Group25 />

        <div className="absolute flex items-center justify-center left-[740px] size-[176.016px] top-[399px]" style={{ "--transform-inner-width": "126.34375", "--transform-inner-height": "126.34375" } as React.CSSProperties}>
          <div className="flex-none rotate-[324.914deg]">
            <Ellipse />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="flex justify-center mt-[23px]">
        <div className="bg-[#d9d9d9] h-[250px] rounded-[25px] w-[1336px] relative">
          <div className="flex justify-center gap-[149px] pt-[115px]">
            <p className="font-['Poppins:Medium',sans-serif] leading-[normal] not-italic text-[14px] text-black text-nowrap whitespace-pre">
              Total Kategori
            </p>
            <p className="font-['Poppins:Medium',sans-serif] leading-[normal] not-italic text-[14px] text-black text-nowrap whitespace-pre">
              Total buku available
            </p>
            <p className="font-['Poppins:Medium',sans-serif] leading-[normal] not-italic text-[14px] text-black text-nowrap whitespace-pre">
              Total buku yang terjual
            </p>
          </div>
        </div>
      </div>

      {/* Books Grid Container */}
      <div className="flex flex-col items-center gap-[60px] mt-[50px]">
        {/* Row 1 */}
        <div className="flex gap-[40px] justify-center">
          {/* Book 1 */}
          <button
            onClick={() => onBookClick(books[0])}
            className="flex flex-col items-start gap-[10px] w-[220px]"
          >
            <div className="h-[320px] relative rounded-[12px] w-[220px]">
              <img alt="" className="absolute inset-0 object-cover pointer-events-none rounded-[12px] size-full" src={books[0].image} />
            </div>
            <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-gray-500 w-full text-left truncate">
              {books[0].author}
            </p>
            <p className="font-['Poppins:Medium',sans-serif] leading-[1.3] text-[#2f2f2f] text-[16px] w-full text-left line-clamp-2">
              {books[0].title}
            </p>
            <p className="font-['Poppins:Bold',sans-serif] text-[20px] text-green-500 text-left">
              {books[0].price}
            </p>
          </button>

          {/* Book 2 */}
          <button
            onClick={() => onBookClick(books[1])}
            className="flex flex-col items-start gap-[10px] w-[220px]"
          >
            <div className="h-[320px] relative rounded-[12px] w-[220px]">
              <img alt="" className="absolute inset-0 object-cover pointer-events-none rounded-[12px] size-full" src={books[1].image} />
            </div>
            <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-gray-500 w-full text-left truncate">
              {books[1].author}
            </p>
            <p className="font-['Poppins:Medium',sans-serif] leading-[1.3] text-[#2f2f2f] text-[16px] w-full text-left line-clamp-2">
              {books[1].title}
            </p>
            <p className="font-['Poppins:Bold',sans-serif] text-[20px] text-green-500 text-left">
              {books[1].price}
            </p>
          </button>

          {/* Book 3 */}
          <button
            onClick={() => onBookClick(books[2])}
            className="flex flex-col items-start gap-[10px] w-[220px]"
          >
            <div className="h-[320px] relative rounded-[12px] w-[220px]">
              <img alt="" className="absolute inset-0 object-cover pointer-events-none rounded-[12px] size-full" src={books[2].image} />
            </div>
            <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-gray-500 w-full text-left truncate">
              {books[2].author}
            </p>
            <p className="font-['Poppins:Medium',sans-serif] leading-[1.3] text-[#2f2f2f] text-[16px] w-full text-left line-clamp-2">
              {books[2].title}
            </p>
            <p className="font-['Poppins:Bold',sans-serif] text-[20px] text-green-500 text-left">
              {books[2].price}
            </p>
          </button>

          {/* Book 4 */}
          <button
            onClick={() => onBookClick(books[3])}
            className="flex flex-col items-start gap-[10px] w-[220px]"
          >
            <div className="h-[320px] relative rounded-[12px] w-[220px]">
              <img alt="" className="absolute inset-0 object-cover pointer-events-none rounded-[12px] size-full" src={books[3].image} />
            </div>
            <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-gray-500 w-full text-left truncate">
              {books[3].author}
            </p>
            <p className="font-['Poppins:Medium',sans-serif] leading-[1.3] text-[#2f2f2f] text-[16px] w-full text-left line-clamp-2">
              {books[3].title}
            </p>
            <p className="font-['Poppins:Bold',sans-serif] text-[20px] text-green-500 text-left">
              {books[3].price}
            </p>
          </button>
        </div>

        {/* Row 2 */}
        <div className="flex gap-[40px] justify-center">
          {/* Book 5 */}
          <button
            onClick={() => onBookClick(books[4])}
            className="flex flex-col items-start gap-[10px] w-[220px]"
          >
            <div className="h-[320px] relative rounded-[12px] w-[220px]">
              <img alt="" className="absolute inset-0 object-cover pointer-events-none rounded-[12px] size-full" src={books[4].image} />
            </div>
            <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-gray-500 w-full text-left truncate">
              {books[4].author}
            </p>
            <p className="font-['Poppins:Medium',sans-serif] leading-[1.3] text-[#2f2f2f] text-[16px] w-full text-left line-clamp-2">
              {books[4].title}
            </p>
            <p className="font-['Poppins:Bold',sans-serif] text-[20px] text-green-500 text-left">
              {books[4].price}
            </p>
          </button>

          {/* Book 6 */}
          <button
            onClick={() => onBookClick(books[5])}
            className="flex flex-col items-start gap-[10px] w-[220px]"
          >
            <div className="h-[320px] relative rounded-[12px] w-[220px]">
              <img alt="" className="absolute inset-0 object-cover pointer-events-none rounded-[12px] size-full" src={books[5].image} />
            </div>
            <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-gray-500 w-full text-left truncate">
              {books[5].author}
            </p>
            <p className="font-['Poppins:Medium',sans-serif] leading-[1.3] text-[#2f2f2f] text-[16px] w-full text-left line-clamp-2">
              {books[5].title}
            </p>
            <p className="font-['Poppins:Bold',sans-serif] text-[20px] text-green-500 text-left">
              {books[5].price}
            </p>
          </button>

          {/* Book 7 */}
          <button
            onClick={() => onBookClick(books[6])}
            className="flex flex-col items-start gap-[10px] w-[220px]"
          >
            <div className="h-[320px] relative rounded-[12px] w-[220px]">
              <img alt="" className="absolute inset-0 object-cover pointer-events-none rounded-[12px] size-full" src={books[6].image} />
            </div>
            <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-gray-500 w-full text-left truncate">
              {books[6].author}
            </p>
            <p className="font-['Poppins:Medium',sans-serif] leading-[1.3] text-[#2f2f2f] text-[16px] w-full text-left line-clamp-2">
              {books[6].title}
            </p>
            <p className="font-['Poppins:Bold',sans-serif] text-[20px] text-green-500 text-left">
              {books[6].price}
            </p>
          </button>

          {/* Book 8 */}
          <button
            onClick={() => onBookClick(books[7])}
            className="flex flex-col items-start gap-[10px] w-[220px]"
          >
            <div className="h-[320px] relative rounded-[12px] w-[220px]">
              <img alt="" className="absolute inset-0 object-cover pointer-events-none rounded-[12px] size-full" src={books[7].image} />
            </div>
            <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-gray-500 w-full text-left truncate">
              {books[7].author}
            </p>
            <p className="font-['Poppins:Medium',sans-serif] leading-[1.3] text-[#2f2f2f] text-[16px] w-full text-left line-clamp-2">
              {books[7].title}
            </p>
            <p className="font-['Poppins:Bold',sans-serif] text-[20px] text-green-500 text-left">
              {books[7].price}
            </p>
          </button>
        </div>

        {/* View More */}
        <div className="flex justify-center">
          <p className="[text-underline-position:from-font] decoration-solid font-['Poppins:Medium',sans-serif] leading-[normal] not-italic text-[20px] text-black underline cursor-pointer">
            View More
          </p>
        </div>
      </div>


    </div>
  );
}
