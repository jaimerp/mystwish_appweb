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

export const getMatchs = () => {
    return new Promise((resolve, reject) => {
        axios.get('matchs/matchs')
        .then (r => {
            resolve(r.data.matchs);
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

export const getInitials = (fullName) => {
    if (!fullName) return "?";
    const parts = fullName.split(" ");
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    } else {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
  };
  
  