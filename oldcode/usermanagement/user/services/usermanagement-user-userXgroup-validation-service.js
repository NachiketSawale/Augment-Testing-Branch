/**
 * Created by sandu on 31.08.2015.
 */
(function (angular) {

	/* global jjvEnvironment */
	'use strict';

	var moduleName = 'usermanagement.user';

	/**
	 * @ngdoc service
	 * @name usermanagementUserXGroupValidationService
	 * @description provides validation methods for UserXGroup entities
	 */
	angular.module(moduleName).factory('usermanagementUserXGroupValidationService', usermanagementUserXGroupValidationService);

	usermanagementUserXGroupValidationService.$inject = ['$http'];

	function usermanagementUserXGroupValidationService($http) {

		var service = {};

		var env = jjvEnvironment();

		var SCHEME_NAME = 'usermanagementUserXGroupScheme';

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
					url: globals.webApiBaseUrl + 'usermanagement/main/user2group/scheme'
				}
			).then(function (response) {
				env.addSchema(SCHEME_NAME, response.data);
			});
		};
		init();

		return service;
	}
})(angular);
