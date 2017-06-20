import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { Layout, Button, Table, Input, Tag, Select } from 'antd'
import axios from 'axios'
import mobx from 'mobx'
import {observable, action, computed, runInAction} from "mobx"
import DropOption from '../../components/Layout/DropOption.js'
import OperationBar from '../../components/Layout/OperationBar.js'

const { Content } = Layout
const Option = Select.Option

const columns = [

  {
    title: 'ID',
    dataIndex: 'uId',
  },
  {
    title: '用户姓名',
    dataIndex: 'userName',
  },
  {
    title: '联系电话',
    dataIndex: 'userPhone'
  },
  {
    title: '用户地址',
    dataIndex: 'userAddress',
  },
    {
        title: '封面',
        dataIndex: 'cImgSrc',
        render: (text, record) => <img
            src={record.cImgSrc}
            style={{height: '36px'}}
            alt=""/>
    },
  {
    title: '书籍名称',
    dataIndex: 'cName',
  },
  {
    title: '书籍价格',
    dataIndex: 'cPrice',
  },
  {
    title: '书籍数量',
    dataIndex: 'cQuantity',
  },
  {
    title: '订单状态',
    dataIndex: 'disabled',
    render: (text, record) => (
      <Tag color={`${record.disabled ? '#f50' : '#87d068'}`}>{record.disabled ? '已完成' : '未完成'}</Tag>
    )
  },
  {
    title: '总价',
    dataIndex: 'cTotal'
  },
  {
    title: '操作',
    key: 'operation',
    render: (text, record) => {
      return (
        <DropOption
          onMenuClick={e => { console.log(text, record) }}
          menuOptions={[{ key: '1', name: '编辑' }, { key: '2', name: '删除' }]}
        />
      )
    }
  }
]


@inject('orderStore') @observer
class Order extends Component {
  render() {
      const {orderData, loading,getOrderData} = this.props.orderStore

      return (
      <Layout>
        <OperationBar>
          <label>用户名：</label>
          <Input placeholder="请输入名称" style={{ width: 200 }} />
          <label>状态：</label>
          <Select defaultValue="0" style={{ width: 120 }}>
            <Option value="0">请选择状态</Option>
            <Option value="1">已完成</Option>
            <Option value="2">未完成</Option>
          </Select>
          <Button type="primary" icon="search">搜索</Button>
          <Button type="primary" icon="plus">添加</Button>
          <Button type="primary" icon="reload" onClick={ getOrderData}>刷新</Button>
        </OperationBar>
        <Content>
          <Table
            columns={columns}
            loading={loading}
            dataSource={mobx.toJS(orderData)}
            bordered
          />
        </Content>
      </Layout>
    )
  }
}

export default Order