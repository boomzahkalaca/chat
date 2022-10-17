<template>
  <div>
    <SessionPanel @sendMessage="sendMessage" :session="curSession"  >
<!--      <template slot="num">-->
<!--        ({{users.length}})-->
<!--      </template>-->
      <div class="iChat-message-warp" ref="message-list">
        <div class="iChat-message-list">
          <UiChatBubble class="message-item"
                        :key="i"
                        :message="item"
                        :setting="setting"
                        :is-send="loginUser.studentId===item.from.studentId"
                        v-for="(item,i) in messageData">
          </UiChatBubble>
        </div>
      </div>
    </SessionPanel>
  </div>
</template>

<script>
import {getDeviceType} from "@/components/emoji";
import SessionPanel from "@/components/chat/SessionPanel";
import UiChatBubble from "@/components/chat/UiChatBubble";
import {BELL_URL} from "@/components/config";

export default {
  name: "contact",
  components:{SessionPanel,UiChatBubble},
  data(){
    return{
      // users:[],
      curSession:{},
      messageData:[],
      setting:{
        isName: true,
        isTime:true,
        isVoice:true
      },
      loginUser:{},
      token:"",
      audioSrc:BELL_URL,
      socket:{},
      isConnect:false,
    }
  },
  methods:{
    //将消息添加到map中
    addSessionMessage(message) {
      this.messageData.push(message)
      //？？？？
      setTimeout(() => {
        vm.scrollFooter('message-list')
      }, 16)

    },
    //发送消息
    sendMessage(content) {
      const message = {
        from: this.loginUser,
        to: this.curSession,
        //消息内容
        content: content,
        type: "text",
        time: new Date().getTime(),
        isRead: true
      };
      this.addSessionMessage(message);
      const socketMessage = {
        from: JSON.stringify(this.loginUser),
        to: JSON.stringify(this.curSession),
        content: content,
        type: "text",
        time: new Date().getTime(),
        isRead: true
      }
      // if(this.socket){
      //   this.socket.emit("message",message.from,message.to,message.content,message.type)
      // }
      if (this.socket) {
        this.socket.send(JSON.stringify(socketMessage))
      }
      //将消息存到本地
      var messageObj = JSON.parse(localStorage.getItem(this.loginUser.studentId + "message"));
      let messageMap = new Map(Object.entries(messageObj));
      if (!messageMap.get(this.curSession.studentId)) {
        var newList = [];
        newList.push(socketMessage)
        messageMap.set(this.curSession.studentId, newList);
      } else {
        var oldList = messageMap.get(this.curSession.studentId)
        oldList.push(socketMessage)
        messageMap.set(this.curSession.studentId, oldList);
      }
      let newMessageObj = Object.fromEntries(messageMap.entries())
      localStorage.setItem(this.loginUser.studentId + "message", JSON.stringify(newMessageObj))

    },
    //将每个消息都设计为已读
    setSessionRead() {
      if (this.messageData.length === 0) {
        return
      }
      this.messageData.forEach((item) => {
        if (!item.isRead) {
          item.isRead = true;
        }
      })
    },
    scrollFooter(name) {
      let $el = this.$refs[name];
      if ($el) {
        this.$nextTick(() => {
          $el.scrollTop = $el.scrollHeight
        })
      }
    },
    // changeSession(session){
    //   const vm=this;
    //   if(session.id===this.curSession.id){
    //     return
    //   }
    //   this.setSessionRead(session.id);
    //   this.curSession=session;
    //   setTimeout(()=>{
    //     vm.scrollFooter('message-list')
    //   },16)
    //   if(session.name){
    //     document.title='与'+session.name+"聊天中|"+this.appTitle
    //   }else {
    //     document.title=this.loginUser.name+"|"+this.appTitle
    //   }
    // },
    //接受消息的一方
    listenerMessage(from, to, message) {
      const _this = this;
      let isRead = false;
      if (_this.curSession.studentId === from.studentId) {
        isRead = true;
      }
      let MESSAGE = {
        from: from,
        to: to,
        content: message,
        time: new Date().getTime(),
        type: "text",
        isRead: true
      };
      this.addSessionMessage(MESSAGE)
    },

    listenerHistoryMessage(channelId, msgList) {
      const _this = this;
      _this.$set(_this.messageData, channelId, msgList)
    },
    async initSocket(id) {
      var that = this;
      this.socket = new WebSocket('ws://127.0.0.1:8080/chat/' + id);
      await new Promise((resolve) => {
        this.socket.onopen = function (e) {
          resolve(e.data)
        }
      });
      this.socket.onmessage = function (msg) {
        var temp = JSON.parse(msg.data);
        var from = JSON.parse(temp.from);
        var to = JSON.parse(temp.to);
        var conent = temp.content;
        console.log(conent);
        that.listenerMessage(from, to, conent);
        //将消息存到本地
        var messageObj = JSON.parse(localStorage.getItem(that.loginUser.studentId + "message"));
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
        localStorage.setItem(that.loginUser.studentId + "message", JSON.stringify(newMessageObj))
      }
    },
    //新增方法
    getMessage() {
      let obj = JSON.parse(localStorage.getItem(this.loginUser.studentId + "message"));
      let map = new Map(Object.entries(obj));
      var temp = map.keys();
      var tempList = Array.from(temp);
      for (var i = 0; i < tempList.length; i++) {
        if (tempList[i] == this.curSession.studentId) {
          let tempObj = map.get(tempList[i]);
          for (var u = 0; u < tempObj.length; u++) {
            let userFrom = JSON.parse(tempObj[u].from);
            let userTo = JSON.parse(tempObj[u].to);
            let userContent = tempObj[u].content;
            let userTime = tempObj[u].time;
            const message = {
              from: userFrom,
              to: userTo,
              content: userContent,
              time: userTime,
              type: "text",
              isRead: true
            };
            this.addSessionMessage(message);
          }
        }
      }
    },
  },
  async mounted() {
    this.loginUser=JSON.parse(localStorage.getItem("userInfo"));
    this.curSession=JSON.parse(this.$route.params.target);
    this.getMessage();
    await this.initSocket(this.loginUser.studentId);


  },
  beforeDestroy(){
    if(this.socket){
      this.socket.close()
    }
  },
}
</script>

<style scoped>
.app-session-panel{
  margin-left: 220px;
  height: 100%;
}
.iChat-message-warp{
  position: relative;
  width: 100%;
  height: 100%;
  overflow-y: auto;
}
.iChat-message-list{
  padding: 10px;
}
</style>