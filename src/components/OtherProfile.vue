<template>
  <div>
    <SubPageHeadTitle :theTitle="Profile"/>
    <div id="pro">
      <div id="intro">
        <div id="basic">
          <h2>{{user.name}}</h2>
          <p>From: {{user.country}}</p>
        </div>
        <div id="avatar"><img :src="user.imgSrc" /></div>
      </div>

      <h3>About</h3>
      <p id="description">{{ description }}</p>
      <div id="hobbies">
        <button class="tag" v-show="hobbyList.length==0">The user has not added a hobby</button>
        <button  class="tag"  v-for="(item,index) in hobbyList" :key="index">{{ item }}</button>
      </div>
    </div>
    <div id="page">
      <h2>Post</h2>
      <div class="one" v-show="!mapKeys.length">The user has not added a post</div>
      <div v-for="(topic,index) in mapKeys" :key="index" class="test">
        <h3>@{{topic}}</h3>
        <ul class="friends">
          <li class="one" v-for="(post,index) in postMap.get(topic)" :key="index">
            <div>{{post.post}}</div>
          </li>
        </ul>
      </div>
      <el-button size="small" :disabled="!isFriend" class="del" @click="deleteFriend">Delete Friend</el-button>
      <el-button size="small" :disabled="isFriend" @click="addFriend" v-show="!isAdd">Add Friend</el-button>
      <el-button size="small" disabled  v-show="isAdd">Add Friend</el-button>
    </div>

  </div>
</template>

<script>
import SubPageHeadTitle from "@/components/SubPageHeadTitle";


import axios from "axios";
export default {
  inject:['reload'],
  name: "OtherProfile",
  components:{SubPageHeadTitle},
  data(){
    return{
      user:null,
      hobbyList:[],
      postMap:new Map(),
      mapKeys:[],
      id:"",
      loginUser:{},
      friendList:[],
      isFriend:false,
      socket:{},
      isAdd:false,
      description:''
    }
  },
  methods:{
    async getHobby(){
      await axios.get("http://localhost:8080/hobby/get?studentId="+this.id).then(res=>{
        this.hobbyList=res.data.data["hobbies"]
      })
    },

    async getMyPost(){
      await axios.get("http://localhost:8080/channel/getmypost?studentId="+this.id).then(res=>{
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
      })
      this.mapKeys=Array.from(this.postMap.keys())
    },
    async getInfo(){
      await axios.get("http://localhost:8080/user/getinfo?studentId="+this.id).then(res=>{
        this.user=res.data.data["info"]
      })
    },
    async ifFriend(){
      await axios.get("http://localhost:8080/user/friend?studentId="+this.loginUser.studentId).then(res=>{
        this.friendList=res.data.data["friend"];
        if(this.friendList.indexOf(this.id)!=-1){
          this.isFriend=true;
        }
      })
    },
    async deleteFriend(){
      await axios.post("http://localhost:8080/user/deletefriend",{myId:this.loginUser.studentId,friendId:this.id}).then(res=>{
        console.log(res)
      })
      this.$router.push("/home/title")
    },
    addFriend(){
      const socketMessage={
        from:JSON.stringify(this.loginUser),
        to:JSON.stringify(this.user),
        content:"",
        type:"add",
        time:new Date().getTime(),
        isRead:true,
      }
      this.isAdd=true;
      console.log("yes")
      if(this.socket){
        this.socket.send(JSON.stringify(socketMessage))

      }
    },
    async initSocket(){
      console.log("连接")
      var that=this;
      this.socket=new WebSocket('ws://127.0.0.1:8080/chat/'+this.loginUser.studentId);
      await new Promise((resolve)=>{
        this.socket.onopen=function (e){
          resolve(e.data)
        }
      });
      this.socket.onmessage=function (msg) {
        var temp = JSON.parse(msg.data);
        var from = JSON.parse(temp.from);
        var type=temp.type;
        console.log(temp)
        if(type=="text"){
          var messageObj=JSON.parse(localStorage.getItem(that.user.studentId+"message"));
          let messageMap = new Map(Object.entries(messageObj));
          if(!messageMap.get(from.studentId)){
            var newList=[];
            newList.push(temp)
            messageMap.set(from.studentId,newList);
          } else {
            var oldList=messageMap.get(from.studentId)
            oldList.push(temp)
            messageMap.set(from.studentId,oldList);
          }
          let newMessageObj=Object.fromEntries(messageMap.entries())
          localStorage.setItem(that.user.studentId+"message",JSON.stringify(newMessageObj))
        } else {
          var inviteObj=JSON.parse(localStorage.getItem(that.user.studentId+"invite"));
          let inviteMap = new Map(Object.entries(inviteObj));
          if(!inviteMap.get(from.studentId)){
            var newList=[];
            newList.push(temp)
            inviteMap.set(from.studentId,newList);
          } else {
            var oldList=inviteMap.get(from.studentId)
            oldList.push(temp)
            inviteMap.set(from.studentId,oldList);
          }
          let newInviteObj=Object.fromEntries(inviteMap.entries())
          localStorage.setItem(that.user.studentId+"invite",JSON.stringify(newInviteObj))
        }
      }
    },
    async getDes(){
      await axios.get("http://localhost:8080/user/getdes?studentId="+this.id).then(res=>{
        this.description=res.data.data["des"];
      })
    },
  },


  async mounted() {
    this.loginUser=JSON.parse(localStorage.getItem("userInfo"))
    this.id=this.$route.params.id;
    await this.getInfo();
    await this.getHobby();
    await this.getMyPost();
    await this.ifFriend();
    this.initSocket()


  }
}
</script>

<style scoped>
#pro img{
  height: 150px;
  width: 150px;
}
.friends{
  list-style: none;

}
.one{
  height: 80px;
  display: flex;
  flex-direction: row;
  color: #000000;
  font-size: 14px;
}
.post{
  margin-left: 10%;
}
.userinfo{
  width: 100px;
  margin-left: 2%;
}
.delete{
  margin-top: 50px;
  margin-left: 70%;
}
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

.tag{
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
  height: auto;
}

.userinfo {
  width: 100px;
  margin-left: 2%;
}
.del{
  margin-top: 10%;
  margin-left: 35%;

}

</style>