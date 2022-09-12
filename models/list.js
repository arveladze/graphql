const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const ItemSchema = new mongoose.Schema({
    index: { type: Number, required: true },
    title: { type: String, require: true, trim: true },
    category: { type: String, trim: true },
    strike: Boolean,
  });
  
  const ListSchema = new Schema(
    {
      name: { type: String, required: true, trim: true },
      items: [ItemSchema]
    },
    { collection: 'lists' }
  );

  module.exports = mongoose.model('List', ListSchema);