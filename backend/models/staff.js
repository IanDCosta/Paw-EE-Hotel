const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: "staff",
  },
  state: {
    type: String,
    enum: {
      values: ["Active", "Inactive"],
    },
    default: "Active",
  },
});

module.exports = mongoose.model("Staff", staffSchema);
