(function () {
	'use strict';
	/*global globals, angular*/

	var moduleName = 'productionplanning.item';
	angular.module(moduleName).factory('ppsItemModelFilterService',[
		'productionplanningItemDataService', 'ppsCommonModelFilterService', '$http',
		function (dataService, ppsCommonModelFilterService, $http) {

			function entityIdsGetter() {
				var parentIds = dataService.getSelectedEntities().map(function (entity) {
					return entity.Id;
				});
				if(parentIds.length > 0) {
					return $http.post(globals.webApiBaseUrl + 'productionplanning/item/getChildrenIds', parentIds).then(function (response) {
						return response.data;
					});
				} else {
					return [];
				}
			}

			return ppsCommonModelFilterService.getFilterFn(moduleName, dataService, entityIdsGetter);
		}
	]);
})();