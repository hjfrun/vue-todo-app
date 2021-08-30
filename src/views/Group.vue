<template>
  <div>
    <h1>Group management</h1>
    <v-text-field
      v-model="newGroupName"
      @click:append="addGroupClick"
      @keyup.enter="addGroupClick"
      outlined
      label="Add Group"
      append-icon="mdi-plus"
      clearable
    ></v-text-field>
    <v-data-table
      :headers="headers"
      :items="groups"
      class="elevation-1"
      :loading="loading"
      loading-text="Loading... Please wait"
      :items-per-page="15"
    >
      <!-- eslint-disable-next-line -->
      <template v-slot:item.actions="{ item }">
        <v-icon class="mr-2" @click="editClick(item)"> mdi-pencil </v-icon>
        <v-icon @click="deleteClick(item)"> mdi-delete </v-icon>
      </template>
      <template v-slot:no-data>
        <p>No user defined group...</p>
      </template>
    </v-data-table>

    <!-- Delete Dialog -->
    <v-dialog v-model="deleteDialog" max-width="320">
      <v-card>
        <v-card-title class="text-h5 text-break-keep-all">
          Are you sure you wanna delete this group?
        </v-card-title>
        <v-card-text class="text-break-keep-all">
          {{ currentGroup.name }}</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary darken-1" text @click="deleteDialog = false">
            Cancel
          </v-btn>
          <v-btn color="red darken-2" text @click="deleteDialogConfirmclick">
            Yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Edit Dialog -->
    <v-dialog v-model="editDialog" max-width="320">
      <v-card>
        <v-card-title class="text-h5 text-break-keep-all">
          Edit the current group
        </v-card-title>

        <v-card-text>
          <v-text-field
            placeholder="Group name"
            v-model="dialogUpdates.name"
            @keyup.enter="editDialogConfirmclick"
          ></v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="primary darken-1" text @click="editDialog = false">
            Cancel
          </v-btn>

          <v-btn color="orange darken-2" text @click="editDialogConfirmclick">
            Done
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- updating overlay -->
    <v-overlay :value="updating">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    return {
      newGroupName: '',
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Actions', value: 'actions', width: '100px', sortable: false, filterable: false }
      ],
      deleteDialog: false,
      editDialog: false,
      currentGroup: { _id: '', name: '' },
      dialogUpdates: { name: '' }
    }
  },
  created() {
    this.fetchGroups()
  },
  computed: {
    ...mapState(['updating', 'loading']),
    ...mapState('group', ['groups']),
    ...mapState('task', ['tasks'])
  },
  methods: {
    ...mapActions('group', ['fetchGroups', 'addGroup', 'deleteGroup', 'updateGroup']),
    deleteClick(group) {
      Object.assign(this.currentGroup, group)
      this.deleteDialog = true
    },
    deleteDialogConfirmclick() {
      this.deleteDialog = false
      const taskInGroup = this.tasks.find(task => task.group_id === this.currentGroup._id)
      if (taskInGroup) {
        this.$message({
          showClose: true,
          message: 'There are tasks under this group, you cannot delete it now!',
          type: 'error'
        })
      } else {
        this.deleteGroup(this.currentGroup._id)
      }
    },
    addGroupClick() {
      if (this.newGroupName.trim() == '') return
      const newGroup = {
        name: this.newGroupName
      }
      this.addGroup(newGroup)
      this.newGroupName = ''
    },
    editClick(group) {
      Object.assign(this.currentGroup, group)
      this.editDialog = true
      this.dialogUpdates.name = group.name
    },
    editDialogConfirmclick() {
      this.editDialog = false
      if (this.dialogUpdates.name !== this.currentGroup.name) {
        this.updateGroup({ _id: this.currentGroup._id, updates: this.dialogUpdates })
      }
      this.dialogUpdates = { name: '' }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
