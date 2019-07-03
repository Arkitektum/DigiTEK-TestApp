<template>
  <div v-if="user" class="page-container">
    <router-view :user="user" v-on:log-out="handleLogOut()" />
    <md-snackbar :md-active.sync="showWelcomeMessage">Welcome {{ user && user.email ? user.email : '' }}!</md-snackbar>
  </div>
  <div v-else class="page-container">
    <sign-in v-on:log-in="handleLogIn"/>
  </div>
</template>

<style lang="scss" src="./App.scss"></style>
<script src="./App"></script>
