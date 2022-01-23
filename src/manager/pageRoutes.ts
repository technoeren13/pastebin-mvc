import {Request, Response, NextFunction, text} from "express";
import addTextModel from "../database/text.models";
import { checkLength } from "./checker";

export const indexPage = async (req:Request,res:Response) => {

    let alert: string | undefined;
    let code: any;

    let alertType: "success" | "error" | undefined

  
    if(req.query.alert === "success") {
      alertType = "success"
       alert = "Text successful added."
      }

      if(req.query.alert === "error") {
        alertType = "error"
        alert = "Text not added."
       }
 
       if(req.query.code) {
         
        code = await addTextModel.findOne({ code: req.query.code})

       }


    res.render("index", { alert, alertType, code  });
};



export const textPage = async (req:Request,res:Response) => {

  let code: string = req.params.code;
 

  res.render("text", { code });
};



export const indexPost = async(req:Request,res:Response) => {
    let { textarea } = req.body;

    if(checkLength(textarea)) return res.redirect("/?alert=error")

 
     const createCode = (): string => {

      let code: string = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10);

      return code
     }
   
     

    const doc = new addTextModel({
        code: createCode(),
        text: textarea,
      });
      await doc.save();  
 


    res.redirect(`/text/${createCode()}`)

};


