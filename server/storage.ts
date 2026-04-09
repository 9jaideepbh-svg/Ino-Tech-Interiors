import { projects, type Project, type InsertProject } from "@shared/schema";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://bfotzjkiymcplnatgxzv.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmb3R6amtpeW1jcGxuYXRneHp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2NDIyODksImV4cCI6MjA5MTIxODI4OX0.hKMDHaFqbtOnF9rOt1mHoPLJTO2oUzeOoNILvPl-6Gk';
const supabase = createClient(supabaseUrl, supabaseKey);

export interface IStorage {
  getProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<void>;
}

let idCounter = 1;

function formatCategory(cat: string) {
  if (cat === 'structural') return "Structural Glazing";
  if (cat === 'acp') return "ACP Cladding";
  if (cat === 'semi_unitized') return "Semi-Unitized Glazing";
  if (cat === 'spider') return "Spider Glazing System";
  return cat;
}

export class MemStorage implements IStorage {
  private projects: Map<number, Project> = new Map();

  async getProjects(): Promise<Project[]> {
    const memoryProjects = Array.from(this.projects.values());
    
    try {
      const { data, error } = await supabase.from('project_images').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        const liveProjects = data.map((img: any) => ({
          id: 10000 + img.id,
          title: `Uploaded Project #${img.id}`,
          description: `An exclusive ongoing project featuring ${formatCategory(img.category)}.`,
          category: formatCategory(img.category),
          imageUrl: img.image_url,
          featured: false,
          location: "Bangalore"
        } as Project));
        
        return [...liveProjects, ...memoryProjects];
      }
    } catch (e) {
      console.error("Supabase fetch failed", e);
    }
    
    return memoryProjects;
  }

  async getProject(id: number): Promise<Project | undefined> {
    if (id >= 10000) {
      // It's from Supabase! Fetch it
      const realId = id - 10000;
      const { data } = await supabase.from('project_images').select('*').eq('id', realId).single();
      if (data) {
        return {
          id: id,
          title: `Uploaded Project #${data.id}`,
          description: `An exclusive ongoing project featuring ${formatCategory(data.category)}.`,
          category: formatCategory(data.category),
          imageUrl: data.image_url,
          featured: false,
          location: "Bangalore"
        } as Project;
      }
    }
    return this.projects.get(id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const project: Project = { ...insertProject, id: idCounter++ } as Project;
    this.projects.set(project.id, project);
    return project;
  }

  async updateProject(id: number, updateData: Partial<InsertProject>): Promise<Project | undefined> {
    const existing = this.projects.get(id);
    if (!existing) return undefined;
    const project = { ...existing, ...updateData };
    this.projects.set(id, project);
    return project;
  }

  async deleteProject(id: number): Promise<void> {
    this.projects.delete(id);
  }
}

export const storage = new MemStorage();
