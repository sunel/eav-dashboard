import React, { Component } from 'react';
import { Card, Row, Col, } from 'antd';
import { connect } from 'react-redux';

const topColResponsiveProps = {
    xs: 24,
    sm: 12,
    md: 12,
    lg: 12,
    xl: 6,
    style: { marginBottom: 24, paddingLeft: 12, paddingRight: 12 },
  };

class Dashboard extends Component {
    render() {
        return (
            <Row gutter={24}>
                <Col {...topColResponsiveProps}>
                    <Card title="Entities">Card content</Card>
                </Col>
                <Col {...topColResponsiveProps}>
                    <Card title="Attributes">Card content</Card>
                </Col>
                <Col {...topColResponsiveProps}>
                    <Card title="Card title">Card content</Card>
                </Col>
            </Row>
        );
    }
}

function mapStateToProps(state) {
    return {

    };
}

export default connect(mapStateToProps)(Dashboard);