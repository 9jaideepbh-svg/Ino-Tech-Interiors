import { projects, type Project, type InsertProject } from "@shared/schema";

export interface IStorage {
  getProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<void>;
}

let idCounter = 1;

export class MemStorage implements IStorage {
  private projects: Map<number, Project> = new Map();

  async getProjects(): Promise<Project[]> {
    // Only return in-memory seed projects.
    // Live uploaded projects are fetched directly from Supabase on the client side.
    return Array.from(this.projects.values());
  }

  async getProject(id: number): Promise<Project | undefined> {
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
