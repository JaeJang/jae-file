import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {history} from '../history';

class HomeUploadSent extends Component {

    constructor(props){
        super(props);

        this.state = {
            data: null,
        }

    }

    render() {
        
        const {data} = this.props;
        const to = _.get(data,'to');
        const postId = _.get(data,'_id');

        return (
            <div className={'app-main app-main-uploading-sent'}>
                <div className={'app-main-content'}>
                    <div className={'app-main-content-inner'}>
                        <div className={'app-home-uploading'}>
                            <div className={'app-home-upload-sent-icon'}>
                                <i className={'icon-paper-plane'}/>
                            </div>
                        <div className={'app-upload-sent-message app-text-center'}>
                            <h2>Files sent!</h2>
                            <p>We've sent an email to {to} with a download link. The link will expire in 30 days.</p>
                        </div>

                        <div className={'app-upload-sent-action app-form-actions'}>
                            <button className={'app-button primary'}type={'button'} onClick={()=>{
                                history.push(`/share/${postId}`)
                            }}>View file</button>
                            <button className={'app-button'} type={'button'} onClick={(event => {
                                if(this.props.onSendAnotherFile) {
                                    this.props.onSendAnotherFile();
                                }
                            })}>Send another file</button>
                        </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        );
    }


}

HomeUploadSent.propTypes = {
    data: PropTypes.object,
    onSendAnotherFile: PropTypes.func,

}
export default HomeUploadSent;