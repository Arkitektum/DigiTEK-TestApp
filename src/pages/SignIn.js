import { validationMixin } from 'vuelidate';
import {
  required,
  email,
  minLength
} from 'vuelidate/lib/validators';

const mustBeAllowedEmail = (email) => {
  const allowedEmails = [
    'vs@dibk.no',
    'odf@dibk.no',
    'roa@dibk.no',
    'baw@dibk.no',
    'tsa@dibk.no',
    'matias@arkitektum.no',
    'kim@arkitektum.no',
    'benjamin@arkitektum.no'
  ];
  return allowedEmails.includes(email);
};

export default {
  name: 'SignIn',
  mixins: [validationMixin],
  data: () => ({
    form: {
      email: null,
      password: null
    },
    userSaved: false,
    sending: false,
    lastUser: null
  }),
  validations: {
    form: {
      email: {
        required,
        email,
        mustBeAllowedEmail
      },
      password: {
        required,
        minLength: minLength(8)
      }
    }
  },
  methods: {

    getValidationClass(fieldName) {
      const field = this.$v.form[fieldName];
      if (field) {
        return {
          'md-invalid': field.$invalid && field.$dirty
        };
      }
    },
    clearForm() {
      this.$v.$reset();
      this.form.email = null;
      this.form.password = null;
    },
    saveUser() {
      this.sending = true;

      // Instead of this timeout, here you can call your API
      window.setTimeout(() => {
        this.lastUser = `${this.form.email}`;
        this.userSaved = true;
        this.sending = false;
        this.$emit('log-in', this.form.email);
        this.clearForm();
      }, 1500);
    },
    validateUser() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.saveUser();
      }
    }
  }
};
