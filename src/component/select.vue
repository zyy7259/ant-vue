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
    Icon
  },
  props: {
    value: null,
    placeholder: {
      type: String,
      default: ''
    },
    list: {
      type: Array,
      default: () => []
    },
    textKey: {
      type: String,
      default: 'text'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      open: false,
      selectedItem: null
    };
  },
  watch: {
    value: 'resetValue'
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
    }
  },
  created() {
    this.resetValue();
    this.bodyClickHandler = this.onBodyClick.bind(this);
    document.body.addEventListener('click', this.bodyClickHandler);
  },
  destroyed() {
    document.body.removeEventListener('click', this.bodyClickHandler);
  }
};

export default Sel;

Sel.install = function install(Vue) {
  Vue.component('Sel', Sel);
};
</script>

<style>
@import 'src/style/util/index.css';

.ant-select {
  position: relative;
  display: inline-block;
}

.ant-select-trigger {
  position: relative;
  padding: 4px 34px 4px 8px;
  font-size: 12px;
  line-height: 18px;
  border: 1px solid #D9D9D9;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;

  .ant-select-trigger-placeholder {
    color: #ccc;
  }

  .ant-select-trigger-selected-item {
    @mixin ellipsis;

    color: #666;
  }

  .anticon {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #ccc;
    font-size: 9px;
  }

  .anticon-disabled {
    font-size: 12px;
  }
}

.ant-select-list {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  border: 1px solid #D9D9D9;
  border-radius: 0 0 4px 4px;
  background-color: white;
}

.ant-select-item {
  padding: 7px 0 7px 15px;
  font-size: 12px;
  line-height: 18px;
  cursor: pointer;

  &:hover {
    background-color: #E7F3FC;
  }
}

.ant-select-open {
  .ant-select-trigger {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border-bottom-color: transparent;
  }

  .ant-select-list {
    display: block;
  }
}

.ant-select-disabled {
  .ant-select-trigger {
    background-color: #F7F7F7;
    border-color: #D9D9D9;
    cursor: default;
  }
  .ant-select-trigger-selected-item {
    color: #CCC;
  }
}
</style>
