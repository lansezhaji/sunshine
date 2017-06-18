<template>
    <section class="chart-container">
        <el-row>
           <el-button @click="getStackList">获取列表</el-button>
	       <el-button @click="debug">debug</el-button>
        </el-row>
       
        <el-row >
            <el-col :span="16">
                <el-form label-width="100px">
                    <el-col :span="4" >
                        <el-form-item label-width="20px">
                            <router-link to="/createStack">
                                <el-button  type="text">＋新增</el-button>
                            </router-link>
                        </el-form-item>
                    </el-col>
                    <el-col style="line-height:40px;margin-left:5px">
                        <el-input placeholder="搜索内容">
                            <template slot="append">搜索</template>
                        </el-input>
                    </el-col>
                    <el-col v-for="stack in stackList" class="stackItem">
                             <el-col class="proTitle">
                                <router-link :to="{path:'/stackDetail',query:{stackId:stack.id}}">
                                    <el-button type="text" size="small">
                                        <h3>{{stack.title}}</h3>
                                    </el-button>
                                </router-link>
                            </el-col>
                            <el-col class="create">
                                {{stack.createPerson}} 发表于：{{getTime(stack.createTime)}} 
                            </el-col>
                            <el-col>
                                <el-col :span="2">
                                    <el-button size="small" type="text">
                                        <i class="el-icon-star-on">14</i>
                                    </el-button>
                                </el-col>
                                <el-col :span="2">
                                    <el-button size="small" type="text">
                                        <i class="el-icon-edit">14</i>
                                    </el-button>
                                </el-col>
                            </el-col>                        
     
                    </el-col>
                </el-form>
            </el-col>
            <el-col :span="8">
            </el-col>

        </el-row>
    </section>
</template>

<script>
    import { getStackList } from '../../api/api';
    import { updateStack } from '../../api/api';
    import { deleteStack } from '../../api/api';


    export default {
        data() {
            return {

                stackList : [],
                updateDialogVisible : false,
            }
        },

        methods: {
            debug : function(){
                debugger
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
            /**
             * 更新数据
             * @param  {[type]} stack [description]
             * @return {[type]}       [description]
             */
            updateStack :function(stack){
                this.updateDialogVisible = true;
                this.updateForm = stack || {}
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
            vm.getStackList();
          });
        }
    }
</script>

<style scoped>

    .stackItem{
        margin: 5px;
        padding-left: 20px;
        border:  1px solid #ddd;
    }
    .proTitle{
        font-size: 20px;
        font-weight: 900;
    }
    .create{
        font-size: 14px;
        color: gray;
        line-height: 30px
    }
    .promoImg{
        width: 100px;
        height: 100px;
        margin: 5px;
        border-radius: 2px;
        border: 1px solid #eee;
    }
</style>
