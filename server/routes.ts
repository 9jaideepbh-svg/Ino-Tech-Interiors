import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Set up Replit Auth first
  await setupAuth(app);
  registerAuthRoutes(app);

  app.get(api.projects.list.path, async (req, res) => {
    const projects = await storage.getProjects();
    res.json(projects);
  });

  app.get(api.projects.get.path, async (req, res) => {
    const project = await storage.getProject(Number(req.params.id));
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  });

  app.post(api.projects.create.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.projects.create.input.parse(req.body);
      const project = await storage.createProject(input);
      res.status(201).json(project);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
        return;
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put(api.projects.update.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.projects.update.input.parse(req.body);
      const project = await storage.updateProject(Number(req.params.id), input);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
        return;
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete(api.projects.delete.path, isAuthenticated, async (req, res) => {
    await storage.deleteProject(Number(req.params.id));
    res.status(204).send();
  });

  // Web3Forms API endpoint proxy
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, phone, message } = req.body;
      if (!name || !email || !phone || !message) {
        return res.status(400).json({ success: false, message: "Please fill out all required fields." });
      }

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          access_key: "5b66c193-553b-4c2a-ba73-7f80f22c393b",
          subject: "New Contact Inquiry - INOTECH Interiors",
          from_name: "Inotech Interiors Website",
          name,
          email,
          phone,
          message,
        }),
      });

      const data = await response.json();
      return res.json(data);
    } catch (err: any) {
      console.error("Web3Forms Submission Error:", err);
      return res.status(500).json({
        success: false,
        message: err.message || "Failed to submit message to server.",
      });
    }
  });

  // Seed data function
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existing = await storage.getProjects();
  if (existing.length === 0) {
    const seedProjects = [
      {
        title: "Hindustan Aeronautics Limited (HAL)",
        description: "Large-scale structural glazing and aluminum cladding project for HAL's administrative facility.",
        category: "Structural Glazing",
        imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80",
        featured: true,
        location: "Bangalore"
      },
      {
        title: "City Civil Court",
        description: "Modern facade work involving extensive ACP cladding and high-performance glazing.",
        category: "ACP Cladding",
        imageUrl: "https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&q=80",
        featured: true,
        location: "Bangalore"
      },
      {
        title: "Chief Minister's Residential House",
        description: "Premium architectural aluminum work and secure glazing systems for high-profile residence.",
        category: "Structural Glazing",
        imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80",
        featured: true,
        location: "Bangalore"
      },
      {
        title: "Jyothi Institute of Technology",
        description: "Educational campus facade modernization with semi-unitized glazing systems.",
        category: "Semi-Unitized Glazing",
        imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80",
        featured: true,
        location: "Bangalore"
      },
      {
        title: "ITC Project",
        description: "Luxury hotel facade incorporating spider glazing systems for maximum transparency.",
        category: "Spider Glazing System",
        imageUrl: "https://images.unsplash.com/photo-1582037928769-181f242afcf8?auto=format&fit=crop&q=80",
        featured: true,
        location: "Bangalore"
      }
    ];

    for (const p of seedProjects) {
      await storage.createProject(p);
    }
    console.log("Database seeded with initial projects.");
  }
}
