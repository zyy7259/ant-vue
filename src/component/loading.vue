<template>
  <div :class='["ant-loading-wrap", inline ? "ant-loading-wrap-inline" : ""]'>
    <div v-if='showLoading' :class='["ant-loading", inline ? "" : "ant-loading-block", loadingClass]'>
      <template v-if='errorInner'>
        <slot name='error'>
          <Alert type='error' :message='errorMsg' showIcon></Alert>
        </slot>
      </template>
      <div v-else class='icon-wrap'>
        <Icon type='loading'></Icon>
      </div>
    </div>
    <slot v-else></slot>
  </div>
</template>

<script>
import Icon from "./icon";
import Alert from "./alert";

export default {
  components: {
    Icon,
    Alert
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    loadingClass: {
      type: String,
      default: ""
    },
    error: {
      type: [Object, String],
      default: null
    },
    hideError: {
      type: Boolean,
      default: false
    },
    promise: {
      type: Promise,
      default: null
    },
    inline: {
      type: Boolean,
      default: false
    },
    global: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      default: ""
    },
    description: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      loadingInner: false,
      errorInner: null
    };
  },
  computed: {
    showLoading() {
      return this.loadingInner || (!this.hideError && this.errorInner);
    },
    errorMsg() {
      if (!this.errorInner) {
        return "";
      }
      return this.errorInner.msg || this.errorInner.message || "unknown error";
    }
  },
  watch: {
    loading: "resetLoading",
    error: "resetError",
    promise: "resetPromise"
  },
  methods: {
    resetLoading() {
      this.loadingInner = this.loading;
    },
    resetError() {
      this.errorInner = this.error;
    },
    resetPromise() {
      if (this.promise && this.promise.then) {
        this.loadingInner = true;
        this.promise
          .catch(error => {
            this.errorInner = error;
          })
          .then(() => {
            this.loadingInner = false;
          });
      }
    }
  },
  created() {
    this.resetLoading();
    this.resetError();
    this.resetPromise();
  }
};
</script>

<style lang='postcss'>
.ant-loading-wrap {
  .anticon-loading {
    animation: spin 2s linear infinite;
  }

  &-inline {
    display: inline-block;
  }

  .ant-loading-block {
    .icon-wrap {
      margin: 20px 0;
      text-align: center;
    }
  }
}
</style>
