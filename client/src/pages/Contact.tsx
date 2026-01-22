import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We will get back to you shortly.",
      });
      // Reset form would go here
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h4 className="text-secondary font-bold uppercase tracking-widest mb-2">Get in Touch</h4>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-primary mb-6">Let's Discuss Your Project</h1>
            <p className="text-muted-foreground text-lg mb-12 max-w-lg">
              Whether you need a structural glazing expert or aluminum fabrication services, our team is here to help you build your vision.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center shrink-0 text-secondary">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-primary text-lg mb-1">Phone Number</h3>
                  <p className="text-muted-foreground mb-1">Mon-Sat from 9am to 6pm</p>
                  <a href="tel:9845284778" className="text-xl font-bold text-secondary hover:underline">
                    +91 9845284778
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center shrink-0 text-secondary">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-primary text-lg mb-1">Email Address</h3>
                  <p className="text-muted-foreground mb-1">For quotes and inquiries</p>
                  <a href="mailto:inotechinteriors@gmail.com" className="text-xl font-bold text-secondary hover:underline">
                    inotechinteriors@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center shrink-0 text-secondary">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-primary text-lg mb-1">Office Location</h3>
                  <p className="text-muted-foreground text-lg">
                    Bangalore, Karnataka, India
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl p-8 md:p-10 shadow-xl border border-border/10"
          >
            <h3 className="text-2xl font-bold text-primary mb-6">Send us a message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">First Name</label>
                  <Input placeholder="John" required className="bg-background border-input focus:border-secondary" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Last Name</label>
                  <Input placeholder="Doe" required className="bg-background border-input focus:border-secondary" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <Input type="email" placeholder="john@example.com" required className="bg-background border-input focus:border-secondary" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Phone (Optional)</label>
                <Input type="tel" placeholder="+91 90000 00000" className="bg-background border-input focus:border-secondary" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Message</label>
                <Textarea 
                  placeholder="Tell us about your project requirements..." 
                  className="min-h-[150px] bg-background border-input focus:border-secondary" 
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-white h-12 text-lg font-medium"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"} 
                {!isSubmitting && <Send className="w-4 h-4 ml-2" />}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
