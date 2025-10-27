// Import required modules
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import cors from "cors";
import path from "path";
import bodyParser from "body-parser";
import { createServer } from "http";
import { Server } from "socket.io"; // Correct import for ES Modules
import { userModel } from "./models/userModel.js";
import bcrypt from "bcrypt";

dotenv.config();

// Create an Express application
const app = express();
const server = createServer(app);

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

//for accepting json data
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Define a basic route
app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

app.use("/", userRoutes);
app.use("/question", questionRoutes);
app.use("/uploads", express.static(path.join("uploads")));

// WebSocket Logic
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", ({ roomId }) => {
    console.log("User joined room:", roomId);
    socket.join(roomId);
    socket.to(roomId).emit("user-joined", { peerId: socket.id });
  });

  socket.on("offer", ({ roomId, offer, target }) => {
    io.to(target).emit("receive-offer", { senderId: socket.id, offer });
  });

  socket.on("answer", ({ roomId, answer, target }) => {
    io.to(target).emit("receive-answer", { senderId: socket.id, answer });
  });

  socket.on("ice-candidate", ({ roomId, candidate, target }) => {
    io.to(target).emit("receive-ice-candidate", {
      senderId: socket.id,
      candidate,
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
const port = 5000; // You can change this to your desired port

// Connect to the MongoDB database
mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("Connected to the database");

    // Check if an admin already exists
    const existingAdmin = await userModel.findOne({ email: "admin6@gmail.com" });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("1234", 10); // Hash the password

      const adminUser = new userModel({
        email: "admin6@gmail.com",
        password: hashedPassword,
        Role: "admin",
        name: "Admin User",
        phone: "1234567890",
        address: "Admin Address",
      });

      await adminUser.save();
      console.log("Hardcoded admin registered successfully");
    } else {
      console.log("Admin already exists");
    }
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
