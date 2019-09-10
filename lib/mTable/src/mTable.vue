<template>
  <div class="mContainer" :class="{mContainerLoading: loading}">
    <a-spin v-if="loading" class="spin" />
    <div
      class="mFixedContainer"
      :class="{mFixedContainerShadow:isScrollLeft}"
      v-if="fixedLeftColumns.length>0"
    >
      <div ref="mFixedHeaderContainer" class="mFixedHeaderContainer">
        <table class="mFixedHeader" :style="{width: fixedWidth+'px'}">
          <thead>
            <tr>
              <th
                v-for="(item, index) in fixedLeftColumns"
                :key="index"
                :style="{width:item.width+'px', textAlign: item.align}"
              >
                <div>{{item.title}}</div>
              </th>
            </tr>
          </thead>
        </table>
      </div>
      <div
        ref="mFixedContentContainer"
        class="mFixedContentContainer"
        @scroll="handleScrollContentFixed"
      >
        <table class="mFixedContent oddEvenRows" :style="{width: fixedWidth+'px'}">
          <tbody>
            <tr v-for="(item, index) in dataSource" :key="index">
              <td
                v-for="(element, cIndex) in fixedLeftColumns"
                :key="cIndex"
                :style="{width:element.width+'px', textAlign: element.align}"
              >
                <span
                  v-if="item[element.dataIndex]!='undefined'&&!element.scopedSlots"
                  :title="item[element.dataIndex]"
                >{{item[element.dataIndex]}}</span>
                <span v-else-if="item[element.dataIndex]!='undefined'&&element.scopedSlots">
                  <slot
                    :name="element.scopedSlots.customRender"
                    :text="item[element.dataIndex]"
                    :record="item"
                    :index="index"
                  ></slot>
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="mTableContainer">
      <div ref="mTableHeaderContainer" class="mTableHeaderContainer" @scroll="handleScrollHeader">
        <table class="mTableHeader" :style="{width: scroll.x+'px'}">
          <thead>
            <tr>
              <th
                v-for="(item, index) in columns"
                :key="index"
                :style="{width:item.width+'px', textAlign: item.align}"
              >
                <div>{{item.title}}</div>
              </th>
            </tr>
          </thead>
        </table>
      </div>
      <div class="m-table-placeholder" v-if="!dataSource.length">{{loading? "" : "No Data"}}</div>
      <div
        ref="mTableContentContainer"
        class="mTableContentContainer"
        @scroll="handleScrollContent"
        v-if="dataSource.length"
      >
        <table class="mTableContent oddEvenRows" :style="{width: scroll.x+'px'}">
          <tbody>
            <tr v-for="(item, index) in dataSource" :key="index">
              <td
                v-for="(element, cIndex) in columns"
                :key="cIndex"
                :style="{width:element.width+'px', textAlign: element.align}"
              >
                <span
                  v-if="item[element.dataIndex]!='undefined'&&!element.scopedSlots"
                  :title="item[element.dataIndex]"
                >{{item[element.dataIndex]}}</span>
                <span v-else-if="item[element.dataIndex]!='undefined'&&element.scopedSlots">
                  <slot
                    :name="element.scopedSlots.customRender"
                    :text="item[element.dataIndex]"
                    :record="item"
                    :index="index"
                  ></slot>
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="mPagination" v-if="showPagination&&dataSource&&dataSource.length">{{totalInfo}}</div>
  </div>
</template>
<script>
import { spin } from "ant-design-vue";
export default {
  name: "mTable",
  data() {
    return {
      fixedWidth: 0,
      fixedLeftColumns: [],
      isScrollLeft: 0,
      totalInfo: ""
    };
  },
  props: ["columns", "dataSource", "scroll", "loading", "showPagination"],
  created() {
    this.getFixedWith();
    this.getFixedLeftColums();
  },
  watch: {
    dataSource() {
      this.totalInfo =
        this.dataSource.length < 2000
          ? this.dataSource.length == 1
            ? `total ${this.dataSource.length} row`
            : `total ${this.dataSource.length} rows`
          : "only 2000 rows are displayed, export for more records";
    }
  },
  methods: {
    getFixedWith() {
      this.fixedWidth = 0;
      for (let i = 0; i < this.columns.length; i++) {
        if (this.columns[i].fixed) {
          if (this.columns[i].fixed.toUpperCase() == "LEFT") {
            this.fixedWidth += this.columns[i].width;
          }
        }
      }
    },
    getFixedLeftColums() {
      this.fixedLeftColumns.splice(0);
      for (let i = 0; i < this.columns.length; i++) {
        if (this.columns[i].fixed) {
          if (this.columns[i].fixed.toUpperCase() == "LEFT") {
            this.fixedLeftColumns.push(this.columns[i]);
          }
        }
      }
    },
    handleScrollHeader(e) {
      this.$refs.mTableContentContainer.scrollLeft = e.path[0].scrollLeft;
      this.isScrollLeft = e.path[0].scrollLeft;
    },
    handleScrollContent(e) {
      this.$refs.mTableHeaderContainer.scrollLeft = e.path[0].scrollLeft;
      this.$refs.mFixedContentContainer.scrollTop = e.path[0].scrollTop;
      this.isScrollLeft = e.path[0].scrollLeft;
    },
    handleScrollContentFixed(e) {
      this.$refs.mTableContentContainer.scrollTop = e.path[0].scrollTop;
    }
  }
};
</script>

