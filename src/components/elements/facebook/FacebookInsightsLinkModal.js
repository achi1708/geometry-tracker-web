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

function FacebookInsightsLinkModal(props) {
    const styles = useStyles();

    const [modal, setModal] = useState(false);

    const openCloseModal = () => {
        setModal(!modal);
    }

    const insightsSections = [{
        'title': 'Post Engagement', 'list': ['post_engaged_users', 'post_engaged_fan'], insightTitles: {'post_engaged_users': 'Users Engaged', 'post_engaged_fan': 'Fans Engaged'}
    },
    {
        'title': 'Negative Feedback', 'list': ['post_negative_feedback', 'post_negative_feedback_unique'], insightTitles: {'post_negative_feedback': 'Negative Feedback Times', 'post_negative_feedback_unique': 'Negative Feedback People'}
    },
    {
        'title': 'Post Clicks', 'list': ['post_clicks', 'post_clicks_unique'], insightTitles: {'post_clicks': 'Post Clicks', 'post_clicks_unique': 'Post Clicks (Nro People)'}
    },
    {
        'title': 'Post Videos', 'list': ['post_video_views_organic_unique', 'post_video_views_paid_unique'], insightTitles: {'post_video_views_organic_unique': 'Organic Video Views', 'post_video_views_paid_unique': 'Paid Video Views'}
    },
    {
        'title': 'Post Impresions', 'list': ['post_impressions', 'post_impressions_unique', 'post_impressions_paid', 'post_impressions_paid_unique', 'post_impressions_organic', 'post_impressions_organic_unique'], insightTitles: {'post_impressions': 'Post Total Impressions (Times)', 'post_impressions_unique': 'Post Total Impressions (People)', 'post_impressions_paid': 'Paid Post Total Impressions (Times)', 'post_impressions_paid_unique': 'Paid Post Total Impressions (People)', 'post_impressions_organic': 'Organic Post Total Impressions (Times)', 'post_impressions_organic_unique': 'Organic Post Total Impressions (People)'}
    },
    {
        'title': 'Post Reactions', 'list': ['post_reactions_like_total', 'post_reactions_anger_total'], insightTitles: {'post_reactions_like_total': 'Total Likes Reactions', 'post_reactions_anger_total': 'Total Anger Reactions', 'post_reactions_by_type_total': 'Total Reactions Types'}
    }];

    /*var insightsList = props.insights.map(function(insight, index){
        if(!insight.title.includes('Reactions by Type')){
            var insightsValues = insight.values.map((valores, index2) => {
                return(
                    <span key={index2}>{valores.value}</span>
                ); 
            });
            return (<div key={index}>
                        <b>{insight.title}:</b><br/>
                        {insightsValues}
                    </div>
                    );
        }else{
            return <></>
        }
    });*/

    var insightsList = insightsSections.map(function(insSection, indexSection){
        var insightsCards = props.insights.filter((insight) => { return insSection.list.includes(insight.name)})
                                          .map((insight) => {
                                                var cardWidth = (insSection.list.length > 2) ? 'col-xl-3 col-md-6 mb-4' : 'col-xl-6 col-md-6 mb-4';
                                                let insightName = insight.name;

                                                var insightValues = insight.values.map((valores, index2) => {

                                                    /*if(insightName == "post_reactions_by_type_total"){
                                                        let viewReactions = [];
                                                        for(var i in valores.value){
                                                            viewReactions[i] = valores.value[i];
                                                        }

                                                        var viewReactionsRender = viewReactions.map((v, k) => {
                                                            console.log(k+": "+v);
                                                            return( <div className="h5 mb-0 font-weight-bold text-gray-800" key={k}>{k}: {v}</div> );
                                                        }) ;
                                                        return(
                                                            <>
                                                                {viewReactionsRender}
                                                            </>
                                                        );  
                                                    }else{*/
                                                        return(
                                                            <div className="h5 mb-0 font-weight-bold text-gray-800" key={index2}>{valores.value}</div>
                                                        );
                                                    //}
                                                    
                                                    
                                                }, insightName);
                                                return (
                                                    <div key={insight.name} className={cardWidth}>
                                                        <div className="card border-left-primary shadow h-100 py-2">
                                                            <div className="card-body">
                                                                <div className="row no-gutters align-items-center">
                                                                    <div className="col mr-2">
                                                                        <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                                                        {insSection.insightTitles[insight.name]}</div>
                                                                        {insightValues}
                                                                    </div>
                                                                    <div className="col-auto">
                                                                        <i title={insight.description} className="fas fa-question-circle fa-2x text-gray-300"></i>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                          });

        var insightsWidth = (insSection.list.length > 2) ? 'col-xl-12' : 'col-xl-6';
        return (
            <div key={indexSection} className={insightsWidth}>
                <div className="d-sm-flex align-items-center justify-content-between mb-2">
                    <h3 className="h5 mb-0 text-gray-800">{insSection.title}</h3>
                </div>
                <div className="row">
                    {insightsCards}
                </div>
            </div>
        );
    }, props);

    const body = (
        <div className={styles.modal}>
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Insights del Post</h1>
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

export default FacebookInsightsLinkModal;