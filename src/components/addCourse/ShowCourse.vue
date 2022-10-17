<template>
  <div>
    <ul id="page">
      <li class="one" v-for="(course,index) in courseList" :key="index">
        <span>{{course.name}}&nbsp;{{course.courseId}}</span>
        <el-button @click="addCourse(course.courseId)" id="button" v-show="!course.isAdd" >Add</el-button>
        <el-button v-show="course.isAdd" disabled>Added</el-button>
      </li>
<!--      <li class="one" v-for="i in 10" :key="i+5">-->
<!--        <span>DECO 7381</span>-->
<!--        <button>Add</button>-->
<!--      </li>-->
    </ul>
  </div>
  </template>
  
  <script>
  import axios from "axios";
  export default {
    name: "ShowCourse",
    data(){
      return{
        courseList:[],
        user:null
      }
    },
    methods:{
      async addCourse(courseId){
  
        await axios.post("http://localhost:8080/course/add",{studentId:this.user.studentId,courseId:courseId}).then(res=>{
          console.log(res)
          this.$set(course,"isAdd",true)
        })
      },
      async getMyCourse(){
        await axios.get("http://localhost:8080/user/courseList?studentId="+this.user.studentId).then(res=>{
          this.myCourseList= res.data.data["courseList"];
        })
      }
    },
   async mounted() {
      this.user=JSON.parse(localStorage.getItem("userInfo"))
      await this.getMyCourse();
      this.courseList=JSON.parse(this.$route.params.courseList)
      for(let i=0;i<this.courseList.length;i++){
        this.$set(this.courseList[i],'isAdd',false)
      }
      for(let u=0;u<this.courseList.length;u++){
        if(this.myCourseList.indexOf(this.courseList[u].courseId)!=-1){
          this.$set(this.courseList[u],"isAdd",true)
        }
      }
    }
  
  }
  </script>
  
  <style scoped>
  #page {
    list-style: none;
    margin: 0;
    background-color: #e8e2fe;
    border-radius: 45px 45px 0 0;
    height: 68vh;
    width: calc(100vw - 50px);
    padding: 0 25px;
    position: fixed;
    overflow-y: auto;
    bottom: 0;
    padding-bottom: 10vh;
    box-shadow: rgba(0, 0, 0, 0.3) 0 5px 15px;
  }
  .one{
    height: 4.8rem;
    background-color: #FFFAF5;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 20px 0;
    padding: 0 25px;
    box-shadow: rgba(0, 0, 0, 0.1) 0 0 10px;
    font-size: 1.1rem;
  }
  button {
    color: white;
    background-color: #6C5FBC;
    padding: 5px 10px;
    font-size: 1.1rem;
    border-radius: 20px;
    border: 1px solid #6C5FBC;
    width: 5.5rem;
  }
  </style>