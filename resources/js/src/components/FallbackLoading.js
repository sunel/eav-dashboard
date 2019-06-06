import React from 'react';
import { Icon } from 'antd';
import styled from 'styled-components';

const Spin = styled.div`
  height: 50vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FallbackLoading = () => {
    return (
        <Spin>
            <Icon type="loading" style={{ fontSize: '30px', color: '#9f38ec' }} />
        </Spin>
    );
};

export default FallbackLoading;