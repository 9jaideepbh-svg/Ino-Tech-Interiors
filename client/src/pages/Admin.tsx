import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, LogOut, Upload, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const projectSchema = z.object({
  category: z.enum(["structural", "acp", "semi_unitized", "spider"]),
});

export default function Admin() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (session) fetchProjects();
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchProjects();
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchProjects() {
    const { data, error } = await supabase
      .from('project_images')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      toast({ variant: "destructive", title: "Error fetching projects", description: error.message });
    } else {
      setProjects(data || []);
    }
  }

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const projectForm = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: { category: "structural" },
  });

  async function onLogin(data: z.infer<typeof loginSchema>) {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword(data);
    if (error) {
      toast({ variant: "destructive", title: "Login failed", description: error.message });
    }
    setLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) return;
      
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `projects/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('project-images')
        .getPublicUrl(filePath);

      const category = projectForm.getValues("category");

      const { error: dbError } = await supabase
        .from('project_images')
        .insert([{ image_url: publicUrl, category }]);

      if (dbError) throw dbError;

      toast({ title: "Success", description: "Image uploaded successfully" });
      fetchProjects();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Upload failed", description: error.message });
    } finally {
      setUploading(false);
    }
  }

  async function deleteProject(id: number, imageUrl: string) {
    try {
      const path = imageUrl.split('project-images/').pop();
      if (path) {
        await supabase.storage.from('project-images').remove([path]);
      }
      const { error } = await supabase.from('project_images').delete().eq('id', id);
      if (error) throw error;
      toast({ title: "Deleted", description: "Project removed" });
      fetchProjects();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Delete failed", description: error.message });
    }
  }

  if (loading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6 pt-24">
      <AnimatePresence mode="wait">
        {!session ? (
          <motion.div 
            key="login"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex justify-center"
          >
            <Card className="w-full max-w-md bg-neutral-900 border-neutral-800 text-white">
              <CardHeader>
                <CardTitle className="text-2xl font-display text-center">Admin Access</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl><Input className="bg-neutral-800 border-neutral-700" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl><Input type="password" className="bg-neutral-800 border-neutral-700" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90 text-primary font-bold">
                      Login
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-6xl mx-auto space-y-8"
          >
            <div className="flex justify-between items-center border-b border-neutral-800 pb-4">
              <h1 className="text-3xl font-display font-bold text-secondary">Admin Dashboard</h1>
              <Button variant="ghost" onClick={handleLogout} className="text-neutral-400 hover:text-white">
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </div>

            <Card className="bg-neutral-900 border-neutral-800 text-white">
              <CardHeader>
                <CardTitle>Upload New Project</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Form {...projectForm}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                    <FormField
                      control={projectForm.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-neutral-800 border-neutral-700">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-neutral-800 border-neutral-700 text-white">
                              <SelectItem value="structural">Structural Glazing</SelectItem>
                              <SelectItem value="acp">ACP Cladding</SelectItem>
                              <SelectItem value="semi_unitized">Semi Unitized</SelectItem>
                              <SelectItem value="spider">Spider Glazing</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="relative">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={onUpload}
                        disabled={uploading}
                        className="hidden"
                        id="image-upload"
                      />
                      <label 
                        htmlFor="image-upload"
                        className="flex items-center justify-center w-full h-10 px-4 py-2 bg-secondary text-primary font-bold rounded-md cursor-pointer hover:bg-secondary/90 transition-colors"
                      >
                        {uploading ? <Loader2 className="animate-spin mr-2" /> : <Upload className="mr-2 h-4 w-4" />}
                        {uploading ? "Uploading..." : "Choose & Upload Image"}
                      </label>
                    </div>
                  </div>
                </Form>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {projects.map((p) => (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="group relative aspect-video rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900"
                  >
                    <img src={p.image_url} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center gap-2">
                      <span className="text-secondary font-bold uppercase text-xs tracking-widest">{p.category}</span>
                      <Button 
                        variant="destructive" 
                        size="icon" 
                        onClick={() => deleteProject(p.id, p.image_url)}
                        className="rounded-full"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
