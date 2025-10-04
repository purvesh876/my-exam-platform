import mongoose from "mongoose";

export const connectDB = async () => {
  const uri = process.env.MONGO_DB_URL;
  if (!uri) throw new Error("MONGO_URI not set");
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("MongoDB connected");
};
