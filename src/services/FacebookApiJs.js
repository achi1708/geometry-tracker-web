const promises = {
    init: () => {
        return new Promise((resolve, reject) => {
            if (typeof FB !== 'undefined') {
                resolve();
            } else {
                window.fbAsyncInit = () => {
                    FB.init({
                        appId      : process.env.REACT_APP_FB_APP_ID,
                        cookie     : true, 
                        xfbml      : true,  
                        version    : 'v10.0'
                    });
                    resolve();
                };
                (function(d, s, id) {
                    var js, fjs = d.getElementsByTagName(s)[0];
                    if (d.getElementById(id)) return;
                    js = d.createElement(s); js.id = id;
                    js.src = "https://connect.facebook.net/en_US/sdk.js";
                    fjs.parentNode.insertBefore(js, fjs);
                }(document, 'script', 'facebook-jssdk'));
            }
        });
    },
    checkLoginState: () => {
        return new Promise((resolve, reject) => {
            FB.getLoginStatus((response) => {
                response.status === 'connected' ? resolve(response) : reject(response);
            });
        });
    },
    login: () => {
        return new Promise((resolve, reject) => {
            FB.login((response) => {
                response.status === 'connected' ? resolve(response) : reject(response);
            });
        });
    },
    logout: () => {
        return new Promise((resolve, reject) => {
            FB.logout((response) => {
                response.authResponse ? resolve(response) : reject(response);
            });
        });
    }
};

export const FacebookApiHandle = {
    doLogin() {
        promises.init()
                .then(
                    promises.checkLoginState,
                    error => { throw error; }
                )
                .then((response) => {
                    console.log("proceso doLogin");
                    console.log("LLEGA DESPUES DE CHECKLOGINSTATE");
                    console.log(response);
                })
                .catch((error) => { 
                    console.log("ERROR DOLOGIN");
                    console.log(error);
                });
    },
    checkStatus() {
        promises.init()
                .then(
                    promises.checkLoginState,
                    error => { throw error; }
                )
                .then((response) => {
                    console.log("proceso checkStatus");
                    console.log("LLEGA DESPUES DE CHECKLOGINSTATE");
                    console.log(response);
                })
                .catch((error) => { 
                    console.log("ERROR checkStatus");
                    console.log(error);
                });
    }
};

export default FacebookApiHandle;