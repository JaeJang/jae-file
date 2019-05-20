import React, {Component} from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import {upload} from '../helpers/upload';
import PropTypes from 'prop-types';

class HomeForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            form: {
                files: [],
                to: '',
                from: '',
                message: '',
            },
            errors: {
                to: null,
                from: null,
            }
        };
        this.validations = this._initValidations();

        this._onTextChange = this._onTextChange.bind(this);
        this._onSubmit = this._onSubmit.bind(this);
        this._formValidation = this._formValidation.bind(this);
        this._onFileAdded = this._onFileAdded.bind(this);
        this._onFileRemoved = this._onFileRemoved.bind(this);
        this._initValidations = this._initValidations.bind(this);
    }

    _initValidations() {
        let {form} = this.state;

        const validations = {
            from: [
                {
                    errorMessage: "From is required",
                    isValid: () => {
                        return form.from.length;
                    }
                },
                {
                    errorMessage: "From should be an email",
                    isValid: () => {
                        return this._isEmail(form.from);
                    }
                }
            ],
            to: [
                {
                    errorMessage: "To is required",
                    isValid: () => {
                        return form.to.length;
                    }
                },
                {
                    errorMessage: "To should be an email",
                    isValid: () => {
                        return this._isEmail(form.to);
                    }
                }
            ],
            files: [
                {
                    errorMessage: "File is required",
                    isValid: () => {
                        return form.files.length;
                    }
                }
            ]
        };
        return validations;
    }
    _onFileAdded(event) {
        let files = _.get(this.state, 'form.files', []);

        _.each(_.get(event, 'target.files', []), (file) => {
            files.push(file);
        });

        this.setState({
            ...this.state.form,
            files: files
        }, () => {

        });
    }

    _onFileRemoved(index) {
        let {files} = this.state;

        files.splice(index, 1);
        this.setState({
            ...this.state.form,
            files:files
        });
    }

    _isEmail(address) {
        const regex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

        return regex.test(address);
    }

    _formValidation(fields = [], cb = () => {}) {
        let {errors} = this.state;
        const validations = this.validations;
         
        _.each(fields, (field) => {
            
            let fieldVaildations = _.get(validations, field, []);
            errors[field] = null;
            _.each(fieldVaildations, (fieldVaildation) => {
                const isValid = fieldVaildation.isValid();
                if(!isValid){
                    errors[field] = fieldVaildation.errorMessage;
                }
            });
        });
        this.setState({
            errors: errors,
        }, () => {
            let isValid = true;
            _.each(errors, (err) => {
                if(err != null)
                    isValid = false;
            });

            return cb(isValid);
        });
    }

    _onSubmit(event) {
        event.preventDefault();
        this._formValidation(['from', 'to', 'files'], (isValid) => {

            if(isValid) {
                //the form is valid and ready to submit
                if(this.props.onUploadBegin) {
                    const data = this.state.form;
                    this.props.onUploadBegin(data);
                }
                upload(this.state.form, (event) => {
                    if(this.props.onUploadEvent) {
                        this.props.onUploadEvent(event);
                    }
                });
                
            }
        });
    }

    _onTextChange(event) {
        let {form} = this.state;
        const fieldName = event.target.name;
        const fieldValue = event.target.value;

        form[fieldName] = fieldValue;
        this.setState({form:form});
    }

    render() {

        const {form, errors} = this.state;
        const {files} = form;

        return (
            <div className={'app-main'}>
                <form onSubmit={this._onSubmit}>
                    <div className={'app-main-header'}>
                        <div className={'app-main-header-inner'}>
                        {
                            files.length ? <div className={'app-files-selected'}>
                            {
                                files.map((file, index) => {
                                    return (
                                        <div key={index} className={'app-files-selected-item'}>
                                            <div className={'filename'}>{file.name}</div>
                                            <div className={'fileaction'}><button className={'file-remove'} onClick={()=>this._onFileRemoved(index)} type={'button'}>X</button></div>
                                        </div>
                                    );
                                })
                            }
                            </div>:null
                        }
                            <div className={classNames('app-file-select-zone', {'error':_.get(errors, 'files')})}>
                                <label htmlFor={'input-file'}>
                                    <input onChange={this._onFileAdded} id={'input-file'} type="file" multiple={true}/>
                                    {
                                        files.length? <span className={'app-upload-description text-uppercase'}>Add more files</span>
                                        : <span><span className={'app-upload-icon'}/>
                                            <span className={'app-upload-description'}>Drag and drop your files here.</span>
                                        </span>
                                    }
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className={'app-main-content'}>
                        <div className={'app-main-content-inner'}>
                            <div className={classNames('app-form-item', {'error':_.get(errors, 'to')})}>
                                <label htmlFor="to">SEND TO </label>
                                <input type="text" onChange={this._onTextChange} value={form.to} name={'to'} id ={'to'} placeholder={_.get(errors, 'to') ? _.get(errors, 'to') : 'Email address'}/>
                            </div>
                            <div className={classNames('app-form-item', {'error': _.get(errors, 'from')})}>
                                <label htmlFor="from">SEND FROM</label>
                                <input type="text" onChange={this._onTextChange} value={form.from} id={'from'} name={'from'} placeholder={_.get(errors, 'from') ? _.get(errors, 'from') : 'Email addres'}/>
                            </div>
                            <div className={'app-form-item'}>
                                <label htmlFor="message">Message</label>
                                <textarea onChange={this._onTextChange} name="message" id="message" placeholder={'Add a note (optional)'}></textarea>
                            </div>
                            <div className={'app-form-actions'}>
                                <button type={'submit'} className={'app-button primary'}>Send</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

HomeForm.propTypes = {
    onUploadBegin: PropTypes.func,
    onUploadEvent: PropTypes.func,
}

export default HomeForm;