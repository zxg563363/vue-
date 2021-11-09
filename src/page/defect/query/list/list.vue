<template>
  <div>
    <Breadcrumb v-bind:breadcrumbList="breadcrumbList"></Breadcrumb>
    <br />
    <div class="ime">
      <el-button
        size="small"
        v-for="(item, i) in imeData"
        :key="i"
        :class="imeId == item.id ? 'active' : ''"
        @click="changeime(item)"
        >{{ item.value }}</el-button
      >
      <span style="float: right;">
        <el-input
          type="text"
          v-model="searchData"
          size="small"
          placeholder="请输入"
        ></el-input>
        <el-button @click="defectSearch" type="primary" size="small"
          >搜索</el-button
        >
        <el-button @click="defectReset" size="small">重置</el-button>
      </span>
    </div>
    <br />
    <p>
      <el-button type="primary" @click="openClick">
        <i class="el-icon-plus"></i>
        新建缺陷
      </el-button>
    </p>

    <br />
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="title" label="缺陷标题" show-overflow-tooltip>
      </el-table-column>

      <el-table-column prop="equipCode" label="设备编码" show-overflow-tooltip>
      </el-table-column>

      <el-table-column prop="equipName" label="设备名字" show-overflow-tooltip>
      </el-table-column>

      <el-table-column prop="status" label="缺陷状态" show-overflow-tooltip>
        <template slot-scope="scope">
          <defect-status :status="scope.row.status"></defect-status>
        </template>
      </el-table-column>

      <el-table-column prop="type" label="缺陷类型" show-overflow-tooltip>
        <template slot-scope="scope">
          <defect-Type :status="scope.row.type"></defect-Type>
        </template>
      </el-table-column>

      <el-table-column prop="remark" label="缺陷解决备注" show-overflow-tooltip>
      </el-table-column>

      <el-table-column label="操作" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button type="text" @click="viewClick(scope.row)"
            >查看附件</el-button
          >

          <el-button
            type="text"
            v-if="scope.row.status === 0"
            @click="editClick(scope.row)"
            >编辑</el-button
          >
          <el-button type="text" v-else disabled>编辑</el-button>

          <el-button type="text" @click="deleteClick(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <div class="paging">
      <el-pagination
        background
        layout="total, prev, pager, next, sizes"
        :total="totaldata"
        @current-change="handleCurrent"
        @size-change="handleSizeChange"
        :current-page.sync="page"
      >
      </el-pagination>
    </div>

    <el-dialog
      title="附件"
      :visible.sync="centerDialogVisible"
      width="40"
      @open="viewPicture"
      center
    >
      <viewer :images="srcList" class="inline">
        <img class="viewimg" v-for="src in srcList" :src="src" :key="src" />
      </viewer>

      <video
        class="viewimg inline"
        v-for="src in srcListVideo"
        :src="src"
        :key="src"
        controls
        autoplay
      >
        <source src="movie.ogg" type="video/ogg" />
        <source src="movie.mp4" type="video/mp4" />
        <source src="movie.webm" type="video/webm" />
        <object data="movie.mp4" width="320" height="240">
          <embed
            class="viewimg"
            v-for="src in srcListVideo"
            :src="src"
            :key="src"
          />
        </object>
      </video>
      <div class="clear"></div>
    </el-dialog>

    <el-dialog
      :title="data.title"
      :visible.sync="viewClickVisible"
      width="760px"
      center
    >
      <el-form>
        <div class="viewClickVisible">
          <p>
            <label>缺陷标题：</label>
            <el-input style="min-width:400px" v-model="data.title" placeholder="请输入内容"></el-input>
          </p>

          <el-form-item label="缺陷设备：" prop="equipId" >
            <el-select
              @change="AddSelectDept"
              v-model="equipId"
              filterable
              clearable
              placeholder="请选择设备"
              style="min-width:400px"
            >
              <el-option
                v-for="item in equipments"
                :key="item.id"
                :label="item.equipName + '（' + item.equipCode + '）'"
                :value="item.id"
              >
                <span style="float: left">{{ item.equipName }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{
                  item.equipCode
                }}</span>
              </el-option>
            </el-select>
          </el-form-item>

          <p class="el-input">
            <label>缺陷状态：</label>
            <el-radio-group v-model="data.status">
              <el-radio :label="0">未解决</el-radio>
              <el-radio :label="1">已解决</el-radio>
            </el-radio-group>
          </p>
          <p class="el-input">
            <label>缺陷类型：</label>
            <el-radio-group v-model="data.type">
              <el-radio :label="0">生产</el-radio>
              <el-radio :label="1">机修</el-radio>
              <el-radio :label="2">电气</el-radio>
            </el-radio-group>
          </p>

          <p>
            <label>决解备注：</label>

            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="data.remark"
            >
            </el-input>
          </p>
          <br />
          <el-button type="primary" @click="updateClick(data)"
            >更新数据</el-button
          >
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script type="javascript" src="./index.js"></script>
<style scoped lang="less" src="./index.less"></style>
