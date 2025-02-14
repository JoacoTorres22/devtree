import { useQuery } from "@tanstack/react-query";
import { getUser } from "../api/DevTreweAPI";
import { Navigate } from "react-router-dom";
import DevTree from "../components/DevTree";

export default function AppLayout() {
    const { data, isLoading, isError } = useQuery({
        queryFn: getUser, 
        queryKey: ['user'],
        retry: 1,
        refetchOnWindowFocus: false
    })
    if (isLoading) return 'Loading...'
    if (isError) return <Navigate to='/auth/login'/>
    console.log(data)
    if (data) return <DevTree data={data}/>
}