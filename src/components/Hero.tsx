import { motion, useScroll, useTransform, useSpring, useInView, Variants } from "framer-motion";
import { useEffect, useState, useRef } from "react";

interface HeroProps {
  onExploreClick?: () => void;
}

const TypingText = ({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) => {
  const words = text.split(" ");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: delay }, // 0.05s per letter = typing speed
    },
  };

  const child: Variants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0, // Instant appearance for typewriter feel
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-start" }} // Removed overflow:hidden to allow potential cursor
      variants={container}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
    >
      {words.map((word, index) => (
        <span key={index} style={{ marginRight: "0.25em", display: "inline-block" }}>
          {Array.from(word).map((letter, letterIndex) => (
            <motion.span variants={child} key={letterIndex} style={{ display: "inline-block" }}>
              {letter}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.div>
  );
};

const CountUp = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const springValue = useSpring(0, {
    damping: 30,
    stiffness: 100,
    duration: 2
  });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      springValue.set(value);
    }
  }, [isInView, value, springValue]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      setDisplayValue(Math.floor(latest));
    });
    return () => unsubscribe();
  }, [springValue]);

  return <span ref={ref}>{displayValue.toLocaleString()}{suffix}</span>;
};

export default function Hero({ onExploreClick }: HeroProps) {
  const [stats, setStats] = useState({
    totalCategories: 0,
    totalBooks: 0,
    totalSold: 0
  });

  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats');
        const data = await res.json();
        if (data.data) {
          setStats(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full bg-white overflow-hidden">
        <div className="relative max-w-[1440px] mx-auto">
          <div className="flex flex-col lg:flex-row">
            {/* Left Content */}
            <div className="flex flex-col justify-center items-center lg:items-start text-center lg:text-left space-y-6 md:space-y-8 px-4 md:px-8 lg:px-16 pt-12 pb-2 md:py-16 lg:py-20 w-full lg:w-1/2 z-10 relative bg-white lg:bg-transparent">
              {/* Heading with Slide Animation */}
              <div className="flex justify-center lg:justify-start w-full">
                <motion.h1
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="font-['Poppins',sans-serif] font-semibold text-3xl md:text-5xl lg:text-[64px] leading-[1.2] text-neutral-900 text-left"
                >
                  Jelajahi koleksi buku terbaik kami untuk Anda
                </motion.h1>
              </div>

              {/* Description */}
              <p className="font-['Poppins',sans-serif] text-sm md:text-lg lg:text-[20px] text-neutral-700 leading-relaxed max-w-lg lg:max-w-none">
                Pustaka Setia menghadirkan berbagai koleksi buku untuk memberikan ilmu yang mendalam dan bacaan bermakna. Temukan inspirasi baru melalui pilihan buku terbaik kami.
              </p>

              {/* CTA Button */}
              <button
                onClick={onExploreClick}
                className="font-['Poppins',sans-serif] font-semibold bg-[#ffcc00] hover:bg-[#f0c000] text-neutral-900 text-base md:text-[20px] px-8 py-3 md:px-10 md:py-4 rounded-full w-fit transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Jelajahi Sekarang
              </button>
            </div>

            {/* Right Hero Image */}
            <div className="relative w-full lg:w-1/2 overflow-hidden h-[400px] lg:h-[700px] lg:pr-0 flex items-end justify-center lg:justify-end pb-0">
              <motion.img
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                src="/img/hand-hero-section.png"
                alt="Koleksi Buku Pustaka Setia"
                className="w-full h-full lg:w-auto right-0 lg:h-[700px] object-contain object-bottom transform lg:translate-x-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section with Parallax */}
      <section className="w-full h-[300px] relative overflow-hidden flex items-center">
        {/* Parallax Background */}
        <motion.div
          style={{ y }}
          className="absolute inset-0 bg-neutral-100 border-t border-neutral-200 z-0"
        />

        <div className="relative max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 w-full z-10">
          <div className="flex flex-row justify-between items-start text-center divide-x divide-neutral-300">
            <div className="flex-1 px-2 md:px-4 flex flex-col items-center">
              <p className="font-['Poppins',sans-serif] text-2xl md:text-4xl font-bold text-neutral-800">
                <CountUp value={stats.totalCategories > 0 ? stats.totalCategories : 8} suffix="+" />
              </p>
              <div className="mt-2 min-h-[40px] flex items-center justify-center">
                <p className="font-['Poppins',sans-serif] text-[10px] md:text-sm font-medium text-neutral-600">Total Kategori</p>
              </div>
            </div>
            <div className="flex-1 px-2 md:px-4 flex flex-col items-center">
              <p className="font-['Poppins',sans-serif] text-2xl md:text-4xl font-bold text-neutral-800">
                <CountUp value={stats.totalBooks > 0 ? stats.totalBooks : 520} suffix="+" />
              </p>
              <div className="mt-2 min-h-[40px] flex items-center justify-center">
                <p className="font-['Poppins',sans-serif] text-[10px] md:text-sm font-medium text-neutral-600">Total buku available</p>
              </div>
            </div>
            <div className="flex-1 px-2 md:px-4 flex flex-col items-center">
              <p className="font-['Poppins',sans-serif] text-2xl md:text-4xl font-bold text-neutral-800">
                <CountUp value={stats.totalSold} suffix="+" />
              </p>
              <div className="mt-2 min-h-[40px] flex items-center justify-center">
                <p className="font-['Poppins',sans-serif] text-[10px] md:text-sm font-medium text-neutral-600">Total buku yang terjual</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
