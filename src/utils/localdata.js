//import Cookies from 'js-cookie';
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';

// export const getLocalData = (key) => {
//     return Cookies.get(key);
// }

// export const setLocalData = (key, value) => {
//     Cookies.set(key, value);
// }

// export const removeLocalData = (key) => {
//     Cookies.remove(key);
// }

export const getLocalData = async (key) => {
    if (Capacitor.isNativePlatform()) {
        const { value } = await Preferences.get({ key });

        if (value === "true") return true;
        if (value === "false") return false;

        return value;
    }
    return localStorage.getItem(key);
};

export const setLocalData = async (key, value) => {
    if (Capacitor.isNativePlatform()) {
        await Preferences.set({ key, value });
    } else {
        localStorage.setItem(key, value);
    }
}

export const removeLocalData = async (key) => {
    if (Capacitor.isNativePlatform()) {
        await Preferences.remove({ key });
    } else {
        localStorage.removeItem(key);
    }
}