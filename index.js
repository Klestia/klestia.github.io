	
	var mapStyle=0; // variable to keep track of the current map
	var colors = ['#fff5f0', '#feddcd', '#fcb398', '#fc8666', '#f7573e', '#de2924', '#b31217', '67000d']; //map colors
	var NSTdata; 
	var layers=[];
	var layers2=[];
	var year1=0; // Selected year for the BI mainmap
	var year2=0; //Selected year for the BI, side map
    var dengueMap='mapbox://styles/klestia/cjitzbndg78u72rm9znub05b0';
	var BSMap='mapbox://styles/klestia/cjivg9o5q0txz2qkzf0ie87hy';
	var PopMap='mapbox://styles/klestia/cjivp0ctv6of92rqzgtrddqnw';
	var BIavgMap='mapbox://styles/klestia/cjiwuz2x37rdd2rnow740d6h2';
	var selectedMainMap;
	var chartColors=['#FF6384','#ffa500','#ffcc00','#00b3b3','#36A2EB','#cc3399',"#009933","#000",];
	var jarLayers=[0,1,68,122,173,241,470,907,1297];
	var pottedplantLayers=[0,1,16,43,85,129,202,370,483];
	var tireLayers=[0,1,2,4,6,9,13,20,1000];
	var vaseLayers=[0,1,3,8,13,19,29,42,65];
	var binLayers=[0,1,2,4,6,11,16,28,1000];
	var bowlLayers=[0,1,3,5,1001,1002,1003,1004,1005];
	var bucketLayers=[0,1,73,156,259,386,560,836,1095];
	var cupLayers=[0,1,13,29,51,76,101,131,198];
	var layers2011=[0,1,10,24,34,48,80,122,1000];
	var layers2012=[0,1,12,23,39,82,122,195,1000];
	var layers2013=[0,1,10,33,50,76,109,151,255];
	var layers2014=[0,1,2,8,15,25,50,81,169,1000];
	var layers2015=[0,1,4,12,21,34,42,57,72,1000];
	var layers2016=[0,1,10,17,26,37,53,73,1000];
	var layers2017=[0,1,8,24,33,51,89,107,1000];
	var layersDengueSeas=[0,1,7.5,16.42,22.5,32.5,45.83,65,1000];
	var layersEntireYear=[0,1,13.2,23,35.5,43,57.5,72,1000];
	
	
	

	//General province data
	function NST_total(results) {
        console.log('2');
        NSTdata = results; 
    }
	
	mapboxgl.accessToken = 'pk.eyJ1Ijoia2xlc3RpYSIsImEiOiJjamlsZTE2Zm0yOGJsM3dxcDZqeHd2NnZrIn0.KNRW4XdrJuHzc-cNpmnf4g';
      
	// Main map
	var mainMap = new mapboxgl.Map({
		container: document.getElementById('mainMap'), // container id
		style: 'mapbox://styles/klestia/cjivg9o5q0txz2qkzf0ie87hy' 
	});
	
	//Side map
	var sideMap = new mapboxgl.Map({
		container: document.getElementById('sideMap'), // container id
		style: 'mapbox://styles/klestia/cjivg9o5q0txz2qkzf0ie87hy' 
	});	
	
	mainMap.getCanvas().style.cursor = 'default';
	sideMap.getCanvas().style.cursor = 'default';
	  
    //Breeging sites per subdistrict chart variable
	var config = {
		type: 'doughnut',
		data: {
			datasets: [{
				data: [],
				backgroundColor: [],
			}],
			labels: [],
			},
		options: {
			responsive: true,
			legend: {
				position: 'right',
			},
			title: {
				display: true,
				text: ''
			},
			animation: {
				animateScale: true,
				animateRotate: true
			}
		}
	};		
	var ctx = document.getElementById('chart-area').getContext('2d');
	window.myDoughnut = new Chart(ctx, config);
	
					
	mainMap.on('load', function() {	 	 
		selectedMainMap='Breeding Sites';
		layers = ['0-5', '5-10', '10-17', '17-31', '31-55', '55-86', '86-425', '425-692'];
		document.getElementById('mainMap_title').innerHTML = '<h4>Breeding sites density map/pop</h4>';
			
		for (i = 0; i < layers.length; i++) {
			var layer = layers[i];
			var color = colors[i];
			var item = document.createElement('div');
			var key = document.createElement('span');
			key.className = 'legend-key';
			key.style.backgroundColor = color;
			var value = document.createElement('span');
			value.innerHTML = layer;
			item.appendChild(key);
			item.appendChild(value);
			legend.appendChild(item);
		}
	});
		
	mainMap.on('mousemove', function(e) {
		var hoveredStateId =  null;
		var subDistrict = mainMap.queryRenderedFeatures(e.point, {
			layers: ['maptotal']
		});	
			fillOverlay(subDistrict);
	});
	
	sideMap.on('mousemove', function(e) {
		var hoveredStateId =  null;
		var subDistrict = sideMap.queryRenderedFeatures(e.point, {
			layers: ['maptotal']
		});	
	});
						
	mainMap.on('click','maptotal', function (e) {
		var subDistrict = mainMap.queryRenderedFeatures(e.point, { layers: ['maptotal'] });
		mapClick(subDistrict);
		
	});
	
	sideMap.on('click','maptotal', function (e) {
		var subDistrict = sideMap.queryRenderedFeatures(e.point, { layers: ['maptotal'] });
		mapClick(subDistrict);
		
	});
	
	//Generate Charts when subdistrict is clicked
	function mapClick(subDistrict)
	{
		
		var clsa= {};
		var barChartData=[];
		var sitesSum =0;
		if (subDistrict.length > 0) {
			config.data.labels.splice(0, 10);
			config.data.datasets.splice(0, 1);
			for (i = 0; i < NSTdata['features'].length; i++) {
				if (subDistrict[0].properties.TB_EN == NSTdata['features'][i]['properties']['TB_EN'] )
				{
					var pottedplant=0;
					var bucket=0;
					var tire=0;
					var bin=0;
					var vase=0;
					var cup=0;
					var jar=0;
					var bowl=0;
					var str;
					var sum=0;
					var chartData=[];
					var chartDataTmp=[];
					var obj = NSTdata['features'][i]['properties']['Breeding_site_classes'];
					chartLabel=['bucket','pottedplant','bin','tire','jar','cup','bowl','vase'];	
					
					
						chartDataTmp.push(obj['bucket']);
						chartDataTmp.push(obj['pottedplant']);
						chartDataTmp.push(obj['bin']);
						chartDataTmp.push(obj['tire']);
						chartDataTmp.push(obj['jar']);
						chartDataTmp.push(obj['cup']);
						chartDataTmp.push(obj['bowl']);
						chartDataTmp.push(obj['vase']);
					
						
	
							
				}
			}
			document.getElementById('Area_d').innerHTML = "<b>Selected sub-district: &nbsp</b>"+subDistrict[0].properties.TB_EN;
		}

		//find percentage of each breeding site
		function getSum(total, num) {
			return total + num;
		}
		sitesSum = chartDataTmp.reduce(getSum);
		
		for (var i=0; i<chartDataTmp.length; i++)
		{
			chartLabel[i]= ""+Math.round((chartDataTmp[i]/sitesSum)*100)+"% "+chartLabel[i]+"";
		}
		
		//Include in chart data only breeding sites types that aren't 0
		for (var i = 0; i < chartDataTmp.length; i++) {
			sum += chartDataTmp[i];
			if(chartDataTmp[i]!=0){
				chartData.push(chartDataTmp[i]);
				config.data.labels.push(chartLabel[i]);
			}
		}
		document.getElementById('BSfound').innerHTML =  '<b>Total breeding sites:</b> &nbsp'+sum+ '<br><br>';
		
					
		var newDataset = {
			backgroundColor: chartColors,
			data: chartData,
			label: 'Doughnut',
		};
		config.data.datasets.push(newDataset);
		window.myDoughnut.update();
			
		//Get the BI for each year for the subdistrict
		for (i = 0; i < NSTdata['features'].length; i++) {
			if (subDistrict[0].properties.TB_EN == NSTdata['features'][i]['properties']['TB_EN'] )
			{
				barChartData.splice(0,8);
				var BIobj = NSTdata['features'][i]['properties']['Breteau_index'];
				barChartData.push(BIobj['2011']);
				barChartData.push(BIobj['2012']);
				barChartData.push(BIobj['2013']);
				barChartData.push(BIobj['2014']);
				barChartData.push(BIobj['2015']);
				barChartData.push(BIobj['2016']);
				barChartData.push(BIobj['2017']);
			}
		}
		
		//BI barChart variable
		var configBar = {
			type: 'bar',
			data: {
				datasets: [{
					data: barChartData,
					label: 'Breteau Index',
					backgroundColor: '#36A2EB',
					borderColor: '#36A2EB',
					borderWidth: 1,
				}],
				labels: ['2011','2012','2013','2014','2015','2016','2017'],
			},
			options: {
				responsive: true,
				legend: {
					position: 'bottom',
				},
				title: {
					display: true,
					text: 'Breteau Index in the selected subdistrict'
				},
				animation: {
					animateScale: true,
					animateRotate: true
				}
			}
		};		
		var ctx = document.getElementById('barChartArea').getContext('2d');
		window.myBar = new Chart(ctx, configBar);	
	}
	
	//Change main map style depending on selection
	function toMainMap(selectedMap)
	{
		selectedMainMap=selectedMap; 
		var mainMapStyle;
		
		if(selectedMainMap=='Breeding Sites'){
			mainMapStyle=BSMap;
			layers=['0-1', '1-3', '3-5', '5-7', '7-9', '9-12', '12-17', '17-24'];
			
		}
		else if(selectedMainMap=='Dengue Cases'){
			mainMapStyle=dengueMap;
			layers=['0-4', '4-8', '8-12', '12-18', '18-25', '25-35', '35-59', '59-84'];
		}
		else if(selectedMainMap=='Population'){
			mainMapStyle=PopMap;
			layers = ['876-3969', '3969-6670', '6670-9202','9202-11891', '11891-15137', '15137-22014', '22014-34675', '34675-43327'];
				
		}
		else if(selectedMainMap=='Breteau_index Avg')
		{
			mainMapStyle=BIavgMap;
			layers = ['0-2', '2-6', '6-10', '10-15', '15-20', '20-29', '29-43', '43-57'];
		}
		
		mainMap.setStyle(mainMapStyle);
		document.getElementById('mainMap_title').innerHTML = '<h4>'+selectedMainMap+' map</h4>';
		
		addMapOverlay();
	
	}
	
	//Change side map style depending on selection
	function toSideMap(selectedSideMap)
	{
		var steps;
		var sideMapStyle;
		
		if(selectedSideMap=='Breeding Sites'){
			sideMapStyle=BSMap;
			layers2=['0-1', '1-3', '3-5', '5-7', '7-9', '9-12', '12-17', '17-24'];
			
		}
		else if(selectedSideMap=='Dengue Cases'){
			sideMapStyle=dengueMap;
			layers2=['0-4', '4-8', '8-12', '12-18', '18-25', '25-35', '35-59', '59-84'];
		}
		else if(selectedSideMap=='Population'){
			sideMapStyle=PopMap;
			layers2 = ['876-3969', '3969-6670', '6670-9202','9202-11891', '11891-15137', '15137-22014', '22014-34675', '34675-43327'];
				
		}
		else if(selectedSideMap=='Breteau_index Avg')
		{
			sideMapStyle=BIavgMap;
			layers2 = ['0-2', '2-6', '6-10', '10-15', '15-20', '20-29', '29-43', '43-57'];
		}
		
		sideMap.setStyle(sideMapStyle);
		document.getElementById('sideMap_title').innerHTML = '<h4>'+selectedSideMap+' map</h4>';
		showSideMap();
		addSideMapOverlay();
	}
	
	
	function addMapOverlay()
	{//empty current legend
		while (legend.firstChild) {
			legend.removeChild(legend.firstChild);
		}	
		for (i = 0; i < layers.length; i++) {
			var layer = layers[i];
			var color = colors[i];
			var item = document.createElement('div');
			var key = document.createElement('span');
			key.className = 'legend-key';
			key.style.backgroundColor = color;
			var value = document.createElement('span');
			value.innerHTML = layer;
			item.appendChild(key);
			item.appendChild(value);
			legend.appendChild(item);
		}
	}
	
	function addSideMapOverlay()
	{//empty current legend
		while (legend2.firstChild) {
			legend2.removeChild(legend2.firstChild);
		}	
		//add legent to map
		for (i = 0; i < layers2.length; i++) {
			var layer = layers2[i];
			var color = colors[i];
			var item = document.createElement('div');
			var key = document.createElement('span');
			key.className = 'legend2-key';
			key.style.backgroundColor = color;
			var value = document.createElement('span');
			value.innerHTML = layer;
			item.appendChild(key);
			item.appendChild(value);
			legend2.appendChild(item);
		}
	}
	var steps=[];
	var stepsBI=[];
	
	function selectYearBI(year){
		var layerBI;
		
		if (year=='2011')
		{
			layerBI=layers2011;	
			stepsBI = ['1-10','10-24','24-34','34-48','48-80','80-122'];
		}
		else if (year=='2012')
		{
			layerBI=layers2012;
			stepsBI=['1-12','12-23','23-39','39-82','82-122','122-195'];
		}
		else if (year=='2013')
		{
			layerBI=layers2013;
			stepsBI=['1-10','10-33','33-50','50-76','76-109','109-151','151-255'];
		}
		else if (year=='2014')
		{
			layerBI=layers2014;
			stepsBI=['1-2','2-8','8-15','15-25','25-50','50-81','81-169'];
		}
		if (year=='2015')
		{
			layerBI=layers2015;	
			stepsBI=['1-4','4-12','12-21','21-34','34-42','42-57','57-72'];
		}
		else if (year=='2016')
		{
			layerBI=layers2016;
			stepsBI=['1-10','10-17','17-26','17-26','26-37','37-53','53-73'];
		}
		else if (year=='2017')
		{
			layerBI=layers2017;
			stepsBI=['1-8','8-24','24-33','33-51','51-89','89-107'];
		}
		else if (year=='BI_dengue_season')
		{
			layerBI=layersDengueSeas;
			stepsBI=['1-7.5','7.5-16.4','16.4-22.5','22.5-32.5','32.5-45.8','45.8-65'];
		}
		else if (year=='BI_entire_year')
		{
			layerBI=layersEntireYear;
			stepsBI=['1-13.2','13.2-23','23-35.5','35.5-43','43-57.5','57.5-72'];
		}
		return layerBI;
	}
	
	
	
	function selectTypeBS(type){
		var layerBS;
		if (type=='bucket')
		{
			layerBS=bucketLayers;	
			steps = ['1-73','73-156','156-259','259-386','386-560','560-836','836-1095'];
		}
		else if (type=='cup')
		{
			layerBS=cupLayers;
			steps=['1-13','13-29','29-51','51-76','76-101','101-131','131-198'];
		}
		else if (type=='bowl')
		{
			layerBS=bowlLayers;
			steps=['1-3','3-5'];
		}
		else if (type=='bin')
		{
			layerBS=binLayers;
			steps=['1-2','2-4','4-6','6-11','11-16','16-28'];
		}
		if (type=='jar')
		{
			layerBS=jarLayers;	
			steps=['1-68','68-122','122-173','173-241','241-470','470-907','907-1297'];
		}
		else if (type=='pottedplant')
		{
			layerBS=pottedplantLayers;
			steps=['1-16','16-43','43-85','85-129','129-202','202-370','370-483'];
		}
		else if (type=='tire')
		{
			layerBS=tireLayers;
			steps=['1-2','2-4','4-6','6-9','9-13','13-20'];
		}
		else if (type=='vase')
		{
			layerBS=vaseLayers;
			steps=['1-3','3-8','8-13','13-19','19-29','29-42','42-65'];
		}
		
		return layerBS;
	}
	
	
	function toBSType(x)
	{
		var selectBoxBS1 = document.getElementById("selectBoxBS1");
		var selectBoxBS2 = document.getElementById("selectBoxBS2");
	    typeMain = selectBoxBS1.options[selectBoxBS1.selectedIndex].value;
		typeSide= selectBoxBS2.options[selectBoxBS2.selectedIndex].value;
		var stepsMain=[];
		var stepsSide=[];
		
		if(x==1) //Change main map
		{
			//Check if this layer already exist and remove it
			if (mainMap.getLayer("BS")) {
				mainMap.removeLayer("BS");
			}
			if (mainMap.getSource("BS")) {
				mainMap.removeSource("BS");
			}
			
			stepsMain=selectTypeBS(typeMain);
			layers=steps;
			//param for main map style
			selectedMainMap='BI20kk';
			
			mainMap.addLayer({
				id: 'BS',
				type: 'fill',
				source: {
					"type": "geojson",
					"data": NSTdata
				},
				
				'paint': {
					'fill-color': 
					[
						'interpolate',
						['linear'],
						['get',typeMain,['get','Breeding_site_classes']],
						
						stepsMain[0], '#e1e1df',
						stepsMain[1], '#fff5f0',
						stepsMain[2], '#feddcd',
						stepsMain[3], '#fcb398',
						stepsMain[4], '#fc8666',
						stepsMain[5], '#f7573e',
						stepsMain[6], '#de2924',
						stepsMain[7], '#b31217',
						
					],
					
					'fill-opacity': 1,
					'fill-outline-color': '#a08279',
				}
			 },"road-label");
		  
			document.getElementById('mainMap_title').innerHTML = '<h4>'+typeMain+' breeding sites Map</h4>';
			
			addMapOverlay();
		}
		
		//change side map
		else if(x==2)
		{	
			//Check if this layer already exist and remove it
			if (sideMap.getLayer("BS")) {
				sideMap.removeLayer("BS");
			}
			if (sideMap.getSource("BS")) {
				sideMap.removeSource("BS");
			}
			
			stepsSide=selectTypeBS(typeSide);
			layers2=steps;
			
			
			sideMap.addLayer({
				id: 'BS',
				type: 'fill',
				source: {
				  "type": "geojson",
					"data": NSTdata
				},
				'paint': {
					'fill-color': [
						'interpolate',
						['linear'],
						['get',typeSide,['get','Breeding_site_classes']],
						
						stepsSide[0], '#e1e1df',
						stepsSide[1], '#fff5f0',
						stepsSide[2], '#feddcd',
						stepsSide[3], '#fcb398',
						stepsSide[4], '#fc8666',
						stepsSide[5], '#f7573e',
						stepsSide[6], '#de2924',
						stepsSide[7], '#b31217',
						
					],
					'fill-opacity': 1,
					'fill-outline-color': '#a08279',
				}
			 },"road-label");
			document.getElementById('sideMap_title').innerHTML = '<h4> '+typeSide+' breeding sites Map</h4>';
			showSideMap();
			addSideMapOverlay();
		}
	}
	
	
	//Change style to the selected year for BI map
	function toBI20kk(x) 
	{
		var selectBox1 = document.getElementById("selectBox1");
		var selectBox2 = document.getElementById("selectBox2");
		yearMain = selectBox1.options[selectBox1.selectedIndex].value;
		yearSide= selectBox2.options[selectBox2.selectedIndex].value;
		var stepsMainBI=[];
		var stepsSideBI=[];
		
		if(x==1) //Change main map
		{
			//Check if this layer already exist and remove it
			if (mainMap.getLayer("BI")) {
				mainMap.removeLayer("BI");
			}
			if (mainMap.getSource("BI")) {
				mainMap.removeSource("BI");
			}
			
			stepsMainBI=selectYearBI(yearMain);
			layers=stepsBI;
			//param for main map style
			selectedMainMap='BI20kk';
			
			
			
			mainMap.addLayer({
				id: 'BI',
				type: 'fill',
				source: {
					"type": "geojson",
					"data": NSTdata
				},
				
				'paint': {
					'fill-color': 
					[
						'interpolate',
						['linear'],
						['get',yearMain,['get','Breteau_index']],
						
						stepsMainBI[0], '#e1e1df',
						stepsMainBI[1], '#fff5f0',
						stepsMainBI[2], '#feddcd',
						stepsMainBI[3], '#fcb398',
						stepsMainBI[4], '#fc8666',
						stepsMainBI[5], '#f7573e',
						stepsMainBI[6], '#de2924',
						stepsMainBI[7], '#b31217',
						stepsMainBI[8], '#67000d',

					],
					
					'fill-opacity': 1,
					'fill-outline-color': '#a08279',
				}
			 },"road-label");
		  
			document.getElementById('mainMap_title').innerHTML = '<h4>'+yearMain+' Breteau Index Map</h4>';
			addMapOverlay();
		}
		
		//change side map
		else if(x==2)
		{	
		
			//Check if this layer already exist and remove it
			if (sideMap.getLayer("BI")) {
				sideMap.removeLayer("BI");
			}
			if (sideMap.getSource("BI")) {
				sideMap.removeSource("BI");
			}
			stepsSideBI=selectYearBI(yearSide);
			layers2=stepsBI;
			
			sideMap.addLayer({
				id: 'BI',
				type: 'fill',
				source: {
				  "type": "geojson",
					"data": NSTdata
				},
				'paint': {
					'fill-color': [
						'interpolate',
						['linear'],
						['get',yearSide,['get','Breteau_index']],
						
						stepsSideBI[0], '#e1e1df',
						stepsSideBI[1], '#fff5f0',
						stepsSideBI[2], '#feddcd',
						stepsSideBI[3], '#fcb398',
						stepsSideBI[4], '#fc8666',
						stepsSideBI[5], '#f7573e',
						stepsSideBI[6], '#de2924',
						stepsSideBI[7], '#b31217',
						stepsSideBI[8], '#67000d',
						
					],
					'fill-opacity': 1,
					'fill-outline-color': '#a08279',
				}
			 },"road-label");
			document.getElementById('sideMap_title').innerHTML = '<h4> '+yearSide+' Breteau Index Map</h4>';
			showSideMap();
			addSideMapOverlay();
		}
	}	
		
		
	function openNav() {
		document.getElementById("mySidenav").style.transform = "translateX(0)";
	}

		/* Set the width of the side navigation to 0 */
	function closeNav() {
		document.getElementById("mySidenav").style.transform = "translateX(-200px)";
	}
	
	function showSideMap()
	{
		document.getElementById("sideMap").style.display = "block";
		document.getElementById("closebtn").style.display = "block";
		document.getElementById("mainMap").style.float="left";
		document.getElementById("legend").style.left="650px";
		document.getElementById("legend2").style.display="block";
		document.getElementById("mainMap").style.width="60%";
		document.getElementById("sideMap_title").style.display = "block";
		document.getElementById("features").style.display = "none";	
		sideMap.resize() 
	}
	
	//close side map
	function closeMap() { 
		document.getElementById("sideMap").style.display = "none";
		document.getElementById("sideMap_title").style.display = "none";
		document.getElementById("legend2").style.display = "none";
		document.getElementById("closebtn").style.display = "none";
		document.getElementById("mainMap").style.width = "100%";
		document.getElementById("features").style.display = "block";
		document.getElementById("legend").style.left = "1350px";
	}
	
	//Only for the main map	
	function fillOverlay(subDistrict)
	{
		if( selectedMainMap=='Breeding Sites'){ 
			if (subDistrict.length > 0) {
				document.getElementById('pd').innerHTML = '<h3><strong>' + subDistrict[0].properties.TB_EN + '</strong></h3><p><strong><em>Breeding sites density/pop: ' + subDistrict[0].properties.Density + '</strong></em></p>';
			} 
			else{
				document.getElementById('pd').innerHTML = '<p>Hover over a subdistrict!</p>';
			}
		}
		else if(selectedMainMap=='Dengue Cases'){ //if map style== Dengue cases map
			if (subDistrict.length > 0) {
				document.getElementById('pd').innerHTML = '<h3><strong>' + subDistrict[0].properties.TB_EN + '</strong></h3><p><strong><em>' + subDistrict[0].properties.Dengue_cases + '</strong> dengue cases</em></p>';
			} 
			else{
				document.getElementById('pd').innerHTML = '<p>Hover over a subdistrict!</p>';
			}	
		}	
		else if (selectedMainMap=='Breteau_index Avg'){ //if map style== BI avg map
			if (subDistrict.length > 0) {
				document.getElementById('pd').innerHTML = '<h3><strong>' + subDistrict[0].properties.TB_EN + '</strong></h3><p><strong>Avarage Breteau Index: <em>' + subDistrict[0].properties.Avg_BI + '</strong></em></p>';
			} 
			else{
				document.getElementById('pd').innerHTML = '<p>Hover over a subdistrict!</p>';
			}	
		}
		
		else if (selectedMainMap=='Population'){ //if map style==population map
		
			if (subDistrict.length > 0) {
				document.getElementById('pd').innerHTML = '<h3><strong>' + subDistrict[0].properties.TB_EN + '</strong></h3><p><strong>Population: <em>' + subDistrict[0].properties.Population + '</strong></em></p>';
			} 
			else{
				document.getElementById('pd').innerHTML = '<p>Hover over a subdistrict!</p>';
			}	
		}
		else if (selectedMainMap=='BI20kk')
		{
			for (i = 0; i < NSTdata['features'].length; i++) {
				if (subDistrict[0].properties.TB_EN == NSTdata['features'][i]['properties']['TB_EN'] )
				{
					var BIobj = NSTdata['features'][i]['properties']['Breteau_index'];
				}	
			}
			if (subDistrict.length > 0) {
				document.getElementById('pd').innerHTML = '<h3><strong>' + subDistrict[0].properties.TB_EN + '</strong></h3><p><strong>Breteau_index '+year1+': <em>' + BIobj[''+year1+''] + '</strong></em></p>';
			} 
			else{
				document.getElementById('pd').innerHTML = '<p>Hover over a subdistrict!</p>';
			}	
		}
	}
	
	//load the general chart
	setTimeout(function() {
	    countBreedingSites();
	}, 1000);

	//General chart for all breedig sites. Pie Chart
	function countBreedingSites()
	{
		var sitesTotal=0;
			var pottedplant=0;
			var bucket=0;
			var tire=0;
			var bin=0;
			var vase=0;
			var cup=0;
			var jar=0;
			var bowl=0;
			var str;
			var sum=0;
			var piechartData=[];
			var chartLabel=[];	
			var chartData=[];
			
		for (i = 0; i < NSTdata['features'].length; i++) 
		{
			
			var obj = NSTdata['features'][i]['properties']['Breeding_site_classes'];
			var piechartLabel=['bucket','pottedplant','bin','tire','jar','cup','bowl','vase'];	
						
									
		
				pottedplant+=obj['pottedplant'];
				
				bucket+=obj['bucket'];
					
				tire+=obj['tire'];
			
				bin+=obj['bin'];
				
				vase+=obj['vase'];
				
				cup+=obj['cup'];
				
				jar+=obj['jar'];
				
				bowl+=obj['bowl'];
				
		}
			piechartData=[bucket,pottedplant,bin,tire,jar,cup,bowl,vase];		
	

		
		//find percentage of each breeding site
		function getTotal(total, num) {
			return total + num;
		}
		sitesTotal= piechartData.reduce(getTotal);
		
		for (var i=0; i<piechartLabel.length; i++)
		{
			piechartLabel[i]= ""+Math.round((piechartData[i]/sitesTotal)*100)+"% "+piechartLabel[i]+"";
		}
		
		
		for (var i = 0; i < piechartData.length; i++) { //length-1 to remove vase since it has only 0%
			sum += piechartData[i];
			if(piechartData[i]!=0){
				chartData.push(piechartData[i]);
				chartLabel.push(piechartLabel[i]);
			}
		}
					
		var config2 = {
			type: 'pie',
			data: {
				datasets: [{
					data: chartData,
					backgroundColor: chartColors,
				
				}],
				labels: chartLabel,
			},
			options: {
				responsive: true,
				legend: {
					position: 'right',
				},
				title: {
					display: true,
					text: 'Total '+sum+' breeding sites.'
				},
				animation: {
					animateScale: true,
					animateRotate: true
				}
			}
		};		
		var ctx2 = document.getElementById('chart-area2').getContext('2d');
		window.myPie = new Chart(ctx2, config2);							
	}
