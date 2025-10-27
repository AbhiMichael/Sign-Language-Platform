import mongoose from "mongoose";

const courseSchema = mongoose.Schema({
  title: {
    type: String,
  }
  ,
  file: {
    type: String,
  },
  url: {
    type: String,
  },
  audio: {
    type: Boolean,
  }
});

export const courseModels = mongoose.model("COURSE", courseSchema);
