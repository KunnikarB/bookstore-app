// List of admin emails - should match backend config
export const ADMIN_EMAILS = [
  'admin@bookstore.com'
];

export function isAdmin(email?: string | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email);
}
