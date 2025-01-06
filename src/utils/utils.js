import axios from '@/plugins/axios.js';

export const getNumMaxSecrets = () => {
    return new Promise((resolve, reject) => {
        axios.get('secrets/nummax')
        .then (r => {
            resolve(r.data.value);
        }).catch(e => {
            reject(e);
        })
    })
}

export const getSecrets = () => {
    return new Promise((resolve, reject) => {
        axios.get('secrets/secrets')
        .then (r => {
            resolve(r.data.secrets);
        }).catch(e => {
            reject(e);
        })
    })
}


export const getFans = () => {
    return new Promise((resolve, reject) => {
        axios.get('fans/fans')
        .then (r => {
            resolve(r.data.fans);
        }).catch(e => {
            reject(e);
        })
    })
}

export const logout = () => {
    return new Promise((resolve, reject) => {
        axios.post('auth/logout')
        .then (r => {
            resolve(r);
        }).catch(e => {
            reject(e);
        })
    })
}

