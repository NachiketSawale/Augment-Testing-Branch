(function (angular) {
	'use strict';
	var moduleName = 'estimate.main';
	// var combineModule = angular.module(moduleName);

	angular.module(moduleName).service('estimateMainCombineColumnService',[function () {

		let service = {};

		let standardColumnList = [
			'DescriptionInfo','CostUnit','HoursUnit','PrjLocationFk','EstAssemblyFk',
			'SortCode01Fk','SortCode02Fk','SortCode03Fk' ,'SortCode04Fk','SortCode05Fk','SortCode06Fk' ,'SortCode07Fk','SortCode08Fk','SortCode09Fk' ,'SortCode10Fk'];

		let itemUnitCostList = [
			'EstAssemblyFk','DescriptionInfo','BasUomFk','CostUnit','HoursUnit'
		];

		service.getStandardColumnList = function () {
			return standardColumnList;
		};

		service.getItemUnitCostList = function () {
			return itemUnitCostList;
		};

		service.getCustomList = function (list) {
			let array = list.split(',');
			return array;
		};

		service.addToStandardList = function (column) {
			if(typeof column === 'string'){
				standardColumnList.push(column);
			}
		};

		service.removeFromStandardList = function (column) {
			if(typeof column === 'string'){
				if(standardColumnList.indexOf(column) !== -1){
					standardColumnList.splice(standardColumnList.indexOf(column),1);
				}
			}
		};

		service.removeFromCostUnitList = function (column) {
			if (typeof column === 'string') {
				if (itemUnitCostList.indexOf(column) !== -1) {
					itemUnitCostList.splice(standardColumnList.indexOf(column), 1);
				}
			}
		};

		service.reSetVieConfig = function (){
			standardColumnList = [
				'DescriptionInfo','CostUnit','HoursUnit','PrjLocationFk','EstAssemblyFk',
				'SortCode01Fk','SortCode02Fk','SortCode03Fk' ,'SortCode04Fk','SortCode05Fk','SortCode06Fk' ,'SortCode07Fk','SortCode08Fk','SortCode09Fk' ,'SortCode10Fk'
			];

			itemUnitCostList = [
				'EstAssemblyFk','DescriptionInfo','BasUomFk','CostUnit','HoursUnit'
			];
		};

		return service;
	}]);
})(angular);
