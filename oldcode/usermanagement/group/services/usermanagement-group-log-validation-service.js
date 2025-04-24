/**
 * Created by sandu on 27.06.2016.
 */
(function (angular) {

	/* global jjvEnvironment */
	'use strict';

	var moduleName = 'usermanagement.group';

	/**
	 * @ngdoc service
	 * @name usermanagementGroupLogValidationService
	 * @description provides validation methods for Group entities
	 */
	angular.module(moduleName).factory('usermanagementGroupLogValidationService', usermanagementGroupLogValidationService);

	usermanagementGroupLogValidationService.$inject = ['$http'];

	function usermanagementGroupLogValidationService($http) {

		var service = {};

		var env = jjvEnvironment();

		var SCHEME_NAME = 'usermanagementGroupLogScheme';

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