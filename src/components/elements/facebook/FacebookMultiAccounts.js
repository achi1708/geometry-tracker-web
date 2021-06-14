import React, {Component} from 'react';

class FacebookMultiAccounts extends Component {
    constructor (props) {
        super(props);
        this.state = {
            regform: {
                selected: ''
            }
        };

        this.handleAccount = this.handleAccount.bind(this);
    }

    handleAccount (e) {
        let valueAccount = e.target.value;
        this.setState( prevState => ({
            regform : {
                ...prevState.regform, selected: valueAccount
            }
        }), function () {
            this.props.callback(this.state.regform.selected);
        }.bind(this));
    }

    render () {
        const self = this;
        var accList = this.props.accounts.map(function(acc, index){
            return (
                <div key={index} className="form-check">
                    <input className="form-check-input" type="radio" name="acc" value={acc.id} checked={self.state.regform.selected === acc.id} onChange={this.handleAccount} />
                    <label className="form-check-label">{acc.name}</label>
                </div>
            );
        }, self);

        return (
            <div className="form-group">
                <label>Su cuenta posee acceso a varias paginas, por favor seleccione la correspondiente a esta empresa:</label>
                {accList}
            </div>
        );
    }
}

export default FacebookMultiAccounts;