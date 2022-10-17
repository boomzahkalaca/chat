<template>
  <div class="tab">
    <div
        class="tab_item" 
        v-for="(item, index) in tabBarImg" 
        :key="index" 
        @click="switchToTab(item.path)" 
        :class="item.title == current ? 'active' : ''"
    >
      <span class="icon"><i :class="item.icon"></i></span>
      <span class="icon-text">{{ item.title }}</span>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "Navi",
  props: {
    current: String
  },
  data(){
    return{
      tabBarImg:[
        {
          path:'/home/title',
          icon: 'el-icon-house',
          title:'Home'
        },
        {
          path:'/home/friend',
          icon: 'el-icon-chat-round',
          title:'Friend'
        },
        {
          path:'/home/chanel',
          icon: 'el-icon-guide',
          title:'Chanel'
        },
        {
          path:'/home/profile',
          icon: 'el-icon-user',
          title:'Profile'
        },
      ]
    }
  },
  methods:{
    switchToTab(path){
      this.$router.push(path);
      console.log(this.$router)
    }
  }
}
</script>

<style scoped>
*{
  margin: 0;
  padding: 0;
}
.tab {
  width: 100%;
  height: 8.5vh;
  display: flex;
  position: fixed;
  bottom: 0;
  background: white;
  z-index: 999;
  border-radius: 30px 30px 0 0;
  box-shadow: rgba(0, 0, 0, 0.3) 0 5px 15px;
}
.tab_item {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.icon {
  font-size: 1.6rem;
}
.icon-text {
  font-size: 0.5rem;
}
.active {
  color: #6C5FBC;
  font-weight: bold;
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
}
</style>