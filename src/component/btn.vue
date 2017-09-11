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
  large: 'lg'
};

const Btn = {
  components: {
    Loading
  },
  props: {
    type: {
      type: String
    },
    htmlType: {
      type: String,
      default: 'button'
    },
    icon: {
      type: String
    },
    shape: {
      type: String
    },
    size: {
      type: String
    },
    ghost: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    promise: {
      type: Promise,
      default: null
    }
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
    }
  },
  methods: {
    onClick() {
      if (!this.loading) {
        this.$emit('click');
      }
    }
  }
};

export default Btn;

Btn.install = function install(Vue) {
  Vue.component('Btn', Btn);
};
</script>

<style lang='postcss'>
.ant-btn {
  position: relative;
  display: inline-block;
  padding: 5px 16px;
  margin-bottom: 0;
  font-size: 12px;
  line-height: 18px;
  border-radius: 6px;
  border: 1px solid #d9d9d9;
  color: rgba(0, 0, 0, 0.65);
  background-color: white;
  text-align: center;
  touch-action: manipulation;
  user-select: none;
  cursor: pointer;
  background-image: none;
  white-space: nowrap;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);

  .anticon {
    margin-left: 4px;
  }
}

.ant-btn-lg {
  font-size: 14px;
  line-height: 20px;
}

.ant-btn, .ant-btn:active, .ant-btn:focus {
  outline: 0;
}

.ant-btn:not([disabled]):hover {
  text-decoration: none;
}

.ant-btn:not([disabled]):active {
  outline: 0;
  transition: none;
}

.ant-btn.disabled, .ant-btn[disabled] {
  cursor: not-allowed;
}

.ant-btn.disabled > *, .ant-btn[disabled] > * {
  pointer-events: none;
}

.ant-btn-primary {
  color: #fff;
  background-color: #40c9b3;
  border-color: #40c9b3;
}

.ant-btn-primary:focus, .ant-btn-primary:hover {
  color: #fff;
  background-color: #40c9b3;
  border-color: #40c9b3;
}

.ant-btn-primary.active, .ant-btn-primary:active {
  color: #fff;
  background-color: #40c9b3;
  border-color: #40c9b3;
}

.ant-btn-simple {
  border-color: white;
  background-color: white;
  padding: 0;
  color: #04c9b3;

  &[disabled] {
    color: #9b9b9b;
    pointer-events: none;
  }

  &-black {
    color: #666;
  }
}
</style>
