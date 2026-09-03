import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { BackgroundPaths } from "@/components/ui/background-paths";
import { SEO } from "@/components/SEO";

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      toast({
        title: "Validation Error",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      return;
    }

    const now = Date.now();

    // Rate Limiting Rule 1: Max 3 form submissions per user per day (24 hours)
    let userSubmissions: number[] = [];
    try {
      const storedUser = localStorage.getItem("inotech_user_submissions");
      if (storedUser) {
        userSubmissions = JSON.parse(storedUser).filter((ts: number) => now - ts < 86400000);
      }
    } catch {
      userSubmissions = [];
    }

    if (userSubmissions.length >= 3) {
      toast({
        title: "Submission Limit Reached",
        description: "You have reached the maximum of 3 form submissions per day. Please contact us directly by phone or email.",
        variant: "destructive",
      });
      return;
    }

    // Rate Limiting Rule 2: Max 4 form submissions within 1 minute
    let recentSubmissions: number[] = [];
    try {
      const storedRecent = localStorage.getItem("inotech_recent_submissions");
      if (storedRecent) {
        recentSubmissions = JSON.parse(storedRecent).filter((ts: number) => now - ts < 60000);
      }
    } catch {
      recentSubmissions = [];
    }

    if (recentSubmissions.length >= 4) {
      toast({
        title: "Rate Limit Exceeded",
        description: "Too many submissions within a minute. Please wait a minute before trying again.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData(form);
    const payload = {
      name: (formData.get("name") as string) || "",
      email: (formData.get("email") as string) || "",
      phone: (formData.get("phone") as string) || "",
      message: (formData.get("message") as string) || "",
    };

    try {
      let data: any = null;

      // 1. Primary route: Express server proxy (/api/contact) — bypasses CORS & client ad-blockers
      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          data = await res.json();
        }
      } catch (proxyErr) {
        console.warn("Server proxy failed, trying direct Web3Forms API:", proxyErr);
      }

      // 2. Direct fallback: Web3Forms API with JSON payload
      if (!data) {
        const directRes = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify({
            access_key: "5b66c193-553b-4c2a-ba73-7f80f22c393b",
            subject: "New Project Inquiry - INOTECH Interiors",
            from_name: "Inotech Interiors Website",
            name: payload.name,
            email: payload.email,
            phone: payload.phone,
            message: payload.message,
          }),
        });
        data = await directRes.json();
      }

      if (data && data.success) {
        // Record timestamps for rate limiting
        userSubmissions.push(now);
        localStorage.setItem("inotech_user_submissions", JSON.stringify(userSubmissions));
        recentSubmissions.push(now);
        localStorage.setItem("inotech_recent_submissions", JSON.stringify(recentSubmissions));

        toast({
          title: "Message Sent!",
          description: "Thank you! We will get back to you soon. Regards: INOTECH INTERIORS",
        });
        form.reset();
      } else {
        toast({
          title: "Submission Failed",
          description: data?.message || "Something went wrong. Please try submitting again or call us directly.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Network Error",
        description: "Unable to reach the server. Please check your internet connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dark min-h-screen relative overflow-hidden bg-background pt-20 sm:pt-24 pb-20">
      <SEO
        title="Contact Us | Inotech Interiors – Structural Glazing Bangalore"
        description="Get in touch with Inotech Interiors for structural glazing, ACP cladding, and facade projects in Bangalore. Call +91 9845284778 or email us."
        canonical="https://inotech-interiors.web.app/contact"
      />
      <div className="hidden md:block">
        <BackgroundPaths />
      </div>
      <div className="container relative z-10 mx-auto px-4">
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

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-card rounded-2xl p-8 md:p-10 shadow-xl border border-border/10 relative z-10 backdrop-blur-md"
          >
            <h3 className="text-2xl font-bold text-primary mb-6">Send us a message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  First Name <span className="text-red-500">*</span>
                </label>
                <Input name="name" placeholder="First Name" required className="bg-background border-input focus:border-secondary" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Email <span className="text-red-500">*</span>
                </label>
                <Input type="email" name="email" placeholder="Email" required className="bg-background border-input focus:border-secondary" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <Input type="tel" name="phone" placeholder="Phone" required className="bg-background border-input focus:border-secondary" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Message <span className="text-red-500">*</span>
                </label>
                <Textarea 
                  name="message"
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
