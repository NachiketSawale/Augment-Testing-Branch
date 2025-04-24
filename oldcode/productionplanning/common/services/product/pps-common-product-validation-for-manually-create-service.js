(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.common';

	angular.module(moduleName).factory('ppsCommonProductManuallyValidationForCreateService', ValidationService);

	ValidationService.$inject = ['$http', '$translate', 'platformDataValidationService', 'productionplanningCommonProductItemDataService'];

	function ValidationService($http, $translate, platformDataValidationService,
		dataServ) {

		var service = {};

		let isAfterDateIfEngTaskEventShared = (date) => {
			return dataServ.isAfterDateIfEngTaskEventShared(date);
		};

		let isEndDateValid = (value) => {
			const prodSetEvent = dataServ.getProductionSetEventOfPU();
			const validateBounds = prodSetEvent.DateshiftMode === 1;
			return !validateBounds || (value >= prodSetEvent.PlannedStart && value <= prodSetEvent.PlannedFinish);
		};

		function validationDatashift(entity, endDate){
			dataServ.validationDatashift(entity, endDate, false);
		}
		service.validateEndDate = function (entity, value, model, ignoreShift) {
			let res = platformDataValidationService.isMandatory(value, model, {fieldName: $translate.instant('productionplanning.common.product.endDate')});
			if (res.valid) {
				let errMsg = '';
				if(!isEndDateValid(value)){
					errMsg = 'productionplanning.common.manualProduction.errors.endDateExceed';
				}
				else if(!isAfterDateIfEngTaskEventShared(value)){
					errMsg = 'productionplanning.common.manualProduction.errors.shouldBeAfterEngineering';
				}
				else if(ignoreShift !== true) {
					validationDatashift(entity, value);
				}
				if(errMsg !== ''){
					res = platformDataValidationService.createErrorObject(errMsg, null);
				}
			}
			return platformDataValidationService.finishValidation(res, entity, value, model, service, dataServ);
		};

		service.validateProdPlaceFk = (entity, value, model) => {
			let res = platformDataValidationService.isMandatory(value, model, {fieldName: $translate.instant('productionplanning.product.productionPlace.productionPlace')});
			return platformDataValidationService.finishValidation(res, entity, value, model, service, dataServ);
		};

		return service;
	}
})(angular);

