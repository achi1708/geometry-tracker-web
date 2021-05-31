import React, {Component} from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import LoadingSection from './../LoadingSection';
import FacebookBtn from './FacebookBtn';
import FlashMessages from './../FlashMessages';
import Facebook from './../../../services/Facebook';
import { Line, Bar } from 'react-chartjs-2';

class FacebookPageInsights extends Component {
    constructor (props) {
        super(props);

        this.state = {
            insightsData: [],
            lineChartsData: [],
            multipleBarChartsData: [],
            isLoading: false,
            msgFlashReadFacebook: [],
            typeMsgFlashReadFb: ''

        };

        this.getData = this.getData.bind(this);
        this.setData = this.setData.bind(this);
        this.setLineChartsData = this.setLineChartsData.bind(this);
        this.makeFacebookBtn = this.makeFacebookBtn.bind(this);
        this.readFacebookPageInsights = this.readFacebookPageInsights.bind(this);
    }

    componentDidMount () {
        this.getData();
    }

    componentDidUpdate (prevProps) {
        if(this.props.empresaid !== prevProps.empresaid){
            this.getData();
        }
    }

    async getData () {
        this.setState({isLoading: true});
        let pageInsightsList = await Facebook.getPageInsightsListAdm(this.props.empresaid);
        if(pageInsightsList.status == true){
            this.setData(pageInsightsList.msg);
        }
    }

    setData (pageInsightsList) {
        if(pageInsightsList.data.length){
            let dataFinal = [];
            dataFinal = pageInsightsList.data.map((post, index) => {
                return {metric: post.metric,
                        metric_date: post.metric_date,
                        metric_value: post.metric_value
                       };
            });

            this.setState({isLoading: false});
            this.setState( prevState => ({
                insightsData : dataFinal
            }), function () {
                this.setLineChartsData();
            }.bind(this));
        }else{
            this.setState({isLoading: false});
        }
    }

    setLineChartsData () {
        const lineCharts = ['page_engaged_users','page_post_engagements','page_negative_feedback','page_negative_feedback_unique','page_impressions','page_impressions_unique','page_posts_impressions','page_fans','page_fan_adds','page_fan_removes'];
        const lineChartsTitles = {page_engaged_users: 'Page Engaged Users',
                                  page_post_engagements: 'Page Post Engagements',
                                  page_negative_feedback: 'Page Negative Feedback (Times)',
                                  page_negative_feedback_unique: 'Page Negative Feedback (People)',
                                  page_impressions: 'Page Impressions (Times)',
                                  page_impressions_unique: 'Page Impressions (People)',
                                  page_posts_impressions: 'Page Post Impressions',
                                  page_fans: 'Page Fans',
                                  page_fan_adds: 'Page New Fans',
                                  page_fan_removes: 'Page Fans Removed'};

        /*console.log("INSIGHTDATA");
        console.log(this.state.insightsData);*/


        let lineChartsData = [];
        let multipleBarChartsData = [];

        for(var i in this.state.insightsData){
            if(lineCharts.includes(this.state.insightsData[i].metric)){
                let keyInsight = false;
                for(var j in lineChartsData){
                    if(lineChartsData[j].insightName == this.state.insightsData[i].metric){
                        keyInsight = j;
                        break;
                    }
                }

                if(keyInsight === false){
                    lineChartsData.push({insightName: this.state.insightsData[i].metric,
                                         labels: [this.state.insightsData[i].metric_date],
                                         datasets: [{label: lineChartsTitles[this.state.insightsData[i].metric], data: [this.state.insightsData[i].metric_value], fill: false, backgroundColor: 'rgb(255, 99, 132)', borderColor: 'rgba(255, 99, 132, 0.2)'}]
                                        });
                }else{
                    lineChartsData[keyInsight].labels.push(this.state.insightsData[i].metric_date);
                    lineChartsData[keyInsight].datasets[0].data.push(this.state.insightsData[i].metric_value);
                }
            }
        }

        /*console.log("PRE SETEAR CHARTs");
        console.log(lineChartsData);*/

        //page_positive_feedback_by_type
        const datasets_names = ['answer','claim','comment','like','link','other','rsvp'];
        const datasets_colors = [{bg: 'rgb(249, 249, 28)', bdr: 'rgb(249, 249, 28, 0.2)'},
                                 {bg: 'rgb(28, 45, 249)', bdr: 'rgb(28, 45, 249, 0.2)'},
                                 {bg: 'rgb(249, 38, 28)', bdr: 'rgb(249, 38, 28, 0.2)'},
                                 {bg: 'rgb(38, 249, 28)', bdr: 'rgb(38, 249, 28, 0.2)'},
                                 {bg: 'rgb(249, 175, 28)', bdr: 'rgb(249, 175, 28, 0.2)'},
                                 {bg: 'rgb(219, 28, 249)', bdr: 'rgb(219, 28, 249, 0.2)'},
                                 {bg: 'rgb(28, 195, 249)', bdr: 'rgb(28, 195, 249, 0.2)'}];

        multipleBarChartsData[0] = {insightName: "Page Positive Feedback (Times)",
                                     labels: [],
                                     datasets:[]};
        multipleBarChartsData[1] = {insightName: "Page Positive Feedback (People)",
                                     labels: [],
                                     datasets:[]};
        for(var n in datasets_names){
            multipleBarChartsData[0].datasets.push({label: `${datasets_names[n]}`, data: [], fill: false, backgroundColor: datasets_colors[n].bg});
            multipleBarChartsData[1].datasets.push({label: `${datasets_names[n]}`, data: [], fill: false, backgroundColor: datasets_colors[n].bg});
        }
        for(var i in this.state.insightsData){
            if(this.state.insightsData[i].metric == "page_positive_feedback_by_type"){
                multipleBarChartsData[0].labels.push(this.state.insightsData[i].metric_date);                
                //this.state.insightsData[i].metric_value
                if (typeof this.state.insightsData[i].metric_value === 'string' || this.state.insightsData[i].metric_value instanceof String){
                    const metric_value = JSON.parse(this.state.insightsData[i].metric_value);
                    for(var j in datasets_names){
                        if(metric_value.hasOwnProperty(datasets_names[j])){
                            multipleBarChartsData[0].datasets[j].data.push(metric_value[datasets_names[j]]);
                        }else{
                            multipleBarChartsData[0].datasets[j].data.push(0);
                        }
                    }
                }else{
                    for(var j1 in datasets_names){
                        multipleBarChartsData[0].datasets[j1].data.push(0);
                    }
                }
            }else if(this.state.insightsData[i].metric == "page_positive_feedback_by_type_unique"){
                multipleBarChartsData[1].labels.push(this.state.insightsData[i].metric_date);                
                //this.state.insightsData[i].metric_value
                if (typeof this.state.insightsData[i].metric_value === 'string' || this.state.insightsData[i].metric_value instanceof String){
                    const metric_value = JSON.parse(this.state.insightsData[i].metric_value);
                    for(var j in datasets_names){
                        if(metric_value.hasOwnProperty(datasets_names[j])){
                            multipleBarChartsData[1].datasets[j].data.push(metric_value[datasets_names[j]]);
                        }else{
                            multipleBarChartsData[1].datasets[j].data.push(0);
                        }
                    }
                }else{
                    for(var j1 in datasets_names){
                        multipleBarChartsData[1].datasets[j1].data.push(0);
                    }
                }
            }
        }

        /*console.log("multipleBarChartsData");
        console.log(multipleBarChartsData);*/

        this.setState({lineChartsData: lineChartsData, multipleBarChartsData: multipleBarChartsData});
    }

