import {getFeed} from  "../services/post.api"
import { useContext } from "react"
import {postContext} from "../post.context"

export const usePost=()=>{

    const context=useContext(postContext)
    const {loading,setloading,feed,setfeed,post,setpost}=context

    const handleGetFeed=async()=>{
        setloading(true)
        const data=await getFeed()
        setfeed(data.posts)
        setloading(false)
    }

    return {loading,feed,post,handleGetFeed}
}