/**
 * auth: weilan
 * time: https://github.com/hql7
 * description: 一个数组操作函数库
 */

/**
 * 从树形数据中递归筛选目标值
 * arr 数据源
 * val 目标值
 * id 需要判断相等的字段
 * childs 子集
 */
function valInDeep (arr = [], val, id = 'Id', childs = 'Children') {
  return arr.reduce((flat, item) => {
    return flat.concat(
      item[id] === val ? item : valInDeep(item[childs] || [], val, id, childs)
    )
  }, [])
}

/**
 * 将树形数据向下递归为一维数组
 * @param {*} arr 数据源
 * @param {*} childs  子集key
 */
function flattenDeep (arr = [], childs = 'Children') {
  return arr.reduce((flat, item) => {
    return flat.concat(
      item,
      item[childs] ? flattenDeep(item[childs], childs) : []
    )
  }, [])
}

/**
 * 将树形数据向上将此支线递归为一维数组
 * @param {*} arr 数据源
 * @param {*} parent 父级
 */
function flattenDeepParents (arr, parent) {
  return arr.reduce((flat, item) => {
    return flat.concat(
      item[parent] || [],
      item[parent] ? flattenDeepParents([item[parent]], parent) : []
    )
  }, [])
}

/**
 * 根据条件递归祖先元素
 * @param {*} row 数据源
 * @param {*} parent 父级数据
 * @param {*} reg 回调
 */
function regDeepParents (row, parent, reg) {
  if (row[parent]) {
    reg && reg(row[parent])
    regDeepParents(row[parent], parent, reg)
  }
}

/**
 * 将数组转化成树结构 array to tree
 * @param {*} array 数据源
 * @param {*} options 字段名配置项
 * @param {*} dup 是否重置dupname字段相同的值为空
 * @param {*} dupname 需要重置的字段
 */
function arrayToTree (
  array = [],
  options = { id: 'id', pid: 'pid', children: 'children' },
  dup,
  dupname
) {
  const array_ = [] // 创建储存剔除叶子节点后的骨架节点数组
  const unique = {} // 创建盒子辅助本轮children合并去重
  const rootPid = [
    0,
    '0',
    undefined,
    'undefined',
    null,
    'null',
    '00000000-0000-0000-0000-000000000000'
  ] // 可能存在的根节点pid形式
  array.forEach(item => {
    // 筛选可以插入当前节点的所有子节点
    const childrenArray = array.filter(
      it => it[options.pid] === item[options.id]
    )
    if (
      item[options.children] &&
      item[options.children] instanceof Array &&
      item[options.children].length > 0
    ) {
      // 去重合并数组
      item[options.children].map(i => (unique[i[options.id]] = 1))
      item[options.children].push(
        ...childrenArray.filter(i => unique[i[options.id]] !== 1)
      )
    } else {
      item[options.children] = childrenArray
    }
    if (dup) {
      for (let i = 1; i < item[options.children].length; i++) {
        if (
          item[options.children][i][dup] === item[options.children][i - 1][dup]
        ) {
          item[options.children][i][dupname] = ''
        }
      }
    }
    // 当childrenArray有数据时插入下一轮array_，当无数据时将最后留下来的根节点树形插入数组
    const hasChildren = childrenArray.length > 0
    if (
      hasChildren ||
      (!hasChildren && rootPid.includes(item[options.pid]))
    ) {
      array_.push(item)
    }
  })
  // 当数组内仅有根节点时退出，否组继续处理 最终递归深度次
  if (!array_.every(item => rootPid.includes(item[options.pid]))) {
    return arrayToTree(array_, options)
  } else {
    return array_
  }
}

/**
 * 如果数据里缺少树枝节点，则根据parents和自增长id补全整条树链，输出数据调用上部arrToTree函数组装成完整的树
 * @param {Array} data 当前选中的某些数据 [一维数组]
 * @param {Array} sourceData 拥有完整数据的源数据 [一维数组]
 * @param {Object} options 配置参数，包括id，pid，树链parents，组成树链的自增长IdentityId, 根节点的默认pid为空的guid
 */
