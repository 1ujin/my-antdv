<template>
  <div>
    <div class="toolbox">
      <a-button @click="switchShow"><a-icon :type="this.mode === 'device' ? `user` : `desktop`" />切换为{{ this.mode === 'device' ? `人员` : `设备` }}</a-button>
      <a-button><a-icon type="qrcode" />二维码分享</a-button>
      <!-- <button @click="updateFirstRow">Update first row</button>
      <button @click="changeZoomLevel">Change zoom level</button> -->
    </div>
    <div class="gstc-wrapper" ref="gstc"></div>
  </div>
</template>

<script>
import GSTC from 'gantt-schedule-timeline-calendar'
import { Plugin as TimelinePointer } from 'gantt-schedule-timeline-calendar/dist/plugins/timeline-pointer.esm.min.js'
import { Plugin as Selection } from 'gantt-schedule-timeline-calendar/dist/plugins/selection.esm.min.js'
import { Plugin as ItemResizing } from 'gantt-schedule-timeline-calendar/dist/plugins/item-resizing.esm.min.js'
import { Plugin as ItemMovement } from 'gantt-schedule-timeline-calendar/dist/plugins/item-movement.esm.min.js'
import { Plugin as Bookmarks } from 'gantt-schedule-timeline-calendar/dist/plugins/time-bookmarks.esm.min.js'
import 'gantt-schedule-timeline-calendar/dist/style.css'

let gstc, state
// helper functions
function generateRows (type, len) {
  /**
   * @type { import("gantt-schedule-timeline-calendar").Rows }
   */
  const rows = {}
  for (let i = 0; i < len; i++) {
    const id = GSTC.api.GSTCID(i.toString())
    rows[id] = {
      id,
      label: `${i + 1} 号${type}`
    }
  }
  return rows
}
function generateItems (type, len, rand) {
  /**
   * @type { import("gantt-schedule-timeline-calendar").Items }
   */
  const items = {}
  let start = GSTC.api.date().startOf('day').subtract(6, 'day')
  for (let i = 0; i < len; i++) {
    const id = GSTC.api.GSTCID(i.toString())
    const rowId = GSTC.api.GSTCID(Math.floor(Math.random() * rand).toString())
    start = start.add(1, 'day')
    items[id] = {
      id,
      label: `${i + 1} 号${type}`,
      rowId,
      time: {
        start: start.valueOf(),
        end: start.add(1, 'day').endOf('day').valueOf()
      }
    }
  }
  return items
}

export default {
  name: 'Gantt1',
  config: {},
  data () {
    return {
      mode: 'device'
    }
  },
  mounted () {
    /**
     * @type { import("gantt-schedule-timeline-calendar").Config }
     */
    this.config = {
      licenseKey:
        '123',
      plugins: [TimelinePointer(), Selection(), ItemResizing(), ItemMovement(), Bookmarks()],
      list: {
        columns: {
          data: {
            [GSTC.api.GSTCID('id')]: {
              id: GSTC.api.GSTCID('id'),
              width: 60,
              data: ({ row }) => GSTC.api.sourceID(row.id),
              header: {
                content: 'ID'
              },
              hidden: true
            },
            [GSTC.api.GSTCID('label')]: {
              id: GSTC.api.GSTCID('label'),
              width: 200,
              data: 'label',
              header: {
                content: this.mode === 'device' ? '机台' : '人员'
              }
            }
          }
        },
        rows: generateRows(this.mode === 'device' ? `机台` : `测试人员`, this.mode === 'device' ? 7 : 10)
      },
      chart: {
        items: generateItems(this.mode === 'device' ? `测试人员` : `机台`, this.mode === 'device' ? 10 : 7, this.mode === 'device' ? 7 : 10)
      }
    }
    state = GSTC.api.stateFromConfig(this.config)
    gstc = GSTC({
      element: this.$refs.gstc,
      state
    })
  },
  beforeUnmount () {
    if (gstc) gstc.destroy()
  },
  methods: {
    updateFirstRow () {
      state.update(`config.list.rows.${GSTC.api.GSTCID('0')}`, (row) => {
        row.label = 'Changed dynamically'
        return row
      })
    },
    changeZoomLevel () {
      state.update('config.chart.time.zoom', 21)
    },
    switchShow () {
      if (this.mode === 'device') {
        this.mode = 'staff'
        state.update(`config.list.rows`, () => {
        return generateRows(this.mode === 'device' ? `机台` : `测试人员`, this.mode === 'device' ? 7 : 10)
        })
        state.update(`config.chart.items`, () => {
          return generateItems(this.mode === 'device' ? `测试人员` : `机台`, this.mode === 'device' ? 10 : 7, this.mode === 'device' ? 7 : 10)
        })
      } else if (this.mode === 'staff') {
        this.mode = 'device'
        state.update(`config.chart.items`, () => {
          return generateItems(this.mode === 'device' ? `测试人员` : `机台`, this.mode === 'device' ? 10 : 7, this.mode === 'device' ? 7 : 10)
        })
        state.update(`config.list.rows`, () => {
          return generateRows(this.mode === 'device' ? `机台` : `测试人员`, this.mode === 'device' ? 7 : 10)
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import '~ant-design-vue/es/style/themes/default.less';

.gstc-component {
  margin: 0;
  padding: 0;
}
.toolbox {
  position: fixed;
  top: ~'calc(@{layout-header-height} + @{page-header-padding-breadcrumb} + 21px)';
  right: 0;
  padding: 0;
  z-index: 1;
}
.ant-btn {
  margin: 8px 1vh;
}
</style>
