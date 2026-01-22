import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Building2, Users, Trophy, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ProjectCard } from "@/components/ProjectCard";
import { useProjects } from "@/hooks/use-projects";

export default function Home() {
  const { data: projects, isLoading } = useProjects();
  
  // Filter for featured projects or just take the first few if none marked featured
  const featuredProjects = projects 
    ? projects.filter(p => p.featured).slice(0, 3) 
    : [];

  // If no featured projects, just show the first 3 (fallback)
  const displayProjects = featuredProjects.length > 0 ? featuredProjects : (projects?.slice(0, 3) || []);

  const stats = [
    { icon: Building2, value: "20+", label: "Years Experience" },
    { icon: Trophy, value: "500+", label: "Projects Completed" },
    { icon: Users, value: "100%", label: "Client Satisfaction" },
  ];

  const majorClients = [
    "HAL (Hindustan Aeronautics Limited)",
    "City Civil Court Bangalore",
    "CM Residential House",
    "Jyothi Institute of Technology",
    "ITC"
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center overflow-hidden bg-tertiary">
        {/* Abstract Background Animation - Represents 3D/Glass */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-tertiary via-tertiary/90 to-tertiary/60"></div>
          
          {/* Animated Glass Shapes */}
          <motion.div 
            animate={{ 
              y: [0, -20, 0], 
              rotate: [0, 5, 0],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 right-[10%] w-64 h-64 border border-white/10 bg-white/5 backdrop-blur-sm rounded-2xl transform rotate-12 hidden md:block"
          />
          <motion.div 
            animate={{ 
              y: [0, 30, 0], 
              rotate: [0, -10, 0],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-1/4 right-[20%] w-48 h-48 border border-secondary/20 bg-secondary/10 backdrop-blur-md rounded-full hidden md:block"
          />
        </div>

        <div className="container mx-auto px-4 relative z-10 pt-20">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-secondary font-bold tracking-wider uppercase mb-4 flex items-center gap-2">
                <span className="w-8 h-0.5 bg-secondary inline-block"></span>
                Since 2004
              </h2>
              <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 leading-tight">
                Shaping Skylines with <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent">Precision</span>
              </h1>
              <p className="text-xl text-white/80 mb-8 leading-relaxed max-w-2xl">
                20+ Years of Excellence in Structural Glazing, ACP Cladding, and Modern Facade Solutions. We bring architectural visions to life.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/projects">
                  <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-tertiary font-bold text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-secondary/20 transition-all">
                    View Our Projects
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:text-white font-medium text-lg px-8 py-6 rounded-full backdrop-blur-sm">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About / Stats Section */}
      <section className="py-20 bg-background relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
               {/* About Us Image - Modern Architecture */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2301&auto=format&fit=crop" 
                  alt="Modern Building Facade" 
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-8">
                  <div className="text-white">
                    <p className="font-bold text-lg mb-1">Bangalore, India</p>
                    <p className="text-white/70">Headquarters</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="space-y-8">
              <div>
                <h4 className="text-secondary font-bold uppercase tracking-widest mb-2">About Us</h4>
                <h2 className="text-4xl font-display font-bold text-primary mb-6">Expertise Built Over Two Decades</h2>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  At Inotech Interiors, we don't just install glass; we craft experiences. With over 20 years of hands-on experience in the industry, we specialize in transforming ordinary structures into modern architectural landmarks.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Our team combines technical precision with aesthetic vision to deliver structural glazing, ACP cladding, and aluminium work that stands the test of time.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-6">
                {stats.map((stat, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.2 }}
                    className="text-center p-4 rounded-xl bg-white shadow-lg border border-border/10"
                  >
                    <stat.icon className="w-8 h-8 text-secondary mx-auto mb-3" />
                    <h3 className="text-2xl font-bold text-primary">{stat.value}</h3>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              <div className="pt-4">
                <h4 className="font-bold text-primary mb-4">Trusted by Major Clients:</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {majorClients.map((client, i) => (
                    <li key={i} className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0" />
                      <span className="text-sm font-medium">{client}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-24 bg-tertiary/5">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h4 className="text-secondary font-bold uppercase tracking-widest mb-2">Portfolio</h4>
              <h2 className="text-4xl font-display font-bold text-primary">Featured Projects</h2>
            </div>
            <Link href="/projects">
              <Button variant="outline" className="hidden md:flex gap-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors">
                View All Projects <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {[1, 2, 3].map(i => (
                 <div key={i} className="h-[400px] bg-gray-200 rounded-xl animate-pulse" />
               ))}
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayProjects.map((project, idx) => (
                <ProjectCard key={project.id} project={project} index={idx} />
              ))}
            </div>
          )}

          <div className="mt-12 text-center md:hidden">
            <Link href="/projects">
              <Button className="w-full bg-primary text-white">View All Projects</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-24 bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?q=80&w=2064&auto=format&fit=crop')] opacity-10 bg-cover bg-fixed mix-blend-overlay"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-display font-bold mb-6">Our Core Services</h2>
            <p className="text-white/70 text-lg">
              We provide comprehensive facade solutions tailored to your architectural needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              "Structural Glazing",
              "ACP Cladding",
              "Semi-Unitized Glazing",
              "Spider Glazing System"
            ].map((service, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors group cursor-pointer"
              >
                <div className="w-12 h-12 bg-secondary rounded-lg mb-6 flex items-center justify-center text-primary font-bold text-xl group-hover:scale-110 transition-transform">
                  {idx + 1}
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{service}</h3>
                <p className="text-white/60 text-sm mb-4">
                  Premium quality installation and maintenance with cutting-edge technology.
                </p>
                <div className="flex items-center text-secondary text-sm font-bold uppercase tracking-wider group-hover:gap-2 transition-all">
                  Learn More <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-secondary to-accent rounded-3xl p-12 text-center text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Ready to Transform Your Building?</h2>
              <p className="text-white/90 text-lg mb-8">
                Get in touch with our expert team for a consultation on your next project. We bring 20+ years of excellence to every job.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="https://wa.me/919845284778" target="_blank" rel="noopener noreferrer">
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