<style lang="less">
.mContainer {
  position: static;
  width: inherit;
}
.mTableContainer {
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  width: inherit;
  .mTableHeaderContainer {
    overflow: scroll;
    .mTableHeader {
      border-bottom: 1px solid #e8e8e8;
      opacity: 1;
      background: #ffffff;
      tr {
        th {
          height: inherit;
          padding: 8px 8px;
          &:last-child {
            border-right: none;
          }
        }
      }
    }
  }
  .mTableContentContainer {
    max-height: 450px;
    overflow: scroll;
    .mTableContent {
      border-left: none;
      tr {
        border-bottom: 1px solid #e8e8e8;
        &:last-child {
          border-bottom: none;
        }
        td {
          padding: 8px 8px;
        }
      }
    }
  }
}
.mFixedContainerShadow {
  box-shadow: 6px 0px 5px -5px #e8e8e8;
  border-right: 1px solid #e8e8e8;
}
.mFixedContainer {
  border: 1px solid #e8e8e8;
  border-right: none;
  border-bottom: none;
  border-radius: 4px 0 0 0;
  position: absolute;
  z-index: 99;
  opacity: 1;
  .mFixedHeaderContainer {
    overflow: scroll;
    .mFixedHeader {
      border-bottom: 1px solid #e8e8e8;
      opacity: 1;
      background: #ffffff;
      tr {
        th {
          height: inherit;
          padding: 8px 8px;
          &:last-child {
            border-right: none;
          }
        }
      }
    }
  }
  .mFixedContentContainer {
    max-height: 442px;
    overflow: scroll;
    .mFixedContent {
      opacity: 1;
      tr {
        border-bottom: 1px solid #e8e8e8;
        border-left: none;
        &:last-child {
          border-bottom: none;
        }
        td {
          padding: 8px 8px;
        }
      }
    }
  }
}
.mContainer td {
  max-width: 1px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.m-table-placeholder {
  position: relative;
  padding: 16px 16px;
  background: #fff;
  text-align: center;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
  z-index: 1;
}
.mContainerLoading {
  background: #ffffff;
  opacity: 0.5;
  text-align: center;
}
.spin {
  position: absolute !important;
  padding-top: 50px !important;
  z-index: 10;
}
.mPagination {
  text-align: right;
}
.mTableHeaderContainer::-webkit-scrollbar {
  height: 0px;
}

.mTableHeaderContainer::-webkit-scrollbar-thumb {
  border-radius: 0px;
  -box-shadow: inset 0 0 0px white;
  background: white;
}

.mTableHeaderContainer::-webkit-scrollbar-track {
  -box-shadow: inset 0 0 0px transparent;
  border-radius: 0;
  background: transparent;
}
.mFixedHeaderContainer::-webkit-scrollbar {
  height: 0px;
  width: 0px;
}
.mFixedHeaderContainer::-webkit-scrollbar-thumb {
  border-radius: 0px;
  -box-shadow: inset 0 0 0px white;
  background: white;
}

.mFixedHeaderContainer::-webkit-scrollbar-track {
  -box-shadow: inset 0 0 0px transparent;
  border-radius: 0;
  background: transparent;
}
.mFixedContentContainer::-webkit-scrollbar {
  height: 0px;
  width: 0px;
}
.mFixedContentContainer::-webkit-scrollbar-thumb {
  border-radius: 0px;
  -box-shadow: inset 0 0 0px transparent;
  background: transparent;
}
.mFixedContentContainer::-webkit-scrollbar-track {
  -box-shadow: inset 0 0 0px transparent;
  border-radius: 0;
  background: transparent;
}
</style>
