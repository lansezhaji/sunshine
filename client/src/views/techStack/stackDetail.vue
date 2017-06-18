<template>
    <section class="chart-container">
<!--         <el-row>
           <el-button @click="getStackList">获取列表</el-button>
	       <el-button @click="debug">debug</el-button>
        </el-row> -->
       
        <el-row >
            <el-col class="stackHeader" >
                <h2>{{stackDetail.title}}</h2>
                阅读：135 
                <el-button  type="text">
                    <i class="el-icon-star-on" size="small"></i>赞 123
                </el-button>
                <el-button  type="text">
                    <i class="el-icon-plus" size="small"></i>收藏 134
                </el-button>
                {{getTime(stackDetail.createTime)}}

            </el-col>
            <el-row>
                <el-col :span="18" style="border-right:1px dashed lightgray">
                    <div id="stackContent">
                    </div>
                </el-col>
                <el-col :span="6">
                    <h3>相关推荐：</h3>
                </el-col>
            </el-row>
        </el-row>
    </section>
</template>

<script>
    import { getStackList } from '../../api/api';
    import { getStackDetail } from '../../api/api';


    export default {
        data() {
            return {
                stackDetail : {}
            }
        },

        methods: {
            debug : function(){
                debugger
            },
            /**
             * 获取详情
             * @return {[type]} [description]
             */
            getStackDetail : function(){
                var _this = this;
                var reqData = {
                    s_type : 1,
                    stackId : this.$route.query.stackId ,
                }
                getStackDetail(reqData).then(response => {
                    let { status , data , msg} = response;
                    if (status == 0) {
                        _this.stackDetail = data;
                        setTimeout(function(){
                            $("#stackContent").html(_this.stackDetail.content)
                        },300)
                    }else{
                        _this.$message.error(msg)
                    }
                })
            },
            /**
             * 获取列表
             * @return {[type]} [description]
             */
            getStackList : function(){
                var _this = this;
                var reqData = {
                    type : 1 ,
                }
                getStackList(reqData).then(response => {
                    let { status , data , msg} = response;
                    if (status == 0) {
                        _this.stackList = data;
                    }else{
                        _this.$message.error(msg)
                    }
                })
            },
            /**
             * 时间过滤
             * @param  {[type]} time [description]
             * @return {[type]}      [description]
             */
            getTime : function(time){
                var times = parseInt(time);
                var date = new Date(times)
                return date.toLocaleString()
            },

            deleteStack:function(stack){
                this.$confirm('确定要删除该数据？',"提示",{
                    
                }).then(() => {
                    var that = this;
                    var reqData = {
                        id : stack.id
                    }
                    deleteStack(reqData).then(response => {
                        let { status , data , msg} = response;
                        if (status == 0) {
                            that.$message.success('删除成功')
                            that.getStackList();
                        }else{
                            that.$message.error(msg)
                        }
                    })
                }).catch(() => {

                })
            },


        },
        beforeRouteEnter: function (to,from,next) {
          next(vm => {
            vm.getStackDetail();
          });
        }
    }
</script>

<style scoped>

    .stackItem{
        margin: 5px;
        border-radius: 5px;
        border:  1px solid #d8d8d8;
    }
    .stackHeader{
        padding: 30px;
        color: white;
        background: url(../../assets/header-img.png) no-repeat;
    }
    .avata{
        width: 50px;
        height: 50px;
        border-radius: 25px;
        overflow: hidden;
    }
    .avata img{
        width: 50px;
        height: 50px;
    }
</style>
