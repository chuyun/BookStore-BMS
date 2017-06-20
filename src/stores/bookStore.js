import {observable, action, computed, runInAction} from "mobx"
import axios from 'axios'
import {message,Form} from 'antd';

class bookStore {
    @observable dataState //需要展现的数据
    @observable defaultValues //弹出框所需的默认值
    @observable visible //
    @observable loading
    @observable visible_addBookForm

    constructor() {
        this.dataState = []
        this.defaultValues = null
        this.visible_addBookForm = false
        this.visible = false
        this.loading = false
        setTimeout(this.getData, 10)
    }

    @action.bound getData() {
        // this.setState({ loading: true});
        let _that = this;
        this.dataState = [];
        this.loading = true;
        // console.log("GET DATA");
        axios.get('http://127.0.0.1:3001/admin/list')
            .then(action(function (response) {
                console.log(response);
                for (let list in response) {
                    // console.log(response[list]);
                    for (let i in response[list]) {
                        // console.log(response[list][i].id)
                        let temp=response[list][i]
                        _that.dataState.push({
                            key: temp._id,
                            _id: temp._id,
                            id: temp.id,
                            title: temp.title,
                            author_intro: temp.author_intro,
                            author: temp.author,
                            subtitle: temp.subtitle,
                            price: temp.price,
                            image: temp.image,
                            summary: temp.summary,
                            publisher: temp.publisher,
                            isbn10: temp.isbn10
                        })
                    }
                }
            }))
            .then(action(function (data) {
                console.log("Data OK");
                console.log(_that.dataState);
                _that.loading = false;
            }))
            .catch(function (err) {
                message.error(`数据加载失败`);
                console.log(`书籍数据加载失败：${err}`);
            });
    }

    @action.bound Search = (name) => {
        // this.setState({ loading: true});
        let _that = this;
        this.dataState = [];
        this.loading = true;
        console.log("GET Search");
        axios.get(`http://127.0.0.1:3001/admin/search/:${name}`)
            .then(action(function (response) {
                console.log(response);
                for (let list in response) {
                    console.log(response[list]);
                    for (let i in response[list]) {
                        // console.log(response[list][i].id)
                        _that.dataState.push({
                            key: response[list]._id,
                            _id: response[list]._id,
                            id: response[list].id,
                            title: response[list].title,
                            author_intro: response[list].author_intro,
                            author: response[list].author,
                            subtitle: response[list].subtitle,
                            price: response[list].price,
                            image: response[list].image,
                            summary: response[list].summary,
                            publisher: response[list].publisher,
                            isbn10: response[list].isbn10
                        })
                    }
                }
            }))
            .then(action(function (data) {
                console.log("Data OK");
                console.log(_that.dataState);
                _that.loading = false;
            }))
            .catch(function (err) {
                message.error(`数据加载失败`);
                console.log(`书籍数据加载失败：${err}`);
            });
    }


    @action.bound changeAddFormVisable = (value) => {
        // let current=this.visible_addBookForm
        this.visible_addBookForm = value
    }

    @action.bound changeVisable = (name, value) => {
        this.visible = value;
    }
    @action.bound changeLoading = (value) => {
        this.loading = value;
    }
    @action.bound showAddBookModal = () => {
        this.visible_addBookForm = true
    }

    @action.bound showModal = (values) => {
        this.visible = true
        this.defaultValues = values
    }

    @action.bound handleAddFormCancel() {
        this.visible_addBookForm = false
        message.warning("已取消");
    }

    @action.bound handleCancel() {
        this.visible = false
        message.warning("已取消");
    }

    @action.bound delItem = (id) => {
        let _that = this;
        axios.get(`http://127.0.0.1:3001/admin/goods/del/${id}`)
            .then(action(function (res) {
                console.log(res)
                if (res === "OK") {
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

    @action.bound onMenuClick(values) {
        console.log("onMEnu" + values);
        console.log(values)
        this.showModal(values);
    }

    //添加书籍
    @action.bound handleAddBookForm = (form2) => {
        let _that = this;
        console.log(_that)
        // const form2 = this.form;
        console.log(form2);
        form2.validateFields((err, values) => {
            if (err) {
                message.error(`添加失败`);
                return;
            }
            console.log('Received values of form: ', values);
            // const {changeAddFormVisable, getData} = this.props.bookStore
            axios.post('http://127.0.0.1:3001/add/book', {
                ...values
            })
                .then(action(function (res) {
                    console.log(`then ${res}`);
                    if (res === 'OK') {
                        _that.getData();
                        message.success(`添加书籍成功`);
                    } else if (res === "exist") {
                        message.error("书籍已存在");
                    } else {
                        message.error(`添加书籍失败`);
                    }
                }))
                .catch(function (err) {
                    console.log(err)
                })

            form2.resetFields();
            _that.changeAddFormVisable(false);
        });
    }

    // 编辑书籍
    @action.bound handleEditBook = (form) => {
        let _that = this;
        // const form = this.form;
        form.validateFields((err, values) => {
            if (err) {
                message.error(`修改失败`);
                return;
            }
            console.log('Received values of form: ', values);

            // const {dataState, changeVisable, getData} = this.props.bookStore

            _that.dataState.forEach(function (item) {

                if (item.id === values.id) {
                    _that.dataState[item] = {...values};
                }
            })
            console.log(_that.dataState);

            axios.post('http://127.0.0.1:3001/edit/goodlist', {
                ...values
            })
                .then(action(function (res) {
                    console.log(`then ${res}`);
                    if (res === 'OK') {
                        _that.getData();
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


}


export default new bookStore()