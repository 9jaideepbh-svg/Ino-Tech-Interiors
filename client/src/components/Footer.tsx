import { Link } from "wouter";
import { Phone, Mail, MapPin, Instagram, Facebook, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-tertiary text-primary-foreground pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-serif font-bold text-xl">I</span>
              </div>
              <span className="font-display font-bold text-2xl tracking-tight text-white">
                INOTECH <span className="text-secondary">Interiors</span>
              </span>
            </div>
            <p className="text-primary-foreground/80 leading-relaxed max-w-xs">
              Excellence in structural glazing and modern facade solutions for over 20 years. We shape skylines with precision and elegance.
            </p>
            <div className="flex gap-4 pt-2">
              {[Instagram, Facebook, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="p-2 rounded-full bg-white/5 hover:bg-secondary hover:text-white transition-all duration-300">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-lg font-bold mb-6 relative inline-block">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-secondary rounded-full"></span>
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Home", href: "/" },
                { label: "About Us", href: "/about" },
                { label: "Projects", href: "/projects" },
                { label: "Services", href: "/services" },
                { label: "Contact", href: "/contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-primary-foreground/70 hover:text-secondary transition-colors hover:translate-x-1 inline-block">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white text-lg font-bold mb-6 relative inline-block">
              Our Expertise
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-secondary rounded-full"></span>
            </h4>
            <ul className="space-y-3">
              {[
                "Structural Glazing",
                "ACP Cladding",
                "Semi-Unitized Glazing",
                "Spider Glazing System",
                "Aluminium Fabrication"
              ].map((service) => (
                <li key={service} className="text-primary-foreground/70 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white text-lg font-bold mb-6 relative inline-block">
              Get in Touch
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-secondary rounded-full"></span>
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-primary-foreground/80">
                <MapPin className="w-5 h-5 text-secondary shrink-0 mt-1" />
                <span>Bangalore, Karnataka, India</span>
              </li>
              <li className="flex items-center gap-3 text-primary-foreground/80">
                <Phone className="w-5 h-5 text-secondary shrink-0" />
                <a href="tel:9845284778" className="hover:text-white transition-colors">9845284778</a>
              </li>
              <li className="flex items-center gap-3 text-primary-foreground/80">
                <Mail className="w-5 h-5 text-secondary shrink-0" />
                <a href="mailto:inotechinteriors@gmail.com" className="hover:text-white transition-colors">inotechinteriors@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center text-sm text-primary-foreground/50">
          <p>© {new Date().getFullYear()} Inotech Interiors. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
