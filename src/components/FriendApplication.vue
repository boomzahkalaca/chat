<template>
  <div>
    <header>
      <div class="message">
        <span class="message-icon" @click="goBack">←</span>
      </div>
      <!-- <el-button class="message" @click="goBack"><i class="el-icon-back"></i> </el-button> -->
      <h1>Friend Application</h1>
    </header>
    <!-- <el-page-header @back="goBack" class="header">
      <template #content>
        <span class="text-large font-600 mr-3"> </span>
      </template>
    </el-page-header>
    <hr> -->

    <body class="contacts">
      <ul class="friends">
        <li class="contact" v-for="(friend,index) in applicationList" :key="index">
          <div class="one">
            <div class="online">
              <div class="img-proportion">
                <img v-bind:src="friend.imgSrc">
                <!-- <el-avatar v-bind:src="friend.imgSrc" shape="square" class="avatar"></el-avatar> -->
              </div>
            </div>
            <div class="text">
              <div class="infomation">
                <div class="name">
                  {{friend.name}}
                </div>
                <div class="country">
                  from: {{friend.country}}
                </div>
              </div>
              <div class="des"> Both like: {{friend.hobby}}</div>
            </div>
            <div class="button">
              <el-button class="check" @click="accept(friend.studentId)" size="small"><i class="el-icon-check"></i>
              </el-button>
              <el-button class="close" size="small"><i class="el-icon-close"></i> </el-button>
            </div>
          </div>
          <hr>
        </li>
      </ul>
    </body>
  </div>

</template>

<script>
import MainPageHeadTitle from "@/components/MainPageHeadTitle"
import axios from "axios";
export default {
  inject: ['reload'],
  name: "FriendApplication",
  components: { MainPageHeadTitle },
  data() {
    return {
      user: {},
      applicationList: []
    }
  },
  methods: {
    initInfo() {
      this.user = JSON.parse(localStorage.getItem("userInfo"));
    },
    getApplication() {
      let obj = JSON.parse(localStorage.getItem(this.user.studentId + "invite"));
      let map = new Map(Object.entries(obj));
      var temp = map.keys();
      var tempList = Array.from(temp);
      console.log(tempList)
      for (var i = 0; i < tempList.length; i++) {
        if (tempList[i] != this.user.studentId) {
          let tempObj = map.get(tempList[i])
          let userFrom = JSON.parse(tempObj[0].from)
          let getHobby = tempObj[0].content;
          console.log(getHobby[0])
          userFrom.hobby = getHobby[0]
          this.applicationList.push(userFrom)
        }
      }
    },
    async accept(student) {
      await axios.post("http://localhost:8080/user/addfriend", { myId: this.user.studentId, otherId: student }).then(res => {
        console.log(res)
      });
      for (let i = 0; i < this.applicationList.length; i++) {
        let tempObj = this.applicationList[i];
        if (tempObj.from == student) {
          this.applicationList.splice(i, 1)
        }
      }
      let obj = JSON.parse(localStorage.getItem(this.user.studentId + "invite"));
      let map = new Map(Object.entries(obj));
      map.delete(student)
      let newobj = Object.fromEntries(map.entries())
      localStorage.setItem(this.user.studentId + "invite", JSON.stringify(newobj))
      this.reload();
    },
    goBack() {
      this.$router.back();
    }
  },
  mounted() {
    this.initInfo();
    this.getApplication()
  }
}
</script>

<style scoped>
header {
  width: 85%;
  height: 75px;
  padding: 0 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  top: 0;
  margin: 4.5vh auto 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.25);
}

h1 {
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-size: 27px;
}

.message {
  width: 45px;
  height: 45px;
  border-radius: 15px;
  border: 1px solid rgba(75, 38, 118, 0.3);
  background-color: rgba(226, 217, 255, 0.5);
  position: relative;
  display: flex;
  align-items: center;
}

.message-icon {
  margin: auto;
  display: block;
  font-size: 1.4rem;
}

.contacts {
  height: calc(100vh - 5.5vh - 92px);
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  overflow-y: auto;
}

.friends {
  margin-left: 5vw;
  margin-right: 5vw;
  padding-left: 0;
  list-style: none;
  display: column;
}

.contact {
  height: 120px;
  display: block;
  flex-direction: row;
  color: #000000;
  font-size: 20px;
}

.contact>.one>.online {
  padding: 3px;
  border-radius: 25px;
}

.one {
  height: 80px;
  display: flex;
  flex-direction: row;
  color: #ffffff;
  font-size: 14px;
}

.online {
  border: 2px solid transparent;
  background-clip: padding-box, border-box;
  background-origin: padding-box, border-box;
  background-image: linear-gradient(to right, #ebebeb00, #ffffff00), linear-gradient(0deg, rgba(112, 79, 254, 1) 0%, rgba(254, 144, 99, 1) 100%);
}

.img-proportion {
  width: 72px;
  height: 72px;
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
  margin-right: 10px;
  flex-direction: column;
  width: 100%;
}

.information {
  height: 100%;
}

.name {
  font-size: 1.5em;
}

.country {
  font-size: 12px;
}

.des {
  margin-left: 0;
  position: relative;
  bottom: 0;
}

.button {
  right: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
}


.check {
  height: 44px;
  width: 44px;
}

.close {
  height: 44px;
  width: 44px;
}

.contact>hr {
  opacity: 0.4;
}

</style>