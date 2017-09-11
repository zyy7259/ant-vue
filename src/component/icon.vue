<template>
  <svg :key='type' :class='`${prefix} ${prefix}-${type}`' aria-hidden="true">
    <use :xlink:href='`#${prefix}-${type}`'></use>
  </svg>
</template>
<script>
const Icon = {
  props: {
    type: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      prefix: 'anticon'
    };
  }
};

export default Icon;

Icon.install = function install(Vue) {
  Vue.component('Icon', Icon);
};
</script>
<style>
/* copied from http://www.iconfont.cn/ */
.anticon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
/* custom */
.anticon {
  color: #999;
}
</style>
