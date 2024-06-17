const express = require('express');

const initHotel = () => {
  const router = express.Router();

  router.post('/booking', (req, res) => {
    const { guestName, roomNumber, checkInDate, checkOutDate } = req.body;
    // Handle booking logic
    res.send('Booking confirmed');
  });

  router.get('/rooms', (req, res) => {
    // Retrieve available rooms logic
    res.send('List of available rooms');
  });

  module.exports = router;
};

module.exports = { initHotel };
