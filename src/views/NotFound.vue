<template>
    <el-container class="container">
        <!-- <el-row style="padding:20px 0;">
            <el-col :lg="6" :md="6" :sm="20" style="padding:10px;">
                <el-card :body-style="{ padding: '10px' }">
                <div slot="header" class="clearfix">
                    <span>404</span>
                </div>
                <div style="text-align: center">
                    <img :src="require('../assets/photos/girl0.jpg')" style="width: 238px; height: 160px; object-fit: fill">
                </div>
                <div class="bottom clearfix">
                    <el-button size="mini" type="primary" icon="el-icon-s-home" class="button right" @click="this.$router.push('/')">返回主页</el-button>
                </div>
                </el-card>
            </el-col>
        </el-row> -->
    </el-container>
</template>

<script>
export default {
    name: 'NotFound',
    data () {
        return {
            msg: ''
        }
    },
    created () {
        this.$message.warning('访问的页面不存在')
        this.$router.push('/')
    }
}
</script>
