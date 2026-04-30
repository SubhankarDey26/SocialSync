import { createContext,useState } from "react";


export const postContext=createContext()



export const postContextProvider=({children})=>{
    const [loading, setloading] = useState(false)
    const [post, setpost] = useState(null)
    const [feed, setfeed] = useState(null)


    return(
        <postContest.Provider value={{loading,setloading,feed,setfeed,post,setpost}}>
            {children}
        </postContest.Provider>
    )
}