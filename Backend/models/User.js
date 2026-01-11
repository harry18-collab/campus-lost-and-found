let users = [];

export { users };

export const createUser = (userData) => {
  const user = { id: Date.now(), ...userData, createdAt: new Date() };
  users.push(user);
  return user;
};

export const findUserByEmail = (email) => {
  return users.find(user => user.email === email);
};

export const findUserById = (id) => {
  return users.find(user => user.id === id);
};

export const getAllUsers = () => users;
