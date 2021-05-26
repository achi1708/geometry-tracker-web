import httpInstance from './Apiservice';

const Auth = {
    dataAuthenticated: false,

    async isAuthenticated () {
        this.dataAuthenticated = false;
        let self = this;
        let token = this.getTkn();
        let resp_f = false;

        if(!token){
            console.log("no existe token cargado");
            return {resp: resp_f};
        }else{
            let req = await httpInstance.get('user')
                        .then(function(response){
                            if(response.data && response.status == 200){
                                if(response.data.id){
                                    self.dataAuthenticated = response.data;
                                    resp_f = true;
                                }
                            }

                            return true;
                        })
                        .catch(function(error){
                            console.log(error);
                            resp_f = false;

                            return false;
                        });

            return {resp: resp_f};
        }
    },

    async doLogin (formData) {

        let self = this;
        let status = false;
        let msg = [];

        let req = await httpInstance.post('login', formData)
                    .then(function(response){
                        if(response.data && response.status == 200){
                            if(response.data.token){
                                self.setTkn(response.data.token);
                                status = true;
                                msg = ['Login successful'];
                            }else{
                                self.deleteTkn();
                                status = false;
                                msg = ['Ocurrió un error al hacer el login, por favor intente de nuevo.'];
                            }
                        }else{
                            self.deleteTkn();
                            status = false;
                            if(response.data.errors && response.data.errors[0] != 'Unauthorized'){
                                msg = response.data.errors;
                            }else if(response.data.errors && response.data.errors[0] == 'Unauthorized'){
                                msg = ['Asegurese de contar con credenciales validas'];
                            }else{
                                msg = ['Ocurrió un error al hacer el login, por favor intente de nuevo.'];
                            }
                        }

                        return true;
                    })
                    .catch(function(error){
                        self.deleteTkn();
                        status = false;
                        if(error.response.data.errors && error.response.data.errors[0] != 'Unauthorized'){
                            msg = error.response.data.errors;
                        }else if(error.response.data.errors && error.response.data.errors[0] == 'Unauthorized'){
                            msg = ['Asegurese de contar con credenciales validas'];
                        }else{
                            msg = ['Ocurrió un error al hacer el login, por favor intente de nuevo.'];
                        }

                        return false;
                    });

        return {status: status, msg: msg };
    },

    setTkn (tkn) {
        localStorage.setItem('tkn', tkn);
    },

    getTkn () {
        return localStorage.getItem('tkn');
    },

    deleteTkn () {
        localStorage.removeItem('tkn');
    }
}

export default Auth;