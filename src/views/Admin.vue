<template>
  <v-app>
    <v-main>
      <v-alert
        class="mx-auto"
        v-model="alert"
        prominent
        :type="alertType"
        max-width="600"
        border="left"
        dismissible
        >{{ alertMessage }}</v-alert
      >
      <v-card width="500" class="mx-auto mt-16" elevatino="6">
        <v-card-title style="justify-content: center"
          >User Register / Update</v-card-title
        >
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
            required
          />
        </v-card-text>

        <v-card-actions>
          <v-btn class="mx-auto" large color="success" @click="registerClick"
            >Register</v-btn
          >
          <v-btn class="mx-auto" large color="success" @click="updateClick"
            >Update Password</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-main>
  </v-app>
</template>
<script>

export default {
  name: 'Admin',
  data() {
    return {
      alert: false,
      user: {},
      showPassword: false,
      alertType: 'error',
      alertMessage: '',
      nameRules: [
        v => !!v || 'Username is required'
      ],
      passwordRules: [
        v => !!v || 'Password is required'
      ]
    }
  },
  methods: {
    async registerClick() {
      if (this.user.name === '' || this.user.password === '') {
        this.alert = true
        this.alertMessage = 'Please enter the username and password!'
        return
      }
      const { data } = await this.$http.post('/user', this.user)
      if (data.status === 'success') {
        this.alertType = 'success'
        this.alertMessage = data.msg
        this.alert = true
        this.user = { username: '', password: '' }
      }
    },
    async updateClick() {
      if (this.user.name === '' || this.user.password === '') {
        this.alert = true
        this.alertMessage = 'Please enter the username and password!'
        return
      }
      const { data } = await this.$http.patch('/user', this.user)
      if (data.status === 'success') {
        this.alertType = 'success'
        this.alertMessage = data.msg
        this.alert = true
        this.user = { username: '', password: '' }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
