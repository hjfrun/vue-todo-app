<template>
  <v-app>
    <v-main>
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
      user: {},
      showPassword: false,
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
      this.$message({
        showClose: true,
        message: this.$route.params.message,
        type: 'error'
      })
    }
  },
  methods: {
    async login() {
      if (Object.prototype.hasOwnProperty.call(this.user, 'username') === false || this.user.username === '') {
        return this.$message({
          showClose: true,
          message: 'Please enter the username!',
          center: true,
          type: 'error'
        })
      }

      if (Object.prototype.hasOwnProperty.call(this.user, 'password') === false || this.user.password === '') {
        return this.$message({
          showClose: true,
          message: 'Please enter the username!',
          center: true,
          type: 'error'
        })
      }

      try {
        const res = await this.$http.post('/login', this.user)
        const { token } = res.data
        sessionStorage.token = token
        this.$router.push('/')
        this.$message({
          showClose: true,
          message: 'Login Successfully!',
          center: true,
          type: 'success'
        })
      } catch (err) {
        const { msg } = err.response.data
        this.$message({
          showClose: true,
          message: msg,
          center: true,
          type: 'error'
        })
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
