<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app disable-resize-watcher>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6"> Best Todo App</v-list-item-title>
          <v-list-item-subtitle> By He Jianfeng! </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense nav>
        <v-list-item v-for="item in items" :key="item.title" :to="item.to" link>
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <template v-slot:append>
        <div class="pa-2 mb-16">
          <v-btn block @click="logout">
            {{ $t("logout") }}
            <v-icon class="pl-3">mdi-logout</v-icon>
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>{{ $t("appTitle") }}</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn icon @click="$store.commit('SWITCH_SEARCH_MODEL')">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <v-btn icon @click="switchLang">
        <v-icon>mdi-translate</v-icon>
      </v-btn>
    </v-app-bar>

    <v-container>
      <router-view></router-view>
    </v-container>
  </v-app>
</template>

<script>

export default {
  name: 'Main',
  data() {
    return {
      items: [
        { title: this.$t('todo'), icon: 'mdi-format-list-checks', to: '/' },
        { title: this.$t('group'), icon: 'mdi-tag-multiple', to: '/group' },
        { title: this.$t('about'), icon: 'mdi-help-box', to: '/about' }
      ],
      drawer: null
    }
  },
  methods: {
    logout() {
      sessionStorage.token = ''
      this.$router.push('/login')
    },
    switchLang() {
      const lang = this.$i18n.locale
      this.$i18n.locale = lang === 'zh' ? 'en' : 'zh'
      localStorage.setItem('lang', this.$i18n.locale)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
