app.controller('siteController', function($scope, $http) {
	
	function getDevicesInfo() {
		$http.get("/targetdeviceStatus.json")
    		.then(function(response) {
				$scope.content = response.data;
				
				$scope.content.forEach(
					function(e) {						
						e.dataSource = getGaugeInfo(e);																	
					}			
				);

			}, function(response) {
				//Second function handles error
				$scope.content = "Something went wrong";
			});
	}

	function getGaugeInfo(e) {

		properties =  {
			caption: e.nome + " - ID " + e.id,
			captionpadding: "30",
		  	 origw: "320",
			 origh: "300",
			gaugeouterradius: "115",
			gaugestartangle: "270",
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

