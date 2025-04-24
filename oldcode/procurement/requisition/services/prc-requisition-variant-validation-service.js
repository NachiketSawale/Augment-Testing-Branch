/*
 * Created by alm on 06.09.2022.
 */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.requisition';

	angular.module(moduleName).factory('procurementRequisitionVariantValidationService', ['$translate', 'platformRuntimeDataService', 'platformDataValidationService', 'procurementRequisitionVariantService',
		function ($translate, platformRuntimeDataService, platformDataValidationService, dataService) {
			var service = {};
			service.validateCode = function (entity, value,model) {
				var validateResult = platformDataValidationService.isUnique(dataService.getList(), 'Code', value, entity.Id);
				if (!validateResult.valid) {
					validateResult.error = $translate.instant('procurement.requisition.variant.variantCodeUniqueError');
				}
				platformDataValidationService.finishValidation(validateResult, entity, value, model, service, dataService);
				dataService.fireItemModified(entity);
				return validateResult;
			};
			return service;
		}
	]);
})(angular);
