<template>
  <div>
    <div class="frame-top">top</div>
    <div>
      <router-view />
    </div>
  </div>
</template>
<script>
export default {
  name: 'TopBottom',
};
</script>
<style lang="less">
@color: #ccc;
.frame-top {
  color: @color;
}
</style>
