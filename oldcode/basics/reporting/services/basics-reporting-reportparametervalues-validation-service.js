/**
 * Created by sandu on 07.05.2015.
 */
(function (angular) {

	/* global jjvEnvironment */
	'use strict';

	var moduleName = 'basics.reporting';

	/**
     * @ngdoc service
     * @name basicsReportingReportParameterValuesValidationService
     * @description provides validation methods for ReportParameter entities
     */
	angular.module(moduleName).factory('basicsReportingReportParameterValuesValidationService', basicsReportingReportParameterValuesValidationService);

	basicsReportingReportParameterValuesValidationService.$inject = ['$http'];

	function basicsReportingReportParameterValuesValidationService($http) {

		var service = {};

		var env = jjvEnvironment();

		var SCHEME_NAME = 'basicsReportingModuleReportParameterValuesScheme';

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
					url: globals.webApiBaseUrl + 'basics/reporting/reportparametervalues/scheme'
				}
			).then(function (response) {
				env.addSchema(SCHEME_NAME, response.data);
			});
		};
		init();

		return service;
	}
})(angular);