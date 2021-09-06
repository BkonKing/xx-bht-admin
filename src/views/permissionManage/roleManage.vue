<template>
  <div class="roleManage">
    <a-row :gutter="24">
      <a-col :span="8">
        <a-card>
          <div v-if="treeData.length > 0">
            <a-tree
              class="draggable-tree"
              :tree-data="treeData"
              @select="selectInfo"
            >
              <template slot="custom" slot-scope="item">
                {{ item.roleName }}
                <a-icon
                  v-if="+permissions.AllotsPermission === 1"
                  class="icon"
                  type="tool"
                  @click="showPermiasionMenu(item)"
                />
                <a-icon
                  v-if="+permissions.CreatePermission === 1"
                  class="icon"
                  type="edit"
                  @click="edit(item, 'edit')"
                />
                <a-icon
                  v-if="+permissions.CreatePermission === 1"
                  class="icon"
                  type="apartment"
                  @click="selectItem(item, 'create')"
                />
                <a-icon
                  v-if="+permissions.RemovePermission === 1"
                  class="icon"
                  type="delete"
                  @click="del(item.id)"
                />
              </template>
            </a-tree>
          </div>
          <div v-else>
            当前还没有角色，请从右侧创建
          </div>
        </a-card>
      </a-col>
      <a-col :span="16">
        <a-card
          v-if="!permissionShow && permissions.CreatePermission"
          class="card2"
        >
          <div class="title">{{ parentId === 0 ? "新增" : "编辑" }}</div>
          <div class="content">
            <div class="left">
              <div>
                角色管理
                <a-icon type="right" style="padding:0 15px" />
              </div>
              <div class="t1" v-for="(item, index) in titleArr" :key="index">
                {{ item }}
                <a-icon class="rightIcon" type="right" />
              </div>
            </div>
            <div class="right">
              <div
                class="r1 inputItem"
                v-for="(item, index) in inputArr"
                :key="index"
              >
                <a-input
                  v-model="item.roleName"
                  style="width:216px"
                  placeholder="角色名称"
                ></a-input>
                <a-input
                  v-model="item.listOrder"
                  style="width:216px"
                  placeholder="排序"
                  v-number-input.int
                  @blur="changeSort"
                ></a-input>

                <a-icon
                  type="minus-circle"
                  @click="removeMe(item.id, index)"
                  class="close"
                />
              </div>
              <div class="addArea" @click="add">+ <span>添加</span></div>
              <a-button
                type="primary"
                :disabled="createBol"
                @click="saveEditData"
                >保存</a-button
              >
            </div>
          </div>
        </a-card>
        <a-card v-if="permissionShow && treeData.length > 0" class="card2">
          <div class="title">
            <div>权限 - {{ titleArr[titleArr.length - 1] }}</div>
          </div>
          <div class="srcollBox">
            <a-tree
              v-model="checkedKeys"
              checkable
              v-if="roleMunes.length > 0"
              class="draggable-tree"
              :tree-data="roleMunes"
              :replaceFields="{ key: 'id' }"
              @select="onSelect"
              :defaultExpandParent="false"
              @check="onCheck"
            >
              <template slot="custom" slot-scope="item">
                {{ item.menuText }}
              </template>
            </a-tree>
          </div>
          <div class="btn">
            <a-button
              type="primary"
              :disabled="selectMenuBol"
              @click="setRoleMenus"
              >保存</a-button
            >
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import {
  toGetRoles,
  toUpdateBatchRole,
  toRemoveBatchRole,
  toRemoveRole,
  toGetAllotsMenus,
  toUpdateAllotsMenus
} from '@/api/permissionManage.js'
import clonedeep from 'lodash.clonedeep'

