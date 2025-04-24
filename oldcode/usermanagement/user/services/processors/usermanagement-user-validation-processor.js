/**
 * Created by sandu on 17.11.2015.
 */
(function (angular) {
	'use strict';
	angular.module('usermanagement.user').factory('usermanagementUserValidationProcessor', usermanagementUserValidationProcessor);
	usermanagementUserValidationProcessor.$inject = ['platformRuntimeDataService', '$injector'];

	function usermanagementUserValidationProcessor(platformRuntimeDataService, $injector) {
		var service = {};
		service.validate = function validate(items) {
			if (items.Version === 0) {
				$injector.invoke(['usermanagementUserValidationService', function (usermanagementUserValidationService) {
					usermanagementUserValidationService.validateLogonName(items, null, 'LogonName');
				}]);
			}
		};
		return service;
	}
})(angular);
