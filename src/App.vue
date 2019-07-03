<template>
  <div v-if="user" class="page-container">
    <router-view :user="user" v-on:log-out="handleLogOut()" />
  </div>
  <div v-else class="page-container">
    <sign-in v-on:log-in="handleLogIn"/>
    <md-snackbar :md-active.sync="showWelcomeMessage" :md-duration="4000">Welcome {{ user && user.email ? user.email : '' }}!</md-snackbar>
  </div>
</template>

<style lang="scss" src="./App.scss"></style>
<script src="./App"></script>
