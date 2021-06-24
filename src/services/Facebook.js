import httpInstance from './Apiservice';
import FacebookMessageLinkModal from './../components/elements/facebook/FacebookMessageLinkModal';
import FacebookInsightsLinkModal from './../components/elements/facebook/FacebookInsightsLinkModal';
import FacebookAdsInsightsLinkModal from './../components/elements/facebook/FacebookAdsInsightsLinkModal';
import {Link} from 'react-router-dom';

const Facebook = {

    async getPublishedPostsListAdm (page = 1, setOrder = {}, empresaId) {
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

        let req = await httpInstance.get(`facebook/published_posts`, {params: paramsGet})
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

    async getPageInsightsListAdm (/*page = 1, setOrder = {},*/ empresaId) {
        let self = this;
        let status = false;
        let msg = [];
        let paramsGet = {};
        paramsGet.emp = empresaId;
        /*paramsGet.page = page;
        if(setOrder.name){
            paramsGet.orderCol = setOrder.name;
        }

        if(setOrder.direction){
            paramsGet.orderDir = setOrder.direction;
        }*/

        let req = await httpInstance.get(`facebook/page_insights`, {params: paramsGet})
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

    async getAdAccountsListAdm (page = 1, setOrder = {}, empresaId) {
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

        let req = await httpInstance.get(`facebook/emp_adaccounts`, {params: paramsGet})
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

    async getAdCampaignsListAdm (page = 1, setOrder = {}, adAccountId) {
        let self = this;
        let status = false;
        let msg = [];
        let paramsGet = {};
        paramsGet.adacc = adAccountId;
        paramsGet.page = page;
        if(setOrder.name){
            paramsGet.orderCol = setOrder.name;
        }

        if(setOrder.direction){
            paramsGet.orderDir = setOrder.direction;
        }

        let req = await httpInstance.get(`facebook/emp_campaigns`, {params: paramsGet})
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

    async getAdAdsListAdm (page = 1, setOrder = {}, adCampaignId) {
        let self = this;
        let status = false;
        let msg = [];
        let paramsGet = {};
        paramsGet.adcamp = adCampaignId;
        paramsGet.page = page;
        if(setOrder.name){
            paramsGet.orderCol = setOrder.name;
        }

        if(setOrder.direction){
            paramsGet.orderDir = setOrder.direction;
        }

        let req = await httpInstance.get(`facebook/emp_ads`, {params: paramsGet})
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

    async readFacebookInfo (params) {

        let self = this;
        let status = false;
        let msg = [];
        let resp_data = false;

        let req = await httpInstance.post('facebook/readFbData', params)
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

    async downloadFacebookInfo (empresa, proceso) {
        let self = this;
        let status = false;
        let resp_data = false;

        let req = await httpInstance.get(`facebook/${proceso}/${empresa}`, {responseType: 'blob'})
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

    publishedPostsDatatableColumns: [
        {
            name: 'imagen',
            label: 'Imagen',
            options: {
                filter: false,
                sort: false,
                empty: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    if(value){
                        return (
                            <img style={{width: '3em'}} src={`${value}`} />
                        );
                    }else{
                        return('');
                    }
                }
            }
        },
        {
            name: 'mensaje',
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
            name: 'reach',
            label: 'Reach',
            options: {
                sort: false
            }
        },
        {
            name: 'engagement',
            label: 'Engagement',
            options: {
                sort: false
            }
        },
        {
            name: 'likes',
            label: 'Likes',
            options: {
                sort: false
            }
        },
        {
            name: 'expirado',
            label: 'Expirado',
            options: {
                sort: false
            }
        },
        {
            name: 'oculto',
            label: 'Oculto',
            options: {
                sort: false
            }
        },
        {
            name: 'popular',
            label: 'Popular',
            options: {
                sort: false
            }
        },
        {
            name: 'publicado',
            label: 'Publicado',
            options: {
                sort: false
            }
        },
        {
            name: 'tags',
            label: 'Tags',
            options: {
                filter: false,
                sort: false,
                empty: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    if(value){
                        return (
                            <div>
                                {value.join(' - ')}
                            </div>
                        );
                    }else{
                        return('');
                    }
                }
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
                                   <FacebookInsightsLinkModal key={tableMeta.rowIndex} insights={value} />
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
            name: 'fecha_creacion',
            label: 'Fecha Creación',
            options: {
                sort: true
            }
        }
    ],

    pageInsightsDatatableColumns: [
        {
            name: 'metric',
            label: 'Metrica',
            options: {
                sort: false
            }
        },
        {
            name: 'metric_date',
            label: 'Fecha Metrica',
            options: {
                sort: true
            }
        },
        {
            name: 'metric_value',
            label: 'Valor Metrica',
            options: {
                sort: true
            }
        }
    ],

    adAccountsDatatableColumns: [
        {
            name: 'account_name',
            label: 'Nombre Cuenta',
            options: {
                sort: false
            }
        },
        {
            name: "acciones",
            label: 'Acciones',
            options: {
              filter: false,
              sort: false,
              empty: true,
              customBodyRender: (value, tableMeta, updateValue) => {
                if(value){
                    return (
                        <Link className="btn btn-info btn-sm" to={`${process.env.REACT_APP_ROUTER_PREFIX}${value}`}>
                            Ver Campaigns
                        </Link>
                    );
                }else{
                    return('');
                }
              }
            }
        }
    ],

    adCampaignsDatatableColumns: [
        {
            name: 'campaign_name',
            label: 'Nombre Campaña',
            options: {
                setCellProps: () => ({ style: { minWidth: "250px", maxWidth: "300px" }}),
                sort: false
            }
        },
        {
            name: 'objective',
            label: 'Objetivo',
            options: {
                sort: false
            }
        },
        {
            name: 'status',
            label: 'Estado',
            options: {
                sort: false
            }
        },
        {
            name: 'budget_remaining',
            label: 'Budget Restante',
            options: {
                sort: false
            }
        },
        {
            name: 'buying_type',
            label: 'Tipo Budget',
            options: {
                sort: false
            }
        },
        {
            name: 'configured_status',
            label: 'Estado Configurado',
            options: {
                sort: false
            }
        },
        {
            name: 'daily_budget',
            label: 'Budget Diario',
            options: {
                sort: false
            }
        },
        {
            name: 'created_time',
            label: 'Creado en Facebook',
            options: {
                sort: false
            }
        },
        {
            name: 'start_time',
            label: 'Comienza',
            options: {
                sort: false
            }
        },
        {
            name: 'stop_time',
            label: 'Termina o se detiene',
            options: {
                sort: false
            }
        },
        {
            name: "acciones",
            label: 'Acciones',
            options: {
              filter: false,
              sort: false,
              empty: true,
              customBodyRender: (value, tableMeta, updateValue) => {
                if(value){
                    return (
                        <Link className="btn btn-info btn-sm" to={`${process.env.REACT_APP_ROUTER_PREFIX}${value}`}>
                            Ver Ads
                        </Link>
                    );
                }else{
                    return('');
                }
              }
            }
        }
    ],

    adAdsDatatableColumns: [
        {
            name: 'name',
            label: 'Nombre Ad',
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
                                   <FacebookAdsInsightsLinkModal key={tableMeta.rowIndex} insights={value} />
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
        }
    ]
}

export default Facebook;