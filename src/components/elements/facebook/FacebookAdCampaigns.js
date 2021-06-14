import React, {Component} from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import LoadingSection from './../LoadingSection';
import Breadcrumbs from './../Breadcrumbs';
import Facebook from './../../../services/Facebook';
import MUIDataTable from 'mui-datatables';
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core';

class FacebookAdCampaigns extends Component {
    constructor (props) {
        super(props);

        this.state = {
            datatable: {
                page: 1,
                count: 0,
                rowsPerPage: 50,
                setOrder: {},
                data: [['...Cargando información...']],
                columns: Facebook.adCampaignsDatatableColumns
            },
            isLoading: false,
            adaccountId: false

        };

        this.getData = this.getData.bind(this);
        this.setDataDatatable = this.setDataDatatable.bind(this);
        this.buildBreadcrumbs = this.buildBreadcrumbs.bind(this);
        //this.setOrderDatatable = this.setOrderDatatable.bind(this);
        this.setPageDatatable = this.setPageDatatable.bind(this);
        //this.reloadDatatable = this.reloadDatatable.bind(this);
        
    }

    componentDidMount () {
        let {params} = this.props.match;
        if(this.state.datatable.count == 0 && this.props.empresaid && params.adAccountId){
            this.setState({
                adaccountId: params.adAccountId
            }, function () {
                this.getData();
            }.bind(this));
        }
    }

    componentDidUpdate (prevProps) {
        let {params} = this.props.match;
        if(this.props.empresaid !== prevProps.empresaid && this.state.datatable.count == 0 && params.adAccountId){
            this.setState({
                adaccountId: params.adAccountId
            }, function () {
                this.getData();
            }.bind(this));
        }
    }

    async getData () {
        if(this.state.datatable.count == 0 
            || (this.state.datatable.count > 0 && (this.state.datatable.count / this.state.datatable.rowsPerPage) >= this.state.datatable.page)
            || (this.state.datatable.count > 0 && this.state.datatable.count < this.state.datatable.rowsPerPage && this.state.datatable.page == 1)){
            this.setState({isLoading: true});
            let adCampaignsList = await Facebook.getAdCampaignsListAdm(this.state.datatable.page, this.state.datatable.setOrder, this.state.adaccountId);
            if(adCampaignsList.status == true){
                this.setDataDatatable(adCampaignsList.msg);
            }
        }
        
        
    }

    setDataDatatable (adCampaignsList) {
        const {path, url, params} = this.props.match;
        let aux_url = path.replace('/campaigns/:adAccountId', '');
        aux_url = aux_url.replace(':empresaId', params.empresaId);
        aux_url = aux_url.replace(':tabname?', params.tabname);
        const see_ads_pre_url = `${aux_url}/ads/`;

        if(adCampaignsList.data.length && adCampaignsList.meta){
            let dataFinal = [];
            dataFinal = adCampaignsList.data.map((adcampaign, index) => {
                return {campaign_name: adcampaign.campaign_name,
                        objective: adcampaign.objective,
                        status: adcampaign.status,
                        budget_remaining: adcampaign.budget_remaining,
                        buying_type: adcampaign.buying_type,
                        configured_status: adcampaign.configured_status,
                        daily_budget: adcampaign.daily_budget,
                        created_time: adcampaign.created_time,
                        start_time: adcampaign.start_time,
                        stop_time: adcampaign.stop_time,
                        acciones: see_ads_pre_url+adcampaign.id,
                        data_adaccount: adcampaign.adaccount
                       };
            }, see_ads_pre_url);

            this.setState({isLoading: false});
            this.setState( prevState => ({
                datatable : {
                    ...prevState.datatable, 
                    page: adCampaignsList.meta.current_page,
                    count: adCampaignsList.meta.total,
                    rowsPerPage: adCampaignsList.meta.per_page,
                    data: dataFinal
                }
            }));
        }else{
            this.setState({isLoading: false});
        }
    }

    setPageDatatable (setPage) {
        this.setState({isLoading: true});
        this.setState( prevState => ({
            datatable : {
                ...prevState.datatable, 
                page: (setPage + 1)
            }
        }), function () {
            this.getData();
        }.bind(this));
    }

    buildBreadcrumbs () {
        let retorno = [];
        const {path, url, params} = this.props.match;
        
        let url_adaccounts = path.replace('/campaigns/:adAccountId', '');
        url_adaccounts = url_adaccounts.replace(':empresaId', params.empresaId);
        url_adaccounts = url_adaccounts.replace(':tabname?', params.tabname);
        
        retorno.push({name: 'Ad Accounts', url: `${process.env.REACT_APP_ROUTER_PREFIX}${url_adaccounts}`, active: false});

        if(retorno.length == 1 && this.state.datatable.data.length > 0){
            if(this.state.datatable.data[0] !== undefined){
                if(this.state.datatable.data[0].data_adaccount !== undefined){
                    let account_name = this.state.datatable.data[0].data_adaccount.account_name;
                    retorno.push({name: account_name+' Campaigns', url: `${process.env.REACT_APP_ROUTER_PREFIX}${url}`, active: true});
                }
            }
        }

        return retorno;
    }

    render () {
        const { data, page, count, rowsPerPage, sortOrder } = this.state.datatable;
        const {isLoading} = this.state;
        let breadcrumbs_arr = this.buildBreadcrumbs();
        

        const options = {
            filter: false,
            download: false,
            search: false,
            print: false,
            selectableRows: 'none',
            responsive: 'vertical',
            serverSide: true,
            count: count,
            rowsPerPage: rowsPerPage,
            rowsPerPageOptions: [],
            sortOrder: sortOrder,
            onTableChange: (action, tableState) => {
                console.log(action, tableState);
        
                // a developer could react to change on an action basis or
                // examine the state as a whole and do whatever they want
        
                switch (action) {
                    case 'changePage':
                    //this.changePage(tableState.page, tableState.sortOrder);
                    this.setPageDatatable(tableState.page);
                    break;
                    /*case 'sort':
                    //this.sort(tableState.page, tableState.sortOrder);
                    this.setOrderDatatable(tableState.sortOrder);
                    break;*/
                    default:
                    console.log('action not handled.');
                    break;
                }
            },
        };

        const theme = createMuiTheme({
            palette: {type: 'light'},
            typography: {useNextVariants: true},
            overrides: {
                MuiPaper: {
                    root: {
                        boxShadow: 'none !important'
                    }
                },
                MuiTableCell: {
                    head: {
                      fontFamily: '"Nunito"',
                    },
                    body: {
                        padding: '5px 16px',
                        fontFamily: '"Nunito"',
                    },
                },
            }
        });

        return (
            <div>
                {(isLoading) ? 
                <LoadingSection />
                : ''}
                <Breadcrumbs data={breadcrumbs_arr} />
                <MuiThemeProvider theme={theme}>
                    <MUIDataTable
                        data={data}
                        columns={this.state.datatable.columns}
                        options={options}
                    />
                </MuiThemeProvider>
            </div>
        )
    }
}

export default withRouter(FacebookAdCampaigns);