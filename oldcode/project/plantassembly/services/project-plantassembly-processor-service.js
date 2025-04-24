/**
 * $Id:$
 * Copyright (c) RIB Software SE
 */


(function (angular) {
	'use strict';
	let moduleName = 'project.plantassembly';

	angular.module(moduleName).factory('projectPlantAssemblyProcessor',  ['platformRuntimeDataService', function(platformRuntimeDataService){

		let service= {
			processItem : processItem
		};

		function processItem(item) {
			if(!item){
				return;
			}
			let flag = false;
			let fields = [
				{field: 'QuantityFactor1', readonly: flag},
				{field: 'QuantityFactor2', readonly: flag},
				{field: 'QuantityFactor3', readonly: flag},
				{field: 'QuantityFactor4', readonly: flag},
				{field: 'CostFactor1', readonly: flag},
				{field: 'CostFactor2', readonly: flag},
				{field: 'PlantAssemblyTypeFk', readonly: item.EstAssemblyFk}
			];
			platformRuntimeDataService.readonly(item, fields);
		}

		return service;
	}]);

})(angular);
