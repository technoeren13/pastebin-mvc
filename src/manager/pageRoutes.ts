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
        .replace(/[^a-z]+/g, '').substr(0, 10)


    interface Text {
        id: string
        text: string | undefined,
        addedDate: any | undefined,
    }


    const doc = new addTextModel<Text>({
        id: code,
        text: textarea,
        addedDate: new Date()
    })
    await doc.save()

    res.redirect(`/text/${code}?alert=success&infoMessage=Text Successfuly Added.`)
}

export const textPage = async (req: Request, res: Response) => {
    let alert: string | undefined
    let alertType: 'success' | 'error' | undefined

    interface Text {
        id: string
        text: string | undefined,
        addedDate: string | undefined,
        views: number | undefined
    }

    let textFromDb = await addTextModel.findOne({ id: req.params.code })

    let date = textFromDb?.addedDate.toString().substr(4, 11)


    let textInfo: Text = {
        id: req.params.code,
        text: textFromDb?.text,
        addedDate: `${date?.slice(3, 6)} ${date?.slice(0, 3)} ${date?.slice(9)}`,
        views: textFromDb?.views
    }

    if (textFromDb === null) {
        textInfo.id = 'N/A'
        textInfo.addedDate = 'N/A'
        textInfo.views = 0
        alertType = 'error'
        alert = 'No text was found on the entered id.'
    }

    if (req.query.alert === 'success') {
        alertType = 'success'
        alert = `${req.query.infoMessage}`
    }

    await textFromDb?.updateOne({ $inc: { views: +1 } })


    res.render('textPage', { textInfo, alert, alertType })
}


export const editTextPage = async (req: Request, res: Response) => {

    interface Text {
        id: string
        text: string | undefined,
    }

    let textFromDb = await addTextModel.findOne({ id: req.params.code })

    if (textFromDb === null) {
        res.redirect(`/text/${req.params.code}?alert=error&infoMessage=No text was found on the entered id.`)
        return;
    }


    let textInfo: Text = {
        id: req.params.code,
        text: textFromDb?.text,
    }

    res.render('editPage', { textInfo })
}

export const editTextPagePost = async (req: Request, res: Response) => {

    let { textarea } = req.body

    if (checkLength(textarea)) return res.redirect(`/text/?alert=error&reason=${checkLength(textarea)}`)

    let code: string = Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, '').substr(0, 10)


    interface Text {
        id: string
        text: string | undefined,
        addedDate: any | undefined,
    }


    const doc = new addTextModel<Text>({
        id: code,
        text: textarea,
        addedDate: new Date()
    })
    await doc.save()

    res.redirect(`/text/${code}?alert=success&infoMessage=Text Successfuly Edited.`)
}
