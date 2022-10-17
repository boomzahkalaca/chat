<template>
  <transition name="fade">
    <div class="alert-box-wrapper" v-show="show">
      <div class="alert-box">
        <div class="alert-box-header">

          <div class="alert-box-headerbtn" @click="handleAction('close')">X</div>
        </div>
        <div class="alert-box-content">
          <div class="alert-box-container">{{ message }}</div>
        </div>
        <div class="alert-box-btns">
          <button class="cancel-btn"  v-show="showCancel" @click="handleAction('cancel')">{{ cancelText }}</button>
          <button class="confirm-btn"  @click="handleAction('confirm')">{{ confirmText }}</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Alert',
  data () {
    return {
      message: '这是一段提示内容',
      show: false,
      callback: null,
      cancelText: '取消',
      confirmText: '确定',
      showCancel:false
    }
  },
  methods: {
    handleAction (action) {
      this.callback(action)
      this.destroyVm()
    },
    destroyVm () { // 销毁
      this.show = false
      setTimeout(() => {
        this.$destroy(true)
        this.$el && this.$el.parentNode.removeChild(this.$el)
      }, 500)
    }
  }
}
</script>

<style lang="less" scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}
.fade-enter, .fade-leave-to  {
  opacity: 0;
}

.alert-box-wrapper {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  .alert-box {
    display: inline-block;
    width: 420px;
    padding-bottom: 10px;
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid #303133;
    font-size: 16px;
    text-align: left;
    overflow: hidden;
    .alert-box-header {
      position: relative;
      padding: 15px;
      padding-bottom: 10px;
      .alert-box-title {
        color: #303133;
      }
      .alert-box-headerbtn {
        position: absolute;
        top: 15px;
        right: 15px;
        cursor: pointer;
        color: #909399;
      }
    }
    .alert-box-content {
      padding: 10px 15px;
      color: #606266;
      font-size: 14px;
    }
    .alert-box-btns {
      padding: 5px 15px 0;
      text-align: right;
      .cancel-btn {
        padding: 5px 15px;
        background: #fff;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        outline: none;
        cursor: pointer;
      }
      .confirm-btn {
        margin-left: 6px;
        padding: 5px 15px;
        color: #fff;
        background-color: #6C5FBC;
        border: 1px solid #409eff;
        border-radius: 4px;
        outline: none;
        cursor: pointer;
      }
    }
  }
}
</style>


