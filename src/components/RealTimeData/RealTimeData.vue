<template>
  <el-row>
    <el-col :span="24">
      <collector0001 v-if="externalTypeCode=='0001'"
                     :uuid="uuid"
                     :mqtt-data.sync="mqttData"
                     :collector-id.sync="collectorId"></collector0001>

      <collector0002 v-if="externalTypeCode=='0002'"
                     :uuid="uuid"
                     :mqtt-data.sync="mqttData"
                     :collector-id.sync="collectorId"></collector0002>

      <collector0003 v-if="externalTypeCode=='0003'"
                     :uuid="uuid"
                     :mqtt-data.sync="mqttData"
                     :collector-id.sync="collectorId"></collector0003>

      <collector0004 v-if="externalTypeCode=='0004'"
                     :uuid="uuid"
                     :mqtt-data.sync="mqttData"
                     :collector-id.sync="collectorId"></collector0004>

      <collector0005 v-if="externalTypeCode=='0005'"
                     :uuid="uuid"
                     :mqtt-data.sync="mqttData"
                     :collector-id.sync="collectorId"></collector0005>

      <collector0006 v-if="externalTypeCode=='0006'"
                     :uuid="uuid"
                     :mqtt-data.sync="mqttData"
                     :collector-id.sync="collectorId"></collector0006>

      <collector0007 v-if="externalTypeCode=='0007'"
                     :uuid="uuid"
                     :mqtt-data.sync="mqttData"
                     :collector-id.sync="collectorId"></collector0007>

      <collector0009 v-if="externalTypeCode=='0009'"
                     :uuid="uuid"
                     :mqtt-data.sync="mqttData"
                     :collector-id.sync="collectorId"></collector0009>
    </el-col>
  </el-row>

</template>
<script type="javascript" src="./index.js"></script>
<style scoped lang="less" src="./index.less"></style>
