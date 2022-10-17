<template>
  <div class="session-panel-warp iChat-session-warp">
    <div class="iChat-session-header">
      <div class="iconfont icon-left">
        <!-- <span class="iconfont icon-left return" @click="back">←</span> -->
        <button @click="back" id="backBtn">
          <i class="el-icon-arrow-left"></i>
        </button>
      </div>
      <div class="session-info-warp">
        <img :src="session.imgSrc"  @click="goToProfile(session.studentId)" alt="" class="session-avatar">
        <span class="session-info-name">{{session.name}} from {{session.country}}</span>
        <span class="user-num" v-if="session.type==='group'">
          <slot name="num"></slot>
        </span>
        <span class="iconfont" v-if="session.deviceType"
          :class="{'icon-phone':session.deviceType==='phone','icon-pc':session.deviceType==='pc'}"></span>
        <span class="ip-text" v-if="session.ip">({{session.ip}})</span>
      </div>
    </div>

    <div id="hobbies">
      <el-popover class="tag" :disabled="true" :width="160" v-for="(item,index) in hobbyList"
        :key="index">
        <template #reference>
          <el-button @click=null>{{ item }}</el-button>
        </template>
      </el-popover>
    </div>

    <div class="iChat-session-container" :class="{'with-panel':isShowTool||isShowExpression}">
      <slot></slot>
    </div>
    <div class="iChat-session-footer">
      <div class="iChat-message-form" :class="{'focus-form':text!==''||isFocus}">
        <div class="iChat-send-warp">
          <button class="iChat-send-btn" v-show="text!==''||isFocus" @click="sendText(text)"><i
              class="el-icon-s-promotion"></i></button>
          <span class="iconfont icon-plus-o" v-show="text===''&&!isFocus" @click.stop="toggleTool"></span>
        </div>
        <div class="iChat-expression-btn" @click.stop="toggleExpression">
          <span class="iconfont icon-expression">☺</span>
        </div>
        <div class="iChat-input-warp">
          <input type="text" @focus="isFocus=true" @keypress.enter="sendText(text)" @focusout="isFocus=false"
            placeholder="Type a Message" class="iChat-message-input" v-model="text">
        </div>
      </div>
      <div class="iChat-expression-panel scroll" v-show="isShowExpression">
        <ul class="expression-list">
          <li v-for="item in expressions" :key="item.title" @click.stop="pickerExpression(item)">
            <img :src="baseUrl+item.url" alt="">
          </li>
        </ul>
      </div>
      <div class="iChat-tool-panel scroll" v-show="isShowTool">
        <ul class="iChat-tool-list">
          <li>
            <label class="iChat-tool-item">
              <span class="iconfont icon-img"></span>
              <input type="file" accept="image/png, image/jpg, image/jpeg" @change="fileChange">
            </label>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { expressions } from '../emoji';
import AlterMessage from "../Message";
import { EMOJI_BASE_URL } from "../config";
import axios from "axios";
export default {
  name: "SessionPanel",
  props: {
    session: {
      type: Object,
      default() {
        return {
          studentId: "a000000",
          name: "聊天室",
          imgSrc: "static/img/avatar/group-icon.png",
          type: "user",
        }
      }
    }
  },
  data() {
    return {
      text: "",
      isFocus: false,
      isShowTool: false,
      isShowExpression: false,
      expressions,
      baseUrl: EMOJI_BASE_URL,
      user: {},
      hobbyList: [],
    }
  },
  methods: {
    goToProfile(id){
      this.$router.push({
        name:"other",
        params:{
          id:id
        }
      })
    },
    async getHobby() {
      console.log("here")
      console.log(this.session)
      await axios.get("http://localhost:8080/hobby/get?studentId=" + this.session.studentId).then(res => {
        console.log(res.data.data["hobbies"])
        console.log("end")
        this.hobbyList = res.data.data["hobbies"]
      })
    },
    pickerExpression(item) {
      this.text += item.title;
    },
    toggleExpression() {
      let _this = this;
      function hideExpression() {
        _this.isShowExpression = false;
      }
      if (this.isShowExpression) {
        document.removeEventListener('click', hideExpression)
      } else {
        document.addEventListener('click', hideExpression)
      }
      this.isShowExpression = !this.isShowExpression;
      this.isShowTool = false;
    },
    toggleTool() {
      let _this = this;
      function hideTool() {
        _this.isShowTool = false;
      }
      if (this.isShowTool) {
        document.removeEventListener('click', hideTool)
      } else {
        document.addEventListener('click', hideTool)
      }
      this.isShowTool = !this.isShowTool;
      this.isShowExpression = false;
    },
    fileChange(e) {
      const reg = /\.(?:png|jpg|jepg)$/i;
      let file = e.target.files[0];
      if (!reg.test(file.name)) {
        AlterMessage.warning("请选择正确格式的图片文件!");
        return
      }
      let maxSize = 1 * 1024 * 1024;
      if (file.size > maxSize) {
        AlterMessage.warning("图片大小不能超过1M!");
        return
      }
      let reader = new FileReader();
      reader.readAsDataURL(file); // 读出 base64
      reader.onloadend = () => {
        let html = reader.result;
        this.sendMessage(html, 'image')
      };
    },
    sendMessage(html, type) {
      this.$emit("sendMessage", html, type, this.session)
    },
    sendText(text) {
      text = text.replace(/^\s+|\s+$/g, '');
      if (text) {
        this.sendMessage(text, 'text');
      }
      setTimeout(() => {
        this.text = '';
      }, 0)
    },
    back() {
      this.$router.back();
    }
  },
  async mounted() {
    await this.session;
    await this.getHobby();
  }
}
</script>

