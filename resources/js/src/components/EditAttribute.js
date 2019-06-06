import React, { PureComponent } from 'react';
import { Row, Col, Form, Input, Button, Switch, Select, Spin, notification, message } from 'antd';
import { connect } from 'react-redux';

import { updateAttribute } from '../actions';
import { presistExistingAttribute, fetchBackendTypes, fetchFrontendTypes, fetchAttribute } from '../utils/WebAPI';

import SelectSource from './SelectSource';

const { Option } = Select;

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}
  
export class EditAttribute extends PureComponent {

    state = {             
        loading: false,
        backendType: [],
        fetchingBT: true,
        frontendType: [],
        fetchingFT: true,
        showSelectSource: false,
        values: {}
    };

    componentDidMount() {
        fetchBackendTypes().then(({ data }) => {
            this.setState((state) => {
                return {
                    backendType: data,
                    fetchingBT: false,
                } 
            });
        });

        fetchFrontendTypes().then(({ data }) => {
            this.setState((state) => {
                return {
                    frontendType: data,
                    fetchingFT: false,
                } 
            });
        });
        
        const hide = message.loading('Loading Attribute data..', 0);

        fetchAttribute({ entity: this.props.entity, code: this.props.attribute }).then(({ data }) => {

            const { setFieldsValue } = this.props.form;
            const { backend_type, is_required, is_filterable, is_searchable, frontend_label, frontend_type} = data;

            setFieldsValue({ 
                backend_type, 
                is_required: !!(is_required), 
                is_filterable: !!(is_filterable),
                is_searchable: !!(is_searchable),
                frontend_label, 
                frontend_type
            });

            hide();
        });
    }

    onSave = async (values) => {

        this.setState((state) => {
            return {
                loading: true,
            } 
        });

        const hide = message.loading('Saving changes..', 0);

        try {

            const post = {
                data: {
                    type: 'attribute',
                    attributes: {
                       ...values,
                    }
                }
            };

            const response = await presistExistingAttribute({ entity: this.props.entity, code: this.props.attribute }, post, {});

            this.props.dispatch(updateAttribute({ entity: this.props.entity, attribute: this.props.index , data:response }));

            hide();

            this.setState((state) => {
                return {
                    loading: false,
                } 
            });

            message.success('Changes has been saved.', 1).then(() => {
                this.props.close();
            });           

        } catch (error) {
            let message, description;
            if(error.type === 'network') {
                message = 'Network Error';
                description = error.message;
            } 
            else if(error.type === 'server' && error.status === 500) {
                message = error.error.errors[0].title;
                description = error.error.errors[0].detail;
            } else {
                const { setFields } = this.props.form;

                let form = {};

                error.error.errors.forEach(item => {
                    const source = item.source.pointer.split('/');
                    form[source[source.length-1]] = {
                        touched: true,
                        value: values[source[source.length-1]],
                        errors: [new Error(item.detail)]
                    };
                });

                setFields(form);

                message = 'Input Error';
                description = '';
            }
            hide();

            notification.error({
                message,
                description,
                duration: 0
            });

            this.setState((state) => {
                return {
                    loading: false,
                } 
            });
        }
    }

