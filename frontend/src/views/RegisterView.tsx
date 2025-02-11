import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { isAxiosError } from 'axios';
import { toast } from 'sonner'
import ErrorMessage from "../components/ErrorMessage";
import { RegisterForm } from "../types";
import api from "../config/axios";

function RegisterView() {
    

    const initialValues: RegisterForm = {
        name: '',
        email: '',
        handle: '',
        password: '',
        password_confirmation: ''
    }
    
    const { register, watch, handleSubmit, formState: { errors }} = useForm({ defaultValues: initialValues});
    
    const password = watch('password')

    const handleRegister = async ( formData : RegisterForm ) => {
        try {
            const { data } = await api.post(`/auth/register`, formData)
            toast.success(data)
        } catch (error) {
            if (isAxiosError(error))
                toast.error(error.response?.data.error)
        }
    }
    return (

        <>
            <h1 className="text-4xl text-white font-bold">Create Account</h1>
            <form
                onSubmit={handleSubmit(handleRegister)}
                className="bg-white px-5 py-20 rounded-lg space-y-10 mt-10"
            >
                <div className="grid grid-cols-1 space-y-3">
                    <label htmlFor="name" className="text-2xl text-slate-500">Name</label>
                    <input
                        id="name"
                        type="text"
                        placeholder="Your Name"
                        className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
                        {... register('name', {
                            required: "Name is Required"
                        })}
                    />
                    {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
                </div>
                <div className="grid grid-cols-1 space-y-3">
                    <label htmlFor="email" className="text-2xl text-slate-500">E-mail</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Email"
                        className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
                        {... register('email', {
                            required: "Email is Required",
                            pattern: {
                                value: /\S+@\S+\.\S+/,
                                message: "Invalid email",
                            },
                        })}
                    />
                    {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
                </div>
                <div className="grid grid-cols-1 space-y-3">
                    <label htmlFor="handle" className="text-2xl text-slate-500">Username</label>
                    <input
                        id="handle"
                        type="text"
                        placeholder="Username without spaces"
                        className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
                        {... register('handle', {
                            required: "Username is Required"
                        })}
                    />
                    {errors.handle && <ErrorMessage>{errors.handle.message}</ErrorMessage>}
                </div>
                <div className="grid grid-cols-1 space-y-3">
                    <label htmlFor="password" className="text-2xl text-slate-500">Password</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Password"
                        className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
                        {... register('password', {
                            required: "Password is Required",
                            minLength: {
                                value: 8,
                                message: 'Password too short'
                            }
                        })}
                    />
                    {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
                </div>

                <div className="grid grid-cols-1 space-y-3">
                    <label htmlFor="password_confirmation" className="text-2xl text-slate-500">Confirm Password</label>
                    <input
                        id="password_confirmation"
                        type="password"
                        placeholder="Confirm Password"
                        className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
                        {... register('password_confirmation', {
                            required: "Password Confirmatin Required",
                            validate: ( value ) => value == password || "Not matching passwords"
                        })}
                    />
                    {errors.password_confirmation && <ErrorMessage>{errors.password_confirmation.message}</ErrorMessage>}
                </div>

                <input
                    type="submit"
                    className="bg-cyan-400 p-3 text-lg w-full uppercase text-slate-600 rounded-lg font-bold cursor-pointer"
                    value='Create Account'
                />
            </form>
            <nav className="mt-10">
                <Link
                    className='text-center text-white block'
                    to="/auth/login">
                    Ya tienes cuenta? Inicia sesion
                </Link>
            </nav>
        </>
    );
}

export default RegisterView;