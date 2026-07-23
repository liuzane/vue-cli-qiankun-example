<template>
  <el-aside width="200px">
    <a href="" class="app__logo">
      <img
        class="app__logo-image"
        src="@/assets/logo.svg"
        alt=""
      >
      <span class="app__logo-text">Micro Frontend</span>
    </a>
    <el-menu
      :default-active="activeMenu"
      :default-opened="openedMenus"
      background-color="#001529"
      text-color="#bfcbd9"
      active-text-color="#409eff"
      router
    >
      <template v-for="(menu, index) in menus">
        <el-submenu v-if="menu.children" :key="index" :index="menu.path">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span>{{ menu.title }}</span>
          </template>
          <el-menu-item v-for="(child, childIndex) in menu.children" :key="childIndex" :index="child.path">{{ child.title }}</el-menu-item>
        </el-submenu>
        <el-menu-item v-else :key="index + menu.path" :index="menu.path">
          <i class="el-icon-s-home"></i>
          <span>{{ menu.title }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </el-aside>
</template>

<script>
// 菜单
import menus from './menus';

export default {
  name: 'AppSider',

  data() {
    return {
      menus,
      activeMenu: '/',
      openedMenus: [],
    };
  },

  watch: {
    '$route'(to) {
      this.activeMenu = to.path;
      this.openedMenus = [to.path.split('/')[1]];
    },
  },

  mounted() {
    if (this.$route.path === '/') {
      return;
    }
    this.activeMenu = this.$route.path;
    const pathnamePieces = this.$route.path.split('/');
    if (pathnamePieces.length > 2) {
      this.openedMenus = [pathnamePieces[1]];
    }
  },
};
</script>

<style scoped>
.el-aside {
  background: #001529;
  overflow-y: auto;
}

.app__logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  height: 60px;
  text-decoration: none;
  background-color: #ffffff0d;
}

.app__logo-image {
  width: 32px;
  height: 32px;
  animation: logo-spin 5s ease-in-out infinite;
}

.app__logo-text {
  border-radius: 4px;
  height: 32px;
  padding: 0 10px;
  background-color: #334454;
  color: rgba(255, 255, 255, .8);
  font-size: 16px;
  line-height: 32px;
  text-align: center;
}

.el-menu {
  border-right: none;
}

@keyframes logo-spin {
  0% {
    transform: rotateY(0deg);
  }

  45% {
    transform: rotateY(0deg);
  }

  55% {
    transform: rotateY(180deg);
  }

  100% {
    transform: rotateY(180deg);
  }
}
</style>
