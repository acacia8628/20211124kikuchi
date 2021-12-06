<template>
  <div class="home-container">
    <div class="home-side">
      <div>
        <img class="img-logo" src="/images/logo.png" />
      </div>
      <nav class="share-nav">
        <ul class="share-nav-list">
          <li class="share-nav-item">
            <img class="img-home" src="/images/home.png" />
            <NuxtLink to="/home" class="nuxt-link">ホーム</NuxtLink>
          </li>
          <li class="share-nav-item">
            <img class="img-logout" src="/images/logout.png" />
            <button @click="logout" class="logout">ログアウト</button>
          </li>
        </ul>
      </nav>
      <validation-observer ref="obs" v-slot="ObserverProps">
        <div class="share-content">
          <p class="share-title">シェア</p>
          <validation-provider v-slot="{ errors }" rules="required|max:120">
            <textarea v-model="newShare" class="share-textarea" id="newShare" name="シェア"></textarea>
            <div class="error">{{ errors[0] }}</div>
          </validation-provider>
          <button @click="insertShare" class="home-button">シェアする</button>
        </div>
      </validation-observer>
    </div>
    <div class="home-main-content">
      <Nuxt />
    </div>
  </div>
</template>

<script>
import firebase from "~/plugins/firebase";
export default {
  layout:"home",
  data() {
    return {
      newShare: "",
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
    async getShare() {
      const resData = await this.$axios.get("http://127.0.0.1:8000/api/v1/share/");
      this.shareLists = resData.data.data;
    },
    insertShare() {
      firebase.auth().onAuthStateChanged((user) => {
        if(user){
          const uid = user.uid
          const sendData = {
            share:this.newShare,
            uid:uid,
          };
          console.log(sendData);
          //this.$axios.post("http://127.0.0.1:8000/api/v1/share/", sendData);
        }
      })
      this.getShare();
      //location.reload()
    },
  },
  created(){
    this.getShare();
  }
}
</script>

<style>
.home-container {
  display: flex;
}
.home-side {
  width: 20%;
  position: sticky;
  margin-bottom: 0;
  top: 10px;
  z-index: 1;
}
.home-main-content {
  display: block;
  width:100%;
}
.img-logo {
  padding: 10px;
}
.share-nav-list {
  padding: 0 10px;
}
.share-nav-item:first-child {
  margin-bottom: 10px;
}
.img-home,
.img-logout {
  width: 20px;
  height: 20px;
  vertical-align: middle;
}
.logout {
  background-color: transparent;
  border: none;
  cursor: pointer;
  outline: none;
  padding: 0;
  appearance: none;
  font-size: 16px;
  color: #fff;
}
.nuxt-link {
  vertical-align: middle;
}
.share-title {
  color: #fff;
  margin-bottom: 10px;
}
.share-content {
  display: block;
  padding: 20px 10px;
}
.share-textarea {
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
.home-button {
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
.img-heart,
.img-cross,
.img-detail{
  width:20px;
  height:20px;
}
</style>
