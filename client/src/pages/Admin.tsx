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
import { Loader2, LogOut, Upload, Trash2, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";

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
  const [showSuccess, setShowSuccess] = useState(false);
  const [stagedFiles, setStagedFiles] = useState<{file: File, preview: string, title: string, id: string}[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  function onFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
     if (!e.target.files) return;
     const newFiles = Array.from(e.target.files).map(f => ({
       file: f,
       preview: URL.createObjectURL(f),
       title: "",
       id: Math.random().toString(36).substring(7)
     }));
     setStagedFiles(prev => [...prev, ...newFiles].slice(0, 10)); // max 10
  }

  async function submitBatch() {
    try {
      setUploading(true);
      if (stagedFiles.length === 0) return;
      const category = projectForm.getValues("category");

      for (const sf of stagedFiles) {
        const fileExt = sf.file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `projects/${fileName}`;

        const { error: uploadError } = await supabase.storage.from('project-images').upload(filePath, sf.file);
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from('project-images').getPublicUrl(filePath);
        const finalTitle = sf.title.trim() || 'Untitled Project';

        const { error: dbError } = await supabase.from('project_images').insert([{ 
          image_url: publicUrl, 
          category,
          title: finalTitle
        }]);

        if (dbError) throw dbError;
      }

      setShowSuccess(true);
      setStagedFiles([]);
      queryClient.invalidateQueries({ queryKey: [api.projects.list.path] });
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
                          <FormControl><Input placeholder="admin@example.com" autoComplete="off" className="bg-neutral-800 border-neutral-700" {...field} /></FormControl>
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
                          <FormControl><Input type="password" placeholder="••••••••" autoComplete="new-password" className="bg-neutral-800 border-neutral-700" {...field} /></FormControl>
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
                        multiple
                        onChange={onFileSelect}
                        disabled={uploading || stagedFiles.length >= 10}
                        className="hidden"
                        id="image-upload"
                      />
                      <label 
                        htmlFor="image-upload"
                        className={`flex items-center justify-center w-full h-10 px-4 py-2 font-bold rounded-md transition-colors ${stagedFiles.length >= 10 ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed' : 'bg-neutral-800 text-white cursor-pointer hover:bg-neutral-700 border border-neutral-700 border-dashed'}`}
                      >
                         <Upload className="mr-2 h-4 w-4" />
                        Select Images (Max 10)
                      </label>
                    </div>
                  </div>

                  {stagedFiles.length > 0 && (
                    <div className="mt-8">
                      <h4 className="text-secondary font-bold mb-4 flex justify-between items-center">
                        Selected Files ({stagedFiles.length})
                        <Button 
                           type="button" 
                           onClick={submitBatch} 
                           disabled={uploading}
                           className="bg-secondary text-primary hover:bg-secondary/90 font-bold"
                        >
                           {uploading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                           Upload Batch
                        </Button>
                      </h4>
                      <div className="space-y-3 max-h-96 overflow-y-auto pr-2 rounded-lg">
                        <AnimatePresence>
                          {stagedFiles.map((sf, idx) => (
                             <motion.div 
                               initial={{ opacity: 0, x: -10 }} 
                               animate={{ opacity: 1, x: 0 }} 
                               exit={{ opacity: 0, height: 0 }}
                               key={sf.id} 
                               className="flex gap-4 p-3 border border-neutral-800 rounded-lg items-center bg-neutral-900/50"
                             >
                               <img src={sf.preview} className="w-16 h-16 object-cover rounded-md border border-neutral-800" alt="Preview"/>
                               <Input 
                                 placeholder="Enter a unique title for this project image..." 
                                 value={sf.title}
                                 onChange={e => {
                                    const newFiles = [...stagedFiles];
                                    newFiles[idx].title = e.target.value;
                                    setStagedFiles(newFiles);
                                 }}
                                 className="flex-grow bg-neutral-950 border-neutral-800 text-white"
                               />
                               <Button size="icon" variant="destructive" onClick={() => setStagedFiles(stagedFiles.filter(f => f.id !== sf.id))}>
                                  <Trash2 className="w-4 h-4" />
                               </Button>
                             </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </div>
                  )}
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

      <Dialog open={showSuccess} onOpenChange={(open) => {
         if (!open) {
            setShowSuccess(false);
            handleLogout(); 
         }
      }}>
        <DialogContent className="sm:max-w-md bg-neutral-900 border-neutral-800 text-white flex flex-col items-center p-12 shadow-2xl">
          <motion.div 
            initial={{ scale: 0, rotate: -45 }} 
            animate={{ scale: 1, rotate: 0 }} 
            transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
            className="rounded-full bg-green-500/10 p-6 mb-6"
          >
             <CheckCircle className="w-24 h-24 text-green-500" />
          </motion.div>
          <h2 className="text-3xl font-display font-bold mb-3 text-white text-center">Batch Upload Complete!</h2>
          <p className="text-neutral-400 text-center mb-8">
            Your images have been beautifully cataloged and published to the live platform. For security purposes, you will now be securely logged out.
          </p>
          <Button 
            onClick={() => { setShowSuccess(false); handleLogout(); }} 
            className="w-full bg-secondary text-primary font-bold hover:bg-secondary/90 h-12 text-lg"
          >
            Complete Session
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
