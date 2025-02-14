import { Router } from "express";
import { body } from 'express-validator'
import { createAccount, getUser, login, updateProfile } from "./handlers";
import { ExpressValidator } from "express-validator";
import { handleInputErrors } from "./middleware/validation";
import { authenticate } from "./middleware/auth";

const router = Router();

// Routing

router.get('/', (req, res) => {
    res.send('Hola Mundo en Express')
});

router.get('/ecommerce', (req ,res) => {
    res.send('Ecommerce')
})

router.get('/blog', (req ,res) => {
    res.send('blog')
})


// Autenticacion de registro 

router.post('/auth/register', 
    body('handle').
        notEmpty().withMessage('Handle cannot be empty'),
    body('name').
        notEmpty().withMessage('Name cannot be empty'),
    body('email').
        isEmail().withMessage('Invalid Email'),
    body('password').
        isLength({min: 8}).withMessage('Password too short'),
    handleInputErrors,
    createAccount)

router.post('/auth/login', 
    body('email').
        isEmail().withMessage('Invalid Email'),
    body('password').
        isLength({min: 8}).withMessage('Password is required'),
    handleInputErrors,
    login)

router.get('/user', authenticate, getUser)

router.patch('/user', 
    body('handle')
        .notEmpty()
        .withMessage('Handle cannot be empty'),
    body('description')
        .notEmpty()
        .withMessage('Description cannot be empty'),
    authenticate, 
    updateProfile)

export default router