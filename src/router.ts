import { Router } from "express";
import { createAccount } from "./handlers";

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

router.post('/auth/register', createAccount)

export default router