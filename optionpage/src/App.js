import React, { Component } from 'react';
import { Layout, Menu, Icon } from 'antd';
import UserInfo from './UserInfo';
import WhiteList from './WhiteList';
import logo from './shield.svg';

const { Header, Content } = Layout;
const whiteListKey = 'whitelist';
const userInfoKey = 'userinfo';

class App extends Component {
  constructor(props) {
    super(props);
    // TODO: change back, don't commit
    this.state = { current: userInfoKey };
  }

  changeTab = (e) => {
    this.setState({
      current: e.key,
    });
  }

  render() {
    const { current } = this.state;
    let content;
    if (current === whiteListKey) content = <WhiteList />;
    else if (current === userInfoKey) content = <UserInfo />;
    return (
      <Layout theme="light" style={{ width: '75%', margin: 'auto' }}>
        <Header theme="light" style={{ 
          backgroundColor: 'white', 
          height: '68px', 
          display: 'flex',
          justifyContent: 'space-between',
        }}>
          <div style={{ 
            alignItems: 'center', 
            display: 'flex',
            height: '48px',
            marginRight: '20px'
          }} >
            <img src={logo} height="36px" />
          </div>
          <Menu
            onClick={this.changeTab}
            selectedKeys={[current]}
            defaultSelectedKeys={[whiteListKey]}
            mode="horizontal"          
            style={{ height: '48px' }}
          >
            <Menu.Item key={whiteListKey}>
              <Icon type="ordered-list" />
              White List
            </Menu.Item>
            <Menu.Item key={userInfoKey}>
              <Icon type="file-protect" />
              Security Vault
            </Menu.Item>
          </Menu>
        </Header>
        <Content style={{ background: 'white' }}>
          {content}
        </Content>

      </Layout>
    );
  }
}

export default App;
