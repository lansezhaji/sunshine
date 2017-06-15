<template>
    <el-row class="myAccount">
        <el-row type="flex" justify="end">
            <el-col :span="2">
                <el-button type="text" @click="isEditMode = true">编辑</el-button>
            </el-col>
        </el-row>
        <el-row class="content">
            <el-form label-width="150px">
                <el-col :span="10">
                    <el-form-item label="账号：" class="userMessage">
                        <el-col v-if="isEditMode">
                            <el-input  v-model="userForm.account"></el-input>
                        </el-col>
                        <el-col v-else>
                            <span >{{userForm.account}}</span>                      
                        </el-col>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="密码：" class="userMessage">
                        <el-col v-if="isEditMode">
                            <el-input  v-model="userForm.password"> </el-input>
                        </el-col>
                        <el-col v-else>
                            <span >******</span>                        
                        </el-col>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="姓名：" class="userMessage">
                        <el-col v-if="isEditMode">
                            <el-input  v-model="userForm.userName"></el-input>
                        </el-col>
                        <el-col v-else>
                            <span >{{userForm.userName}}</span>                     
                        </el-col>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="角色：" class="userMessage">
                        <el-col v-if="isEditMode">
                            <el-select :disabled="true" v-model="userForm.role">
                                <el-option value="1" label="管理员"> </el-option>
                                <el-option value="2" label="普通用户"> </el-option>
                            </el-select>
                        </el-col>
                        <el-col v-else>
                            <span >{{userForm.role}}</span>                     
                        </el-col>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="状态：" class="userMessage">
                        <span >{{getUserStatus(userForm.status)}}</span>                        
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="上次登录时间：" class="userMessage">
                        <span >{{getLastLoginTime(userForm.lastLogin)}}</span>                        
                    </el-form-item>

                </el-col>  
                 
                            
            </el-form>
                
        </el-row>
       <el-row style="margin-top:40px" v-if="isEditMode">
            <el-col :offset="11">
                    <el-button @click="updateUserInfo">保 存</el-button>
                </el-col>
        </el-row>

    </el-row>


</template>
<script >
    import { getUserInfo } from '../../api/api';
    import { updateUserInfo } from '../../api/api';
    export default{
        data : function(){
            var data = {
                isEditMode : false,
                userForm:{
                    account:"",
                    status:1,
                    role : '1',
                    lastLogin : "1497437603111"
                },
                loginHistory: [ ],
                rules:{

                }
            }
            return data
        },
        methods:{
            debug:function(){
                debugger
            },
            /**
             * 获取用户基本信息
             * @return {[type]} [description]
             */
            getUserInfo : function(id){
                var that = this;
                var url = '/api/user/getUserInfo';
                var reqData = {
                    id : id
                }
                getUserInfo(reqData).then(response => {
                    let { msg, data, status } = response;
                      if (status == '0') {
                          that.userForm = data;
                      } else {
                          that.$message.error(msg);
                      }                     
                })
            },
            /**
             * 更新用户信息
             * @return {[type]} [description]
             */
            updateUserInfo : function(){
                var that = this;
                var url = '/api/user/updateUserInfo';
                var reqData = {
                    id :this.userForm.id,
                    account : this.userForm.account,
                    password : this.userForm.password,
                    userName : this.userForm.userName,
                    status : this.userForm.status,
                    role : this.userForm.role,
                }
                updateUserInfo(reqData).then(response => {
                    let { msg, data, status } = response;
                      if (status == '0') {
                          that.$message.success("修改成功!");
                          that.getUserInfo(this.userForm.id);
                          that.isEditMode = false;
                      } else {
                          that.$message.error(msg);
                      }                     
                })
            },
            /**
             * 获取用户状态
             * @param  {[type]} state [description]
             * @return {[type]}       [description]
             */
            getUserStatus : function(state){
                return state ? '启用' : '停用'
            },
            /**
             * 获取创建时间
             * @return {[type]} [description]
             */
            getLastLoginTime : function(timeT){
                if (timeT) {
                    var tms = parseInt(timeT);
                    var time = new Date(tms);
                    return time.toLocaleString();
                };
            }
        },
        beforeRouteEnter: function (to,from,next) {
          next(vm => {
            var user = sessionStorage.getItem('user');
            if (user) {
                user = JSON.parse(user);
                vm.getUserInfo(user.id);
            }
            

          });
        }
    }
</script>
<style>
    .content{
        margin-left: 20px;
        margin-top: 20px;
        padding: 20px;
        border: 1px solid #d1dbe5;
        border-radius: 4px;
        background-color: #fff;
        overflow: hidden;
    }
    .userMessage{
        text-align: left;
    }
    .history{
        line-height: 40px;
    }
    .history:hover{
        background-color: #eee;
    }
    .title{
        text-align:left;
        margin-bottom:30px;
        padding-left: 20px;
        background-color: #efefef;
        border-radius: 3px;
    }
</style>