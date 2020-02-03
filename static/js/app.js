//地图容器
var chart = echarts.init(document.getElementById('main'));
//34个省、市、自治区的名字拼音映射数组
var provinces = {
	//23个省
	"台湾": ["710000", "taiwan"],
	"河北": ["130000", "hebei"],
	"山西": ["140000", "shanxi"],
	"辽宁": ["210000", "liaoning"],
	"吉林": ["220000", "jilin"],
	"黑龙江": ["230000", "heilongjiang"],
	"江苏": ["320000", "jiangsu"],
	"浙江": ["330000", "zhejiang"],
	"安徽": ["340000", "anhui"],
	"福建": ["350000", "fujian"],
	"江西": ["360000", "jiangxi"],
	"山东": ["370000", "shandong"],
	"河南": ["410000", "henan"],
	"湖北": ["420000", "hubei"],
	"湖南": ["430000", "hunan"],
	"广东": ["440000", "guangdong"],
	"海南": ["460000", "hainan"],
	"四川": ["510000", "sichuan"],
	"贵州": ["520000", "guizhou"],
	"云南": ["530000", "yunnan"],
	"陕西": ["610000", "shaanxi"],
	"甘肃": ["620000", "gansu"],
	"青海": ["630000", "qinghai"],
	//5个自治区
	"新疆": ["650000", "xinjiang"],
	"广西": ["450000", "guangxi"],
	"内蒙古": ["150000", "neimenggu"],
	"宁夏": ["640000", "ningxia"],
	"西藏": ["540000", "xizang"],
	//4个直辖市
	"北京": ["110000", "beijing"],
	"天津": ["120000", "tianjin"],
	"上海": ["310000", "shanghai"],
	"重庆": ["500000", "chongqing"],
	//2个特别行政区
	"香港": ["810000", "xianggang"],
	"澳门": ["820000", "aomen"]
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

var graphic = [
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
				font: '16px "Microsoft YaHei", sans-serif',
			}
		}],
		onclick: function(){
			renderMap('china',mapdata);
		}
	},
	{
		type: 'group',
		left: 200,
		top: pos.top + 50,
		silent: true,
		children: [{
			type: 'text',
			left: 0,
			top: 30,
			style: {
				text: '确诊病例：' + totalNumber.confirmCount,
				textAlign: 'center',
				fill: style.textColor,
				font: '16px "Microsoft YaHei", sans-serif',
			}
		}, {
			type: 'text',
			left: 0,
			top: 50,
			style: {
				text: '疑似病例：' + totalNumber.suspectCount,

				textAlign: 'center',
				fill: style.textColor,
				font: '16px "Microsoft YaHei", sans-serif',
			}
		}, {
			type: 'text',
			left: 0,
			top: 70,
			style: {
				text: '治愈病例：'  + totalNumber.cure,
				textAlign: 'center',
				fill: style.textColor,
				font: '16px "Microsoft YaHei", sans-serif',
			}
		}, {
			type: 'text',
			left: 0,
			top: 90,
			style: {
				text: '死亡病例：'  + totalNumber.deadCount,
				textAlign: 'center',
				fill: style.textColor,
				font: '16px "Microsoft YaHei", sans-serif',
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

//绘制全国地图
$.getJSON('static/map/china.json', function(data){
	$.ajax({
	url: "https://service-0gg71fu4-1252957949.gz.apigw.tencentcs.com/release/dingxiangyuan", //json文件位置
	type: "GET", //请求方式为get
	async: false, //同步
	dataType: "json", //返回数据格式为json
	success: function(data1) { //请求成功完成后要执行的方法 
		//each循环 使用$.each方法遍历返回的数据date
		$.each(data1.data, function(i, item) {
			if (i == 'getAreaStat') {
				for (var num = item.length - 1; num >= 0; num--) {
					provinceNumber.push({
						province:item[num].provinceShortName,
						confirm:item[num].confirmedCount,
						suspect:item[num].suspectedCount,
						dead:item[num].deadCount,
						heal:item[num].curedCount
					})
					for (var cityNum = item[num].cities.length - 1; cityNum >= 0; cityNum--) {
						cityNumber.push({
							province:item[num].provinceShortName,
							city:item[num].cities[cityNum].cityName,
							confirm:item[num].cities[cityNum].confirmedCount,
							suspect:item[num].cities[cityNum].suspectedCount,
							dead:item[num].cities[cityNum].deadCount,
							heal:item[num].cities[cityNum].curedCount,
							cityId:item[num].cities[cityNum].locationId
						})
					}
				}
				// console.log(cityNumber);
				// console.log(provinceNumber);
			}
			else if (i == 'getStatisticsService') {
				totalNumber.confirmCount = item.confirmedCount;
				totalNumber.suspectCount = item.suspectedCount;
				totalNumber.deadCount = item.deadCount;
				totalNumber.cure = item.curedCount;
				//totalNumber.updateTime = item[item.length - 1].updateTime;
				//console.log(totalNumber);
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

function zoomAnimation(){
	var count = null;
	var zoom = function(per){
		if(!count) count = per;
		count = count + per;
		chart.setOption({
			geo: {
				zoom: count
			}
		});
		if(count < 1) window.requestAnimationFrame(function(){
			zoom(0.2);
		});
	};
	window.requestAnimationFrame(function(){
		zoom(0.2);
	});
}

function bindClick(){
	//地图点击事件
	chart.on('click', function (params) {
		//console.log( params );
		if( params.name in provinces ){
			//如果点击的是34个省、市、自治区，绘制选中地区的二级地图
			$.getJSON('static/map/'+ provinces[params.name][0] +'_geojson_full.json', function(data){
				echarts.registerMap( params.name, data);
				var d = [];
				for( var i=0;i<data.features.length;i++ ){
					var cityID = data.features[i].properties.adcode;
					//console.log(cityName);
					var cityFind = cityNumber.find(city=>city.cityId == cityID);
					var confirm = 0;
					if (cityFind != undefined) {
						confirm = cityFind.confirm;
						d.push({
							name:data.features[i].properties.name,
							value:[cityFind.cityId, confirm]
						})
					}
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
			// renderMap('china',mapdata);
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
	//console.log(data);
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
			var confirm = 0;
			var suspect = 0;
			var dead = 0;
			var heal = 0;
			if (params.data != undefined) {
				var cityId = params.data.value[0];
				var cityFind = cityNumber.find(city=>city.cityId == cityId);
			
				if (cityFind != undefined) {
					confirm = cityFind.confirm;
					suspect = cityFind.suspect;
					dead = cityFind.dead;
					heal = cityFind.heal;
				}
			}			
			return `${params.name} <br/>
					确诊病例：${confirm} <br/>
					疑似病例：${suspect} <br/>
					治愈病例：${heal} <br/>
					死亡病例：${dead}`;
		}
	}
	if (map == 'china') {
		isLabelShow = true;
		pieces = [
			{min: 1000}, // 不指定 max，表示 max 为无限大（Infinity）。
			{min: 500, max: 1000},
			{min: 300, max: 499},
			{min: 100, max: 299},
			{min: 10, max: 99},
			{min: 1, max: 9}
		]
		tooltip = {
			trigger: 'item',
			formatter(params) {
				var provName = params.name;
				var provFind = provinceNumber.find(prov=>prov.province == provName);
				if (provFind != undefined) {
					var confirm = provFind.confirm;
					var suspect = provFind.suspect;
					var dead = provFind.dead;
					var heal = provFind.heal;
					return `${params.name} <br/>
							确诊病例：${confirm} <br/>
							疑似病例：${suspect} <br/>
							治愈病例：${heal} <br/>
							死亡病例：${dead}`;	
				}
			}
		}
		if (graphic.length > 3) {
			graphic.pop(graphic[graphic.length - 1]);
		}
		graphic[0].children[0].shape.x2 = 60;
		graphic[0].children[1].shape.x2 = 60;
		graphic[2].children[0].style.text = '确诊病例：' + totalNumber.confirmCount;
		graphic[2].children[1].style.text = '疑似病例：' + totalNumber.suspectCount;
		graphic[2].children[2].style.text = '治愈病例：' + totalNumber.cure;
		graphic[2].children[3].style.text = '死亡病例：' + totalNumber.deadCount;
	}
	else {
		var breadcrumb = {
			type: 'group',
			id: name,
			left: pos.leftCur + pos.leftPlus,
			top: pos.top + 3,
			silent: true,
			children: [{
				type: 'polyline',
				left: -90,
				top: -5,
				shape: {
					points: line
				},
				style: {
					stroke: '#fff',
					key: map
				},
			}, {
				type: 'text',
				left: -68,
				top: 'middle',
				style: {
					text: map,
					textAlign: 'center',
					fill: style.textColor,
					font: style.font
				},
			}, {
				type: 'text',
				left: -68,
				top: 10,
				style: {
					name: map,
					text: provinces[map][1].toUpperCase(),
					textAlign: 'center',
					fill: style.textColor,
					font: '16px "Microsoft YaHei", sans-serif',
				},
			}]
		}
		graphic.push(breadcrumb);
		graphic[0].children[0].shape.x2 = 60 + 15 + provinces[map][1].length * 12;
		graphic[0].children[1].shape.x2 = 60 + 15 + provinces[map][1].length * 12;
		var provFind = provinceNumber.find(prov=>prov.province == map);
		if (provFind == undefined) {
			graphic[2].children[0].style.text = '确诊病例：' + totalNumber.confirmCount;
			graphic[2].children[1].style.text = '疑似病例：' + totalNumber.suspectCount;
			graphic[2].children[2].style.text = '治愈病例：' + totalNumber.cure;
			graphic[2].children[3].style.text = '死亡病例：' + totalNumber.deadCount;
		}
		else {
			graphic[2].children[0].style.text = '确诊病例：' + provFind.confirm;
			graphic[2].children[1].style.text = '疑似病例：' + provFind.suspect;
			graphic[2].children[2].style.text = '治愈病例：' + provFind.heal;
			graphic[2].children[3].style.text = '死亡病例：' + provFind.dead;
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
	option.graphic = graphic;
	//渲染地图
	// chart.dispose();/*返回省级视图时销毁实例时清除返回按钮*/
	// chart = echarts.init(document.getElementById('main'));
	chart.clear();
	chart.setOption(option);
	zoomAnimation();
	// window.onresize = chart.resize;
	// bindClick();
}