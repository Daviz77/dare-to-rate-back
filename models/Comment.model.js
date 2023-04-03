const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      minlength: 50,
      maxlength: 300,
    },

    active: {
      type: Boolean,
      default: true,
    },

    },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;