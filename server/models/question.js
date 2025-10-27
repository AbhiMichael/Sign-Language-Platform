import mongoose from "mongoose";

// Define the Question schema
const questionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    description: {
        type: String,
        required: true
    },

    answer: {
        text: {
            type: String
        },
        answeredBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create the Question model
export const Question = mongoose.model('Question', questionSchema);


