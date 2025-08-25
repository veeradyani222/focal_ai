// components/Header.tsx
"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { LogIn } from "lucide-react";

const TOK = {
  line: "var(--line)",
  fg: "var(--fg)",
  fg2: "var(--fg2)",
  acc1: "var(--acc1)",
};

export default function Header() {
  const [showMini, setShowMini] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowMini(window.scrollY > 240);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <AnimatePresence>
        {showMini && (
          <motion.div
            initial={{ y: -56, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -56, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="sticky top-0 z-50"
            style={{
              backdropFilter: "blur(8px) saturate(140%)",
              background: "rgba(2,16,36,.78)",
              borderBottom: `1px solid ${TOK.line}`,
            }}
          >
            <div className="container py-3 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img src="/logo-dark.png" alt="Focal.ai" className="h-7 w-auto" />
                <span className="text-sm font-medium" style={{ color: TOK.fg2 }}>
                  Multi‑agent requirements, instantly
                </span>
              </div>
              <div className="relative overflow-hidden">
                <a
                  href="/api/auth/signin?provider=google"
                  className="relative inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 group"
                  style={{ background: TOK.acc1, color: "#021024" }}
                >
                  <LogIn className="w-4 h-4" />
                  Sign in with Google
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header
        className="border-b"
        style={{ borderColor: TOK.line, background: "rgba(2,16,36,.9)" }}
      >
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/logo-dark.png" alt="Focal.ai" className="h-8 w-auto" />
            <span className="sr-only">Focal.ai</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#how" className="text-base font-medium opacity-90 hover:opacity-100 transition-opacity" style={{ color: TOK.fg2 }}>
              How it works
            </a>
            <a href="#learn" className="text-base font-medium opacity-90 hover:opacity-100 transition-opacity" style={{ color: TOK.fg2 }}>
              Learn
            </a>
            <a href="#pricing" className="text-base font-medium opacity-90 hover:opacity-100 transition-opacity" style={{ color: TOK.fg2 }}>
              Pricing
            </a>
          </nav>
          <div className="relative overflow-hidden">
            <a
              href="/api/auth/signin?provider=google"
              className="relative inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 group"
              style={{ background: TOK.acc1, color: "#021024" }}
            >
              <LogIn className="w-4 h-4" />
              Sign in with Google
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
            </a>
          </div>
        </div>
      </header>
    </>
  );
}