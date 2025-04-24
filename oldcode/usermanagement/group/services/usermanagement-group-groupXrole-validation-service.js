/**
 * Created by sandu on 07.09.2015.
 */
(function (angular) {

	/* global jjvEnvironment */
	'use strict';

	var moduleName = 'usermanagement.group';

	/**
     * @ngdoc service
     * @name usermanagementGroupXRoleValidationService
     * @description provides validation methods for GroupXRole entities
     */
	angular.module(moduleName).factory('usermanagementGroupXRoleValidationService', usermanagementGroupXRoleValidationService);

	usermanagementGroupXRoleValidationService.$inject = ['$http'];

	function usermanagementGroupXRoleValidationService($http) {

		var service = {};

		var env = jjvEnvironment();

		var SCHEME_NAME = 'usermanagementGroupXRoleScheme';

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
					url: globals.webApiBaseUrl + 'usermanagement/main/group2role/scheme'
				}
			).then(function (response) {
				env.addSchema(SCHEME_NAME, response.data);
			});
		};
		init();

		return service;
	}
})(angular);