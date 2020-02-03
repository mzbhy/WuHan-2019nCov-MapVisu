# WuHan-2019nCov-MapVisu
基于eCharts的武汉肺炎疫情地图，考虑到目前的数据来源，仅支持省市两级。

第一次写JavaScript，所以看上去很粗糙，bug也很多。

效果：http://www.lxalxy.com/eChartsMap/

## API

* [eCharts](https://www.echartsjs.com/zh/index.html)
* ~~[腾讯疫情数据接口](https://service-n9zsbooc-1252957949.gz.apigw.tencentcs.com/release/qq)~~
* [丁香园实时疫情数据接口](https://service-0gg71fu4-1252957949.gz.apigw.tencentcs.com/release/dingxiangyuan)
* [地图JSON](http://datav.aliyun.com/tools/atlas/#&lat=36.363798554158635&lng=118.76495361328125&zoom=8)

## 参考项目

* https://github.com/flute/echarts3-chinese-map-drill-down
* https://github.com/littlezong/echarts_extendsMap0302

## 更新历史

### 2020.01.31

1. 获取疫情数据，利用eCharts地图绘制，支持省市两级切换
2. 部署在阿里云上

### 2020.02.03

1. 将数据接口替换为丁香园
2. 使用阿里云的GeoAtlas作为地图api，删除静态地图js文件
3. 地图与数据的匹配通过行政区划代码实现