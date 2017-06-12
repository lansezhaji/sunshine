<template>
    <section class="chart-container">
        <el-row>
           <el-button @click="getStackList">获取列表</el-button>
	       <el-button @click="debug">debug</el-button>
        </el-row>
       
        <el-row >
            <el-form label-width="100px">
                <el-col :span="4">
                    <el-form-item label-width="20px">
                        <el-button @click="updateStack()" type="text">＋新增</el-button>
                    </el-form-item>
                </el-col>
                
                <el-col v-for="stack in stackList" class="stackItem">
                    <el-form-item label="标题：">
                        <el-col> 
                            <el-col :span="20">
                                {{stack.title}}
                            </el-col>
                            <el-col :span="4">
                                <el-button @click="updateStack(stack)" type="text">编辑</el-button>
                                <el-button @click="deleteStack(stack)" type="text">删除</el-button>
                            </el-col>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="创建人：">
                        <el-col> {{stack.createPerson}}  <strong style="margin-left:30px">创建时间：</strong>{{getTime(stack.createTime)}}   </el-col>
                    </el-form-item>
                    <el-form-item label="内容：">
                        <el-col> {{stack.content}}     </el-col> 
                    </el-form-item>          
                </el-col>
            </el-form>
        </el-row>
        <el-dialog
                  title="提示"
                  :visible.sync="updateDialogVisible"
                  size="large" >
                  <el-form label-width="50px" :model="updateForm">
                    <el-form-item label="标题">
                        <el-input v-model="updateForm.title"></el-input>
                    </el-form-item>
                    <el-form-item label="内容">
                        <el-input v-model="updateForm.content" type="textarea" size="large" :rows="10"></el-input>
                    </el-form-item>
                  </el-form>
                  <span slot="footer" class="dialog-footer">
                    <el-button @click="updateDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveStack">确 定</el-button>
                  </span>
                </el-dialog>
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
                updateForm : {
                    id : "",
                    title : "",
                    content : "",
                    createPerson : "",
                    createTime : ""
                }
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
            saveStack : function(){
                var _this = this;
                var time = new Date();
                var times = time.valueOf();
                var reqData = {
                    id : this.updateForm.id,
                    type : 1,
                    createTime : times ,
                    createPerson : 1 ,
                    title : this.updateForm.title,
                    content : this.updateForm.content
                }
                updateStack(reqData).then(response => {
                    let { status , data , msg} = response;
                    if (status == 0) {
                        _this.updateDialogVisible = false;
                        _this.$message.success("保存成功")
                        _this.getStackList();
                    }else{
                        _this.$message.error(msg)
                    }
                })
            }

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
        border-radius: 5px;
        border:  1px solid #d8d8d8;
    }
</style>
