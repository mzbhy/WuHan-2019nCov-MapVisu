//地图容器
var chart = echarts.init(document.getElementById('main'));
//34个省、市、自治区的名字拼音映射数组
var provinces = {
	//23个省
	"台湾": "taiwan",
	"河北": "hebei",
	"山西": "shanxi",
	"辽宁": "liaoning",
	"吉林": "jilin",
	"黑龙江": "heilongjiang",
	"江苏": "jiangsu",
	"浙江": "zhejiang",
	"安徽": "anhui",
	"福建": "fujian",
	"江西": "jiangxi",
	"山东": "shandong",
	"河南": "henan",
	"湖北": "hubei",
	"湖南": "hunan",
	"广东": "guangdong",
	"海南": "hainan",
	"四川": "sichuan",
	"贵州": "guizhou",
	"云南": "yunnan",
	"陕西": "shanxi1",
	"甘肃": "gansu",
	"青海": "qinghai",
	//5个自治区
	"新疆": "xinjiang",
	"广西": "guangxi",
	"内蒙古": "neimenggu",
	"宁夏": "ningxia",
	"西藏": "xizang",
	//4个直辖市
	"北京": "beijing",
	"天津": "tianjin",
	"上海": "shanghai",
	"重庆": "chongqing",
	//2个特别行政区
	"香港": "xianggang",
	"澳门": "aomen"
};

//直辖市和特别行政区-只有二级地图，没有三级地图
var special = ["北京","天津","上海","重庆","香港","澳门"];
var mapdata = [];

var pos = {
	leftPlus: 115,
	leftCur: 150,
	left: 200,
	top: 50
};
var line = [[0, 0], [8, 11], [0, 22]];
var style = {
	font: '18px "Microsoft YaHei", sans-serif',
	textColor: '#eee',
	lineColor: 'rgba(147, 235, 248, .8)'
};

var cityNumber = [];
var provinceNumber = [];
var totalNumber = {};

//绘制全国地图
$.getJSON('static/map/china.json', function(data){
	$.ajax({
	url: "https://service-n9zsbooc-1252957949.gz.apigw.tencentcs.com/release/qq", //json文件位置
	type: "GET", //请求方式为get
	async: false, //同步
	dataType: "json", //返回数据格式为json
	success: function(data1) { //请求成功完成后要执行的方法 
		//each循环 使用$.each方法遍历返回的数据date
		$.each(data1.data, function(i, item) {
			if (i == 'wuwei_ww_area_counts') {
				for (var num = item.length - 1; num >= 0; num--) {
					if (item[num].country == "中国") {
						cityNumber.push({
							province:item[num].area,
							city:item[num].city,
							confirm:item[num].confirm
						})
						var provFind = provinceNumber.find(prov=>prov.province == item[num].area);
						if (provFind == undefined) {
							provinceNumber.push({
								province:item[num].area,
								confirm:item[num].confirm
							})
						}
						else {
							provFind.confirm += item[num].confirm;
						}
					}	
				}
				console.log(cityNumber);
				console.log(provinceNumber);
			}
			else if (i == 'wuwei_ww_cn_day_counts') {
				totalNumber.confirmCount = item[item.length - 1].confirm;
				totalNumber.suspectCount = item[item.length - 1].suspect;
				totalNumber.deadCount = item[item.length - 1].dead;
				totalNumber.cure = item[item.length - 1].heal;
				//totalNumber.updateTime = item[item.length - 1].updateTime;
				console.log(totalNumber);
			}
		})
	}
	})

	d = [];
	for( var i=0;i<data.features.length;i++ ){
		var provName = data.features[i].properties.name;
		var provFind = provinceNumber.find(prov=>prov.province == provName);
		var confirm = provFind.confirm;
		d.push({
			name:provName,
			value:confirm
		})
	}
	mapdata = d;
	//注册地图
	echarts.registerMap('china', data);
	//绘制地图
	renderMap('china',d);
	window.onresize = chart.resize;
	bindClick();
});

