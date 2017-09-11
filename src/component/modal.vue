<template>
  <div v-if='visible'>
    <div class='ant-modal-mask'></div>
    <div class='ant-modal-wrap' @click='onClickMask'>
      <div class='ant-modal' :class='{[`ant-modal-confirm ant-modal-confirm-${confirmType}`]: isConfirm}'>
        <Icon type='cross' v-if='!isConfirm' class='ant-modal-close' @click.native='clickCancel'></Icon>
        <Icon :type='iconType || confirmIconType' v-if='isConfirm' class='ant-modal-confirm-icon'></Icon>
        <div class='ant-modal-header'>{{title}}</div>
        <div class='ant-modal-body'>
          <template v-if='content'>
            <p v-for='text in parsedContent'>{{text}}</p>
          </template>
          <slot v-else></slot>
        </div>
        <div class='ant-modal-footer'>
          <btn size='large' @click='clickCancel'>{{cancelText}}</btn>
          <btn type='primary' size='large' @click='clickOK' :loading='oking'>{{okText}}</btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Btn from 'src/component/btn';
import Icon from 'src/component/icon';

let Vue;

const Modal = {
  components: {
    Btn,
    Icon
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    content: {
      type: [String, Array],
      default: ''
    },
    okText: {
      type: String,
      default: '确 定'
    },
    cancelText: {
      type: String,
      default: '取 消'
    },
    iconType: {
      type: String
    },
    maskClosable: {
      type: Boolean,
      default: false
    },
    onOK: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      confirmType: '',
      oking: false
    };
  },
  computed: {
    isConfirm() {
      return !!this.confirmType;
    },
    parsedContent() {
      if (Array.isArray(this.content)) {
        return this.content;
      }
      return [this.content];
    },
    confirmIconType() {
      switch (this.confirmType) {
        case 'confirm':
          return 'exclamation-circle';
        case 'info':
          return 'info-circle';
        case 'success':
          return 'check-circle';
        case 'error':
          return 'cross-circle';
        case 'warning':
          return 'exclamation-circle';
        default:
          return '';
      }
    }
  },
  watch: {
    visible: 'onVisibleChange'
  },
  methods: {
    onVisibleChange() {
      if (this.visible) {
        this.show();
      } else {
        this.hide();
      }
    },
    show() {
      document.body.style.overflow = 'hidden';
      this.$emit('update:visible', true);
      return Promise.resolve().then(() => {
        this.$emit('show');
      });
    },
    hide() {
      document.body.style.overflow = '';
      this.$emit('update:visible', false);
      return Promise.resolve().then(() => {
        this.$emit('hide');
      });
    },
    onClickMask() {
      if (this.maskClosable) {
        this.hide();
      }
    },
    clickCancel() {
      this.hide().then(() => {
        this.$emit('cancel');
      });
    },
    clickOK() {
      const hide = () => {
        return this.hide().then(() => {
          this.$emit('ok');
        });
      };
      const ok = this.onOK();
      if (ok.then) {
        this.oking = true;
        ok
          .then(() => {
            this.oking = false;
            return hide();
          })
          .catch(() => {
            this.oking = false;
          });
      } else {
        return hide();
      }
    }
  },
  mounted() {
    this.onVisibleChange();
  },
  created() {
    if (!this.$parent) {
      this.$mount();
      document.body.appendChild(this.$el);
    }
  },
  info() {
    return Modal.confirm({
      confirmType: 'info'
    });
  },
  success() {
    return Modal.confirm({
      confirmType: 'success'
    });
  },
  error() {
    return Modal.confirm({
      confirmType: 'error'
    });
  },
  warning() {
    return Modal.confirm({
      confirmType: 'warning'
    });
  },
  confirm({ confirmType = 'confirm', ...props }) {
    return new Vue({
      ...Modal,
      ...{
        propsData: { visible: true, ...props },
        data: { ...Modal.data(), confirmType }
      }
    });
  }
};

export default Modal;

Modal.install = function install(vue) {
  Vue = vue;
  Vue.component('Modal', Modal);
};
</script>

<style lang='postcss'>
.ant-modal-mask {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.6);
}

.ant-modal-wrap {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  overflow: auto;
}

.ant-modal {
  position: relative;
  margin: 100px auto 24px;
  width: 520px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,.2);
}

.ant-modal-close {
  position: absolute;
  cursor: pointer;
  top: 16px;
  right: 16px;
  font-size: 14px;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.45);
}

.ant-modal-header {
  padding: 14px 16px;
  color: rgba(0, 0, 0, 0.65);
  background-color: #fff;
  border-radius: 4px 4px 0 0;
  border-bottom: 1px solid #e9e9e9;
}

.ant-modal-body {
  padding: 16px;
  font-size: 12px;
  line-height: 1.5;
}

.ant-modal-footer {
  padding: 10px 16px;
  text-align: right;
  border-top: 1px solid #e9e9e9;
  border-radius: 0 0 4px 4px;

  button + button {
    margin-left: 8px;
  }
}

.ant-modal-confirm {
  width: 420px;
  padding: 30px 40px 30px 82px;
  line-height: 18px;

  .ant-modal-header {
    padding: 0;
    border: 0;
    font-weight: 700;
    font-size: 14px;
  }

  .ant-modal-body {
    margin-top: 8px;
    padding: 0;
    border: 0;
    color: rgba(0, 0, 0, 0.65);
    font-size: 12px;
  }

  .ant-modal-footer {
    margin-top: 30px;
    padding: 0;
    border: 0;
  }

  .ant-modal-confirm-icon {
    position: absolute;
    top: 30px;
    left: 40px;
    font-size: 26px;
  }

  &-confirm {
    .ant-modal-confirm-icon {
      color: #ffbf00;
    }
  }

  &-info {
    .ant-modal-confirm-icon {
      color: #108ee9;
    }
  }

  &-success {
    .ant-modal-confirm-icon {
      color: #00a854;
    }
  }

  &-error {
    .ant-modal-confirm-icon {
      color: #f04134;
    }
  }

  &-warning {
    .ant-modal-confirm-icon {
      color: #ffbf00;
    }
  }
}
</style>
