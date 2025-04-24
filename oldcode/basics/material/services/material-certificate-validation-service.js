/**
 * Created by clv on 3/12/2018.
 */
(function(angular){

	'use strict';
	var moduleName = 'basics.material';

	angular.module(moduleName).factory('basicsMaterial2CertificateValidationService', basicsMaterial2CertificateValidationService);

	basicsMaterial2CertificateValidationService.$inject = ['_', 'platformDataValidationService', 'platformRuntimeDataService',
		'basicsMaterial2CertificateDataService', '$translate'];
	function basicsMaterial2CertificateValidationService(_, platformDataValidationService, platformRuntimeDataService, dataService, $translate){

		var service = {};

		service.validatePrcStructureFk = validatePrcStructureFk;
		service.validateBpdCertificateTypeFk = validateBpdCertificateTypeFk;
		dataService.registerEntityCreated(onEntityCreated);

		return service;
		function validatePrcStructureFk(entity, value, model){
			var result = {apply: true, valid: true};
			if(value === null || value < 1){
				result.valid = false;
				result.error$tr$ = 'cloud.common.ValidationRule_ForeignKeyRequired';
				result.error$tr$param$ = {p_0: $translate.instant('basics.material.materialSearchLookup.htmlTranslate.structure')};
			}
			platformRuntimeDataService.applyValidationResult(result, entity, model);
			return platformDataValidationService.finishValidation(result,entity,value,model,service,dataService);
		}

		function validateBpdCertificateTypeFk(entity, value, model){
			var result = {apply: true, valid: true};
			if(value === null || value < 1){
				result.valid = false;
				result.error$tr$ = 'cloud.common.ValidationRule_ForeignKeyRequired';
				result.error$tr$param$ = {p_0: $translate.instant('basics.material.certificate.type')};
			}else{
				var items = dataService.getList();
				var duplicItem = _.find(items, function(item){
					return item.BpdCertificateTypeFk === value && item.Id !== entity.Id;
				});
				if(duplicItem !== undefined && duplicItem !== null){
					result.valid = false;
					result.error$tr$ = 'cloud.common.uniqueValueErrorMessage';
					result.error$tr$param$ = {object: $translate.instant('basics.material.certificate.type')};
				}
			}
			platformRuntimeDataService.applyValidationResult(result, entity, model);
			return platformDataValidationService.finishValidation(result,entity,value,model,service,dataService);
		}

		function onEntityCreated(e, item){
			service.validatePrcStructureFk(item, item.PrcStructureFk,'PrcStructureFk');
			service.validateBpdCertificateTypeFk(item, item.BpdCertificateTypeFk, 'BpdCertificateTypeFk');
		}
	}
})(angular);