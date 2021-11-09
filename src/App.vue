<template>
    <div id="app">
      <router-view/>
      <router-view name="extends"/>
    </div>
</template>

<script>
    export default {
        name: 'App',
    }
</script>

<style>
    #app{
        color: #000;
        font-size: 16px;
    }
</style>
