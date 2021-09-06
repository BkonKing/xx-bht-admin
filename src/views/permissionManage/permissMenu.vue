<template>
  <div class="permissMenu">
    <a-row :gutter="24">
      <a-col :span="10">
        <a-card>
          <div v-if="treeData.length > 0">
          <a-tree
            class="draggable-tree"
            :tree-data="treeData"
            @select="selectInfo"
          >
            <template slot="custom" slot-scope="item">
              {{ item.menuText }}

              <a-icon class="icon" type="edit" @click="edit(item)" />
              <a-icon class="icon" type="apartment" @click="selectItem(item)" />
              <a-icon class="icon" type="delete" @click="del(item.id)" />
            </template>
          </a-tree>
          </div>
           <div v-else>
            当前还没有角色，请从右侧创建
          </div>
        </a-card>
      </a-col>
      <a-col :span="14">
        <a-alert message="操作权限请统一在icon中填入以下几种类型：新增-CreatePermission、编辑-UpdatePermission、删除-RemovePermission、审核-AuditPermission" type="info" />
            <a-card class="card2"  v-if="showInit">
            <div class="title">新增</div>
            <div class="content">
              <div class="left">
                <div>
                  权限菜单
                  <a-icon class="rightIcon" type="right" />
                </div>
              </div>
              <div class="right">
                    <div
                class="r1 inputItem"
                v-for="(item, index) in inputArr3"
                :key="index"
              >
                <a-input
                  v-model="item.menuText"
                  style="width:120px"
                  placeholder="菜单名称"
                ></a-input>
                <a-input
                  v-model="item.icon"
                  style="width:120px"
                  placeholder="菜单图标"
                ></a-input>
                <a-input
                  v-model="item.limitsPath"
                  style="width:120px"
                  placeholder="访问链接"
                ></a-input>
                  <a-input
                  v-model="item.apiPath"
                  style="width:120px"
                  placeholder="接口路径"
                ></a-input>
                <a-input
                  v-model="item.listOrder"
                  style="width:60px"
                  placeholder="排序"
                ></a-input>

                <a-radio-group v-model="item.display">
                  <a-radio :value="0">
                    隐藏
                  </a-radio>
                  <a-radio :value="1">
                    显示
                  </a-radio>
                </a-radio-group>

                <a-icon
                  type="minus-circle"
                  class="close"
                  @click="remove3(index)"
                />
              </div>
                <div class="addArea" @click="add3">+ <span>添加</span></div>
                <a-button type="primary" :disabled='initBol' @click="initSave">保存</a-button>
              </div>
            </div>
          </a-card>
        <a-card v-if="rightShow" class="card3">
          <div class="title">
            创建分支
          </div>
          <div class="content">
            <div class="left">
              <div>
                美好生活家园APP
                <a-icon class="rightIcon" type="right" />
              </div>
              <div class="t1" v-for="(item, index) in titleArr" :key="index">
                {{ item }}
                <a-icon class="rightIcon" type="right" />
              </div>
            </div>
            <div class="right">
              <div>
                <div
                  class="r2"
                  v-show="itemInfo"
                  v-for="(item, index) in itemInfo.children"
                  :key="index"
                >
                  <a-input
                    v-model="item.menuText"
                    style="width:120px"
                    placeholder="菜单名称"
                  ></a-input>
                  <a-input
                    v-model="item.icon"
                    style="width:120px"
                    placeholder="菜单图标"
                  ></a-input>
                  <a-input
                    v-model="item.limitsPath"
                    style="width:120px"
                    placeholder="访问链接"
                  ></a-input>
                         <a-input
                  v-model="item.apiPath"
                  style="width:120px"
                  placeholder="接口路径"
                ></a-input>
                  <a-input
                    v-model="item.listOrder"
                    style="width:60px"
                    placeholder="排序"
                  ></a-input>

                  <a-radio-group v-model="item.display">
                    <a-radio :value="0">
                      隐藏
                    </a-radio>
                    <a-radio :value="1">
                      显示
                    </a-radio>
                  </a-radio-group>

                  <a-icon
                    type="minus-circle"
                    class="close"
                    @click="removeMe(item.id, index)"
                  />
                </div>
              </div>
              <div
                class="r1 inputItem"
                v-for="(item, index) in inputArr"
                :key="index"
              >
                <a-input
                  v-model="item.menuText"
                  style="width:120px"
                  placeholder="菜单名称"
                ></a-input>
                <a-input
                  v-model="item.icon"
                  style="width:120px"
                  placeholder="菜单图标"
                ></a-input>
                <a-input
                  v-model="item.limitsPath"
                  style="width:120px"
                  placeholder="访问链接"
                ></a-input>
                       <a-input
                  v-model="item.apiPath"
                  style="width:120px"
                  placeholder="接口路径"
                ></a-input>
                <a-input
                  v-model="item.listOrder"
                  style="width:60px"
                  placeholder="排序"
                ></a-input>

                <a-radio-group v-model="item.display">
                  <a-radio :value="0">
                    隐藏
                  </a-radio>
                  <a-radio :value="1">
                    显示
                  </a-radio>
                </a-radio-group>

                <a-icon
                  type="minus-circle"
                  class="close"
                  @click="remove(index)"
                />
              </div>
              <div class="addArea" @click="add">+ <span>添加</span></div>
              <a-button type="primary" :disabled="createBol" @click="save">保存</a-button>
            </div>
          </div>
        </a-card>
        <a-card class="card2" v-if="editShow && treeData.length > 0">
          <div class="title">编辑</div>
          <div class="content">
            <div class="left">
              <div>
                权限菜单
                <a-icon type="right" style="padding:0 15px" />
              </div>
              <div class="t1" v-for="(item, index) in titleArr2" :key="index">
                {{ item }}
                <a-icon type="right" style="paddingLeft:15px" />
              </div>
            </div>
            <div class="right">
               <div>
                <div
                  class="r2"
                  v-show="itemInfo"
                  v-for="(item, index) in itemInfo2.children"
                  :key="index"
                >
                  <a-input
                    v-model="item.menuText"
                    style="width:120px"
                    placeholder="菜单名称"
                  ></a-input>
                  <a-input
                    v-model="item.icon"
                    style="width:120px"
                    placeholder="菜单图标"
                  ></a-input>
                  <a-input
                    v-model="item.limitsPath"
                    style="width:120px"
                    placeholder="访问链接"
                  ></a-input>
                       <a-input
                  v-model="item.apiPath"
                  style="width:120px"
                  placeholder="接口路径"
                ></a-input>
                  <a-input
                    v-model="item.listOrder"
                    style="width:60px"
                    placeholder="排序"
                  ></a-input>

                  <a-radio-group v-model="item.display">
                    <a-radio :value="0">
                      隐藏
                    </a-radio>
                    <a-radio :value="1">
                      显示
                    </a-radio>
                  </a-radio-group>

                  <a-icon
                    type="minus-circle"
                    class="close"
                    @click="removeMe2(item.id, index)"
                  />
                </div>
              </div>
               <div
                class="r1 inputItem"
                v-for="(item, index) in inputArr2"
                :key="index"
              >
                <a-input
                  v-model="item.menuText"
                  style="width:120px"
                  placeholder="菜单名称"
                ></a-input>
                <a-input
                  v-model="item.icon"
                  style="width:120px"
                  placeholder="菜单图标"
                ></a-input>
                <a-input
                  v-model="item.limitsPath"
                  style="width:120px"
                  placeholder="访问链接"
                ></a-input>
                       <a-input
                  v-model="item.apiPath"
                  style="width:120px"
                  placeholder="接口路径"
                ></a-input>
                <a-input
                  v-model="item.listOrder"
                  style="width:60px"
                  placeholder="排序"
                ></a-input>

                <a-radio-group v-model="item.display">
                  <a-radio :value="0">
                    隐藏
                  </a-radio>
                  <a-radio :value="1">
                    显示
                  </a-radio>
                </a-radio-group>

                <a-icon
                  type="minus-circle"
                  class="close"
                  @click="remove2(index)"
                />
              </div>
              <div class="addArea" @click="add2">+ <span>添加</span></div>
              <a-button type="primary" :disabled="editBol" @click="saveEditData"
                >保存</a-button
              >
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import {
  toGetMenus,
  toUpdateBatchMenu,
  toRemoveMenu,
  toRemoveBatchMenu
} from '@/api/permissionManage'
let arr = []
// 递归获取标题
function getParentTitle (parent2) {
  if (parent2.dataRef.menuText) {
    arr.unshift(parent2.dataRef.menuText)
  }
  // console.log('parent2.dataRef.title', parent2.dataRef.title)
  const parent = parent2.$parent
  // console.log('parent', parent)
  // console.log('parent.dataRef', parent.dataRef)
  if (parent.dataRef) {
    getParentTitle(parent)
  }
  return arr
}

