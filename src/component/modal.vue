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
        data: { ...Modal.data(), confirmType },
        mixins: [
          {
            created() {
              this.$on('update:visible', visible => {
                this.visible = visible;
              });
            }
          }
        ]
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
