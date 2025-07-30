const express = require('express');
const router = express.Router();
const Room = require('../models/Room');

// Get all rooms
router.get('/', async (req, res) => {
  const rooms = await Room.find();
  res.json(rooms);
});

// Add a new room
router.post('/', async (req, res) => {
  const room = new Room(req.body);
  await room.save();
  res.json(room);
});

// Add a bed to a room
// router.post('/:roomNo/bed', async (req, res) => {
//   const { roomNo } = req.params;
//   const { bedNo, category, price } = req.body;

//   try {
//     if (!bedNo || !category || !price) {
//       return res.status(400).json({ message: 'Missing bedNo, category, or price' });
//     }

//     const room = await Room.findOne({ roomNo });
//     if (!room) return res.status(404).json({ message: 'Room not found' });

//     const exists = room.beds.some(bed => bed.bedNo === bedNo);
//     if (exists) {
//       return res.status(400).json({ message: 'Bed number already exists in this room' });
//     }

//     room.beds.push({ bedNo, category, price });
//     await room.save();
//     res.json({ message: 'Bed added successfully', room });
//   } catch (err) {
//     console.error("Error adding bed:", err);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// Update bed price
// router.put('/:roomNo/bed/:bedNo', async (req, res) => {
//   const { roomNo, bedNo } = req.params;
//   const { price } = req.body;

//   try {
//     const room = await Room.findOne({ roomNo });
//     if (!room) return res.status(404).json({ message: 'Room not found' });

//     const bed = room.beds.find(b => b.bedNo === bedNo);
//     if (!bed) return res.status(404).json({ message: 'Bed not found' });

//     bed.price = price;
//     await room.save();
//     res.json(bed);
//   } catch (err) {
//     console.error("Error updating bed price:", err);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

module.exports = router;
