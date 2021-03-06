<template>
  <div v-loading.fullscreen.lock="fullscreenLoading">
    <v-text-field
      v-if="searchModel"
      class="pb-5"
      v-model="search"
      :label="$t('search')"
      append-icon="mdi-magnify"
      single-line
      hide-details
      outlined
      clearable
    ></v-text-field>
    <add-task v-else class="pb-5"></add-task>
    <v-select
      v-model="groupValue"
      :items="groupItems"
      chips
      :label="$t('filterByGroup')"
      multiple
    ></v-select>
    <v-data-table
      :headers="headers"
      :items="filteredTasks"
      class="elevation-1"
      :loading="dataLoading"
      :search="search"
      loading-text="Loading... Please wait"
      :items-per-page="15"
      no-data-text="No tasks"
    >
      <!-- eslint-disable-next-line -->
      <template v-slot:item.done="{ item }">
        <v-simple-checkbox
          v-model="item.done"
          color="primary"
          @click="updateTask({ _id: item._id, updates: { done: item.done } })"
        ></v-simple-checkbox>
      </template>
      <!-- eslint-disable-next-line -->
      <template v-slot:item.name="{ item }">
        <span :class="item.done ? 'text-decoration-line-through' : ''">
          {{ item.name }}
        </span>
      </template>
      <!-- eslint-disable-next-line -->
      <template v-slot:item.actions="{ item }">
        <v-icon class="mr-2" @click="editClick(item)"> mdi-pencil </v-icon>
        <v-icon @click="deleteClick(item)"> mdi-delete </v-icon>
      </template>
    </v-data-table>

    <!-- Delete Dialog -->
    <v-dialog v-model="deleteDialog" max-width="320">
      <v-card>
        <v-card-title class="text-h5 text-break-keep-all">
          {{ $t("deleteWarn") }}
        </v-card-title>
        <v-card-text class="text-break-keep-all">
          {{ currentTask.name }}</v-card-text
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
          {{ $t("editWarn") }}</v-card-title
        >
        <v-card-text>
          <v-text-field
            :placeholder="$t('taskName')"
            v-model="dialogUpdates.name"
            @keyup.enter="editDialogConfirmclick"
          ></v-text-field>
        </v-card-text>

        <v-card-text>
          <v-select
            class="mt-4"
            :items="groupItems"
            v-model="dialogUpdates.group_id"
            :placeholder="$t('group')"
          >
          </v-select>
        </v-card-text>

        <v-card-text>
          <v-text-field
            :placeholder="$t('due_date')"
            v-model="dialogUpdates.due_date"
            readonly
            @click="datePickerDialog = true"
            append-icon="mdi-close"
            @click:append="dialogUpdates.due_date = ''"
          >
          </v-text-field>
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

    <!-- date picker dialog -->
    <v-dialog v-model="datePickerDialog" max-width="320">
      <v-date-picker
        v-model="dialogUpdates.due_date"
        show-adjacent-months
        @input="datePickerDialog = false"
      ></v-date-picker>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import AddTask from '@/components/AddTask'


export default {
  components: {
    AddTask,
  },
  data() {
    return {
      search: '',
      headers: [
        { text: this.$t('status'), value: 'done', align: 'center', width: '90px' },
        { text: this.$t('name'), value: 'name' },
        { text: this.$t('due_date'), value: 'due_date', width: '150px' },
        { text: this.$t('update_time'), value: 'updatedAt', width: '200px' },
        { text: this.$t('actions'), value: 'actions', width: '100px', sortable: false, filterable: false }
      ],
      deleteDialog: false,
      editDialog: false,
      datePickerDialog: false,
      currentTask: { _id: '', name: '', done: false, due_date: '', group_id: '' },
      dialogUpdates: { name: '', due_date: '', group_id: '' },
      groupValue: [],
      dataLoading: false,
      fullscreenLoading: false
    }
  },
  computed: {
    ...mapState(['searchModel']),
    ...mapState('task', ['tasks']),
    ...mapState('group', ['groups']),
    ...mapGetters('group', ['groupItems']),
    filteredTasks() {
      return this.tasks.filter(e => this.groupValue.includes(e.group_id) || this.groupValue.length === 0)
    }
  },
  async created() {
    this.dataLoading = true
    await this.fetchTasks()
    this.dataLoading = false
    this.fetchGroups()
  },
  methods: {
    ...mapActions('group', ['fetchGroups']),
    ...mapActions('task', ['fetchTasks', 'deleteTask', 'updateTask']),
    deleteClick(task) {
      Object.assign(this.currentTask, task)
      this.deleteDialog = true
    },
    async deleteDialogConfirmclick() {
      this.deleteDialog = false
      this.fullscreenLoading = true
      await this.deleteTask(this.currentTask._id)
      this.fullscreenLoading = false
    },
    editClick(task) {
      Object.assign(this.currentTask, task)
      this.editDialog = true
      this.dialogUpdates.name = task.name
      this.dialogUpdates.due_date = task.due_date
      this.dialogUpdates.group_id = task.group_id
    },
    // perform the real updates
    async editDialogConfirmclick() {
      this.editDialog = false
      if (this.dialogUpdates.name !== this.currentTask.name || this.dialogUpdates.due_date !== this.currentTask.due_date || this.dialogUpdates.group_id !== this.currentTask.group_id) {
        this.fullscreenLoading = true
        await this.updateTask({ _id: this.currentTask._id, updates: this.dialogUpdates })
        this.fullscreenLoading = false
      }
      this.dialogUpdates = { name: '', due_date: '', group_id: '' }
    }
  }
}
</script>

<style lang="scss" scoped>
.text-break-keep-all {
  word-break: keep-all;
}
</style>
