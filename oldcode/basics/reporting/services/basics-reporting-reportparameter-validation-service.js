/**
 * Created by sandu on 09.06.2015.
 */
(function (angular) {

	/* global jjvEnvironment */
	'use strict';

	var moduleName = 'basics.reporting';

	/**
     * @ngdoc service
     * @name basicsReportingReportParameterValidationService
     * @description provides validation methods for ModuleTab entities
     */
	angular.module(moduleName).factory('basicsReportingReportParameterValidationService', basicsReportingReportParameterValidationService);

	basicsReportingReportParameterValidationService.$inject = ['$http'];

	function basicsReportingReportParameterValidationService($http) {

		var service = {};

		var env = jjvEnvironment();

		var SCHEME_NAME = 'basicsReportingModuleReportParameterScheme';

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
					url: globals.webApiBaseUrl + 'basics/reporting/reportparameter/scheme'
				}
			).then(function (response) {
				env.addSchema(SCHEME_NAME, response.data);
			});
		};
		init();

		return service;
	}
})(angular);