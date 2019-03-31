import React, { Component } from 'react';
import { Layout, Menu } from 'antd';
import UserInfo from './UserInfo';
import WhiteList from './WhiteList';

const { Header, Content } = Layout;
const whiteListKey = 'whitelist';
const userInfoKey = 'userinfo';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { current: whiteListKey };
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
        <Header theme="light" style={{ backgroundColor: 'white' }}>
          <Menu
            onClick={this.changeTab}
            selectedKeys={[current]}
            defaultSelectedKeys={[whiteListKey]}
            mode="horizontal"          
          >
            <Menu.Item key={whiteListKey}>
              White List
            </Menu.Item>
            <Menu.Item key={userInfoKey}>
              Security Vault
            </Menu.Item>
          </Menu>
        </Header>
        <Content>
          {content}
        </Content>

      </Layout>
    );
  }
}

export default App;
