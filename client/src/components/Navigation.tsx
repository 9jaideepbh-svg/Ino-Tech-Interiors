import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import logoImg from "@assets/inotech-logo.webp";

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
        scrolled 
          ? "bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md shadow-md border-border/20 dark:border-white/10 py-2 md:py-3" 
          : "bg-transparent py-3 md:py-6"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <img 
              src={logoImg} 
              alt="Inotech Logo" 
              className="w-10 h-10 md:w-12 md:h-12 object-cover rounded-lg shadow-sm border border-white/20 group-hover:scale-105 transition-transform duration-300" 
            />
            <span className={cn(
              "font-display font-bold text-lg md:text-2xl tracking-tight transition-colors",
              scrolled ? "text-primary dark:text-white" : "text-white"
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
                    : scrolled ? "text-foreground dark:text-white/90" : "text-white/90"
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
            className={cn(
              "md:hidden p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-secondary/40", 
              scrolled ? "text-[#6F1D1B] hover:bg-black/5" : "text-white hover:bg-white/10"
            )}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className={cn("w-6 h-6 stroke-[2.5] opacity-100", scrolled ? "text-[#6F1D1B]" : "text-white")} />
            ) : (
              <Menu className={cn("w-6 h-6 stroke-[2.5] opacity-100", scrolled ? "text-[#6F1D1B]" : "text-white")} />
            )}
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
            className="md:hidden bg-background/95 dark:bg-zinc-950/95 backdrop-blur-xl border-b border-border/20 dark:border-white/10 overflow-hidden shadow-2xl"
          >
            <div className="container px-4 py-6 flex flex-col gap-4">
              {links.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "text-lg font-medium p-2.5 rounded-lg transition-colors",
                    location === link.href 
                      ? "bg-secondary/15 text-secondary font-semibold" 
                      : "text-foreground dark:text-white hover:bg-muted dark:hover:bg-white/10"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="h-px bg-border/20 dark:bg-white/10 my-2" />
              <a href="tel:9845284778" className="w-full">
                <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-full py-6 font-bold shadow-lg">Call Us Now</Button>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
