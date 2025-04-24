/**
 * Created by sandu on 16.01.2019.
 */
(function (angular) {

	/* global jjvEnvironment */
	'use strict';

	var moduleName = 'basics.config';

	/**
     * @ngdoc service
     * @name basicsConfigMcTwoQnAValidationService
     * @description provides validation methods for McTwoQnA entities
     */
	angular.module(moduleName).factory('basicsConfigMcTwoQnAValidationService', basicsConfigMcTwoQnAValidationService);

	basicsConfigMcTwoQnAValidationService.$inject = ['$http'];

	function basicsConfigMcTwoQnAValidationService($http) {

		var service = {};

		var env = jjvEnvironment();

		var SCHEME_NAME = 'basicsConfigMcTwoQnAScheme';

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
					url: globals.webApiBaseUrl + 'basics/config/mctwoqna/scheme'
				}
			).then(function (response) {
				env.addSchema(SCHEME_NAME, response.data);
			});
		};
		init();

		return service;
	}
})(angular);
