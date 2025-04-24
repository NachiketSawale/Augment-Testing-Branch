/**
 * Created by sandu on 02.04.2015.
 */

(function (angular) {

	/* global jjvEnvironment */
	'use strict';

	var moduleName = 'basics.config';

	/**
     * @ngdoc service
     * @name basicsConfigTabValidationService
     * @description provides validation methods for ModuleTab entities
     */
	angular.module(moduleName).factory('basicsConfigTabValidationService', basicsConfigTabValidationService);

	basicsConfigTabValidationService.$inject = ['$http'];

	function basicsConfigTabValidationService($http) {

		var service = {};

		var env = jjvEnvironment();

		var SCHEME_NAME = 'basicsConfigModuleTabScheme';

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
					url: globals.webApiBaseUrl + 'basics/config/tab/scheme'
				}
			).then(function (response) {
				env.addSchema(SCHEME_NAME, response.data);
			});
		};
		init();

		return service;
	}
})(angular);

