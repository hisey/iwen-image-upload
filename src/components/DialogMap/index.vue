<template>
  <el-dialog title="地图" :visible.sync="visible" width="900px">
    <baidu-map
      class="bm-view"
      :center="center"
      :scroll-wheel-zoom="true"
      :zoom="zoom"
      @ready="handler"
      @click="getPoint"
    >
      <el-input class="seacher-input" v-model="keyword" placeholder="搜地点"></el-input>
      <bm-local-search
        class="bm-local-search"
        :keyword="keyword"
        :auto-viewport="true"
        :pageCapacity="5"
        :location="location"
        @infohtmlset="infohtmlset"
      ></bm-local-search>
      <bm-view class="map"></bm-view>
      <bm-info-window
        :position="{lng: data.lng, lat: data.lat}"
        :title="data.name"
        :show="infoWindow.show"
        @close="infoWindowClose"
        @open="infoWindowOpen"
      >
        <p v-text="infoWindow.contents"></p>
      </bm-info-window>
    </baidu-map>
    <span slot="footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="handleEnter">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  props: {
    data: {
      type: Object,
      default: {
        name: "",
        address: "", //详细地址
        addressComponents: {
          provinceName: "", //省份
          cityName: "", //城市
          districtName: "" //行政区
        },
        lng: 0, //精度
        lat: 0 //维度
      }
    }
  },
  data() {
    return {
      infoWindow: {
        show: true,
        contents: ""
      },
      visible: false,
      location: "",
      keyword: "",
      zoom: 3,
      BMap: null,
      // map: null,
      center: {
        lng: 0,
        lat: 0
      },
      address: {},
      addressComponents: {}
    };
  },
  methods: {
    infoWindowClose(e) {
      this.infoWindow.show = false;
    },
    infoWindowOpen(e) {
      this.infoWindow.show = true;
    },
    infohtmlset(e) {
      this.zoom = 12;
      this.getLocation(e.point, e.address);
    },
    addressClone(d) {
      let data = JSON.parse(JSON.stringify(d));
      this.center.lng = data.lng;
      this.center.lat = data.lat;
      this.address = data.address;
      this.addressComponents.provinceName = data.addressComponents.provinceName;
      this.addressComponents.cityName = data.addressComponents.cityName;
      this.addressComponents.districtName = data.addressComponents.districtName;
    },
    handleOpen() {
      this.addressClone(this.data);
      this.visible = true;
    },
    handleEnter() {
      let obj = {
        address: this.address,
        addressComponents: this.addressComponents,
        lng: this.center.lng,
        lat: this.center.lat
      };
      if (this.center.lng == 0 || this.center.lng == "") {
        this.$message.warning("请在地图上选择一个地点或通过搜索选择");
        return false;
      }
      // console.log(obj);
      this.$emit("success", obj);
      this.visible = false;
    },
    handler({ BMap, map }) {
      // this.map = map;
      this.BMap = BMap;
      this.infoWindow.contents = this.data.address;
      var point = new BMap.Point(this.data.lng, this.data.lat);
      map.centerAndZoom(point, 12);
      if (this.data.lng == "" || this.data.lng == 0) {
        var myCity = new BMap.LocalCity();
        myCity.get(result => {
          var cityName = result.name;
          map.setCenter(cityName);
        });
      }
    },
    getPoint(e) {
      //   console.log(e.target.getZoom());
      //点击地图获取一些信息，
      // console.log(e);
      if (!e.overlay) {
        // this.$message.warning("请选择点击一个覆盖物");
        return false;
      }
      this.zoom = e.target.getZoom();
      // this.map.clearOverlays();
      this.getLocation(e.overlay.point);
    },
    getLocation(point, address) {
      let BMap = this.BMap;
      let geocoder = new BMap.Geocoder(); //创建地址解析器的实例
      geocoder.getLocation(point, rs => {
        // console.log(rs);
        let data = {
          lng: point.lng,
          lat: point.lat,
          address: address || rs.address,
          addressComponents: {
            provinceName: rs.addressComponents.province,
            cityName: rs.addressComponents.city,
            districtName: rs.addressComponents.district
          }
        };
        this.addressClone(data);
      });
    }
  }
};
</script>
<style lang="less" scoped>
.bm-view {
  width: 100%;
  position: relative;
}
.map {
  width: 100%;
  height: 450px;
}
.bm-local-search {
  position: absolute;
  width: 300px;
  z-index: 2;
  top: 38px;
  left: 10px;
}
.seacher-input {
  top: 10px;
  width: 300px;
  position: absolute;
  z-index: 2;
  left: 10px;
}
</style>


