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
      required: true,
    },
  },
  data() {
    return {
      prefix: 'anticon',
    };
  },
};

export default Icon;

Icon.install = function install(Vue) {
  Vue.component('Icon', Icon);
};
</script>
