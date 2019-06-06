import React, { PureComponent } from 'react';
import { Form, Select, Spin } from 'antd';

import { fetchSelectSources } from '../utils/WebAPI';

const { Option } = Select;

class SelectSource extends PureComponent {

    state = {             
        loading: true,
        selectSources: [],
    };

    componentDidMount() {
        fetchSelectSources().then(({ data }) => {
            this.setState((state) => {
                return {
                    selectSources: data,
                    loading: false,
                } 
            });
        });
    }

    render() {
        const {
            getFieldDecorator, getFieldError, isFieldTouched,
        } = this.props.form;

        const selectSourceError = isFieldTouched('select_source') && getFieldError('select_source');

        return (
            <Form.Item
                label="Select Source"
                validateStatus={selectSourceError ? 'error' : ''}
                help={selectSourceError || ''}
            >
                {getFieldDecorator('select_source', {
                    rules: [{ required: true, message: 'Please select a source!' }],
                })(
                    <Select 
                        placeholder="Please select a source"
                        showSearch
                        notFoundContent={this.state.loading ? <Spin size="small" /> : null}
                    >
                        {this.state.selectSources.map(d => <Option key={d}>{d}</Option>)}
                    </Select>
                )}                    
            </Form.Item> 
        );
    }

}

export default SelectSource;