import svgPaths from "../imports/svg-zx896x9umy";

function StashTargetLight() {
  return (
    <div className="size-[50px] md:size-[60px] lg:size-[69px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 69 69">
        <g>
          <path d={svgPaths.p399d1600} fill="white" />
          <path d={svgPaths.p1f8253c0} fill="white" />
        </g>
      </svg>
    </div>
  );
}

function StreamlinePlumpAiTechnologySpark() {
  return (
    <div className="size-[45px] md:size-[50px] lg:size-[55px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 53 53">
        <g>
          <path d={svgPaths.p12442280} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
          <path d={svgPaths.p220c6880} stroke="white" strokeWidth="3" />
          <path d={svgPaths.pa117540} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
        </g>
      </svg>
    </div>
  );
}

function ArcticonsRewards() {
  return (
    <div className="size-[45px] md:size-[50px] lg:size-[57px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 57 57">
        <g>
          <path d={svgPaths.p2dacb980} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
        </g>
      </svg>
    </div>
  );
}

function DotsPattern() {
  return (
    <div className="h-[40px] md:h-[48.354px] w-[38px] md:w-[46.599px]">
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

export default function Stats() {
  return (
    <section className="relative w-full py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-[#d9d9d9] rounded-[25px] p-6 md:p-8 lg:p-12 overflow-hidden">
          {/* Decorative dots - hidden on mobile */}
          <div className="absolute top-4 right-4 md:top-8 md:right-12 opacity-50 hidden md:block">
            <DotsPattern />
          </div>
          <div className="absolute bottom-4 left-4 md:bottom-8 md:left-12 opacity-50 hidden md:block">
            <DotsPattern />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative z-10">
            {/* Stat 1 */}
            <div className="flex flex-col items-center text-center gap-4">
              <div className="bg-[#5a71fe] rounded-[14px] shadow-[4px_7px_20px_0px_rgba(0,0,0,0.25)] p-4 md:p-5">
                <StashTargetLight />
              </div>
              <p className="font-['Poppins',sans-serif] text-black text-sm md:text-base">Total Kategori</p>
            </div>

            {/* Stat 2 */}
            <div className="flex flex-col items-center text-center gap-4">
              <div className="bg-[#ffcc00] rounded-[14px] shadow-[4px_7px_20px_0px_rgba(0,0,0,0.25)] p-4 md:p-5">
                <StreamlinePlumpAiTechnologySpark />
              </div>
              <p className="font-['Poppins',sans-serif] text-black text-sm md:text-base">Total buku available</p>
            </div>

            {/* Stat 3 */}
            <div className="flex flex-col items-center text-center gap-4">
              <div className="bg-[#ff91ab] rounded-[14px] shadow-[4px_7px_20px_0px_rgba(0,0,0,0.25)] p-4 md:p-5">
                <ArcticonsRewards />
              </div>
              <p className="font-['Poppins',sans-serif] text-black text-sm md:text-base">Total buku yang terjual</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
