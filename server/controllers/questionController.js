import { Question } from "../models/question.js"

export const allQuestion = async (req, res) => {
    try {
        const question = await Question.find()
        res.status(200).json({ question: question, message: "Question fetched" })

    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
}


export const addQuestion = async (req, res) => {
    const { id, questionDescription } = req.body;
    try {
        console.log(id, questionDescription);
        const newQuestion = await Question.create({ userId: id, description: questionDescription });
        res.status(201).json({ question: newQuestion, message: "Question added successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}


export const addAnswer = async (req, res) => {
    try {
        const { qId, answerText, answeredBy } = req.body
        const question = await Question.findById(qId)
        console.log("answer", qId, answerText, answeredBy);
        question.answer.answeredBy = answeredBy
        question.answer.text = answerText
        await question.save()
        res.status(200).json({ message: "sucessfuly updated" })
    }
    catch (err) {
        res.status(500).json({ message: "internal server error" })
    }

}