import { Request, Response, NextFunction, text } from 'express'
import addTextModel from '../database/text.models'
import { checkLength } from '../utils/checker'

interface AddNewTextInterfaces {
    id: string
    text: string | undefined,
    addedDate: any | undefined,
}


interface GetTextInterfaces {
    id: string
    text: string | undefined,
    addedDate: string | undefined,
    views: number | undefined
}

interface AlertInfoInterfaces {
    alertType: 'success' | 'error' | undefined,
    alert: string | undefined;
}

const createCode = () => {
    let code: string = Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, '').substr(0, 10)
    return code
}

// Add Text Page
export const indexPage = async (req: Request, res: Response) => {

    let alertInfo: AlertInfoInterfaces = {
        alertType: undefined,
        alert: undefined,
    }

    if (req.query.alert === 'success') {
        alertInfo.alertType = 'success'
        alertInfo.alert = `Success: ${req.query.reason}`
    }

    if (req.query.alert === 'error') {
        alertInfo.alertType = 'error'
        alertInfo.alert = `Error: ${req.query.reason}`
    }

    res.render('index', { alertInfo })
}

// New Text Added Post
export const indexPost = async (req: Request, res: Response) => {
    const { textarea } = req.body;
    const code: string = createCode()

    if (checkLength(textarea)) return res.redirect(`/?alert=error&reason=${checkLength(textarea)}`)

    const doc = new addTextModel<AddNewTextInterfaces>({
        id: code,
        text: textarea,
        addedDate: new Date()
    })
    await doc.save()

    res.redirect(`/text/${code}?alert=success&infoMessage=Text Successfuly Added.`)
}

export const textPage = async (req: Request, res: Response) => {

    let textFromDb = await addTextModel.findOne({ id: req.params.code })

    let date = textFromDb?.addedDate.toString().substr(4, 11)


    let alertInfo: AlertInfoInterfaces = {
        alertType: undefined,
        alert: undefined,
    }

    let textInfo: GetTextInterfaces = {
        id: req.params.code,
        text: textFromDb?.text,
        addedDate: `${date?.slice(3, 6)} ${date?.slice(0, 3)} ${date?.slice(9)}`,
        views: textFromDb?.views
    }

    if (textFromDb === null) {
        textInfo.id = 'N/A'
        textInfo.addedDate = 'N/A'
        textInfo.views = 0
        alertInfo.alertType = 'error'
        alertInfo.alert = 'No text was found on the entered id.'
    }

    if (req.query.alert === 'success') {
        alertInfo.alertType = 'success'
        alertInfo.alert = `${req.query.infoMessage}`
    }

    await textFromDb?.updateOne({ $inc: { views: +1 } })


    res.render('textPage', { textInfo, alertInfo })
}


export const editTextPage = async (req: Request, res: Response) => {

    let textFromDb = await addTextModel.findOne({ id: req.params.code })

    if (textFromDb === null) {
        res.redirect(`/text/${req.params.code}?alert=error&infoMessage=No text was found on the entered id.`)
        return;
    }

    let textInfo: AddNewTextInterfaces = {
        id: req.params.code,
        text: textFromDb?.text,
        addedDate: Date.now(),
    }

    res.render('editPage', { textInfo })
}

export const editTextPagePost = async (req: Request, res: Response) => {
    const { textarea } = req.body
    const code: string = createCode()

    if (checkLength(textarea)) return res.redirect(`/text/?alert=error&reason=${checkLength(textarea)}`)

    const doc = new addTextModel<AddNewTextInterfaces>({
        id: code,
        text: textarea,
        addedDate: new Date()
    })
    await doc.save()

    res.redirect(`/text/${code}?alert=success&infoMessage=Text Successfuly Edited.`)
}
