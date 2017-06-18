<template>
    <section class="chart-container">
        <el-row>
           <!-- <el-button @click="getStackList">获取列表</el-button> -->
	       <!-- <el-button @click="debug">debug</el-button> -->
        </el-row>
       
        <el-row v-if="isEditMode">
        	<el-row>
	         	<el-form :model="stackForm" ref="stackForm" :rules="rules">
	        		<el-form-item prop="title">
			        	请输入文章标题：
			        	<el-input v-model="stackForm.title" placeholder="50字以内"></el-input>	
	        		</el-form-item>
	        		<el-form-item prop="content">
	        			请输入文章内容：
	        			<quill-editor ref="myTextEditor"
							v-model="stackForm.content"
							:max-length="20"
							placeholder="2000字以内"
	        			></quill-editor>
	        		</el-form-item>
	        		<el-col>
	        			您还可以输入{{2000-stackForm.content.length}}字  
	        		</el-col>
	        	</el-form>       		
        	</el-row>

        	<el-row type="flex" justify="center">
        		<el-col :span="2">
        			<el-button type="default" @click="previewStack">预 览</el-button>
        		</el-col>
        		<el-col :span="2">
        			<el-button  type="primary" @click="saveStack">保 存</el-button>
        		</el-col>
        	</el-row>
        </el-row>
        <el-row v-else>
        	
        	<el-row>
        		<el-col style="text-align:center;border-bottom:1px solid lightgray">
        			<h2>{{stackForm.title}}</h2>
        		</el-col>
        		
        	</el-row>
        	<el-row>
        		<div id="stackContent">
        		</div>
        	</el-row>
        	<el-row >
        		<el-col :offset="10" :span="2">
    				<el-button @click="isEditMode = true" type="primary">取消预览</el-button>
        		</el-col>
    		</el-row>
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
            	isEditMode :true,
            	stackForm:{
            		title : "",
            		content : ""
            	},
            	rules:{
            		title : [{required:true,message:"标题不能为空",trigger:'change,blur'}],
            		content : [{required:true,message:"内容不能为空",trigger:'change,blur'}],
            	
            	}
            }
        },

        methods: {
            debug : function(){
                debugger
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
             * 预览
             * @return {[type]} [description]
             */
            previewStack : function(){
            	this.isEditMode = false;
            	var _this = this;
            	setTimeout(function(){
            		$("#stackContent").html(_this.stackForm.content)
            	},300)
            },
            /**
             * 更新数据
             * @param  {[type]} stack [description]
             * @return {[type]}       [description]
             */
            updateStack :function(stack){
                this.updateDialogVisible = true;
                this.stackForm = stack || {}
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
                    id : null,
                    type : 1,
                    createTime : times ,
                    createPerson : 1 ,
                    title : this.stackForm.title,
                    content : this.stackForm.content
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
            },

        },
        beforeRouteEnter: function (to,from,next) {
          next(vm => {
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
