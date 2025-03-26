import mongoose from "mongoose";
import pkg from "mongoose";
const {  Schema, model } = pkg;


const db =  async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, );
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

// Define a schema for storing users
const UserSchema = new Schema({
  chatId: { type: Number, required: true, unique: true },
  username: { type: String },
  firstName: String,
  lastName: String,
  isAdmin: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
});

const User = model("User", UserSchema);

export { db, User };
