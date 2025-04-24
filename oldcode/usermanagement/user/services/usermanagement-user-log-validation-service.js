/**
 * Created by sandu on 28.06.2016.
 */
(function (angular) {

	/* global jjvEnvironment */
	'use strict';

	var moduleName = 'usermanagement.user';

	/**
	 * @ngdoc service
	 * @name usermanagementUserLogValidationService
	 * @description provides validation methods for User entities
	 */
	angular.module(moduleName).factory('usermanagementUserLogValidationService', usermanagementUserLogValidationService);

	usermanagementUserLogValidationService.$inject = ['$http'];

	function usermanagementUserLogValidationService($http) {

		var service = {};

		var env = jjvEnvironment();

		var SCHEME_NAME = 'usermanagementUserLogScheme';

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
					url: globals.webApiBaseUrl + 'usermanagement/main/log/scheme'
				}
			).then(function (response) {
				env.addSchema(SCHEME_NAME, response.data);
			});
		};
		init();

		return service;
	}
})(angular);