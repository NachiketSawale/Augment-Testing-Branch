(function (angular) {
	'use strict';
	var moduleName = 'basics.userform';
	angular.module(moduleName).factory('basicsUserformFormDataValidationService',
		[
			function () {
				var service = {};
				service.validateFormFk = function userFormValidator(entity, value) {
					return (value === null || value === undefined) ? false : true;
				};
				return service;
			}
		]);
})(angular);
