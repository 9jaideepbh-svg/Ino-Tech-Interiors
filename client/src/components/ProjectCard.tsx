import { Project } from "@shared/schema";
import { motion } from "framer-motion";
import { ArrowUpRight, MapPin } from "lucide-react";
import { Link } from "wouter";
import buildingImg from "@assets/20180309_175550_1772781756286.jpg";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="group relative bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-2xl border border-border/10 transition-all duration-300 h-full flex flex-col"
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 z-10 group-hover:opacity-40 transition-opacity duration-300" />
        <img
          src={buildingImg}
          alt={project.title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
        />
        <div className="absolute top-4 left-4 z-20">
          <span className="px-3 py-1 bg-secondary text-secondary-foreground text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">
            {project.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-secondary transition-colors line-clamp-1">
          {project.title}
        </h3>
        
        {project.location && (
          <div className="flex items-center gap-2 text-muted-foreground mb-3 text-sm">
            <MapPin className="w-4 h-4 text-secondary" />
            <span>{project.location}</span>
          </div>
        )}
        
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-grow">
          {project.description}
        </p>

        <Link href={`/projects/${project.id}`} className="inline-flex items-center gap-2 text-primary font-semibold text-sm group-hover:underline decoration-secondary underline-offset-4 mt-auto">
          View Details <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        </Link>
      </div>
    </motion.div>
  );
}
