import { createContext, useState } from "react";

export const postContext = createContext();

export const PostContextProvider = ({ children }) => {
  const [loading, setloading] = useState(false);
  const [post, setpost] = useState(null);
  const [feed, setfeed] = useState(null);

  return (
    <postContext.Provider value={{ loading, setloading, feed, setfeed, post, setpost }}>
      {children}
    </postContext.Provider>
  );
};