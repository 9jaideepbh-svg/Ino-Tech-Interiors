// ─────────────────────────────────────────────────────────────────────────────
// Firestore Services – INOTECH Interiors
// All project data lives in the "projects" collection.
// ─────────────────────────────────────────────────────────────────────────────
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export interface ProjectImage {
  id: string;
  title: string;
  category: string;
  location: string;
  image_url: string;
  created_at?: any;
}

const COLLECTION = "project_images";

/** Fetch all project images ordered newest first */
export async function fetchAllProjects(): Promise<ProjectImage[]> {
  const q = query(collection(db, COLLECTION), orderBy("created_at", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ProjectImage));
}

/** Add a new project image document to Firestore */
export async function addProject(data: {
  title: string;
  category: string;
  location: string;
  image_url: string;
}): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...data,
    created_at: serverTimestamp(),
  });
  return docRef.id;
}

/** Delete a project document from Firestore */
export async function deleteProject(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}
