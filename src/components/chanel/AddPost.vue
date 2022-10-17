<template>
  <div id="dark-bg">
  <el-avatar size="large" v-bind:src="user.imgSrc"></el-avatar>
  <el-input v-model="newPost"></el-input>
    <div id="options">
    <el-button class="cancel" @click="back">cancel</el-button>
    <el-button class="save" @click="save">save</el-button>
    </div>
</div>
</template>

<script>
export default {
  name: "addPost",
  data(){
    return{
      newPost:'',
      user:{}
    }
  },
  methods:{
    back(){
      this.$emit("back")
    },
    save(){
      if(this.newPost!=""){
        this.$emit("newPost",this.newPost)
      }

    }
  },
  mounted() {
    this.user=JSON.parse(localStorage.getItem("userInfo"))

  }
}
</script>

<style scoped>
.add{
  margin-left: 10%;
  border: 1px blue solid;
  width: 70%;
}
.add input{
  width:200px ;
  height: 40px;
}
.cancel{
  margin-left: 70%;
}
.save{
  margin-left: 20px;
}
#dark-bg {
  position: fixed;
  z-index: 1000;
  top: 0;
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: saturate(150%) blur(8px);
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

#dark-bg div:first-of-type {
  margin: 39vh 0;
  width: 80%;
}

/* #dark-bg > div.el-select > div.el-input > input.el-input__inner {
  border-radius: 20px;
  text-align: center;
  font-size: 1.2rem;
} */
ul.el-scrollbar__view>li {
  font-size: 1rem;
}

#options button {
  margin: 0 20px;
  border-radius: 20px;
  border: 2px solid #6C5FBC;
  color: white;
  background-color: #6C5FBC;
  box-shadow: rgba(0, 0, 0, 0.4) 0 0 10px;
  padding: 5px 15px;
  font-size: 1.2rem;
}

div.el-popper div.popper__arrow {
  left: 38vw;
}

#options button:first-of-type {
  background-color: white;
  color: #6C5FBC;
}
</style>