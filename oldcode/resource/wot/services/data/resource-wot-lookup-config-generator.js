(function (angular) {
	'use strict';
	var moduleName = 'resource.wot';

	/**
	 * @ngdoc service
	 * @name ResourceWotLookupConfigGenerator
	 * @description provides a lookupConfigHelper Functions to generate a WOT Lookup
	 */
	angular.module(moduleName).service('resourceWotLookupConfigGenerator', ResourceWotLookupConfigGenerator);

	ResourceWotLookupConfigGenerator.$inject = ['basicsLookupdataConfigGenerator', '_'];

	function ResourceWotLookupConfigGenerator(basicsLookupdataConfigGenerator, _) {
		var self = this;


		self.provideWotLookupOverloadFilteredByPlant = function provideWotLookupOverloadFilteredByPlant(showClear, plantPropertyName, filterKey ) {
			return basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
				dataServiceName: 'resourceWorkOperationTypePlantFilterLookupDataService',
				showClearButton: !!showClear,
				filterKey: filterKey,
				filter: function (entity) {
					var accessor = plantPropertyName && _.isString(plantPropertyName) ? plantPropertyName : 'PlantFk';
					var plantFk = null;
					if (entity && entity[accessor]) {
						plantFk = entity[accessor];
					}
					return plantFk;
				}
			}, {
				required: !showClear
			});
		};

		self.provideWotLookupOverloadFilteredByPlantType = function provideWotLookupOverloadFilteredByPlantType(showClear, plantPropertyName, appendCurrentWot, filterKey) {
			return basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
				dataServiceName: 'resourceWorkOperationTypePlantTypeFilterLookupDataService',
				showClearButton: !!showClear,
				filterKey: filterKey,
				filter: function (entity) {
					var accessor = plantPropertyName && _.isString(plantPropertyName) ? plantPropertyName : 'PlantTypeFk';
					const filters = {};
					filters.plantTypeFk = null;
					if (entity && entity[accessor]) {
						filters.plantTypeFk = entity[accessor];
					}

					if (appendCurrentWot) {
						filters.currentWotFk = entity.WorkOperationTypeFk;
					}

					return filters;
				}
			}, {
				required: !showClear
			});
		};
	}
})(angular);
