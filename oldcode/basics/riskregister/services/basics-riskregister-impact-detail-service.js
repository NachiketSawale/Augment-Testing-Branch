(function (angular) {
	/*global angular,console*/
	'use strict';
	var moduleName = 'basics.riskregister';
	angular.module(moduleName).service('basicsRiskRegisterImpactDetailService', [
		'basicsRiskRegisterDataService',
		function (basicsRiskRegisterDataService) {

			var service = {};

			function quickSort(origArray) {
				if (origArray.length <= 1) {
					return origArray;
				} else {

					var left = [];
					var right = [];
					var newArray = [];
					var pivot = origArray.pop();
					var length = origArray.length;

					for (var i = 0; i < length; i++) {
						if (origArray[i] <= pivot) {
							left.push(origArray[i]);
						} else {
							right.push(origArray[i]);
						}
					}

					return newArray.concat(quickSort(left), pivot, quickSort(right));
				}
			}

			function calculatePercentile(values) {
				var orderedValues = quickSort(values);
				var percentile = 0.015;
				var index = Math.ceil(percentile * values.length);
				return values[index];

			}

			function stringTotalToDecimal(item) {
				var splitStringArr = item.split('');
				var countLeftOfDecimal = 0;
				var countRightOfDecimal = 0;
				var total = 0.0;
				var decimalPlace = 0;
				var pow = 0;
				decimalPlace = item.indexOf('.');
				//user entered a user defined amount with decimal place
				if (decimalPlace !== -1) {
					countLeftOfDecimal = decimalPlace - 1;
					countRightOfDecimal = splitStringArr.length - decimalPlace;

					pow = countLeftOfDecimal;
					for (var k = 0; k <= countLeftOfDecimal; k++) {
						total += parseInt(item[k]) * Math.pow(10, pow);
						pow--;
					}
					pow = 1;
					for (var l = decimalPlace + 1; l <= item.length - 1; l++) {
						total += parseInt(item[l]) / Math.pow(10, pow);
						pow++;
					}
				} else {
					pow= item.length -1;
					for (var m = 0; m < item.length; m++) {
						total += parseInt(item[m]) * Math.pow(10, pow);
						pow--;
					}
				}

				return total;
			}

			function stringPercentToDecimal(item) {
				var splitStringArr = item.split('');
				var isPercent = false;
				var decimalPlace = 0;
				var countLeftOfDecimal = 0;
				var countRightOfDecimal = 0;
				var total = 0.0;
				var pow = 0;
				/*if (item.indexOf('%') !== -1) {
					isPercent = true;
				}*/
				decimalPlace = item.indexOf('.');

				//if isPercent than user entered % symbol and we return a percentage in decimal format
				//if (isPercent) {
				//if user has entered a percentage with decimal point
				if (decimalPlace !== -1) {
					countLeftOfDecimal = decimalPlace - 1;
					pow = countLeftOfDecimal;
					countRightOfDecimal = splitStringArr.length - decimalPlace - 1;//acounts for the % sign at end of string
					for (var i = 0; i <= countLeftOfDecimal; i++) {
						total += parseInt(item[i]) * Math.pow(10, pow);
						pow--;
					}
					pow=1;
					for (var j = decimalPlace + 1; j < item.length - 1; j++) {
						total += parseInt(item[j]) / Math.pow(10, pow);
						pow++;
					}
				} else {

					for (var r = item.length-2; r >= 0; r--) {
						total += parseInt(item[r]) * Math.pow(10, pow);
						pow++;
					}
				}
				return total / 100;//percent to decimal conversion
			}

			function convertToPercentage(impactEntity,value){
				var central = impactEntity.CentralImpact;

				if(central !== 0){
					var percentage = value / central;

					percentage = percentage * 100;

					return percentage.toString() + '%';
				}

			}

			service.transfromLowAndHighImpacts = function(item){
				/*if(item.RiskRegisterImpactEntities[0].hasOwnProperty('LowImpact')){

					item.RiskRegisterImpactEntities[0].LowImpactDetail = convertToPercentage(
						item.RiskRegisterImpactEntities[0],item.RiskRegisterImpactEntities[0].LowImpact);
				}
				if(item.RiskRegisterImpactEntities[0].hasOwnProperty('HighImpact')){
					item.RiskRegisterImpactEntities[0].HighImpactDetail = convertToPercentage(
						item.RiskRegisterImpactEntities[0],item.RiskRegisterImpactEntities[0].HighImpact);
				}*/
			};
			service.fieldChange = function fieldChange(item, field, column) {

				switch (field) {
					case 'DistributionType':
						if (item.DistributionType === '1') {
							item.LowImpact = calculatePercentile([item.CentralImpact]);
							/*basicsRiskRegisterDataService.markItemAsModified(item);
							basicsRiskRegisterDataService.gridRefresh();*/
							basicsRiskRegisterDataService.gridRefresh();
						}
						break;
					case 'LowImpactDetail':
						if (typeof item.LowImpactDetail === 'number') {
							item.LowImpact = item.LowImpactDetail;//item.CentralImpact * (item.LowImpact / 100);
							basicsRiskRegisterDataService.gridRefresh();
						} else {
							if (item.LowImpactDetail.indexOf('%') === -1) {
								item.LowImpact = stringTotalToDecimal(item.LowImpactDetail);
								//item.LowImpactTest = item.LowImpact.toString();
							} else {
								item.LowImpact = (stringPercentToDecimal(item.LowImpactDetail) * item.CentralImpact);
								//item.LowImpactTest = item.LowImpact.toString();
							}
							basicsRiskRegisterDataService.gridRefresh();
						}
						break;
					case 'HighImpactDetail':
						if (typeof item.HighImpactDetail === 'number') {
							item.HighImpact = item.HighImpactDetail;//item.CentralImpact * (item.HighImpact / 100);
							basicsRiskRegisterDataService.gridRefresh();
						} else {
							if (item.HighImpactDetail.indexOf('%') === -1) {
								item.HighImpact = stringTotalToDecimal(item.HighImpactDetail);
								//item.HighImpactTest = item.HighImpact.toString();
							} else {
								item.HighImpact = (stringPercentToDecimal(item.HighImpactDetail) * item.CentralImpact);
								//item.HighImpactTest = item.HighImpact.toString();
							}
							basicsRiskRegisterDataService.gridRefresh();
						}
						break;
					default:
						break;
				}


			};

			service.editFields = function(dataService,item,field,column){


				switch (field) {
					case 'DistributionType':
						if (item.DistributionType === '1') {
							item.LowImpact = calculatePercentile([item.CentralImpact]);
							/*basicsRiskRegisterDataService.markItemAsModified(item);
							dataService.gridRefresh();*/
						}
						break;
					case 'LowImpactDetail':
						if (typeof item.LowImpactDetail === 'number') {
							item.LowImpact = item.LowImpactDetail;//item.CentralImpact * (item.LowImpact / 100);
							/*basicsRiskRegisterDataService.markItemAsModified(item);
							dataService.gridRefresh();*/
						} else {
							if (item.LowImpactDetail.indexOf('%') === -1) {
								item.LowImpact = stringTotalToDecimal(item.LowImpactDetail);
								item.LowImpactDetail = item.LowImpact.toString();
							} else {
								item.LowImpact = (stringPercentToDecimal(item.LowImpactDetail) * item.CentralImpact);
								item.LowImpactDetail = item.LowImpact.toString();
							}
							/*basicsRiskRegisterDataService.markItemAsModified(item);
							dataService.gridRefresh();*/
						}

						break;
					case 'HighImpactDetail':
						if (typeof item.HighImpactDetail === 'number') {
							item.HighImpact = item.HighImpactDetail;//item.CentralImpact * (item.HighImpact / 100);
							/*basicsRiskRegisterDataService.markItemAsModified(item);
							basicsRiskRegisterDataService.gridRefresh();*/
						} else {
							if (item.HighImpactDetail.indexOf('%') === -1) {
								item.HighImpact = stringTotalToDecimal(item.HighImpactDetail);
								item.HighImpactDetail = item.LowImpact.toString();
							} else {
								item.HighImpact = (stringPercentToDecimal(item.HighImpactDetail) * item.CentralImpact);
								item.HighImpactDetail = item.HighImpact.toString();
							}
							/*basicsRiskRegisterDataService.markItemAsModified(item);
							basicsRiskRegisterDataService.gridRefresh();*/
						}
						break;
					default:
						break;
				}
			};

			return service;
		}
	]);
})(angular);