function bindClick(){
	//地图点击事件
	chart.on('click', function (params) {
		//console.log( params );
		if( params.name in provinces ){
			//如果点击的是34个省、市、自治区，绘制选中地区的二级地图
			$.getJSON('static/map/province/'+ provinces[params.name] +'.json', function(data){
				echarts.registerMap( params.name, data);
				var d = [];
				for( var i=0;i<data.features.length;i++ ){
					var cityName = data.features[i].properties.name;
					if (params.name == '重庆') {
						if (cityName == '石柱土家族自治县') {
							cityName = '石柱县'
						}
						else if (cityName == '秀山土家族苗族自治县') {
							cityName = '秀山县'
						}
						else if (cityName == '开县') {
							cityName = '开州区'
						}
						else if (cityName == '梁平县') {
							cityName = '梁平区'
						}
					}
					else if (cityName == '大兴安岭地区') {
						cityName = '大兴安岭'
					}
					else if (cityName == '浦东新区') {
						cityName = '浦东'
					}
					else if (cityName == '恩施土家族苗族自治州') {
						cityName = '恩施州'
					}
					else if (cityName[cityName.length-1]=='市') {
						cityName=cityName.substring(0,cityName.length-1)
					}
					else if (cityName[cityName.length-1]=='区') {
						cityName=cityName.substring(0,cityName.length-1)
					}
					else if (cityName[cityName.length-1]=='县') {
						cityName=cityName.substring(0,cityName.length-1)
					}
					else if (cityName.substring(cityName.length-2, cityName.length-1)=='地区') {
						cityName=cityName.substring(0,cityName.length-2)
					}
					console.log(cityName);
					var cityFind = cityNumber.find(city=>city.city == cityName);
					var confirm = 0;
					if (cityFind != undefined)
						confirm = cityFind.confirm;
					d.push({
						name:data.features[i].properties.name,
						value:confirm
					})
				}
				renderMap(params.name,d);
			});
		}else if( params.seriesName in provinces ){
			//如果是【直辖市/特别行政区】只有二级下钻
			//if(  special.indexOf( params.seriesName ) >=0  ){
			//	renderMap('china',mapdata);
			// }else{
			//  //显示县级地图
			//  $.getJSON('static/map/city/'+ cityMap[params.name] +'.json', function(data){
			//      echarts.registerMap( params.name, data);
			//      var d = [];
			//      for( var i=0;i<data.features.length;i++ ){
			//          d.push({
			//              name:data.features[i].properties.name
			//          })
			//      }
			//      renderMap(params.name,d);
			//  }); 
			// }    
		}else{
			renderMap('china',mapdata);
		}
	});
}

