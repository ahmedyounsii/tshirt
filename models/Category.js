const mongoose = require("mongoose");
const { Schema } = mongoose;

const DesignCategorySchema = new Schema({
  label: { type: String, required: true },
  designs: [{ type: Schema.Types.ObjectId, ref: "Design" }], // references to Design documents
});

const DesignCategory = mongoose.model("DesignCategory", DesignCategorySchema);

module.exports = DesignCategory;
