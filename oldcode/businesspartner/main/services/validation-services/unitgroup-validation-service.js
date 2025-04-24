/**
 * Created by lcn on 5/7/2019.
 */
(function (angular) {
	'use strict';
	var moduleName = 'businesspartner.main';
	/* jshint -W072 */
	angular.module(moduleName).factory('businessPartnerMainUnitgroupValidationService', ['platformDataValidationService', 'businessPartnerMainUnitgroupDataService', 'businessPartnerMainUnitgroupDataService', 'businessPartnerMainUnitgroupReadOnlyProcessor', 'platformRuntimeDataService', '$translate', function (platformDataValidationService, businessPartnerMainUnitgroupDataService, dataService, readOnlyProcessor, platformRuntimeDataService, $translate) {

		var service = {};

		service.validateControllinggroupFk = function validateControllinggroupFk(entity, value, model) {
			if (value === 0) {
				value = null;
				entity.ControllinggroupFk = null;
			}
			if (entity.ControllinggroupFk !== value) {
				entity.ControllinggroupFk = value;
				entity.ControllinggrpdetailFk = null;
				service.validateControllinggrpdetailFk(entity, null, 'ControllinggrpdetailFk');
			}
			readOnlyProcessor.processItem(entity);
			dataService.fireItemModified(entity);
			var fieldName = $translate.instant('businesspartner.main.ControllinggroupFk');
			var result = platformDataValidationService.isMandatory(value, model, {fieldName: fieldName});
			platformRuntimeDataService.applyValidationResult(result, entity, model);
			return platformDataValidationService.finishValidation(result, entity, value, model, service, businessPartnerMainUnitgroupDataService);

		};

		service.validateControllinggrpdetailFk = function validateControllinggrpdetailFk(entity, value, model) {
			if (value === 0) {
				value = null;
			}
			var fieldName = $translate.instant('businesspartner.main.ControllinggrpdetailFk');
			var result = platformDataValidationService.isMandatory(value, model, {fieldName: fieldName});
			platformRuntimeDataService.applyValidationResult(result, entity, model);
			return platformDataValidationService.finishValidation(result, entity, value, model, service, businessPartnerMainUnitgroupDataService);
		};

		return service;
	}]);
})(angular);