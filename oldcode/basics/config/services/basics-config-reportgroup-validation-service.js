/**
 * Created by sandu on 23.04.2015.
 */
(function (angular) {

	/* global jjvEnvironment */
	'use strict';

	var moduleName = 'basics.config';

	/**
     * @ngdoc service
     * @name basicsConfigReportGroupValidationService
     * @description provides validation methods for Report entities
     */
	angular.module(moduleName).factory('basicsConfigReportGroupValidationService', basicsConfigReportGroupValidationService);

	basicsConfigReportGroupValidationService.$inject = ['$http'];

	function basicsConfigReportGroupValidationService($http) {

		var service = {};

		var env = jjvEnvironment();

		var SCHEME_NAME = 'basicsConfigReportGroupScheme';

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
					url: globals.webApiBaseUrl + 'basics/config/reportgroup/scheme'
				}
			).then(function (response) {
				env.addSchema(SCHEME_NAME, response.data);
			});
		};
		init();

		return service;
	}
})(angular);
