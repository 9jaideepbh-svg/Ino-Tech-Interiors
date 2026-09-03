import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, CheckCircle2, Building2, Users, Trophy, ChevronRight, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ProjectCard } from "@/components/ProjectCard";
import { useProjects } from "@/hooks/use-projects";
import { useRef, useEffect, useState, memo } from "react";
import heroVideo from "@assets/133077-755975090_medium_1770457772693.mp4";
import heroAudio from "@assets/The_Sevastopol-[AudioTrimmer.com]_(1)_1770717824098.mp3";
import { SEO } from "@/components/SEO";
import { unsplashUrl } from "@/lib/cloudinary-utils";

// WhatsApp SVG icon (inline)
const WhatsAppIcon = () => (
  <svg viewBox="0 0 32 32" fill="currentColor" className="w-7 h-7" aria-hidden="true">
    <path d="M16 0C7.163 0 0 7.163 0 16c0 2.822.737 5.469 2.027 7.773L0 32l8.453-2.001A15.93 15.93 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm8.406 22.594c-.352.992-2.043 1.895-2.805 1.957-.762.062-1.484.352-5.01-1.043-4.23-1.664-6.934-5.969-7.142-6.244-.207-.275-1.692-2.254-1.692-4.3 0-2.047 1.072-3.055 1.452-3.473.381-.418.83-.522 1.107-.522.277 0 .554.003.797.014.256.012.598-.097.936.715.352.84 1.194 2.902 1.3 3.115.104.213.173.462.034.746-.138.285-.208.462-.414.71-.208.248-.436.555-.623.745-.207.208-.422.434-.181.851.24.416 1.068 1.762 2.293 2.854 1.574 1.404 2.9 1.836 3.314 2.043.416.208.659.174.9-.104.242-.277 1.037-1.213 1.314-1.629.277-.416.553-.347.934-.208.381.138 2.424 1.143 2.84 1.351.416.208.693.311.796.484.105.173.105 1.002-.246 1.992z"/>
  </svg>
);

