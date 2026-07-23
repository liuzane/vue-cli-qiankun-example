<template>
  <el-card>
    <p class="title">Hello，这是我们的技术搭档：</p>
    <ul class="doc-list">
      <li class="doc-list__item">
        <span>Qiankun</span>:
        <el-link type="primary" target="_blank" href="https://qiankun.umijs.org">https://qiankun.umijs.org</el-link>
      </li>
      <li class="doc-list__item">
        <span>Vue CLI</span>:
        <el-link type="primary" target="_blank" href="https://cli.vuejs.org">https://cli.vuejs.org</el-link>
      </li>
      <li class="doc-list__item">
        <span>Vue</span>:
        <el-link type="primary" target="_blank" href="https://v2.cn.vuejs.org">https://v2.cn.vuejs.org</el-link>
      </li>
      <li class="doc-list__item">
        <span>Vue Router</span>:
        <el-link type="primary" target="_blank" href="https://v3.router.vuejs.org">https://v3.router.vuejs.org</el-link>
      </li>
      <li class="doc-list__item">
        <span>Element UI</span>:
        <el-link type="primary" target="_blank" href="https://element.eleme.cn">https://element.eleme.cn</el-link>
      </li>
      <li class="doc-list__item">
        <span>MockDB</span>:
        <el-link type="primary" target="_blank" href="https://github.com/liuzane/mock-database">https://github.com/liuzane/mock-database</el-link>
      </li>
    </ul>
  </el-card>
</template>

<script>
export default {
  name: 'Home',
};
</script>

<style scoped>
.title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
}

.doc-list {
  list-style-type: none;
  padding: 0;
}

.doc-list__item {
  margin: 10px 0;
}

.doc-list__item span {
  display: inline-block;
  width: 120px;
  font-weight: bold;
}
</style>
