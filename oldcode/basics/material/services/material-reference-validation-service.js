(function (angular) {
	'use strict';

	angular.module('basics.material').service('basicsMaterialReferenceValidationService', ['basicsMaterialReferenceDataService','platformDataValidationService','platformRuntimeDataService','$translate','basicsLookupdataLookupDataService','$q',
		function(dataService,platformDataValidationService, platformRuntimeDataService,$translate,lookupService,$q){
			var service ={};
			service.validateMdcMaterialCatalogFk = function (entity, value, model) {
				var mdcMaterialCatalogTranslation = $translate.instant('basics.material.record.materialCatalog');
				var result = {apply: true, valid: true};
				if (!value) {
					result.valid = false;
					result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: mdcMaterialCatalogTranslation});
				}
				platformRuntimeDataService.applyValidationResult(result, entity, model);
				return platformDataValidationService.finishValidation(result,entity,value,model,service,dataService);
			};

			service.validateMdcMaterialAltFk = function (entity, value, model) {
				var mdcMaterialTranslation = $translate.instant('basics.material.record.material');
				var result = {apply: true, valid: true};
				if (!value) {
					result.valid = false;
					result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: mdcMaterialTranslation});
				}
				platformRuntimeDataService.applyValidationResult(result, entity, model);
				return platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
			};


			service.asyncValidateMdcMaterialAltFk = function (entity, value, model) {
				var defer = $q.defer();
				if (value) {
					lookupService.getItemByKey('MaterialCommodity', value).then(function (response) {
						var materialItem = response;
						entity.MdcMaterialCatalogFk = materialItem.MdcMaterialCatalogFk;
						service.validateMdcMaterialCatalogFk(entity,entity.MdcMaterialCatalogFk,'MdcMaterialCatalogFk');
						dataService.fireItemModified(entity);
						defer.resolve();
					});
				}
				return defer.promise;
			};


			dataService.registerEntityCreated(function(e, item){
				service.validateMdcMaterialCatalogFk(item, item.MdcMaterialCatalogFk,'MdcMaterialCatalogFk');
				service.validateMdcMaterialAltFk(item, item.MdcMaterialAltFk, 'MdcMaterialAltFk');
			});
			return service;

		}]);

})(angular);
