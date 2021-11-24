<template>
  <div>
    <header class="header">
      <div class="header-img-container">
        <img class="img-logo" src="/images/logo.png" />
      </div>
      <nav class="header-nav">
        <ul class="header-nav-list">
          <li class="header-nav-item">
            <NuxtLink to="/" class="nuxt-link">新規登録</NuxtLink>
          </li>
          <li class="header-nav-item">
            <NuxtLink to="/login" class="nuxt-link">ログイン</NuxtLink>
          </li>
        </ul>
      </nav>
    </header>
    <Nuxt />
  </div>
</template>

<style>
body {
  background-color: #15202b;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  height: 50px;
}
.header-nav-list {
  display: flex;
  font-weight: bold;
  list-style: none;
}
.header-nav-item:not(:last-child) {
  margin-right: 20px;
}
.nuxt-link {
  color: #fff;
  text-decoration: none;
  font-size:16px;
}
.img-logo {
  width: 150px;
}
.content {
  border-radius: 1em;
  background-color: #fff;
  width: 50vw;
  margin: 100px auto;
  padding: 20px 0;
  text-align: center;
}
.content-label {
  font-size: 18px;
  font-weight: bold;
}
.content-input {
  border: 1px solid #000;
  width: 70%;
  border-radius: 1em;
  padding: 1.3em 1em;
  margin-top: 15px;
  font-weight: bold;
  text-decoration: none;
}
.button {
  background-color: #571ddc;
  border: none;
  border-radius: 1.5em;
  margin-top: 20px;
  padding: 0.8em 2em;
  color: #fff;
  text-decoration: none;
  cursor: pointer;
}
.button:active {
  background-color: #9c7cec;
}
</style>
