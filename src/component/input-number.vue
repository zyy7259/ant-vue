<template>
  <div class='ant-input-number' :class='{"ant-input-number-disabled": disabled, "ant-input-number-error": error}'>
    <div class='ant-input-number-handler-wrap'>
      <div class='ant-input-number-handler ant-input-number-handler-up'
        :class='{"ant-input-number-handler-disabled": currValue === max}'
        @click='up'>
        <icon type='up'></icon>
      </div>
      <div class='ant-input-number-handler ant-input-number-handler-down'
        :class='{"ant-input-number-handler-disabled": currValue === min}'
        @click='down'>
        <icon type='down'></icon>
      </div>
    </div>
    <input ref='ipt' type='text' class='ant-input-number-input' v-model='currValue' @blur='onBlur'>
  </div>
</template>

<script>
import Icon from 'src/component/icon';

const InputNumber = {
  components: {
    Icon,
  },
  props: {
    min: {
      type: Number,
      default: -Infinity,
    },
    max: {
      type: Number,
      default: Infinity,
    },
    maxlength: {
      type: Number,
      default: Infinity,
    },
    step: {
      type: [Number, String],
      default: 1,
    },
    value: {
      type: [Number, String],
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    // 是否在输入的时候进行校验和反馈
    simultaneous: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      currValue: '',
      prevValue: '',
      error: false,
      reg: null,
      acceptFloat: false,
    };
  },
  computed: {
    valueChanged() {
      return +this.prevValue !== +this.currValue;
    },
  },
  watch: {
    value: 'resetValue',
    currValue() {
      // 重置错误
      this.error = false;
      // 格式化 currValue
      const str = `${this.currValue}`;
      if (str) {
        // 正则解析
        const match = str.match(this.reg);
        // 如果没有匹配则置空
        if (!match) {
          this.currValue = '';
          return;
        }
        // 如果部分匹配那么只保留匹配到的值
        if (match[0] !== str) {
          this.currValue = match[0];
          return;
        }
        // 如果超过长度, 那么截断
        if (str.length > this.maxlength) {
          this.currValue = str.slice(0, this.maxlength);
          return;
        }
      }
      // 如果全匹配, 且需要实时反馈, 那么 emitValue
      // 如果不需要实时反馈, 那么在 onBlur 的时候 emitValue
      if (this.simultaneous) {
        this.emitValue();
      }
    },
    disabled() {
      if (!this.disabled) {
        this.focus();
      }
    },
    error() {
      if (this.error) {
        this.$emit('error');
      } else {
        this.$emit('errorclear');
      }
    },
  },
  methods: {
    resetValue() {
      if (+this.value !== +this.currValue) {
        this.currValue = this.value;
        this.prevValue = this.currValue;
      }
    },
    focus() {
      this.$refs.ipt.focus();
    },
    normalize(num) {
      const parse = this.acceptFloat ? parseFloat : parseInt;
      num = parse(num) || 0;
      if (num > this.max) {
        num = this.max;
      }
      if (num < this.min) {
        num = this.min;
      }
      return num;
    },
    up() {
      let value = +this.currValue;
      const reminder = value % this.step;
      if (reminder) {
        value -= reminder;
      }
      value += this.step;
      this.currValue = this.normalize(value);
    },
    down() {
      let value = +this.currValue;
      const reminder = value % this.step;
      if (reminder) {
        value -= reminder;
      } else {
        value -= this.step;
      }
      this.currValue = this.normalize(value);
    },
    onBlur() {
      if (!this.simultaneous) {
        this.emitValue();
      }
    },
    emitValue() {
      // 判断值是否有错
      const currValue = +this.currValue;
      let valid = currValue >= this.min && currValue <= this.max;
      if (!this.acceptFloat && currValue !== parseInt(currValue, 10)) {
        valid = false;
      }
      this.error = !valid;
      // 只有当值真的改变的时候再 emit
      if (this.valueChanged) {
        // 记录当前值为 prevValue
        this.prevValue = currValue;
        this.$emit('input', currValue);
      }
    },
  },
  created() {
    this.resetValue();
    // check if accept float
    const step = `${this.step}`;
    const parsedStep = `${parseInt(step, 10)}`;
    if (step !== parsedStep) {
      this.acceptFloat = true;
    }
    // init format reg
    this.reg = this.acceptFloat ? /[-+.0-9]+/ : /[0-9]+/;
  },
};

export default InputNumber;

InputNumber.install = function install(Vue) {
  Vue.component('InputNumber', InputNumber);
};
</script>
