<template>
  <div>
    <MainPageHeadTitle :theTitle="'Channels'" />
    <h2>Recommend friends <i>with similar hobbies</i></h2>
    <div id="hobbies">
      <div class="hobby" v-for="(hobby,index) in hobbyList" :key="index">
        <div class="friends">
          <div class="friend" v-for="(friend, index) in hobby[1]" :key="index">
            <div>
              <div class="gradient-border">
                <div class="img-proportion">
                  <img v-bind:src="friend.imgSrc" alt="" @click="goToProfile(friend.studentId)">
                </div>
              </div>
              <div class="friend-info">
                <p>{{ friend.name }}</p>
                <p>From {{ friend.country }}</p>
              </div>
            </div>
            <el-button :disabled="friend.isAdd" class="addFriendBtn" @click="addFriend(friend, hobby)"><i class="el-icon-plus"></i></el-button>

          </div>
          <!-- FOR TESTING below -->
          <!-- <div class="friend" v-for="i in 5" :key="i">
            <div>
              <div class="gradient-border">
                <div class="img-proportion">
                  <img src="http://iph.href.lu/100x100" alt="">
                </div>
              </div>
              <div class="friend-info">
                <p>Trump</p>
                <p>From America</p>
              </div>
            </div>
            <button class="addFriendBtn"><i class="el-icon-plus"></i></button>
          </div> -->
        </div>
        <h3>{{ hobby[0] }}</h3>
      </div>
    </div>

    <h2>Topics</h2>
    <div id="topics">
      <div class="topic" v-for="(topic, index) in channelList" :key="index">
        <div>
          <div class="img-proportion">
            <img v-bind:src="topic.img" alt="">
          </div>
          <div class="topic-info">
            <h3>{{topic.name}}</h3>
            <p>Day by day and every day, I'm getting better and better</p>
          </div>
        </div>
        <button class="goToBtn" @click="goToshare(topic.name,topic.img)"><i class="el-icon-right"></i></button>
      </div>

    </div>
    <Navi :current="'Chanel'" />
  </div>

</template>

<script>
import MainPageHeadTitle from "@/components/MainPageHeadTitle";
import Navi from "@/components/Navi";
import axios from "axios";
export default {
  name: "Chanel",
  components: { MainPageHeadTitle, Navi },
  data() {
    return {
      user: {},
      randomFriend: {},
      hobbyList: [],
      socket: {},
      channelList: [
        {
          name: "Daily Life",
          img: require("../../../public/static/img/DailyLife.jpeg")
        },
        {
          name: "Learning Discussion",
          img: require("../../../public/static/img/LearningDiscussion.jpeg")
        },
        {
          name: "Traditional Culture",
          img: require("../../../public/static/img/TraditionalCulture.jpeg")
        },
        {
          name: "Local Discovery",
          img: require("../../../public/static/img/LocalDiscovery.jpeg")
        }
      ]
    }

  },
  methods: {
    getUser() {
      this.user = JSON.parse(localStorage.getItem("userInfo"))
    },
    async getRandomFriend() {
      await axios.get("http://localhost:8080/channel/getfriends?studentId=" + this.user.studentId).then(res => {
        this.randomFriend = res.data.data["randomFriend"]
      })
      this.hobbyList = Object.entries(this.randomFriend);
      console.log(this.hobbyList)
      for(var i=0;i<this.hobbyList.length;i++) {
        if (this.hobbyList[i][1].length != 0) {
          let temp = this.hobbyList[i][1]
          console.log(temp)
          for (var u = 0; temp.length; u++) {
            this.$set(temp[u], "isAdd", false)
          }
        }
      }
    },
    goToProfile(id){
      this.$router.push({
        name:"other",
        params:{
          id:id
        }
      })
    },
    goToApp() {
      this.$router.push("/home/application")
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
    addFriend(o, item) {
      const socketMessage = {
        from: JSON.stringify(this.user),
        to: JSON.stringify(o),
        content: item,
        type: "add",
        time: new Date().getTime(),
        isRead: true
      }
      this.$set(o,"isAdd",true)
      if (this.socket) {
        this.socket.send(JSON.stringify(socketMessage))
        this.$alert({
          message: 'Friend application has been sent',
          confirmText: 'Confirm'
        }).then(action => {
          console.log(`点击了${action}`)
        }).catch(action => {
          console.log(`点击了${action}`)
        })
      }
    },
    goToshare(topic, src) {
      this.$router.push({
        name: "watch",
        params: {
          topicSelected: topic,
          img: src
        }
      })
    }
  },
  async mounted() {
    this.getUser();
    this.initSocket()
    await this.getRandomFriend();
    console.log(this.user.studentId)

  }
}
</script>

<style scoped>
h2 {
  font-size: 1.2rem;
  color: white;
  margin-left: 30px;
  margin-top: 0;
}
h2 > i {
  font-size: 0.5rem;
  font-weight: lighter;
}

#hobbies {
  width: calc(100vw - 40px);
  padding: 0 20px;
  height: 73vw;
  white-space: nowrap;
  overflow: auto;
}
#hobbies::-webkit-scrollbar {
  width: 0;
}

