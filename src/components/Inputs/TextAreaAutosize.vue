<template>
  <div class="" style="height: fit-content">
<!--    <slot name="label">-->
<!--      <label v-if="label" :class="{[labelClasses]: true, 'it-has-a-tooltip': !!tooltip}"-->
<!--             v-tooltip.top="tooltip">-->
<!--        {{label}}-->
<!--        <fa-icon icon="info-circle" v-if="tooltip" :style="{ color: '#3c9be6' }"/>-->
<!--      </label>-->
<!--    </slot>-->
    <pre ref="textarea"
      v-if="disabled"
      class="mb-0"
      style="white-space: pre-wrap; word-break: break-word;cursor: default"
      :style="computedStyles"
      v-html="$autoLinkText(_value)"
      v-bind="$attrs"
      v-on="listeners"
      :disabled="disabled"
      @focus="resizeUp"
      @blur="resizeDown"/>
    
    <textarea ref="textarea"
              v-else
      class=""
      :style="computedStyles"
      v-model="_value"
      v-bind="$attrs"
      v-on="listeners"
      :disabled="disabled"
      @input.self="resizeUp"
      @focus="resizeUp"
      @blur="resizeDown">
    </textarea>
    <div class="more-text-available" v-if="is_collapsed && contentHeight() > minHeight && !disabled && !hide_arrow">
      ...
      <fa-icon icon="reply" class="adjust-more-icon"/>
    </div>
  </div>
</template>
<script>
export default {
	name: 'TextareaAutosize',
	inject: {
		$autoLinkText: {
			from: '$autoLinkText'
		}
	},
	props: {
		value: {
			type: [String, Number, Event],
			default: ''
		},
		label: {
			type: [String],
			default: ''
		},
		tooltip: {
			type: [String],
			default: ''
		},
		labelClasses: {
			type: [String],
			default: ''
		},
		autosize: {
			type: Boolean,
			default: true
		},
		minHeight: {
			type: [Number],
			default: 30
		},
		maxHeight: {
			type: [Number],
			default: 800
		},
		disabled: {
			type: Boolean,
			default: false
		},
		hide_arrow: {
			type: Boolean,
			default: false
		},
		always_expanded: {
			type: Boolean,
			default: false
		},
		/*
       * Force !important for style properties
       */
		important: {
			type: [Boolean, Array],
			default: false
		}
	},
	data () {
		return {
			touched: false,
			// focused: false,
			// hadError: false,
			maxHeightScroll: false,
			is_collapsed: true,
			height: 'auto'
		}
	},
	computed: {
		_value: {
			get: function() {
				return this.value
			},
			set: function(val) {
				return this.updateValue(val)
			}
		},
		listeners () {
			return {
				input: this.updateValue,
				focus: this.onFocus,
				blur: this.onBlur
			}
		},
		computedStyles () {
			if (!this.autosize) return {}
			return {
				resize: !this.isResizeImportant ? 'none' : 'none !important',
				height: this.height,
				overflow: this.maxHeightScroll ? 'auto' : (!this.isOverflowImportant ? 'hidden' : 'hidden !important')
			}
		},
		isResizeImportant () {
			const imp = this.important
			return imp === true || (Array.isArray(imp) && imp.includes('resize'))
		},
		isOverflowImportant () {
			const imp = this.important
			return imp === true || (Array.isArray(imp) && imp.includes('overflow'))
		},
		isHeightImportant () {
			const imp = this.important
			return imp === true || (Array.isArray(imp) && imp.includes('height'))
		}
	},
	watch: {
		value (val) {
			if (val && this.always_expanded) this.resizeUp()
		},
		disabled (val) {
			if (val) this.resizeUp()
		},
		// val (val) {
		//   // this.$nextTick(this.resizeUp)
		//   this.$emit('input', val)
		// },
		// minHeight () {
		//   this.$nextTick(this.resizeUp)
		// },
		// maxHeight () {
		//   this.$nextTick(this.resizeUp)
		// },
		autosize (val) {
			if (val) this.resizeUp()
		},
		always_expanded (val) {
			if (val) this.resizeUp()
		}
	},
	methods: {
		updateValue (evt) {
			const value = evt.target && evt.target.value ? evt.target.value : ''
			if (!this.touched && value)
				this.touched = true

			this.$emit('input', value)
		},
		onFocus (value) {
			this.focused = true
			this.$emit('focus', value)
		},
		onBlur (value) {
			this.focused = false
			this.$emit('blur', value)
		},
		contentHeight() {
			if (this.$refs.textarea)
				return this.$refs.textarea.scrollHeight + 1
			else
				return this.minHeight
		},
		resizeUp () {
			// console.log('resizeUp START')
			const important = this.isHeightImportant ? 'important' : ''
			this.height = `auto${important ? ' !important' : ''}`
			this.$nextTick(() => {
				let contentHeight = this.contentHeight()
				if (this.minHeight)
					contentHeight = contentHeight < this.minHeight ? this.minHeight : contentHeight

				if (this.maxHeight) {
					if (contentHeight > this.maxHeight) {
						contentHeight = this.maxHeight
						this.maxHeightScroll = true
					} else
						this.maxHeightScroll = false
				}
				this.is_collapsed = false
				const heightVal = contentHeight + 'px'
				this.height = `${heightVal}${important ? ' !important' : ''}`
			})
		},
		resizeDown () {
			if (!this.always_expanded) {
				const important = this.isHeightImportant ? 'important' : ''
				this.height = `auto${important ? ' !important' : ''}`
				this.$nextTick(() => {
					const heightVal = this.minHeight + 'px'
					this.height = `${heightVal}${important ? ' !important' : ''}`
					this.is_collapsed = true
				})
			}
		}
	},
	created () {
	},
	mounted () {
		if (this.value)
			this.val = String(this.value)

		if (this.autosize || this.always_expanded)
			this.resizeUp()
		 else
			this.resizeDown()
	}
}
</script>
<style scoped lang="scss">
  .more-text-available {
    position: relative;
    right: 5px;
    bottom: 35px;
    text-align: end;
    height: 0;
    color: gainsboro;
  }
  .adjust-more-icon {
    transform: rotate(270deg) scaleY(-1);
    position: relative;
    top: 11px;
  }
</style>
