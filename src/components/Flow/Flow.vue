<template>
  <div>
    <div class="super-flow-demo">
      <div class="node-container">
        <span :class="`node-item node-item-${item.prop}`" v-for="(item, index) in nodeItemList" :key="index" @mousedown="(evt) => nodeItemMouseDown(evt, item.value)">
          {{ item.label }}
        </span>
        <a-button class="node-item" @click="showModal">
          <a-icon type="plus-circle" />
        </a-button>
      </div>
      <div class="flow-container" ref="flowContainer">
        <super-flow
          ref="superFlow"
          :graph-menu="graphMenu"
          :node-menu="nodeMenu"
          :link-menu="linkMenu"
          :link-base-style="linkBaseStyle"
          :link-style="linkStyle"
          :link-desc="linkDesc"
        >
          <template v-slot:node="{ meta }">
            <div @mouseup="nodeMouseUp" @click="nodeClick" :class="`flow-node flow-node-${meta.prop}`">
              <header class="ellipsis">
                {{ meta.name }}
              </header>
              <section>
                {{ meta.desc }}
              </section>
            </div>
          </template>
        </super-flow>
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

    <a-modal v-model="visible" title="新增测试节点类型" @ok="handleOk">
      <a-form
        layout="vertical"
        name="basic"
        @keyup.native.enter="settingSubmit"
        @submit.native.prevent
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
        <a-form-item label="测试节点温度">
          <a-input-group compact>
            <a-radio-group>
              <a-radio-button value="老炼前">老炼前</a-radio-button>
              <a-radio-button value="老炼后">老炼后</a-radio-button>
            </a-radio-group>
            <a-input-number
              addon-before="￥"
              addon-after="℃"
              style="width: calc(100% - 180px)">
            </a-input-number>
            <span class="ant-input-group-addon" style="float: right;">℃</span>
          </a-input-group>
        </a-form-item>
        <a-form-item label="测试节点描述" name="desc">
          <a-textarea
            placeholder="请输入测试节点描述"
            v-model="nodeSetting.desc"
            allow-clear
            show-count="true"
            :max-length="300"
            :autosize="{ minRows: 5, maxRows: 10}"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
// import { Button, Dialog, Form, FormItem, Input } from 'element-ui'
import { ref } from 'vue'
import SuperFlow from 'vue-super-flow'
// import 'element-ui/lib/theme-chalk/index.css'
import 'vue-super-flow/lib/index.css'

const drawerType = {
  node: 0,
  link: 1
}

export default {
  name: 'Flow',
  components: {
    SuperFlow
    // 'el-button': Button,
    // 'el-dialog': Dialog,
    // 'el-form': Form,
    // 'el-form-item': FormItem,
    // 'el-input': Input,
  },
  setup () {
    const visible = ref(false)

    const showModal = () => {
      visible.value = true
    }

    const handleOk = e => {
      console.log(e)
      visible.value = false
    }

    return {
      visible,
      showModal,
      handleOk
    }
  },
  data () {
    return {
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
            if (this.$refs.nodeSetting) {
              this.$refs.nodeSetting.resetFields()
            }
            this.$set(this.nodeSetting, 'name', info.meta.name)
            this.$set(this.nodeSetting, 'desc', info.meta.desc)
            this.$set(this.nodeSetting, 'prop', info.meta.prop)
          } else {
            conf.title = '连线'
            if (this.$refs.linkSetting) {
              this.$refs.linkSetting.resetFields()
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
      linkSetting: {
        desc: ''
      },
      nodeSetting: {
        name: '',
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
              desc: '入库',
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
            height: 80,
            meta: {
              label: '3',
              name: '老炼前25℃',
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
            height: 80,
            meta: {
              label: '4',
              name: '老炼后25℃',
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
                  desc: '',
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
    document.addEventListener('mousemove', this.docMousemove)
    document.addEventListener('mouseup', this.docMouseup)
    this.$once('hook:beforeDestroy', () => {
      document.removeEventListener('mousemove', this.docMousemove)
      document.removeEventListener('mouseup', this.docMouseup)
    })
  },
  methods: {
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
      if (this.drawerConf.type === drawerType.node) {
        if (!conf.info.meta) conf.info.meta = {}
        Object.keys(this.nodeSetting).forEach(key => {
          this.$set(conf.info.meta, key, this.nodeSetting[key])
        })
        this.$refs.nodeSetting.resetFields()
      } else {
        if (!conf.info.meta) conf.info.meta = {}
        Object.keys(this.linkSetting).forEach(key => {
          this.$set(conf.info.meta, key, this.linkSetting[key])
        })
        this.$refs.linkSetting.resetFields()
      }
      conf.visible = false
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
      console.log('docMouseup')
      if (conf.isMove) {
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
          console.log(conf.info)
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
    addNodeItem () {
      if (this.nodeItemList.length === 4) {
        this.nodeItemList.push(
          {
            label: '老炼后125℃',
            prop: 'action',
            value: () => ({
              width: 160,
              height: 80,
              meta: {
                label: '5',
                name: '老炼后125℃',
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
              height: 80,
              meta: {
                label: '6',
                name: '老炼后-55℃',
                desc: '老炼后-55℃',
                prop: 'action'
              }
            })
          }
        )
      }
    }
  }
}
</script>

<style lang="less" scoped>

</style>
