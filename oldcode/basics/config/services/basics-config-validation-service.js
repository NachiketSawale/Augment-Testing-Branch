/**
 * Created by sandu on 02.04.2015.
 */
(function (angular) {
	/* global jjvEnvironment */
	'use strict';

	/**
     * @ngdoc service
     * @name basicsConfigValidationService
     * @description provides validation methods for module instances
     */
	angular.module('basics.config').factory('basicsConfigValidationService', basicsConfigValidationService);

	basicsConfigValidationService.$inject = ['$http'];

	function basicsConfigValidationService($http) {

		var service = {};

		var env = jjvEnvironment();

		var BASICS_MODULE = 'basicsconfigscheme';

		service.validateModel = function (entity, model, value) {
			return env.validateModel(entity, model, value, BASICS_MODULE);
		};

		service.validateEntity = function (entity) {
			return env.validateEntity(entity, BASICS_MODULE);
		};

		var init = function () {
			$http(
				{
					method: 'GET',
					url: globals.webApiBaseUrl + 'basics/config/scheme'
				}
			).then(function (response) {
				env.addSchema(BASICS_MODULE, response.data);
			});
		};
		init();

		return service;
	}
})(angular);
