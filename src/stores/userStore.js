import {observable, action, computed, runInAction} from "mobx"
import axios from 'axios'
import {message} from 'antd';

class userStore {
    @observable userData //用户信息
    @observable loading // 表格是否正在加载
    @observable visible //修改数据弹出框可见性
    @observable defaultValues //表单默认值
    @observable visible_addUserForm // 添加用户弹出框可见性

    constructor() {
        this.userData = []
        this.visible = false
        this.visible_addUserForm = false
        this.loading = false
        this.defaultValues = null
        setTimeout(this.getUserData, 10)
    }

    @action.bound getUserData() {
        let _that = this
        this.userData = []
        this.loading = true;
        axios.get('http://127.0.0.1:3001/admin/user')
            .then(action(function (response) {
                console.log(response);
                for (let list in response) {
                    console.log(response[list]);
                    for (let i in response[list]) {
                        _that.userData.push({
                            key: response[list][i]._id,
                            _id: response[list][i]._id,
                            id: response[list][i]._id,
                            name: response[list][i].name,
                            password: response[list][i].password,
                            email: response[list][i].email,
                            beizhu: response[list][i].registerDate
                        })
                    }
                }
            }))
            .then(action(function (data) {
                console.log("Data OK");
                console.log(_that.userData);
                _that.loading = false;
            }))
            .catch(function (response) {
                console.log(response);
            });
    }

    @action.bound changeAddFormVisable = () => {
        console.log("ADD USER CHECKER");
        let current = this.visible_addUserForm
        this.visible_addUserForm = !current
    }

    @action.bound changeVisable = (name, value) => {
        this.visible = value;
    }
    @action.bound changeLoading = (value) => {
        this.loading = value;
    }
    @action.bound showAddUserModal = () => {
        this.visible_addUserForm = true
    }
    @action.bound showModal = (values) => {
        this.visible = true
        this.defaultValues = values
    }

    @action.bound handleAddFormCancel() {
        this.visible_addUserForm = false
        message.warning("已取消");
    }

    @action.bound handleCancel() {
        this.visible = false
        message.warning("已取消");
    }

    @action.bound delItem = (id) => {
        let _that = this;
        axios.get(`http://127.0.0.1:3001/admin/user/del/${id}`)
            .then(action(function (res) {
                if (res === "OK") {
                    message.success(`该用户已被删除`);
                    _that.getUserData();
                    console.log("delete good item is done")
                }
            }))
            .catch(action(function (err) {
                message.error(`deleted failed`);
                console.log(`"delete good item is error: ${err}"`)
            }))
    };

    @action.bound onMenuClick(values) {
        console.log("onMEnu" + values);
        console.log(values)
        this.showModal(values);
    }

    //添加用户
    @action.bound handleAddUserForm=(form2)=>{
        // const form2 = this.form;
        let _that=this;
        form2.validateFields((err, values) => {
            if (err) {
                message.error(`添加失败`);
                return;
            }

            console.log('Received values of form: ', values);

            // const {userData, changeAddFormVisable, getUserData} = this.props.userStore

            axios.post('http://127.0.0.1:3001/add/user', {
                ...values
            })
                .then(action(function (res) {
                    console.log(`then ${res}`);
                    if (res === 'OK') {
                        _that.getUserData();
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
            _that.changeAddFormVisable(false);
        });
    }

    @action.bound handleSaveFormUser = (form) => {
        // const form = this.form;
        let _that = this;
        form.validateFields((err, values) => {
            if (err) {
                message.error(`修改失败`);
                return;
            }

            console.log('Received values of form: ', values);

            // const {userData, changeVisable, getUserData} = this.props.userStore

            _that.userData.forEach(function (item) {

                if (item.id === values.id) {
                    _that.userData[item] = {...values};
                }
            })
            console.log(_that.userData);

            axios.post('http://127.0.0.1:3001/edit/user', {
                ...values
            })
                .then(action(function (res) {
                    console.log(`then ${res}`);
                    if (res === 'OK') {
                        _that.getUserData();
                        message.success(`修改成功`);
                    } else {
                        message.error(`修改失败`);
                    }
                }))
                .catch(function (err) {
                    console.log(err)
                })

            form.resetFields();
            _that.changeVisable(false);
        });
    }

    @action.bound saveUserFormRef = (form) => {
        this.form = form;
    }

    @action.bound saveAddUserFormRef = (form) => {
        this.form = form;
    }

}

export default new userStore()