
<template>
  <div class="login_container">
    <el-upload
        ref="upload"


        :limit="1"
        :on-exceed="handleExceed"
        :auto-upload="false"
    >
      <template #trigger>
        <el-button type="primary">select file</el-button>
      </template>
      <el-button  type="success" @click="submitUpload">
        upload to server
      </el-button>
      <template #tip>
        <div class="el-upload__tip text-red">
          limit 1 file, new file will cover the old file
        </div>
      </template>
    </el-upload>
  </div>
</template>


<script>

export default {
  name: "test",
  data(){
    return{
      loginForm:{
        username:'',
        password:''
      },
    }
  },
  methods:{
    getImg(){
      if(localStorage.getItem("userImg")){
        console.log("yes")
      }else{
        console.log("no")
      }
    }
  },
  mounted() {
    this.getImg()

  }
}
</script>

<style scoped>
.wxchatPeople {

  color: #000000;

  font-size: 14px;

}

</style>
