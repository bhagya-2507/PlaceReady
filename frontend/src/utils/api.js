// utils/api.js – frontend API bridge (pure React, no Python)
// ---------------------------------------------------------------
// Health check (placeholder – always reports healthy)
export async function checkHealth() {
  return { status: "healthy", model_loaded: true, runtime: "React / JavaScript Engine (No Python Required)" };
}

// -----------------------------------------------------------------
// Backend authentication endpoints (Node.js + MongoDB)
// Ensure the backend server is running at http://localhost:5000
const API_BASE = "http://localhost:5000/api/auth";

/** Register a new account */
export async function registerAccount({ name, email, password, role }) {
  const res = await fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, role }),
  });
  return res.json();
}

/** Login with existing credentials */
export async function loginAccount({ email, password }) {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

/** Get current user data (protected) */
export async function fetchMe(token) {
  const res = await fetch(`${API_BASE}/me`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

// -----------------------------------------------------------------
// Stub functions for the old JavaScript‑only simulation (kept for backward compatibility)
export async function getRoles() {
  return [];
}
export async function getRoleDetails(roleId) {
  return {};
}
export async function extractResume(file) {
  return {};
}
export async function getSampleResumes() {
  return [];
}
export async function getSampleResumeData(sampleId) {
  return {};
}
export async function analyzeReadiness(payload) {
  return {};
}
export async function simulateOutcome(payload) {
  return {};
}
export async function getModelTelemetry() {
  return {};
}
