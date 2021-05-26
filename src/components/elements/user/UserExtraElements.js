import React from 'react';
import {Link} from 'react-router-dom';

const UserEditBtn = (props) => {
    return (
        <Link className="btn btn-info btn-circle btn-sm" to={`${process.env.REACT_APP_ROUTER_PREFIX}/users/edit/${props.editid}`}>
            <i className="fas fa-user-edit"></i>
        </Link>
    )
};

export default UserEditBtn;