const express = require('express');
const multer = require('multer');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// Multer setup for image uploading
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './public/uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// Get all items
router.get('/', inventoryController.getAllItems);

// Add an item
router.post('/add', upload.single('image'), inventoryController.addItem);

// Edit and update an item
router.put('/edit/:id', upload.single('image'), inventoryController.updateItem);

// Delete an item
router.delete('/delete/:id', inventoryController.deleteItem);

module.exports = router;
