import React, {Component} from 'react';
import Header from '../components/header';
import HomeForm from '../components/home-form';
import HomeUploading from '../components/home-uploading';
import HomeUploadingSent from '../components/home-upload-send';
import _ from 'lodash';

class Home extends Component {
    
    constructor(props){
        super(props);

        this.state = {
            data: null,
            uploadEvent: null,
            componentName: '',
        }

        this._renderComponent = this._renderComponent.bind(this);
    }

    _renderComponent() {
        const {componentName, data, uploadEvent} = this.state;

        switch(componentName) {
            case 'HomeUploading':
                return <HomeUploading 
                        data = {data}
                        event = {uploadEvent}
                        onCancel = {() => {
                            this.setState({
                                uploadEvent: null,
                                data: null,
                                componentName: 'HomeForm',
                            });
                        }}
                    />

            case "HomeUploadingSent":
                return <HomeUploadingSent
                    onSendAnotherFile = { () => {
                        this.setState({
                            componentName: 'HomeForm',
                        })
                    }}
                    data={data}
                />


            default :
                return <HomeForm
                onUploadEvent = {
                    (event) => {
                        let data = this.state.data;
                        if(_.get(event, 'type') === 'success') {
                            data = _.get(event, 'payload.post');
                        }
                        this.setState({
                            data: data,
                            uploadEvent: event,
                            componentName: (_.get(event, 'type') === 'success') ? 'HomeUploadingSent' : this.state.componentName
                            }
                        );
                    }
                }
                 onUploadBegin={
                    (data) => {
                        console.log("onUpload");
                        this.setState({
                            data: data,
                            componentName: 'HomeUploading',
                        });
                    }
                }

                />
        }
    }

    render() {
        return (
            <div>

                    {this._renderComponent()}
            </div>
        );
    }
}

export default Home;