    makeFacebookBtn () {
        if(this.props.empresaid != false && this.props.empresadata.name != ''){
            return (
                <FacebookBtn mainreadinfo={this.readFacebookPageInsights} empresadata={this.props.empresadata} />
            );
        }else{
            return '0';
        }
    }

    async readFacebookPageInsights(fat, ftt, fuid) {
        console.log(fat);
        console.log(ftt);
        console.log(fuid);
        this.setState({isLoading: true, msgFlashReadFacebook: [], typeMsgFlashReadFb: ''},
        async function () {
            const self = this;
            const params = {fat, ftt, fuid, emp: this.props.empresaid, process: 'page_insights'};
            let req = await Facebook.readFacebookInfo(params);
            if(req.status == true) {
                const {data} = req.resp_data;
                if(data.msg == 'PROCESO_OK'){
                    this.setState({
                        msgFlashReadFacebook: [data.msg_extra],
                        typeMsgFlashReadFb: 'success'
                    });

                    let timer = setTimeout(() => self.getData(), 1500);
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

    render () {

        const {isLoading, lineChartsData, multipleBarChartsData} = this.state;
        const fbBtn = this.makeFacebookBtn();
        const options = {
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                  },
                },
              ],
            },
        };

        let insightsLineCharts = lineChartsData.map((data, index) => {
            /*console.log("insightsLineCharts");
            console.log(data);*/
            return (
                <div key={index} className="col-xl-6 col-lg-6">
                    <div className="card shadow mb-4">
                        <div
                            className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                            <h6 className="m-0 font-weight-bold text-primary">{data.datasets[0].label}</h6>
                        </div>
                        <div className="card-body">
                            <div className="chart-area">
                                <Line data={data} options={options} />
                            </div>
                        </div>
                    </div>
                </div>
            );
        }, options);

        let insightsMultipleBarCharts = multipleBarChartsData.map((data, index) => {
            /*console.log("insightsMultipleLineCharts");
            console.log(data);*/
            return (
                <div key={index} className="col-xl-6 col-lg-6">
                    <div className="card shadow mb-4">
                        <div
                            className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                            <h6 className="m-0 font-weight-bold text-primary">{data.insightName}</h6>
                        </div>
                        <div className="card-body">
                            <Bar data={data} options={options} />
                        </div>
                    </div>
                </div>
            );
        }, options);
          

        return (
            <div style={{width: '100%'}} className="card shadow mb-4 p-3">
                {(isLoading) ? 
                <LoadingSection />
                : ''}
                {fbBtn}
                { this.state.msgFlashReadFacebook.length > 0 ?
                    <FlashMessages messages={this.state.msgFlashReadFacebook} type={this.state.typeMsgFlashReadFb} /> :
                    ''
                }<br />
                <div className="row">
                    {insightsLineCharts}
                </div>
                <div className="row">
                    {insightsMultipleBarCharts}
                </div>
                
            </div>
        )
    }
}

export default withRouter(FacebookPageInsights);