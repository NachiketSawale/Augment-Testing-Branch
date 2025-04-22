/*
* clv
* */
(function(angular){

	'use strict';
	var moduleName = 'sales.common';
	angular.module(moduleName).factory('salesCommonCertificateValidationService', salesCommonCertificateValidationService);
	salesCommonCertificateValidationService.$inject = ['_', '$translate', 'platformDataValidationService', 'platformRuntimeDataService'];
	function salesCommonCertificateValidationService(_, $translate, platformDataValidationService, platformRuntimeDataService){

		return function getValidationService(dataService){

			dataService.registerEntityCreated(onEntityCreated);
			var service = {};
			service.validateBpdCertificateTypeFk = validateBpdCertificateTypeFk;
			return service;

			function validateBpdCertificateTypeFk(entity, value, model) {

				var result = {valid: true, apply: true};
				if (!value || value === -1) {

					result.valid = false;
					let fieldName = $translate.instant('cloud.common.entityType');
					result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: fieldName});
				} else {

					var itemList = dataService.getList();
					var item = _.find(itemList, {BpdCertificateTypeFk: value});
					if (item && item.Id !== entity.Id) {
						result.valid = false;
						let fieldName = $translate.instant('cloud.common.entityType');
						result.error = $translate.instant('cloud.common.uniqueValueErrorMessage', {object: fieldName});
					}
				}

				platformRuntimeDataService.applyValidationResult(result, entity, model);
				return platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
			}

			// noinspection JSUnusedLocalSymbols
			function onEntityCreated(e, item) {
				service.validateBpdCertificateTypeFk(item, item.BpdCertificateTypeFk, 'BpdCertificateTypeFk');
			}

		};
	}

})(angular);
