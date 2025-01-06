import Cookies from 'js-cookie';

export const getLocalData = (key) => {
    return Cookies.get(key);
}

export const setLocalData = (key, value) => {
    Cookies.set(key, value);
}

export const removeLocalData = (key) => {
    Cookies.remove(key);
}
