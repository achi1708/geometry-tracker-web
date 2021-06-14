import React, {Component} from 'react';
import { Redirect, withRouter } from 'react-router-dom';

class DownloadBtn extends Component {
    constructor (props) {
        super(props);

        this.callToAction = this.callToAction.bind(this);
    }

    callToAction () {
        this.props.mainexec();
    }

    render () {
       return (
        <a onClick={this.callToAction} className="btn btn-success btn-icon-split">
            <span className="icon text-white-50">
                <i className="fas fa-download fa-fw"></i>
            </span>
            <span className="text">Descargar Información</span>
        </a>
       );
    }
}

export default withRouter(DownloadBtn);