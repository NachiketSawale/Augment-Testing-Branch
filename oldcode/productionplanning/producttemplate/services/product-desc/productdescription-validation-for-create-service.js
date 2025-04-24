(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.producttemplate';

	angular.module(moduleName).factory('productionplanningProducttemplateProductDescriptionValidationForCreateService', ValidationService);

	ValidationService.$inject = ['platformDataValidationService', 'productionplanningProducttemplateMainService'];

	function ValidationService(platformDataValidationService,
		dataServ) {

		var service = {};
		service.validateCode = function (entity, value, model) {
			var res = platformDataValidationService.validateMandatory(entity, value, model, service, dataServ);
			//Warning: Codes below are temporarily fix, caused by the malfunctioned validation methods.
			if(res.valid){
				if(entity.__rt$data && entity.__rt$data.errors && entity.__rt$data.errors.Code){
					delete entity.__rt$data.errors.Code;
				}
			}
			return res;
		};
		service.validateMdcProductDescriptionFk = function (entity, value, model) {

			var res = value ? platformDataValidationService.createSuccessObject() : platformDataValidationService.createErrorObject('cloud.common.emptyOrNullValueErrorMessage', {fieldName: ''});

			return platformDataValidationService.finishValidation(res, entity, value, model, service, dataServ);
		};

		service.validateEngDrawingFk = function (entity, value, model) {

			var res = value ? platformDataValidationService.createSuccessObject() : platformDataValidationService.createErrorObject('cloud.common.emptyOrNullValueErrorMessage', {fieldName: ''});

			return platformDataValidationService.finishValidation(res, entity, value, model, service, dataServ);
		};

		return service;
	}
})(angular);

