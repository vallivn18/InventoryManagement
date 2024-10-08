const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  imageUrl: { type: String },
});

const Inventory = mongoose.model('Inventory', inventorySchema);
module.exports = Inventory;
