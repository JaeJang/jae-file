import React, {Component} from 'react';
import Home from '../pages/home';
import View from '../pages/view';
import Header from '../components/header';

import {Router, Route, Switch} from 'react-router-dom';
import {history} from '../history';
class Layout extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={'app-layout'}>
                <div className={'app-container'}>
                    <Header />
                    <div className={'app-content'}>
                        <Router history={history}>
                            <Switch>
                                <Route exact path={'/'} component={Home}/>
                                <Route exact path={'/share/:id'} component={View}/>
                            </Switch>
                        </Router>
                    </div>
                </div>
            </div>
        )
    }
}

export default Layout;