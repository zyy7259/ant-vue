<template>
  <div class='ant-table'></div>
</template>

<script>
const Table = {
  data() {
    return {};
  }
};

export default Table;

Table.install = function install(Vue) {
  Vue.component('Table', Table);
};
</script>

<style lang='postcss'>
</style>
