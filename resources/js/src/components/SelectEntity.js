import React, { Component, Fragment } from 'react';
import { Tag, Modal, Select, Spin } from 'antd';
import { connect } from 'react-redux';
import debounce from 'lodash.debounce';

import { selectCurrentEntity } from '../selectors/cockpit';

import { selectedEntity } from  '../actions';

import { fetchEnities } from '../utils/WebAPI';


const Option = Select.Option;

class SelectEntity extends Component {

    state = {
        showModal: false,
        showTag: true,
        data: [],
        fetching: false,
    }

    constructor(props) {
        super(props);
        this.fetchEntity = debounce(this.fetchEntity, 800);
    }

    componentDidMount() {
        if(!this.props.entity) {
            this.setState({ showModal: true, showTag: false });
        }
    }

    fetchEntity = (value) => {
        if(!value.length) return;
        this.setState({ data: [], fetching: true, value: null });
        fetchEnities({ 'page[size]': 25, 'page[number]': 1, 'filter[search]': value }).then(({ data }) => {
            const results = data.map(item => ({
                text: item.entity_code,
                value: item.entity_code,
            }));
            this.setState({ data: results, fetching: false });
        });
    }

    handleChange = (value) => {
        this.setState({
            data: [],           
            fetching: false,
            showModal: false,
            showTag: true
        });
        this.props.dispatch(selectedEntity(value));
    }

    render() {
        const { fetching, data } = this.state;
        return (
            <Fragment>
                <Tag
                    closable
                    visible={this.state.showTag}         
                    onClose={() => this.setState({ showModal: true, showTag: false })}
                >
                    {this.props.entity}
                </Tag>
                <Modal
                    title="Select Entity"
                    visible={this.state.showModal}
                    footer={null}
                    closable={false}
                >
                    <Select                        
                        showSearch              
                        placeholder="Search Entity"
                        notFoundContent={fetching ? <Spin size="small" /> : null}
                        filterOption={false}
                        onSearch={this.fetchEntity}
                        onChange={this.handleChange}
                        style={{ width: '100%' }}
                    >
                        {data.map(d => <Option key={d.value}>{d.text}</Option>)}
                    </Select>
                </Modal>
            </Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        entity: selectCurrentEntity(state),
    };
}
export default connect(
    mapStateToProps,
)(SelectEntity);