import { useState, useEffect } from "react";
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
import type { User } from "firebase/auth";

// Firebase services
import { loginWithEmail, loginWithGoogle, logout as firebaseLogout, subscribeToAuthState } from "@/lib/firebase-auth";
import { fetchAllProjects, addProject, deleteProject, type ProjectImage } from "@/lib/firestore-service";
import { uploadToCloudinary } from "@/lib/cloudinary-service";
import { cloudinaryUrl, isCloudinaryUrl } from "@/lib/cloudinary-utils";

// Google logo SVG (inline, no external dependency)
const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

// ─── Validation Schemas ───────────────────────────────────────────────────────

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const projectSchema = z.object({
  category: z.enum(["structural", "acp", "semi_unitized", "spider"]),
  buildingName: z.string().min(1, "Building/Project name is required"),
  location: z.string().optional(),
});

// ─── Admin Component ──────────────────────────────────────────────────────────

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [stagedFiles, setStagedFiles] = useState<
    { file: File; preview: string; title: string; location: string; id: string }[]
  >([]);
  const [projects, setProjects] = useState<ProjectImage[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // ── Firebase auth state ──────────────────────────────────────────────────
  useEffect(() => {
    const unsubscribe = subscribeToAuthState((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
      if (firebaseUser) loadProjects();
    });
    return () => unsubscribe();
  }, []);

  // ── Load projects from Firestore ─────────────────────────────────────────
  async function loadProjects() {
    try {
      const data = await fetchAllProjects();
      setProjects(data);
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error fetching projects", description: err.message });
    }
  }

  // ── Forms ────────────────────────────────────────────────────────────────
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const projectForm = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: { category: "structural", buildingName: "", location: "Bangalore" },
  });

  // ── Email/Password Login ─────────────────────────────────────────────────
  async function onLogin(data: z.infer<typeof loginSchema>) {
    setLoading(true);
    try {
      await loginWithEmail(data.email, data.password);
    } catch (err: any) {
      toast({ variant: "destructive", title: "Login failed", description: err.message });
    } finally {
      setLoading(false);
    }
  }

  // ── Google Sign-In ───────────────────────────────────────────────────────
  async function handleGoogleLogin() {
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Google Sign-In failed",
        description: err.message,
      });
    } finally {
      setGoogleLoading(false);
    }
  }

  // ── Logout ───────────────────────────────────────────────────────────────
  async function handleLogout() {
    await firebaseLogout();
    setProjects([]);
  }

  // ── File staging ─────────────────────────────────────────────────────────
  function onFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    const buildingName = projectForm.getValues("buildingName").trim();
    const location = projectForm.getValues("location")?.trim() || "Bangalore";
    const newFiles = Array.from(e.target.files).map((f) => ({
      file: f,
      preview: URL.createObjectURL(f),
      title: buildingName || "",
      location,
      id: Math.random().toString(36).substring(7),
    }));
    setStagedFiles((prev) => [...prev, ...newFiles].slice(0, 10));
  }

  // ── Batch upload: Cloudinary → Firestore ─────────────────────────────────
  async function submitBatch() {
    if (stagedFiles.length === 0) return;
    setUploading(true);
    try {
      const category = projectForm.getValues("category");
      const defaultLocation = projectForm.getValues("location")?.trim() || "Bangalore";

      for (const sf of stagedFiles) {
        // 1. Upload image to Cloudinary
        const imageUrl = await uploadToCloudinary(sf.file);

        // 2. Save metadata to Firestore
        const finalTitle =
          sf.title.trim() || projectForm.getValues("buildingName").trim() || "Untitled Project";
        await addProject({
          image_url: imageUrl,
          category,
          title: finalTitle,
          location: sf.location.trim() || defaultLocation,
        });
      }

      setShowSuccess(true);
      setStagedFiles([]);
      queryClient.invalidateQueries({ queryKey: [api.projects.list.path] });
      loadProjects();
    } catch (err: any) {
      toast({ variant: "destructive", title: "Upload failed", description: err.message });
    } finally {
      setUploading(false);
    }
  }

  // ── Delete project ───────────────────────────────────────────────────────
  async function handleDelete(id: string) {
    try {
      await deleteProject(id);
      toast({ title: "Deleted", description: "Project removed successfully" });
      loadProjects();
      queryClient.invalidateQueries({ queryKey: [api.projects.list.path] });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Delete failed", description: err.message });
    }
  }

  // ── Loading spinner ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-secondary" />
      </div>
    );
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6 pt-24">
      <AnimatePresence mode="wait">
        {/* ── Login Screen ── */}
        {!user ? (
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
                          <FormControl>
                            <Input
                              placeholder="admin@example.com"
                              autoComplete="off"
                              className="bg-neutral-800 border-neutral-700"
                              {...field}
                            />
                          </FormControl>
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
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="••••••••"
                              autoComplete="new-password"
                              className="bg-neutral-800 border-neutral-700"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      disabled={loading || googleLoading}
                      className="w-full bg-secondary hover:bg-secondary/90 text-primary font-bold"
                    >
                      {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                      Login
                    </Button>
                  </form>
                </Form>

                {/* ── Divider ── */}
                <div className="relative my-5">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-neutral-700" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-neutral-900 px-3 text-neutral-500 tracking-widest">or</span>
                  </div>
                </div>

                {/* ── Google Sign-In ── */}
                <Button
                  type="button"
                  variant="outline"
                  disabled={loading || googleLoading}
                  onClick={handleGoogleLogin}
                  className="w-full border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold h-10 transition-all"
                >
                  {googleLoading
                    ? <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    : <GoogleIcon />}
                  Continue with Google
                </Button>
                <p className="text-center text-xs text-neutral-600 mt-2">
                  Only authorized accounts can access this panel.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          /* ── Dashboard ── */
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

            {/* ── Upload Form ── */}
            <Card className="bg-neutral-900 border-neutral-800 text-white">
              <CardHeader>
                <CardTitle>Upload New Project</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Form {...projectForm}>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Building Name */}
                      <FormField
                        control={projectForm.control}
                        name="buildingName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-secondary font-bold">
                              Building / Project Name <span className="text-red-400">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. HAL Administrative Complex"
                                className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  if (stagedFiles.length > 0) {
                                    setStagedFiles((prev) =>
                                      prev.map((sf) => ({ ...sf, title: e.target.value }))
                                    );
                                  }
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* Location */}
                      <FormField
                        control={projectForm.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. Bangalore"
                                className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                      {/* Category */}
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

                      {/* File picker */}
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
                          className={`flex items-center justify-center w-full h-10 px-4 py-2 font-bold rounded-md transition-colors ${
                            stagedFiles.length >= 10
                              ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                              : "bg-neutral-800 text-white cursor-pointer hover:bg-neutral-700 border border-neutral-700 border-dashed"
                          }`}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Select Images (Max 10)
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Staged files preview */}
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
                              <img
                                src={sf.preview}
                                className="w-16 h-16 object-cover rounded-md border border-neutral-800 flex-shrink-0"
                                alt={`Preview of ${sf.title || 'staged image'}`}
                                decoding="async"
                              />
                              <Input
                                placeholder="Enter a unique title for this project image..."
                                value={sf.title}
                                onChange={(e) => {
                                  const newFiles = [...stagedFiles];
                                  newFiles[idx].title = e.target.value;
                                  setStagedFiles(newFiles);
                                }}
                                className="flex-grow bg-neutral-950 border-neutral-800 text-white"
                              />
                              <Button
                                size="icon"
                                variant="destructive"
                                onClick={() => setStagedFiles(stagedFiles.filter((f) => f.id !== sf.id))}
                              >
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

            {/* ── Project Gallery ── */}
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
                    <img
                      src={
                        isCloudinaryUrl(p.image_url)
                          ? cloudinaryUrl(p.image_url, { width: 400, height: 225, crop: "fill", quality: "auto:good" })
                          : p.image_url
                      }
                      alt={p.title || "Project image"}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                      width={400}
                      height={225}
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center gap-2">
                      <span className="text-secondary font-bold uppercase text-xs tracking-widest">
                        {p.category}
                      </span>
                      <p className="text-white text-sm font-semibold text-center px-4">{p.title}</p>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(p.id)}
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

      {/* ── Success Dialog ── */}
      <Dialog
        open={showSuccess}
        onOpenChange={(open) => {
          if (!open) {
            setShowSuccess(false);
            handleLogout();
          }
        }}
      >
        <DialogContent className="sm:max-w-md bg-neutral-900 border-neutral-800 text-white flex flex-col items-center p-12 shadow-2xl">
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
            className="rounded-full bg-green-500/10 p-6 mb-6"
          >
            <CheckCircle className="w-24 h-24 text-green-500" />
          </motion.div>
          <h2 className="text-3xl font-display font-bold mb-3 text-white text-center">
            Batch Upload Complete!
          </h2>
          <p className="text-neutral-400 text-center mb-8">
            Your images have been uploaded to Cloudinary and cataloged in Firebase. For security
            purposes, you will now be securely logged out.
          </p>
          <Button
            onClick={() => {
              setShowSuccess(false);
              handleLogout();
            }}
            className="w-full bg-secondary text-primary font-bold hover:bg-secondary/90 h-12 text-lg"
          >
            Complete Session
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
