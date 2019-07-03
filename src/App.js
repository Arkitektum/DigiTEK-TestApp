import SignIn from '@/pages/SignIn.vue';

export default {
  name: 'App',
  data: () => ({
    menuVisible: false,
    user: null,
    showWelcomeMessage: false
  }),
  components: {
    SignIn
  },
  methods: {
    toggleMenu() {
      this.menuVisible = !this.menuVisible;
    },
    handleLogOut() {
      this.user = null;
    },
    handleLogIn(email) {
      this.user = {
        email
      },
      this.showWelcomeMessage = true;
    }
  }
};
