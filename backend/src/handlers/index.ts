import { Request, Response } from "express";
import slug from 'slug'
import { validationResult } from "express-validator";
import formidable from 'formidable';
import { v4 as uuid } from 'uuid'
import User from "../config/models/User"
import { checkPassword, hashPassword } from "../utils/auth";
import { generateJWT } from "../utils/jwt";
import cloudinary from "../config/cloudinary";


export const createAccount = async (req: Request, res: Response): Promise<void> => {
    try {
        // Error manager
        let errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).json({errors: errors.array()})
            return
        }
        
        const { email, password } = req.body        

        // Check Email Exist
        const userExist = await User.findOne({ email });
        if (userExist) {
            res.status(409).json({ error: 'User Already Exist' });
            return
        }

        // Check Handle Exist
        const handle = slug(req.body.handle, '');
        const handleExist = await User.findOne({ handle });
        
        if (handleExist) {
            res.status(409).json({ error: 'Username not available' });
            return
        }
        
        // Change user data
        const user = new User(req.body);
        user.handle = handle
        user.password = await hashPassword(password)

        await user.save();

        res.status(201).send('User Created');

    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const login = async (req: Request, res: Response) => {

    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({errors: errors.array()})
        return
    }

    // Check Email
    const { email, password } = req.body        
    const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return
    }

    // Check Password
    const correctPass = await checkPassword(password, user.password)
    if (!correctPass) {
        const error = new Error('Invalid Password')
        res.status(401).json({error: error.message})
        return
    }
    const token = generateJWT({id: user.id})
    res.send(token)
    return
}

export const getUser = async (req: Request, res: Response) => {
    console.log(req.user) 
    res.send(req.user)
}


export const updateProfile = async (req: Request, res: Response) => {
    try {
        const { description, links } = req.body
        // Check Handle Exist
        const handle = slug(req.body.handle, '');
        const handleExist = await User.findOne({ handle });
        
        if (handleExist && handleExist.email !== req.user.email) {
            res.status(409).json({ error: 'Username not available' });
            return
        }
        // Update User
        req.user.description = description
        req.user.handle = handle
        req.user.links = links
        await req.user.save()
        res.send('Profile updated')

    } catch (e) {
        const error = new Error('Error Ocurred')
        res.status(500).json({errpr: error.message})
        return 
    }
}

export const uploadImage = async (req: Request, res: Response) => {
    try {
        const form = formidable({
            multiples: false            
        })
        form.parse(req, (error, fields, files) => {
            if (files)
                console.log(files.image[0].filepath)
                cloudinary.uploader.upload(files.image[0].filepath, {public_id: uuid()}, async function (error, result) {
                    if (error) {
                        const error = new Error('Error Ocurred')
                        res.status(500).json({errpr: error.message})
                        return 
                    }
                    if (result) {
                        req.user.image = result.secure_url
                        await req.user.save()
                        res.json({image: result.secure_url})
                    }
                })

        })
    } catch (e) {
        const error = new Error('Error Ocurred')
        res.status(500).json({errpr: error.message})
        return 
        
    }


}

export const getUserByHandle = async (req: Request, res: Response) => {

    try {
        const { handle } = req.params
        const user = await User.findOne({handle}).select('-_id -__v -email -password')

        if (!user) {
            const error = new Error('User does not exist')
            res.status(404).json({error: error.message})
            return
        } else {
            res.json(user)
        }

    } catch (e) {
        const error = new Error('Error Ocurred')
        res.status(500).json({errpr: error.message})
        return 
        
    }

}


export const searchByHandle = async (req: Request, res: Response) => {
    try {
        const { handle } = req.body
        const userExist = await User.findOne({handle})
        if (userExist) {
            const error = new Error(`${handle} already used`)
            res.status(409).json({error: error.message})
            return 
        }
        res.send(`${handle} is available`)
    } catch (e) {
        const error = new Error('Error Ocurred')
        res.status(500).json({errpr: error.message})
        return 
        
    }
}