<template>
  <div>
    <SearchCourse @courseInfo="showCourse"></SearchCourse>
    <RouterView @field="showFieldCourse"></RouterView>
    <Navi :current="'Home'" />
  </div>
</template>

<script>

import SearchCourse from "@/components/addCourse/SearchCourse";
import Field from "@/components/addCourse/Field";
import Navi from "@/components/Navi";
import axios from "axios";
export default {
  name: "AddCourse",
  components: {SearchCourse, Field, Navi},
  data(){
    return{
      course:{},
      courseList:[],
      user:{}
    }
  },
  methods:{
    showCourse(data){
      this.course=data;
      this.courseList.push(this.course);
      if(this.courseList.length!=0){
        this.$router.push({
          name:'show',
          params:{
            courseList:JSON.stringify(this.courseList)
          }
        })
      }
      this.courseList=[];
    },
    async showFieldCourse(data){
      await axios.get("http://localhost:8080/search/field?fieldName="+data).then(res=>{
        this.courseList=res.data.data["courseList"];
        if(this.courseList.length!=0){
          this.$router.push({
            name:'show',
            params:{
              courseList:JSON.stringify(this.courseList)
            }
          })
        }
      })
      this.courseList=[];
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
    this.initSocket()
  }
}
</script>

<style scoped>

</style>