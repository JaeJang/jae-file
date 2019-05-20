import React, {Component} from 'react';
import {history} from '../history';

class Header extends Component {
    render() {
        return (
            <div className={'app-header'} onClick = { () => {
                history.push('/');
            }}>
                <div className={'app-name'}>
                    <h1><i className={'icon-paper-plane'}/>SEND IT</h1>
                    <div className={'app-desc'}>
                        <div className={'app-desc-sub'}>It's simple</div>
                        <div className={'app-desc-sub'}>It's safe</div>
                        <div className={'app-desc-sub'}>It's free</div>

                    </div>
                </div>
            </div>
        );
    }
}

export default Header;