export default {
  data () {
    return {
      treeData: [], // 权限菜单列表
      inputArr: [], // 创建分支 右侧 空输入框结构数据
      itemInfo: {}, // 新增右侧 创建分支的菜单数据
      itemTitle: [], // 创建分支 题目标题
      titleArr: [], // 创建分支 题目标题
      idArr: [], // 编辑  权限id数组
      parentId: 0, // 父id
      roleMunes: [], // 角色菜单数组
      checkedKeys: [], // 选中的权限菜单
      openArr: [], // 展开的菜单节点
      roleId: '', // 角色id
      permissionShow: false, // 是否显示权限面板
      createBol: true,
      selectMenuBol: true,
      halfCheckedKeys: []
    }
  },
  watch: {
    inputArr: {
      handler () {
        this.createBol = false
      },
      deep: true
    }
  },
  methods: {
    onCheck (checkedKeys, e) {
      this.halfCheckedKeys = e.halfCheckedKeys
      this.selectMenuBol = false
      // this.checkedKeys = checkedKeys
    },
    // 配置角色对应的菜单
    async setRoleMenus () {
      const res = await toUpdateAllotsMenus({
        roleId: this.roleId,
        allots: this.checkedKeys.concat(this.halfCheckedKeys).join(',')
      })
      this.getData()
      this.$message.success(res.message)
    },
    // 获取所有需要展开的id数组
    getOpenArr (arr) {
      arr.forEach(item => {
        // if (item.state.opened === 1) {
        //   this.openArr.push(item.id)
        // }
        if (item.state.selected === 1) {
          this.checkedKeys.push(item.id)
        }
        if (item.children) {
          this.getOpenArr(item.children)
        }
      })
    },
    // 选中节点时候触发
    onSelect (selectedKeys, info) {
      this.selectedKeys = selectedKeys
      this.$nextTick(() => {
        this.selectMenuBol = true
      })
    },
    // 显示角色对应的菜单
    showPermiasionMenu (item) {
      this.permissionShow = true
      this.roleId = item.id
      // this.openArr = []
      this.titleArr.push(item.roleName)
      this.checkedKeys = []
      toGetAllotsMenus({ roleId: +item.id }).then(res => {
        this.roleMunes = res.data
        this.getOpenArr(this.roleMunes)
      })
    },
    // 获取权限菜单数据
    async getData () {
      const res = await toGetRoles()
      this.treeData = res.data
    },

    // 批量编辑权限菜单
    async saveEditData () {
      if (this.idArr.length > 0) {
        await toRemoveBatchRole({ ids: this.idArr })
        this.idArr = []
      }
      const arr = this.inputArr.filter(item => {
        return item.roleName !== ''
      })
      arr.forEach(item => {
        item.parentId = item.parentId || this.parentId
      })
      if (arr.length > 0) {
        const res = await toUpdateBatchRole({
          roles: arr
        })
        if (res.code === 200) {
          this.inputArr = res.data
          this.idArr = []
          this.$message.success(res.message)
        }
      } else {
        this.inputArr = []
      }

      this.getData()

      this.$nextTick(() => {
        this.createBol = true
      })
    },
    // 设置标题
    selectInfo (selectedKeys, info) {
      // 设置创建分支的标题
      let titleArr = []
      if (info.node.$parent.dataRef) {
        titleArr = this.getParentTitle(info.node.$parent)
      }
      this.itemTitle = titleArr
      // 设置编辑同级的标题
      if (info.node.dataRef.parentId === '0') {
        this.setItemInfo(this.treeData)
      } else {
        if (info.node.$parent.dataRef) {
          this.setItemInfo(info.node.$parent.dataRef.children)
        }
      }
    },
    // 递归获取标题
    getParentTitle (parent2) {
      const arr = []
      const parent = parent2.$parent
      if (parent.dataRef) {
        arr.push(...this.getParentTitle(parent))
      }
      if (parent2.dataRef.roleName) {
        arr.push(parent2.dataRef.roleName)
      }
      return arr
    },
    // 设置同级数据
    setItemInfo (data) {
      const arr = data.map(item => {
        return {
          allots: item.allots,
          companyId: item.companyId,
          content: item.content,
          id: item.id,
          listOrder: item.listOrder,
          parentId: item.parentId,
          roleName: item.roleName
        }
      })
      this.itemInfo = {
        children: arr
      }
      this.$nextTick(() => {
        this.createBol = true
      })
    },
    // 删除节点
    del (id) {
      this.$confirm({
        title: '删除模块',
        icon: h => <a-icon theme="filled" type="exclamation-circle" />,
        content: h => (
          <div>
            <span style="color:red;">该模块及其子模块都会被删除</span>
            ，确定删除吗?
          </div>
        ),
        onOk: () => {
          toRemoveRole({ id }).then(res => {
            this.inputArr = []
            this.getData()
            this.$message.success('删除成功')
          })
        }
      })
    },
    // 编辑
    edit (item) {
      setTimeout(() => {
        this.parentId = item.dataRef.parentId
        this.inputArr = this.itemInfo.children
        this.titleArr = this.itemTitle
        this.permissionShow = false
      }, 0)
    },
    // 编辑下一层
    selectItem (item) {
      setTimeout(() => {
        this.parentId = item.id
        this.inputArr = []
        this.titleArr = this.itemTitle
        this.titleArr.push(item.roleName)
        this.permissionShow = false

        if (item.children) {
          this.inputArr = clonedeep(item.children)
          this.$nextTick(() => {
            this.createBol = true
          })
        }
      }, 0)
    },
    // 排序失去焦点重新排序
    changeSort () {
      this.inputArr = this.inputArr.sort((el1, el2) => {
        return parseInt(el2.listOrder) - parseInt(el1.listOrder)
      })
    },
    // 创建分支 添加输入框
    add () {
      this.inputArr.push({
        id: '',
        roleName: '',
        listOrder: ''
      })
    },
    // 批量 编辑删除菜单
    removeMe (id, index) {
      id && this.idArr.push(id)
      this.inputArr.splice(index, 1)
    }
  },
  created () {
    this.getData()
  }
}
</script>

<style lang="less" scoped>
.roleManage {
  .icon {
    margin: 0 5px;
    font-size: 16px;
    color: #9e9e9e;
  }
  .content {
    padding: 24px;
    line-height: 30px;
    .left {
      display: flex;
      align-items: center;
      .rightIcon {
        margin: 0 10px;
      }
    }
    .right {
      margin-top: 30px;
      input {
        margin-right: 10px;
      }
      .close {
        margin-top: 6.5px;
        font-size: 18px;
        color: #c5c5c5;
      }
      .r1 {
        margin-bottom: 10px;
      }
      .addArea {
        max-width: 442px;
        height: 32px;
        border-radius: 4px;
        border: 1px dashed #d9d9d9;
        text-align: center;
        line-height: 28px;
        cursor: pointer;
      }
    }
  }
  .card2 {
    /deep/ .ant-card-body {
      padding: 0;
    }
    .title {
      height: 55px;
      line-height: 55px;
      padding-left: 24px;
      border-bottom: 1px solid rgba(233, 233, 233, 1);
      font-weight: 650;
      font-style: normal;
      font-size: 16px;
      color: rgba(0, 0, 0, 0.85);
    }
    button {
      margin-top: 24px;
    }
    .btn {
      margin-bottom: 24px;
      margin-left: 24px;
      margin-top: 0;
    }
    .srcollBox {
      width: 100%;
      height: 400px;
      padding: 24px;
      overflow: auto;
    }
  }
}
</style>
