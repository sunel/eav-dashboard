import React, { Component, Fragment } from 'react';
import { Row, Col, Table, Button, Input } from 'antd';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';

import { openDrawer } from '../actions';
import { fetchSets } from '../utils/WebAPI';

const SearchWarpper = styled.div`
  width: 200px;
  margin-bottom: 0.75rem;
`;

const TableWrapper = styled.div`
  @media (max-width: 480px) {
    width: 100%;
    overflow-x: auto;
  }
`;

const Title = styled.span`
  color: #3eaf7c;  
  text-transform: uppercase;
`;

const columns = [{
  title: 'Name',
  dataIndex: 'name',
  key: 'name',
  render: text => <Title>{text}</Title>,
}];

class Sets extends Component {

  state = {
    listSize: 10,
    currentPageNo: 1,
    data: [],
    loading: false,
    total: null,
  }

  componentDidMount() {
    this.requestData(this.state.listSize, 1);
  }

  requestData = async (size, number, search = {}) => {
    this.setState({ loading: true });
    const { data, meta } = await fetchSets({ entity: this.props.entity.entity_code }, {'page[size]': size, 'page[number]': number, ...search });
    this.setState({ data, loading: false, currentPageNo: meta.paginated.current_page, total: meta.paginated.total });
  }

  search = (value) => {
    this.requestData(this.state.listSize, 1, { 'filter[search]': value });
  }

  onItemClick = (item) => {
    this.props.dispatch(openDrawer({ type: 'set', entity: this.props.entity.entity_code, set: item }));
  }

  addSet = () => {
    this.props.dispatch(openDrawer({ type: 'addSet', entity: this.props.entity, index: this.props.index }));
  }

  addAttribute = () => {
    this.props.dispatch(openDrawer({ type: 'addAttribute', entity: this.props.entity.entity_code }));
  }

  viewAttributes = () => {
    this.props.dispatch(push(`/attributes?entity=${this.props.entity.entity_code}`));
  }

  render() {
    return (
      <Fragment>
        <Row type="flex" justify="space-around">
          <Col span={24} md={12}>
            <Row type="flex" justify="start">
              <Col span={6}>
                <SearchWarpper>
                  <Input.Search
                    placeholder="Search Entity"
                    size="large"
                    onSearch={this.search}
                  />
                </SearchWarpper>
              </Col>
            </Row>
          </Col>
          <Col span={24} md={12}>
            <Row type="flex" justify="end">
              <Col span={6} md={4} style={{ textAlign: "right" }}>
                <Button type="dashed" style={{ marginBottom: 8 }} onClick={this.viewAttributes}>
                  View Attributes
                  </Button>
              </Col>
              <Col span={6} md={4} style={{ textAlign: "right" }}>
                <Button type="primary" icon="plus" style={{ marginBottom: 8 }} onClick={this.addSet}>
                  Set
                  </Button>
              </Col>
              <Col span={8} md={4} style={{ textAlign: "right" }}>
                <Button type="primary" icon="plus" style={{ marginBottom: 8 }} onClick={this.addAttribute}>
                  Attribute
                  </Button>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col>
            <TableWrapper>
              <Table
                onRow={(record, rowIndex) => {
                  return {
                    onClick: (event) => this.onItemClick(record),
                  };
                }}
                pagination={{
                  onChange: (page) => {
                    this.requestData(this.state.listSize, page);
                  },
                  current: this.state.currentPageNo,
                  pageSize: this.state.listSize,
                  size: 'small',
                  showQuickJumper: true,
                  showLessItems: true,
                  total: this.state.total
                }}
                loading={this.state.loading}
                bordered
                showHeader={false}
                rowKey="id"
                title={() => 'Sets'}
                dataSource={this.state.data}
                columns={columns} />
              </TableWrapper>
          </Col>
        </Row>
      </Fragment>
    );
  }
}


export default connect()(Sets);