//初始化绘制全国地图配置
var option = {
	backgroundColor: '#154e90',
	title : {
		text: '全国疫情地图',
		show: false,
		top:15
	},
	tooltip: {
		trigger: 'item',
		//formatter: '{b}',
		formatter(params) {
        	var provName = params.name;
			var provFind = provinceNumber.find(prov=>prov.province == provName);
			var confirm = provFind.confirm;
        	return `${params.name}
        			确诊人数：${confirm}`;
			// return `
			// 	直接访问：${item.data.value}
			// 	所需天数：${item.data.day}
			// 	`;
		}
	},
	visualMap: {
		min: 0,
		splitNumber: 6,
		pieces: [
			{min: 1000}, // 不指定 max，表示 max 为无限大（Infinity）。
			{min: 500, max: 1000},
			{min: 100, max: 499},
			{min: 10, max: 99},
			{min: 1, max: 9},
			{max: 0}
		],
		color: ['#d94e5d','#eac736','#50a3ba'],
		textStyle: {
			color: '#fff'
		}
	},
	// animationDuration:1000,
	// animationEasing:'cubicOut',
	// animationDurationUpdate:1000

};
function renderMap(map,data){
	console.log(data);
	var isLabelShow = false;
	var pieces =  [
			{min: 50}, // 不指定 max，表示 max 为无限大（Infinity）。
			{min: 30, max: 49},
			{min: 20, max: 29},
			{min: 10, max: 19},
			{min: 1, max: 9},
			{max: 0}
		]
	var tooltip = {
		trigger: 'item',
		formatter(params) {
			var cityName = params.name;
			console.log(cityName)
			if (params.seriesName == '重庆') {
				if (cityName == '石柱土家族自治县') {
					cityName = '石柱县'
				}
				else if (cityName == '秀山土家族苗族自治县') {
					cityName = '秀山县'
				}
				else if (cityName == '开县') {
					cityName = '开州区'
				}
				else if (cityName == '梁平县') {
					cityName = '梁平区'
				}
			}
			else if (cityName == '大兴安岭地区') {
				cityName = '大兴安岭'
			}
			else if (cityName == '浦东新区') {
				cityName = '浦东'
			}
			else if (cityName == '恩施土家族苗族自治州') {
				cityName = '恩施州'
			}
			else if (cityName[cityName.length-1]=='市') {
				cityName=cityName.substring(0,cityName.length-1)
			}
			else if (cityName[cityName.length-1]=='区') {
				cityName=cityName.substring(0,cityName.length-1)
			}
			else if (cityName[cityName.length-1]=='县') {
				cityName=cityName.substring(0,cityName.length-1)
			}
			else if (cityName.substring(cityName.length-2, cityName.length-1)=='地区') {
				cityName=cityName.substring(0,cityName.length-2)
			}
			var cityFind = cityNumber.find(city=>city.city == cityName);
			var confirm = 0;
			if (cityFind != undefined)
				confirm = cityFind.confirm;
			
        	return `${params.name}
        			确诊人数：${confirm}`;
		}
	}
	if (map == 'china') {
		isLabelShow = true;
		pieces = [
			{min: 1000}, // 不指定 max，表示 max 为无限大（Infinity）。
			{min: 500, max: 1000},
			{min: 100, max: 499},
			{min: 10, max: 99},
			{min: 1, max: 9},
			{max: 0}
		]
		tooltip = {
		trigger: 'item',
		formatter(params) {
        	var provName = params.name;
			var provFind = provinceNumber.find(prov=>prov.province == provName);
			var confirm = provFind.confirm;
        	return `${params.name}
        			确诊人数：${confirm}`;
		}
	}
	}
	option.visualMap.pieces = pieces;
	option.tooltip = tooltip;
	option.series = [ 
		{
			name: map,
			type: 'map',
			mapType: map,
			roam: false,
			nameMap:{
				'china':'中国'
			},
			label: {
				normal:{
					show:isLabelShow,
					textStyle:{
						color:'#fff',
						fontSize:13
					}  
				},
				emphasis: {
					show: true,
					textStyle:{
						color:'#fff',
						fontSize:13
					}
				}
			},
			itemStyle: {
				normal: {
					borderColor: 'rgba(147, 235, 248, 1)',
					borderWidth: 1,
					areaColor: {
						type: 'radial',
						x: 0.5,
						y: 0.5,
						r: 0.8,
						colorStops: [{
							offset: 0, 
							color: 'rgba(147, 235, 248, 0)' // 0% 处的颜色
						}, {
							offset: 1, 
							color: 'rgba(147, 235, 248, .2)' // 100% 处的颜色
						}],
						globalCoord: false // 缺省为 false
					},
					shadowColor: 'rgba(128, 217, 248, 1)',
					// shadowColor: 'rgba(255, 255, 255, 1)',
					shadowOffsetX: -2,
					shadowOffsetY: 2,
					shadowBlur: 10
				},
				emphasis: {
					areaColor: '#139DEE',
					borderWidth: 0
				}
			},
			data:data
		}
	];
	option.graphic = [
		{
			type: 'group',
			left: 198,
			top: pos.top - 4,
			children: [{
				type: 'line',
				left: 0,
				top: -20,
				shape: {
					x1: 0,
					y1: 0,
					x2: 60,
					y2: 0
				},
				style: {
					stroke: style.lineColor,
				}
			}, {
				type: 'line',
				left: 0,
				top: 20,
				shape: {
					x1: 0,
					y1: 0,
					x2: 60,
					y2: 0
				},
				style: {
					stroke: style.lineColor,
				}
			}]
		}, 
		{
			type: 'group',
			left: 200,
			top: pos.top,
			children: [{
				type: 'polyline',
				left: 90,
				top: -12,
				shape: {
					points: line
				},
				style: {
					stroke: 'transparent',
					key: name[0]
				}
			}, {
				type: 'text',
				left: 0,
				top: 'middle',
				style: {
					text: '全国',
					textAlign: 'center',
					fill: style.textColor,
					font: style.font
				}
			}, {
				type: 'text',
				left: 0,
				top: 10,
				style: {
					text: 'CHINA',
					textAlign: 'center',
					fill: style.textColor,
					font: '12px "Microsoft YaHei", sans-serif',
				}
			}
			, {
				type: 'text',
				left: 0,
				top: 30,
				style: {
					text: '确诊病例：' + totalNumber.confirmCount,
					textAlign: 'center',
					fill: style.textColor,
					font: '12px "Microsoft YaHei", sans-serif',
				}
			}, {
				type: 'text',
				left: 0,
				top: 45,
				style: {
					text: '疑似病例：' + totalNumber.suspectCount,
					textAlign: 'center',
					fill: style.textColor,
					font: '12px "Microsoft YaHei", sans-serif',
				}
			}, {
				type: 'text',
				left: 0,
				top: 60,
				style: {
					text: '治愈病例：'  + totalNumber.cure,
					textAlign: 'center',
					fill: style.textColor,
					font: '12px "Microsoft YaHei", sans-serif',
				}
			}, {
				type: 'text',
				left: 0,
				top: 75,
				style: {
					text: '死亡病例：'  + totalNumber.deadCount,
					textAlign: 'center',
					fill: style.textColor,
					font: '12px "Microsoft YaHei", sans-serif',
				}
			}
			// , {
			// 	type: 'text',
			// 	left: 0,
			// 	top: 90,
			// 	style: {
			// 		text: '更新时间：'  + totalNumber.updateTime,
			// 		textAlign: 'center',
			// 		fill: style.textColor,
			// 		font: '12px "Microsoft YaHei", sans-serif',
			// 	}
			// }
			]
		}
	];
	//渲染地图
	// chart.dispose();/*返回省级视图时销毁实例时清除返回按钮*/
	// chart = echarts.init(document.getElementById('main'));
	chart.setOption(option);
	// window.onresize = chart.resize;
	// bindClick();
}