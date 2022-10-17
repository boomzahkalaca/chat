<template>
  <div>
    <SubPageHeadTitle :theTitle="'Join New Course'" />
    <div id="search-bar">
      <i class="el-icon-search"></i>
      <input @keydown.enter="searchCourse" v-model="courseName" placeholder="Search">
    </div>
    <!-- <button @click="searchCourse">Search</button> -->

  </div>
</template>

<script>
import SubPageHeadTitle from "@/components/SubPageHeadTitle";
import axios from 'axios'
export default {
  name: "SearchCourse",
  components: { SubPageHeadTitle },
  data() {
    return {
      courseName: '',
      course: {},
    }
  },
  methods: {
    async searchCourse() {
      await axios.get("http://localhost:8080/search/course?course=" + this.courseName).then(res => {
        if (res.data["success"] == true) {
          this.course = res.data.data["course"];
          this.$emit("courseInfo", this.course);
        }

      })
    }
  }
}
</script>
<style scoped>
#search-bar {
  height: 1.9rem;
  width: 77vw;
  box-shadow: rgba(0, 0, 0, 0.1) 0 2px 10px;
  margin: 1rem auto;
  padding: 5px 16px;
  display: flex;
  align-items: center;
  font-size: 1.1rem;
  border: 1px solid rgba(255, 255, 255, 0.45);
  border-radius: 25px;
  position: relative;
  background-color: rgba(197, 178, 255, 0.46);
}

#search-bar i {
  font-weight: bold;
  color: white;
}

#search-bar input {
  border: none;
  outline: none;
  margin: auto 5px;
  width: 90%;
  background-color: transparent;
  color: white;
}
::-webkit-input-placeholder,
::-ms-input-placeholder,
:-ms-input-placeholder,
::placeholder,
:-moz-placeholder,
::-moz-placeholder {
  color: white !important;
}
</style>