<template>
  <div>
    <div class="super-flow-demo">
      <div class="node-container">
        <span :class="`node-item node-item-${item.prop}`" v-for="(item, index) in nodeItemList" :key="index" @mousedown="(evt) => nodeItemMouseDown(evt, item.value)">
          {{ item.label }}
        </span>
        <a-button class="node-item" @click="showNodeItemModal">
          <a-icon type="plus-circle" />
        </a-button>
      </div>
      <div
        class="flow-container"
        ref="flowContainer"
        @mousewheel="superFlowMouseWheel($event)"
        @DOMMouseScroll="superFlowMouseWheel($event)"
      >
        <super-flow
          ref="superFlow"
          :graph-menu="graphMenu"
          :node-menu="nodeMenu"
          :link-menu="linkMenu"
          :link-base-style="linkBaseStyle"
          :link-style="linkStyle"
          :link-desc="linkDesc"
          :style="{ transform: `scale(${this.scaleNumber})` }"
        >
          <template v-slot:node="{ meta }">
            <div @mouseup="nodeMouseUp" @click="nodeClick" :class="`flow-node flow-node-${meta.prop}`">
              <header class="ellipsis">
                {{ meta.name }}
              </header>
              <section :style="{display: meta.prop === 'action' ? 'block' : 'none'}">
                {{ meta.aging == '0' ? '老炼前' : '老炼后' }} {{ meta.temperature }}℃
              </section>
              <section>
                {{ meta.desc }}
              </section>
            </div>
          </template>
        </super-flow>
        <div style="z-index: 1;position: absolute;left: 1%;bottom: 4%">
          <a-button @click="scaleNumber += 0.1">
            <a-icon type="zoom-in" />
          </a-button>
          <a-button @click="scaleNumber -= 0.1">
            <a-icon type="zoom-out" />
          </a-button>
        </div>
      </div>
    </div>

    <!-- <el-dialog :title="drawerConf.title" :visible.sync="drawerConf.visible" :close-on-click-modal="false" width="500px">
      <el-form
        @keyup.native.enter="settingSubmit"
        @submit.native.prevent
        v-show="drawerConf.type === drawerType.node"
        ref="nodeSetting"
        :model="nodeSetting"
      >
        <el-form-item label="节点名称" prop="name">
          <el-input v-model="nodeSetting.name" placeholder="请输入节点名称" maxlength="30"> </el-input>
        </el-form-item>
        <el-form-item label="节点描述" prop="desc">
          <el-input v-model="nodeSetting.desc" placeholder="请输入节点描述" maxlength="30"> </el-input>
        </el-form-item>
      </el-form>
      <el-form
        @keyup.native.enter="settingSubmit"
        @submit.native.prevent
        v-show="drawerConf.type === drawerType.link"
        ref="linkSetting"
        :model="linkSetting"
      >
        <el-form-item label="连线描述" prop="desc">
          <el-input v-model="linkSetting.desc" placeholder="请输入连线描述"> </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="drawerConf.cancel"> 取 消 </el-button>
        <el-button type="primary" @click="settingSubmit"> 确 定 </el-button>
      </span>
    </el-dialog> -->

    <a-modal v-model="nodeItemModalvisible" title="新增测试节点类型" @ok="addNodeItem">
      <a-form
        layout="horizontal"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 19 }"
        @submit="addNodeItem"
        v-show="true"
        ref="nodeSetting"
        :model="nodeSetting"
      >
        <a-form-item
          label="测试节点名称"
          name="name"
          :rules="[{ required: true, message: '必须输入测试节点名称!' }]">
          <a-input v-model="nodeSetting.name" placeholder="请输入测试节点名称" allow-clear show-count="true" :max-length="30" />
        </a-form-item>
        <a-form-item label="老化测试温度" name="aging-temperature">
          <a-input-group compact>
            <a-radio-group v-model="nodeSetting.aging">
              <a-radio-button value="0">老炼前</a-radio-button>
              <a-radio-button value="1">老炼后</a-radio-button>
            </a-radio-group>
            <a-input-number
              v-model="nodeSetting.temperature"
              :formatter="value => `${value}℃`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :max="200"
              :min="-200">
            </a-input-number>
          </a-input-group>
        </a-form-item>
        <a-form-item label="测试节点描述" name="desc">
          <a-textarea
            placeholder="请输入测试节点描述"
            v-model="nodeSetting.desc"
            allow-clear
            show-count="true"
            :max-length="300"
            :autoSize="{ minRows: 5, maxRows: 10}"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal v-model="drawerConf.visible" :title="drawerConf.title" @ok="settingSubmit">
      <a-form
        layout="horizontal"
        labelAlign="left"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 19 }"
        @submit="settingSubmit"
        v-show="drawerConf.type === drawerType.node"
        ref="nodeSetting"
        :model="nodeSetting"
      >
        <a-form-item
          label="测试节点名称"
          name="name"
          :rules="[{ required: true, message: '必须输入测试节点名称!' }]">
          <a-input v-model="nodeSetting.name" placeholder="请输入测试节点名称" allow-clear show-count="true" :max-length="20" />
        </a-form-item>
        <a-form-item label="老化测试温度" name="aging-temperature">
          <a-input-group compact>
            <a-radio-group v-model="nodeSetting.aging">
              <a-radio-button value="0">老炼前</a-radio-button>
              <a-radio-button value="1">老炼后</a-radio-button>
            </a-radio-group>
            <a-input-number
              v-model="nodeSetting.temperature"
              :formatter="value => `${value}℃`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :max="200"
              :min="-200">
            </a-input-number>
          </a-input-group>
        </a-form-item>
        <a-form-item label="测试节点描述" name="desc">
          <a-textarea
            placeholder="请输入测试节点描述"
            v-model="nodeSetting.desc"
            allow-clear
            show-count="true"
            :max-length="300"
            :autoSize="{ minRows: 5, maxRows: 10}"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal v-model="dispatchConf.visible" :title="dispatchConf.title" @ok="dispatchSubmit" :width="dispatchConf.width">
      <a-form>
        <a-form-item label="测试人员和机台配置" name="list" :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }">
          <a-table bordered :data-source="dataSource" :columns="columns">

            <!-- 人员 -->
            <template v-slot:name="text, record">
              <editable-cell :text="text" @cell-change="onCellChange(record.key, 'name', $event)">
                <template v-slot="{ cellValue, onChange }">
                  <a-select :value="cellValue" @change="onChange">
                    <a-select-option value="张三">张三</a-select-option>
                    <a-select-option value="李四">李四</a-select-option>
                    <a-select-option value="王五">王五</a-select-option>
                  </a-select>
                </template>
              </editable-cell>
            </template>

            <!-- 机台 -->
            <template v-slot:machine="text, record">
              <editable-cell :text="text" @change="onCellChange(record.key, 'machine', $event)">
                <template v-slot="{ cellValue, onChange }">
                  <a-select :value="cellValue" @change="onChange">
                    <a-select-option value="2号测试机(93000)">2号测试机(93000)</a-select-option>
                    <a-select-option value="5号测试机(750)">5号测试机(750)</a-select-option>
                    <a-select-option value="6号测试机(Ultra Flex)">6号测试机(Ultra Flex)</a-select-option>
                  </a-select>
                </template>
              </editable-cell>
            </template>

            <!-- 操作 -->
            <template v-slot:operation="text, record">
              <a-popconfirm
                v-if="dataSource.length"
                title="Sure to delete?"
                @confirm="() => onDelete(record.key)"
              >
                <a-button type="danger"><a-icon type="delete" />删除配置</a-button>
              </a-popconfirm>
            </template>

            <!-- 上传 -->
            <template v-slot:expandedRowRender>
              <a-upload>
                <a-button><a-icon type="select" />选择上传表格</a-button>
              </a-upload>
              <a-button type="primary" :disabled="false" style="margin-top: 10px">
                <template v-if="false">
                  <a-icon type="loading" />
                </template>
                <template v-else>
                  <a-icon type="check" />
                </template>
                读取芯片编号
              </a-button>
            </template>

          </a-table>
          <div style="height: 0px">
            <a-button class="editable-add-btn" @click="handleAdd" style="transform: translateY(-52px)">Add</a-button>
          </div>
          <div class="demo-image__preview">
            <el-image style="left: 50%; transform: translateX(-50%); width: 30%" :src="require('..//..//assets//devicemap.jpg')" :preview-src-list="[ require('..//..//assets//devicemap.jpg') ]" />
          </div>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
