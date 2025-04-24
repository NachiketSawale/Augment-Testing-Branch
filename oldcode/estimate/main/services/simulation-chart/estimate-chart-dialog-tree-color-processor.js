/**
 * Created by Naim on 3/12/2018.
 */

(function () {
	/* global _, $ */
	'use strict';

	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateChartDialogTreeColorProcessor
	 * @function
	 *
	 * @description
	 * estimateChartDialogColorProcessor is the data service for cost code dialog
	 */
	angular.module(moduleName).factory('estimateChartDialogTreeColorProcessor',
		[
			'estimateMainSimulationChartSelectionsConstant',
			'platformColorService',

			function (estimateMainSimulationChartSelectionsConstant, platformColorService) {
				let service = {};
				let findCalcSel = function (curveType) {
					return _.find(estimateMainSimulationChartSelectionsConstant, function (calcSels) {
						return calcSels.curveType === curveType;
					});
				};
				let getColorHex = platformColorService.hexByName;
				let reservedColor = [
					{value: getColorHex('green',1), curveType: findCalcSel('budget').curveType},
					{value: getColorHex('green',3), curveType: findCalcSel('budget').curveType},
					{value: getColorHex('green',7), curveType: findCalcSel('budget').curveType},
					{value: getColorHex('cyan',1), curveType: findCalcSel('hours').curveType},
					{value: getColorHex('cyan',3), curveType: findCalcSel('hours').curveType},
					{value: getColorHex('cyan',7), curveType: findCalcSel('hours').curveType},
					{value: getColorHex('blue',1), curveType: findCalcSel('cost').curveType},
					{value: getColorHex('blue',3), curveType: findCalcSel('cost').curveType},
					{value: getColorHex('blue',7), curveType: findCalcSel('cost').curveType},
					{value: getColorHex('teal',1), curveType: findCalcSel('cost').curveType},
					{value: getColorHex('teal',3), curveType: findCalcSel('cost').curveType},
					{value: getColorHex('teal',7), curveType: findCalcSel('cost').curveType}
				];
				let randomColorGenerator = function () {
					// TODO: generate different color for each of them! (16777215 == ffffff = 256*256*256(RGB))
					return Math.floor(Math.random() * 0xffffff);
				};

				let colorAssignment = function (entity, usedColors) {
					let currentColor = randomColorGenerator();

					if (usedColors.includes(currentColor)) {
						colorAssignment(entity);
					}
					else {
						entity.Color = currentColor;
					}
				};

				let findUniqueColor = function findUniqueColor (curveType, usedColors) {
					let result = null;
					let colorFound = false;
					if (curveType !== undefined){
						let curveColors = _.filter(reservedColor,function(resColor){
							return resColor.curveType === curveType;
						});
						_.forEach(curveColors, function(cuColor){
							let intColor = parseInt('0x'+ cuColor.value.substring(1));
							if (!usedColors.includes(intColor) && !colorFound){
								result = intColor;
								colorFound = true;
							}
						});
					}
					if(!colorFound){
						let currentColor = randomColorGenerator();
						let reservedColorHexList = $.map(reservedColor, function(resColor) {
							return parseInt('0x'+ resColor.value.substring(1));
						});
						if (usedColors.includes(currentColor) || reservedColorHexList.includes(currentColor)){
							result = findUniqueColor(curveType, usedColors);
						}
						else{
							result = currentColor;
						}
					}
					return result;
				};

				service.processItem = function processItem(entity) {
					colorAssignment(entity);
				};

				service.getUniqueColor = function getUniqueColor(curveType, usedColors) {
					return findUniqueColor(curveType, usedColors);
				};
				return service;
			}
		]);
})();
