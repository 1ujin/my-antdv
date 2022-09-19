<template>
  <page-header-wrapper>
    <flow></flow>
  </page-header-wrapper>
</template>

<script>
import Flow from '@/components/Flow'
import { PageHeaderWrapper } from '@ant-design-vue/pro-layout'

export default {
  name: 'Process',
  components: {
    Flow,
    PageHeaderWrapper
  }
}
</script>
