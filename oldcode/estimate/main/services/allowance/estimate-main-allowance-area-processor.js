(function(angular){
	'use strict';

	angular.module('estimate.main').factory('estimateMainAllowanceAreaProcessor', ['_', 'platformRuntimeDataService','estimateMainAllowanceAreaValueColumnGenerator',
		function(_, platformRuntimeDataService, estimateMainAllowanceAreaValueColumnGenerator){
			let service = {};

			service.processItem = function processItem(item) {
				switch (item.AreaType){
					case 1:
						break;
					case 3:
						_.forEach(estimateMainAllowanceAreaValueColumnGenerator.getAreaValueColumns(), function(column){
							platformRuntimeDataService.readonly(item, [{field: column.field, readonly: true}]);
						});
						break;
					default:
						_.forEach(Object.keys(item), function(field){
							platformRuntimeDataService.readonly(item, [{field: field, readonly: true}]);
						});
				}
			};

			service.processItems = function processItems(items) {
				angular.forEach(items, function (item) {
					service.processItem(item);
				});
			};

			return service;
		}]);
})(angular);