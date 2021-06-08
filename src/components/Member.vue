<template>
    <section>
        <el-main class="container" v-loading="loading" element-loading-text="加载中">
        <el-row>
            <el-col :offset="1" :span="22">
                <el-card>
                    <div slot="header" style="text-align:center">
                    <div v-if="userData.is_vip">您已开通套餐</div>
                    <div v-else>开通套餐</div>
                    </div>
                    <el-form :model="memberForm" label-position="top" ref="memberForm" style="margin-top:16px; text-align:left" >
                        <el-form-item label="非认证会员">
                            <el-radio-group v-model="productId" @change="submitOrder">
                                <el-radio border :label="item.id" :value="item.id" v-for="(item,index) in n" :key="item.id" :disabled="userData.id_confirmed||(userData.is_vip&&userData.product_id==item.id)"> {{item.name}}：￥{{item.price}}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="认证会员">
                            <el-radio-group v-model="productId" @change="submitOrder">
                                <el-radio border :label="item.id" :value="item.id" v-for="(item,index) in v" :key="item.id" :disabled="!userData.id_confirmed"> {{item.name}}：￥{{item.price}}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <div style="text-align:left; margin: 50px 0;">
                            <!--<img
                            src="../assets/qrcode.png"
                            style="max-width: 180px;"
                            />-->
                            <el-dialog class="pay-dialog" :title="pay_laebl" :close-on-click-modal="false" :visible.sync="qrDialogVisible" style="text-align: center" width="240px">
                                <div>{{this.pd && this.pd.name}}</div>
                                <div style="margin-top: 5px;">金额：{{this.pd && this.pd.price}}元</div>
                                <span>
                                    <vue-qr :text="codeValue" :size="200"></vue-qr>
                                </span>
                                <span slot="footer" class="dialog-footer">
                                </span>
                            </el-dialog>
                            <div>
                                <el-radio-group v-model="payType" @change="submitOrder">
                                    <el-radio label="alipay" value="alipay" :disabled="false">支付宝支付</el-radio>
                                    <el-radio style="margin-left: 10px;" label="wxpay"  value="wxpay" :disabled="false">微信支付</el-radio>
                                </el-radio-group>
                            </div>
                            <div style="margin-top: 30px;">
                            本网站希望会员积极实名认证，非认证会员的套餐价格较高。感谢您的理解与支持！
                            </div>
                        </div>
                    </el-form>
                </el-card>
            </el-col>
        </el-row>
        </el-main>
    </section>
</template>

