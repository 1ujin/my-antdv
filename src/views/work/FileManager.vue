<template>
  <page-header-wrapper>
    <wl-explorer
      ref="wl-explorer-cpt"
      :headerDropdown="headerHandle"
      :columns="file_table_columns"
      :all-path="all_folder_list"
      :is-folder-fn="isFolderFn"
      :folderType="rource_type"
      :data="file_table_data"
      :props="explorer_prop"
      size="small"
      @handleFolder="handleFolder"
      @search="fileSearch"
      @del="fileDel"
    >
      <!-- 操作文件夹滑入区 -->
      <wl-fadein :show="fade.folder">
        <span slot="header">{{ folder_form.Id ? "编辑" : "新增" }}文件夹</span>
        <el-form
          ref="folder_form"
          label-position="top"
          :model="folder_form"
          :rules="folder_rules"
          class="folder_form rule-form"
          @keyup.enter.native="submitFolderFrom('folder_form')"
        >
          <el-form-item label="文件路径" prop="ParentId">
            <wlTreeSelect
              size="small"
              class="u-full"
              nodeKey="Id"
              placeholder="请选择文件路径"
              :props="tree_select_prop"
              :data="tree_folder_list"
              v-model="folder_form.ParentId"
            ></wlTreeSelect>
          </el-form-item>
          <el-form-item label="文件夹名称 " prop="Name">
            <el-input
              v-model="folder_form.Name"
              placeholder="请输入文件夹名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="备注说明" prop="Describe">
            <el-input
              :rows="3"
              type="textarea"
              v-model="folder_form.Describe"
              placeholder="请输入备注说明"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <submit-btn
            @btn="submitFolderFrom('folder_form')"
            :status="load.folder"
          ></submit-btn>
          <el-button @click="fade.folder = false">取消</el-button>
        </div>
      </wl-fadein>
    </wl-explorer>
  </page-header-wrapper>
</template>

<script>
import Vue from 'vue'
import WlExplorer from 'wl-explorer'
import wlTreeSelect from 'wl-vue-select'
import WlFadein from '@/components/wl-fadein'
import { arrayToTree } from '@/utils/array' // 导入关闭其他弹出类视图函数
import {
  getFileListApi, // 1获取文件夹列表
  getAllFoldersApi, // 4获取全部文件夹
  delFileApi // 6删除文件|文件夹
} from '@/api/explorer' // 导入接口
import 'wl-explorer/lib/wl-explorer.css'

