import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';

class Breadcrumbs extends Component {
    constructor (props) {
        super(props);
    }
    
    render () {
        var breadcrumbsList = this.props.data.map(function(item, index){
            if(item.active === true){
                return (
                    <li key={index} className="breadcrumb-item active" aria-current="page">
                        {item.name}
                    </li>
                );
            }else{
                return (
                    <li key={index} className="breadcrumb-item">
                        <Link to={item.url}>
                            {item.name}
                        </Link>
                    </li>
                );
            }
            
        });
        return (
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    {breadcrumbsList}
                </ol>
            </nav>
        );
    }
}

export default withRouter(Breadcrumbs);