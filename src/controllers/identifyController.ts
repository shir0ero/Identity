import { Request, Response } from "express";
import { identifyContact } from "../services/contactService";

export async function identify(req: Request, res: Response) {
  try {
    const { email, phoneNumber } = req.body;
    const result = await identifyContact(email, phoneNumber);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}
