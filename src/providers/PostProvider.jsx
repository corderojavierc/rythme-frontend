import { createContext, useContext, useState } from "react";

const PostContext = createContext(null);

export function PostProvider({ post, children, onUpdate }) {
    const [currentPost, setCurrentPost] = useState(post);

    const updatePost = (updatedData) => {
        const newData = { ...currentPost, ...updatedData };
        setCurrentPost(newData);
        if (onUpdate) onUpdate(newData);
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
