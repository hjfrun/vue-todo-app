<template>
  <div class="todo">
    <v-list class="pt-0" flat v-if="tasks.length">
      <div v-for="task in tasks" :key="task.id">
        <v-list-item
          :class="{ 'blue lighten-5': task.done }"
          @click="doneTask(task.id)"
        >
          <template v-slot:default>
            <v-list-item-action>
              <v-checkbox :input-value="task.done" color="primary"></v-checkbox>
            </v-list-item-action>

            <v-list-item-content>
              <v-list-item-title
                :class="{ 'text-decoration-line-through': task.done }"
                >{{ task.title }}</v-list-item-title
              >
            </v-list-item-content>
            <v-list-item-content>
              <v-list-item-title v-show="task.due_date" class="due-date">{{
                task.due_date
              }}</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon dark v-bind="attrs" v-on="on">
                    <v-icon color="primary lighten-1">mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item
                    v-for="(item, index) in moreActions"
                    :key="index"
                    @click="actionClick(index, task.id)"
                  >
                    <v-list-item-icon>
                      <v-icon v-text="item.icon"></v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-list-item-action>
          </template>
        </v-list-item>
        <v-divider></v-divider>
      </div>
    </v-list>
    <div v-else class="no-task">
      <no-task></no-task>
    </div>
    <v-snackbar v-model="snackbar.show" :timeout="timeout">
      {{ snackbar.text }}
      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="snackbar.show = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>

    <v-dialog v-model="deleteDialog" max-width="320">
      <v-card>
        <v-card-title class="text-h5 text-break-keep-all">
          Are you sure you wanna delete this task?
        </v-card-title>

        <v-card-text class="text-break-keep-all">
          {{ currentTask.title }}</v-card-text
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

    <v-dialog v-model="editDialog" max-width="320">
      <v-card>
        <v-card-title class="text-h5 text-break-keep-all">
          Edit the current task title
        </v-card-title>

        <v-card-text>
          <v-text-field
            placeholder="Task name"
            v-model="editTaskTitle"
            @keyup.enter="editDialogConfirmclick"
          ></v-text-field>
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
    <v-dialog v-model="datePickerDialog" max-width="320">
      <v-date-picker v-model="picker" @input="dateInput"></v-date-picker>
    </v-dialog>
  </div>
</template>

<script>

import { mapState, mapActions } from 'vuex'
import NoTask from '@/components/NoTask.vue'

export default {
  name: 'Home',
  components: {
    NoTask
  },
  data() {
    return {
      picker: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      datePickerDialog: false,
      editTaskTitle: '',
      timeout: 2000,
      moreActions: [
        {
          title: 'Edit',
          icon: 'mdi-pencil',
          action() {
            this.editDialog = true
            this.editTaskTitle = this.currentTask.title
          }
        },
        {
          title: 'Due Date',
          icon: 'mdi-calendar',
          action() {
            this.datePickerDialog = true
            this.picker = this.currentTask.due_date
          }
        },
        {
          title: 'Delete',
          icon: 'mdi-delete',
          action() {
            this.deleteDialog = true
          }
        },
        {
          title: 'Sort',
          icon: 'mdi-reorder-horizontal',
          action() {
            console.log('sort')
          }
        }
      ],
      deleteDialog: false,
      currentTask: { title: '', done: false, due_date: '' },
      editDialog: false
    }
  },
  computed: {
    ...mapState(['tasks', 'snackbar'])
  },
  created() {
    this.fetchTasks()
  },
  methods: {
    ...mapActions(['fetchTasks', 'deleteTask', 'doneTask', 'changeTaskTitle', 'changeTaskDueDate']),

    actionClick(index, id) {
      this.currentTask = this.tasks.find(task => task.id === id)
      this.moreActions[index].action.call(this)
    },
    deleteDialogConfirmclick() {
      this.deleteDialog = false
      this.deleteTask(this.currentTask.id)
    },
    editDialogConfirmclick() {
      this.editDialog = false
      this.changeTaskTitle({ id: this.currentTask.id, newTitle: this.editTaskTitle })
      this.editTaskTitle = ''
    },
    dateInput() {
      this.datePickerDialog = false
      this.changeTaskDueDate({ id: this.currentTask.id, due_date: this.picker })
      this.picker = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)
      this.$store.commit('SHOW_SNACKBAR', 'Due date updated!')
    }
  }
}
</script>

<style lang="scss" scoped>
.no-task {
  margin-top: 25%;
  text-align: center;
}

.text-break-keep-all {
  word-break: keep-all;
}

.due-date {
  text-align: right;
}
</style>
