import { useState, useEffect } from "react";
import { useProjects } from "@/hooks/use-projects";
import { ProjectCard } from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { categories } from "@shared/schema";
import { Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { SEO } from "@/components/SEO";

export default function Projects() {
  const { data: projects, isLoading } = useProjects();
  const [location] = useLocation();
  const [activeCategory, setActiveCategory] = useState<string>("All");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get("category");
    if (categoryParam && (categoryParam === "All" || categories.includes(categoryParam as any))) {
      setActiveCategory(categoryParam);
    }
  }, [location]);

  const filteredProjects = activeCategory === "All" 
    ? projects 
    : projects?.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-background pt-20 sm:pt-24 pb-20">
      <SEO
        title="Projects | Structural Glazing Portfolio – Inotech Interiors"
        description="Browse Inotech Interiors' portfolio of structural glazing, ACP cladding, semi-unitized and spider glazing projects across Bangalore."
        canonical="https://inotech-interiors.web.app/projects"
      />
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h4 className="text-secondary font-bold uppercase tracking-widest mb-2">Our Work</h4>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-primary mb-6">Project Gallery</h1>
            <p className="text-muted-foreground text-lg">
              Explore our portfolio of structural glazing, cladding, and facade projects across Bangalore and beyond.
            </p>
          </motion.div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <Button
            variant={activeCategory === "All" ? "default" : "outline"}
            onClick={() => setActiveCategory("All")}
            className={`rounded-full px-6 ${activeCategory === "All" ? "bg-primary" : "border-primary/20 text-primary hover:bg-primary/5"}`}
          >
            All Projects
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-6 ${activeCategory === category ? "bg-primary" : "border-primary/20 text-primary hover:bg-primary/5"}`}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 text-secondary animate-spin" />
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {filteredProjects?.map((project, idx) => (
                <ProjectCard key={project.id} project={project} index={idx} />
              ))}
            </AnimatePresence>
            
            {filteredProjects?.length === 0 && (
              <div className="col-span-full text-center py-20 text-muted-foreground">
                <p>No projects found in this category yet.</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
