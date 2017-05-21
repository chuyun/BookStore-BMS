/**
 * Created by jun on 2017/5/21.
 */

/**
 * @author  info_together@aliyun.com
 * @description
 * @param
 * @return
 */


import {observable, action, computed, runInAction} from "mobx"
import axios from 'axios'
import {message} from 'antd';

class orderStore {
    @observable orderData
    @observable loading

    constructor() {
        this.orderData = []
        this.loading = false

        setTimeout(this.getOrderData, 10)
    }

    @action.bound getOrderData() {
        let _that = this
        this.orderData = []
        this.loading = true
        axios.get('http://127.0.0.1:3001/cart/orderlist')
            .then(action(function (response) {
                console.log(response)
                for (let list in response) {
                    console.log(response[list]);
                    for (let i in response[list]) {
                        _that.orderData.push({
                            key: response[list][i]._id,
                            uId: response[list][i].uId,
                            userName: response[list][i].userName,
                            userAddress: response[list][i].userAddress,
                            userPhone: response[list][i].userPhone,
                            cName: response[list][i].cName,
                            cPrice: response[list][i].cPrice,
                            cImgSrc: response[list][i].cImgSrc,
                            cQuantity: response[list][i].cQuantity,
                            cTotal: response[list][i].cPrice * response[list][i].cQuantity
                        })
                    }

                }
            }))
            .then(action(function (data) {
                console.log("Data OK");
                console.log(_that.orderData);
                _that.loading = false;
            }))
            .catch(function (response) {
                console.log(response);
            });
    }
}
export default new orderStore()