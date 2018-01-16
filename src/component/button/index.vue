<template>
  <button :type='htmlType' :disabled='disabled' :class='btnClass' @click='onClick'>
    <slot></slot>
    <Loading inline hideError :loading='loading' :promise='promise'></Loading>
  </button>
</template>

<script>
import Loading from './loading';

const sizeToClass = {
  small: 'sm',
  large: 'lg',
};

const Btn = {
  components: {
    Loading,
  },
  props: {
    type: {
      type: String,
    },
    htmlType: {
      type: String,
      default: 'button',
    },
    icon: {
      type: String,
    },
    shape: {
      type: String,
    },
    size: {
      type: String,
    },
    ghost: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    promise: {
      type: Promise,
      default: null,
    },
  },
  data() {
    return {};
  },
  computed: {
    btnClass() {
      let clazz = 'ant-btn';
      if (this.type) {
        clazz += ` ant-btn-${this.type}`;
      }
      if (sizeToClass[this.size]) {
        clazz += ` ant-btn-${sizeToClass[this.size]}`;
      }
      return clazz;
    },
  },
  methods: {
    onClick() {
      if (!this.loading) {
        this.$emit('click');
      }
    },
  },
};

export default Btn;

Btn.install = function install(Vue) {
  Vue.component('Btn', Btn);
};
</script>
