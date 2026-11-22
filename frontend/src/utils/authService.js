/**
 * Unified Authentication & Profile Service for PlaceReady Portal
 * - Works standalone via LocalStorage (zero network crash guarantee)
 * - Ensures newly registered students start with 0% score until they upload a verified PDF resume
 */

import { INITIAL_STUDENTS, DEMO_TEACHER } from "../data/portalData";

const STORAGE_USERS_KEY = "placeready_registered_users";
const STORAGE_SESSION_KEY = "placeready_active_session";

// Initialize default users if not present
function getStoredUsers() {
  try {
    const data = localStorage.getItem(STORAGE_USERS_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Failed to parse stored users", e);
  }

  // Pre-seeded Students (for quick evaluation demo)
  const defaultUsers = [
    ...INITIAL_STUDENTS.map((s) => ({
      ...s,
      role: "student",
      password: "password123",
      resumeUploaded: true,
      resumeFileName: `${s.name.replace(/\s+/g, "_")}_Resume.pdf`,
    })),
    // Pre-seeded Teacher
    {
      id: "teacher-1",
      ...DEMO_TEACHER,
      role: "teacher",
      password: "password123",
    },
  ];

  localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(defaultUsers));
  return defaultUsers;
}

function saveUsers(users) {
  try {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error("Failed to save users", e);
  }
}

/**
 * Register a new user
 * New students start strictly with 0% readiness and NO resume!
 */
export async function registerUser({ name, email, password, role, branch, roll, cgpa }) {
  const users = getStoredUsers();
  const normalizedEmail = email.trim().toLowerCase();

  // Check if email already registered
  const existing = users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (existing) {
    return { success: false, message: "This email is already registered. Please sign in instead." };
  }

  const newId = `user-${Date.now()}`;
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}&background=6366f1&color=fff&size=200&bold=true`;

  let newUser;

  if (role === "student") {
    newUser = {
      id: newId,
      name: name.trim(),
      email: normalizedEmail,
      password: password,
      role: "student",
      roll: roll ? roll.trim().toUpperCase() : `22CSE${Math.floor(100 + Math.random() * 900)}`,
      branch: branch || "Computer Science (CSE)",
      cgpa: cgpa ? parseFloat(cgpa) : 7.5,
      avatar: avatarUrl,
      // Fresh new students start with EMPTY profile until they upload a verified resume!
      skills: [],
      targetRole: "sde",
      internships: 0,
      projects: 0,
      dsaSolved: 0,
      placed: false,
      placedCompany: null,
      appliedJobIds: [],
      resumeUploaded: false,
      resumeFileName: null,
      resumeUploadedAt: null,
    };
  } else {
    newUser = {
      id: newId,
      name: name.trim(),
      email: normalizedEmail,
      password: password,
      role: "teacher",
      title: "Assistant Professor & Placement Coordinator",
      department: branch || "Computer Science & Engineering",
      avatar: avatarUrl,
    };
  }

  users.push(newUser);
  saveUsers(users);

  // Auto-login session
  saveSession(newUser);

  return { success: true, user: newUser };
}

/**
 * Sign In
 */
export async function loginUser({ email, password, role }) {
  const users = getStoredUsers();
  const normalizedEmail = email.trim().toLowerCase();

  const found = users.find(
    (u) => u.email.toLowerCase() === normalizedEmail && u.password === password
  );

  if (!found) {
    return {
      success: false,
      message: "Invalid email or password. Please check your credentials.",
    };
  }

  saveSession(found);
  return { success: true, user: found };
}

/**
 * Quick 1-Click Demo Login
 */
export function getDemoUser(role = "student") {
  const users = getStoredUsers();
  if (role === "teacher") {
    const teacher = users.find((u) => u.role === "teacher") || DEMO_TEACHER;
    saveSession(teacher);
    return teacher;
  } else {
    const student = users.find((u) => u.role === "student") || INITIAL_STUDENTS[0];
    saveSession(student);
    return student;
  }
}

/**
 * Save Active Session
 */
export function saveSession(user) {
  try {
    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(user));
  } catch (e) {
    console.error("Failed to save session", e);
  }
}

/**
 * Get Current Active Session
 */
export function getActiveSession() {
  try {
    const data = localStorage.getItem(STORAGE_SESSION_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Failed to read session", e);
  }
  return null;
}

/**
 * Sign Out
 */
export function clearSession() {
  try {
    localStorage.removeItem(STORAGE_SESSION_KEY);
  } catch (e) {
    console.error("Failed to clear session", e);
  }
}

/**
 * Update User Record
 */
export function updateUserRecord(updatedUser) {
  const users = getStoredUsers();
  const idx = users.findIndex((u) => u.id === updatedUser.id);
  if (idx !== -1) {
    users[idx] = updatedUser;
    saveUsers(users);
  }
  saveSession(updatedUser);
  return users;
}
