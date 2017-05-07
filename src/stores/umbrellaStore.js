import { observable, action, computed, runInAction } from "mobx"
import axios from 'axios'
import { message } from 'antd';


class umbrellaStore {
    @observable dataState
    @observable defaultValues
    @observable visible
    @observable loading

    constructor(){
        this.dataState= []
        this.defaultValues=null
        this.visible=false
        this.loading=false
        setTimeout(this.getData,10)
    }

    @action.bound getData(){
        // this.setState({ loading: true});
        let _that=this;
        this.dataState=[];
        this.loading=true;
        console.log("GET DATA");
        axios.get('http://127.0.0.1:3001/admin/list')
            .then(action(function (response) {
                console.log(response);
                for (let list in response) {
                    // console.log(response[list]);
                    for (let i in response[list]) {
                        // console.log(response[list][i].id)
                        _that.dataState.push({
                            _id: response[list][i]._id,
                            id: response[list][i].id,
                            title: response[list][i].title,
                            author_intro:response[list][i].author_intro,
                            author:response[list][i].author,
                            subtitle: response[list][i].subtitle,
                            price: response[list][i].price,
                            image: response[list][i].image,
                            summary: response[list][i].summary,
                            publisher: response[list][i].publisher,
                            isbn10: response[list][i].isbn10
                        })
                    }
                }
            }))
            .then(action(function (data) {
                console.log("Data OK");
                console.log(_that.dataState);
                _that.loading=false;
            }))
            .catch(function (err) {
                message.error(`数据加载失败`);
                console.log(`书籍数据加载失败：${err}`);
            });
    }

    @action.bound changeVisable=(name,value)=>{
        this.visible=value;
    }
    @action.bound changeLoading=(value)=>{
        this.loading=value;
    }

    @action.bound showModal=(values)=>{
        this.visible=true
        this.defaultValues=values
    }

    @action.bound handleCancel(){
        this.visible=false
        message.warning("已取消");
    }
    @action.bound delItem=(id)=>{
        let _that=this;
        axios.get(`http://127.0.0.1:3001/admin/goods/del/${id}`)
            .then(action(function (res) {
                console.log(res)
                if(res==="OK"){
                    message.success(`书籍已被删除`);
                    _that.getData();
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



export default new umbrellaStore()