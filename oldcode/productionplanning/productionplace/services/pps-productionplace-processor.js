(function () {
	'use strict';
	var moduleName = 'productionplanning.productionplace';
	angular.module(moduleName).service('ppsProductionPlaceProcessor', [
		'platformRuntimeDataService',
		function (platformRuntimeDataService) {
			this.processItem = function processItem(item) {
				// if (item.Version > 0) {
				// 	platformRuntimeDataService.readonly(item, [{field: 'PpsProdPlaceTypeFk', readonly: true}]);
				// }
			};
		}
	]);
})();