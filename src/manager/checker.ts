
import {Request, Response, NextFunction, text} from "express";



export const checkLength = (text: string): boolean | string => {

 if(!text.trim()) return "No text has been added."

 return false

}