import React from 'react';
import loadingsec from './../../images/loading-sec.gif';

const LoadingSection = () => {
    return (
        <div className="loading-section">
            <img style={{width: '2em'}} id="loading-img" src={loadingsec} />
        </div>
    )
};

export default LoadingSection;