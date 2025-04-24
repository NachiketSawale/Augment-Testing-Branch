(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name basicsCustomizeTypeProcessor
	 * @function
	 *
	 * @description
	 * The basicsCustomizeTypeProcessor set the type property documentation readonly
	 */

	angular.module('basics.customize').factory('basicsCustomizeTypeProcessor', ['platformRuntimeDataService', function (platformRuntimeDataService) {

		var service = {};

		service.processItem = function processItem(type) {
			if (type) {
				var fields = [
					{
						field: 'Documentation',
						readonly: true
					}
				];
				platformRuntimeDataService.readonly(type.Documentation, fields);
			}
		};

		return service;

	}]);
})(angular);