<template>
  <div>
    <SubPageHeadTitle :theTitle="topic" />

    <div class="img-proportion"><img :src="imgSrc"></div>
    <ul>
      <li class="post" v-for="(user,index) in newPostList" :key="index">
        <div class="gradient-border">
          <div class="img-proportion">
            <img v-bind:src="user.imgSrc" alt="">
          </div>
        </div>
        <div class="user-info">
          <p class="user-name">{{ user.name }}</p>
          <p class="user-from"><i class="el-icon-location-outline"></i> {{ user.country }}</p>
          <p class="words">{{user.post}}</p>
        </div>
      </li>
      <li class="post" v-for="i in 10" :key="i">
        <div class="gradient-border">
          <div class="img-proportion">
            <img src="http://iph.href.lu/100x100" alt="">
          </div>
        </div>
        <div class="user-info">
          <p class="user-name">Donald Trump</p>
          <p class="user-from"><i class="el-icon-location-outline"></i> America</p>
          <p class="words">MAMG!!! Make America Great Again!!! Oh hoo~MAMG!!! Make America Great Again!!! Oh hoo~MAMG!!! Make America Great Again!!! Oh hoo~MAMG!!! Make America Great Again!!! Oh hoo~</p>
        </div>
      </li>
    </ul>
    <button @click="addPost"><i class="el-icon-s-promotion"></i></button>
    <AddPost v-show="showAdd" @back="close" @newPost="sumbitPost"></AddPost>
  </div>
</template>

<script>
import SubPageHeadTitle from "@/components/SubPageHeadTitle";
import AddPost from "@/components/chanel/AddPost";
import axios from "axios";
export default {
  inject: ['reload'],
  name: "Share",
  components: { AddPost, SubPageHeadTitle },
  data() {
    return {
      newPost: '',
      user: {},
      topic: '',
      imgSrc: '',
      postList: [],
      newPostList: [],
      showAdd: false
    }
  },
  methods: {
    async getPost() {
      var temp = this.topic.replace(" ", "")
      await axios.get("http://localhost:8080/channel/getposts?topicName=" + temp).then(res => {
        this.postList = res.data.data["list"]
      })
    },
    async getUser() {
      for (var i = 0; i < this.postList.length; i++) {
        var temp = this.postList[i].owner
        await axios.get("http://localhost:8080/user/getinfo?studentId=" + temp).then(res => {
          var user = res.data.data["info"]
          user.post = this.postList[i].post
          this.newPostList.push(user)

        })

      }
    },
    addPost() {
      this.showAdd = true;
    },
    async sumbitPost(data) {
      this.newPost = data;
      var tempTopic = this.topic.replace(" ", "")
      await axios.post("http://localhost:8080/channel/addpost", { userId: this.user.studentId, topic: tempTopic, post: this.newPost }).then(res => {
        console.log(res)
        if (res.data["success"] == true) {
          var tempUser = this.user
          tempUser.post = this.newPost
          console.log(tempUser)
          this.newPostList.push(tempUser)
          console.log(this.newPostList)
          this.showAdd = false
        }
      })
      this.reload();
    },
    close() {
      this.showAdd = false;
      this.reload();
    },
    goBack() {
      this.$router.back();
    }

  },
  async mounted() {
    this.user = JSON.parse(localStorage.getItem("userInfo"))
    this.topic = this.$route.params.topicSelected;
    var temp = this.topic.replace(" ", "");
    this.imgSrc = require(`../../../public/static/img/${temp}.jpeg`);
    await this.getPost();
    this.getUser();
  }
}
</script>

<style scoped>
.img-proportion {
  width: 90%;
  height: 0;
  padding-bottom: 50%;
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  margin: 0 auto;
  box-shadow: rgba(0, 0, 0, 0.3) 0 0 20px;
}

.img-proportion>img {
  width: 100%;
  position: absolute;
  right: 0%;
}


ul {
  list-style: none;
  padding-inline-start: 20px;
}

.post {
  display: flex;
  align-items: flex-start;
  width: 90%;
  margin-top: 10px;
}

.gradient-border {
  flex: 0 0 13%;
  margin: 5px;
  padding: 5px;
  border-radius: 18px;
  border: 2px solid transparent;
  background-clip: padding-box, border-box;
  background-origin: padding-box, border-box;
  background-image: linear-gradient(to right, #e8e2fe, #e8e2fe), linear-gradient(0deg, rgba(112, 79, 254, 1) 0%, rgba(254, 144, 99, 1) 100%);
}

.gradient-border>div {
  width: 100%;
  padding-bottom: 100%;
  position: relative;
  overflow: hidden;
  border-radius: 13px;
}

.user-info {
  flex: 0 0 87%;
  color: white;
  margin-top: 10px;
}

.user-info>p {
  margin: 0;
}

.user-name {
  font-weight: bold;
  font-size: 1.2rem;
}

.user-info p.user-from {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.7rem;
  margin-bottom: 10px;
}

.words {
  font-size: 0.9rem;
}

button {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 30px;
  background-color: #6C5FBC;
  box-shadow: rgb(0, 0, 0, 0.45) 0 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  font-size: 1.6rem;
}
</style>