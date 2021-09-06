import { mapState, mapGetters } from 'vuex'

const mixin = {
  computed: {
    ...mapState({
      permissions: state => state.user.permissions
    }),
    ...mapGetters(['isParentCompany']),
    ...mapState({
      userCompanyId: state => state.user.info.companyId || '1'
    })
  }
}

export default mixin