// import { Button, Dialog, Form, FormItem, Input } from 'element-ui'
import EditableCell from '@/components/Flow/EditableCell'
import SuperFlow from 'vue-super-flow'
import { Image } from 'element-ui'
import { ref } from 'vue'
// import { cloneDeep } from 'lodash-es'
import 'vue-super-flow/lib/index.css'
import 'element-ui/lib/theme-chalk/index.css'

const drawerType = {
  node: 0,
  link: 1
}

export default {
  name: 'Flow',
  components: {
    // 'el-button': Button,
    // 'el-dialog': Dialog,
    // 'el-form': Form,
    // 'el-form-item': FormItem,
    // 'el-input': Input,
    'el-image': Image,
    'editable-cell': EditableCell,
    SuperFlow
  },
  setup () {
    const nodeItemModalvisible = ref(false)
    const flowNodeModalVisible = ref(false)

    const showNodeItemModal = () => {
      nodeItemModalvisible.value = true
    }

    const showFlowNodeModal = () => {
      flowNodeModalVisible.value = true
    }

    const nodeItemModalHandleOk = e => {
      console.log(e)
      nodeItemModalvisible.value = false
    }

    const flowNodeModalHandleOk = e => {
      console.log(e)
      flowNodeModalVisible.value = false
    }

    return {
      nodeItemModalvisible,
      showNodeItemModal,
      nodeItemModalHandleOk,
      flowNodeModalVisible,
      showFlowNodeModal,
      flowNodeModalHandleOk
    }
  },

  data () {
    return {
      scaleNumber: 1.0,
      dataSource: [
        {
          key: '0',
          name: '张三',
          chip: '32',
          machine: '2号测试机(93000)',
          chipIdFiles: []
        },
        {
          key: '1',
          name: '李四',
          chip: '32',
          machine: '6号测试机(Ultra Flex)',
          chipIdFiles: []
        }
      ],
      count: 2,
      columns: [
        {
          title: '人员',
          dataIndex: 'name',
          width: '25%',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '机台',
          dataIndex: 'machine',
          width: '25%',
          scopedSlots: { customRender: 'machine' }
        },
        {
          title: '数量',
          dataIndex: 'chip',
          width: '25%'
        },
        {
          title: '操作',
          dataIndex: 'operation',
          width: '25%',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      drawerType,
      drawerConf: {
        title: '',
        visible: false,
        type: null,
        info: null,
        open: (type, info) => {
          const conf = this.drawerConf
          conf.visible = true
          conf.type = type
          conf.info = info
          if (conf.type === drawerType.node) {
            conf.title = '节点'
            console.log(this.$refs.nodeSetting)
            if (this.$refs.nodeSetting) {
              // this.$refs.nodeSetting.resetFields()
            }
            console.log(this.$refs.nodeSetting)
            Object.keys(info.meta).forEach(key => {
              this.$set(this.nodeSetting, key, info.meta[key])
            })
            if (this.nodeSetting.name !== undefined && this.nodeSetting.name !== '') {
              this.drawerConf.title = '编辑【' + this.nodeSetting.name + '】节点详情'
            } else {
              this.drawerConf.title = '编辑节点详情'
            }
            console.log(this.nodeSetting)
            // this.$set(this.nodeSetting, 'name', info.meta.name)
            // this.$set(this.nodeSetting, 'desc', info.meta.desc)
            // this.$set(this.nodeSetting, 'prop', info.meta.prop)
          } else {
            conf.title = '连线'
            if (this.$refs.linkSetting) {
              // this.$refs.linkSetting.resetFields()
            }
            this.$set(this.linkSetting, 'desc', info.meta ? info.meta.desc : '')
          }
        },
        cancel: () => {
          this.drawerConf.visible = false
          if (this.drawerConf.type === drawerType.node) {
            this.$refs.nodeSetting.clearValidate()
          } else {
            this.$refs.linkSetting.clearValidate()
          }
        }
      },
      dispatchConf: {
        title: '',
        visible: false,
        width: '70%',
        open: info => {
          const conf = this.dispatchConf
          conf.visible = true
          conf.info = info
        },
        cancel: () => {
          this.dispatchConf.visible = false
        }
      },
      linkSetting: {
        desc: ''
      },
      nodeSetting: {
        name: '',
        aging: '',
        temperature: '',
        desc: '',
        prop: ''
      },
      dragConf: {
        isDown: false,
        isMove: false,
        offsetTop: 0,
        offsetLeft: 0,
        clientX: 0,
        clientY: 0,
        ele: null,
        info: null
      },
      nodeItemList: [
      {
          label: '入库',
          prop: 'start',
          value: () => ({
            width: 160,
            height: 80,
            meta: {
              label: '1',
              name: '入库',
              desc: 'K4010 001~299',
              prop: 'start'
            }
          })
        },
        {
          label: '出库',
          prop: 'end',
          value: () => ({
            width: 120,
            height: 40,
            meta: {
              label: '2',
              name: '出库',
              prop: 'end'
            }
          })
        },
        {
          label: '老炼前25℃',
          prop: 'action',
          value: () => ({
            width: 160,
            height: 100,
            meta: {
              label: '3',
              name: '老炼前25℃',
              temperature: '25',
              desc: '老炼前25℃',
              prop: 'action'
            }
          })
        },
        {
          label: '老炼后25℃',
          prop: 'action',
          value: () => ({
            width: 160,
            height: 100,
            meta: {
              label: '4',
              name: '老炼后25℃',
              temperature: '25',
              desc: '老炼后25℃',
              prop: 'action'
            }
          })
        }
      ],

      buttonList: [
        {
          name: 'addItem'
        }
      ],

      graphMenu: [
        [
          {
            // 选项 label
            label: '老炼前25℃',
            // 选项是否禁用
            // disable (graph) {
            //   return !!graph.nodeList.find(node => node.meta.label === '1')
            // },
            // 选项选中后回调函数
            selected (graph, coordinate) {
              graph.addNode({
                width: 160,
                height: 80,
                coordinate,
                meta: {
                  label: '1',
                  name: '老炼前25℃',
                  desc: '',
                  prop: 'action'
                }
              })
            }
          },
          {
            label: '老炼后25℃',
            selected (graph, coordinate) {
              graph.addNode({
                width: 160,
                height: 80,
                coordinate,
                meta: {
                  label: '2',
                  name: '老炼后25℃',
                  desc: '',
                  prop: 'action'
                }
              })
            }
          },
          {
            label: '入库',
            selected (graph, coordinate) {
              graph.addNode({
                width: 160,
                height: 80,
                coordinate,
                meta: {
                  label: '3',
                  name: '入库',
                  desc: 'K4010 001~299',
                  prop: 'start'
                }
              })
            }
          }
        ],
        [
          {
            label: '出库',
            selected (graph, coordinate) {
              graph.addNode({
                width: 120,
                height: 60,
                coordinate,
                meta: {
                  label: '4',
                  name: '出库',
                  prop: 'end'
                }
              })
            }
          }
        ],
        [
          {
            label: '打印数据',
            selected: (graph, coordinate) => {
              console.log(JSON.stringify(graph.toJSON(), null, 2))
            }
          },
          {
            label: '全选',
            selected: graph => {
              graph.selectAll()
            }
          }
        ]
      ],
      nodeMenu: [
        [
          {
            label: '编辑',
            selected: node => {
              this.drawerConf.open(drawerType.node, node)
            }
          },
          {
            label: '派工',
            selected: node => {
              this.dispatchConf.open(node)
            }
          },
          {
            label: '删除',
            selected: node => {
              node.remove()
            }
          }
        ]
      ],
      linkMenu: [
        [
          {
            label: '编辑',
            selected: link => {
              this.drawerConf.open(drawerType.link, link)
            }
          },
          {
            label: '删除',
            selected: link => {
              link.remove()
            }
          }
        ]
      ],

      linkBaseStyle: {
        color: '#666666', // line 颜色
        hover: '#FF0000', // line hover 的颜色
        textColor: '#666666', // line 描述文字颜色
        textHover: '#FF0000', // line 描述文字 hover 颜色
        font: '14px Arial', // line 描述文字 字体设置 参考 canvas font
        dotted: false, // 是否是虚线
        lineDash: [4, 4], // 虚线时生效
        background: 'rgba(255,255,255,0.6)' // 描述文字背景色
      },
      fontList: [
        '14px Arial',
        'italic small-caps bold 12px arial'
      ]
    }
  },
  mounted () {
    console.log('mounted')
    document.addEventListener('mousemove', this.docMousemove)
    document.addEventListener('mouseup', this.docMouseup)
    this.$once('hook:beforeDestroy', () => {
      document.removeEventListener('mousemove', this.docMousemove)
      document.removeEventListener('mouseup', this.docMouseup)
    })
  },
  methods: {
    onCellChange (key, dataIndex, value) {
      console.log('onCellChange', key, dataIndex, value)
      const dataSource = [...this.dataSource]
      const target = dataSource.find(item => item.key === key)
      if (target) {
        target[dataIndex] = value
        this.dataSource = dataSource
      }
    },
    onDelete (key) {
      const dataSource = [...this.dataSource]
      this.dataSource = dataSource.filter(item => item.key !== key)
    },
    handleAdd () {
      const { count, dataSource } = this
      const newData = {
        key: count,
        name: '王五',
        chip: 32,
        machine: '5号测试机(750)'
      }
      this.dataSource = [...dataSource, newData]
      this.count = count + 1
    },
    flowNodeClick (meta) {
      console.log(this.$refs.superFlow.graph)
    },
    linkStyle (link) {
      if (link.meta && link.meta.desc === '1') {
        return {
          color: 'red',
          hover: '#FF00FF',
          dotted: true
        }
      } else {
        return {}
      }
    },
    linkDesc (link) {
      return link.meta ? link.meta.desc : ''
    },
    settingSubmit () {
      const conf = this.drawerConf
      console.log('settingSubmit')
      console.log(this)
      if (this.drawerConf.type === drawerType.node) {
        if (!conf.info.meta) conf.info.meta = {}
        Object.keys(this.nodeSetting).forEach(key => {
          this.$set(conf.info.meta, key, this.nodeSetting[key])
        })
        // this.$refs.nodeSetting.resetFields()
      } else {
        if (!conf.info.meta) conf.info.meta = {}
        Object.keys(this.linkSetting).forEach(key => {
          this.$set(conf.info.meta, key, this.linkSetting[key])
        })
        this.$refs.linkSetting.resetFields()
      }
      conf.visible = false
      console.log(this.nodeSetting)
    },
    dispatchSubmit () {
      this.dispatchConf.visible = false
    },
    nodeMouseUp (evt) {
      console.log('nodeMouseUp')
      evt.preventDefault()
    },
    nodeClick () {
      console.log(arguments)
    },
    docMousemove ({ clientX, clientY }) {
      const conf = this.dragConf

      if (conf.isMove) {
        // 元素的左上角位置
        conf.ele.style.top = clientY - conf.offsetTop + 'px'
        conf.ele.style.left = clientX - conf.offsetLeft + 'px'
      } else if (conf.isDown) {
        // 鼠标移动量大于 5 时 移动状态生效
        conf.isMove =
            Math.abs(clientX - conf.clientX) > 5 ||
            Math.abs(clientY - conf.clientY) > 5
      }
    },
    docMouseup ({ clientX, clientY }) {
      const conf = this.dragConf
      conf.isDown = false
      if (conf.isMove) {
        // flow container 的边界
        const {
          top,
          right,
          bottom,
          left
        } = this.$refs.flowContainer.getBoundingClientRect()

        // 判断鼠标是否进入 flow container
        if (
            clientX > left &&
            clientX < right &&
            clientY > top &&
            clientY < bottom
        ) {
          // 获取拖动元素左上角相对 super flow 区域原点坐标
          const coordinate = this.$refs.superFlow.getMouseCoordinate(
              clientX - conf.offsetLeft,
              clientY - conf.offsetTop
          )
          // 添加节点
          this.$refs.superFlow.addNode({
            coordinate,
            ...conf.info
          })
        }

        conf.isMove = false
      }

      if (conf.ele) {
        conf.ele.remove()
        conf.ele = null
      }
    },
    nodeItemMouseDown (evt, infoFun) {
      console.log(evt)

      const {
        clientX,
        clientY,
        currentTarget
      } = evt

      const {
        top,
        left
      } = evt.currentTarget.getBoundingClientRect()

      const conf = this.dragConf
      const ele = currentTarget.cloneNode(true)

      Object.assign(this.dragConf, {
        offsetLeft: clientX - left,
        offsetTop: clientY - top,
        clientX: clientX,
        clientY: clientY,
        info: infoFun(),
        ele,
        isDown: true
      })

      ele.style.position = 'fixed'
      ele.style.margin = '0'
      ele.style.top = clientY - conf.offsetTop + 'px'
      ele.style.left = clientX - conf.offsetLeft + 'px'

      this.$el.appendChild(this.dragConf.ele)
    },
    superFlowMouseWheel (evt) {
      if (evt.ctrlKey === true || evt.metaKey) {
        evt.preventDefault()
        if (evt.wheelDelta > 0) {
          this.scaleNumber += 0.1
        } else if (evt.wheelDelta < 0) {
          this.scaleNumber -= 0.1
        }
      }
    },
    addNodeItem () {
      console.log('addNodeItem')
      if (this.nodeItemList.length === 4) {
        this.nodeItemList.push(
          {
            label: '老炼后125℃',
            prop: 'action',
            value: () => ({
              width: 160,
              height: 100,
              meta: {
                label: '5',
                name: '老炼后125℃',
                temperature: '125',
                desc: '老炼后125℃',
                prop: 'action'
              }
            })
          }
        )
      } else if (this.nodeItemList.length === 5) {
        this.nodeItemList.push(
          {
            label: '老炼后-55℃',
            prop: 'action',
            value: () => ({
              width: 160,
              height: 100,
              meta: {
                label: '6',
                name: '老炼后-55℃',
                temperature: '-55',
                desc: '老炼后-55℃',
                prop: 'action'
              }
            })
          }
        )
      }
      this.nodeItemModalvisible = false
    }
  }
}
</script>

<style lang="less" scoped>

</style>
