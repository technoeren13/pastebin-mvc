import mongoose from 'mongoose'

export interface textDocument extends mongoose.Document {
    text: string
    id: string
}

const textSchema = new mongoose.Schema(
    {
        text: { type: String, required: true },
        id: { type: String, required: true },
    },
    { timestamps: true },
)

const addTextModel = mongoose.model<textDocument>('Text', textSchema)

export default addTextModel
