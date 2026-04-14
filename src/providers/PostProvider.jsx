import { createContext, useContext, useState } from "react";

const PostContext = createContext(null);

export function PostProvider({ post, children }) {
    const [currentPost, setCurrentPost] = useState(post);

    const updatePost = (updatedData) => {
        setCurrentPost((prev) => ({ ...prev, ...updatedData }));
    };

    return (
        <PostContext.Provider value={{ post: currentPost, updatePost }}>
            {children}
        </PostContext.Provider>
    );
}

export function usePostContext() {
    return useContext(PostContext);
}
