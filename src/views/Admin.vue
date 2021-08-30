<template>
  <div v-loading.fullscreen.lock="fullscreenLoading">
    <h1>User management</h1>
    <v-btn @click="addDialog = true">Add New User</v-btn>
    <v-data-table
      :headers="headers"
      :items="users"
      class="elevation-1"
      :loading="loadingUsers"
      loading-text="Loading... Please wait"
      :items-per-page="15"
    >
      <!-- eslint-disable-next-line -->
      <template v-slot:item.actions="{ item }">
        <v-icon class="mr-2" @click="editClick(item)"> mdi-pencil </v-icon>
        <v-icon @click="deleteClick(item)"> mdi-delete </v-icon>
      </template>
      <template v-slot:no-data>
        <p>No users...</p>
      </template>
    </v-data-table>

    <!-- Delete Dialog -->
    <v-dialog v-model="deleteDialog" max-width="320">
      <v-card>
        <v-card-title class="text-h5 text-break-keep-all">
          Are you sure you wanna delete this user?
        </v-card-title>
        <v-card-text class="text-break-keep-all">
          {{ currentUser.username }}</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary darken-1" text @click="deleteDialog = false">
            Cancel
          </v-btn>
          <v-btn color="red darken-2" text @click="deleteDialogConfirmClick">
            Yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Add User Dialog -->
    <v-dialog v-model="addDialog" max-width="320">
      <v-card>
        <v-card-title class="text-h5 text-break-keep-all">
          Add a new user
        </v-card-title>

        <v-card-text>
          <v-text-field
            placeholder="User name"
            v-model="newUser.username"
          ></v-text-field>
          <v-text-field
            placeholder="Password"
            v-model="newUser.password"
          ></v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="primary darken-1" text @click="addDialog = false">
            Cancel
          </v-btn>

          <v-btn color="orange darken-2" text @click="addDialogConfirmClick">
            Done
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Edit Dialog -->
    <v-dialog v-model="editDialog" max-width="320">
      <v-card>
        <v-card-title class="text-h5 text-break-keep-all">
          Edit the current user
        </v-card-title>

        <v-card-text>
          <v-text-field
            placeholder="User name"
            v-model="dialogUpdates.username"
          ></v-text-field>
          <v-text-field
            placeholder="Password"
            v-model="dialogUpdates.password"
          ></v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="primary darken-1" text @click="editDialog = false">
            Cancel
          </v-btn>

          <v-btn color="orange darken-2" text @click="editDialogConfirmClick">
            Done
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      users: [],
      loadingUsers: false,
      newUser: {
        username: '',
        password: ''
      },
      headers: [
        { text: 'User Name', value: 'username' },
        { text: 'Actions', value: 'actions', width: '100px', sortable: false, filterable: false }
      ],
      addDialog: false,
      deleteDialog: false,
      editDialog: false,
      currentUser: { _id: '', username: '' },
      dialogUpdates: { username: '', password: '' },
      fullscreenLoading: false
    }
  },
  created() {
    this.fetchUsers()
  },
  methods: {
    async fetchUsers() {
      this.loadingUsers = true
      const { data: users } = await this.$http.get('/user')
      this.loadingUsers = false
      this.users = users
    },
    async addDialogConfirmClick() {
      this.fullscreenLoading = true
      const { data } = await this.$http.post('/user', this.newUser)
      this.fullscreenLoading = false
      if (data.status === 'success') {
        this.addDialog = false
        this.fetchUsers()
        this.newUser = { username: '', password: '' }
        // popup a message to info the user added successfully!
      }
    },
    deleteClick(user) {
      Object.assign(this.currentUser, user)
      this.deleteDialog = true
    },
    async deleteDialogConfirmClick() {
      this.deleteDialog = false
      this.fullscreenLoading = true
      const { data } = await this.$http.delete(`/user/${this.currentUser._id}`)
      this.fullscreenLoading = false
      if (data.status === 'success') {
        this.deleteDialog = false
        this.fetchUsers()
      }
    },
    editClick(user) {
      Object.assign(this.currentUser, user)
      this.editDialog = true
      this.dialogUpdates.username = user.username
    },
    async editDialogConfirmClick() {
      this.editDialog = false
      this.fullscreenLoading = true
      const { data } = await this.$http.patch(`/user/${this.currentUser._id}`, this.dialogUpdates)
      this.fullscreenLoading = false
      if (data.status === 'success') {
        this.editDialog = false
        await this.fetchUsers()
      }
      this.dialogUpdates = { username: '', password: '' }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
