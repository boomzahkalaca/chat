<template>
  <div style="height: 90vh;">
    <MainPageHeadTitle :theTitle="'Home'" />

    <div id="tabs">
      <button class="course" v-for="(courseCode,index) in courseList" @click="getStudent(courseCode,index)"
        :key="index" :class="{'active':activeCourse==index}">
        {{courseCode}}
      </button>
      <button class="course" @click="addCourse">
        <i class="el-icon-plus"></i>
      </button>
    </div>

    <div id="page">
      <ul id="stu-grid">
        <li class="stu" v-for="(student,index) in studentList" :key="index" >
          <div class="online">
            <div class="img-proportion" @click="goToProfile(student.studentId)">
              <img v-bind:src="student.imgSrc" alt=""><br>
            </div>
          </div>
          <p>{{student.name}}</p>
          <p>{{`(${student.country})`}}</p>
        </li>
      </ul>
      <el-button class="drop" size="small" type="info" @click="deleteCourse">Drop Course</el-button>
    </div>
    <Navi :current="'Home'" />
  </div>

</template>

<script>
import MainPageHeadTitle from "@/components/MainPageHeadTitle";
import Navi from "@/components/Navi"
import axios from 'axios'
export default {
  inject: ['reload'],
  name: "title",
  components: { Navi, MainPageHeadTitle },
  data() {
    return {
      courseList: [],
      studentList: [],
      activeCourse: 0,
      user: {},
      curCourse: '',
      socket: {}
    }
  },
  methods: {
    async deleteCourse(){
      this.$alert({
        message: 'Do you really want to drop this course',
        cancelText:"Cancel",
        confirmText: 'Confirm',
        showCancel:true
      }).then(async action => {
        console.log(`点击了${action}`)
        await axios.post("http://localhost:8080/course/delete",{studentId:this.user.studentId,courseId:this.curCourse}).then(res=>{
          console.log(res);
        })
        this.reload();
      }).catch(action => {
        console.log(`点击了${action}`)
      })


    },
    async getCourse(sId) {
      await axios.get("http://localhost:8080/user/courseList?studentId=" + sId).then(res => {
        this.courseList = res.data.data["courseList"];
        this.curCourse = this.courseList[0]
      })
    },
    async getStudent(cId, index) {
      this.curCourse = cId
      this.activeCourse = index;
      await axios.get("http://localhost:8080/user/studentList?courseId=" + cId).then(res => {
        this.studentList = res.data.data["studentList"];
        console.log(res)
      })
    },
    addCourse() {
      this.$router.push("/home/addCourse/field")
      console.log(this.$router)
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
  },
  async mounted() {
    this.user = JSON.parse(localStorage.getItem("userInfo"))
    await this.getCourse(this.user.studentId);
    this.getStudent(this.courseList[0], 0);
    this.initSocket();
  }
}
</script>

<style scoped>
.course {
  margin-left: 5px;
  min-width: 70px;
  height: 33px;
  border-radius: 20px;
  font-size: 1rem;
  color: rgba(108, 95, 188, 0.6);
  background-color: rgba(226, 217, 255, 0.25);
  box-shadow: rgba(0, 0, 0, 0.1) 0 0 8px;
  border: 1px solid rgba(54, 19, 97, 0.2);
  padding: 5px 13px;
}
.active {
  background-color: rgba(108, 95, 188, 0.9);
  color: white;
}

#tabs {
  width: calc(100vw - 40px);
  padding: 0 20px;
  height: 55px;
  white-space: nowrap;
  overflow: auto;
}
#tabs::-webkit-scrollbar {
  width: 0;
}

#page {
  background-color: #e8e2fe;
  border-radius: 45px 45px 0 0;
  height: 69vh;
  width: 100%;
  position: fixed;
  overflow-y: auto;
  bottom: 0;
  padding-bottom: 10vh;
  box-shadow: rgba(0, 0, 0, 0.3) 0 5px 15px;
}

#stu-grid {
  margin: 0 20px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: 20px;
  padding: 0;
}

.stu {
  list-style: none;
  text-align: center;
  padding: 15px 5px 0;
}

.stu>div {
  padding: 8px;
  border-radius: 27px;
}

.stu p {
  margin: 5px 0;
  font-size: 0.8rem;
}

.online {
  border: 2px solid transparent;
  background-clip: padding-box, border-box;
  background-origin: padding-box, border-box;
  background-image: linear-gradient(to right, #e8e2fe, #e8e2fe), linear-gradient(0deg, rgba(112, 79, 254, 1) 0%, rgba(254, 144, 99, 1) 100%);
}

.offline {
  border: 1px dashed lightgrey;
  background-clip: none;
  background-origin: none;
  background-image: none;
}

.img-proportion {
  width: 100%;
  height: 0;
  padding-bottom: 100%;
  position: relative;
  overflow: hidden;
  border-radius: 20px;
}

.img-proportion>img {
  width: 100%;
  position: absolute;
  right: 0%;
}


.framework {
  height: 700px;
  border: 1px blue solid;
}

.drop {
  margin-left: 70%;
  margin-top: 25%;
  background-color: #6C5FBC;
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

.image {
  width: 100%;
  display: block;
}

</style>