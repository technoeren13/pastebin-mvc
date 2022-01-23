import mongoose from "mongoose";

export interface textDocument extends mongoose.Document {
  text: string;
  code: string;
}

const textSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    code: { type: String, required: true },

  },
  { timestamps: true }
);

const addTextModel = mongoose.model<textDocument>("Text", textSchema);

export default addTextModel