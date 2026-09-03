import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";

export function WhatsAppButton() {
  const [visible, setVisible] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      // On home page, hide in hero section, show when scrolled down > 250px
      if (location === "/") {
        setVisible(window.scrollY > 250);
      } else {
        setVisible(true);
      }
    };

    handleScroll(); // Initial check
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href="https://wa.me/919845284778"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 group"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          whileHover={{ scale: 1.05 }}
          aria-label="Chat with Inotech Interiors on WhatsApp"
        >
          <span className="bg-white text-primary font-medium px-4 py-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute right-16 whitespace-nowrap hidden md:block border border-border/20">
            Chat with Us
          </span>
          <div className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-xl shadow-[#25D366]/30 group-hover:shadow-[#25D366]/50 transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-75 duration-1000"></div>
            <MessageCircle className="w-8 h-8 text-white relative z-10" />
          </div>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
