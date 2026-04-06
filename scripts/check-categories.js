import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const CategorySchema = new mongoose.Schema({
  name: String,
  slug: String,
  type: String
});

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const cats = await Category.find({});
  console.log(JSON.stringify(cats, null, 2));
  await mongoose.connection.close();
}

run();
