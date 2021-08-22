<template>
  <div>
    <v-data-table :headers="headers" :items="tasks" class="elevation-1">
      <!-- eslint-disable-next-line -->
      <template v-slot:item.done="{ item }">
        <v-simple-checkbox
          v-model="item.done"
          color="primary"
          @click="updateTask({ _id: item._id, updates: { done: item.done } })"
        ></v-simple-checkbox>
      </template>
      <!-- eslint-disable-next-line -->
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editClick(item)">
          mdi-pencil
        </v-icon>
        <v-icon small @click="deleteClick(item)"> mdi-delete </v-icon>
      </template>
      <template v-slot:no-data>
        <no-task></no-task>
      </template>
    </v-data-table>

    <v-snackbar v-model="snackbar.show" timeout="2000">
      {{ snackbar.text }}
      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="snackbar.show = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>

    <!-- Delete Dialog -->
    <v-dialog v-model="deleteDialog" max-width="320">
      <v-card>
        <v-card-title class="text-h5 text-break-keep-all">
          Are you sure you wanna delete this task?
        </v-card-title>

        <v-card-text class="text-break-keep-all">
          {{ currentTask.name }}</v-card-text
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
          Edit the current task
        </v-card-title>

        <v-card-text>
          <v-text-field
            placeholder="Task name"
            v-model="dialogUpdates.name"
            @keyup.enter="editDialogConfirmclick"
          ></v-text-field>
        </v-card-text>

        <v-card-text>
          <v-text-field
            label="Due Date"
            v-model="dialogUpdates.due_date"
            readonly
            @click="dueDateClick"
          >
          </v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="primary darken-1" text @click="editDialog = false">
            Cancel
          </v-btn>

          <v-btn color="red darken-2" text @click="editDialogConfirmclick">
            Done
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- date picker dialog -->
    <v-dialog v-model="datePickerDialog" max-width="320">
      <v-date-picker
        v-if="datePickerDialog"
        v-model="dialogUpdates.due_date"
        @input="dateInput"
      ></v-date-picker>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import NoTask from '@/components/NoTask.vue'

export default {
  components: {
    NoTask
  },
  data() {
    return {
      headers: [
        { text: 'Status', value: 'done' },
        { text: 'Name', value: 'name' },
        { text: 'Due Date', value: 'due_date' },
        { text: 'Actions', value: 'actions' }
      ],
      deleteDialog: false,
      editDialog: false,
      datePickerDialog: false,
      currentTask: { _id: '', name: '', done: false, due_date: '' },
      dialogUpdates: { name: '', due_date: '' }
    }
  },
  computed: {
    ...mapState(['tasks', 'snackbar'])
  },
  async created() {
    this.fetchTasks()
  },
  methods: {
    ...mapActions(['fetchTasks', 'deleteTask', 'updateTask']),
    deleteClick(task) {
      Object.assign(this.currentTask, task)
      this.deleteDialog = true
    },
    deleteDialogConfirmclick() {
      this.deleteDialog = false
      this.deleteTask(this.currentTask._id)
    },
    editClick(task) {
      Object.assign(this.currentTask, task)
      this.editDialog = true
      this.dialogUpdates.name = task.name
      this.dialogUpdates.due_date = task.due_date
    },
    // perform the real updates
    editDialogConfirmclick() {
      this.editDialog = false
      this.updateTask({ _id: this.currentTask._id, updates: this.dialogUpdates })
      this.dialogUpdates = { name: '', due_date: '' }
    },
    dateInput() {
      this.datePickerDialog = false
    },
    dueDateClick() {
      this.datePickerDialog = true
    }
  }
}
</script>

<style lang="scss" scoped>
.text-break-keep-all {
  word-break: keep-all;
}
</style>
