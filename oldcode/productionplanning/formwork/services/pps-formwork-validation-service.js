(function(angular){
	'use strict';
	/* global globals, angular, _ */
	var moduleName = 'productionplanning.formwork';

	angular.module(moduleName).factory('ppsFormworkValidationService', PpsFormworkValidationService);

	PpsFormworkValidationService.$inject = ['platformDataValidationService', 'ppsFormworkDataService', 'platformRuntimeDataService', 'basicsCompanyNumberGenerationInfoService',
	'basicsLookupdataLookupDescriptorService'];

	function PpsFormworkValidationService(platformDataValidationService, dataService, platformRuntimeDataService, basicsCompanyNumberGenerationInfoService,
		basicsLookupdataService) {
		var service = {};
		service.validateCode = function (entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
		};
		service.validateBasSiteFk = function (entity, value, model) {
			value = value === 0 ? null : value;
			return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
		};

		service.validateFormworkTypeFk = function (entity, value, model) {
			value = value === 0 ? null : value;
			var res =  platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
			if ((res === true || res && res.valid) && entity.Version === 0 )
			{
				entity.Code = null;
				var readonly = false;
				//code generation
				var formworkType = basicsLookupdataService.getLookupItem('FormworkType', value);
				var categoryId = _.isNil(formworkType)?   null : formworkType.RubricCategoryFk;
				if(categoryId > 0 && basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('ppsFormworkNumberInfoService').hasToGenerateForRubricCategory(categoryId))
				{
					readonly = true;
					entity.Code = basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('ppsFormworkNumberInfoService').provideNumberDefaultText(categoryId, entity.Code);
					platformDataValidationService.removeFromErrorList(entity,'Code', service, dataService);
					platformRuntimeDataService.applyValidationResult(true, entity, 'Code');
				}
				platformRuntimeDataService.readonly(entity, [{field: 'Code', readonly: readonly}]);
			}
			return res;
		};
		return service;
	}
})(angular);