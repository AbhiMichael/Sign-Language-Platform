import express from "express";
import mongoose from "mongoose";
import { addAnswer, addQuestion, allQuestion } from "../controllers/questionController.js"
import jwt from 'jsonwebtoken';
import { userModel } from "../models/userModel.js";


const router = express.Router();

router.get("/all", allQuestion)
router.post("/addQuestion", addQuestion)
router.post("/addAnswer", addAnswer)

let WT_SECRET = process.env.WT_SECRET;


const resultSchema = new mongoose.Schema({
    student: String,
    question: String,
    answer: String,
    result: String,
    date: { type: Date, default: Date.now }
  });


const Result = mongoose.model('Result', resultSchema);

router.post('/profile', (req, res) => {
  const token = req.body.token;

  if (!token) {
    return res.status(401).json({ message: 'Authorization token is required.' });
  }

    // Verify the token synchronously
    const decodedToken = jwt.verify(token, WT_SECRET);
    const studentId = decodedToken.email; // Assuming student ID is stored in the token


    console.log("profile",studentId);
    // Fetch profile
    userModel.findOne({ email: studentId })
      .then(profile => {

        console.log("finded profile",profile);

        if (!profile) {
          throw new Error('Profile not found.');
        }

        // Fetch results
       Result.find({ student: profile.email }).then(results=>{
        res.status(200).json({ profile, results });
       })
      })
      .catch(error => {
        res.status(400).json({ message: error.message });
      });
  
});


// for students profiles

router.post('/profile/:id', (req, res) => {
  const id = req.params.id

    // Verify the token synchronously


    // Fetch profile
    userModel.findOne({ _id: id })
      .then(profile => {

        console.log("finded profile",profile);

        if (!profile) {
          throw new Error('Profile not found.');
        }

        // Fetch results
       Result.find({ student: profile.email }).then(results=>{
        res.status(200).json({ profile, results });
       })
      })
      .catch(error => {
        res.status(400).json({ message: error.message });
      });
  
});







router.post('/results', (req, res) => {
  const token = req.body.token; // Assuming token is sent in the Authorization header
  
  if (!token) {
    return res.status(401).json({ message: 'Authorization token is required.' });
  }

  try {
    // Verify and decode the token to extract the student ID
    const decodedToken = jwt.verify(token, WT_SECRET);
    const studentId = decodedToken.email; // Assuming student ID is stored in the token

    // Create and save the result with the extracted student ID
    const result = new Result({
      student: studentId,
      question: req.body.question,
      answer: req.body.answer,
      result: req.body.result
    });

    result.save()
      .then(result => {
        res.status(201).json(result);
      })
      .catch(error => {
        res.status(400).json({ message: error.message });
      });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});




export default router