export default {
  data () {
    return {
      treeData: [], // 权限菜单列表
      inputArr: [], // 右侧 空输入框结构数据
      itemInfo: {}, // 右侧 编辑的菜单数据
      titleArr: [], // 题目标题
      rightShow: false,
      idArr: [], // 权限id数组
      parentId: 0,
      editShow: false,
      titleArr2: [],
      itemInfo2: {},
      inputArr2: [],
      editBol: true,
      type: '', // 区分编辑 还是  创建分支
      idArr2: [],
      createBol: true,
      inputArr3: [],
      initBol: true,
      showInit: true
    }
  },
  watch: {
    inputArr2: {
      handler () {
        this.editBol = false
      },
      deep: true
    },
    inputArr3: {
      handler () {
        this.initBol = false
      },
      deep: true
    },
    itemInfo2: {
      handler () {
        this.editBol = false
      },
      deep: true
    },
    inputArr: {
      handler () {
        this.createBol = false
      },
      deep: true
    },
    itemInfo: {
      handler () {
        this.createBol = false
      },
      deep: true
    }
  },

  methods: {
    // 创建初始角色
    async initSave () {
      const arr = this.inputArr3.map(item => {
        let id = item.id
        let parentId = item.parentId
        if (!parentId) {
          id = 0
          parentId = 0
        }
        return {
          display: +item.display,
          icon: item.icon,
          id,
          level: item.level,
          limitsPath: item.limitsPath,
          listOrder: item.listOrder,
          menuText: item.menuText,
          apiPath: item.apiPath,
          parentId
        }
      }).filter(item => item.menuText)
      if (!arr || arr.length === 0) {
        this.$message.warning('请输入菜单信息')
        return
      }
      const res = await toUpdateBatchMenu({ menus: arr })
      this.inputArr3 = res.data
      this.getData()
      this.$nextTick(() => {
        this.initBol = true
      })
      this.$message.success(res.message)
    },
    // 添加 编辑初始化输入框
    add3 () {
      this.inputArr3.push({
        id: Math.random() * 999,
        parentId: '',
        menuText: '',
        limitsPath: '',
        icon: '',
        apiPath: '',
        listOrder: '',
        display: ''
      })
    },
    // 删除初始角色数据
    remove3 (index) {
      this.inputArr3.splice(index, 1)
    },
    // 批量编辑权限菜单
    async saveEditData () {
      if (this.idArr2.length > 0) {
        await toRemoveBatchMenu({ ids: this.idArr2 })
        this.idArr2 = []
        this.getData()
      }
      // 顶级角色
      // if (this.parentId === 0) {
      let menus = this.itemInfo2.children.map(item => {
        return {
          display: +item.display,
          icon: item.icon,
          id: item.id,
          level: item.level,
          limitsPath: item.limitsPath,
          listOrder: item.listOrder,
          menuText: item.menuText,
          apiPath: item.apiPath,
          parentId: item.parentId
        }
      })
      const arr = this.inputArr2.filter(item => {
        return item.menuText !== ''
      })
      arr.forEach(item => {
        item.parentId = menus[0].parentId
        item.id = 0
      })
      menus = [...menus, ...arr]
      const res = await toUpdateBatchMenu({
        menus: menus
      })
      if (res.code === 200) {
        this.itemInfo2.children = res.data
        this.inputArr2 = []
        this.idArr2 = []
      }
      this.$message.success(res.message)
      this.getData()

      this.editBol = false
    },
    // 添加 编辑初始化输入框
    add2 () {
      console.log('add2')
      this.inputArr2.push({
        id: Math.random() * 999,
        parentId: '',
        menuText: '',
        limitsPath: '',
        icon: '',
        apiPath: '',
        listOrder: '',
        display: ''
      })
    },
    // 删除初始化输入框
    remove2 (index) {
      this.inputArr2.splice(index, 1)
    },
    // 批量 编辑删除菜单
    removeMe2 (id, index) {
      console.log('批量 编辑删除菜单', id)
      this.idArr2.push(id)
      this.itemInfo2.children.splice(index, 1)
    },
    // 新增权限菜单
    newAdd () {
      this.$refs.addModel.isShow = true
    },
    //  创建分支权限菜单
    async save () {
      if (this.idArr.length > 0) {
        await toRemoveBatchMenu({ ids: this.idArr })
      }
      if (this.parentId === 0) {
        console.log('执行了1')
        let menus = this.itemInfo.children.map(item => {
          return {
            id: item.id,
            parentId: item.parentId,
            menuText: item.menuText,
            limitsPath: item.limitsPath,
            icon: item.icon,
            listOrder: item.listOrder,
            apiPath: item.apiPath,
            display: item.display
          }
        })
        const arr = this.inputArr.filter(item => {
          return item.menuText !== ''
        })
        arr.forEach(item => {
          item.parentId = menus[0].parentId
          item.id = 0
        })
        menus = [...menus, ...arr]
        if (menus.length > 0) {
          const res = await toUpdateBatchMenu({
            menus: menus
          })
          if (res.code === 200) {
            this.itemInfo.children = res.data
            this.inputArr = []
            this.idArr = []
          }
          this.$message.info(res.message)
        }
      } else {
        console.log('执行了2')
        let menus = this.itemInfo.children.map(item => {
          return {
            id: item.id,
            parentId: item.parentId,
            menuText: item.menuText,
            limitsPath: item.limitsPath,
            icon: item.icon,
            listOrder: item.listOrder,
            apiPath: item.apiPath,
            display: item.display
          }
        })
        const arr = this.inputArr.filter(item => {
          return item.menuText !== ''
        })
        arr.forEach(item => {
          item.parentId = this.parentId
          item.id = 0
        })
        menus = [...menus, ...arr]
        if (menus.length > 0) {
          const res = await toUpdateBatchMenu({
            menus: menus
          })
          if (res.code === 200) {
            this.itemInfo.children = res.data
            this.inputArr = []
            this.idArr = []
          }
          this.$message.info(res.message)
        }
      }

      this.getData()

      this.$nextTick(() => {
        this.createBol = true
      })
    },
    // 获取权限菜单数据
    async getData () {
      const res = await toGetMenus()
      this.treeData = res.data
      console.log('权限菜单列表', res)
    },
    // 设置标题
    selectInfo (selectedKeys, info) {
      console.log('info', info)
      // 设置创建分支的标题
      if (this.type === 'create') {
        let arr2 = []
        if (info.node.$parent.dataRef) {
          arr2 = getParentTitle(info.node.$parent)
        }
        // console.log(info.node.dataRef.title)
        arr2.push(info.node.dataRef.menuText)
        this.titleArr = arr2
        arr2 = []
        arr = []
        this.$nextTick(() => {
          this.createBol = true
        })
      } else {
        // 设置编辑同级的标题
        if (info.node.dataRef.parentId === '0') {
          const arr = this.treeData.map(item => {
            return {
              display: +item.display,
              icon: item.icon,
              id: item.id,
              level: item.level,
              limitsPath: item.limitsPath,
              listOrder: item.listOrder,
              menuText: item.menuText,
              apiPath: item.apiPath,
              parentId: item.parentId
            }
          })
          this.itemInfo2 = {
            children: arr
          }
          this.$nextTick(() => {
            this.editBol = true
          })
        } else {
          // let arr3 = []
          this.arr3 = []
          // console.log('二级菜单')
          arr = []
          this.titleArr2 = []
          if (info.node.$parent.dataRef) {
            this.arr3 = getParentTitle(info.node.$parent)
            // console.log('二级菜单', this.arr3)
            this.titleArr2 = [...new Set(this.arr3)]
            const arr4 = info.node.$parent.dataRef.children.map(item => {
              return {
                display: +item.display,
                icon: item.icon,
                id: item.id,
                level: item.level,
                limitsPath: item.limitsPath,
                listOrder: item.listOrder,
                apiPath: item.apiPath,
                menuText: item.menuText,
                parentId: item.parentId
              }
            })
            this.itemInfo2 = {
              children: arr4
            }
            this.$nextTick(() => {
              this.editBol = true
            })
          }
        }
      }
      // console.log(this.titleArr)
    },
    // 删除节点
    del (id) {
      this.$confirm({
        title: '删除模块',
        icon: h => <a-icon theme="filled" type="exclamation-circle" />,
        content: h => (
          <div>
            <span style="color:red;">该模块及其子模块都会被删除</span>
            ，确定删除吗
          </div>
        ),
        onOk: () => {
          toRemoveMenu({ id: id }).then(() => {
            this.$message.success('删除成功')

            this.getData()
            this.$nextTick(() => {
              this.inputArr3 = []
            })
          })
        },
        onCancel () {
          console.log('Cancel')
        },
        class: 'test'
      })
    },
    // 编辑
    edit (item) {
      this.parentId = item.dataRef.parentId
      this.type = 'edit'
      this.showInit = false
      this.editShow = true
      this.rightShow = false
    },
    // 添加输入框
    add () {
      this.inputArr.push({
        id: Math.random() * 999,
        parentId: '',
        menuText: '',
        limitsPath: '',
        icon: '',
        apiPath: '',
        listOrder: '',
        display: ''
      })
    },
    // 删除输入框
    remove (index) {
      this.inputArr.splice(index, 1)
    },
    // 批量删除菜单
    removeMe (id, index) {
      console.log('批量删除菜单', id)
      this.idArr.push(id)
      this.itemInfo.children.splice(index, 1)
    },
    // 选择菜单
    selectItem (item) {
      // 显示右边结构
      this.rightShow = true
      this.showInit = false
      this.editShow = false
      this.type = 'create'
      this.itemInfo = {}
      // 清空右侧输入框数组
      this.inputArr = []
      if (item.children) {
        console.log('执行了这里1', item)
        this.parentId = item.id
        this.itemInfo = JSON.parse(JSON.stringify(item))
        this.itemInfo.children.forEach(item => {
          item.display = +item.display
        })
        this.$nextTick(() => {
          this.createBol = true
        })
      } else {
        console.log('执行了这里2')
        this.parentId = item.id
        // let obj = {}
        // obj = {
        //   ...JSON.parse(JSON.stringify(item.dataRef))
        // }
        // const arr = []
        // arr.push(obj)
        // this.itemInfo = { children: arr }
        // this.itemInfo.children.forEach(item => {
        //   item.display = +item.display
        // })
      }
    }
  },
  created () {
    this.getData()
  }
}
</script>

