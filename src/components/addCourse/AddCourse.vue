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
      course:null,
      courseList:[]
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
    }

  }
}
</script>

<style scoped>

</style>