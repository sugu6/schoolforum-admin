<template>
  <div class="container">
    <div class="logo">
      <img alt="logo" :src="logoSvg" class="logo-img" />
      <div class="logo-text" :class="{ 'logo-text-dark': isDark }">
        海语校园论坛后台
      </div>
    </div>
    <LoginBanner />
    <div class="content">
      <div class="content-inner">
        <LoginForm />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import logoSvg from "@/assets/logo.svg?url";
import LoginBanner from "./components/banner.vue";
import LoginForm from "./components/login-form.vue";

const isDark = computed(
  () => document.body.getAttribute("arco-theme") === "dark",
);
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  height: 100vh;

  .banner {
    width: 550px;
    background: linear-gradient(163.85deg, #1d2129 0%, #00308f 100%);
  }

  .content {
    position: relative;
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    padding-bottom: 40px;
  }
}

.logo {
  position: fixed;
  top: 24px;
  left: 22px;
  z-index: 1;
  display: inline-flex;
  align-items: center;

  .logo-img {
    width: 32px;
    height: 32px;
  }

  &-text {
    margin-right: 4px;
    margin-left: 4px;
    color: var(--color-fill-1);
    font-size: 20px;

    &-dark {
      color: var(--color-text-1);
    }
  }
}
</style>

<style lang="scss" scoped>
// responsive
@media (max-width: $screen-lg) {
  .container {
    .banner {
      width: 25%;
    }
  }
}
</style>
