import { Project } from "@shared/schema";
import { motion } from "framer-motion";
import { MapPin, Maximize2 } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import buildingImg from "@assets/20180309_175550_1772781756286.jpg";
import cmHouseImg from "@assets/IMG_20260306_091320_1772782464446.jpg";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const isCityCivilCourt = project.title === "City Civil Court";
  const isCMHouse = project.title === "Chief Minister Residential House";
  
  const displayImage = isCityCivilCourt 
    ? buildingImg 
    : isCMHouse 
      ? cmHouseImg 
      : project.imageUrl;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          whileHover={{ y: -5 }}
          className="group relative bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-2xl border border-border/10 transition-all duration-300 h-full flex flex-col cursor-pointer"
        >
          {/* Image Container */}
          <div className="relative h-64 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 z-10 group-hover:opacity-40 transition-opacity duration-300" />
            <img
              src={displayImage}
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

            <div className="inline-flex items-center gap-2 text-primary font-semibold text-sm group-hover:underline decoration-secondary underline-offset-4 mt-auto">
              View Full Image <Maximize2 className="w-4 h-4 transition-transform group-hover:scale-110" />
            </div>
          </div>
        </motion.div>
      </DialogTrigger>

      <DialogContent className="!max-w-[95vw] w-[95vw] h-[95vh] p-2 overflow-hidden border-none bg-black/90 backdrop-blur-xl rounded-2xl flex flex-col justify-center items-center shadow-2xl">
        <div className="relative w-full h-full flex justify-center items-center">
          <img 
            src={displayImage} 
            alt={project.title} 
            className="w-full h-full object-contain rounded-lg shadow-2xl"
          />
          <div className="absolute bottom-6 left-0 right-0 text-center flex justify-center pointer-events-none">
             <span className="bg-black/80 border border-white/10 text-white px-6 py-3 rounded-full backdrop-blur-md font-display font-bold shadow-xl tracking-wide">
               {project.title}
             </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
