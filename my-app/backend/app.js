const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const { sequelize } = require('./models');
const patientRoutes = require('./routes/patientRoutes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());
app.use(express.json());
app.use('/api', patientRoutes);

io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

sequelize.sync().then(() => {
  server.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
});
