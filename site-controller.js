app.controller('siteController', function($scope, $http) {

	$scope.msgError = undefined;
	$scope.full = false; 
	var elem = document.documentElement;

	$scope.refresh = function() {
		location.reload(true);
	}

	$scope.fullScreen = function() {
		if($scope.full) {
			document.webkitExitFullscreen();
			$scope.full = false;
		} else {
			elem.webkitRequestFullscreen();	
			$scope.full = true;
		}		
	}
		
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
		
		$http.get('/sistema/DB/targetdeviceStatus.json')
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
			var seconds = Math.floor((new Date() - item.dataSource.data) / 1000);
			var timer = 'Agora';
			if(seconds > 300) {
				item.dataSource.chart.bgColor = "#474646";
				timer = timeSince(new Date(), item.dataSource.data) + "<< OFFLine >>";
			} else { 
				item.dataSource.chart.bgColor = "#FFFFFF";
				timer = timeSince(new Date(), item.dataSource.data);
			}
			item.dataSource.chart.subcaption = timer;
		});
		
	}

	function getDevicesUpdate() {
		var param = new Date();

		$http({
				method: 'GET',
				cache: false,
				url: '/sistema/DB/targetdeviceStatus.json?_cache_buster=' + param.getTime(),
				headers: { 'Content-Type': 'application/json'}
			}).then(function successCallback(response) {
				var contendUpdated = response.data;

				for (var i = 0; i < contendUpdated.length; i++) {
					var sensorUpdatedId = contendUpdated[i].id;
					
					var item = $scope.content.filter(function (obj) {
						return obj.id === sensorUpdatedId;
					})[0];

					if(contendUpdated[i].milliTime != item.dataSource.milliTime) {											
						item.dataSource.data = new Date();
						item.dataSource.milliTime = contendUpdated[i].milliTime;									
					}					
					
					item.dataSource.dials.dial[0].value = contendUpdated[i].value / 100000;
				}
			}, function errorCallback(response) {
				$scope.msgError = "Ops, Algo Aconteceu::" + response;
			});		
	}

	function getGaugeInfo(e) {
		var tipo = (e.tipo == null ? "Sem Config" : e.tipo);
		properties =  {
			caption: e.nome + " - ID " + e.id + " (" + tipo + ")     " + e.detail,			
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

		if(e.tipo == 'O2')
			console.log('OK');
	
		colors = {				
			color: [
			{
				minvalue: e.minValue,
				maxvalue: e.alarm1,
				code: e.tipo == 'O2' ? "#f74d4d" :  "#B1FC97"
			 },
			 {
			 	minValue: e.alarm1,
			 	maxValue: e.alarm2,
			 	code: "#ffc399" 			
			},{
				minValue: e.alarm2,
				maxValue: e.maxValue,
				code: (e.tipo == 'O2' ? "#97CDFC" :  "#f74d4d")
		   }]		
		};
		
		values = {		  		  			
			dial: [{				
				value: e.value / 100000,
				bgcolor: "#F6F6F6",
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
					fontsize: "12",
					color: "#2A3137"
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
		dataSource.detail = e.detail;
		
		return dataSource;
	}

	getDevicesInfo();
	  
});

