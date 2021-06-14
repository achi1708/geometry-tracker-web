import React, {Component} from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import LoadingSection from './../LoadingSection';
import Breadcrumbs from './../Breadcrumbs';
import Facebook from './../../../services/Facebook';
import MUIDataTable from 'mui-datatables';
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core';

class FacebookAdAccounts extends Component {
    constructor (props) {
        super(props);

        this.state = {
            datatable: {
                page: 1,
                count: 0,
                rowsPerPage: 50,
                setOrder: {},
                data: [['...Cargando información...']],
                columns: Facebook.adAccountsDatatableColumns
            },
            isLoading: false

        };

        this.getData = this.getData.bind(this);
        this.setDataDatatable = this.setDataDatatable.bind(this);
        this.buildBreadcrumbs = this.buildBreadcrumbs.bind(this);
        //this.setOrderDatatable = this.setOrderDatatable.bind(this);
        this.setPageDatatable = this.setPageDatatable.bind(this);
        //this.reloadDatatable = this.reloadDatatable.bind(this);
        
    }

    componentDidMount () {
        if(this.state.datatable.count == 0 && this.props.empresaid){
            this.getData();
        }
    }

    componentDidUpdate (prevProps) {
        if(this.props.empresaid !== prevProps.empresaid && this.state.datatable.count == 0){
            this.getData();
        }
    }

    async getData () {
        if(this.state.datatable.count == 0 
            || (this.state.datatable.count > 0 && (this.state.datatable.count / this.state.datatable.rowsPerPage) >= this.state.datatable.page)
            || (this.state.datatable.count > 0 && this.state.datatable.count < this.state.datatable.rowsPerPage && this.state.datatable.page == 1)){
            this.setState({isLoading: true});
            let adAccountsList = await Facebook.getAdAccountsListAdm(this.state.datatable.page, this.state.datatable.setOrder, this.props.empresaid);
            if(adAccountsList.status == true){
                this.setDataDatatable(adAccountsList.msg);
            }
        }
        
        
    }

    setDataDatatable (adAccountsList) {
        const {path, url} = this.props.match;
        const see_campaigns_pre_url = `${url}/campaigns/`;
        if(adAccountsList.data.length && adAccountsList.meta){
            let dataFinal = [];
            dataFinal = adAccountsList.data.map((adaccount, index) => {
                return {account_name: adaccount.account_name,
                        acciones: see_campaigns_pre_url+adaccount.id
                       };
            }, see_campaigns_pre_url);

            this.setState({isLoading: false});
            this.setState( prevState => ({
                datatable : {
                    ...prevState.datatable, 
                    page: adAccountsList.meta.current_page,
                    count: adAccountsList.meta.total,
                    rowsPerPage: adAccountsList.meta.per_page,
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
        const {path, url} = this.props.match;

        retorno.push({name: 'Ad Accounts', url: `${process.env.REACT_APP_ROUTER_PREFIX}${url}`, active: true});

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

export default withRouter(FacebookAdAccounts);