.hobby {
  width: 62vw;
  height: 100%;
  display: inline-block;
}
.hobby h3 {
  text-align: center;
  color: white;
  font-size: 1rem;
  font-weight: normal;
}
.friends {
  background-color: rgba(240, 241, 255, 0.58);
  border: 1px solid rgba(255, 255, 255, 0.6);
  margin-left: 20px;
  height: 85%;
  border-radius: 30px;
  box-shadow: rgba(255, 255, 255, 0.25) 0 0 20px;
  overflow-y: auto;
}

.friends::-webkit-scrollbar {
  width: 0;
}

.friend {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 90%;
  margin: 10px;
  height: 4rem;
}

.friend > div {
  display: flex;
  align-items: center;
  height: 80%;
  flex: 0 0 80%;
}

.friend-info p:first-of-type {
  font-weight: bold;
  color: #361361;
  margin: 0;
  font-size: 1.1rem;
}
.friend-info p:last-of-type {
  color: #A27DFF;
  margin: 0;
  font-size: 0.7rem;
}

.gradient-border {
  height: 90%;
  width: 29%;
  margin: 5px;
  padding: 3px;
  border-radius: 18px;
  border: 2px solid transparent;
  background-clip: padding-box, border-box;
  background-origin: padding-box, border-box;
  background-image: linear-gradient(to right, #e8e2fe, #e8e2fe), linear-gradient(0deg, rgba(112, 79, 254, 1) 0%, rgba(254, 144, 99, 1) 100%);
}

.gradient-border > div {
  width: 100%;
  padding-bottom: 100%;
  position: relative;
  overflow: hidden;
  border-radius: 13px;
}

.addFriendBtn {
  width: 20px;
  height: 20px;
  border-radius: 30px;
  background-color: #6C5FBC;
  box-shadow: rgb(0, 0, 0, 0.25) 0 0 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  border: none;
  font-size: 0.7rem;
  font-weight: bold;
  flex: 0 0 10%;
  border: 1px black solid;
}
.addedBtn{
  width: 20px;
  height: 20px;
  border-radius: 30px;
  background-color: #6C5FBC;
  box-shadow: rgb(0, 0, 0, 0.25) 0 0 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  border: none;
  font-size: 0.7rem;
  font-weight: bold;
  flex: 0 0 10%;
  transition: all 0.25s ease-in-out;

}

#topics {
  margin: 1rem auto 10vh;
  width: 83%;
  padding-right: 20px;
}
.topic {
  width: 100%;
  height: 31vw;
  display: flex;
  align-items: center;
  background-color: rgba(240, 241, 255, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: rgba(255, 255, 255, 0.25) 0 0 20px;
  margin: 13px 0;
  border-radius: 28px;
}

.topic > div {
  display: flex;
  align-items: flex-start;
  flex: 0 0 95%;
}

.topic .img-proportion {
  flex: 0 0 27%;
  height: 0;
  padding-bottom: 27%;
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  box-shadow: rgba(0, 0, 0, 0.5) 0 0 7px;
  margin-left: 16px;
}

.topic .img-proportion>img,
.gradient-border > div > img {
  height: 100%;
  position: absolute;
  right: 0%;
}

.topic-info {
  flex: 0 0 65%;
  /* height: 80%; */
  margin-left: 11px;
}
.topic-info h3{
  margin: 0 0 5px 0;
  padding: 0;
  font-size: 1.03rem;
  font-weight: bold;
  color: #361361;
}
.topic-info p{
  margin: 0;
  padding: 0;
  font-size: 0.6rem;
  font-weight: bold;
  color: #654DCA;
}
.goToBtn {
  width: 36px;
  height: 36px;
  border-radius: 30px;
  background-color: #6C5FBC;
  box-shadow: rgb(0, 0, 0, 0.45) -1px 3px 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-right: 7px;
  border: none;
  flex: 0 0 auto;
}
.goToBtn > i {
  font-size: 1.2rem;
}
.time {
  font-size: 12px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button {
  padding: 0;
  min-height: auto;
}
</style>