import React, {Component} from 'react';
import { Switch, Route, withRouter, Redirect } from 'react-router-dom';
import FacebookBtn from './FacebookBtn';
import DownloadBtn from './DownloadBtn';
import LoadingSection from './../LoadingSection';
import FlashMessages from './../FlashMessages';
import FacebookAdAccounts from './FacebookAdAccounts';
import FacebookAdCampaigns from './FacebookAdCampaigns';
import FacebookAdAds from './FacebookAdAds';
import Facebook from './../../../services/Facebook';

class FacebookAdsRoute extends Component {
    constructor (props) {
        super(props);

        this.state = {
            isLoading: false,
            msgFlashReadFacebook: [],
            typeMsgFlashReadFb: ''

        };

        this.makeFacebookBtn = this.makeFacebookBtn.bind(this);
        this.readFacebookAds = this.readFacebookAds.bind(this);
        this.makeDownloadBtn = this.makeDownloadBtn.bind(this);
        this.downloadFacebookAds = this.downloadFacebookAds.bind(this);
        this.reloadTab = this.reloadTab.bind(this);
    }
    componentDidMount () {
        
    }

    reloadTab (){
        //alert("recargue ventana");
    }

    makeFacebookBtn () {
        if(this.props.empresaid != false && this.props.empresadata.name != ''){
            return (
                <FacebookBtn mainreadinfo={this.readFacebookAds} empresadata={this.props.empresadata} />
            );
        }else{
            return '0';
        }
    }

    async readFacebookAds(fat, ftt, fuid) {
        console.log(fat);
        console.log(ftt);
        console.log(fuid);
        this.setState({isLoading: true, msgFlashReadFacebook: [], typeMsgFlashReadFb: ''},
        async function () {
            const self = this;
            const params = {fat, ftt, fuid, emp: this.props.empresaid, process: 'business_ads'};
            let req = await Facebook.readFacebookInfo(params);
            if(req.status == true) {
                const {data} = req.resp_data;
                if(data.msg == 'PROCESO_OK'){
                    this.setState({
                        msgFlashReadFacebook: [data.msg_extra],
                        typeMsgFlashReadFb: 'success'
                    });

                    let timer = setTimeout(() => self.reloadTab(), 1500);
                }
                
            }else{
                this.setState({
                    msgFlashReadFacebook: req.msg,
                    typeMsgFlashReadFb: 'danger'
                });
            }
            this.setState({isLoading: false});
        }.bind(this));
    }

    makeDownloadBtn () {
        if(this.props.empresaid != false){
            return (
                <DownloadBtn mainexec={this.downloadFacebookAds} empresadata={this.props.empresaid} />
            );
        }else{
            return '0';
        }
    }

    async downloadFacebookAds () {
        this.setState({isLoading: true},
        async function () {
            const self = this;
            let req = await Facebook.downloadFacebookInfo(this.props.empresaid, 'export_ads');
            if(req.status == true) {
                const link = document.createElement('a');
                link.href = req.resp_data;
                link.setAttribute('download', 'business_ads.xlsx');
                document.body.appendChild(link);
                link.click();
            }
            this.setState({isLoading: false});
        }.bind(this));
    }

    render () {
        let {path, url} = this.props.match;
        const fbBtn = this.makeFacebookBtn();
        const dwldBtn = this.makeDownloadBtn();
        const {isLoading} = this.state;

        return (
            <div className="card shadow mb-4 p-3 w-100">
                {(isLoading) ? 
                <LoadingSection />
                : ''}
                <div className="row">
                    <div className="col-xl-6 col-lg-6">
                        {fbBtn}
                    </div>
                    <div className="col-xl-6 col-lg-6">
                        {dwldBtn}
                    </div>
                </div>
                { this.state.msgFlashReadFacebook.length > 0 ?
                    <FlashMessages messages={this.state.msgFlashReadFacebook} type={this.state.typeMsgFlashReadFb} /> :
                    ''
                }
                <br />
                <Switch>
                    <Route exact path={`${path}`}>
                        <FacebookAdAccounts empresaid={this.props.empresaid} empresadata={this.props.empresadata} userdata={this.props.userdata} />
                    </Route>
                    <Route path={`${path}/campaigns/:adAccountId`}>
                        <FacebookAdCampaigns empresaid={this.props.empresaid} empresadata={this.props.empresadata} userdata={this.props.userdata} />
                    </Route>
                    <Route path={`${path}/ads/:campaignId`}>
                        <FacebookAdAds empresaid={this.props.empresaid} empresadata={this.props.empresadata} userdata={this.props.userdata} />
                    </Route>
                </Switch>
            </div>
        )
    }
}

export default withRouter(FacebookAdsRoute);