(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.recording';
	/**
	 * @ngdoc service
	 * @name timekeepingRoundingConfigDetailProcessService
	 * @function
	 *
	 * @description
	 * This service provides Timekeeping Rounding Detail Process Service for dialog.
	 */
	angular.module(moduleName).factory('timekeepingRoundingConfigDetailProcessService',
		['platformRuntimeDataService',
			function (platformRuntimeDataService) {
				function processItem(item, isConfigReadonly) {
					if(!item){
						return;
					}
					let fields = [
						{field: 'ColumnId', readonly: true},
						{field: 'UiDisplayTo', readonly: isConfigReadonly|| false},
						{field: 'IsWithoutRounding', readonly: isConfigReadonly || false},
						{field: 'RoundTo', readonly: isConfigReadonly || item.IsWithoutRounding},
						{field: 'RoundToFk', readonly: true},
						{field: 'RoundingMethodFk', readonly: true}
					];
					platformRuntimeDataService.readonly(item, fields);
				}

				function processItems(items, isConfigReadonly) {
					if(!items)
					{
						return;
					}

					items = angular.isArray(items) ? items : [items];
					angular.forEach(items, function (item) {
						processItem(item, isConfigReadonly);
					});
				}

				return {
					processItem : processItem,
					processItems: processItems
				};
			}]);
})(angular);
