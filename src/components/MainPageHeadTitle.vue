<template>
    <header>
        <h1>{{theTitle}}</h1>
        <div v-if=" theTitle == 'Friend'" class="message">
            <span class = "message-icon" @click="goToApp">✉️</span>
            <!-- <el-button class="message-icon" @click="goToApp"><i class="el-icon-message"></i> </el-button> -->
        </div>
        <div v-else class="notification">
            <span class="dot"></span>
            <span class="noti-icon"  @click="goToApp">🔔</span>
        </div>
    </header>
</template>

<script type="text/javascript">
export default {
    name: "MainPageHeadTitle",
    props: {
        theTitle: String
    },
    data() {
        return {
        }
    },
    methods: {
        goToApp() {
            this.$parent.goToApp();
        }
    }
}
</script>

<style scoped>
header {
    width: 85%;
    height: 75px;
    padding: 0 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    top: 0;
    margin: 4.5vh auto 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.25);
}

h1 {
    color: rgba(255, 255, 255, 0.9);
    margin: 0;
}

.notification {
    width: 45px;
    height: 45px;
    border-radius: 15px;
    border: 1px solid rgba(75, 38, 118, 0.3);
    background-color: rgba(226, 217, 255, 0.5);
    position: relative;
    display: flex;
    align-items: center;
}

.message {
    width: 45px;
    height: 45px;
    border-radius: 15px;
    border: 1px solid rgba(75, 38, 118, 0.3);
    background-color: rgba(226, 217, 255, 0.5);
    position: relative;
    display: flex;
    align-items: center;
}

.message-icon {
    margin: auto;
    display: block;
    font-size: 1.4rem;
}

.noti-icon {
    margin: auto;
    display: block;
    font-size: 1.4rem;
}
.dot {
    position: absolute;
    top: 10px;
    right: 10px;
    border: 1px solid white;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background-color: orange;
}
</style>
  