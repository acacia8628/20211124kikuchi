<template>
  <div class="content">
    <validation-observer ref="obs" v-slot="ObserverProps">
      <label class="content-label">ログイン</label>
      <br />
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
        @click="login"
        :disabled="ObserverProps.invalid || !ObserverProps.validated"
      >
        ログイン
      </button>
    </validation-observer>
  </div>
</template>

<script>
import firebase from '~/plugins/firebase'
export default {
  data() {
    return {
      email: null,
      password: null,
    }
  },
  methods: {
    login() {
      if (!this.email || !this.password) {
        alert('メールアドレスまたはパスワードが入力されていません。')
        return
      }
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(() => {
          alert('ログインが完了しました')
          this.$router.push('/home')
        })
        .catch((error) => {
          switch (error.code) {
            case 'auth/invalid-email':
              alert('メールアドレスの形式が違います。')
              break
            case 'auth/user-disabled':
              alert('ユーザーが無効になっています。')
              break
            case 'auth/user-not-found':
              alert('ユーザーが存在しません。')
              break
            case 'auth/wrong-password':
              alert('パスワードが間違っております。')
              break
            default:
              alert('エラーが起きました。しばらくしてから再度お試しください。')
              break
          }
        })
    },
  },
}
</script>