<template>
  <div class="about pa-6">
    <h1>Main Feature</h1>

    <ul class="pl-1">
      <li class="task-list-item">
        <input type="checkbox" disabled checked /> Add Task
      </li>
      <li class="task-list-item">
        <input type="checkbox" disabled checked /> Done Task
      </li>
      <li class="task-list-item">
        <input type="checkbox" disabled checked /> Edit Task
      </li>
      <li class="task-list-item">
        <input type="checkbox" disabled checked /> Delete Task
      </li>
      <li class="task-list-item">
        <input type="checkbox" disabled checked /> Set Due Date
      </li>
      <li class="task-list-item">
        <input type="checkbox" disabled checked /> Remove Due Date
      </li>
      <li class="task-list-item">
        <input type="checkbox" disabled checked /> Local Database Persistence
      </li>
      <li class="task-list-item">
        <input type="checkbox" disabled /> Remote MongoDB
      </li>
      <li class="task-list-item">
        <input type="checkbox" disabled /> Search Task
      </li>
      <li class="task-list-item"><input type="checkbox" disabled /> i18n</li>
      <li class="task-list-item">
        <input type="checkbox" disabled /> Task by projects
      </li>
      <li class="task-list-item">
        <input type="checkbox" disabled /> Login Page
      </li>
      <li class="task-list-item"><input type="checkbox" disabled /> JWT</li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.task-list-item {
  list-style-type: none;
  padding-top: 10px;
}

input {
  margin-right: 8px;
}
</style>
