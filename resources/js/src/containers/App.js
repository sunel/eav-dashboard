import React, { PureComponent, Suspense, lazy } from 'react';
import { hot } from 'react-hot-loader/root';
import { Layout } from 'antd';
import { Route, Switch, Redirect, withRouter } from 'react-router';
import styled from 'styled-components';

import Header from '../components/Header';
import SideBar from '../components/SideBar';
import FallbackLoading from '../components/FallbackLoading';

import { ResponsiveContext } from '../contexts/Responsive';

import { getBreakpoint, getDeviceBreakpoint } from '../utils/common';

const GloableDrawer = lazy(() => import('../components/GloableDrawer' /* webpackChunkName: "gloableDrawer" */));
const Entity = lazy(() => import('./Entity' /* webpackChunkName: "entity" */));
const Attributes = lazy(() => import('./Attributes' /* webpackChunkName: "attributes" */));

const Content = styled(Layout.Content)`
  margin: 24px 16px;
  padding: 24px;
  background: #fff;
  min-height: 280px;
`;

class App extends PureComponent {
  state = {};

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
    this.onResize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  onResize = () => {

    const { responsive } = this.state;

    const baseSpacing  = 24;
    const breakpoints = {
      small: {
        value: baseSpacing * 32, // 1536
      },
      medium: {
        value: baseSpacing * 64, // 1536
      },
      large: {}, // anything above 'medium'
    };

    const breakpoint = getBreakpoint(window.innerWidth, breakpoints);

    if (breakpoint !== responsive) {
      this.setState({ responsive: breakpoint });
    }
  };

  deviceResponsive = () => {
    const { userAgent } = this.props;

    const deviceBreakpoints = {
      phone: 'small',
      tablet: 'medium',
      computer: 'large',
    };

    /*
     * Regexes provided for mobile and tablet detection are meant to replace
     * a full-featured specific library due to contributing a considerable size
     * into the bundle.
     *
     * User agents found https://deviceatlas.com/blog/list-of-user-agent-strings
     */
    if (userAgent) {
      if (
        /(tablet|ipad|playbook|silk)|(android(?!.*mobile))/i.test(userAgent)
      ) {
        return getDeviceBreakpoint('tablet', deviceBreakpoints);
      }
      if (/Mobile|iPhone|Android/.test(userAgent)) {
        return getDeviceBreakpoint('phone', deviceBreakpoints);
      }
      return getDeviceBreakpoint('computer', deviceBreakpoints);
    }
    return undefined;
  }
  
  render() {

    const { responsive: stateResponsive } = this.state;
    // Value from state should be correct once we resize
    // On first render we try to guess otherwise set the default as a tablet
    const responsive =
      stateResponsive ||
      this.deviceResponsive() ||
      'medium';

    return (
      <ResponsiveContext.Provider value={responsive}>
        <Layout style={{ minHeight: '100vh' }}>
          <SideBar />
          <Layout>
            <Header />
            <Content> 
              <Suspense fallback={<FallbackLoading />}>
                <Switch>
                    <Route exact path="/" render={() => (<Redirect to="/entity"/>)} />
                    <Route exact path="/entity" render={() => (<Entity />)} />
                    <Route exact path="/attributes" render={() => (<Attributes />)} />
                    <Route render={() => (<Redirect to="/"/>)} />
                </Switch>
              </Suspense>
              <Suspense fallback={<span>&nbsp;</span>}>
                  <GloableDrawer />
              </Suspense>            
            </Content>           
          </Layout>      
        </Layout>
      </ResponsiveContext.Provider>    
    );
  }
}

export default hot(withRouter(App));
