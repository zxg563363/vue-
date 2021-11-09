<template>
  <el-row id="apply">
    <Breadcrumb v-bind:breadcrumbList="breadcrumbList"></Breadcrumb>

    <br />
    <el-table :data="tableData" class="kong-box" size="small">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-table :data="scope.row.planDetails" class="kong-box" size="small">
            <el-table-column
              prop="spareName"
              label="备件名称"
            ></el-table-column>
            <el-table-column
              prop="spareCode"
              label="备件编号"
            ></el-table-column>
            <el-table-column
              prop="spareModel"
              label="备件型号"
            ></el-table-column>
            <el-table-column
              prop="planNum"
              label="计划补货数量"
            ></el-table-column>
            <el-table-column
              prop="shippedNum"
              label="发货数量"
            ></el-table-column>
            <el-table-column prop="price" label="单价"></el-table-column>
          </el-table>
        </template>
      </el-table-column>

      <el-table-column label="供应商" prop="supplierName"></el-table-column>
      <el-table-column
        label="分公司"
        prop="receivingPartyName"
      ></el-table-column>
      <el-table-column label="补货时间" prop="createTime"></el-table-column>
      <el-table-column
        label="备注"
        prop="supplierDescription"
      ></el-table-column>
      <el-table-column label="操作" prop="">
        <template slot-scope="scope">
          <el-button type="text" @click="apply(scope.row)">补货申请</el-button>
           <el-button type="text" @click="modify(scope.row)">修改描述</el-button>
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
        :current-page.sync="spareData.page.pageNumber"
      >
      </el-pagination>
    </div>
    <el-dialog title="添加备件" :visible.sync="dialogVisible" width="70%">
      <el-form>
        <el-form-item label="选择二级公司">
          <el-select
            v-model="spareData.receivingPartyId"
            filterable
            remote
            clearable
            placeholder="选择二级公司"
            :loading="loading"
            @change="searchBranch"
          >
            <el-option
              v-for="item in SecondaryDepartments"
              :key="item.departId"
              :label="item.departName"
              :value="item.departId"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="备注">
          <el-input
            type="textarea"
            v-model="spareData.supplierDescription"
          ></el-input>
        </el-form-item>
      </el-form>

      <el-table :data="spareData.planDetails" class="kong-box" size="small">
        <el-table-column prop="spareName" label="备件名称">
          <template slot-scope="scope">
            <span v-if="scope.row.Visible">{{ scope.row.spareName }}</span>
            <el-select
              v-else
              v-model="scope.row.spareName"
              filterable
              remote
              clearable
              placeholder="请输入供应商备件"
              :remote-method="SpareCondition"
              :loading="loading"
              @change="searchSpare"
              size="small"
            >
              <el-option
                v-for="item in spares"
                :key="item.id"
                :label="item.spareName + '（' + item.spareCode + '）'"
                :value="`${scope.$index},${item.id}`"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>

        <el-table-column prop="spareCode" label="备件编号">
          <template slot-scope="scope">
            <span v-if="scope.row.Visible">{{ scope.row.spareCode }}</span>
            <el-input
              v-else
              v-model="scope.row.spareCode"
              :disabled="!scope.row.Visible"
              size="small"
            ></el-input>
          </template>
        </el-table-column>

        <el-table-column prop="spareModel" label="备件型号">
          <template slot-scope="scope">
            <span v-if="scope.row.Visible">{{ scope.row.spareModel }}</span>
            <el-input
              v-else
              v-model="scope.row.spareModel"
              :disabled="!scope.row.Visible"
              size="small"
            ></el-input>
          </template>
        </el-table-column>

        <el-table-column prop="spareNum" label="备件数量">
          <template slot-scope="scope">
            <span v-if="scope.row.Visible">{{ scope.row.spareNum }}</span>
            <el-input
              v-else
              v-model="scope.row.spareNum"
              size="small"
            ></el-input>
          </template>
        </el-table-column>

        <el-table-column prop="planNum" label="计划补货数量">
          <template slot-scope="scope">
            <span v-if="scope.row.Visible">{{ scope.row.planNum }}</span>
            <el-input
              v-else
              v-model="scope.row.planNum"
              size="small"
            ></el-input>
          </template>
        </el-table-column>

        <el-table-column prop="shippedNum" label="发货数量">
          <template slot-scope="scope">
            <span v-if="scope.row.Visible">{{ scope.row.shippedNum }}</span>
            <el-input
              v-else
              v-model="scope.row.shippedNum"
              size="small"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="单价">
          <template slot-scope="scope">
            <span v-if="scope.row.Visible">{{ scope.row.price }}</span>
            <el-input v-else v-model="scope.row.price" size="small"></el-input>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="160" align="center">
          <template slot-scope="scope">
            <span
              v-if="scope.row.Visible"
              class="items"
              @click="edit(scope.row)"
              >修改</span
            >
            <span v-else class="items" size="small" @click="save(scope.row)"
              >保存</span
            >
            <span>|</span>
            <span class="items" size="small" @click="deleteit(scope.row)"
              >删除</span
            >
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取消</el-button>
        <el-button @click="addziduan" size="small">添加</el-button>
        <el-button type="primary" size="small" @click="postSupply"
          >确定</el-button
        >
      </span>
    </el-dialog>



       <el-dialog title="修改备注" :visible.sync="modifyVisible" width="70%">
      <el-form>


        <el-form-item label="备注">
          <el-input
            type="textarea"
            v-model="spareData.supplierDescription"
          ></el-input>
        </el-form-item>
      </el-form>


      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyVisible = false" size="small">取消</el-button>
        <el-button type="primary" size="small" @click="putModify"
          >确定</el-button
        >
      </span>
    </el-dialog>

    <!-- <el-form ref="form" size="small" label-width="120px">
      <el-form-item label="请选择分公司">

          <el-select
            v-model="spareData.receivingPartyId"
            filterable
            remote
            clearable
            placeholder="选择二级公司"
            :loading="loading"
            @change="searchBranch"
          >
            <el-option
              v-for="item in SecondaryDepartments"
              :key="item.departId"
              :label="item.departName"
              :value="item.departId"
            >
            </el-option>
          </el-select>

      </el-form-item>
        <el-form-item label="描述">
    <el-input type="textarea" v-model="spareData.supplierDescription"></el-input>
  </el-form-item>
    </el-form> -->

    <!--  -->
    <!-- <p style="text-align:left">
      <br />
      <el-button size="small" @click="addziduan">添加</el-button>
    </p> -->

    <p style="text-align: center">
      <br />
      <el-button type="primary" size="small" @click="openSupply">
        <i class="el-icon-check"></i>
        立即创建
      </el-button>
    </p>
  </el-row>
</template>
<script type="javascript" src="./index.js"></script>
<style scoped lang="less" src="./index.less"></style>