<style lang="less" scoped>
.permissMenu {
  .newAdd {
    margin-left: 20px;
    width: 100px;
    text-align: left;
  }
  .icon {
    margin: 0 5px;
    font-size: 16px;
  }
  .content {
    line-height: 30px;
    .left {
      display: flex;
      align-items: center;
      .rightIcon {
        margin: 0 10px;
      }
    }
  }
  .right {
    margin-top: 30px;
    .close {
      font-size: 18px;
    }
    .r1 {
      margin-bottom: 10px;
      .plus {
        margin: 0 10px;
        font-size: 18px;
      }
    }
    .r2 {
      margin-bottom: 10px;
      .close {
        font-size: 18px;
      }
    }
    button {
      margin-right: 10px;
    }
  }
  .addArea {
    margin-top: 24px;
    max-width: 584px;
    width: 100%;
    height: 32px;
    border-radius: 4px;
    border: 2px dashed #eeeeee;
    text-align: center;
    line-height: 28px;
    cursor: pointer;
  }
  .card3 {
    /deep/ .ant-card-body {
      padding: 0;
    }

    .title {
     padding-left: 24px;
      height: 55px;
      line-height: 55px;
      border-bottom-width: 1px;
      border-bottom-style: solid;
      border-bottom-color: rgba(233, 233, 233, 1);
      font-weight: 650;
      font-style: normal;
      font-size: 16px;
      color: rgba(0, 0, 0, 0.847058823529412);
    }
    input{
      margin-right: 10px;
    }
    button{
      margin-top: 32px;
    }
    .r2{
      margin-bottom: 20px;
    }
  }
  .card2{
     /deep/ .ant-card-body {
      padding: 0;
    }
    .title {
      padding-left: 24px;
      height: 55px;
      line-height: 55px;
      border-bottom-width: 1px;
      border-bottom-style: solid;
      border-bottom-color: rgba(233, 233, 233, 1);
      font-weight: 650;
      font-style: normal;
      font-size: 16px;
      color: rgba(0, 0, 0, 0.847058823529412);
    }
     input{
      margin-right: 10px;
    }
    .inputItem,.r2{
      margin-bottom: 20px;
    }
    button{
      margin-top: 20px;
    }
  }
  .content {
    padding: 24px;
  }
}
</style>
