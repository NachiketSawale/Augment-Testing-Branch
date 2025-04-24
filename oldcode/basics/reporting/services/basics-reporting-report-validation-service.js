/**
 * Created by sandu on 09.06.2015.
 */

(function (angular) {
	'use strict';

	var moduleName = 'basics.reporting';
	/**
	 * @ngdoc service
	 * @name basicsReportingReportValidationService
	 * @description provides validation methods for Report entities
	 */
	angular.module(moduleName).factory('basicsReportingReportValidationService', basicsReportingReportValidationService);

	basicsReportingReportValidationService.$inject = ['platformDataValidationService', 'basicsReportingMainReportService', '$translate'];

	function basicsReportingReportValidationService(platformDataValidationService, basicsReportingMainReportService) {
		var service = {};

		/*service.asyncValidateReportName = function asyncValidateReportName(entity, value, model){
			return platformDataValidationService.isAsyncUnique(globals.webApiBaseUrl + 'basics/reporting/report/isunique', entity, value, model).then(function(response){
				if (!entity[model] && angular.isObject(response)) {
					response.apply = true;
				}
				return platformDataValidationService.finishAsyncValidation(response, entity, value, model, null, service, basicsReportingMainReportService);
			});
		};*/

		return service;
	}
})(angular);

