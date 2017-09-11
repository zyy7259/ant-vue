<script>
const ModalWrap = {
  data() {
    return {
      updateVisibleListened: false
    };
  },
  mounted() {
    if (!this.updateVisibleListened) {
      const modal = this.$children[0];
      modal.$on('update:visible', visible => {
        this.$emit('update:visible', visible);
      });
      this.updateVisibleListened = true;
    }
  }
};

export default ModalWrap;

ModalWrap.install = function install(Vue) {
  Vue.component('ModalWrap', ModalWrap);
};
</script>
