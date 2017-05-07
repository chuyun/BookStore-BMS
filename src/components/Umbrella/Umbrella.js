import React, {Component} from 'react'
import {observer, inject} from 'mobx-react'
import {withRouter} from 'react-router-dom'
import {Layout, Button, Modal, Form, Input, Radio, Table, message} from 'antd'
import DropOption from '../../components/Layout/DropOption.js'
import OperationBar from '../../components/Layout/OperationBar.js'
import axios from 'axios'
import {observable, action, computed, runInAction} from "mobx"
import mobx from 'mobx'
import umbrellaStore from '../../stores/umbrellaStore'
const FormItem = Form.Item;

const {Content} = Layout

const CollectionCreateForm = Form.create()(
    (props) => {
        const {visible, onCancel, onCreate, form, defaultValues} = props;
        const {getFieldDecorator} = form;
        return (
            <Modal
                visible={visible}
                title="修改书籍信息"
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
                    <FormItem label="Title">
                        {getFieldDecorator('title', {
                            rules: [{required: true, message: 'Please input the title of collection!'}],
                            initialValue: defaultValues.title,
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label="Subtitle">
                        {getFieldDecorator('subtitle', {
                            rules: [{required: true, message: 'Please input the title of collection!'}],
                            initialValue: defaultValues.subtitle,
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label="Author">
                        {getFieldDecorator('author', {
                            rules: [{required: false, message: 'Please input the title of collection!'}],
                            initialValue: defaultValues.author,
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label="Author_intro">
                        {getFieldDecorator('author_intro', {
                            rules: [{required: false, message: 'Please input the title of collection!'}],
                            initialValue: defaultValues.author_intro,
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label="Publisher">
                        {getFieldDecorator('publisher', {
                            rules: [{required: false, message: 'Please input the title of collection!'}],
                            initialValue: defaultValues.publisher,
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label="Image">
                        {getFieldDecorator('image', {
                            rules: [{required: true, message: 'Please input the title of collection!'}],
                            initialValue: defaultValues.image,
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label="Price">
                        {getFieldDecorator('price', {
                            rules: [{required: true, message: 'Please input the title of collection!'}],
                            initialValue: defaultValues.price,
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label="summary">
                        {getFieldDecorator('summary', {
                            initialValue: defaultValues.summary,
                        })(<Input type="textarea"/>)}
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



@inject('umbrellaStore') @withRouter @observer
class Umbrella extends Component {

    @action.bound handleCreate = (id) => {
        const form = this.form;
        form.validateFields((err, values) => {
            if (err) {
                message.error(`修改失败`);
                return;
            }

            console.log('Received values of form: ', values);

            const {dataState, changeVisable, getData} = this.props.umbrellaStore

            dataState.forEach(function (item) {

                if (item.id === values.id) {
                    dataState[item] = {...values};
                }
            })
            console.log(dataState);

            axios.post('http://127.0.0.1:3001/edit/goodlist', {
                ...values
            })
                .then(action(function (res) {
                    console.log(`then ${res}`);
                    if (res === 'OK') {
                        getData();
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
    @action.bound saveFormRef = (form) => {
        this.form = form;
    }



    render() {

        const {getData, handleCancel, handleCreate, delItem, saveFormRef, onMenuClick} = this.props.umbrellaStore
        const {dataState, defaultValues, visible, loading} = this.props.umbrellaStore

        const columns = [
            {
                title: "objectID",
                dataIndex: '_id',
            },
            {
                title: 'ID',
                dataIndex: 'id',
            },
            {
                title: '书名',
                dataIndex: 'title',
            },
            {
                title: "作者",
                dataIndex: "author",
                render: (text, record) => record.author ? <span>{record.author}</span> : <span>作者不详</span>,
            },
            {
                title: "作者简介",
                dataIndex: "author_intro",
                render: (text, record) => record.author_intro ?
                    <span>{record.author_intro.substr(0, 16) + "..."}</span> : <span>暂无</span>,

            },

            {
                title: '封面',
                dataIndex: 'image',
                render: (text, record) => <img
                    src={record.image}
                    style={{height: '36px'}}
                    alt=""/>
            },
            {
                title: '出版社',
                dataIndex: 'publisher',
            },
            {
                title: '价格',
                dataIndex: 'price',
            },
            {
                title: 'ISBN10',
                dataIndex: 'isbn10'
            },
            {
                title: "简介",
                dataIndex: "summary",
                render: (text, record) => record.summary ? <span>{record.summary.substr(0, 16) + "..."}</span> :
                    <span>暂无简介</span>
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
                <OperationBar >
                    <label>名称：</label>
                    <Input placeholder="请输入名称" style={{width: 200}}/>
                    <Button type="primary" icon="search">搜索</Button>
                    <Button type="primary" icon="plus">添加</Button>
                    <Button type="primary" icon="reload" onClick={ getData}>刷新</Button>
                    <Button type="primary" icon="arrow-down">导入</Button>
                </OperationBar>
                <Content>
                    <Table
                        columns={columns}
                        loading={loading}
                        dataSource={mobx.toJS(dataState)}
                        bordered
                    />
                </Content>

                {defaultValues ?
                    <CollectionCreateForm
                        ref={this.saveFormRef}
                        visible={visible}
                        onCancel={handleCancel}
                        onCreate={this.handleCreate}
                        defaultValues={defaultValues}
                    />
                    : null
                }
            </Layout>
        )
    }
}

export default Umbrella