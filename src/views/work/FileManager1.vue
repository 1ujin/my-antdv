<template>
  <page-header-wrapper>
    <ejs-filemanager id="file-manager" :ajaxSettings="ajaxSettings" :uploadSettings="uploadSettings" :locale="locale">
    </ejs-filemanager>
  </page-header-wrapper>
</template>

<script>
import Vue from 'vue'
import { FileManagerPlugin, DetailsView, NavigationPane, Toolbar } from '@syncfusion/ej2-vue-filemanager'
import { L10n } from '@syncfusion/ej2-base'

Vue.use(FileManagerPlugin)

L10n.load({
  'zh-cn': {
    'filemanager': {
      'NewFolder': '新建文件夹',
      'Upload': '上传',
      'Delete': '删除',
      'Rename': '重命名',
      'Download': '下载',
      'Cut': '剪切',
      'Copy': '复制',
      'Paste': '粘贴',
      'SortBy': '排序方式',
      'Refresh': '刷新',
      'Item-Selection': ' 个项目被选中',
      'Items-Selection': ' 个项目被选中',
      'View': '查看',
      'Details': '详情',
      'SelectAll': '全部选择',
      'Open': '打开',
      'Tooltip-NewFolder': '新建文件夹',
      'Tooltip-Upload': '上传',
      'Tooltip-Delete': '删除',
      'Tooltip-Rename': '重命名',
      'Tooltip-Download': '下载',
      'Tooltip-Cut': '剪切',
      'Tooltip-Copy': '复制',
      'Tooltip-Paste': '粘贴',
      'Tooltip-SortBy': '排序方式',
      'Tooltip-Refresh': '刷新',
      'Tooltip-Selection': ' 个项目被选中',
      'Tooltip-View': '查看',
      'Tooltip-Details': '详情',
      'Tooltip-SelectAll': '全部选择',
      'Name': '名称',
      'Size': '大小',
      'DateModified': '修改日期',
      'DateCreated': '创建日期',
      'Path': '路径',
      'Modified': '修改时间',
      'Created': '创建时间',
      'Location': '位置',
      'Type': '类型',
      'Permission': '权限',
      'Ascending': '升序',
      'Descending': '降序',
      'None': '无',
      'View-LargeIcons': '图标',
      'View-Details': '列表',
      'Search': '搜索',
      'Button-Ok': '确定',
      'Button-Cancel': '取消',
      'Button-Yes': '是',
      'Button-No': '否',
      'Button-Create': '新建',
      'Button-Save': '保存',
      'Header-NewFolder': '新建文件夹',
      'Content-NewFolder': '输入文件夹名称',
      'Header-Rename': '重命名',
      'Content-Rename': '输入新的名称',
      'Header-Rename-Confirmation': '确认重命名',
      'Content-Rename-Confirmation': '如果改变文件扩展名，可能会导致文件不可用。<p>确定要更改吗？',
      'Header-Delete': '删除文件',
      'Content-Delete': '确定要删除此文件吗？',
      'Header-Multiple-Delete': '删除多个文件',
      'Content-Multiple-Delete': '确定要删除 {0} 个文件吗？',
      'Header-Folder-Delete': '删除文件夹',
      'Content-Folder-Delete': '确定要删除此文件夹吗？',
      'Header-Duplicate': '文件或文件夹已存在',
      'Content-Duplicate': '{0} 已存在。是否要重命名和粘贴？',
      'Header-Upload': '文件上传',
      'Error': '错误',
      'Validation-Empty': '文件或文件夹名称不能为空。',
      'Validation-Invalid': '文件或文件夹名称 {0} 包含无效字符。请使用其他名称。有效的文件或文件夹名称不能以句点或空格结尾，并且不能包含下列任何字符：\\ /: *? " < > | ',
      'Validation-NewFolder-Exists': '名为 {0} 的文件或文件夹已存在。',
      'Validation-Rename-Exists': '文件 {0} 无法重命名为 {1}：目标已存在。',
      'Folder-Empty': '文件夹为空',
      'File-Upload': '将文件拖至此处上传',
      'Search-Empty': '没有搜索到结果',
      'Search-Key': '尝试使用其他搜索词',
      'Filter-Empty': '没有筛选结果',
      'Filter-Key': '尝试使用其他筛选词',
      'Sub-Folder-Error': '目标文件夹是源文件夹的子文件夹。',
      'Same-Folder-Error': '目标文件夹与源文件夹相同。',
      'Access-Denied': '拒绝访问',
      'Access-Details': '没有访问此文件夹的权限。',
      'Header-Retry': '该文件已存在',
      'Content-Retry': '目标已包含一个具有该名称的文件。请选择处理的方式：',
      'Button-Keep-Both': '保留这两个文件',
      'Button-Replace': '替换',
      'Button-Skip': '跳过',
      'ApplyAll-Label': '对当前所有文件执行此操作',
      'KB': 'KB',
      'Access-Message': '无法访问 {0} 。您需要权限才能执行 {1} 操作。',
      'Network-Error': '网络错误：发送 XMLHTTPRequest 错误：加载错误',
      'Server-Error': '服务端错误: 没有响应'
    }
  }
})

export default {
  name: 'FileManager1',
  data () {
    return {
       ajaxSettings: {
          url: 'https://ej2-aspcore-service.azurewebsites.net/api/FileManager/FileOperations',
          getImageUrl: 'https://ej2-aspcore-service.azurewebsites.net/api/FileManager/GetImage',
          uploadUrl: 'https://ej2-aspcore-service.azurewebsites.net/api/FileManager/Upload',
          downloadUrl: 'https://ej2-aspcore-service.azurewebsites.net/api/FileManager/Download'
      },
      // Initial view of File Manager is set to details view
      view: 'Details',
      // Upload settings customization
      uploadSettings: {
        maxFileSize: 233332,
        minFileSize: 120,
        autoUpload: true
      },
      locale: 'zh-cn'
    }
  },
  provide: {
    filemanager: [DetailsView, NavigationPane, Toolbar]
  }
}
</script>

<style lang="less" scoped>
@import '../../../node_modules/@syncfusion/ej2-base/styles/material.css';
@import '../../../node_modules/@syncfusion/ej2-icons/styles/material.css';
@import '../../../node_modules/@syncfusion/ej2-inputs/styles/material.css';
@import '../../../node_modules/@syncfusion/ej2-popups/styles/material.css';
@import '../../../node_modules/@syncfusion/ej2-buttons/styles/material.css';
@import '../../../node_modules/@syncfusion/ej2-splitbuttons/styles/material.css';
@import '../../../node_modules/@syncfusion/ej2-navigations/styles/material.css';
@import '../../../node_modules/@syncfusion/ej2-layouts/styles/material.css';
@import '../../../node_modules/@syncfusion/ej2-grids/styles/material.css';
@import '../../../node_modules/@syncfusion/ej2-vue-filemanager/styles/material.css';
@import '~ant-design-vue/es/style/themes/default.less';

#file-manager {
  height: ~'calc(100vh - @{layout-header-height} - @{page-header-padding} * 2 - @{page-header-padding-vertical} - @{page-header-padding-breadcrumb} - 21px - 8px - 32px)' !important;
}
</style>
