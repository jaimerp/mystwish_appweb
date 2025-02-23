// const setupIntlTelInput = async (lang, input) => {
//     try {
//       const { [lang]: i18n } = await import(`intl-tel-input/i18n`);
//       return intlTelInput(input, {
//         i18n,
//         nationalMode: true,
//         separateDialCode: true,
//         initialCountry: "auto",
//         strictMode: true,
//         geoIpLookup: function (success, failure) {
//           fetch("https://ipapi.co/json")
//             .then((res) => res.json())
//             .then((data) => success(data.country_code))
//             .catch(() => failure());
//         },
//         loadUtils: () => import("intl-tel-input/utils"),
//       });


//     } catch (error) {
//       console.error(`Error al cargar las traducciones para ${lang}:`, error);
//     }
// };

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