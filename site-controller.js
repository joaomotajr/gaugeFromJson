app.controller('siteController', function($scope, $http) {
		
	this.processingTimer = setInterval(() => { getDevicesUpdate(); }, 3000);

	function timeSince(dateIn, date) {

	    var seconds = Math.floor((new Date(dateIn) - date) / 1000);

	    var interval = Math.floor(seconds / 31536000);

	    if (interval > 1) {
	        return interval + " anos";
	    }
	    interval = Math.floor(seconds / 2592000);
	    if (interval > 1) {
	        return interval + " meses";
	    }
	    interval = Math.floor(seconds / 86400);
	    if (interval > 1) {
	        return interval + " dias";
	    }
	    interval = Math.floor(seconds / 3600);
	    if (interval > 1) {
	        return interval + " hrs";
	    }
	    interval = Math.floor(seconds / 60);
	    if (interval > 1) {
	        return interval + " mins";
	    }
	    return Math.floor(seconds) + " segs";
	}

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
					
					var item = $scope.content.filter(function (obj) {
						return obj.id === sensorUpdatedId;
					})[0];

					var data = new Date();
					item.dataSource.dataText = timeSince(data, item.dataSource.data);
					item.dataSource.dials.dial[0].value = contendUpdated[i].value / 100000
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
		dataSource.data = new Date();
		dataSource.dataText = "Agora";		
		
		return dataSource;
	}

	getDevicesInfo();
	  
});

