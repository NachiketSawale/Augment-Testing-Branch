(function (angular) {
	'use strict';
	var moduleName = 'basics.pricecondition';

	angular.module(moduleName).factory('basicsPriceConditionParamValidationService', ['platformDataValidationService','platformRuntimeDataService',
		function (platformDataValidationService,platformRuntimeDataService) {

			var service = {};

			// service.validatePriceConditionTypeFk = function (entity, value, model) {
			//     var result = platformDataValidationService.isMandatory(value, model);
			//     result.apply = true;
			//     platformRuntimeDataService.applyValidationResult(result, entity, model);
			//     return result;
			// };

			return service;
		}]);

})(angular);