/**
 * Created by hzh on 4/28/2017.
 */
(function (angular) {
	'use strict';
	var moduleName = 'basics.customize';
	angular.module(moduleName).service('basicsCustomizeEstAssemblyTypeValidationService',
		['$translate', 'platformRuntimeDataService', 'platformDataValidationService', 'basicsCustomizeInstanceDataService', basicsCustomizeEstAssemblyTypeValidationService]);

	function basicsCustomizeEstAssemblyTypeValidationService($translate, platformRuntimeDataService, platformDataValidationService, basicsCustomizeInstanceDataService) {

		var service = {};

		service.validateShortKeyInfo = function validateShortKeyTr(entity, newValue) {
			var result = validateField(entity, newValue, 'ShortKeyInfo');
			entity.ShortKeyInfo.Translated = newValue;
			return result;

			//var result = platformDataValidationService.validateMandatoryUniqEntity(entity, newValue, 'ShortKeyInfo', basicsCustomizeInstanceDataService.getList(), service, basicsCustomizeInstanceDataService);
			//return result ;
		};

		function handleError(entity, result, key) {
			if (!result.valid && typeof (result.valid) !== 'undefined') {
				platformRuntimeDataService.applyValidationResult(result, entity, key);
			} else {
				if (entity.__rt$data && entity.__rt$data.errors) {
					entity.__rt$data.errors = null;
				}
			}
		}

		function validateField(entity, value, key) {
			var result = true;
			switch (key) {
				case 'ShortKeyInfo' :
					if (value.length > 2) {
						result = {
							apply: false, valid: false,
							error: $translate.instant('basics.customize.estAssemblyTypeShortKeyError', {length: 2})
						};
					} else {
						//make sure the short key is unique and mandatory
						result = platformDataValidationService.validateMandatoryUniqEntity(entity, value, 'ShortKeyInfo.Translated', basicsCustomizeInstanceDataService.getList(), service, basicsCustomizeInstanceDataService);
					}
					break;
			}

			handleError(entity, result, key);
			return result;
		}

		return service;
	}
})(angular);
