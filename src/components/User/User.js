import React, {Component} from 'react'
import {observer, inject} from 'mobx-react'
import {Layout, Button, Modal, Form, Input, Radio, Table, message,DatePicker} from 'antd'
import OperationBar from '../../components/Layout/OperationBar.js'
import DropOption from '../../components/Layout/DropOption.js'
 import axios from 'axios'
import mobx from 'mobx'
import {observable, action, computed, runInAction} from "mobx"
const FormItem = Form.Item;

const {Content} = Layout



//弹出层 ==> 修改用户信息
const EditUserDetailForm = Form.create()(
    (props) => {
        const {visible, onCancel, onCreate, form, defaultValues} = props;
        const {getFieldDecorator} = form;
        return (
            <Modal
                visible={visible}
                title="修改用户信息"
                okText="Create"
                onCancel={onCancel}
                onOk={onCreate}
                defaultValues={defaultValues}
            >
                <Form layout="vertical">
                    <FormItem label="_id" style={{display: 'none'}}>
                        {getFieldDecorator('_id', {
                            rules: [{required: true, message: 'Please input the title of collection!'}],
                            initialValue: defaultValues._id,
                        })(
                            <Input disabled/>
                        )}
                    </FormItem>
                    <FormItem label="id" style={{display: 'none'}}>
                        {getFieldDecorator('id', {
                            rules: [{required: true, message: 'Please input the title of collection!'}],
                            initialValue: defaultValues.id,
                        })(
                            <Input disabled/>
                        )}
                    </FormItem>
                    <FormItem label="name">
                        {getFieldDecorator('name', {
                            rules: [{required: true, message: 'Please input the title of collection!'}],
                            initialValue: defaultValues.name,
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label="password">
                        {getFieldDecorator('password', {
                            rules: [{required: true, message: 'Please input the title of collection!'}],
                            initialValue: defaultValues.password,
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label="email">
                        {getFieldDecorator('email', {
                            rules: [{required: false, message: 'Please input the title of collection!'}],
                            initialValue: defaultValues.email,
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label="beizhu">
                        {getFieldDecorator('beizhu', {
                            rules: [{required: false, message: 'Please input the title of collection!'}],
                            initialValue: defaultValues.beizhu,
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem className="collection-create-form_last-form-item">
                        {getFieldDecorator('modifier', {
                            initialValue: 'public',
                        })(
                            <Radio.Group>
                                <Radio value="public">Public</Radio>
                                <Radio value="private">Private</Radio>
                            </Radio.Group>
                        )}
                    </FormItem>
                </Form>
            </Modal>
        );
    }
);

//弹出层 ==> 添加用户
const AddUserForm = Form.create()(
    (props) => {
        const {visible, onCancel, onCreate, form} = props;
        const {getFieldDecorator} = form;
        return (
            <Modal
                visible={visible}
                title="添加用户"
                okText="添加"
                onCancel={onCancel}
                onOk={onCreate}
            >
                <Form layout="vertical">

                    <FormItem label="name">
                        {getFieldDecorator('name', {
                            rules: [{required: true, message: 'Please input the title of collection!'}],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label="password">
                        {getFieldDecorator('password', {
                            rules: [{required: true, message: 'Please input the title of collection!'}],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label="email">
                        {getFieldDecorator('email', {
                            rules: [{required: false, message: 'Please input the title of collection!'}],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label="beizhu">
                        {getFieldDecorator('beizhu', {
                            rules: [{required: false, message: 'Please input the title of collection!'}],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem className="collection-create-form_last-form-item">
                        {getFieldDecorator('modifier', {
                            initialValue: 'public',
                        })(
                            <Radio.Group>
                                <Radio value="public">Public</Radio>
                                <Radio value="private">Private</Radio>
                            </Radio.Group>
                        )}
                    </FormItem>
                </Form>
            </Modal>
        );
    }
);


@inject('userStore') @observer
class User extends Component {
    //
    //添加用户
    @action.bound handleAddUserForm=(id)=>{
        const form2 = this.form;
        form2.validateFields((err, values) => {
            if (err) {
                message.error(`添加失败`);
                return;
            }

            console.log('Received values of form: ', values);

            const {userData, changeAddFormVisable, getUserData} = this.props.userStore

            axios.post('http://127.0.0.1:3001/add/user', {
                ...values
            })
                .then(action(function (res) {
                    console.log(`then ${res}`);
                    if (res === 'OK') {
                        getUserData();
                        message.success(`添加用户成功`);
                    }else if(res==="exist"){
                        message.error("用户已存在");
                    } else {
                        message.error(`添加用户失败`);
                    }
                }))
                .catch(function (err) {
                    console.log(err)
                })

            form2.resetFields();
            changeAddFormVisable(false);
        });
    }

    @action.bound handleSaveFormUser = (id) => {
        const form = this.form;
        form.validateFields((err, values) => {
            if (err) {
                message.error(`修改失败`);
                return;
            }

            console.log('Received values of form: ', values);

            const {userData, changeVisable, getUserData} = this.props.userStore

            userData.forEach(function (item) {

                if (item.id === values.id) {
                    userData[item] = {...values};
                }
            })
            console.log(userData);

            axios.post('http://127.0.0.1:3001/edit/user', {
                ...values
            })
                .then(action(function (res) {
                    console.log(`then ${res}`);
                    if (res === 'OK') {
                        getUserData();
                        message.success(`修改成功`);
                    } else {
                        message.error(`修改失败`);
                    }
                }))
                .catch(function (err) {
                    console.log(err)
                })

            form.resetFields();
            changeVisable(false);
        });
    }
    @action.bound saveUserFormRef = (form) => {
        this.form = form;
    }

    @action.bound saveAddUserFormRef = (form) => {
        this.form = form;
    }
    render() {
        const {userData, defaultValues, visible, loading,visible_addUserForm} = this.props.userStore

        const {getUserData, handleCancel, delItem, handleAddFormCancel,onMenuClick,changeAddFormVisable,showAddUserModal} = this.props.userStore

        const columns = [
            {
                title: 'ID',
                dataIndex: 'id',
            },
            {
                title: '昵称',
                dataIndex: 'name',
            },
            {
                title: '密码',
                dataIndex: 'password',
            },
            {
                title: '邮箱',
                dataIndex: 'email'
            },
            {
                title: '备注',
                dataIndex: 'beizhu'
            },
            {
                title: '操作',
                key: 'operation',
                render: (text, record) => {
                    return (
                        <DropOption
                            onMenuClick={option => {
                                console.log(option)
                                switch (option.key) {
                                    case "1":
                                        console.log(`case1 ${record}`);
                                        onMenuClick(record);
                                        console.log(record._id);
                                        break;
                                    case "2":
                                        delItem(record._id);
                                        // console.log(record._id)
                                        // console.log("???")
                                        break;
                                    default:
                                        break;
                                }
                            }}
                            menuOptions={[{key: '1', name: '编辑'}, {key: '2', name: '删除'}]}
                        />
                    )
                }
            }
        ]

        return (
            <Layout>
                <OperationBar>
                    <DatePicker
                        showTime
                        format="YYYY-MM-DD HH:mm:ss"
                        placeholder="开始时间"
                    />
                    <label>~</label>
                    <DatePicker
                        showTime
                        format="YYYY-MM-DD HH:mm:ss"
                        placeholder="结束时间"
                    />
                    <label>昵称：</label>
                    <Input placeholder="请输入昵称" style={{width: 200}}/>
                    <Button type="primary" icon="search">搜索</Button>
                    <Button type="primary" icon="plus" onClick={showAddUserModal}>添加</Button>
                    <Button type="primary" icon="reload" onClick={getUserData}>刷新</Button>
                </OperationBar>
                <Content>
                    <Table
                        columns={columns}
                        loading={loading}
                        dataSource={mobx.toJS(userData)}
                        bordered
                    />
                </Content>

                {defaultValues ?
                    <EditUserDetailForm
                        ref={this.saveAddUserFormRef}
                        visible={visible}
                        onCancel={handleCancel}
                        onCreate={this.handleSaveFormUser}
                        defaultValues={defaultValues}
                    />
                    : null
                }

                <AddUserForm
                    ref={this.saveUserFormRef}
                    visible={visible_addUserForm}
                    onCancel={handleAddFormCancel}
                    onCreate={this.handleAddUserForm}
                />
            </Layout>
        )
    }
}

export default User