// Memoized stat card to prevent unnecessary re-renders
const StatCard = memo(({ icon: Icon, value, label, delay }: { icon: any; value: string; label: string; delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    className="text-center p-4 rounded-xl bg-white shadow-lg border border-border/10"
  >
    <Icon className="w-8 h-8 text-secondary mx-auto mb-3" aria-hidden="true" />
    <h3 className="text-2xl font-bold text-primary">{value}</h3>
    <p className="text-sm text-muted-foreground">{label}</p>
  </motion.div>
));
StatCard.displayName = "StatCard";

export default function Home() {
  const { data: projects, isLoading } = useProjects();
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [isMuted, setIsMuted] = useState(false);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const audioVolume = useTransform(scrollYProgress, [0.8, 1], [1, 0]);

  // Sync audio mute state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
      if (!isMuted && audioRef.current.paused) {
        audioRef.current.play().catch(() => {});
      }
    }
  }, [isMuted]);

  // Fade audio out on scroll exit
  useEffect(() => {
    const unsubscribe = audioVolume.on("change", (v) => {
      if (audioRef.current) {
        if (v <= 0) {
          audioRef.current.pause();
        } else if (!isMuted && audioRef.current.paused) {
          audioRef.current.play().catch(() => {});
        }
      }
    });
    return () => unsubscribe();
  }, [audioVolume, isMuted]);

  // Force immediate video play on mount — critical for LCP
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true; // must be muted for autoplay policy
    // Use load() + play() sequence to avoid buffering stall
    video.load();
    const playAttempt = video.play();
    if (playAttempt !== undefined) {
      playAttempt.catch(() => {
        // Retry on user interaction (iOS fallback)
        const retry = () => { video.play().catch(() => {}); document.removeEventListener("touchstart", retry); };
        document.addEventListener("touchstart", retry, { once: true });
      });
    }
    // Audio
    if (audioRef.current && !isMuted) {
      audioRef.current.play().catch(() => {});
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const featuredProjects = projects
    ? projects.filter(p => p.featured).slice(0, 3)
    : [];

  const displayProjects = featuredProjects.length > 0 ? featuredProjects : (projects?.slice(0, 3) || []);

  const stats = [
    { icon: Building2, value: "20+", label: "Years Experience" },
    { icon: Trophy, value: "400+", label: "Projects Completed" },
    { icon: Users, value: "97%", label: "Client Satisfaction" },
  ];

  const majorClients = [
    "HAL (Hindustan Aeronautics Limited)",
    "City Civil Court Bangalore",
    "CM Residential House",
    "Jyothi Institute of Technology",
    "ITC"
  ];

  return (
    <div className="min-h-screen overflow-x-hidden">
      <SEO
        title="Inotech Interiors | Structural Glazing & ACP Cladding – Bangalore"
        description="Inotech Interiors – 20+ years of excellence in structural glazing, ACP cladding, semi-unitized glazing, and modern facade solutions in Bangalore."
        canonical="https://inotech-interiors.web.app/"
      />

      {/* ── HERO SECTION — WebM primary, MP4 fallback, instant play ── */}
      <section
        id="hero-section"
        ref={heroRef}
        className="relative h-[100dvh] min-h-[550px] md:min-h-[600px] flex items-center overflow-hidden bg-neutral-950"
        aria-label="Hero section"
      >
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            id="hero-video"
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 object-cover object-center transform-gpu"
            style={{ willChange: "transform", backfaceVisibility: "hidden" }}
          >
            {/* WebM first — smallest, best quality for Chrome/Firefox/Edge */}
            <source src="/133077-755975090_medium.webm" type="video/webm" />
            {/* MP4 fallback — older Safari & non-WebM browsers */}
            <source src={heroVideo} type="video/mp4" />
          </video>

          {/* Background audio (optional ambient) */}
          <audio ref={audioRef} src={heroAudio} loop muted={isMuted} preload="none" />

          {/* Cinematic gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/55 pointer-events-none" aria-hidden="true" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.18)_100%)] pointer-events-none" aria-hidden="true" />

          {/* Mute / Unmute button — DESKTOP ONLY (hidden on mobile) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="hidden md:flex absolute bottom-8 right-8 z-20"
          >
            <Button
              size="icon"
              variant="outline"
              onClick={() => setIsMuted(!isMuted)}
              className="rounded-full w-12 h-12 border-white/20 bg-black/30 backdrop-blur-md text-white hover:bg-white/10 hover:border-white/40 transition-all"
              aria-label={isMuted ? "Unmute background audio" : "Mute background audio"}
            >
              {isMuted ? <VolumeX className="w-5 h-5" aria-hidden="true" /> : <Volume2 className="w-5 h-5" aria-hidden="true" />}
            </Button>
          </motion.div>

          {/* Decorative glass shape — desktop only, no layout impact */}
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 right-[10%] w-64 h-64 border border-white/10 bg-white/5 backdrop-blur-sm rounded-2xl transform rotate-12 hidden md:block pointer-events-none"
            aria-hidden="true"
          />
        </div>

        {/* ── MOBILE HERO CONTENT (md:hidden) ── */}
        <div className="md:hidden absolute inset-0 z-10 flex flex-col justify-between px-5 pt-[6.5rem] pb-8">
          {/* TOP BLOCK: Headline + Description */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: "easeOut" }}
            className="max-w-[480px]"
          >
            {/* SINCE 2004 badge */}
            <p className="text-[11px] text-secondary font-bold tracking-[0.2em] uppercase mb-3 flex items-center gap-2">
              <span className="w-7 h-px bg-secondary inline-block" aria-hidden="true"></span>
              Since 2004
            </p>

            {/* HEADLINE */}
            <h1 className="font-display font-bold text-white leading-[1.08] tracking-tight drop-shadow-2xl text-[2.6rem] mb-0">
              Shaping Skylines{" "}
              with{" "}
              <span className="text-secondary">
                Precision
              </span>
            </h1>

            {/* Gold rule under headline */}
            <div className="w-12 h-[2px] bg-secondary mt-4 mb-5" aria-hidden="true" />

            {/* DESCRIPTION */}
            <p className="text-[0.85rem] text-white/80 leading-[1.65] max-w-[300px] drop-shadow-md">
              20+ Years of Excellence in Structural Glazing, ACP Cladding &amp; Modern Facade Solutions.
            </p>
          </motion.div>

          {/* BOTTOM BLOCK: CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col gap-3 w-full"
          >
            <Link href="/projects" className="w-full">
              <Button
                size="lg"
                className="
                  w-full
                  bg-secondary hover:bg-secondary/90 text-[#1a0a05] font-bold
                  text-[0.95rem]
                  h-[54px]
                  px-6 py-0
                  rounded-full
                  shadow-lg hover:shadow-secondary/30
                  transition-all hover:scale-[1.02] active:scale-[0.98]
                  flex items-center justify-between gap-3
                "
              >
                View Our Projects
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Button>
            </Link>
            {/* Contact Us → opens WhatsApp */}
            <a
              href="https://wa.me/919845284778"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
              aria-label="Contact Inotech Interiors on WhatsApp"
            >
              <Button
                size="lg"
                variant="outline"
                className="
                  w-full
                  border-white/40 text-white hover:bg-white/10 hover:text-white
                  font-semibold
                  text-[0.95rem]
                  h-[54px]
                  px-6 py-0
                  rounded-full
                  backdrop-blur-md
                  transition-all hover:scale-[1.02] active:scale-[0.98]
                  flex items-center justify-between gap-3
                "
              >
                Contact Us
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Button>
            </a>
          </motion.div>
        </div>


        {/* ── DESKTOP HERO CONTENT (hidden md:flex) — Original Desktop Left-Aligned Layout ── */}
        <div className="hidden md:flex container mx-auto px-6 relative z-10 pt-20 items-center h-full">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: "easeOut" }}
            >
              <p className="text-sm text-secondary font-bold tracking-wider uppercase mb-4 flex items-center gap-2">
                <span className="w-8 h-0.5 bg-secondary inline-block" aria-hidden="true"></span>
                Since 2004
              </p>
              <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 leading-[1.15] tracking-tight drop-shadow-2xl">
                Shaping Skylines with{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent">
                  Precision
                </span>
              </h1>
              <p className="text-lg md:text-xl text-white/85 mb-8 leading-relaxed max-w-2xl drop-shadow-lg">
                20+ Years of Excellence in Structural Glazing, ACP Cladding, and Modern Facade Solutions. We bring architectural visions to life.
              </p>

              <div className="flex flex-row gap-4">
                <Link href="/projects">
                  <Button
                    size="lg"
                    className="bg-secondary hover:bg-secondary/90 text-tertiary font-bold text-lg px-8 py-5 h-auto rounded-full shadow-lg hover:shadow-secondary/20 transition-all hover:scale-105 active:scale-95 justify-center"
                  >
                    View Our Projects
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 hover:text-white font-medium text-lg px-8 py-5 h-auto rounded-full backdrop-blur-md transition-all hover:scale-105 active:scale-95 justify-center"
                  >
                    Contact Us
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator — desktop only */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 hidden md:flex"
          aria-hidden="true"
        >
          <div className="w-[28px] h-[46px] border-2 border-white/30 rounded-full flex justify-center p-2">
            <div className="w-1 h-2 bg-secondary rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* ── ABOUT / STATS SECTION ── */}
      <section className="py-16 sm:py-20 bg-background relative" aria-label="About us">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                {/*
                  About image: first visible image below hero — use fetchpriority="high"
                  and a responsive srcSet so the browser picks the right size.
                  NOT lazy-loaded because it's near the top of the page.
                */}
                <img
                  src={unsplashUrl(
                    "https://images.unsplash.com/photo-1497366216548-37526070297c",
                    900
                  )}
                  srcSet={[
                    `${unsplashUrl("https://images.unsplash.com/photo-1497366216548-37526070297c", 640)} 640w`,
                    `${unsplashUrl("https://images.unsplash.com/photo-1497366216548-37526070297c", 900)} 900w`,
                    `${unsplashUrl("https://images.unsplash.com/photo-1497366216548-37526070297c", 1200)} 1200w`,
                    `${unsplashUrl("https://images.unsplash.com/photo-1497366216548-37526070297c", 1800)} 1800w`,
                  ].join(", ")}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  alt="Modern architectural facade in Bangalore by Inotech Interiors"
                  className="w-full h-[350px] sm:h-[450px] md:h-[500px] object-cover"
                  fetchPriority="high"
                  decoding="async"
                  width={900}
                  height={600}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-6 sm:p-8">
                  <div className="text-white">
                    <p className="font-bold text-lg mb-1">Bangalore, India</p>
                    <p className="text-white/70">Headquarters</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="space-y-8">
              <div>
                <h2 className="text-secondary font-bold uppercase tracking-widest mb-2 text-sm">About Us</h2>
                <h3 className="text-3xl sm:text-4xl font-display font-bold text-primary mb-6">Expertise Built Over Two Decades</h3>
                <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-4">
                  At Inotech Interiors, we don't just install glass; we craft experiences. With over 20 years of hands-on experience in the industry, we specialize in transforming ordinary structures into modern architectural landmarks.
                </p>
                <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                  Our team combines technical precision with aesthetic vision to deliver structural glazing, ACP cladding, and aluminium work that stands the test of time.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 sm:gap-6">
                {stats.map((stat, idx) => (
                  <StatCard key={idx} {...stat} delay={idx * 0.2} />
                ))}
              </div>

              <div className="pt-4 sm:pt-6 border-t border-border/10">
                <h4 className="font-display font-bold text-lg sm:text-xl text-primary mb-4 flex items-center gap-2">
                  <span className="w-2.5 h-6 bg-secondary rounded-full inline-block"></span>
                  Trusted by Major Clients
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  {majorClients.map((client, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3.5 p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-amber-50/70 via-white to-amber-50/30 border border-amber-200/50 shadow-sm hover:shadow-md hover:border-secondary/50 transition-all duration-300 group"
                    >
                      <div className="w-8 h-8 rounded-full bg-secondary/15 flex items-center justify-center text-secondary shrink-0 group-hover:bg-secondary group-hover:text-tertiary transition-colors">
                        <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                      </div>
                      <span className="text-base sm:text-lg font-semibold text-primary/90 group-hover:text-primary tracking-tight">
                        {client}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED PROJECTS ── */}
      <section className="py-20 sm:py-24 bg-tertiary/5" aria-label="Featured projects">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10 sm:mb-12">
            <div>
              <p className="text-secondary font-bold uppercase tracking-widest mb-2 text-sm">Portfolio</p>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-primary">Featured Projects</h2>
            </div>
            <Link href="/projects">
              <Button variant="outline" className="hidden md:flex gap-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors">
                View All Projects <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" aria-label="Loading projects">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-[400px] bg-gray-200 rounded-xl animate-pulse" role="presentation" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {displayProjects.map((project, idx) => (
                <ProjectCard key={project.id} project={project} index={idx} />
              ))}
            </div>
          )}

          <div className="mt-10 sm:mt-12 text-center md:hidden">
            <Link href="/projects">
              <Button className="w-full bg-primary text-white">View All Projects</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── SERVICES PREVIEW ── */}
      <section className="py-20 sm:py-24 bg-primary text-white relative overflow-hidden" aria-label="Our services">
        {/*
          Services background: decorative only, below fold — use a regular <img> with
          loading="lazy" so it doesn't compete with LCP resources.
          object-fit:cover + position:absolute replicate the old background-image behaviour.
        */}
        <img
          src={unsplashUrl("https://images.unsplash.com/photo-1506146332389-18140dc7b2fb", 1200)}
          alt=""
          role="presentation"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-overlay pointer-events-none select-none"
          loading="lazy"
          decoding="async"
          width={1200}
          height={800}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4 sm:mb-6">Our Core Services</h2>
            <p className="text-white/70 text-base sm:text-lg">
              We provide comprehensive facade solutions tailored to your architectural needs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              "Structural Glazing",
              "ACP Cladding",
              "Semi-Unitized Glazing",
              "Spider Glazing System"
            ].map((service, idx) => (
              <Link key={idx} href={`/projects?category=${encodeURIComponent(service)}`}>
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 sm:p-8 rounded-2xl hover:bg-white/10 transition-colors group cursor-pointer h-full"
                >
                  <div
                    className="w-12 h-12 bg-secondary rounded-lg mb-5 sm:mb-6 flex items-center justify-center text-primary font-bold text-xl group-hover:scale-110 transition-transform"
                    aria-hidden="true"
                  >
                    {idx + 1}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-3 text-white">{service}</h3>
                  <p className="text-white/60 text-sm mb-4">
                    Premium quality installation and maintenance with cutting-edge technology.
                  </p>
                  <div className="flex items-center text-secondary text-sm font-bold uppercase tracking-wider gap-1">
                    View Gallery <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section className="py-16 sm:py-20 bg-white" aria-label="Contact us">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-secondary to-accent rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none" aria-hidden="true" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3 pointer-events-none" aria-hidden="true" />

            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-4 sm:mb-6">Ready to Transform Your Building?</h2>
              <p className="text-white/90 text-base sm:text-lg mb-6 sm:mb-8">
                Get in touch with our expert team for a consultation on your next project. We bring 20+ years of excellence to every job.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <a
                  href="https://wa.me/919845284778"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chat with Inotech Interiors on WhatsApp"
                >
                  <Button size="lg" className="bg-white text-accent hover:bg-white/90 font-bold w-full sm:w-auto">
                    Chat on WhatsApp
                  </Button>
                </a>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20 w-full sm:w-auto">
                    Contact via Email
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
