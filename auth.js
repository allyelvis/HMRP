// modules/auth.js

// Simulated database of users (for demo purposes)
const users = [
  { id: 1, username: 'john', password: 'password1' },
  { id: 2, username: 'jane', password: 'password2' }
];

function authenticate(username, password) {
  const user = users.find(u => u.username === username && u.password === password);
  return user ? user : null;
}

module.exports = {
  authenticate
};
