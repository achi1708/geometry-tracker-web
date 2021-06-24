import React, {Component} from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import LoadingSection from './../LoadingSection';
import InstagramBtn from './InstagramBtn';
import DownloadBtn from './../facebook/DownloadBtn';
import FlashMessages from './../FlashMessages';
import FacebookMultiAccounts from './../facebook/FacebookMultiAccounts';
import Instagram from './../../../services/Instagram';
import MUIDataTable from 'mui-datatables';
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core';

class InstagramMedia extends Component {
    constructor (props) {
        super(props);

        this.state = {
            datatable: {
                page: 1,
                count: 0,
                rowsPerPage: 50,
                setOrder: {},
                data: [['...Cargando información...']],
                columns: Instagram.instagramMediaDatatableColumns
            },
            isLoading: false,
            msgFlashReadInstagram: [],
            typeMsgFlashReadIg: '',
            multipleAccounts: false,
            multipleAccountsList: [],
            multiAccountSelected: false

        };

        this.getData = this.getData.bind(this);
        this.setDataDatatable = this.setDataDatatable.bind(this);
        this.setOrderDatatable = this.setOrderDatatable.bind(this);
        this.setPageDatatable = this.setPageDatatable.bind(this);
        this.makeInstagramBtn = this.makeInstagramBtn.bind(this);
        this.readInstagramMedia = this.readInstagramMedia.bind(this);
        this.reloadDatatable = this.reloadDatatable.bind(this);
        this.makeDownloadBtn = this.makeDownloadBtn.bind(this);
        this.downloadInstagramMedia = this.downloadInstagramMedia.bind(this);
        this.setMultipleAccountSelected = this.setMultipleAccountSelected.bind(this);
        
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

    reloadDatatable (){
        this.setState({isLoading: true});
        this.setState( prevState => ({
            datatable : {
                ...prevState.datatable, 
                page: 1,
                count: 0,
                rowsPerPage: 50,
                setOrder: {},
                data: [['...Cargando información...']]
            },
            msgFlashReadInstagram: [],
            typeMsgFlashReadIg: ''
        }), function () {
            this.getData();
        }.bind(this));
    }

    async getData () {
        if(this.state.datatable.count == 0 
            || (this.state.datatable.count > 0 && (this.state.datatable.count / this.state.datatable.rowsPerPage) >= this.state.datatable.page)
            || (this.state.datatable.count > 0 && this.state.datatable.count < this.state.datatable.rowsPerPage && this.state.datatable.page == 1)){
            this.setState({isLoading: true});
            let igMediaList = await Instagram.getInstagramListAdm(this.state.datatable.page, this.state.datatable.setOrder, this.props.empresaid);
            if(igMediaList.status == true){
                this.setDataDatatable(igMediaList.msg);
            }
        }
        
        
    }

    setDataDatatable (mediaList) {
        if(mediaList.data.length && mediaList.meta){
            let dataFinal = [];
            dataFinal = mediaList.data.map((media, index) => {
                return {media_url: media.media_url,
                        caption: media.caption,
                        comments_count: media.comments_count,
                        like_count: media.like_count,
                        media_product_type: media.media_product_type,
                        insights: media.insights,
                        timestamp: media.timestamp
                       };
            });

            this.setState({isLoading: false});
            this.setState( prevState => ({
                datatable : {
                    ...prevState.datatable, 
                    page: mediaList.meta.current_page,
                    count: mediaList.meta.total,
                    rowsPerPage: mediaList.meta.per_page,
                    data: dataFinal
                }
            }));
        }else{
            this.setState({isLoading: false});
        }
    }

    setOrderDatatable (setOrder) {
        this.setState({isLoading: true});
        this.setState( prevState => ({
            datatable : {
                ...prevState.datatable, 
                setOrder: setOrder
            }
        }), function () {
            this.getData();
        }.bind(this));
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

    makeInstagramBtn () {
        if(this.props.empresaid != false && this.props.empresadata.name != ''){
            return (
                <InstagramBtn mainreadinfo={this.readInstagramMedia} empresadata={this.props.empresadata} />
            );
        }else{
            return '0';
        }
    }

    makeDownloadBtn () {
        if(this.props.empresaid != false){
            return (
                <DownloadBtn mainexec={this.downloadInstagramMedia} empresadata={this.props.empresaid} />
            );
        }else{
            return '0';
        }
    }

    async readInstagramMedia(fat, ftt, fuid) {
        console.log(fat);
        console.log(ftt);
        console.log(fuid);
        this.setState({isLoading: true, msgFlashReadInstagram: [], typeMsgFlashReadIg: '', multipleAccountsList: [], multipleAccounts: false},
        async function () {
            const self = this;
            const params = {fat, ftt, fuid, emp: this.props.empresaid, process: 'media'};
            if(this.state.multiAccountSelected !== false){
                params.account_id_select = this.state.multiAccountSelected;
            }
            let req = await Instagram.readInstagramInfo(params);
            if(req.status == true) {
                const {data} = req.resp_data;
                if(data.msg == 'PROCESO_OK'){
                    this.setState({
                        msgFlashReadInstagram: [data.msg_extra],
                        typeMsgFlashReadIg: 'success'
                    });

                    let timer = setTimeout(() => self.reloadDatatable(), 1500);
                }else if(data.msg == 'MULTIPLE_ACCOUNTS'){
                    this.setState({
                        multipleAccountsList: data.msg_extra,
                        multipleAccounts: true
                    });
                }
                
            }else{
                this.setState({
                    msgFlashReadInstagram: req.msg,
                    typeMsgFlashReadIg: 'danger'
                });
            }
            this.setState({isLoading: false, multiAccountSelected: false});
        }.bind(this));
    }

    async downloadInstagramMedia () {
        this.setState({isLoading: true},
        async function () {
            const self = this;
            let req = await Instagram.downloadInstagramInfo(this.props.empresaid, 'export_media');
            if(req.status == true) {
                const link = document.createElement('a');
                link.href = req.resp_data;
                link.setAttribute('download', 'instagram_media.xlsx');
                document.body.appendChild(link);
                link.click();
            }
            this.setState({isLoading: false});
        }.bind(this));
    }

    setMultipleAccountSelected (accountSelected) {
        this.setState({multiAccountSelected: accountSelected});
    }

    render () {
        const { data, page, count, rowsPerPage, sortOrder } = this.state.datatable;
        const {isLoading} = this.state;
        const igBtn = this.makeInstagramBtn();
        const dwldBtn = this.makeDownloadBtn();
        

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
                    case 'sort':
                    //this.sort(tableState.page, tableState.sortOrder);
                    this.setOrderDatatable(tableState.sortOrder);
                    break;
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
            <div className="card shadow mb-4 p-3 w-100">
                {(isLoading) ? 
                <LoadingSection />
                : ''}
                <div className="row">
                    <div className="col-xl-6 col-lg-6">
                        {igBtn}
                    </div>
                    <div className="col-xl-6 col-lg-6">
                        {dwldBtn}
                    </div>
                </div>
                { this.state.msgFlashReadInstagram.length > 0 ?
                    <FlashMessages messages={this.state.msgFlashReadInstagram} type={this.state.typeMsgFlashReadIg} /> :
                    ''
                }
                { this.state.multipleAccounts ?
                    <FacebookMultiAccounts callback={this.setMultipleAccountSelected} accounts={this.state.multipleAccountsList} /> :
                    ''
                }
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

export default withRouter(InstagramMedia);