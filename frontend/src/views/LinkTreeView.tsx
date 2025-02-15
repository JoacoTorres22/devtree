import { ChangeEvent, useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { social } from '../data/social'
import DevTreeInput from "../components/DevTreeInput";
import { isValidURL } from "../utils";
import { toast } from "sonner";
import { updateUser } from "../api/DevTreweAPI";
import { User } from "../types";

export default function LinkTreeView() {
    const [devTreeLinks, setDevTreeLinks] = useState(social)
    const queryClient = useQueryClient()
    const user : User = queryClient.getQueryData(['user'])!
    
    
    const { mutate } = useMutation({
        mutationFn: updateUser,
        onError: (e) => {
            toast.error(e.message)
        },
        onSuccess: (data) => {
            console.log(data)
            toast.success('Updated')
        }
    })
        
    useEffect(() => {
        const updatedData = devTreeLinks.map( item => {
            const userLink = JSON.parse(user.links).find((link: { name: string; }) => link.name === item.name)
            if (userLink) {
                return {...item, url: userLink.url, enabled: userLink.enabled}
            }
            return item
        })
        setDevTreeLinks(updatedData)
    }, [])

    const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
        const updatedLinks = devTreeLinks.map(link => link.name === e.target.name ? {...link, url: e.target.value} : link)
        setDevTreeLinks(updatedLinks)
        queryClient.setQueryData(['user'], (prevData: User) => {
            return {
                ...prevData, 
                links: JSON.stringify(updatedLinks)
            }
        })
    }

    const handleEnableLink = (socialNetwork: string) => {
        console.log(socialNetwork)
        const updatedLinks = devTreeLinks.map(link => {
            if (link.name === socialNetwork)
                if (isValidURL(link.url))
                return {...link, enabled: !link.enabled}
            else {
                toast.error('InvalidURL')
            }
            return link
        })
        setDevTreeLinks(updatedLinks)
        queryClient.setQueryData(['user'], (prevData: User) => {
            return {
                ...prevData, 
                links: JSON.stringify(updatedLinks)
            }
        })
    }

    return ( 
        <div className="space-y-5">
            {devTreeLinks.map(item => (
                <DevTreeInput 
                key={item.name}
                item={item}
                handleUrlChange= {handleUrlChange}
                handleEnableLink= {handleEnableLink}
                />
            ))}
            <button
            className="bg-cyan-400 p-2 text-lg uppercase w-full text-slate-600 rounded-lg font-bold"
            onClick={() => mutate(user)}
            >Save Changes</button>
        </div>
     );
}
 
