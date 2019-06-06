import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Table, Tag, Input } from 'antd';
import styled from 'styled-components';

import { listEntities, updateListPageNo, expandTable } from '../actions';
import { selectListPageNo, selectExpandedRow, selectListSize } from '../selectors/cockpit';
import { selectEntities } from '../selectors/entity';

import Errors from '../components/Errors';

import Sets from '../components/Sets';

const SearchWarpper = styled.div`
  width: 200px;
  margin-bottom: 1rem;
  @media (min-width: 996px) {
    width: 40%;
  }
`;

const TableWrapper = styled.div`
  @media (max-width: 480px) {
    width: 100%;
    overflow-x: auto;
  }
`;

const Code = styled.span`
  color: #6f42c1;  
  background-color: rgba(27,31,35,.05);
  padding: 5px 10px;
  border-radius: 3px;
`;

const Title = styled.span`
  color: #3eaf7c;  
  text-transform: uppercase;
`;


const columns = [{
  title: 'Code',
  dataIndex: 'entity_code',
  key: 'entity_code',
  render: text => <Title>{text}</Title>,
}, {
  title: 'Class',
  dataIndex: 'entity_class',
  key: 'entity_class',
  render: text => <Code>{text}</Code>,
}, {
  title: 'Table',
  dataIndex: 'entity_table',
  key: 'entity_table',
  render: text => <Tag color="blue" key={text}>{text.toUpperCase()}</Tag>
}];

class Entity extends Component {

  componentDidMount() {
    if(
      !this.props.entities.get('data').size ||
      (this.props.entities.getIn(['meta', 'paginated', 'current_page']) !==  this.props.currentPageNo)
    ) {
      this.requestData(this.props.listSize, this.props.currentPageNo);
    }
  }

  componentWillReceiveProps (newProps) {
    if(newProps.currentPageNo !== this.props.currentPageNo ) {
      this.requestData(this.props.listSize, newProps.currentPageNo);
    }
  }

  requestData = (size, number, search = {}) => {
    this.props.dispatch(listEntities({ query : { 'page[size]': size, 'page[number]': number, ...search } }));
  }

  search = (value) => {
    this.requestData(this.props.listSize, 1, { 'filter[search]': value });
  }

  render() {
    return (
      <Row>
        <Col span={24}>
          <Row>
            <Col span={24} md={12}>
              <SearchWarpper>
                <Input.Search
                  placeholder="Search Entity"
                  size="large"
                  onSearch={this.search}
                />
              </SearchWarpper>
            </Col>
            <Col span={24} md={12} style={{ textAlign: "right" }}>
              {/* <Button type="primary" icon="plus" style={{ marginBottom: 8 }} onClick={this.addAttribute}>
                Entity
              </Button> */}
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Errors error={this.props.entities.get('errors')} /> 
          <TableWrapper>
            <Table
              bordered
              rowKey="id"
              pagination={{
                onChange: (page) => {
                  this.requestData(this.props.listSize, page);
                  this.props.dispatch(updateListPageNo({ type: 'entity', number: page }));
                },
                current: this.props.currentPageNo,
                pageSize: this.props.listSize,
                simple: true,
                total: this.props.entities.getIn(['meta', 'paginated', 'total'])
              }}
              dataSource={this.props.entities.get('data').toJS()}
              loading={this.props.entities.get('loading')}
              expandedRowKeys={this.props.expandRows.toJS()}
              expandedRowRender={(record, index) => <Sets entity={record} index={index} />}
              onExpand={(expanded, record) => this.props.dispatch(expandTable({ type: 'entity', keys: expanded ? [record.id] : [] }))}
              expandRowByClick
              columns={columns} />
          </TableWrapper>
        </Col>
      </Row>
    );
  }
}


function mapStateToProps(state) {
  return {
    entities: selectEntities(state),
    currentPageNo: selectListPageNo('entity', state),
    expandRows: selectExpandedRow('entity', state),
    listSize: selectListSize('entity', state),
  };
}

export default connect(mapStateToProps)(Entity);
