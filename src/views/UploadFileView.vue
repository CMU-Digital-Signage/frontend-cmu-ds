<template>
    <div class="p-5">
      <TabView class="rectangle flex flex-col">
        <TabPanel header="Normal File">
          <Admin />
        </TabPanel>
        <TabPanel class="text-[#f00]" header="Emergency File">
          <Device />
        </TabPanel>
      </TabView>
    </div>
</template>

<script lang="ts">

export default {

}
</script>

<style>

</style>