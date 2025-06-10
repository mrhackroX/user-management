export const roleMapping = {
  admin: {
    user: ['GET', 'POST', 'PATCH', 'DELETE'],
    role: ['GET', 'POST', 'PATCH', 'DELETE'],
  },
  editor: [],
  viewer: {},
};
