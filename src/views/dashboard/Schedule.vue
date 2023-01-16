<template>
  <page-header-wrapper>
    <gantt1 />
  </page-header-wrapper>
</template>

<script>
import { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
import Gantt1 from '@/components/Charts/Gantt1'

export default {
  name: 'Schedule',
  components: {
    PageHeaderWrapper,
    Gantt1
  }
}
</script>
