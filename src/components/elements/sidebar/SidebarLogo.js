import React from 'react';
import {Link, withRouter} from 'react-router-dom';
import logo from './../../../images/logo.png';

const SidebarLogo = () => {
    return (
        <Link to={`${process.env.REACT_APP_ROUTER_PREFIX}/`}>
            <div className="sidebar-brand d-flex align-items-center justify-content-center">
                <div className="sidebar-brand-icon">
                <img style={{width: '2rem'}} className="rounded-circle" src={logo} />
                </div>
                <div className="sidebar-brand-text mx-3">Geometry</div>
            </div>
        </Link>
    )
};

export default withRouter(SidebarLogo);