import React, {Component} from 'react';
import _ from 'lodash';
import Header from '../components/header';
import {getDownLoadInfo} from  '../helpers/download';
import {apiUrl} from '../config';
import {betterNumber} from '../helpers/';

class View extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            post: null,
        }

        this.getTotalDownLoadSize = this.getTotalDownLoadSize.bind(this);
    }

    componentWillMount() {
        const {match} = this.props;
        const postId = _.get(match,'params.id');   

        getDownLoadInfo(postId).then((res) => {
            this.setState({
                post: _.get(res, 'data'),
            })
        }).catch( err => {
            console.log("An error fetching download data", err);
        })
    }
    
    getTotalDownLoadSize() {
        const {post} = this.state;
        const files = _.get(post, 'files', []);
        let total = 0;

        _.each(files, (file) => {
            total = total + _.get(file, 'size', 0);
        })
        return betterNumber(total);
    }

    render() {
        const {post} = this.state;
        const postId = _.get(post, '_id', null);
        const files = _.get(post, 'files', []);
        console.log(post);
        const totalSize = this.getTotalDownLoadSize();
        return(
            
            
            <div className={'app-main app-main-uploading-sent'}>
                <div className={'app-main-content'}>
                    <div className={'app-main-content-inner'}>
                        <div className={'app-home-uploading'}>
                            <div className={'app-home-upload-sent-icon'}>
                                <i className={'icon-download'}/>
                            </div>
                            <div className={'app-download-message app-text-center'}>
                                <h2>Ready to download</h2>
                                <ul>
                                    <li>{files.length} files</li>
                                    <li>{totalSize}</li>
                                    <li>Expries in 30days</li>
                                </ul>
                            </div>
                            <div className={'app-download-file-list'}>
                            {
                                files.map((file, index) => {
                                    return (
                                        <div key={index} className={'app-download-file-list-item'}>
                                            <div className={'filename'}>{file.originalName}</div>
                                            <div className={'download-action'}><a href={`${apiUrl}/download/${file._id}`}><i className={'icon-download'}></i></a></div>
                                        </div>
                                    )
                                })
                            }
                                
                            </div>

                            <div className={'app-download-actions app-form-actions'}>

                                <a href={`${apiUrl}/posts/${postId}/download`} className={'app-button primary'}>Download All</a>
                                <button className={'app-button'} type={'button'}>Share</button>
                            </div>
                            
                            
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default View;