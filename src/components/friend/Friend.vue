<template>
  <div>
    <MainPageHeadTitle :theTitle="'Friend'" />
    <!-- <div class="title">
      <h1 >Friend</h1>
      <el-button class="message" @click="goToApp"><i class="el-icon-message"></i> </el-button>
    </div>
    <hr> -->

    <body class="contacts">
      <ul class="friends">
        <li class="contact" v-for="(friend,index) in friendInfoList" :key="index" @click="getInChat(friend)">
          <div class="one">
            <div class="online">
              <div class="img-proportion">
                <img v-bind:src="friend.imgSrc">
                <!-- <el-avatar v-bind:src="friend.imgSrc" shape="square" size="large" class="img"></el-avatar> -->
              </div>
            </div>
            <div class="text">
              <div class="name">
                {{friend.name}}
              </div>
              <br>
              <div class="country">
                From: {{friend.country}}
              </div>
            </div>
          </div>
          <hr>
        </li>
      </ul>
    </body>

    <Navi :current="'Friend'" />
  </div>
</template>

<script>
import Navi from "@/components/Navi"
import MainPageHeadTitle from "@/components/MainPageHeadTitle"
import axios from 'axios'
export default {
  name: "friend",
  components: { MainPageHeadTitle, Navi },
  data() {
    return {
      friendList: [],
      friendInfoList: [],
      user: {}
    }
  },
  methods: {
    async getFriends(sId) {
      await axios.get("http://localhost:8080/user/friend?studentId=" + sId).then(res => {
        this.friendList = res.data.data["friend"];
      })
    },
    async getInfo(sId) {
      await axios.get("http://localhost:8080/user/getinfo?studentId=" + sId).then(res => {
        var stu = res.data.data["info"]
        this.$set(stu,"lastMessage","")
        var messageObj=JSON.parse(localStorage.getItem(this.user.studentId+"message"));
        let messageMap = new Map(Object.entries(messageObj));
        if(messageMap.get(sId)){
          let messageList = messageMap.get(sId);
          let lastMessage=messageList[messageList.length-1];
          this.$set(stu,"lastMessage",lastMessage.content)
        }
        this.friendInfoList.push(stu);
      })
    },
    getInChat(target) {
      this.$router.push({
        name: "chat",
        params: {
          target: JSON.stringify(target),
        }
      }
      )
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
    goToApp() {
      this.$router.push("/home/application")
    }
  },
  async mounted() {
    this.user = JSON.parse(localStorage.getItem("userInfo"))
    this.initSocket()
    await this.getFriends(this.user.studentId);
    for (var i = 0; i < this.friendList.length; i++) {
      await this.getInfo(this.friendList[i])
    }
    console.log(this.friendInfoList);
  }
}
</script>

<style scoped>
.contacts {
  height: 83vh;
  max-height: 100%;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  overflow-y: auto;
}

.friends {
  list-style: none;
  margin-right: 10%;
  margin: 0 20px;
  display: column;
  /* grid-template-columns: 1fr 1fr 1fr; */
  /* column-gap: 20px; */
  padding: 0;
}

.contact {
  display: block;
  width: 100%;
  list-style: none;
  text-align: center;
  padding: 10px 5px 0px;
}

.one {
  height: 80px;
  display: flex;
  flex-direction: row;
  color: #ffffff;
  font-size: 14px;
}

.contact>.one>.online {
  padding: 3px;
  border-radius: 25px;
}

.online {
  border: 2px solid transparent;
  background-clip: padding-box, border-box;
  background-origin: padding-box, border-box;
  background-image: linear-gradient(to right, #ebebeb00, #ffffff00), linear-gradient(0deg, rgba(112, 79, 254, 1) 0%, rgba(254, 144, 99, 1) 100%);
}

.img-proportion {
  width: 72px;
  height: 100%;
  /* padding-bottom: 100%; */
  position: relative;
  overflow: hidden;
  border-radius: 20px;
}

.img-proportion>img {
  width: 100%;
  position: absolute;
  right: 0%;
}

.text {
  margin-left: 10px;
  margin-top: 2px;
  padding: 0px;
}

.text>div{
  margin: 0 ;
  align-items: center;
  display:flex;
}

.name {
  font-size: 1.5em;
}

.country {
  font-size: 12px;
}

.contact>hr {
  opacity: 0.4;
}




/* .title{
  display: flex;
  flex-direction: row;
}

.message{
  margin-left: 80%;
} */
</style>