<script>
import store from '../store'
import VueQr from 'vue-qr'
export default {
    name: 'Member',
    components:{VueQr},
    methods:{
        getUser (id) {
                const path = `/users/${id}`
                this.$axios
                    .get(path)
                    .then(response => {
                        this.userData.id_confirmed = response.data.id_confirmed
                        this.userData.product_id = response.data.product_id
                        this.userData.id = response.data.id
                        this.userData.is_vip = response.data.is_vip
                        if(this.userData.is_vip){
                            this.productId = this.userData.product_id
                        }
                    })
                    .catch(error => {
                        console.error(error)
                    })
        },startQueryCycle(){
            let _this = this
            let count = 50
            window.clearInterval(this.interval);
            this.interval = window.setInterval(() => {
                if(this.status!=2&&this.status!=-1&&count--)
                    setTimeout(_this.queryOrderStatus(), 0)
            }, 5000)
        },creatWXQrCode() {
            // 计算价格
            for(let i = 0; i < this.products.length; i++) {
                console.log(this.productId,this.products[i].id)
                if(this.productId==this.products[i].id){
                    this.pd = this.products[i]
                }
            }
            this.loading = true
            const path = '/order/wxpay?userid='+this.sharedState.user_id+'&productid='+this.productId
            this.$axios.get(path).then(response => {
                    if(response.data.code==0){
                        this.codeValue = response.data.data.url
                        this.status = response.data.data.status
                        this.orderno = response.data.data.orderno
                        this.loading = false
                        this.qrDialogVisible = true
                        this.startQueryCycle()
                    }
                })
                .catch(error => {
                    console.error(error)
                    this.loading = false
            })
        },createAlipayCode(){
            this.loading = true
            const path = '/order/alipay'
            const payload = {
                productid: this.productId
            }
            for(let i = 0; i < this.products.length; i++) {
                console.log(this.productId,this.products[i].id)
                if(this.productId==this.products[i].id){
                    this.pd = this.products[i]
                }
            }
            this.$axios
                .post(path, payload)
                .then(response => {
                    if(response.data.code==0){
                        this.codeValue = response.data.data.url
                        this.status = response.data.data.status
                        this.orderno = response.data.data.orderno
                        this.loading = false
                        this.qrDialogVisible = true
                        this.startQueryCycle()
                    }
                    this.loading = false
                })
                .catch(error => {
                    this.loading = false
                    console.error(error)
                })

        },queryOrderStatus(){
            let path = ''
            if(this.payType=='alipay')
                path = '/alipay/queryOrder'
            else if(this.payType=='wxpay')
                path = '/wxpay/queryOrder'

            const payload = {
                orderno: this.orderno
            }

            this.$axios
                .post(path, payload)
                .then(response => {
                    if(response.data.code==0){
                        this.status = response.data.data.status                      
                    }
                })
                .catch(error => {
                    this.loading = false
                })
        },getProducts (id) {
            this.loading = true
            const path = `/product/getProducts`
            const payload = {}
            this.$axios
                .post(path,payload)
                .then(response => {
                    if(response.data.code==0){
                        var dt = response.data.data.res
                        this.products = dt
                        for(var i=0;i<dt.length;i++){
                            if(dt[i].name.indexOf("非认证")!=-1){
                                this.n.push(dt[i]) 
                            }  
                            else if(dt[i].name.indexOf("认证")!=-1)
                                this.v[this.v.length] = dt[i]
                        }
                    }
                    this.loading = false
                })
                .catch(error => {
                    console.error(error)
                    this.loading = false
                })
        },submitOrder(){
            if(!!this.productId && !!this.payType){

                if(this.payType=='alipay'){
                    this.pay_laebl = "支付宝支付"
                    this.loading=true
                    this.createAlipayCode()
                }else if(this.payType=='wxpay'){
                    this.pay_laebl = "微信支付"

                    this.loading=true
                    this.creatWXQrCode()
                }
            }
        },isIntNum(val){
            var regPos = / ^\d+$/; // 非负整数 
            var regNeg = /^\-[1-9][0-9]*$/; // 负整数
            if(regPos.test(val) && regNeg.test(val)){
                return true;
            }else{
                return false;
            } 
        }
    },data () {
        return {
            interval:null,
            sharedState: store.state,
            loading:false,
            memberForm: {
                memberName: ''
            },userData:{},
            n:[],
            v:[],
            products:[],
            productId:'',
            orderno:'',
            status:'',
            qrDialogVisible:false,
            codeValue:'',
            payType:'alipay',
            pd:null,
            pay_laebl: "支付宝支付"
        }
    },mounted(){
        this.getProducts()
        //this.creatQrCode()
        
    },created(){
        this.getUser(this.sharedState.user_id)
    },watch: {
        status(val){
            if(this.status==1)
                this.$message.success('扫码成功！')
            else if(this.status==2){
            	this.userData.is_vip = true
                this.qrDialogVisible = false
                this.userData.product_id = this.productId
                this.$message.success('支付成功！')                    
            }
        }
    }
}
</script>


<style >
    .pay-dialog .el-dialog__header{
        padding: 10px 10px 0 10px;
    }
    .pay-dialog .el-dialog__body{
        padding: 10px 10px!important;
    }
    .pay-dialog .el-dialog__footer{
        padding: 0;
    }
</style>