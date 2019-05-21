import React, {Component} from 'react';
import _ from 'lodash';
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
        this.getExpiryDate = this.getExpiryDate.bind(this);
    }

    componentWillMount() {
        const {match} = this.props;
        const postId = _.get(match,'params.id');   

        getDownLoadInfo(postId).then((res) => {
            this.setState({
                post: _.get(res, 'data'),
                postId: postId,
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

    getExpiryDate () {
        const {post} = this.state;
        const current = new Date();
        const posted = new Date(_.get(post, 'created'));
        const res = Math.abs(current - posted) / 1000;
        const days = 30 - Math.floor(res / 86400);

        return days;
    }

    render() {
        const {post,postId} = this.state;
        //const postId = _.get(post, '_id', null);
        const files = _.get(post, 'files', []);
        const totalSize = this.getTotalDownLoadSize();
        const days = this.getExpiryDate();
        const isExpried = days < 0;

        return(
            
            
            <div className={'app-main app-main-uploading-sent'}>
                <div className={'app-main-content'}>
                    <div className={'app-main-content-inner'}>
                        <div className={'app-home-uploading'}>
                            <div className={'app-home-upload-sent-icon'}>
                                <i className={'icon-download'}/>
                            </div>
                            <div className={'app-download-message app-text-center'}>
                                {
                                    !isExpried ? <h2>Ready to download</h2> : <h2>It's expired</h2>
                                }
                                
                                <ul>
                                    <li>{files.length} files</li>
                                    <li>{totalSize}</li>
                                    {
                                        !isExpried ? <li>Expries in {days} days</li> : null
                                    }
                                    
                                </ul>
                            </div>
                            <div className={'app-download-file-list'}>
                            {
                                files.map((file, index) => {
                                    return (
                                        <div key={index} className={'app-download-file-list-item'}>
                                            <div className={'filename'}>{file.originalName}</div>
                                            {
                                                !isExpried ? <div className={'download-action'}><a href={`${apiUrl}/download/${file._id}`}><i className={'icon-download'}></i></a></div>
                                                : <div className={'download-action'}><i className={'icon-download'}></i></div>
                                                
                                            }
                                            
                                        </div>
                                    )
                                })
                            }
                                
                            </div>

                            {
                                !isExpried ? 
                                <div className={'app-download-actions app-form-actions'}>
                                    <a href={`${apiUrl}/posts/${postId}/download`} className={'app-button primary'}>Download All</a>
                                    {/* <button className={'app-button'} type={'button'}>Share</button> */}
                                </div>
                                :
                                null
                            }
                            
                            
                            
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default View;