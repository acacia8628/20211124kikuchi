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
            <div class="item-container">
              <img @click="insertLike(item.id)" class="img-heart" src="/images/heart.png"/>
            </div>
            <div class="item-container">
              <img @click="deleteLike(item.id)" class="img-heart" src="/images/heart.png"/>
            </div>
            <div class="item-container">
              aaa
            </div>
            <div class="item-container">
              <img @click="deleteShare(item.id)" class="img-cross" src="/images/cross.png"/>
            </div>
            <div class="item-container">
              <img @click="toComment" class="img-detail" src="/images/detail.png"/>
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
      status:false,
      shareLists: [],
    };
  },
  methods: {
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          alert("ログアウトが完了しました");
          this.$router.replace("/");
        });
    },
    toComment(){
      this.$router.push('/comment');
    },
    async getShare() {
      const resData = await this.$axios.get("http://127.0.0.1:8000/api/v1/share/");
      this.shareLists = resData.data.data;
    },
    async insertShare() {
      const sendData = {
        share: this.newShare,
      };
      await this.$axios.post("http://127.0.0.1:8000/api/v1/share/", sendData);
      this.getShare();
    },
    async deleteShare(id) {
      await this.$axios.delete("http://127.0.0.1:8000/api/v1/share/" + id);
      this.getShare();
    },
    insertLike(id){
      firebase.auth().onAuthStateChanged((user) => {
        if(user){
          const uid = user.uid
          const sendData = {
            uid:uid,
            id:id,
          };
          console.log(sendData);
          this.$axios.post("http://127.0.0.1:8000/api/v1/like/", sendData);
          this.status = true;
        } else {
          alert("ログインして下さい。");
        }
      })
    },
    deleteLike(id){
      firebase.auth().onAuthStateChanged((user) => {
        if(user){
          const uid = user.uid
          const sendData = {
            id:id,
            uid:uid,
          };
          console.log(sendData);
          this.$axios.delete("http://127.0.0.1:8000/api/v1/like/"+id ,{params:sendData});
          //this.$axios.delete("http://127.0.0.1:8000/api/v1/like/" +{params:sendData});
          //this.$axios.delete("http://127.0.0.1:8000/api/v1/like/" ,{data:sendData});
          //this.$axios.delete("http://127.0.0.1:8000/api/v1/like/" +{data:sendData});
          this.status = false;
        } else {
          alert("ログインして下さい。");
        }
      })
    },
  },
  created() {
    this.getShare();
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
</style>