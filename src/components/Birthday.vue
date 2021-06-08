<template>
<el-form label-width="120" ref="form">

    <el-popover
            v-if="!mFlag"
        v-bind:placement="yearPlace"
        :width="yearWidth"
        trigger="hover"
        content=""
        v-model="showYear"
        popper-class="year-prover"
        >
        <div class="test" style="margin:auto;left: 0">
            <el-row :gutter="0" v-for = "(item,index4) in years" :key="index4"  style="margin:0">
                <el-col v-for="(item2,index2) in item" :key="index2" :span="yearSpan">
                        <div  v-if="index2==0" class="" >
                            <b>{{item2}}</b>
                            <br/>
                        </div>
                        <div v-else class="textBlock" v-on:mouseover="addClass($event)"  v-on:mouseout="removeClass($event)"  @click="yearClicked(item2)">
                            {{item2.toString().substring(2,4)}}
<!--                            {{item2}}-->
                        </div>
                </el-col>
            </el-row>
        </div>
        <el-input slot="reference"  v-model="year"  style="width:100px" readonly>
            <span slot="suffix">年</span>
        </el-input>
    </el-popover>
    <el-popover
            v-else
            v-bind:placement="yearPlace"
            :width="304"
            trigger="hover"
            content=""
            v-model="showYear"
            popper-class="m-year-proper"
    >
        <div style="margin:auto;">
            <el-row :gutter="0" v-for = "(item,index4) in years" :key="index4"  style="margin:0">
                <el-col v-for="(item2,index2) in item" :key="index2" :span="3">
                    <div v-if="index2==0" style="width: 80px!important;margin-right: 15px;" >
                        <b>{{item2}}&nbsp;  &nbsp;  </b><br/>
                    </div>
                </el-col>
                <el-col   v-for="(item2,index2) in item" :key="index2" :span="2">
                    <div v-if="index2>0" v-else class="textBlock" v-on:mouseover="addClass($event)"  v-on:mouseout="removeClass($event)"  @click="yearClicked(item2)">
                        {{item2.toString().substring(2,4)}}
                    </div>
                </el-col>
            </el-row>
        </div>
        <el-input slot="reference"  v-model="year"  style="width:100px" readonly>
            <span slot="suffix">年</span>
        </el-input>
    </el-popover>

    <el-popover
        placement="bottom"
        width="300"
        :offset="70"
        trigger="hover"
        v-model="showMonth"
        content="">
        <div>
            <el-row :gutter="2">
                <el-col v-for = "(item,index1) in 12":key="index1" :span="2"><div class="textBlock" v-on:mouseover="addClass($event)"  v-on:mouseout="removeClass($event)" @click="monthClicked(item)">{{item}}</div></el-col>
            </el-row>
        </div>
        <el-input slot="reference"  v-model="month" style="width:80px" readonly>
        <span slot="suffix">月</span>
        </el-input>
    </el-popover>

    <el-popover
        placement="bottom"
        :width="300"
        :offset="10"
        trigger="hover"
        v-model="showDay"
        content="">
        <div>
            <el-row :gutter="1" v-for = "(item,index) in 3" :key="index">
                <el-col v-for = "(item2,index2) in totalDays" :key="index2" :span="2">
                    <div v-if="(item2>=(item-1)*10+1)&&(item2<=item*10)" v-on:mouseover="addClass($event)"  v-on:mouseout="removeClass($event)" class="textBlock" @click="dayClicked(item2)">{{item2}}</div>
                </el-col>
            </el-row>
        </div>
        <el-input slot="reference" v-model="day" style="width:80px" readonly>
            <span slot="suffix">日</span>
        </el-input>
    </el-popover>
</el-form>
</template>
<style>
.el-row {
    maring-right:'0px';
    flex-wrap: wrap
  }

</style>
<script>
import store from '../store'
export default {
    name: 'Birthday',
    data () {
        return {
            yearPlace:'bottom-start',
            yearWidth:450,
            yearSpan:2,
            showYear: false,
            showMonth:false,
            showDay:false,
            years : [['90后','1990','1991','1992','1993','1994','1995','1996','1997','1998','1999'],
                        ['80后','1980','1981','1982','1983','1984','1985','1986','1987','1988','1989'],
                        ['70后','1970','1971','1972','1973','1974','1975','1976','1977','1978','1979'],
                        ['60后','1960','1961','1962','1963','1964','1965','1966','1967','1968','1969'],
                        ['50后','1950','1951','1952','1953','1954','1955','1956','1957','1958','1959'],
                        ['40后','1940','1941','1942','1943','1944','1945','1946','1947','1948','1949']],
            myears : [{"label":'90后',"top":['1990','1991','1992','1993','1994'],"bt":['1995','1996','1997','1998','1999']},
                {"label":'90后',"top":['1990','1991','1992','1993','1994'],"bt":['1995','1996','1997','1998','1999']},
                {"label":'90后',"top":['1990','1991','1992','1993','1994'],"bt":['1995','1996','1997','1998','1999']},
                {"label":'90后',"top":['1990','1991','1992','1993','1994'],"bt":['1995','1996','1997','1998','1999']},
                {"label":'90后',"top":['1990','1991','1992','1993','1994'],"bt":['1995','1996','1997','1998','1999']},
                {"label":'90后',"top":['1990','1991','1992','1993','1994'],"bt":['1995','1996','1997','1998','1999']},],

            totalDays : 30,
            bigMonths:[1,3,5,7,8,10,12],
            year:'',
            month:'',
            day:'',
            mFlag:false
        }
    },
    methods: {
        isMobile() {
              this.mFlag = navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
              );
        },
        hide(){
          //DO THE REMOVE ACTION!
          this.showDialog=false;
        },yearClicked(year){
            this.year = year;
            this.showYear = false;
            this.showMonth = true;
            this.setTotalDays();
            this.choosedHandler();
        },monthClicked(month){
            this.month = month;
            this.showMonth = false;
            this.showDay = true;
            this.setTotalDays();
            this.choosedHandler();
        },dayClicked(day){
            this.day = day;
            this.showDay = false;
            this.choosedHandler();
        },isLeapYear(){
            if(!!this.year){
                if(this.year%4==0&&this.year%100!=0||this.year%400==0)
                    return true;
            }
            return false;
        },setTotalDays(){
            if(!!this.year&&!!this.month){
                if(this.bigMonths.indexOf(this.month)!=-1)
                    this.totalDays = 31;
                else if(this.month==2){
                    if(this.isLeapYear())this.totalDays = 29;
                    else this.totalDays = 28;
                }else this.totalDays = 30;
            }
            if(this.totalDays<this.day)this.day='';
        },choosedHandler(){ //发射
            if(!!this.year&&!!this.month&&!!this.day){
                this.$emit("birthdayChoosed",{"year":this.year,"month":this.month,"day":this.day})
            }
        },addClass($event){
             $event.currentTarget.className="textBlock hover";
          },removeClass($event){
                 $event.currentTarget.className="textBlock";
          }

    },
    created () {
        //this.$refs.form.clearValidate();
        this.isMobile()
        if(this.mFlag){
            this.yearPlace = 'bottom'
            this.yearWidth = 300
            this.yearSpan = 3
        }
    }
}
</script>

<style>
    .hover{background-color:#FF7A8E;
            cursor:pointer}
    .textBlock{text-align:center}
    .m-year-proper{
        left: 0!important;
    }
</style>
