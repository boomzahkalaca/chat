<template>
  <div>
    <MainPageHeadTitle :theTitle="'Profile'" />
    <div id="pro">
      <div id="intro">
        <div id="basic">
          <h2>{{user.name}}</h2>
          <p>From: {{user.country}}</p>
        </div>
        <div id="avatar"><img :src="user.imgSrc" /></div>
        <el-button @click="getFile"  size="small" circle type="info">
          <i class="el-icon-upload"></i>&nbsp;
        </el-button>
        <input type="file" ref="file" style="display: none;" v-on:change="handleFileUpload($event)">
      </div>

      <h3>About me <i @click='addPost' class="el-icon-edit"></i></h3>
      <p id="description">{{description}}</p>
      <div id="hobbies">
        <el-popover class="tag" :visible="showDelete" placement="top" :width="160" v-for="(item,index) in hobbyList"
          :key="index">
          <p>Are you sure to delete this?</p>
          <div style="text-align: right; margin: 0">
            <el-button id="cancelBtn" size="small" type="text" @click="close">cancel</el-button>
            <el-button id="confirmBtn" size="small" type="primary" @click="deleteHobby(item)">confirm</el-button>
          </div>
          <template #reference>
            <el-button @click="showDelete=true">{{ item }}</el-button>
          </template>
        </el-popover>
        <el-button id="addBtn" @click.native="addHobby"><i class="el-icon-plus"></i></el-button>
      </div>
      <AddHobby v-show="inputShow" @back="back" @newHobby="sumbitHobby"></AddHobby>

    </div>
    <div id="page">
      <h2>My Post</h2>
      <div v-for="(topic,index) in mapKeys" :key="index">
        <h3>@{{topic}}</h3>
        <ul class="friends">
          <el-popover class="tag" :visible="showDelete" placement="top" :width="160" v-for="(post,index) in postMap.get(topic)" :key="index">
            <p>Are you sure to delete this?</p>
            <div style="text-align: right; margin: 0">
              <el-button id="cancelBtn" size="small" type="text" @click="close">cancel</el-button>
              <el-button id="confirmBtn" size="small" type="primary" @click="deletePost(post.post)">confirm</el-button>
            </div>
            <template #reference>
          <li class="one" >
            <div>{{post.post}}</div>
          </li>
            </template>
          </el-popover>
        </ul>
      </div>
    </div>
    <AddPost v-show="showAdd" @back="added" @newPost="sumbitDes"></AddPost>
    <Navi :current="'Profile'" />
  </div>
</template>

<script>
import AddHobby from "@/components/Profile/AddHobby";
import MainPageHeadTitle from "@/components/MainPageHeadTitle";
import Navi from "@/components/Navi";
import axios from "axios";
import AddPost from "@/components/chanel/AddPost";
export default {
  inject: ['reload'],
  name: "profile",
  components: { AddHobby, MainPageHeadTitle, Navi ,AddPost},
  data() {
    return {
      user: {},
      hobbyList: [],
      inputShow: false,
      newHobby: "",
      showDelete: false,
      postMap: new Map(),
      mapKeys: [],
      description:'',
      showAdd:false,
    }
  },
  methods: {
    async sumbitDes(data){
      await axios.post("http://localhost:8080/user/adddes",{id:this.user.studentId,des:data}).then(res=>{
        console.log(res);
        if (res.data["success"] == true) {
          this.showAdd = false
        }
      })
      this.reload();
    },
    addPost() {
      this.showAdd = true;
    },
    added(){
      this.showAdd = false;
      this.reload();
    },
    async deletePost(delPost){
      await axios.post("http://localhost:8080/channel/deletepost",{studentId:this.user.studentId,post:delPost}).then(res=>{
        console.log(res)
      })
      this.showDelete=false
      this.reload();
    },
    async getDes(){
      await axios.get("http://localhost:8080/user/getdes?studentId="+this.user.studentId).then(res=>{
        this.description=res.data.data["des"];
      })
    },
    async getHobby() {
      await axios.get("http://localhost:8080/hobby/get?studentId=" + this.user.studentId).then(res => {
        this.hobbyList = res.data.data["hobbies"]
      })
    },
    async addHobby() {
      this.inputShow = true;
    },
    back() {
      this.inputShow = false;
    },
    async sumbitHobby(data) {
      this.newHobby = data;
      await axios.post("http://localhost:8080/hobby/add", { studentId: this.user.studentId, hobby: this.newHobby }).then(res => {
        if (res.data.data["success"] == true) {
          this.hobbyList.push(this.newHobby)
        }
      })
      this.inputShow = false;
      this.getHobby();
    },
    goToApp() {
      this.$router.push("/home/application")
    },
    async deleteHobby(delHobby){
      await axios.post("http://localhost:8080/hobby/delete",{studentId:this.user.studentId,hobby:delHobby}).then(res=>{
        if(res.data.data["success"]==true){
          this.hobbyList.reverse(delHobby);
        }
      })
      this.showDelete=false
      this.reload();
    },
    close(){
      this.showDelete=false;
      this.reload();
    },
    getFile(){
      this.$refs.file.click()
    },
    handleFileUpload(event){
      // 阻止发生默认行为
      event.preventDefault();
      let formData = new FormData()
      let file = this.$refs.file.files[0]
      formData.append('file',file)
      formData.append("studentId",this.user.studentId)
      // console.log(formData.get('file'))
      this.onUpload(formData);
      this.reload();
      this.reload();
    },
    onUpload(formData){
      const config={
        headers:{
          'Content-Type': 'multipart/form-data'
        }
      }
      axios.post("http://localhost:8080/file/upload",formData,config).then(res=>{
        console.log(res)
      })
    },
    async getMyPost(){
      await axios.get("http://localhost:8080/channel/getmypost?studentId="+this.user.studentId).then(res=>{
        console.log(res.data.data["myPost"])
        var temp=res.data.data["myPost"];
        for(var i=0;i<temp.length;i++){
          this.postMap.set(temp[i].topic,[])
        }
        for(var u=0;u<temp.length;u++){
          var storeList=this.postMap.get(temp[u].topic);
          storeList.push(temp[u]);
          this.postMap.set(temp[u].topic,storeList);
        }
      });
      this.mapKeys=Array.from(this.postMap.keys())
},
    async initSocket() {
      var that = this;
      this.socket = new WebSocket('ws://127.0.0.1:8080/chat/' + this.user.studentId);
      await new Promise((resolve) => {
        this.socket.onopen = function (e) {
          resolve(e.data)
        }
      });
      this.socket.onmessage = function (msg) {
        var temp = JSON.parse(msg.data);
        var from = JSON.parse(temp.from);
        var type = temp.type;
        console.log(temp)
        if (type == "text") {
          var messageObj = JSON.parse(localStorage.getItem(that.user.studentId + "message"));
          let messageMap = new Map(Object.entries(messageObj));
          if (!messageMap.get(from.studentId)) {
            var newList = [];
            newList.push(temp)
            messageMap.set(from.studentId, newList);
          } else {
            var oldList = messageMap.get(from.studentId)
            oldList.push(temp)
            messageMap.set(from.studentId, oldList);
          }
          let newMessageObj = Object.fromEntries(messageMap.entries())
          localStorage.setItem(that.user.studentId + "message", JSON.stringify(newMessageObj))
        } else {
          var inviteObj = JSON.parse(localStorage.getItem(that.user.studentId + "invite"));
          let inviteMap = new Map(Object.entries(inviteObj));
          if (!inviteMap.get(from.studentId)) {
            var newList = [];
            newList.push(temp)
            inviteMap.set(from.studentId, newList);
          } else {
            var oldList = inviteMap.get(from.studentId)
            oldList.push(temp)
            inviteMap.set(from.studentId, oldList);
          }
          let newInviteObj = Object.fromEntries(inviteMap.entries())
          localStorage.setItem(that.user.studentId + "invite", JSON.stringify(newInviteObj))
        }
      }
    },
  },
  async mounted() {
    this.user=JSON.parse(localStorage.getItem("userInfo"));
    this.initSocket();
    await this.getHobby();
    await this.getDes();
    await this.getMyPost();

  }
}
</script>


