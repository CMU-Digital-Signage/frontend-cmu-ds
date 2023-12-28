<script setup lang="ts">
import { ref, defineComponent } from "vue";
import store from "@/store";
import router from "@/router";
import { getUserInfo, signOut } from "@/services";

const mockDevice = [
  {
    MACaddress: "b8:27:eb:4f:e1:9e",
    deviceName: "cpe01",
    room: 512,
    description: "string",
  },
  {
    MACaddress: "b8:f7:eb:4f:e1:ae",
    deviceName: "cpe02",
    room: 516,
    description: "string",
  },
];
</script>

<template>
  <div class="rectangle5">
    <DataTable
      scrollDirection="vertical"
      scrollable
      scrollHeight="calc(100vh - 200px)"
      class="font-sf-pro"
      :value="mockDevice"
    >
      <Column
        field="deviceName"
        header="Device Name"
        sortable
        headerStyle="font-bold"
      ></Column>
      <Column
        field="room"
        header="Room"
        sortable
        headerStyle="font-bold"
      ></Column>
      <Column :exportable="false">
        <template #body="rowData">
          <div class="">
            
            <Button
              icon="pi pi-pencil"
              rounded
              class="w-9 h-9"
              severity="warning"
            />
            <Button
              icon="pi pi-trash"
              rounded
              class="w-9 h-9 mx-3"
              severity="danger"

              v-if="rowData.column"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style>
.rectangle5 {
  background-color: #b2c19600; /* Adjust the background color as needed */
  padding-bottom: 2rem;

}
</style>
