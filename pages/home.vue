<template>
  <div>
    <table>
      <tr>
        <th>ホーム</th>
      </tr>
      <tr v-for="item in shareLists" :key="item.id">
        <td>
          <div>
            <div>username</div>
            <img class="img-heart" src="/images/heart.png"/>
            <img class="img-cross" src="/images/cross.png"/>
            <img class="img-detail" src="/images/detail.png"/>
          </div>
          <div v-model="item.share"></div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  layout: "home",
};
</script>
