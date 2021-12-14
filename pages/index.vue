<template>
  <div class="content">
    <validation-observer ref="obs" v-slot="ObserverProps">
      <label class="content-label">新規登録</label>
      <br />
      <validation-provider v-slot="{ errors }" rules="required|max:20">
        <input
          v-model="name"
          class="content-input"
          type="text"
          name="name"
          value=""
          placeholder="ユーザーネーム"
        />
        <div class="error">{{ errors[0] }}</div>
      </validation-provider>
      <validation-provider v-slot="{ errors }" rules="required|email">
        <input
          v-model="email"
          class="content-input"
          type="email"
          name="email"
          value=""
          placeholder="メールアドレス"
        />
        <div class="error">{{ errors[0] }}</div>
      </validation-provider>
      <validation-provider v-slot="{ errors }" rules="required|min:6">
        <input
          v-model="password"
          class="content-input"
          type="password"
          name="password"
          value=""
          placeholder="パスワード"
        />
        <div class="error">{{ errors[0] }}</div>
      </validation-provider>
      <button
        class="button"
        type="button"
        @click="register"
        :disabled="ObserverProps.invalid || !ObserverProps.validated"
      >
        新規登録
      </button>
    </validation-observer>
  </div>
</template>

<script>
import firebase from "~/plugins/firebase";
export default {
  layout:'default',
  data() {
    return {
      name: null,
      email: null,
      password: null,
      uid:null,
    };
  },
  methods: {
    register() {
      if (!this.email || !this.password) {
        alert("メールアドレスまたはパスワードが入力されていません。");
        return;
      }
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then((data) => {
          data.user.sendEmailVerification().then(() => {
            this.insertUser();
            this.$router.replace("/login");
          });
        })
        .catch((error) => {
          switch (error.code) {
            case "auth/invalid-email":
              alert("メールアドレスの形式が違います。");
              break;
            case "auth/email-already-in-use":
              alert("このメールアドレスは既に使われています。");
              break;
            case "auth/weak-password":
              alert("パスワードは6文字以上で入力して下さい。");
              break;
            default:
              alert("エラーが起きました。しばらくしてから再度お試しください。");
              break;
          }
        });
    },
    insertUser(){
      firebase.auth().onAuthStateChanged((user) => {
        if(user){
          const uid = user.uid
          const sendData = {
            name:this.name,
            uid: uid
          };
          console.log(sendData);
          this.$axios.post("http://127.0.0.1:8000/api/v1/user", sendData);
        }
      });
    },
  },
};
</script>
