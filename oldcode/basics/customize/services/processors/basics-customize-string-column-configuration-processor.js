(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name basicsCustomizeStringColumnConfigurationProcessor
	 * @function
	 *
	 * @description
	 * The basicsCustomizeStringColumnConfigurationProcessor set the StringColumnConfiguration property documentation readonly
	 */

	angular.module('basics.customize').factory('basicsCustomizeStringColumnConfigurationProcessor', ['platformRuntimeDataService', function (platformRuntimeDataService) {

		var service = {};

		service.processItem = function processItem(item) {
			if (item) {
				var fields = [
					{
						field: 'TableName',
						readonly: item.ModuleName ? false : true
					},
					{
						field: 'ColumnName',
						readonly: item.TableName ? false : true
					},
					{
						field: 'ColumnSize',
						readonly: item.ColumnName ? false : true
					}
				];
				platformRuntimeDataService.readonly(item, fields);
			}
		};

		return service;

	}]);
})(angular);