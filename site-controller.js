

app.controller('siteController', function($scope, $http, $cacheFactory) {
	
	$scope.cacheObject = $cacheFactory("newCacheInstance");
	this.processingTimer = setInterval(() => { getDevicesUpdate(); }, 5000);

	function getDevicesInfo() {
		var param = new Date();

		$http.get('/targetdeviceStatus.json?_cache_buster=' + param.getTime())
    		.then(function(response) {
				$scope.content = response.data;
				
				$scope.content.forEach(
					function(e) {						
						e.dataSource = getGaugeInfo(e);																	
					}			
				);
			}, function(response) {
				$scope.content = "Something went wrong";
			});
	}

	function getDevicesUpdate() {
		var param = new Date();

		$http({
				method: 'GET',
				cache: false,
				url: '/targetdeviceStatus.json?_cache_buster=' + param.getTime(),
				headers: { 'Content-Type': 'application/json' }
			}).then(function successCallback(response) {
				var contendUpdated = response.data;

				for (var i = 0; i < contendUpdated.length; i++) {
					var sensorUpdatedId = contendUpdated[i].id;
					
					var value = $scope.content.filter(function (obj) {
						return obj.id === sensorUpdatedId;
					})[0].value;
					
					$scope.content[i].value = value;
				}
			}, function errorCallback(response) {
			  alert("Falha::" + response)
		});

		$scope.cacheObject.RemoveAll; 
	}

	function getGaugeInfo(e) {

		properties =  {
			caption: e.nome + " - ID " + e.id,
			captionpadding: "30",
		  	 origw: "280",
			 origh: "280",
			gaugeouterradius: "90",
			gaugestartangle: "220",
			gaugeendangle: "-25",
			showvalue: "1",
			valuefontsize: "20",
			majortmnumber: "13",
			majortmthickness: "2",
			majortmheight: "13",
			minortmheight: "7",
			minortmthickness: "1",
			minortmnumber: "1",
			showgaugeborder: "0",
			theme: "ocean"
		};

		colors = {				
			color: [
			{
				minvalue: 0, //e.rangeMin,
				maxvalue: 110,
				code: "#D8D8D8" // "##6baa01",				
			 },
			 {
			 	minValue: 110,
			 	maxValue: 280,
			 	code: "#F6F6F6"			 	
			// }, {
			// 	minValue: yellow,
			// 	maxValue: red,
			// 	code: "#f8bd19",
			// 	label: (e.artefact == "TIME" ? "Aberta" : "")
			// }, {
			// 	minValue: red,
			// 	maxValue: e.rangeMax,
			// 	code: "#e44a00",
			// 	label: (e.artefact == "TIME" ? "Aberta" : "")
			}]		
		};
		
		values = {		  		  			
			dial: [{				
				value: e.value / 100000,
				bgcolor: "#F20F2F",
				basewidth: "8"			
			}]			
		};
		
		dataSource = {
			chart: null,
			colorRange: null,
			dials: null
		};
		
		dataSource.chart = properties;
		dataSource.colorRange = colors;
		dataSource.dials = values;		
		
		return dataSource;
	}

	getDevicesInfo();
	  
});

