<template>
  <div class="home">
    welcome, this is right
    <p>this is {{ store }}</p>
    <frame-bottom />
  </div>
</template>
<script>
import FrameBottom from 'src/components/bottom.vue';
export default {
  name: 'Home',
  components: {
    FrameBottom,
  },
  data() {
    return {
      store: this.$store.state.data,
    };
  },
};
</script>
<style lang="less">
.home {
  border: 1px solid blue;
  background: #ccc;
}
</style>
`
