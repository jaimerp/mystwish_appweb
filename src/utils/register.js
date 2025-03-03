export const validateRegisterData = (userData) => {
  return {
    name: userData.name != '', 
    email: validateEmail(userData.email), 
    pass: validatePassword(userData.pass), 
    pass_confirm: userData.pass == userData.pass_confirm,
    policy: userData.policy ? true : false,
  };
}

const validateEmail = (email) => {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailPattern.test(email)) {
    return false;
  }
  return true;  
}

const validatePassword = (password) => {
  const passPattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
  if (!passPattern.test(password)) {
    return false;
  }
  return true;  
}

// export const sendPhoneCode = () => {
//     return new Promise((resolve, reject) => {
//         axios.get('/register/phone')
//         .then(r => {
//             resolve (r);
//         }).catch(e => {
//             reject(e)
//         })
//     })
// }