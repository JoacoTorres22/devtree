import { Link } from "react-router-dom";


export default function LoginView() {
    return ( 
        <>
            <h1 className="text-4xl text-white font-bold">Iniciar Sesion</h1>
            <nav className="mt-10">
                <Link 
                className= 'text-center text-white block'
                to="/auth/register">
                    No tienes cuenta? Registrate aquí
                </Link>
            </nav>
        </>

     );

}