<style scoped>
#intro {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  width: calc(100vw - 50px);
  padding: 0 25px;
}

#basic {
  flex: 0 0 66%;
  color: rgba(255, 255, 255, 0.9);
}

#basic h2 {
  font-size: 1.4rem;
  margin: 0;
}

#basic p {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

#avatar {
  flex: 0 0 30%;
  height: 0;
  padding-bottom: 30%;
  position: relative;
  overflow: hidden;
  border-radius: 20px;
}

#avatar>img {
  width: 100%;
  position: absolute;
  right: 0%;
}

#pro h3 {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  padding: 0 25px;
  margin-bottom: 0;
}

#description {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.8rem;
  padding: 0 25px;
  margin-top: 5px;
}

.tag button,
#addBtn {
  background-color: rgba(226, 217, 255, 0.35);
  padding: 5px 10px;
  margin-left: 5px;
  border-radius: 15px;
  border: 1px solid rgba(197, 178, 255, 0.8);
  color: white;
  font-size: 13px;
}
#hobbies {
  width: calc(100vw - 40px);
  padding: 0 20px;
  height: 55px;
  white-space: nowrap;
  overflow: auto;
}
#hobbies::-webkit-scrollbar {
  width: 0;
}
#confirmBtn {
  border-radius: 20px;
  color: white;
  border: none;
  background-color: #6C5FBC;
  box-shadow: rgba(0, 0, 0, 0.2) 0 0 10px;
  padding: 3px 7px;
  font-size: 0.9rem;
}
#cancelBtn {
  font-size: 0.9rem;
  color: #6C5FBC;
}


#page {
  background-color: #e8e2fe;
  border-radius: 45px 45px 0 0;
  height: 50vh;
  width: calc(100vw - 50px);
  padding: 0 25px;
  position: fixed;
  overflow-y: auto;
  bottom: 0;
  padding-bottom: 10vh;
  box-shadow: rgba(0, 0, 0, 0.3) 0 5px 15px;
}

#page h2 {
  font-size: 1.3rem;
  margin-bottom: 0;
}

#page h3 {
  color: #6C5FBC;
  margin: 0.5rem 0;
  font-size: 1.1rem;
}


.friends {
  list-style: none;
  padding-left: 18px;
}

.one {
  /* height: 80px;
  display: flex;
  flex-direction: row; */
  color: black;
  font-size: 1rem;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(100, 100, 100, 0.1);
}

.userinfo {
  width: 100px;
  margin-left: 2%;
}
.upload{

  width: 1px;
  height: 2px;
}
</style>