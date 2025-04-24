(function(angular){
	'use strict';
	angular.module('estimate.main').factory('estimateMainAllowanceAreaValidationService', ['_', '$injector', 'platformDataValidationService',
		'platformRuntimeDataService',
		function(_, $injector, platformDataValidationService, platformRuntimeDataService){
			let service = {};

			service.validate = function(newItem){
				service.validateCode(newItem, null, 'Code');
			};

			service.validateCode = function validateCode(entity, value, model){
				let result = platformDataValidationService.isMandatory(value, model);
				let areas = $injector.get('estimateMainAllowanceAreaService').getList();
				if(result.valid && _.some(areas, { Code : value})){
					result = platformDataValidationService.createErrorObject('cloud.common.uniqueValueErrorMessage',{ object: 'Code'});
				}
				entity.Code = value;
				$injector.get('estimateMainAllowanceAreaValueColumnGenerator').refreshColumns();

				platformRuntimeDataService.applyValidationResult(result, entity, model);

				let estimateMainAllowanceAreaService = $injector.get('estimateMainAllowanceAreaService');

				return platformDataValidationService.finishValidation(result, entity, value, model, service, estimateMainAllowanceAreaService);
			};
			return service;
		}]);

})(angular);