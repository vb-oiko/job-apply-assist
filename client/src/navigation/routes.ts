export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  POSITIONS: {
    LIST: '/positions',
    CREATE: '/positions/create',
    EDIT: (id: string) => `/positions/${id}`,
  },
} as const;

export type Routes = typeof ROUTES;
