export const save = (darkMode: boolean) => {
    localStorage.setItem(`darkMode`, darkMode.toString());
}

export const restore = (): boolean => {
    const darkMode = localStorage.getItem(`darkMode`);
    return darkMode ? darkMode === 'true' : false;
}