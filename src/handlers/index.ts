import User from "../config/models/User"
import { Request, Response } from "express";
import { hashPassword } from "../utils/auth";


export const createAccount = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body        
        const userExist = await User.findOne({ email });

        if (userExist) {
            res.status(409).json({ error: 'El usuario ya está registrado' });
        }

        const user = new User(req.body);
        user.password = await hashPassword(password)
        await user.save();

        res.status(201).send('Registro creado correctamente');
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
