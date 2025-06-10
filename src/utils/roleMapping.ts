export const roleMapping = {
  admin: {
    user: ['GET', 'POST', 'PATCH', 'DELETE'],
    role: ['GET', 'POST', 'PATCH', 'DELETE'],
    document: ['GET', 'POST', 'PATCH', 'DELETE'],
  },
  editor: {
    document: ['GET', 'POST', 'PATCH'],
  },
  viewer: {
    user: ['GET'],
    document: ['GET'],
  },
};
