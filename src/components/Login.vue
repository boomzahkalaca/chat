<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像 -->
      <div class="avatar_box">
        <img src="imgSrc" alt="">
      </div>
      <!-- 表单 -->
      <el-form ref="LoginFormRef" :model="loginVo" label-width="0"  class="login_form">
        <el-form-item prop="username">
          <!-- 用户名-->
          <el-input v-model="loginVo.studentId" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <!-- 密码-->
        <el-form-item prop="password">
          <el-input v-model="loginVo.password" prefix-icon="el-icon-lock" type="password"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="success" @click="goToSign">Register</el-button>
          <el-button type="primary" @click="login">Login</el-button>
          <el-button type="info" @click="resetLoginForm">Reset</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>




<script>
import axios from "axios";
export default {
  name: "Login",
  data(){
    return{
      loginVo:{
        studentId:'',
        password:''
      },
      student: {},
      imgSrc:''
    }
  },
  methods:{
    async login(){
      await axios.post("http://localhost:8080/user/login",this.loginVo).then(res=>{
        this.student=res.data.data["studentInfo"];
        localStorage.setItem("userInfo",JSON.stringify(this.student))
        if(!localStorage.getItem("invite")){
          let inviteMap = new Map();
          inviteMap.set(this.student.studentId,"null")
          let inviteObj=Object.fromEntries(inviteMap.entries())
          localStorage.setItem(this.student.studentId+"invite",JSON.stringify(inviteObj))
        }
        if(!localStorage.getItem("message")){
          let messageMap = new Map();
          messageMap.set(this.student.studentId,"null")
          let messageObj=Object.fromEntries(messageMap.entries())
          localStorage.setItem(this.student.studentId+"message",JSON.stringify(messageObj))
        }

        // if(localStorage.getItem("userImg")){
        //   var imgMap=JSON.parse(localStorage.getItem("userImg"));
        //
        //   if(!imgMap.get(this.student)){
        //     imgMap.set(this.student.studentId,this.student.imgSrc)
        //     localStorage.setItem("userImg",JSON.stringify(imgMap))
        //   }
        // } else{
        //   var imgMap = new Map();
        //   imgMap.set(this.student.studentId,this.student.imgSrc)
        //   console.log(imgMap)
        //   localStorage.setItem("userImg",JSON.stringify(imgMap))
        // }
        this.$router.push("/home/title")
      }).catch(reason => {
        console.log(reason)
          }
      )
    },
    goToSign(){
      this.$router.push("/register")
    },
    resetLoginForm() {
      this.$refs.LoginFormRef.resetFields()
    },
  },
  // mounted() {
  //   if(localStorage.getItem("userImg")){
  //     var map=JSON.parse(localStorage.getItem("userImg"))
  //   }
  //   while(this.loginVo.studentId!=""){
  //     if(map.get(this.loginVo.studentId)){
  //       this.imgSrc=map.get(this.loginVo.studentId)
  //     }
  //   }
  // }
}
</script>

<style lang="less" scoped>
.login_container{
  background-color: #2b4b6b;
  height: 100%;
}

.login_box{
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%)
}

.avatar_box{
  width: 130px;
  height: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left:50%;
  transform: translate(-50%,-50%);
  background-color: #fff;
  img{
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}

.login_form{
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.btns{
  display: flex;
  justify-content:flex-end;
}
</style>