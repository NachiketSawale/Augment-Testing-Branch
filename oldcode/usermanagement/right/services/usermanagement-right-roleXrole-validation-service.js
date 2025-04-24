/**
 * Created by sandu on 16.09.2015.
 */
(function (angular) {

	/* global jjvEnvironment */
	'use strict';

	var moduleName = 'usermanagement.right';

	/**
     * @ngdoc service
     * @name usermanagementRoleXRoleValidationService
     * @description provides validation methods for Report entities
     */
	angular.module(moduleName).factory('usermanagementRoleXRoleValidationService', usermanagementRoleXRoleValidationService);

	usermanagementRoleXRoleValidationService.$inject = ['$http'];

	function usermanagementRoleXRoleValidationService($http) {

		var service = {};

		var env = jjvEnvironment();

		var SCHEME_NAME = 'usermanagementRoleXRoleScheme';

		service.validateModel = function (entity, model, value) {
			return env.validateModel(entity, model, value, SCHEME_NAME);
		};

		service.validateEntity = function (entity) {
			return env.validateEntity(entity, SCHEME_NAME);
		};

		var init = function () {
			$http(
				{
					method: 'GET',
					url: globals.webApiBaseUrl + 'usermanagement/main/role2role/scheme'
				}
			).then(function (response) {
				env.addSchema(SCHEME_NAME, response.data);
			});
		};
		init();

		return service;
	}
})(angular);