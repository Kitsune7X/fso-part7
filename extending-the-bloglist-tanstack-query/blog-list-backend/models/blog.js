import mongoose from 'mongoose';
const { Schema } = mongoose;

const commentSchema = new Schema({
  comment: String,
});

const blogSchema = new Schema({
  title: {
    type: String,
    minLength: 3,
    required: [true, 'Title missing'],
  },
  author: {
    type: String,
    minLength: 3,
    required: [true, 'Author missing'],
  },
  url: {
    type: String,
    required: [true, 'Link missing'],
  },
  likes: Number,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  comments: {
    type: [commentSchema],
    required: false,
  },
});

// ---------- Reformat the output to be nicer ----------
blogSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
