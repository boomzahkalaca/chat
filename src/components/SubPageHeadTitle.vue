<template>
    <header>
        <button @click="goBack" id="backBtn">
            <i class="el-icon-arrow-left"></i>
        </button>
        <h1>{{theTitle}}</h1>
    </header>
</template>
<script type="text/javascript">
export default {
    name: "SubPageHeadTitle",
    props: {
        theTitle: String
    },
    data() {
        return {
        }
    },
    methods: {
        goBack() {
            console.log("Clicked");
            this.$router.back()
        }
    }
}

</script>
<style scoped>
header {
    width: 85%;
    height: 75px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    top: 0;
    margin: 4.5vh auto 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.25);
}
h1 {
    color: rgba(255, 255, 255, 0.9);
    margin: 0;
    font-size: 1.7rem;
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
#backBtn > i {
    font-size: 1.5rem;
    font-weight: bold;
}
</style>
  