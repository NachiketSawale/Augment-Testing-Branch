(function (angular) {
	/*globals angular, d3, globals,console*/
	'use strict';
	var appModule = 'basics.riskregister';

	angular.module(appModule).service('basicsRiskCalculatorMainService', BasicsRiskCalculatorMainService);

	BasicsRiskCalculatorMainService.$inject = ['$q','platformDialogService','$translate','$http',
		'basicsLookupdataLookupDescriptorService','PlatformMessenger','$injector','estimateMainService'];

	function BasicsRiskCalculatorMainService($q,platformDialogService,$translate,$http,
	                                         basicsLookupdataLookupDescriptorService,PlatformMessenger,$injector,estimateMainService){
		var service = {};
		var _distribution = null;

		var _probabilityRisk = null;

		var _finalValue = 0;

		service.finalTotals = [];

		service.finalObj = {
			Id: null,
			RiskApplyValue: 0
		};

		service.xPoints = [];
		service.yPoints = [];
		service.coordinatesList = [];

		service.statisticsSet = new PlatformMessenger();
		service.finalCalculationSet = new PlatformMessenger();

		service.getProjId = function(){
			return estimateMainService.getProjectId();
		};

		service.getEstHeaderFk = function(){
			return estimateMainService.getSelectedEstHeaderId();
		};
		service.setPoints = function setPoints(data){
			service.coordinatesList = data;
			service.xPoints = data.x;
			service.yPoints = data.y;
		};
		service.setWizardResults = function(results){
			service.wizardResults = results;
		};
		service.getPoints = function getPoints(){
			//return {xPoints: service.xPoints,yPoints: service.yPoints};
			if(service.coordinatesList.length < 0 ){
				return [{x:0,y:1},{x:1,y:2},{x:2,y:3},{x:3,y:4},{x:5,y:6},{x:7,y:8},{x:9,y:10},{x:10,y:11}];
			}
			return service.coordinatesList;
		};

		service.getFinalValue = function () {
			return _finalValue;
		};
		function createVisualization(){
			// set the dimensions and margins of the graph
			var margin = {top: 10, right: 30, bottom: 30, left: 60},
				width = 460 - margin.left - margin.right,
				height = 400 - margin.top - margin.bottom;

			// append the svg object to the body of the page
			var svg = d3.select('#my_dataviz')
				.append('svg')
				.attr('width', width + margin.left + margin.right)
				.attr('height', height + margin.top + margin.bottom)
				.append('g')
				.attr('transform',
					'translate(' + margin.left + ',' + margin.top + ')');
			// x-axis
			var lengthX = getMaxValue(service.xPoints);
			var lengthY = getMaxValue(service.yPoints);

			var x = d3.scaleLinear()
				.domain([0,lengthX])
				.range([height,0]);
			svg.append('g')
				.attr('transform','translate(0,' + height + ')')
				.call(d3.axisBottom(x));
			// y-axis
			var y = d3.scaleLinear()
				.domain([0,lengthY])
				.range([height,0]);
			svg.append('g')
				.call(d3.axisLeft(y));

			svg.append('path')
				.datum({xPoints:service.xPoints,yPoints:service.xPoints})
				.attr('fill','none')
				.attr('stroke','steelblue')
				.attr('d',d3.line()
					.x(function (d) {
						return x(d.xPoints);
					})
					.y(function (d) {
						return y(d.yPoints);
					}));
		}

		service.CalculationResults = null;

		service.setCalcResults = function(calcObj){
			service.CalculationResults = calcObj;
		};
		service.getCalcResults = function(){
			return service.CalculationResults;
		};
		service.calculateXValue = function(calcObj,pValue){
			var data = {
				coord: calcObj,
				percentage: pValue
			};
			return $http.post(globals.webApiBaseUrl + 'estimate/main/riskcalculator/calculateP',data);
		};

		service.calculatePValue = function(calcObj,pValue){
			var data = {
				coord: calcObj,
				pValue: pValue
			};

			return $http.post(globals.webApiBaseUrl + 'estimate/main/riskcalculator/getPercentage',data);
		};

		service.getStatistics = function(calcObj,pValue){
			var data = {
				coord: calcObj,
				percentage: pValue
			};
			return	$http.post(globals.webApiBaseUrl + 'estimate/main/riskcalculator/getriskstatistics',data);/*.then(function (response) {
				if(response.data){
					service.statistics = response.data;
					service.statisticsSet.fire();
				}
			});*/
		};
		service.setFinalObjId = function(id){
			service.finalObj.Id = id;
		};
		service.setFinalObjValue = function(value){
			service.finalObj.RiskApplyValue = value;
		};

		service.setStatistics = function(statObj){
			if(service.statistics){
				var stats = service.statistics;
				statObj.min = stats.min;
				statObj.max = stats.max;
				statObj.mean = stats.mean;
				statObj.stdDev = stats.stdDev;
			}

		};

		service.setResultToApply = function(checkBoxModel,minMaxModel,xValue){
			var checked = [];
			var valueToApply = 0;
			angular.forEach(checkBoxModel,function (value,key) {
				if(value === true){
					checked.push(key);
				}
			});
			if(checked.length > 0 ){
				valueToApply = minMaxModel[checked.pop()];
			}else{
				valueToApply = xValue;
			}

			_finalValue = valueToApply;

			service.finalTotals.push({
				risk:service.finalObj.Id,
				value:_finalValue
			});
		};

		service.applyResultsToLineItems = function(data){

			var estMainService = $injector.get('estimateMainService');
			$http.post(globals.webApiBaseUrl + 'estimate/main/riskcalculator/applyresults',data).then(function (response) {

				estimateMainService.clear();
				estimateMainService.load();
			});


		};
		service.showDialog = function showDialog() {
			var options = {

			};
			var modalOptions =  {
				dialogTitle: 'Risk Calculator',
				controller: 'basicsRiskCalculatorController',
				templateUrl: globals.appBaseUrl + 'basics.riskregister/templates/risk-calculator.html',
				closeButtonText: $translate.instant('basics.common.cancel'),
				actionButtonText: $translate.instant('basics.common.ok'),
				backdrop: false,
				resizeable: true,
				width: '80%',
				height: '75%',

			};
			platformDialogService.showDialog(modalOptions);
			//createVisualization();
		};

		service.loadDistribution = function () {
			var deffered = $q.defer();
			if(service.getDistribution() === null ){
				$http.get(globals.webApiBaseUrl + 'estimate/main/riskcalculator/distributiontype')
					.then(function (response) {
						_distribution = [];

						for(var i = 0; i < response.data.length; i++){
							var item = response.data[i];
							if(item.hasOwnProperty('Description')){
								_distribution.push({Id: item.Id, Description: item.Description});
							}
						}

						/*for(var key in response.data){
							if(key !== '')
							{
								var descr = $translate.instant(response.data[key]);
								_distribution.push({Id: key, Description: descr});
							}
						}*/
						basicsLookupdataLookupDescriptorService.removeData('DistributionSchema');
						basicsLookupdataLookupDescriptorService.updateData('DistributionSchema', _distribution);
						deffered.resolve();
					});
			}else{
				deffered.resolve();
			}

			return deffered.promise;
		};

		service.getDistributionsById = function (value) {
			var item = {};
			var distribution = service.getDistribution();
			for (var i = 0; i < distribution.length; i++) {
				if (distribution[i].Id === value) {
					item = distribution[i];
					break;
				}
			}
			return item;
		};

		service.getDistribution = function () {
			return _distribution;
		};

		service.loadProbabilityRisk = function(){
			var deffered = $q.defer();
			if(service.getProbabilityRisk() === null ){
				$http.get(globals.webApiBaseUrl + 'estimate/main/riskcalculator/probabilityofrisk')
					.then(function (response) {
						_probabilityRisk = [];

						for(var i = 0; i < response.data.length; i++){
							var item = response.data[i];
							if(item.hasOwnProperty('Description')){
								_probabilityRisk.push({Id: item.Id, Description: item.Description});
							}
						}

						/*for(var key in response.data){
							if(key !== '')
							{
								var descr = $translate.instant(response.data[key]);
								_distribution.push({Id: key, Description: descr});
							}
						}*/
						basicsLookupdataLookupDescriptorService.removeData('ProbabilityRisk');
						basicsLookupdataLookupDescriptorService.updateData('ProbabilityRisk', _probabilityRisk);
						deffered.resolve();
					});
			}else{
				deffered.resolve();
			}

			return deffered.promise;
		};

		service.getProbabilityRisk = function () {
			return _probabilityRisk;
		};

		service.getProbabilityRiskById = function (value) {
			var item = {};
			var probabilityRisk = service.getProbabilityRisk();
			for (var i = 0; i < probabilityRisk.length; i++) {
				if (probabilityRisk[i].Id === value) {
					item = probabilityRisk[i];
					break;
				}
			}
			return item;
		};

		service.clear = function clear(){
			service.finalTotals = [];
			service.xPoints = [];
			service.yPoints = [];
			service.coordinatesList = [];
			_finalValue = 0;
			service.CalculationResults = null;
		};
		function getMaxValue(values){
			var largest = 0;

			if(values.length > 0){
				largest = values[0];
			}

			for(var i = 0; i < values.length; i++){
				if(values[i] > largest){
					largest = values[i];
				}

			}
			return largest;
		}


		return service;
	}
})(angular);
