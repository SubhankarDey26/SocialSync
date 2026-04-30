import { useEffect } from "react";
import { usePost } from "../hooks/usePost";
import Post from "../components/Post"


const Feed = () => {

  const {feed,handleGetFeed,loading }=usePost()

  useEffect(()=>{
    handleGetFeed()
  },[])

  if(loading || !feed)
  {
    return (<main><h1>Feed is Loading...</h1></main>)
  }
  console.log(feed)
  return (
    <div className="feed-page">
      <Post/>
    </div>
    
  );
};

export default Feed;