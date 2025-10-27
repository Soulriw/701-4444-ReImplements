<template>
  <div id="app">
    <!-- Navigation Bar -->
    <NavBar />
    
    <!-- Router View for different pages -->
    <router-view />
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue'

export default {
  name: 'App',
  components: {
    NavBar
  },
  errorCaptured(err, instance, info) {
    console.error('App error:', err, info)
    // Return true to stop propagation and show error UI
    return true
  }
}
</script>

<style>
#app {
  font-family: 'Irish Grover', cursive;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 0;
  padding: 0;
  background-color: #0a0a0a;
  color: #ffffff;
}
</style>

