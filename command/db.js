import pkg from 'mongoose';
const { connect, connection, Schema, model } = pkg;

// Connect to MongoDB
connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  const db = connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  db.once('open', () => {
    console.log('Connected to MongoDB');  
  });
  
  // Define a schema for storing users
  const UserSchema = new Schema({
    chatId: { type: Number, required: true, unique: true },
    username: { type: String },
    firstName: String,
    lastName: String,
    isAdmin: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false }, 
  });

  const savedText = new Schema({
    id: { type: Number, required: true, unique: true },
    text: [{ text: String}], 
  });
  
  
  const User = model('User', UserSchema);
  const Message = model('Message', savedText);

export {db, User, Message};