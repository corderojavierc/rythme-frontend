import { useEffect, useState } from "react";

export function useTheme() {
    const [isLight, setIsLight] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");

        if (savedTheme === "light") {
            setIsLight(true);
            document.body.classList.add("light");
        } else {
            setIsLight(false);
            document.body.classList.remove("light");
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = !isLight;
        setIsLight(newTheme);

        if (newTheme) {
            document.body.classList.add("light");
            localStorage.setItem("theme", "light");
        } else {
            document.body.classList.remove("light");
            localStorage.setItem("theme", "dark");
        }
    };

    return { isLight, toggleTheme };
}
