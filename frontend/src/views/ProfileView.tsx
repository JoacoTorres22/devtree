import { useForm } from 'react-hook-form'
import ErrorMessage from '../components/ErrorMessage'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { ProfileForm, User } from '../types'
import { updateUser, uploadImage } from '../api/DevTreweAPI'
import { toast } from 'sonner'
import { ChangeEvent } from 'react'

export default function ProfileView() {

    const queryClient = useQueryClient()
    const data: User = queryClient.getQueryData( ['user'] )!

    const { register, handleSubmit, formState: {errors}} = useForm<ProfileForm>({defaultValues: {
        handle: data.handle,
        description: data.description
    }})

    const updateProfileMutation = useMutation({
        mutationFn: updateUser,
        onError: (e) => {
            toast.error(e.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            queryClient.invalidateQueries({queryKey: ['user']})
        }
    })

    const uploadImageMutation = useMutation({
        mutationFn: uploadImage,
        onError: (e) => {
            toast.error(e.message)
        },
        onSuccess: (data) => {
            queryClient.setQueryData(['user'], (prevData: User) => {
                return {
                    ...prevData, 
                    image: data
                }
            }) 
        }
    })

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) 
            uploadImageMutation.mutate(e.target.files[0])
    }
    const handleUserProfileForm = (formData: ProfileForm) => {
        updateProfileMutation.mutate(formData)
    }
    return (
        <form 
            className="bg-white p-10 rounded-lg space-y-5"
            onSubmit={handleSubmit(handleUserProfileForm)}
        >
            <legend className="text-2xl text-slate-800 text-center">Edit Profile</legend>
            <div className="grid grid-cols-1 gap-2">
                <label
                    htmlFor="handle"
                >Username:</label>
                <input
                    type="text"
                    className="border-none bg-slate-100 rounded-lg p-2"
                    placeholder="Username"
                    {...register('handle', {
                        required: 'Username is required'
                    })}
                />
                {errors.handle && <ErrorMessage>{errors.handle.message}</ErrorMessage>}
            </div>

            <div className="grid grid-cols-1 gap-2">
                <label
                    htmlFor="description"
                >Description:</label>
                <textarea
                    className="border-none bg-slate-100 rounded-lg p-2"
                    placeholder="Your Description"
                    {...register('description')}
                />
            </div>

            <div className="grid grid-cols-1 gap-2">
                <label
                    htmlFor="handle"
                >Image:</label>
                <input
                    id="image"
                    type="file"
                    name="handle"
                    className="border-none bg-slate-100 rounded-lg p-2"
                    accept="image/*"
                    onChange={ handleChange }
                />
            </div>

            <input
                type="submit"
                className="bg-cyan-400 p-2 text-lg w-full uppercase text-slate-600 rounded-lg font-bold cursor-pointer"
                value='Save Changes'
            />
        </form>
    )
}