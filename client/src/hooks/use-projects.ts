// ─────────────────────────────────────────────────────────────────────────────
// Project hooks – Firestore + Backend seed data
// ─────────────────────────────────────────────────────────────────────────────
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertProject } from "@shared/schema";
import { fetchAllProjects } from "@/lib/firestore-service";

function formatCategory(cat: string) {
  if (cat === "structural") return "Structural Glazing";
  if (cat === "acp") return "ACP Cladding";
  if (cat === "semi_unitized") return "Semi-Unitized Glazing";
  if (cat === "spider") return "Spider Glazing System";
  return cat;
}

export function useProjects() {
  return useQuery({
    queryKey: [api.projects.list.path],
    queryFn: async () => {
      // Fetch backend seed projects
      const res = await fetch(api.projects.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch projects");
      const memoryProjects = api.projects.list.responses[200].parse(await res.json());

      try {
        // Fetch live uploads from Firestore
        const data = await fetchAllProjects();
        const liveProjects = data.map((img) => ({
          id: parseInt(img.id.replace(/\D/g, "").slice(0, 8) || "0", 10) + 10000,
          title: img.title || "Uploaded Project",
          description: `An exclusive ongoing project featuring ${formatCategory(img.category)}.`,
          category: formatCategory(img.category),
          imageUrl: img.image_url,
          featured: false,
          location: img.location || "Bangalore",
          firestoreId: img.id, // keep raw Firestore ID for deletes
        }));
        // Newest uploads first, then static seed data
        return [...liveProjects, ...memoryProjects];
      } catch (e) {
        console.error("Firestore live fetch failed:", e);
      }

      return memoryProjects;
    },
  });
}

export function useProject(id: number) {
  return useQuery({
    queryKey: [api.projects.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.projects.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch project");
      return api.projects.get.responses[200].parse(await res.json());
    },
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertProject) => {
      const res = await fetch(api.projects.create.path, {
        method: api.projects.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = await res.json();
          throw new Error(error.message || "Validation failed");
        }
        throw new Error("Failed to create project");
      }
      return api.projects.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.projects.list.path] });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & Partial<InsertProject>) => {
      const url = buildUrl(api.projects.update.path, { id });
      const res = await fetch(url, {
        method: api.projects.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to update project");
      return api.projects.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.projects.list.path] });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.projects.delete.path, { id });
      const res = await fetch(url, {
        method: api.projects.delete.method,
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to delete project");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.projects.list.path] });
    },
  });
}