Vue.use(WlExplorer)
Vue.use(wlTreeSelect)
const apiok = 200
export default {
  name: 'FileManager',
  components: {
    'wl-fadein': WlFadein
  },
  data () {
    const _GB = 1024 * 1024
    return {
      load: {
        folder: false
      }, // loading管理
      fade: {
        folder: false
      }, // 弹出类视图管理
      headerHandle: [{ name: '权限', command: 'auth' }], // 头部按钮更多操作-自定义权限
      file_table_columns: [
        {
          label: '名称',
          prop: 'Name',
          minWidth: 120
        },
        {
          label: '修改日期',
          align: 'center',
          width: 120,
          formatter (row) {
            return row.EditTime.split('T')[0] || '-'
          }
        },
        {
          label: '类型',
          align: 'center',
          width: 90,
          formatter (row) {
            return row.Type === 1 ? '文件夹' : row.SuffixName
          }
        },
        {
          label: '大小',
          minWidth: 90,
          align: 'center',
          formatter (row) {
            if (row.Size === null) return '-'
            if (row.Size < 1024) {
              // 1024以下显示kb
              return row.Size + 'KB'
            }
            if (row.Size < _GB) {
              // 1024*1024
              const _mb = (row.Size / 1024).toFixed(2)
              return parseFloat(_mb) + 'MB'
            }
            const _gb = (row.Size / _GB).toFixed(2)
            return parseFloat(_gb) + 'GB'
          }
        },
        {
          label: '创建日期',
          align: 'center',
          width: 120,
          formatter (row) {
            return row.CreateTime.split('T')[0] || '-'
          }
        },
        {
          label: '作者',
          minWidth: 100,
          align: 'center',
          formatter (row) {
            return row.CreateUserName || '-'
          }
        },
        {
          label: '描述',
          minWidth: 100,
          formatter (row) {
            return row.Describe || '-'
          }
        }
      ], // 自定义表格列
      file_table_data: [], // 表格数据
      all_folder_list: [], // 所有文件夹列表
      tree_folder_list: [], // 树形文件夹列表
      type: {
        folder: 1,
        img: 2,
        video: 3,
        other: 4
      }, // 文件类型
      rource_type: {
        self: 1 // 自建
      }, // 数据来源类型
      explorer_prop: {
        name: 'Name',
        match: 'Name',
        splic: true,
        suffix: 'SuffixName',
        pathId: 'Id',
        pathPid: 'ParentId',
        pathName: 'Name',
        pathChildren: 'Children', // String 路径数据 children字段
        pathConnector: '\\', // String 路径父子数据拼接连接符,默认为'\'
        pathParents: 'Parents', // String 路径数据所有直系祖先节点自增长identityId逗号拼接
        pathIdentityId: 'IdentityId' // String 路径数据自增长id
      }, // 文件管理器配置项
      path: {}, // 路径数据
      folder_form: {
        ParentId: '',
        Name: '',
        preview: [],
        handle: []
      }, // 文件夹表单
      folder_rules: {
        Name: [{ required: true, message: '请填写文件夹名称', trigger: 'blur' }]
      }, // 文件夹表单验证
      child_act_saved: {}, // 存储子组件数据，用于编辑更新
      tree_select_prop: {
        label: 'Name',
        children: 'Children'
      } // 树形下拉框配置项
    }
  },
  methods: {
    /**
     * 根据关键词搜索文件
     * file: Object 文件属性
     * update: Boolean 数据是否需要更新（不需要表示已存在）
     */
    fileSearch (file, update) {
      if (update) {
        this.path = file
        this.getFileList()
      }
    },
    // 获取文件夹列表
    getFileList () {
      getFileListApi().then(({ data }) => {
        if (data.code === apiok) {
          this.file_table_data = data.data || []
        }
      })
    },
    /**
     * 编辑文件夹
     * act:Object 当前选中文件夹
     * type:String 操作类型 add添加edit编辑
     * file:Object 当前路径信息
     */
    handleFolder (act, type, file) {
      this.path = file
      this.fade.folder = true
      if (type === 'add') {
        this.$nextTick(() => {
          this.$refs['folder_form'].resetFields()
        })
        this.folder_form.Id = ''
        this.folder_form.ParentId = file.id
        return
      }
      this.child_act_saved = act
      this.folder_form = { ...act }
    },
    // 提交文件夹表单
    submitFolderFrom (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.load.folder = true
          setTimeout(() => {
            this.load.folder = false
            // let resData = data.data;
            const resData = this.folder_form // 由表单数据模拟服务器返回数据，此处应有服务器返回对应实体
            resData.EditTime = resData.CreateTime = '2019-11-11T11:11:11'
            resData.Type = 1
            if (!this.folder_form.Id) {
              // 新增
              if (this.folder_form.ParentId === this.path.id) {
                // 新增到当前路径
                this.file_table_data.unshift(resData)
              } else {
                // 新增其他路径
                const _newData = {
                  id: resData.Id,
                  pid: resData.ParentId,
                  path: resData.Name
                }
                this.$refs['wl-explorer-cpt'].updateHistoryData(
                  { Id: resData.ParentId },
                  [_newData]
                )
              }
            } else {
              // 编辑
              this.child_act_saved.Name = resData.Name
              this.child_act_saved.Describe = resData.Describe
            }
            this.fade.folder = false
            this.$message({
              showClose: true,
              message: '操作成功',
              type: 'success'
            })
          }, 1000)
        } else {
          return false
        }
      })
    },
    // 删除文件
    fileDel (data) {
      const cannotDelData = [] // 收集不可删除数据
      const normalDataFile = [] // 收集可删除文件
      const normalDataFolder = [] // 收集可删除文件夹
      data.forEach(i => {
        i.RourceType !== this.rource_type.self
          ? cannotDelData.push(i) // 不可删除数据
          : i.Type === this.type.folder
          ? normalDataFolder.push(i.Id) // 可删除文件夹
          : normalDataFile.push(i.Id) // 可删除文件
      })
      // 不可删除数据进行提示
      if (cannotDelData.length > 0) {
        let _msg = '<p class="title">以下文件或文件夹不可删除，已自动过滤</p>'
        cannotDelData.forEach(i => {
          _msg += `<p class="msg">${i.Name}</p>`
        })
        this.$message({
          dangerouslyUseHTMLString: true,
          showClose: true,
          message: _msg,
          type: 'warning',
          customClass: 'mulit-msg'
        })
      }
      if (normalDataFolder.length === 0 && normalDataFile.length === 0) { return }
      // 可删除数据正常删除
      const _data = {
        FolderIds: normalDataFolder,
        FolderFileIds: normalDataFile
      }
      delFileApi(_data).then(({ data }) => {
        if (data.code === apiok) {
          this.file_table_data = this.file_table_data.filter(
            i => ![...normalDataFile, ...normalDataFolder].includes(i.Id)
          )
          this.$message({
            showClose: true,
            message: data.message,
            type: 'success'
          })
        }
      })
    },
    // 获取所有文件夹
    getAllFolders () {
      getAllFoldersApi().then(({ data }) => {
        if (data.code === apiok) {
          this.all_folder_list = data.data || []
          const _list = [...this.all_folder_list]
          const options = {
            id: this.explorer_prop.pathId,
            pid: this.explorer_prop.pathPid,
            children: 'Children'
          }
          this.tree_folder_list = arrayToTree(_list, options)
        }
      })
    },
    // 判断是否文件夹函数
    isFolderFn (row) {
      return row.Type === this.type.folder
    }
  },
  created () {
    this.getAllFolders()
    this.getFileList()
  }
}
</script>
