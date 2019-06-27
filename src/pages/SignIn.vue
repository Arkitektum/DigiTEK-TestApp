<template>
  <main class='container'>
    <div>
      <form novalidate class="md-layout md-gutter" @submit.prevent="validateUser">
        <md-card class="md-layout-item md-size-50 md-small-size-100 login-card" >
          <md-card-header>
            <div class="md-title">Sign in</div>
          </md-card-header>
          <md-card-content>
            <md-field md-clearable :class="getValidationClass('userName')">
              <label for="user-name">User Name</label>
              <md-input name="user-name" id="user-name" autocomplete="user-name" v-model="form.userName" :disabled="sending" />
              <span class="md-error" v-if="!$v.form.userName.required">The user name is required</span>
              <span class="md-error" v-else-if="!$v.form.userName.minlength">Invalid user name</span>
            </md-field>
            <md-field :class="getValidationClass('password')">
              <label for="password">Password</label>
              <md-input type="password" name="password" id="password" v-model="form.password" :disabled="sending" />
              <span class="md-error" v-if="!$v.form.password.required">The password is required</span>
            </md-field>
          </md-card-content>
          <md-progress-bar md-mode="indeterminate" v-if="sending" />
          <md-card-actions>
            <md-button type="submit" class="md-primary" :disabled="sending">Sign in</md-button>
          </md-card-actions>
        </md-card>
      </form>
    </div>
  </main>
</template>

<script src="./SignIn.js"></script>
<style lang="scss" src="./SignIn.scss" scoped></style>
