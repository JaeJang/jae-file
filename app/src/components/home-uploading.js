import React, {Component} from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {betterNumber} from '../helpers';

class HomeUploading extends Component {

    constructor(props){
        super(props);

        this.state = {
            startTime: new Date(),
            lastLoaded: 0,
            speedUpload: 0,
            data: null,
            loaded: 0,
            total: 0,
            percentage: 0,
        }
    }

    componentDidMount(){
        const {data} = this.props;
    
        this.setState({
            data: data,
        });

    }

    componentWillReceiveProps(nextProps){
        const {event} = this.props;
        
        switch(_.get(event, 'type')){
            
            case 'onUploadProgress':
                const loaded = _.get(event,'payload.loaded',0);
                const total = _.get(event, 'payload.total', 0);
                const percentage = total !== 0 ? (loaded / total) * 100 : 0;

                const currentTime = new Date();
                let diffTimeStartAndCurrent = currentTime - this.state.startTime;

                if(diffTimeStartAndCurrent === 0) {
                    diffTimeStartAndCurrent = 1;
                }
                const speedPerMili = (loaded - this.state.lastLoaded) / diffTimeStartAndCurrent;
                const speedPerSec = speedPerMili * 1000;



                this.setState({
                    speedUpload: speedPerSec,
                    startTime: currentTime,
                    lastLoaded: loaded,
                    loaded: loaded,
                    total: total,
                    percentage: percentage
                })
                break;

            default: 
                break;
        }

    }
    
    render() {
        
        const {percentage, data, total, loaded, speedUpload} = this.state;
        const totalFiles = _.get(data, 'files', []).length;

        return (
            <div className={'app-main app-main-uploading'}>
                <div className={'app-main-content'}>
                    <div className={'app-main-content-inner'}>
                        <div className={'app-home-uploading'}>
                            <div className={'app-home-uploading-icon'}>
                                <i className={'icon-upload'}/>
                                <h2>Sending...</h2>
                            </div>

                            <div className={'app-uploading-files-total'}>Uploading {totalFiles} files</div>

                            <div className={'app-progress'}>
                                <span style={{width: `${percentage}%`}} className={'app-progress-bar'}></span>
                            </div>
                            <div className={'app-uploading-stats'}>
                                <div className={'app-uploading-stats-left'}>{betterNumber(loaded)} /{betterNumber(total)} </div>
                                <div className={'app-uploading-stats-right'}>{betterNumber(speedUpload)}/s</div>
                            </div>
                            <div className={'app-form-actions'}>
                                <button className={'app-uploading-cancel-button app-button'} onClick={()=>{
                                    if(this.props.onCancel) {
                                        this.props.onCancel(true);
                                    }
                                }}>CANCEL</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

HomeUploading.propTypes = {
    data: PropTypes.object,
    event: PropTypes.object,
    onCancel: PropTypes.func,
}
export default HomeUploading;