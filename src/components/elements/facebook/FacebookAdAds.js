import React, {Component} from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import LoadingSection from './../LoadingSection';
import Breadcrumbs from './../Breadcrumbs';
import Facebook from './../../../services/Facebook';
import MUIDataTable from 'mui-datatables';
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core';

class FacebookAdAds extends Component {
    constructor (props) {
        super(props);

        this.state = {
            datatable: {
                page: 1,
                count: 0,
                rowsPerPage: 50,
                setOrder: {},
                data: [['...Cargando información...']],
                columns: Facebook.adAdsDatatableColumns
            },
            isLoading: false,
            campaignId: false

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
        if(this.state.datatable.count == 0 && this.props.empresaid && params.campaignId){
            this.setState({
                campaignId: params.campaignId
            }, function () {
                this.getData();
            }.bind(this));
        }
    }

    componentDidUpdate (prevProps) {
        let {params} = this.props.match;
        if(this.props.empresaid !== prevProps.empresaid && this.state.datatable.count == 0 && params.campaignId){
            this.setState({
                campaignId: params.campaignId
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
            let adAdsList = await Facebook.getAdAdsListAdm(this.state.datatable.page, this.state.datatable.setOrder, this.state.campaignId);
            if(adAdsList.status == true){
                this.setDataDatatable(adAdsList.msg);
            }
        }
        
        
    }

    setDataDatatable (adAdsList) {

        if(adAdsList.data.length && adAdsList.meta){
            let dataFinal = [];
            dataFinal = adAdsList.data.map((adads, index) => {
                return {name: adads.name,
                        insights: adads.insights,
                        data_adcampaign: adads.adcampaign
                       };
            });

            this.setState({isLoading: false});
            this.setState( prevState => ({
                datatable : {
                    ...prevState.datatable, 
                    page: adAdsList.meta.current_page,
                    count: adAdsList.meta.total,
                    rowsPerPage: adAdsList.meta.per_page,
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
        console.log("BREADCRUMBS ADS");
        console.log(this.props.match);
        
        let url_adaccounts = path.replace('/ads/:campaignId', '');
        url_adaccounts = url_adaccounts.replace(':empresaId', params.empresaId);
        url_adaccounts = url_adaccounts.replace(':tabname?', params.tabname);
        
        retorno.push({name: 'Ad Accounts', url: `${process.env.REACT_APP_ROUTER_PREFIX}${url_adaccounts}`, active: false});

        if(retorno.length == 1 && this.state.datatable.data.length > 0){
            if(this.state.datatable.data[0] !== undefined){
                if(this.state.datatable.data[0].data_adcampaign !== undefined){
                    let account_id = this.state.datatable.data[0].data_adcampaign.adaccount_id;
                    let url_adcampaigns = url_adaccounts+'/campaigns/'+account_id;
                    let account_name = this.state.datatable.data[0].data_adcampaign.facebook_empresas_adaccounts.account_name;
                    retorno.push({name: account_name+' Campaigns', url: `${process.env.REACT_APP_ROUTER_PREFIX}${url_adcampaigns}`, active: false});
                }
            }
        }

        if(retorno.length == 2 && this.state.datatable.data.length > 0){
            if(this.state.datatable.data[0] !== undefined){
                if(this.state.datatable.data[0].data_adcampaign !== undefined){
                    let campaign_name = this.state.datatable.data[0].data_adcampaign.campaign_name;
                    retorno.push({name: campaign_name+' Ads', url: `${process.env.REACT_APP_ROUTER_PREFIX}${url}`, active: true});
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

export default withRouter(FacebookAdAds);