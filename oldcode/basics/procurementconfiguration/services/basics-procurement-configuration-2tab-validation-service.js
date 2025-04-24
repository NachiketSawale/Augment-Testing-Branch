/**
 * Created by sfi on 9/8/2015.
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.procurementconfiguration';
	angular.module(moduleName).factory('basicsProcurementConfiguration2TabValidationService',
		['platformDataValidationService', 'basicsProcurementConfiguration2TabDataService',
			function (platformDataValidationService, dataService) {
				var service = {};
				service.validateModuleTabFk = function (entity, value, model) {
					return platformDataValidationService.isUniqueAndMandatory(dataService.getList(), model, value, entity.Id);
				};
				return service;
			}]);
})(angular);