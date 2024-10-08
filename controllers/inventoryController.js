const path = require('path');
const fs = require('fs');
const Inventory = require('../models/inventoryModel');


// Get all inventory items
exports.getAllItems = async (req, res) => {
  try {
    const items = await Inventory.find();
    res.render('view_index', { items });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// Add a new inventory item
exports.addItem = async (req, res) => {
  try {
    const { productId, name, price, quantity } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';
    const newItem = new Inventory({ productId, name, price, quantity, imageUrl });
    await newItem.save();
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// Update an inventory item
exports.updateItem = async (req, res) => {
  try {
    const { productId, name, price, quantity } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl;
    const item = await Inventory.findByIdAndUpdate(req.params.id, { productId, name, price, quantity, imageUrl }, { new: true });
    res.json({ message: 'Item updated successfully', imageUrl: item.imageUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};



// Delete an inventory item
exports.deleteItem = async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);

    if (item) {
      // Remove the image file from the uploads folder
      const imagePath = path.join(__dirname, '..', 'public', item.imageUrl);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error('Error deleting image:', err);
        }
      });

      // Delete the item from the database
      await Inventory.findByIdAndDelete(req.params.id);
      res.json({ success: true });
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};