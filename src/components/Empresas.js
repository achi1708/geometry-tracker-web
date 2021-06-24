import React, {Component} from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import EmpresasList from './subpages/EmpresasList';
import EmpresaEdit from './subpages/EmpresaEdit';
import EmpresaCreate from './subpages/EmpresaCreate';
import EmpresasFacebook from './subpages/EmpresasFacebook';
import EmpresasInstagram from './subpages/EmpresasInstagram';
/*import UserEdit from './subpages/UserEdit';*/

class Empresas extends Component {
    constructor (props) {
        super(props);
    }
    
    render () {
        let {path, url} = this.props.match;
        return (
            <Switch>
                <Route path={`${path}/list`}>
                    {this.props.userdata.access ?
                        (this.props.userdata.access.includes('empresas.list')) ?
                        <EmpresasList userdata={this.props.userdata} />
                        :
                        'Error de acceso'
                    :
                    'Error de acceso'
                    }
                </Route>
                <Route path={`${path}/create`}>
                    {this.props.userdata.access ?
                        (this.props.userdata.access.includes('empresas.create')) ?
                        <EmpresaCreate userdata={this.props.userdata} />
                        :
                        'Error de acceso'
                    :
                    'Error de acceso'
                    }
                </Route>
                <Route path={`${path}/edit/:editId`}>
                    {this.props.userdata.access ?
                        (this.props.userdata.access.includes('empresas.edit')) ?
                        <EmpresaEdit userdata={this.props.userdata} />
                        :
                        'Error de acceso'
                    :
                    'Error de acceso'
                    }
                </Route>
                <Route path={`${path}/facebook/:empresaId`}>
                    {this.props.userdata.access ?
                        (this.props.userdata.access.includes('empresas.data_social_media')) ?
                        <EmpresasFacebook userdata={this.props.userdata} />
                        :
                        'Error de acceso'
                    :
                    'Error de acceso'
                    }
                </Route>
                <Route path={`${path}/instagram/:empresaId`}>
                    {this.props.userdata.access ?
                        (this.props.userdata.access.includes('empresas.data_social_media')) ?
                        <EmpresasInstagram userdata={this.props.userdata} />
                        :
                        'Error de acceso'
                    :
                    'Error de acceso'
                    }
                </Route>
            </Switch>
        )
    }
}

export default withRouter(Empresas);