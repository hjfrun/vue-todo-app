<template>
  <v-app>
    <v-main>
      <v-alert
        class="mx-auto"
        v-model="alert"
        prominent
        type="error"
        max-width="600"
        border="left"
        dismissible
        >{{ errorMessage }}</v-alert
      >
      <v-card width="500" class="login-card" elevatino="6">
        <v-card-title style="justify-content: center">ToDo Login</v-card-title>
        <v-card-text>
          <v-text-field
            label="Username"
            v-model="user.username"
            prepend-icon="mdi-account-circle"
            :rules="nameRules"
            required
          />
          <v-text-field
            label="Password"
            v-model="user.password"
            :type="showPassword ? 'text' : 'password'"
            prepend-icon="mdi-lock"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword = !showPassword"
            :rules="passwordRules"
            @keyup.enter="login"
            required
          />
        </v-card-text>

        <v-card-actions>
          <v-btn class="mx-auto" large color="success" @click="login"
            >Login</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-main>
  </v-app>
</template>
<script>

export default {
  name: 'Login',
  data() {
    return {
      alert: false,
      user: {},
      showPassword: false,
      errorMessage: '',
      nameRules: [
        v => !!v || 'Username is required'
      ],
      passwordRules: [
        v => !!v || 'Password is required'
      ]
    }
  },
  created() {
    if (this.$route.params.message) {
      this.errorMessage = this.$route.params.message
      this.alert = true
    }
  },
  methods: {
    async login() {
      if (Object.prototype.hasOwnProperty.call(this.user, 'username') === false || this.user.username === '') {
        this.errorMessage = 'Please enter the username!'
        this.alert = true
        return
      }

      if (Object.prototype.hasOwnProperty.call(this.user, 'password') === false || this.user.password === '') {
        this.errorMessage = 'Please enter the password!'
        this.alert = true
        return
      }

      try {
        const res = await this.$http.post('/login', this.user)
        const { token } = res.data
        sessionStorage.token = token
        this.$router.push('/')
      } catch (err) {
        const { message } = err.response.data
        this.errorMessage = message
        this.alert = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.login-card {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -60%);
}
</style>
