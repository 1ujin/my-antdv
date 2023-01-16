<template>
  <div class="editable-cell">
    <div v-if="editable" class="editable-cell-input-wrapper">
      <slot :cellValue="cellValue" :onChange="onChange" />
      <a-icon type="check" class="editable-cell-icon-check" @click="check" />
      <a-icon type="close" class="editable-cell-icon-check" @click="close" />
    </div>
    <div v-else class="editable-cell-text-wrapper">
      {{ cellValue || ' ' }}
      <a-icon type="edit" class="editable-cell-icon" @click="edit" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditableCell',
  props: {
    text: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      cellValue: this.text,
      editable: false
    }
  },
  watch: {
    cellValue: (n, o) => {
      console.log('cellValue', o, '->', n)
    },
    text: (n, o) => {
      console.log('text', o, '->', n)
    },
    editable: (n, o) => {
      console.log('editable', o, '->', n)
    }
  },
  methods: {
    onChange (e) {
      console.log('input', e)
      this.cellValue = e
    },
    check () {
      console.log('check', this.cellValue, this.text)
      // this.text = this.cellValue
      this.editable = false
      this.$emit('cell-change', this.cellValue)
    },
    close () {
      this.editable = false
      this.cellValue = this.prev
    },
    edit () {
      console.log('edit', this.text, this.cellValue)
      this.prev = this.cellValue
      this.editable = true
      // this.cellValue = this.text
    }
  },
  beforeCreate () {
    console.log('beforeCreate', this.text)
  },
  created () {
    console.log('created', this.text)
  },
  beforeMount () {
    console.log('beforeMount', this.text)
  },
  mounted () {
    console.log('mounted', this.text)
  },
  beforeUpdate () {
    console.log('beforeUpdate', this.text)
  },
  updated () {
    console.log('updated', this.text)
  },
  beforeDestroy () {
    console.log('beforeDestroy', this.text)
  },
  destroyed () {
    console.log('destroyed', this.text)
  }
}
</script>
