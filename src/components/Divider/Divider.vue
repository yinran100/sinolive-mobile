<template>
  <div :class="classes">
    <span
      v-if="hasSlot"
      :class="slotClasses"
    >
      <slot></slot>
    </span>
  </div>
</template>

<script>
const prefixCls = "divider";
function oneOf(value, validList) {
  for (let i = 0; i < validList.length; i++) {
    if (value === validList[i]) {
      return true;
    }
  }
  return false;
}

export default {
  name: "Divider",
  props: {
    type: {
      type: String,
      default: "horizontal",
      validator(value) {
        return oneOf(value, ["horizontal", "vertical"]);
      }
    },
    orientation: {
      type: String,
      default: "center",
      validator(value) {
        return oneOf(value, ["left", "right", "center"]);
      }
    },
    dashed: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    hasSlot() {
      return !!this.$slots.default;
    },
    classes() {
      return [
        `${prefixCls}`,
        `${prefixCls}-${this.type}`,
        {
          [`${prefixCls}-with-text-${this.orientation}`]: this.hasSlot,
          [`${prefixCls}-dashed`]: !!this.dashed
        }
      ];
    },
    slotClasses() {
      return [`${prefixCls}-inner-text`];
    }
  }
};
</script>
<style scoped>
.divider {
  font-size: 14px;
  line-height: 1.5;
  color: #515a6e;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  list-style: none;
  background: #e8eaec;
}
.divider,
.divider-vertical {
  margin: 12px 8px;
  display: inline-block;
  width: 1px;
  vertical-align: middle;
  position: relative;
}
.divider-horizontal {
  display: block;
  height: 1px;
  width: 100%;
  margin: 24px 0;
  clear: both;
}
.divider-horizontal.divider-with-text-center,
.divider-horizontal.divider-with-text-left,
.divider-horizontal.divider-with-text-right {
  display: table;
  white-space: nowrap;
  text-align: center;
  background: 0 0;
  font-weight: 500;
  color: #808695;
  font-size: 16px;
  margin: 16px 0;
}
.divider-horizontal.divider-with-text-center:after,
.divider-horizontal.divider-with-text-center:before,
.divider-horizontal.divider-with-text-left:after,
.divider-horizontal.divider-with-text-left:before,
.divider-horizontal.divider-with-text-right:after,
.divider-horizontal.divider-with-text-right:before {
  content: "";
  display: table-cell;
  position: relative;
  top: 50%;
  width: 50%;
  border-top: 1px solid #e8eaec;
  transform: translateY(50%);
}
.divider-horizontal.divider-with-text-left,
.divider-horizontal.divider-with-text-right {
  font-size: 14px;
}
.divider-horizontal.divider-with-text-left .divider-inner-text,
.divider-horizontal.divider-with-text-right .divider-inner-text {
  display: inline-block;
  padding: 0 10px;
}
.divider-horizontal.divider-with-text-left:before {
  top: 50%;
  width: 5%;
}
.divider-horizontal.divider-with-text-left:after {
  top: 50%;
  width: 95%;
}
.divider-horizontal.divider-with-text-right:before {
  top: 50%;
  width: 95%;
}
.divider-horizontal.divider-with-text-right:after {
  top: 50%;
  width: 5%;
}
.divider-inner-text {
  display: inline-block;
  padding: 0 24px;
}
.divider-dashed {
  background: 0 0;
  border-top: 1px dashed #e8eaec;
}
.divider-horizontal.divider-with-text-left.divider-dashed,
.divider-horizontal.divider-with-text-right.divider-dashed,
.divider-horizontal.divider-with-text.divider-dashed {
  border-top: 0;
}
.divider-horizontal.divider-with-text-left.divider-dashed:after,
.divider-horizontal.divider-with-text-left.divider-dashed:before,
.divider-horizontal.divider-with-text-right.divider-dashed:after,
.divider-horizontal.divider-with-text-right.divider-dashed:before,
.divider-horizontal.divider-with-text.divider-dashed:after,
.divider-horizontal.divider-with-text.divider-dashed:before {
  border-style: dashed none none;
}
</style>
