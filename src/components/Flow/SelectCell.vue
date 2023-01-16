<template>
  <!-- <editable-cell :text="text" @change="onCellChange(record.key, 'machine', $event)">
    <template slot-scope="scope">
      <a-select :value="scope.value" @change="handleChange">
        <a-select-option :key="index" v-for="(option, index) in options" :value="option.value">
          {{ option.text }}
        </a-select-option>
        <a-select-option value="2号测试机(93000)">2号测试机(93000)</a-select-option>
        <a-select-option value="5号测试机(750)">5号测试机(750)</a-select-option>
        <a-select-option value="6号测试机(Ultra Flex)">6号测试机(Ultra Flex)</a-select-option>
      </a-select>
    </template>
  </editable-cell> -->
  <div class="editable-cell">
    <div v-if="editable" class="editable-cell-input-wrapper">
      <a-select :value="cellValue" @change="handleChange">
        <!-- <a-select-option :key="index" v-for="(option, index) in options" :value="option.value">
          {{ option.text }}
        </a-select-option> -->
        <a-select-option value="2号测试机(93000)">2号测试机(93000)</a-select-option>
        <a-select-option value="5号测试机(750)">5号测试机(750)</a-select-option>
        <a-select-option value="6号测试机(Ultra Flex)">6号测试机(Ultra Flex)</a-select-option>
      </a-select>
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
  name: 'SelectCell',
  props: {
    text: {
      type: String,
      default: ''
    },
    options: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      cellValue: this.text,
      prev: null,
      editable: false
    }
  },
  watch: {
    cellValue: (n, o) => {
      console.log(o)
      console.log(n)
    },
    text: (n, o) => {
      console.log(o)
      console.log(n)
    },
    editable: (n, o) => {
      console.log(o)
      console.log(n)
    }
  },
  methods: {
    handleChange (e) {
      console.log('input')
      console.log(e)
      this.prev = this.cellValue
      this.cellValue = e
    },
    check () {
      console.log({ 'check': { 'cellValue': this.cellValue, 'text': this.text } })
      console.log(this)
      this.editable = false
      this.$emit('change', this.cellValue)
    },
    close () {
      this.cellValue = this.prev
      this.editable = false
    },
    edit () {
      console.log('edit', this.text, this.cellValue)
      console.log(this)
      this.editable = true
    }
  }
}
</script>
