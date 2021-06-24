import React, {Component} from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import {Tabs, Tab, AppBar} from '@material-ui/core'
import InstagramMedia from './InstagramMedia';
/*import FacebookPageInsights from './FacebookPageInsights';*/

class EmpresasInstagramTabs extends Component {
    constructor (props) {
        super(props);

        this.state = {
            selectedTabIndex: 0,
            tabNameToIndex: {
                "publish_post": 0,
                //"insights": 1
            },
            indexTotabName: {
                0: "publish_post",
                //1: "insights"
            }
        }

        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount () {
        let {match} = this.props;
        let {params} = match;
        let {tabname} = params;

        this.setState({selectedTabIndex: this.state.tabNameToIndex[tabname]});
    }

    handleChange (event, newValue) {
        let {history} = this.props;
        let {path, params} = this.props.match;
        let newPath = path.replace(':empresaId', params.empresaId);
        newPath = newPath.replace(':tabname?', this.state.indexTotabName[newValue]);
        console.log(newPath);
        history.push(newPath);
        this.setState({selectedTabIndex: newValue});
    }

    render () {
        return (
            <>
                <AppBar position="static">
                    <Tabs value={this.state.selectedTabIndex} onChange={this.handleChange}>
                        <Tab label="Published Posts" />
                    </Tabs>
                </AppBar>
                {this.state.selectedTabIndex === 0 && <InstagramMedia empresaid={this.props.empresaid} empresadata={this.props.empresadata} userdata={this.props.userdata} />}
            </>
        )
    }
}

export default withRouter(EmpresasInstagramTabs);