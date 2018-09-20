app.controller('siteController', function($scope, $http) {
		
	this.processingTimer = setInterval(() => { getDevicesUpdate(); }, 3000);

	function getDevicesInfo() {
		
		$http.get('/db/targetdeviceStatus.json')
    		.then(function(response) {
				$scope.content = response.data;
				
				$scope.content.forEach(
					function(e) {						
						e.dataSource = getGaugeInfo(e);																	
					}			
				);
			}, function(response) {
				alert("Ops, Algo Aconteceu::" + response);
		});
	}

	function getDevicesUpdate() {
		var param = new Date();

		$http({
				method: 'GET',
				cache: false,
				url: '/db/targetdeviceStatus.json?_cache_buster=' + param.getTime(),
				headers: { 'Content-Type': 'application/json'}
			}).then(function successCallback(response) {
				var contendUpdated = response.data;

				for (var i = 0; i < contendUpdated.length; i++) {
					var sensorUpdatedId = contendUpdated[i].id;
					
					$scope.content.filter(function (obj) {
						return obj.id === sensorUpdatedId;
					})[0].dataSource.dials.dial[0].value = contendUpdated[i].value / 100000;										
				}
			}, function errorCallback(response) {
				alert("Ops, Algo Aconteceu::" + response);
			});		
	}

	function getGaugeInfo(e) {

		properties =  {
			caption: e.nome + " - ID " + e.id,
			subcaption: "Gás: " + e.tipo,
			captionontop: 0,			
			captionpadding: 30,
		  	 origw: "300",
			 origh: "280",
			gaugeouterradius: "90",
			gaugestartangle: "270",
			gaugeendangle: "-25",
			showvalue: "1",
			valuefontsize: "14",
			majortmnumber: "13",
			majortmthickness: "2",
			majortmheight: "13",
			minortmheight: "7",
			minortmthickness: "1",
			minortmnumber: "1",
			showgaugeborder: "1",
			theme: "ocean"
		};

		var rangeGray = (e.maxValue - e.minValue) / 10 ;

		colors = {				
			color: [
			{
				minvalue: e.minValue,
				maxvalue: rangeGray,
				code: "#D8D8D8"
			 },
			 {
			 	minValue: rangeGray,
			 	maxValue: e.maxValue,
			 	code: "#F6F6F6"			
			}]		
		};
		
		values = {		  		  			
			dial: [{				
				value: e.value / 100000,
				bgcolor: "#F20F2F",
				basewidth: "8"			
			}]			
		};

		
		annotations = {
			groups: [
			  {
				items: [
				  {	
					type: "text",
					id: "text",  				
					text: e.unidade,
					x: "$gaugeCenterX + 40",
            		y: "$gaugeCenterY + 60",				
					fontsize: "10",
					color: "#6957da"
				  }
				]
			  }
			]
		};
		
		dataSource = {
			chart: null,
			colorRange: null,
			dials: null,
			annotations: null
		};
		
		dataSource.chart = properties;
		dataSource.colorRange = colors;
		dataSource.dials = values;
		dataSource.annotations = annotations;		
		
		return dataSource;
	}

	getDevicesInfo();
	  
});