function patchTreeChain (
  data,
  sourceData,
  options = {
    Id: 'Id',
    ParentId: 'ParentId',
    Parents: 'Parents',
    IdentityId: 'IdentityId',
    root: '00000000-0000-0000-0000-000000000000'
  }
) {
  const _outPutData = [] // 声明一个导出数据盒子
    let _allLackData = [] // 声明一个全部需要补全的节点盒子
  data.forEach(i => {
    // 当一个节点在整个已选节点里找不到父节点时，并且此节点不是根节点时，从源数据中补全
    if (
      !data.find(t => t[options.Id] === i[options.ParentId]) &&
      i[options.ParentId] !== options.root
    ) {
      // 首先将记录在节点身上的父级树链拆分
      const _parents = i[options.Parents]
        .substring(1, i[options.Parents].length - 1)
        .split(',')
        .filter(item => !!item)
      // 然后查找父级树链中某一链条是否已在数据中存在，已存在的不需要补全，从树链中剔除
      const _lackParents = _parents.filter(
        e => data.findIndex(m => m[options.IdentityId] === e) === -1
      )
      // 合并全部需要补全的数据
      _allLackData = _allLackData.concat(_lackParents)
    }
  });
  // 去重后根据IdentityId在源数据中找到完整的节点数据并组装
  [...new Set(_allLackData)].forEach(item => {
    _outPutData.push(sourceData.find(it => it[options.IdentityId] === item))
  })
  // 最后返回当前数据和需要补全父级树链的数据
  return _outPutData.concat(data)
}

/**
 * 数组删除后重新定位
 * @param {Object} data 数组数据
 * @param {String|Number} delId 要删除的数据id
 * @param {string|number} actId 当前id
 * @param {Boolean} useTree 是否使用树形算法
 */
function locationAfterDelete (data, delId, actId, useTree = false) {
  if (data.length === 1) {
    const _item = data.Parent
      ? data.Parent
      : { Id: useTree ? data[0].ParentId : '' }
    return { item: _item, afterData: [] }
  }
  const afterData = data.filter(item => item.Id !== delId)
  if (actId && delId !== actId) {
    return { item: null, afterData }
  }
  const curI = data.findIndex(item => item.Id === delId)
  const prevItem = curI > 0 ? data[curI - 1] : null
  const nextItem = curI !== data.length - 1 ? data[curI + 1] : null
  return { item: nextItem || prevItem, afterData }
}

/**
 * 从坐标值拼接指定字段到祖先元素
 * @param {*} data 一维数据源
 * @param {*} coordinate 坐标值数据
 * @param {*} options 配置项
 */
function splicParentsUntil (
  data,
  coordinate,
  options = {
    Splic: 'Name', // 所要拼接字段
    Connector: '\\', // 连接符
    Id: 'Id', // 数据源匹配字段
    CoordinateId: 'id',
    ParentId: 'ParentId',
    Parents: 'Parents',
    IdentityId: 'IdentityId',
    root: '00000000-0000-0000-0000-000000000000'
  }
) {
  const coordinateItem = data.find(
    i => i[options.Id] === coordinate[options.CoordinateId]
  )
  if (!coordinateItem) return ''
  if (!coordinateItem[options.Parents]) return coordinateItem[options.Splic]
  const _parents = coordinateItem[options.Parents]
    .substring(1, coordinateItem[options.Parents].length - 1)
    .split(',')
    .filter(i => !!i)
  let splicParents = ''
  _parents.forEach(i => {
    const _parent = data.find(t => t[options.IdentityId] === i)
    splicParents += `${_parent[options.Splic]}${options.Connector}`
  })
  return splicParents + coordinateItem[options.Splic]
}

/**
 * 根据数组2内的元素，通过match字段匹配数组1内的完整内容组成的数据
 * @param {*} array1 带有完整item对象的源数组列表
 * @param {*} array2 只带有match字段组成的简单数组
 * @param {*} match 用于匹配数组1和数组2的字段
 */
function intersectionBy (array1 = [], array2 = [], match = 'Id') {
  if ([null, 'null', undefined, 'undefined'].includes(array2)) return
  const data = []
  array2.forEach(item => {
    const matchSuccess = array1.find(it => it[match] === item)
    matchSuccess && data.push(matchSuccess)
  })
  return data
}

export {
  valInDeep,
  flattenDeep,
  flattenDeepParents,
  regDeepParents,
  arrayToTree,
  patchTreeChain,
  locationAfterDelete,
  splicParentsUntil,
  intersectionBy
}
