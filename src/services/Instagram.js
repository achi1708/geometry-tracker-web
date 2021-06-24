import httpInstance from './Apiservice';
import FacebookMessageLinkModal from './../components/elements/facebook/FacebookMessageLinkModal';
import InstagramMediaInsightsLinkModal from './../components/elements/instagram/InstagramMediaInsightsLinkModal';
import {Link} from 'react-router-dom';

const Instagram = {

    async getInstagramListAdm (page = 1, setOrder = {}, empresaId) {
        let self = this;
        let status = false;
        let msg = [];
        let paramsGet = {};
        paramsGet.emp = empresaId;
        paramsGet.page = page;
        if(setOrder.name){
            paramsGet.orderCol = setOrder.name;
        }

        if(setOrder.direction){
            paramsGet.orderDir = setOrder.direction;
        }

        let req = await httpInstance.get(`instagram/instagram_media`, {params: paramsGet})
                    .then(function(response){
                        if(response.data && response.status == 200){
                            status = true;
                            msg = response.data;
                        }else{
                            status = false;
                            if(response.data.errors){
                                msg = response.data.errors;
                            }else{
                                msg = ['ERROR_LIST'];
                            }
                        }

                        return true;
                    })
                    .catch(function(error){
                        status = false;
                        if(error.response.data.errors){
                            msg = error.response.data.errors;
                        }else{
                            msg = ['ERROR_LIST'];
                        }

                        return false;
                    });
        return {status: status, msg: msg };
    },

    async downloadInstagramInfo (empresa, proceso) {
        let self = this;
        let status = false;
        let resp_data = false;

        let req = await httpInstance.get(`instagram/${proceso}/${empresa}`, {responseType: 'blob'})
                            .then(function(response){
                                const url = window.URL.createObjectURL(new Blob([response.data]));
                                console.log("RESPONSE");
                                console.log(url);
                                status = true;
                                resp_data = url;

                                return true;
                            })
                            .catch(function(error){
                                console.log("ERRORORRRR");
                                console.log(error);
                                status = false;
                                resp_data = false;

                                return false;
                            });

        return {status: status, resp_data: resp_data };
    }, 

    async readInstagramInfo (params) {

        let self = this;
        let status = false;
        let msg = [];
        let resp_data = false;

        let req = await httpInstance.post('instagram/readIgData', params)
                    .then(function(response){
                        console.log(response);
                        resp_data = response;
                        if(response.data && (response.status == 200 || response.status == 201)){
                            status = true;
                            msg = ['ok'];
                        }else{
                            status = false;
                            if(response.data.errors){
                                msg = response.data.errors;
                            }else{
                                msg = ['Error'];
                            }
                        }

                        return true;
                    })
                    .catch(function(error){
                        status = false;
                        resp_data = error.response;
                        if(error.response.data.errors){
                            msg = error.response.data.errors;
                        }else{
                            msg = ['Error'];
                        }

                        return false;
                    });
        return {status: status, msg: msg, resp_data: resp_data };
    },

    instagramMediaDatatableColumns: [
        {
            name: 'media_url',
            label: 'Imagen',
            options: {
                filter: false,
                sort: false,
                empty: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    if(value){
                        if(value.indexOf('.jpg') !== -1 || value.indexOf('.png') !== -1){
                            return (
                                <img style={{width: '3em'}} src={`${value}`} />
                            );
                        }else{
                            return('');
                        }
                    }else{
                        return('');
                    }
                }
            }
        },
        {
            name: 'caption',
            label: 'Mensaje',
            options: {
                filter: false,
                sort: false,
                empty: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    if(value){
                        return (
                            <div>
                                {value.substr(0, 30)}
                                {(value.length > 30) ? 
                                <span>
                                    ...
                                    <FacebookMessageLinkModal key={tableMeta.rowIndex} bodytext={value} />
                                </span>
                                : ''}
                            </div>
                        );
                    }else{
                        return('');
                    }
                }
            }
        },
        {
            name: 'comments_count',
            label: 'Comments Count',
            options: {
                sort: false
            }
        },
        {
            name: 'like_count',
            label: 'Likes Count',
            options: {
                sort: false
            }
        },
        {
            name: 'media_product_type',
            label: 'Tipo',
            options: {
                sort: false
            }
        },
        {
            name: 'insights',
            label: 'Insights',
            options: {
                filter: false,
                sort: false,
                empty: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    if(value){
                        if(value.length > 0){
                            return (
                                <div>
                                   <InstagramMediaInsightsLinkModal key={tableMeta.rowIndex} insights={value} />
                                </div>
                            );
                        }else{
                            return('No se registraron insights');    
                        }
                    }else{
                        return('No se registraron insights');
                    }
                }
            }
        },
        {
            name: 'timestamp',
            label: 'Fecha Creación',
            options: {
                sort: true
            }
        }
    ]
}

export default Instagram;