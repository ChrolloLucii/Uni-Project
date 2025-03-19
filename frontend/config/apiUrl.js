export const getApiUrl = (isClient = typeof window !== 'undefined') => {
  if (isClient) {
    // For browser requests (from user's machine)
    return process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
  }
  
  // For server-side requests (Next.js API routes in Docker)
  // Use the service name which Docker DNS will resolve correctly
  return 'http://localhost:4000';
};