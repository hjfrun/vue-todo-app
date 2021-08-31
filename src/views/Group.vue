<template>
  <div v-loading.fullscreen.lock="fullscreenLoading">
    <h1>{{ $t("groupMag") }}</h1>
    <v-text-field
      v-model="newGroupName"
      @click:append="addGroupClick"
      @keyup.enter="addGroupClick"
      outlined
      :label="$t('addGroup')"
      append-icon="mdi-plus"
      clearable
    ></v-text-field>
    <v-data-table
      :headers="headers"
      :items="groups"
      class="elevation-1"
      :loading="dataLoading"
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
          {{ $t("deleteGroupWarn") }}
        </v-card-title>
        <v-card-text class="text-break-keep-all">
          {{ currentGroup.name }}</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary darken-1" text @click="deleteDialog = false">
            {{ $t("cancel") }}
          </v-btn>
          <v-btn color="red darken-2" text @click="deleteDialogConfirmclick">
            {{ $t("yes") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Edit Dialog -->
    <v-dialog v-model="editDialog" max-width="320">
      <v-card>
        <v-card-title class="text-h5 text-break-keep-all">
          {{ $t("editGroupWarn") }}
        </v-card-title>

        <v-card-text>
          <v-text-field
            :placeholder="$t('groupName')"
            v-model="dialogUpdates.name"
            @keyup.enter="editDialogConfirmclick"
          ></v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="primary darken-1" text @click="editDialog = false">
            {{ $t("cancel") }}
          </v-btn>
          <v-btn color="orange darken-2" text @click="editDialogConfirmclick">
            {{ $t("done") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    return {
      newGroupName: '',
      headers: [
        { text: this.$t('name'), value: 'name' },
        { text: this.$t('actions'), value: 'actions', width: '100px', sortable: false, filterable: false }
      ],
      deleteDialog: false,
      editDialog: false,
      currentGroup: { _id: '', name: '' },
      dialogUpdates: { name: '' },
      dataLoading: false,
      fullscreenLoading: false
    }
  },
  async created() {
    this.dataLoading = true
    await this.fetchGroups()
    this.dataLoading = false
  },
  computed: {
    ...mapState('group', ['groups']),
    ...mapState('task', ['tasks'])
  },
  methods: {
    ...mapActions('group', ['fetchGroups', 'addGroup', 'deleteGroup', 'updateGroup']),
    deleteClick(group) {
      Object.assign(this.currentGroup, group)
      this.deleteDialog = true
    },
    async deleteDialogConfirmclick() {
      this.deleteDialog = false
      const taskInGroup = this.tasks.find(task => task.group_id === this.currentGroup._id)
      if (taskInGroup) {
        this.$message({
          showClose: true,
          message: 'There are tasks under this group, you cannot delete it now!',
          type: 'error'
        })
      } else {
        this.fullscreenLoading = true
        await this.deleteGroup(this.currentGroup._id)
        this.fullscreenLoading = false
      }
    },
    async addGroupClick() {
      if (this.newGroupName.trim() == '') return
      const newGroup = {
        name: this.newGroupName
      }
      this.fullscreenLoading = true
      await this.addGroup(newGroup)
      this.fullscreenLoading = false
      this.newGroupName = ''
    },
    editClick(group) {
      Object.assign(this.currentGroup, group)
      this.editDialog = true
      this.dialogUpdates.name = group.name
    },
    async editDialogConfirmclick() {
      this.editDialog = false
      if (this.dialogUpdates.name !== this.currentGroup.name) {
        this.fullscreenLoading = true
        await this.updateGroup({ _id: this.currentGroup._id, updates: this.dialogUpdates })
        this.fullscreenLoading = false
      }
      this.dialogUpdates = { name: '' }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