<style scoped>
.iChat-session-warp {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 99;
  left: 0;
  top: 0;
  background-color: #ffffff;
}

.iChat-session-header {
  padding: 10px;
  height: 75px;
  position: relative;
  background-color: #c97fff;
  color: #f2f2f2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.iChat-session-header .icon-left {
  position: absolute;
  line-height: 30px;
  height: 30px;
  font-size: 18px;
  width: 30px;
  text-align: center;
  vertical-align: middle;
  left: 20px;
}

.iconfont icon-left {
  width: 45px;
  height: 45px;
  border-radius: 15px;
  border: 1px solid rgba(75, 38, 118, 0.3);
  background-color: rgba(226, 217, 255, 0.5);
  /* position: relative; */
  display: flex;
  align-items: center;
}

.session-info-warp {
  line-height: 30px;
  height: 30px;
  text-align: center;
}

.session-avatar {
  display: inline-block;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  vertical-align: middle;
  border: none;
  margin: 0;
  line-height: 30px;
}

.session-info-name {
  font-size: 20px;
  margin-left: 5px;
  margin-right: 5px;
  vertical-align: middle;
}

.user-num,
.ip-text {
  line-height: 30px;
  font-size: 12px;
  vertical-align: middle;
  margin-left: 5px;
}

.session-info-warp .iconfont {
  font-size: 18px;
  line-height: 30px;
  vertical-align: middle;
}

.session-info-warp .icon-phone {
  color: #e6ca03;
}

.session-info-warp .icon-pc {
  color: #e66f6a;
}

.iChat-session-footer {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
}

.iChat-message-form {
  padding: 10px;
  border-top: 1px solid #d1d1d1;
  height: 50px;
  background-color: #FFFFFF;
}

.iChat-message-form:after,
.expression-list:after,
.iChat-tool-panel:after {
  display: block;
  clear: both;
  content: '';
}

.iChat-expression-btn {
  float: left;
  height: 40px;
  line-height: 40px;
  width: 30px;
  text-align: center;
}

.iChat-expression-btn .iconfont,
.iChat-send-warp .iconfont {
  line-height: 40px;
  font-size: 30px;
  color: #7d8085;
  vertical-align: middle;
}

.iChat-send-warp {
  float: right;
}

.iChat-input-warp {
  margin-left: 45px;
  margin-right: 45px;
  padding: 5px 0;
  transition: all .2s;
}

.iChat-input-warp .iChat-message-input {
  display: block;
  box-sizing: border-box;
  line-height: 30px;
  font-size: 14px;
  color: #7d8085;
  width: 100%;
  padding: 0;
  margin: 0;
  border: none;
  outline: none;
  /* border-bottom: 1px solid #d1d1d1; */
}

.iChat-message-input:focus {
  border-bottom: 1px solid #6c5fbc;
}

.iChat-send-warp {
  width: 40px;
  height: 40px;
  text-align: center;
  line-height: 40px;
  vertical-align: middle;
  transition: all .2s;
}

.focus-form .iChat-send-warp {
  width: 50px;
}

.focus-form .iChat-input-warp {
  margin-right: 60px;
}

.iChat-send-btn {
  display: inline-block;
  width: 100%;
  text-align: center;
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  background-color: #9f73cb;
  border-radius: 4px;
  border: none;
  outline: none;
  color: #f2f2f2;
  vertical-align: middle;
}

.iChat-expression-panel,
.iChat-tool-list {
  height: 200px;
  overflow-y: auto;
}

.iChat-tool-panel {}

.expression-list {
  list-style: none;
  padding: 0 5px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.expression-list li {
  width: 30px;
  height: 30px;
  padding: 5px;
}

.expression-list li img {
  display: block;
  width: 100%;
  height: 100%;
}

.iChat-tool-list {
  list-style: none;
  padding: 0 5px;
  margin: 0;
}

.iChat-tool-list li {
  padding: 10px;
}

.iChat-tool-item {
  display: block;
  width: 50px;
  height: 50px;
  background-color: #f2f2f2;
  border-radius: 4px;
  line-height: 50px;
  text-align: center;
  vertical-align: middle;
}

.iChat-tool-item .iconfont {
  font-size: 25px;
  color: #606266;
}

.iChat-tool-item input[type='file'] {
  display: none;
}

.iChat-session-container {
  width: 100%;
  height: calc(100% - 75px);
  background-color: #e5d8ff;
}

.iChat-session-container.with-panel {
  height: calc(100% - 312px);
}

#backBtn {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background-color: #6C5FBC;
  box-shadow: rgba(0, 0, 0, 0.23) 0 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-right: 7px;
  border: none;
}

#backBtn>i {
  font-size: 1.5rem;
  font-weight: bold;
}

.tag button,
#addBtn {
  background-color: rgba(226, 217, 255, 0.35);
  padding: 5px 10px;
  margin-left: 5px;
  border-radius: 15px;
  border: 1px solid rgba(197, 178, 255, 0.8);
  color: white;
  font-size: 13px;
}

#hobbies {
  width: calc(100vw - 40px);
  padding: 0px 20px 10px 20px;
  /* height: 100%; */
  white-space: nowrap;
  overflow: auto;
  background-color: #c97fff;
}

#hobbies::-webkit-scrollbar {
  width: 0;
}

#confirmBtn {
  border-radius: 20px;
  color: white;
  border: none;
  background-color: #6C5FBC;
  box-shadow: rgba(0, 0, 0, 0.2) 0 0 10px;
  padding: 3px 7px;
  font-size: 0.9rem;
}

#cancelBtn {
  font-size: 0.9rem;
  color: #6C5FBC;
}

</style>
