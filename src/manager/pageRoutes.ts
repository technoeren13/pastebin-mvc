import { Request, Response, NextFunction, text } from 'express'
import addTextModel from '../database/text.models'
import { checkLength } from '../utils/checker'

export const indexPage = async (req: Request, res: Response) => {
    let alert: string | undefined
    let code: any

    let alertType: 'success' | 'error' | undefined

    if (req.query.alert === 'success') {
        alertType = 'success'
        alert = `Success: ${req.query.reason}`
    }

    if (req.query.alert === 'error') {
        alertType = 'error'
        alert = `Error: ${req.query.reason}`
    }

    res.render('index', { alert, alertType, code })
}

export const indexPost = async (req: Request, res: Response) => {
    let { textarea } = req.body

    if (checkLength(textarea)) return res.redirect(`/?alert=error&reason=${checkLength(textarea)}`)

    let code: string = Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, '')
        .substr(0, 10)

    const doc = new addTextModel({
        id: code,
        text: textarea,
    })
    await doc.save()

    res.redirect(`/text/${code}?alert=success&infoMessage=Text Successfuly Added.`)
}

export const textPage = async (req: Request, res: Response) => {
    let alert: string | undefined
    let alertType: 'success' | 'error' | undefined

    interface Text {
        id: string
        text: string | undefined
    }

    let textFromDb = await addTextModel.findOne({ id: req.params.code })

    let textInfo: Text = {
        id: req.params.code,
        text: textFromDb?.text,
    }

    if (textFromDb === null) {
        textInfo.id = 'N/A'
        alertType = 'error'
        alert = 'No text was found on the entered id.'
    }

    if (req.query.alert === 'success') {
        alertType = 'success'
        alert = `${req.query.infoMessage}`
    }

    res.render('textPage', { textInfo, alert, alertType })
}
