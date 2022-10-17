<template>
  <div id="records">
    <div @click="getField(field.name)" class="record" v-for="(field,index) in fieldList" :key="index">
      <div>
        <img :src = "field.img" >
        <div class="record-text">
          <h3>{{field.name}}</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "Field",
  data(){
    return{
      fieldList:[
        {
          name:"BEL",
          img:require('../../../public/static/img/BEL.png')
        },
        {
          name:"EAIT",
          img:require('../../../public/static/img/EAIT.png')
        },
        {
          name:"Health & Behavioural Science",
          img:require('../../../public/static/img/Health&Behavioural Science.png')
        },
        {
          name:"Humanities & Social Sciences",
          img:require('../../../public/static/img/Humanities&Social Sciences.png')
        },
        {
          name:"Medicine",
          img:require('../../../public/static/img/Medicine.png')
        },
        {
          name:"Science",
          img:require('../../../public/static/img/Science.png')
        }
    ]
    }
  },
  methods: {
    getField(field) {
      this.$emit("field", field);
    }
  }
}
</script>

<style scoped>
#records {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  padding-top: 30px;
  margin: auto;
  width: 90%;
  max-width: 800px;
}

.record {
  width: 40vw;
  height: 40vw;
  max-width: 400px;
  max-height: 400px;
  padding: 0em;
  background-color: rgba(255, 255, 255, 0.07);
  box-shadow: rgba(0, 0, 0, 0.25) 0 0 17px;
  border-radius: 30px;
  border: 1px solid rgba(255, 255, 255, 0.17);
  margin-bottom: 35px;
  position: relative;
  display: flex;
  justify-content: center;
}

.record > div {
  width: 80%;
  height: 119%;
  position: absolute;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.record > div > img {
  width: 73%;
  filter: drop-shadow(0 10px 10px rgba(0, 0, 0, 0.3));
}
.record .record-text {
  width: 100%;
  text-align: center;
  color: white;
}
.record .record-text h3 {
  margin: 0 0 8px 0;
}
</style>