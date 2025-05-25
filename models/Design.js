const mongoose = require("mongoose");
const { Schema } = mongoose;

const DesignSchema = new Schema({
  url: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  tag: {
    type: [String],
  },
});

const Design = mongoose.model("Design", DesignSchema);

module.exports = Design;