    handleFrontendChange = (value) => {
       if(value === 'select') {
        this.setState((state) => {
            return {
                showSelectSource: true,
            } 
        });
       } else {
        this.setState((state) => {
            return {
                showSelectSource: false,
            } 
        });
       }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {            
            if (!err) {
                this.onSave(values);
            } else {
                Object.keys(err).forEach((item) => {
                    err[item] = {
                        ...err[item],
                        touched: true,
                    }
                });
                this.props.form.setFields(err);
            }
        });
    }

    render() {
        const {
            getFieldDecorator, getFieldsError, getFieldError, isFieldTouched,
        } = this.props.form;
        
        const frontendLabelError = isFieldTouched('frontend_label') && getFieldError('frontend_label');
        const frontendTypeError = isFieldTouched('frontend_type') && getFieldError('frontend_type');
        const isRequiredError = isFieldTouched('is_required') && getFieldError('is_required');
        const isFilterableError = isFieldTouched('is_filterable') && getFieldError('is_filterable');
        const isSearchableError = isFieldTouched('is_searchable') && getFieldError('is_searchable');
        const backendTypeError = isFieldTouched('backend_type') && getFieldError('backend_type');

        return (
            <Form layout="horizontal" onSubmit={this.handleSubmit}>
                <Form.Item
                    label="Entity"                   
                >
                    {getFieldDecorator('entity', {
                        initialValue: this.props.entity
                    })(
                        <Input disabled />
                    )}                    
                </Form.Item>                
                <Form.Item
                    label="Code"
                >
                    {getFieldDecorator('code', {
                        initialValue: this.props.attribute,
                    })(
                        <Input disabled/>
                    )}
                </Form.Item>
                <Form.Item
                    label="Frontend Label"
                    validateStatus={frontendLabelError ? 'error' : ''}
                    help={frontendLabelError || ''}
                >
                    {getFieldDecorator('frontend_label', {
                        initialValue: this.state.values.frontend_label,
                        rules: [{ required: true, message: 'Please input label!' }],
                    })(
                        <Input placeholder="Frontend Label" autoComplete="off" autoFocus/>
                    )}
                </Form.Item>
                <Form.Item
                    label="Frontend Type"
                    validateStatus={frontendTypeError ? 'error' : ''}
                    help={frontendTypeError || ''}
                >
                    {getFieldDecorator('frontend_type', {
                        initialValue: this.state.values.frontend_type,
                        rules: [{ required: true, message: 'Please select frontend type!' }],
                    })(
                        <Select 
                            placeholder="Please select frontend type"
                            showSearch
                            notFoundContent={this.state.fetchingFT ? <Spin size="small" /> : null}
                            onChange={this.handleFrontendChange}
                        >
                            {this.state.frontendType.map(d => <Option key={d}>{d}</Option>)}
                        </Select>
                    )}
                </Form.Item>
                {this.state.showSelectSource && <SelectSource form={this.props.form} />}                
                <Row>
                    <Col xs={8} md={2}>
                        <Form.Item
                            label="Required"
                            validateStatus={isRequiredError ? 'error' : ''}
                            help={isRequiredError || ''}
                        >
                            {getFieldDecorator('is_required', {
                                valuePropName: 'checked',
                                initialValue: !!(this.state.values.is_required),
                            })(
                                <Switch />
                            )}
                        </Form.Item>
                    </Col>
                    <Col xs={8} md={2}>
                        <Form.Item
                            label="Filterable"
                            validateStatus={isFilterableError ? 'error' : ''}
                            help={isFilterableError || ''}
                        >
                            {getFieldDecorator('is_filterable', {
                                valuePropName: 'checked',
                                initialValue: !!(this.state.values.is_filterable),
                            })(
                                <Switch />
                            )}
                        </Form.Item>
                    </Col>
                    <Col xs={8} md={2}>
                        <Form.Item
                            label="Searchable"
                            validateStatus={isSearchableError ? 'error' : ''}
                            help={isSearchableError || ''}
                        >
                            {getFieldDecorator('is_searchable', {
                                valuePropName: 'checked',
                                initialValue: !!(this.state.values.is_searchable),
                            })(
                                <Switch />
                            )}
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item
                    label="Backend Type"
                    validateStatus={backendTypeError ? 'error' : ''}
                    help={backendTypeError || ''}
                >
                    {getFieldDecorator('backend_type', {
                        initialValue: this.state.values.backend_type,
                        rules: [{ required: true, message: 'Please select backend type!' }],
                    })(
                        <Select 
                            placeholder="Please select backend type"
                            notFoundContent={this.state.fetchingBT ? <Spin size="small" /> : null}
                        >
                            {this.state.backendType.map(d => <Option key={d}>{d}</Option>)}
                        </Select>
                    )}
                </Form.Item>                
                <Form.Item>
                    <Button style={{ marginRight: 8 }} onClick={this.props.close}>
                        Cancel
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={this.state.loading}
                        disabled={hasErrors(getFieldsError())}               
                    >
                        Save
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}

const WrappedEditAttributeForm = Form.create({ name: 'add_attribute' })(EditAttribute);


export default connect()(WrappedEditAttributeForm);