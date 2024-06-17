const express = require('express');
const cors = require('cors');
const http = require('http');
const { sequelize } = require('./models');
const patientRoutes = require('./routes/patientRoutes');

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use('/api', patientRoutes);

sequelize.sync().then(() => {
  server.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
});
