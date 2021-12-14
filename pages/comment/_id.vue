<template>
  <div>
    <table class="home-table">
      <tr>
        <th class="home-table__ttl">コメント</th>
      </tr>
      <tr class="home-table__content">
        <td>
          <div class="home-content__item">
            <div v-if="currentShare.length != 0">{{ currentShare.user.name }}</div>
            <div v-if="isLiked(currentShare.id) === false" class="item-container">
              <img @click="insertLike(currentShare.id)" class="img-heart__non" src="/images/heart.png"/>
            </div>
            <div v-else="(currentShare.id) === true" class="item-container">
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

      <tr>
        <th class="comment-table__ttl">コメント</th>
      </tr>
      <tr v-for="item in currentComments" :key="item.id" class="comment-table__content">
        <td>
          <div class="comment-content__item">
            <div>{{ item.user.name }}</div>
            <div v-show="userCheck(item.id)  === true" class="item-container">
              <img @click="deleteComment(item.id)" class="img-cross" src="/images/cross.png"/>
            </div>
          </div>
          <div class="comment-content__comment">
            <div>{{ item.comment }}</div>
          </div>
        </td>
      </tr>
    </table>

    <validation-observer ref="obs" v-slot="ObserverProps">
        <div class="comment-content">
          <validation-provider v-slot="{ errors }" rules="required|max:120">
            <textarea
              v-model="newComment"
              class="comment-textarea"
              id="newComment"
              name="Comment"
            ></textarea>
            <div class="error">{{ errors[0] }}</div>
          </validation-provider>
          <button @click="insertComment" class="comment-button">コメント</button>
        </div>
      </validation-observer>
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
      paramsId: "",
      likedArray: [],
      shareLists: [],
      currentShare: [],
      currentComments: [],
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
    },
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
      if(this.currentComments.some(loginUser) === true){
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
      const shareId = this.paramsId;
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
    //Comment関係
    async getComment() {
      const id = await this.paramsId;
      const resData = await this.$axios.get("http://127.0.0.1:8000/api/v1/comment/"+id);
      this.currentComments = resData.data.data[0].comments;
      console.log(this.currentComments);
    },
    async insertComment() {
      if(this.newComment.length != 0 && this.newComment.length <= 120){
        const shareId = await this.paramsId;
        const sendData = {
          comment: this.newComment,
          shareId: shareId,
          uid: this.uid,
        };
        await this.$axios.post("http://127.0.0.1:8000/api/v1/comment", sendData);
      } else if(this.newComment <= 0){
        alert("コメントを入力して下さい。");
        location.reload();
      } else {
        alert("コメントは120文字以内にして下さい。");
        location.reload();
      }
      await this.getComment();
      location.reload();
    },
    async deleteComment(id) {
      await this.$axios.delete("http://127.0.0.1:8000/api/v1/comment/" + id);
      this.getComment();
    },
    //その他
    async createParamsId(){
      const id = this.$route.params.id;
      this.paramsId = id;
      console.log(this.paramsId);
    }
  },
  created(){
    this.getUid();
    this.createParamsId();
    this.getCurrentShare();
    this.getLikes();
    this.getComment();
  },
}
</script>

<style>
.comment-table__ttl{
  padding:10px;
  color:#fff;
  font-size:14px;
  border-bottom: 1px solid #fff;
}
.comment-table__content{
  display:block;
  padding:10px;
  border-bottom:1px solid #fff;
}
.comment-content {
  display: block;
  padding: 20px 10px;
}
.comment-content__item{
  display:flex;
  align-items:center;
  color:#fff;
  font-weight:bold;
}
.comment-content__comment{
  margin-top:10px;
  color:#fff;
}
.comment-textarea {
  box-sizing: border-box;
  width: 100%;
  height: 100px;
  padding: 5px;
  border: 1px solid #fff;
  border-radius: 5px;
  background-color: inherit;
  color: #fff;
  resize: none;
  outline: none;
}
.comment-button {
  display: block;
  margin-top: 10px;
  margin-left: auto;
  background-color: #571ddc;
  border: none;
  border-radius: 1.5em;
  padding: 0.8em 2em;
  color: #fff;
  text-decoration: none;
  cursor: pointer;
}
</style>