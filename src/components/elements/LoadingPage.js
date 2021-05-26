import React from 'react';
import loading from './../../images/loading.gif';

const LoadingPage = () => {
    return (
        <div className="loading-page">
            <img style={{width: '3em'}} id="loading-img" src={loading} />
        </div>
    )
};

export default LoadingPage;