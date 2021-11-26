<template>
  <div>
    <table class="home-table">
      <tr>
        <th class="home-table__ttl">ホーム</th>
      </tr>
      <tr v-for="item in shareLists" :key="item.id" class="home-table__content">
        <td>
          <div class="home-content__item">
            <div>username</div>
            <div class="item-container">
              <img class="img-heart" src="/images/heart.png"/>
            </div>
            <div class="item-container">
              aaa
            </div>
            <div class="item-container">
              <img class="img-cross" src="/images/cross.png"/>
            </div>
            <div class="item-container">
              <img class="img-detail" src="/images/detail.png"/>
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
    async insertShare() {
      const sendData = {
        share: this.newShare,
      };
      await this.$axios.post("http://127.0.0.1:8000/api/v1/share/", sendData);
      this.getShare();
    },
    async updateShare(id, share) {
      const sendData = {
        share: share,
      };
      await this.$axios.put("http://127.0.0.1:8000/api/v1/share/" + id, sendData);
      this.getShare();
    },
    async deleteShare(id) {
      await this.$axios.delete("http://127.0.0.1:8000/api/v1/share/" + id);
      this.getShare();
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