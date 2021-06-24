import React, {useState} from 'react';
import {Modal, Button} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    modal: {
        position: 'absolute',
        width: '85%',
        minWidth: 300,
        backgroundColor: 'white',
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: '16px 32px',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        height: '100%',
        overflowY: 'scroll'
    },
    bloquediv: {
        marginBottom: '15px'
    },
    link: {
        cursor: 'pointer'
    }
}));

function FacebookAdsInsightsLinkModal(props) {
    const styles = useStyles();

    const [modal, setModal] = useState(false);

    const openCloseModal = () => {
        setModal(!modal);
    }

    var insightsList = props.insights.map((insight, index) => {
            return (
                <div key={index} className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-left-primary shadow h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                    {insight.metric}</div>
                                    {insight.value}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }, props);

    const body = (
        <div className={styles.modal}>
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Ad Insights</h1>
            </div>
            <div className={styles.bloquediv}>
                <div className="row">
                    {insightsList}
                </div>
            </div>
            <div align="right">
                <Button className="primary" onClick={()=>openCloseModal()}>Cerrar</Button>
            </div>
        </div>
    );
    return(
        <>
            <a className={styles.link} onClick={()=>openCloseModal()}>Ver insights</a>
            <Modal
                open={modal}
                onClose={openCloseModal}
            >
                {body}
            </Modal>
        </>
    )
}

export default FacebookAdsInsightsLinkModal;