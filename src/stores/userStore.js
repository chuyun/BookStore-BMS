import { observable, action, computed, runInAction } from "mobx"
import axios from 'axios'
import { message } from 'antd';

class userStore{
    @observable userData
    @observable loading
    @observable visible
    @observable defaultValues

    @observable visible_addUserForm



    constructor(){
        this.userData=[]
        this.visible=false
        this.visible_addUserForm=false
        this.loading=false
        this.defaultValues=null

        setTimeout(this.getUserData,10)

    }

    @action.bound getUserData(){
        let _that=this
        this.userData=[]
        this.loading=true;
        axios.get('http://127.0.0.1:3001/admin/user')
            .then(action(function (response) {
                console.log(response);
                for (let list in response) {
                    console.log(response[list]);
                    for (let i in response[list]) {
                        _that.userData.push({
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
                _that.loading=false;
            }))
            .catch(function (response) {
                console.log(response);
            });
    }

    @action.bound changeAddFormVisable=()=>{
        console.log("ADD USER CHECKER");
        let current=this.visible_addUserForm
        this.visible_addUserForm=!current
}

    @action.bound changeVisable=(name,value)=>{
        this.visible=value;
    }
    @action.bound changeLoading=(value)=>{
        this.loading=value;
    }
    @action.bound showAddUserModal=()=>{
        this.visible_addUserForm=true
    }
    @action.bound showModal=(values)=>{
        this.visible=true
        this.defaultValues=values
    }

    @action.bound handleAddFormCancel(){
        this.visible_addUserForm=false
        message.warning("已取消");
    }
    @action.bound handleCancel(){
        this.visible=false
        message.warning("已取消");
    }
    @action.bound delItem=(id)=>{
        let _that=this;
        axios.get(`http://127.0.0.1:3001/admin/user/del/${id}`)
            .then(action(function (res) {
                if(res==="OK"){
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

    // @action.bound handleCreate=(form)=>{
    //     form.validateFields((err, values) => {
    //         if (err) {
    //             return;
    //         }
    //
    //         console.log('Received values of form: ', values);
    //
    //         this.dataState.forEach(function (item) {
    //
    //             if (item.id === values.id) {
    //                 this.dataState[item] = {...values};
    //             }
    //         })
    //         console.log(this.dataState);
    //
    //         axios.post('http://127.0.0.1:3001/edit/goodlist', {
    //             ...values
    //         })
    //             .then(function (res) {
    //             })
    //             .catch(function (err) {
    //                 console.log(err)
    //
    //             })
    //
    //
    //         form.resetFields();
    //         this.visible=false;
    //         // this.dataState=data
    //         // this.setState({visible: false, dataState: data});
    //     });
    //
    // }
    //
    // @action.bound  saveFormRef = (form) => {
    //     this.form = form;
    // }

    @action.bound onMenuClick(values) {
        console.log("onMEnu" + values);
        console.log(values)
        this.showModal(values);
    }


}

export default new userStore()