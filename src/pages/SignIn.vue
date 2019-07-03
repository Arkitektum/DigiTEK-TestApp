<template>
  <main class='container'>
    <div>
      <form novalidate class="md-layout md-gutter" @submit.prevent="validateUser">
        <md-card class="md-layout-item md-size-50 md-small-size-100 login-card" >
          <md-card-header>
            <div class="md-title">Logg inn</div>
          </md-card-header>
          <md-card-content>
            <md-field md-clearable :class="getValidationClass('email')">
              <label for="email">E-postadresse</label>
              <md-input name="email" id="email" autocomplete="email" v-model="form.email" :disabled="sending" />
              <span class="md-error" v-if="!$v.form.email.required">E-postadresse er påkrevd</span>
              <span class="md-error" v-else-if="!$v.form.email.minlength">E-postadressen er ugyldig</span>
            </md-field>
            <md-field :class="getValidationClass('password')">
              <label for="password">Passord</label>
              <md-input type="password" name="password" id="password" v-model="form.password" :disabled="sending" />
              <span class="md-error" v-if="!$v.form.password.required">Passord er påkrevd</span>
            </md-field>
          </md-card-content>
          <md-progress-bar md-mode="indeterminate" v-if="sending" />
          <md-card-actions>
            <md-button type="submit" class="md-primary" :disabled="sending">Logg inn</md-button>
          </md-card-actions>
        </md-card>
      </form>
    </div>
  </main>
</template>

<script src="./SignIn.js"></script>
<style lang="scss" src="./SignIn.scss" scoped></style>
