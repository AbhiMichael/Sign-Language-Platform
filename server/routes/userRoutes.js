import express from "express";

import {
  allMentors,
  allStudents,
  allUser,
  deleteUser,
  findChat,
  getCourse,
  getNotifications,
  getNotificationsMentor,
  getUser,
  loginUser,
  selectmentor,
  sendChat,
  sendNotification,
  signUpUser,
  updateUser,
  uploadCourse,
} from "../controllers/userController.js";
import AuthMiddleWare from "../middleware/AuthMiddleware.js";
import { upload } from "../helpers/filehelper.js";

const userRoutes = express.Router();

userRoutes.post("/signup", signUpUser);
userRoutes.post("/login", loginUser);


userRoutes.get("/getUser", AuthMiddleWare, getUser);
userRoutes.get("/allstudents", allStudents);
userRoutes.get("/allmentors", allMentors);
userRoutes.post("/selectmentor", selectmentor);
userRoutes.post("/sendNotification", sendNotification);
userRoutes.get("/notifications/:studentId", getNotifications);
userRoutes.get("/mentor-notifications/:mentorId", getNotificationsMentor);
userRoutes.post("/chat/:sender/:reciever", findChat);
userRoutes.post("/chat/send", sendChat);






userRoutes.post("/uploadCourse", upload.single("thumbnail"), uploadCourse);
userRoutes.get("/getCourses/:deaf", getCourse);

userRoutes.get('/all', allUser)
userRoutes.delete("/user/:id", deleteUser)
userRoutes.put("/mentor/:id", updateUser)



export default userRoutes;
