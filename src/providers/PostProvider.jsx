/* eslint-disable react-refresh/only-export-components */
// Contexto local que encapsula el estado de un único post.
// Permite que PostLikeButton y PostCommentButton lean y actualicen el post
// sin necesidad de pasar props a mano por cada nivel del árbol.
import { createContext, useContext, useState, useEffect } from "react";

const PostContext = createContext(null);

export function PostProvider({ post, children, onUpdate }) {
  const [currentPost, setCurrentPost] = useState(post);

  // Cuando el post que viene del padre cambia (por ejemplo, después de un refresh global),
  // sincronizamos el estado local para que la UI muestre los datos más recientes.
  useEffect(() => {
    setCurrentPost(post);
  }, [post]);

  // Actualización parcial: solo sobreescribe los campos recibidos, el resto se conserva.
  // onUpdate propaga el cambio hacia arriba hasta DataProvider para mantener el estado global coherente.
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
