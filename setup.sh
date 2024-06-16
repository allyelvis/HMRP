#!/bin/bash

# Set up directories
mkdir -p my-app/backend my-app/frontend

# Backend setup
cd my-app/backend

# Initialize npm and install dependencies
npm init -y
npm install express sequelize sequelize-cli pg pg-hstore mysql2 socket.io cors

# Initialize Sequelize
npx sequelize-cli init

# Create backend directory structure
mkdir -p controllers models routes services

# Generate Sequelize model for Patient
cat <<EOL > models/patient.js
module.exports = (sequelize, DataTypes) => {
  const Patient = sequelize.define('Patient', {
    name: DataTypes.STRING,
    age: DataTypes.INTEGER,
    address: DataTypes.STRING,
    phone: DataTypes.STRING,
  });
  return Patient;
};
EOL

# Create Patient controller
cat <<EOL > controllers/patientController.js
const { Patient } = require('../models');

exports.createPatient = async (req, res) => {
  const patient = await Patient.create(req.body);
  req.app.io.emit('patientCreated', patient);
  res.status(201).json(patient);
};

exports.getPatients = async (req, res) => {
  const patients = await Patient.findAll();
  res.status(200).json(patients);
};
EOL

# Create Patient routes
cat <<EOL > routes/patientRoutes.js
const express = require('express');
const { createPatient, getPatients } = require('../controllers/patientController');
const router = express.Router();

router.post('/patients', createPatient);
router.get('/patients', getPatients);

module.exports = router;
EOL

# Create app.js
cat <<EOL > app.js
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
EOL

# Create Dockerfile for backend
cat <<EOL > Dockerfile
FROM node:14
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "app.js"]
EOL

# Frontend setup
cd ../frontend

# Initialize Nuxt app
npx create-nuxt-app . --answers "{\"name\":\"frontend\",\"pm\":\"npm\",\"ui\":\"none\",\"server\":\"none\",\"features\":[],\"linter\":[],\"test\":\"none\",\"mode\":\"universal\",\"language\":\"js\"}"

# Configure Axios
cat <<EOL >> nuxt.config.js
export default {
  modules: ['@nuxtjs/axios'],
  axios: {
    baseURL: 'http://localhost:3000/api',
  },
};
EOL

# Create Vuex store for patients
mkdir -p store
cat <<EOL > store/patient.js
export const state = () => ({
  patients: [],
});

export const mutations = {
  setPatients(state, patients) {
    state.patients = patients;
  },
};

export const actions = {
  async fetchPatients({ commit }) {
    const { data } = await this.\$axios.get('/patients');
    commit('setPatients', data);
  },
};
EOL

# Create patients page
mkdir -p pages
cat <<EOL > pages/patients.vue
<template>
  <div>
    <h1>Patients</h1>
    <ul>
      <li v-for="patient in patients" :key="patient.id">{{ patient.name }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  async asyncData({ store }) {
    await store.dispatch('patient/fetchPatients');
  },
  computed: {
    patients() {
      return this.\$store.state.patient.patients;
    },
  },
};
</script>
EOL

# Create Socket.io plugin
mkdir -p plugins
cat <<EOL > plugins/socket.io.js
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

export default ({ app }, inject) => {
  inject('socket', socket);
};
EOL

# Update nuxt.config.js to include the plugin
sed -i "/export default {/a \\  plugins: ['~/plugins/socket.io.js']," nuxt.config.js

# Create Dockerfile for frontend
cat <<EOL > Dockerfile
FROM node:14
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]
EOL

# Return to the root directory and create Docker Compose file
cd ../..

# Create Docker Compose file
cat <<EOL > docker-compose.yml
version: '3'
services:
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    depends_on:
      - db
  frontend:
    build: ./frontend
    ports:
      - "3001:3000"
  db:
    image: postgres
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: mydatabase
    volumes:
      - db_data:/var/lib/postgresql/data

volumes:
  db_data:
EOL

# Done
echo "Setup complete. Use 'docker-compose up' to start the services."