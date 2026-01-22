import { motion } from "framer-motion";
import { CheckCircle, Award, Target, Users } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      {/* Header */}
      <div className="container mx-auto px-4 mb-20">
        <div className="text-center max-w-4xl mx-auto">
          <motion.h4 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-secondary font-bold uppercase tracking-widest mb-2"
          >
            About Inotech Interiors
          </motion.h4>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-display font-bold text-primary mb-6"
          >
            Two Decades of Excellence in Facade Engineering
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground leading-relaxed"
          >
            We don't just build facades; we create the face of modern architecture.
          </motion.p>
        </div>
      </div>

      {/* Story Section */}
      <section className="container mx-auto px-4 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
           <motion.div
             initial={{ opacity: 0, x: -30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
           >
             <img 
               src="https://images.unsplash.com/photo-1555636222-cae831e670b3?q=80&w=2077&auto=format&fit=crop" 
               alt="Team working on construction" 
               className="rounded-2xl shadow-2xl w-full object-cover h-[500px]"
             />
           </motion.div>
           
           <motion.div
             initial={{ opacity: 0, x: 30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className="space-y-6"
           >
             <h3 className="text-3xl font-display font-bold text-primary">Our Story</h3>
             <p className="text-muted-foreground text-lg leading-relaxed">
               Founded in 2004, Inotech Interiors began with a singular vision: to bring world-class structural glazing solutions to India's rapidly growing infrastructure.
             </p>
             <p className="text-muted-foreground text-lg leading-relaxed">
               Over the last 20+ years, we have evolved from a small fabrication unit to a premier facade engineering company, trusted by government bodies like HAL and corporate giants like ITC.
             </p>
             <p className="text-muted-foreground text-lg leading-relaxed">
               Despite our growth, we maintain our core values of precision, safety, and client satisfaction. We handle everything from conceptualization to installation, ensuring a seamless experience.
             </p>

             <div className="grid grid-cols-2 gap-4 mt-6">
               {[
                 "20+ Years Experience",
                 "500+ Projects",
                 "ISO Certified Processes",
                 "Expert Engineering Team"
               ].map((item, i) => (
                 <div key={i} className="flex items-center gap-2 font-medium text-primary">
                   <CheckCircle className="w-5 h-5 text-secondary" />
                   {item}
                 </div>
               ))}
             </div>
           </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-primary text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Why Choose Us?</h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Our commitment to quality sets us apart in the competitive construction industry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Award,
                title: "Quality Assurance",
                desc: "We use only premium grade aluminium, glass, and fittings to ensure durability and safety."
              },
              {
                icon: Target,
                title: "Precision Engineering",
                desc: "Every cut, joint, and seal is executed with millimeter-level precision for a flawless finish."
              },
              {
                icon: Users,
                title: "Client-Centric Approach",
                desc: "We work closely with architects and clients to realize their exact vision without compromise."
              }
            ].map((value, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white/10 backdrop-blur-sm border border-white/10 p-8 rounded-2xl"
              >
                <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center mb-6 text-primary">
                  <value.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-white/70 leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
