/**
 * Created by sandu on 28.05.2015.
 *
 */
(function (angular) {
	'use strict';
	var moduleName = 'basics.config';
	/**
	 * @ngdoc service
	 * @name basicsConfigReportXGroupValidationService
	 * @description provides validation methods for ReportXGroup entities
	 */
	angular.module(moduleName).factory('basicsConfigReportXGroupValidationService', basicsConfigReportXGroupValidationService);

	basicsConfigReportXGroupValidationService.$inject = ['platformDataValidationService', 'basicsConfigReportXGroupService'];

	function basicsConfigReportXGroupValidationService(platformDataValidationService, basicsConfigReportXGroupService) {

		var service = {};

		service.validateReportFk = function validateReportFk(entity,value,model) {
			var result = {
				valid: !!value,
				apply: true
			};
			platformDataValidationService.finishValidation(result, entity, value, model, service, basicsConfigReportXGroupService);
			return result;

		};
		return service;
	}
})(angular);