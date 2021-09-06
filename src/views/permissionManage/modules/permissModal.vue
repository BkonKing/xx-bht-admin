<template>
  <div class="permissModal">
    <a-modal v-model="isShow" title="权限" @ok='submit'>
      <a-tree
        v-model="checkedKeys"
        checkable
        v-if="roleMunes.length > 0"
        class="draggable-tree"
        :tree-data="roleMunes"
        :replaceFields="{ key: 'id' }"
        @select="onSelect"
        @check="onCheck"
        :autoExpandParent="false"
      >
        <template slot="custom" slot-scope="item">
          {{ item.menuText }}
        </template>
      </a-tree>
    </a-modal>
  </div>
</template>

<script>
import { toGetAdminMenus, toUpdateAdminMenus } from '@/api/permissionManage'
export default {
  data () {
    return {
      checkedKeys: [], // 选中的权限菜单
      roleMunes: [], // 角色菜单数组
      openArr: [], // 展开的菜单节点
      isShow: false,
      // roleId: '', // 角色id
      id: '',
      halfCheckedKeys: []
    }
  },
  methods: {
    // 配置角色对应的菜单
    async submit () {
      const res = await toUpdateAdminMenus({
        adminId: this.id,
        allots: this.checkedKeys.concat(this.halfCheckedKeys).join(',')
      })
      if (res.success) {
        this.$emit('success')
        this.$message.success('提交成功')
        this.isShow = false
      }
    },
    // 选中节点时候触发
    onSelect (selectedKeys, info) {
      this.selectedKeys = selectedKeys
      this.$nextTick(() => {
        this.selectMenuBol = true
      })
    },
    // 点击复选框
    onCheck (checkedKeys, e) {
      this.halfCheckedKeys = e.halfCheckedKeys
    },
    // 获取所有需要展开的id数组
    getOpenArr (arr) {
      arr.forEach(item => {
        if (item.state.opened === 1) {
          this.openArr.push(item.id)
        }
        if (item.state.selected === 1) {
          this.checkedKeys.push(item.id)
        }
        if (item.children) {
          this.getOpenArr(item.children)
        }
      })
    },
    // 显示角色对应的菜单
    showPermiasionMenu () {
      toGetAdminMenus({ adminId: this.id }).then(res => {
        this.roleMunes = res.data
        this.getOpenArr(this.roleMunes)
      })
    }
  },
  watch: {
    id () {
      if (this.id !== '') {
        this.showPermiasionMenu()
      }
    },
    isShow (newVal) {
      if (newVal === false) {
        this.checkedKeys = []
        this.roleMunes = []
        this.openArr = []
        this.id = ''
      }
    }
  }
}
</script>

<style lang='less' scoped>
/deep/ .ant-modal-body{
  height: 400px;
  overflow: auto;
}
</style>
