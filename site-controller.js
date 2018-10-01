app.controller('siteController', function($scope, $http) {
		
	this.processingTimer = setInterval(() => { getDevicesUpdate(); }, 3000);
	this.processingTimer = setInterval(() => { checkDevicesStatus(); }, 4000);

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
		
		$http.get('/sistema/db/targetdeviceStatus.json')
    		.then(function(response) {
				$scope.content = response.data;
				
				$scope.content.forEach(
					function(e) {						
						e.dataSource = getGaugeInfo(e);																	
					}			
				);
			}, function(response) {
				$scope.msgError = "Ops, Algo Aconteceu::" + response;
		});
	}

	function checkDevicesStatus() {
		if($scope.content == undefined) return;

		$scope.content.forEach(function(item) {				
			console.log(new Date() + " / " + item.dataSource.data);
			item.dataSource.chart.subcaption = timeSince(new Date(), item.dataSource.data);
		});
		
	}

	function getDevicesUpdate() {
		var param = new Date();

		$http({
				method: 'GET',
				cache: false,
				url: '/sistema/db/targetdeviceStatus.json?_cache_buster=' + param.getTime(),
				headers: { 'Content-Type': 'application/json'}
			}).then(function successCallback(response) {
				var contendUpdated = response.data;

				for (var i = 0; i < contendUpdated.length; i++) {
					var sensorUpdatedId = contendUpdated[i].id;
					
					var item = $scope.content.filter(function (obj) {
						return obj.id === sensorUpdatedId;
					})[0];

					if(contendUpdated[i].milliTime != undefined && parseFloat(item.dataSource.milliTime) > 0) {
						var dif =  parseFloat(contendUpdated[i].milliTime) - parseFloat(item.dataSource.milliTime);						
						
						if (dif > 0) {				
							var d = new Date();
							item.dataSource.data = d.setSeconds(d.getSeconds() + (dif / 1000));
							item.dataSource.milliTime = contendUpdated[i].milliTime;						
						}			
					}
					else {
						item.dataSource.data = new Date(0);
						$scope.msgError = "Dispositivo com Data inválida :: F5 - LImpar ";
					}
					
					// calcDelayTime(item.dataSource.data, item.dataSource.milliTime, contendUpdated[i].milliTime);
					item.dataSource.dials.dial[0].value = contendUpdated[i].value / 100000;
				}
			}, function errorCallback(response) {
				$scope.msgError = "Ops, Algo Aconteceu::" + response;
			});		
	}

	function calcDelayTime(data, milliTime, updateMilliTime) {
		
		console.log("time=" + milliTime + " - updatedTime=" + updateMilliTime);
		
		currentMilliTime = updateMilliTime;

		if(currentMilliTime != undefined && parseFloat(milliTime) > 0) {
			var dif =  parseFloat(currentMilliTime) - parseFloat(milliTime);						
			
			if (dif > 0) {				
				d = new Date();
				data = d.setSeconds(d.getSeconds() + (dif / 1000));
				milliTime = updateMilliTime;
			}			
		}
		else {
			data = new Date(0);
			$scope.msgError = "Dispositivo com Data inválida :: F5 - LImpar ";
		}

	}

	function getGaugeInfo(e) {

		properties =  {
			caption: e.nome + " - ID " + e.id + " [" + e.tipo + "]",
			// subcaption: "Gás: " + e.tipo,
			subcaption: "Agora",
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

		dataSource.milliTime = e.milliTime;
		dataSource.data = new Date();
		
		return dataSource;
	}

	getDevicesInfo();
	  
});

