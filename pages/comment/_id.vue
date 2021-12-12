<template>
  <div>
    <table class="home-table">
      <tr>
        <th class="home-table__ttl">コメント</th>
      </tr>
      <tr class="home-table__content">
        <td>
          <div class="home-content__item">
            <!-- <div>{{ currentShare.user.name }}</div> -->
            <div v-if="isLiked(currentShare.id) === false" class="item-container">
              <img @click="insertLike(currentShare.id)" class="img-heart__non" src="/images/heart.png"/>
            </div>
            <div v-else="isLiked(currentShare.id) === true" class="item-container">
              <img @click="deleteLike(currentShare.id)" class="img-heart" src="/images/heart.png"/>
            </div>
            <div class="item-container">
              {{ countLike(currentShare.id) }}
            </div>
            <div v-show="userCheck(currentShare.id) === true" class="item-container">
              <img @click="deleteShare(currentShare.id)" class="img-cross" src="/images/cross.png"/>
            </div>
          </div>
          <div class="home-content__share">
            {{ currentShare.share }}
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
      newComment: "",
      uid:"",
      shareLists: [],
      likedArray: [],
      currentShare: {},
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
    async getCurrentShare(){
      await this.getShare();
      const shareId = this.$route.params.id;
      this.shareLists.forEach((share) => {
        if(share.id === Number(shareId)){
          this.currentShare = share;
          console.log(this.currentShare);
        }
      });
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
  },
  created(){
    this.getCurrentShare();
    this.getLikes();
    this.getUid();
  },
}
</script>