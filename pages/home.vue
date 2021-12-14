<template>
  <div>
    <table class="home-table">
      <tr>
        <th class="home-table__ttl">ホーム</th>
      </tr>
      <tr v-for="item in shareLists" :key="item.id" class="home-table__content">
        <td>
          <div class="home-content__item">
            <div>{{ item.user.name }}</div>
            <div v-if="isLiked(item.id) === false" class="item-container">
              <img @click="insertLike(item.id)" class="img-heart__non" src="/images/heart.png"/>
            </div>
            <div v-else="isLiked(item.id) === true" class="item-container">
              <img @click="deleteLike(item.id)" class="img-heart" src="/images/heart.png"/>
            </div>
            <div class="item-container">
              {{ countLike(item.id) }}
            </div>
            <div v-show="userCheck(item.id) === true" class="item-container">
              <img @click="deleteShare(item.id)" class="img-cross" src="/images/cross.png"/>
            </div>
            <div class="item-container">
              <img @click="toComment(item.id)" class="img-detail" src="/images/detail.png"/>
            </div>
          </div>
          <div class="home-content__share">
            {{ item.share }}
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import firebase from "~/plugins/firebase";
export default {
  layout:"home",
  data() {
    return {
      newShare: "",
      uid:"",
      shareLists: [],
      likedArray: [],
    };
  },
  computed: {
    countLike: function(){
      return function(itemId){
        var count = 0;
        var likes = this.likedArray;
        var length = likes.length;
        for(var i = 0; i < length; i++){
          if(likes[i].share_id === itemId){
            count++;
          }
        }
        return count;
      }
    }
  },
  methods: {
    //User関係
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          alert("ログアウトが完了しました");
          this.$router.replace("/");
        });
    },
    getUid(){
      firebase.auth().onAuthStateChanged((user) => {
        if(user){
          this.uid = user.uid
        }
      })
    },
    userCheck(id){
      const loginUser = (element) => element.user.uid === this.uid
        && element.id === id;
      if(this.shareLists.some(loginUser) === true){
        return true
      } else {
        return false
      }
    },
    //Share関係
    async getShare() {
      const resData = await this.$axios.get("http://127.0.0.1:8000/api/v1/share/");
      this.shareLists = resData.data.data;
    },
    async deleteShare(id) {
      await this.$axios.delete("http://127.0.0.1:8000/api/v1/share/" + id);
      this.getShare();
    },
    //Like関係
    async getLikes(){
      const resData = await this.$axios.get("http://127.0.0.1:8000/api/v1/like/");
      this.likedArray = resData.data.data;
    },
    isLiked(id){
      const likedCheck = (element) => element.user.uid === this.uid
        && element.share_id === id;
      if(this.likedArray.some(likedCheck) === true){
        return true
      } else{
        return false
      }
    },
    async insertLike(id){
      try {
        const sendData = {
          uid:this.uid,
          id:id,
      };
      console.log(sendData);
      await this.$axios.post("http://127.0.0.1:8000/api/v1/like/",sendData);
      this.getLikes();
      } catch {
        alert("ログインして下さい。");
      }
    },
    async deleteLike(id){
      try {
        const sendData = {
          uid:this.uid,
          id:id
        };
        console.log(sendData);
        await this.$axios.delete("http://127.0.0.1:8000/api/v1/like/"+id ,{params:sendData});
        this.getLikes();
      } catch {
        alert("ログインして下さい。")
      }
    },
    //その他
    async toComment(id){
      this.$router.push({path: `/comment` , query: {id:id}});
    },
  },
  created() {
    this.getShare();
    this.getLikes();
    this.getUid();
  },
};
</script>

<style>
.home-table{
  border:1px solid #fff;
  border-collapse:collapse;
  width:100%;
}
.home-table__ttl{
  padding:20px;
  color:#fff;
  text-align:left;
  border-bottom: 1px solid #fff;
}
.home-table__content{
  display:block;
  padding:20px;
  border-bottom:1px solid #fff;
}
.home-content__item{
  display:flex;
  align-items:center;
  color:#fff;
  font-weight:bold;
}
.item-container{
  margin-left:10px;
}
.item-container:last-child{
  margin-left:50px;
}
.home-content__share{
  margin-top:10px;
  color:#fff;
}
.img-heart__non{
  cursor: pointer;
  opacity:0.1;
  width:20px;
  height:20px;
}
</style>