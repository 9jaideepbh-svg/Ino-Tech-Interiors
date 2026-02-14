import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import logoImg from "@assets/ChatGPT_Image_Jan_22,_2026,_03_05_31_PM_1771090135657.png";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/projects", label: "Projects" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 border-b border-transparent",
        scrolled ? "bg-white/90 backdrop-blur-md shadow-md border-border/20 py-3" : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <img src={logoImg} alt="Inotech Logo" className="w-12 h-12 object-contain" />
            <span className={cn(
              "font-display font-bold text-xl md:text-2xl tracking-tight transition-colors",
              scrolled ? "text-primary" : "text-primary md:text-white"
            )}>
              INOTECH <span className="text-secondary">Interiors</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-secondary relative group",
                  location === link.href 
                    ? "text-secondary font-semibold" 
                    : scrolled ? "text-foreground" : "text-white/90"
                )}
              >
                {link.label}
                <span className={cn(
                  "absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-full",
                  location === link.href ? "w-full" : ""
                )} />
              </Link>
            ))}
            <a href="tel:9845284778">
              <Button 
                variant={scrolled ? "default" : "secondary"} 
                size="sm"
                className="rounded-full px-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
              >
                <Phone className="w-4 h-4 mr-2" />
                Call Now
              </Button>
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-primary"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-border/20 overflow-hidden"
          >
            <div className="container px-4 py-6 flex flex-col gap-4">
              {links.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "text-lg font-medium p-2 rounded-md transition-colors",
                    location === link.href 
                      ? "bg-secondary/10 text-secondary" 
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="h-px bg-border/20 my-2" />
              <a href="tel:9845284778" className="w-full">
                <Button className="w-full bg-primary text-white">Call Us Now</Button>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
