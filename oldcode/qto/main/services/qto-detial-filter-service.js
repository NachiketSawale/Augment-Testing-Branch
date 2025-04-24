(function (angular){
	'use strict';
	/* global _ */
	let moduleName = 'qto.main';

	angular.module(moduleName).factory('qtoDetailDataFilterService', ['$injector', 'estimateCommonFilterServiceProvider', function ($injector, estimateCommonFilterServiceProvider){
		let service = estimateCommonFilterServiceProvider.getInstance('qto','main');

		let structure2FilterIds = [];
		let noNeedLoadDataFlag = false;

		service.setFilterIds = function setFilterIds(key, ids) {
			structure2FilterIds = ids;
			let dataService = $injector.get('qtoMainDetailService');
			if (dataService && !noNeedLoadDataFlag) {
				if (_.isFunction(dataService.load)) {
					dataService.load();
				}
			}
		};

		service.getAllFilterIds = function getAllFilterIds() {
			return structure2FilterIds;
		};

		service.resetFilter = function (){
			structure2FilterIds = [];
		};

		let baseRemoveFilter = service.removeFilter;

		service.removeFilter = function removeFilter(id) {
			baseRemoveFilter(id);
			service.setFilterIds('', []);
		};

		service.clearFilter = function (){
			noNeedLoadDataFlag = true;
			baseRemoveFilter('qtoCostGroupCatalogController');
			structure2FilterIds=[];
			noNeedLoadDataFlag  = false; //  need reset the flag
		};

		return service;
	}]);

})(angular);