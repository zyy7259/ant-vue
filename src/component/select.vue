<template>
  <div class='ant-select' :class='{"ant-select-open": open, "ant-select-disabled": disabled}'>
    <div class='ant-select-trigger' @click='show'>
      <span class='ant-select-trigger-placeholder' v-if='!selectedItem'>{{placeholder}}</span>
      <span class='ant-select-trigger-selected-item' v-if='selectedItem'>{{selectedItem[textKey]}}</span>
      <icon type='lock' class='icon-disabled' v-if='disabled'></icon>
      <icon type='down' v-else></icon>
    </div>
    <ul class='ant-select-list'>
      <li v-for='item in list' class='ant-select-item' @click='select(item)'>
        {{item[textKey]}}
      </li>
    </ul>
  </div>
</template>

<script>
import { containsNode } from 'src/util/dom';
import Icon from './icon';

const Sel = {
  components: {
    Icon,
  },
  props: {
    value: null,
    placeholder: {
      type: String,
      default: '',
    },
    list: {
      type: Array,
      default: () => [],
    },
    textKey: {
      type: String,
      default: 'text',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      open: false,
      selectedItem: null,
    };
  },
  watch: {
    value: 'resetValue',
  },
  methods: {
    show() {
      if (this.disabled) {
        return;
      }
      this.open = true;
    },
    hide() {
      this.open = false;
    },
    onBodyClick({ target }) {
      if (!containsNode(this.$el, target)) {
        this.hide();
      }
    },
    select(item) {
      this.selectedItem = item;
      this.$emit('input', item);
      this.hide();
    },
    resetValue() {
      this.selectedItem = this.value;
    },
  },
  created() {
    this.resetValue();
    this.bodyClickHandler = this.onBodyClick.bind(this);
    document.body.addEventListener('click', this.bodyClickHandler);
  },
  destroyed() {
    document.body.removeEventListener('click', this.bodyClickHandler);
  },
};

export default Sel;

Sel.install = function install(Vue) {
  Vue.component('Sel', Sel);
};
</script>
