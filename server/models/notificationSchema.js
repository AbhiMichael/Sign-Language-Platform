import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'userModel', required: true },
  mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'userModel', required: true },
  roomId: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const Notification = mongoose.model('Notification', notificationSchema);



