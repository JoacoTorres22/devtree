import { Request, Response } from "express";
import slug from 'slug'
import User from "../config/models/User"
import { hashPassword } from "../utils/auth";


export const createAccount = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body        
        
        // Check Email Exist
        const userExist = await User.findOne({ email });
        if (userExist) {
            res.status(409).json({ error: 'El usuario ya está registrado' });
            return
        }

        // Check Handle Exist
        const handle = slug(req.body.handle, '');
        const handleExist = await User.findOne({ handle });
        
        if (handleExist) {
            res.status(409).json({ error: 'Nombre de usuario no disponible' });
            return
        }
        
        // Change user data
        const user = new User(req.body);
        user.handle = handle
        user.password = await hashPassword(password)

        await user.save();

        res.status(201).send('Registro creado correctamente');

    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
