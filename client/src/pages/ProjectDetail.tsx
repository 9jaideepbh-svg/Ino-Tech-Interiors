import { useRoute } from "wouter";
import { useProject } from "@/hooks/use-projects";
import { Loader2, ArrowLeft, MapPin, Calendar, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import buildingImg from "@assets/20180309_175550_1772781756286.jpg";
import cmHouseImg from "@assets/IMG_20260306_091320_1772782464446.jpg";

export default function ProjectDetail() {
  const [, params] = useRoute("/projects/:id");
  const id = params ? parseInt(params.id) : 0;
  const { data: project, isLoading, error } = useProject(id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-secondary animate-spin" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold text-primary">Project Not Found</h2>
        <Link href="/projects">
          <Button variant="outline">Back to Gallery</Button>
        </Link>
      </div>
    );
  }

  const isCityCivilCourt = project.title === "City Civil Court";
  const isCMHouse = project.title === "Chief Minister Residential House";
  
  const displayImage = isCityCivilCourt 
    ? buildingImg 
    : isCMHouse 
      ? cmHouseImg 
      : project.imageUrl;

  if (isCityCivilCourt || isCMHouse) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        <div className="p-4 flex items-center justify-between z-50">
          <Link href="/projects">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
            </Button>
          </Link>
          <h1 className="text-white font-display font-bold text-xl">{project.title}</h1>
          <div className="w-24" /> {/* Spacer */}
        </div>
        <div className="flex-grow flex items-center justify-center p-4">
          <motion.img
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            src={displayImage}
            alt={project.title}
            className="max-w-full max-h-[85vh] object-contain shadow-2xl rounded-lg"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header Image */}
      <div className="relative h-[60vh] min-h-[400px]">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img 
          src={displayImage} 
          alt={project.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Link href="/projects">
                <Button variant="ghost" className="text-white hover:text-secondary mb-6 pl-0 hover:bg-transparent">
                  <ArrowLeft className="w-5 h-5 mr-2" /> Back to Projects
                </Button>
              </Link>
              <span className="bg-secondary text-secondary-foreground px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider mb-4 inline-block">
                {project.category}
              </span>
              <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-4 max-w-4xl">
                {project.title}
              </h1>
              {project.location && (
                <div className="flex items-center text-white/90 text-lg">
                  <MapPin className="w-5 h-5 mr-2 text-secondary" />
                  {project.location}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-20 relative z-30">
        <div className="bg-card rounded-2xl shadow-xl p-8 md:p-12 border border-border/10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-bold text-primary mb-6">Project Overview</h3>
              <p className="text-muted-foreground text-lg leading-relaxed whitespace-pre-line mb-8">
                {project.description}
              </p>
              
              <h3 className="text-xl font-bold text-primary mb-4">Work Highlights</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Premium Material Selection", 
                  "Structural Integrity Check", 
                  "Weather-proof Installation", 
                  "Safety Standard Compliant"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-muted-foreground bg-tertiary/5 p-3 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-1 space-y-8">
              <div className="bg-primary/5 p-6 rounded-xl border border-primary/10">
                <h4 className="font-bold text-primary mb-4">Project Details</h4>
                <div className="space-y-4">
                  <div className="flex items-start justify-between border-b border-primary/10 pb-3">
                    <span className="text-muted-foreground text-sm">Client</span>
                    <span className="font-medium text-right text-primary">{project.title}</span>
                  </div>
                  <div className="flex items-start justify-between border-b border-primary/10 pb-3">
                    <span className="text-muted-foreground text-sm">Category</span>
                    <span className="font-medium text-right text-primary">{project.category}</span>
                  </div>
                  <div className="flex items-start justify-between border-b border-primary/10 pb-3">
                    <span className="text-muted-foreground text-sm">Location</span>
                    <span className="font-medium text-right text-primary">{project.location || "Bangalore"}</span>
                  </div>
                  <div className="flex items-start justify-between pb-1">
                    <span className="text-muted-foreground text-sm">Status</span>
                    <span className="font-medium text-right text-green-600">Completed</span>
                  </div>
                </div>
              </div>

              <div className="bg-secondary/10 p-6 rounded-xl border border-secondary/20 text-center">
                <h4 className="font-bold text-primary mb-2">Interested in a similar project?</h4>
                <p className="text-sm text-muted-foreground mb-4">Contact us for a free consultation and quote.</p>
                <Link href="/contact">
                  <Button className="w-full bg-primary text-white hover:bg-primary/90">Get a Quote</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
