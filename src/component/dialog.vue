<template>
  <div>
  	<div class="ant-dialog-background" v-show="show"></div>
  	<div class="ant-dialog-content" v-show="show">
  		<div class="ant-flex-box common-top">
        <div class='ant-dialog-left'>
          <Icon type='exclamation-circle' class='ant-dialog-icon'></Icon>
        </div>
  			<div class='grid-cell u-full'>
	  			<p class="ant-dialog-title">{{title}}</p>
	  			<p class="ant-dialog-warning-content">{{content}}</p>
  			</div>
  		</div>
  		<div class="ant-dialog-margin">
  			<button v-on:click="cancel" class='ant-dialog-button'>取消</button>
  			<button v-on:click="confirm"class='ant-dialog-button ant-dialog-button-hightLight'>确定</button>
  		</div>
  	</div>
  </div>
</template>
<script>
import Icon from "./icon";
export default {
  name: "dialog",
  components: {
    Icon
  },

  data() {
    return {
      show: false,
      title: "确认需要提交这条规则吗",
      content: ""
    };
  },

  methods: {
    open: function(params) {
      this.show = true;
      this.title = params.title;
      this.content = params.content;
      document.body.style.overflow = "hidden";
    },

    confirm: function() {
      this.show = false;
      this.$emit("confirm");
    },

    cancel: function() {
      this.show = false;
      this.$emit("cancel");
    }
  }
};
</script>

<style>
.ant-dialog-background{
  position: fixed;
  background-color: black;
  left: 0px;
  top: 0px;
  right: 0px;
  bottom: 0px;
  opacity: 0.5;
  z-index: 99998;
}

.ant-dialog-content {
	width: 416px;
	height: 228px;
	left: 50%;
	top: 50%;
	background-color: white;
	opacity: 1;
	margin-left: -200px;
    margin-top:-100px;
	position: absolute;
	z-index: 99999;
	border: 1px solid #D9D9D9;
  	border-radius: 4px;
}

.ant-dialog-title {
	color: #000000;
	font-size: 14px;
}

.ant-dialog-warning-content {
	width: 270px;
	padding-top: 9px;
	color: #000000;
	font-size: 12px;
}

.ant-dialog-margin {
	margin-top: 20px;
	margin-left: 60%;
}

.ant-dialog-button {
	width: 66px;
	height: 30px;
	border: 1px solid #D9D9D9;
  border-radius: 4px;
  color: #000000;
  background-color: white;
}

.ant-dialog-button-hightLight {
	background-color: #40C9B3;
	color: white;
}

.ant-flex-box {
	display: flex;
}

.grid-cell .u-full{
	flex: 0 0 50%;
}

.ant-dialog-left {
	width: 80px;
	height: 100px;
	background-color: white;
}

.ant-dialog-icon {
  float: right;
  margin-right: 5px;
  color: #FFAA00;
}

.common-top {
	margin-top: 40px;
}

.common-left {
	margin-left: 80px;
}

</style>
