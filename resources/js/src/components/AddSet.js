import React, { PureComponent } from 'react';
import { Form, Input, Button, notification, message } from 'antd';
import { connect } from 'react-redux';

import { presistSet } from '../utils/WebAPI';

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}
  
class AddSet extends PureComponent {

    state = {             
        loading: false,
    };

    componentDidMount() {        
        this.props.form.validateFields().catch(()=>{});
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
                    type: 'attribute_set',
                    attributes: {
                       name:  values.name,
                    }
                }
            };

            const response = await presistSet({ entity: this.props.entity.entity_code }, post, {});

            this.props.updateSet(response);

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

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.onSave(values);
            }
        });
    }

    render() {
        const {
            getFieldDecorator, getFieldsError, getFieldError, isFieldTouched,
        } = this.props.form;

        const nameError = isFieldTouched('name') && getFieldError('name');

        return (
            <Form layout="horizontal" onSubmit={this.handleSubmit}>
                <Form.Item
                    label="Entity"                   
                >
                    {getFieldDecorator('entity', {
                        initialValue: this.props.entity.entity_code
                    })(
                        <Input disabled />
                    )}                    
                </Form.Item>               
                <Form.Item
                    label="Name"
                    validateStatus={nameError ? 'error' : ''}
                    help={nameError || ''}
                >
                    {getFieldDecorator('name', {
                        rules: [{ required: true, message: 'Please input name!' }],
                    })(
                        <Input placeholder="Name" autoComplete="off" autoFocus/>
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

const WrappedAddSetpForm = Form.create({ name: 'add_group' })(AddSet);


export default connect()(WrappedAddSetpForm);