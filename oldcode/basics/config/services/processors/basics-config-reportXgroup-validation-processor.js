/**
 * Created by sandu on 04.02.2016.
 */
(function (angular) {
	'use strict';
	angular.module('basics.config').factory('basicsConfigReportXGroupValidationProcessor', basicsConfigReportXGroupValidationProcessor);
	basicsConfigReportXGroupValidationProcessor.$inject = ['platformRuntimeDataService', '$injector'];
	function basicsConfigReportXGroupValidationProcessor(platformRuntimeDataService, $injector) {
		var service = {};
		service.validate = function validate(items) {
			if (items.Version === 0) {
				$injector.invoke(['basicsConfigReportXGroupValidationService', function (basicsConfigReportXGroupValidationService) {
					basicsConfigReportXGroupValidationService.validateReportFk(items, null, 'ReportFk');
				}]);
			}
		};
		return service;
	}
})(angular);