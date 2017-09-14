<template>
  <div class='ant-alert' :class='[`ant-alert-${type}`, {"ant-alert-inline": inline}]'>
    <icon :type='iconType' class='ant-alert-icon' v-if='showIcon'></icon>
    <span class='ant-alert-message'>{{message}}</span>
    <icon type='cross' class='ant-alert-close' @click.native='onClose' v-if='closable'></icon>
  </div>
</template>

<script>
import Icon from './icon';

const Alert = {
  components: {
    Icon,
  },
  props: {
    type: {
      type: String,
      validator(value) {
        return ['success', 'info', 'warning', 'error'].indexOf(value) !== -1;
      },
    },
    closable: {
      type: Boolean,
      default: false,
    },
    closeText: {
      type: String,
      default: '',
    },
    message: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    showIcon: {
      type: Boolean,
      default: false,
    },
    banner: {
      type: Boolean,
      default: false,
    },
    inline: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  computed: {
    iconType() {
      switch (this.type) {
        case 'success':
          return 'check-circle';
        case 'info':
          return '';
        case 'warning':
          return 'exclamation-circle';
        case 'error':
          return 'cross-circle';
        default:
          return '';
      }
    },
  },
  methods: {
    onClose() {
      this.close();
    },
    close() {
      this.$emit('close');
    },
  },
};

export default Alert;

Alert.install = function install(Vue) {
  Vue.component('Alert', Alert);
};
</script>
