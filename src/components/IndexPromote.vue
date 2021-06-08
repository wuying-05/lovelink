<template>
<div >
    <div v-if = 'isGuest' style="text-align:center;margin:50px 0px 5px 0px">
        <el-radio v-model="guestGender" :label="0" border>男</el-radio>
        <el-radio v-model="guestGender" :label="1" border>女</el-radio>
    </div>
    <el-carousel :interval="6000" :height="carouselHeightPx" arrow="always" indicator-position="none">
        <el-carousel-item v-for="(item,index) in users" :key="index">
          <UserCard :usersData="item" :showBottom="!isGuest" v-if="showResult"></UserCard>
        </el-carousel-item>
    </el-carousel>
</div>
</template>

<script>
import store from '../store'
import UserCard from './UserCard'
import { gdKey } from '../data'
import { provinceAndCityData} from 'element-china-area-data'
export default {
    name: 'IndexPromote',
    components: { UserCard },
    props: {
        
    },
    data () {
        return {
            ossUrl: store.ossUrl,
            carouselHeightPx: '680px',
            users:'',
            proCode:'',
            isGuest:false,
            guestGender:1,
            mapKey:gdKey,
            showResult:false,
            flag:false,  //是否是手机端
            perPage:8,
            rowNum:2,
            cardHeight:340
        }
    },
    methods: {
        findProvince(cityCode){
            for(var i=0;i<provinceAndCityData.length;i++){
                let list = provinceAndCityData[i].children;
                if(list instanceof Array){
                    let res = list.find(item => item.value === cityCode);
                    if(!!res)return provinceAndCityData[i].value;
                }
            }
        },getLoginedPro(){
            const thisform = this;
            var url = '/users/indexPrompt';
            const payload = {
            }
            this.$axios.post(url, payload).then(response => {
                    thisform.users = response.data.users;
                    thisform.users.forEach(element => {
                        if (element.avatar) {
                            element.avatarFile = this.ossUrl + `/avatars/${element.avatar}`
                        } else {
                            element.avatarFile = this.ossUrl + '/default-avatar.png'
                        }
                    });
                    thisform.users = thisform.arrToTwoDim(thisform.users,thisform.perPage);
                    thisform.showResult = true
                    thisform.isGuest = false
                })
                .catch(error => {
                    console.log(error)
                    this.$message({
                        showClose: true,
                        message: error.response.data.msg,
                        type: 'warning',
                        duration: 5000,
                        center: true
                    })
                    this.isDisabled = true;
                })
        },getGuestPro(){
            let _this = this;
            this.$axios.get('https://restapi.amap.com/v3/ip?key='+this.mapKey)
             .then(function (response) {
                var cCode = response.data.adcode;
                _this.proCode = _this.findProvince(cCode);
                _this.sendGuestProRequest();
             })
             .catch(function (error) {
              console.log(error);
             });
             
        },sendGuestProRequest(){
            var url = '/users/guestPrompt';
            const payload = {
                'gender':this.guestGender,
                'province':this.proCode
            }

            this.$axios
                .post(url, payload)
                .then(response => {
                    this.users = response.data.users
                    this.users = this.arrToTwoDim(this.users,this.perPage)
                    this.showResult = true
                    this.isGuest = true
                })
                .catch(error => {
                    console.log(error)
                    this.$message({
                        showClose: true,
                        message: error.response.data.msg,
                        type: 'warning',
                        duration: 5000,
                        center: true
                    })
                    this.isDisabled = true;
                })
        },arrToTwoDim(arr, n = 2) {
            var arr2 = []
            for (var i = 0, j = 0; i < arr.length; i += n) {
                // 初始化数组单个元素为数组
                arr2[j] = []
                for (var k = 0; k < n; k++) {
                    if (i + k < arr.length)
                        arr2[j].push(arr[i + k])
                }
                j++
            }
            return arr2
        },isMobile() {
              this.flag = navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
              );
              console.log(this.flag);
        }
    },created(){
        this.isMobile()
        if(this.flag){
            this.perPage = 4
            this.rowNum = 4
        }
        if(!store.state.is_authenticated)
            this.cardHeight = 297

        this.carouselHeightPx = (this.rowNum*this.cardHeight)+'px'
    },mounted () {
        if(store.state.is_authenticated){
            this.getLoginedPro()
            this.isGuest = false
        }else{
            this.getGuestPro()
            this.isGuest = true
        }
    },watch: {
        'guestGender': {
              handler (newVal, oldVal) {
                this.sendGuestProRequest()
              }
           }
          }
}
</script>

<style scoped>
    .el-carousel__item h3 {
        color: #475669;
        font-size: 18px;
        opacity: 0.75;
        
        margin: 0;
    }
  
    .el-carousel__item:nth-child(2n) {
        //background-color: #99a9bf;
    }
  
    .el-carousel__item:nth-child(2n+1) {
        //background-color: #FFF;
    }
</style>
