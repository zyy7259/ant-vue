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
    Icon
  },
  props: {
    type: {
      type: String,
      validator(value) {
        return ['success', 'info', 'warning', 'error'].indexOf(value) !== -1;
      }
    },
    closable: {
      type: Boolean,
      default: false
    },
    closeText: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    showIcon: {
      type: Boolean,
      default: false
    },
    banner: {
      type: Boolean,
      default: false
    },
    inline: {
      type: Boolean,
      default: false
    }
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
    }
  },
  methods: {
    onClose() {
      this.close();
    },
    close() {
      this.$emit('close');
    }
  }
};

export default Alert;

export function install(Vue) {
  Vue.component('Alert', Alert);
}
</script>

<style>
.ant-alert {
  position: relative;
  display: flex;
  align-items: center;
  padding: 6px 38px 6px 16px;
  font-size: 12px;
  line-height: 18px;
  border: 1px solid transparent;
  border-radius: 4px;
  color: #666;
  margin-bottom: 10px;
}

.ant-alert-inline {
  display: inline-flex;
  margin-bottom: 0;
}

.ant-alert-icon {
  margin-right: 8px;
  font-size: 12px;
}

.ant-alert-close {
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  padding: 2px;
  font-size: 12px;
  color: #999;
  cursor: pointer;
}

.ant-alert-success {
  background-color: #F3FAF0;
  border-color: #E7F5E0;

  .ant-alert-icon {
    color: #87D068;
  }
}

.ant-alert-error {
  background-color: #FFEEE6;
  border-color: #FFDDCC;

  .ant-alert-icon {
    color: #FF5500;
  }
}
</style>
