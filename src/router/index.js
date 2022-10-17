import VueRouter from "vue-router";
import Title from "@/components/Title";
import Friend from "@/components/friend/Friend";
import AddCourse from "@/components/addCourse/AddCourse";
import Field from "@/components/addCourse/Field";
import ShowCourse from "@/components/addCourse/ShowCourse";
import Login from "@/components/Login";
import Home from "@/components/Home";
import Profile from "@/components/Profile/Profile";
import Contact from "@/components/chat/Contact";
import test from "@/components/Alert/src/Alert";
import Chanel from "@/components/chanel/Chanel";
import FriendApplication from "@/components/friend/FriendApplication";
import Share from "@/components/chanel/Share";
import AddPost from "@/components/chanel/AddPost";
import OtherProfile from "@/components/Profile/OtherProfile";
import Register from "@/components/Register";
export default new VueRouter({
    routes:[
        {
            path:"/register",
            component:Register
        },
        {
          path:"/test",
          component:test
        },
        {
          path:"/contact",
          component:Contact,
            name:"chat"
        },

        { path:"/",
            component:Login

        },
        {
            path:"/home",
            component:Home,
            children:[
                {
                    path:"otherprofile/:id",
                    component:OtherProfile,
                    name:"other"
                },
                {
                    path:"share/:topicSelected",
                    component:Share,
                    name:"watch"
                },
                {
                  path:"application",
                  component:FriendApplication
                },
                {
                  path:"chanel",
                    component:Chanel
                },
                {
                  path:"profile",
                  component:Profile
                },
                {   path:"title",
                    component:Title,
                    name:"index"
                },
                {
                    path:"friend",
                    component: Friend
                },
                {
                    path:"addCourse",
                    component:AddCourse,
                    children:[{
                        path:"field",
                        component:Field
                    },
                        {
                            path:"showCourse/:courseList",
                            component:ShowCourse,
                            name:"show"
                        }]
                }
            ]
        },


    ]
})