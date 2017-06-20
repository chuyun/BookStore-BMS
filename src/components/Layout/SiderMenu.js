import { Layout, Menu, Icon } from 'antd'
import { observer, inject } from 'mobx-react'
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { breadConfig } from '../../utils'
import styles from './SiderMenu.less'


const SubMenu = Menu.SubMenu
const { Sider } = Layout


@inject('appStore') @withRouter @observer
class SiderMenu extends Component {


  onSiderClick(e) {
    const { location, history } = this.props
    if (location.pathname === e.key) return
    history.push(e.key)
  }

  render() {

    const { appStore, location } = this.props

    let defaultSelectedKeys = ''
    switch (true) {
      case['/', '/users'].indexOf(location.pathname) !== -1:
        defaultSelectedKeys = '/users'
        break
      case['/books'].indexOf(location.pathname) !== -1:
        defaultSelectedKeys = '/books'
        break
      case['/order'].indexOf(location.pathname) !== -1:
        defaultSelectedKeys = '/order'
        break
      case['/distribution'].indexOf(location.pathname) !== -1:
        defaultSelectedKeys = '/distribution'
        break
    }

    return (
      <Sider
        collapsible
        collapsed={appStore.collapsed}
        onCollapse={appStore.onCollapse}
      >
        <div className={styles.logo} style={{ visibility: appStore.collapsed ? 'hidden' : 'visible' }}>后台管理系统</div>
        <Menu
          theme="dark"
          mode={appStore.siderMode}
          defaultSelectedKeys={[defaultSelectedKeys]}
          selectedKeys={[defaultSelectedKeys]}
          defaultOpenKeys={['数据管理']}
          onClick={this.onSiderClick.bind(this)}
        >
          <SubMenu
            key="数据管理"
            title={<span><Icon type="user" /><span className="nav-text">数据管理</span></span>}
          >
            <Menu.Item key="/users">用户管理</Menu.Item>
            <Menu.Item key="/books">书籍管理</Menu.Item>
            <Menu.Item key="/order">订单管理</Menu.Item>
            <Menu.Item key="/distribution">分配管理</Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>
    )
  }
}

export default SiderMenu