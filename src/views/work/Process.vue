<template>
  <page-header-wrapper>
    <a-list v-show="!showFlow" item-layout="horizontal" :data-source="data" @click="switchShow">
      <a-list-item slot="renderItem" slot-scope="item, index">
        <a-list-item-meta
          :description="`流程${ index }: 芯片A018${ index }`"
        >
        </a-list-item-meta>
        <a-steps :current="index + 1">
          <template #progressDot="{ index, status, prefixCls }">
            <a-popover>
              <template #content>
                <span>step {{ index }} status: {{ status }}</span>
              </template>
              <span :class="`${prefixCls}-icon-dot`" />
            </a-popover>
          </template>
          <a-step title="入库" />
          <a-step title="老炼前25℃" description="You can hover on the dot." />
          <a-step title="老炼后25℃" description="You can hover on the dot." />
          <a-step title="老炼后125℃" description="You can hover on the dot." />
          <a-step v-if="index % 2 === 0" title="老炼后-55℃" description="You can hover on the dot." />
          <a-step title="出库" />
        </a-steps>
      </a-list-item>
    </a-list>
    <flow v-show="showFlow"></flow>
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
  },
  data () {
    return {
      showFlow: false,
      data: [
        {
          title: 'Ant Design Title 1'
        },
        {
          title: 'Ant Design Title 2'
        },
        {
          title: 'Ant Design Title 3'
        },
        {
          title: 'Ant Design Title 4'
        }
      ]
    }
  },
  mounted () {
    // document.addEventListener('click', this.switchShow)
  },
  methods: {
    switchShow () {
      this.showFlow = !this.showFlow
    }
  }
}
</script>
