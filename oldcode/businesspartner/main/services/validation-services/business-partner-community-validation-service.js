/**
 * Created by chi on 07.12.2021.
 */
(function (angular) {

	'use strict';

	var moduleName = 'businesspartner.main';

	angular.module(moduleName).factory('businessPartnerMainCommunityValidationService', businessPartnerMainCommunityValidationService);

	businessPartnerMainCommunityValidationService.$inject = [
		'$injector',
		'platformDataValidationService',
		'businessPartnerLogicalValidator',
		'$translate',
		'platformRuntimeDataService',
		'_'];

	function businessPartnerMainCommunityValidationService(
		$injector,
		platformDataValidationService,
		businessPartnerLogicalValidator,
		$translate,
		platformRuntimeDataService,
		_) {

		var service = {};

		service.validateBidderFk = validateBidderFk;
		service.validatePercentage = validatePercentage;

		return service;

		// //////////////////////////////////

		function validateBidderFk(entity, value, model) {
			var dataService = getDataService();
			var tempValue = value;
			if (value === 0 || value === -1) {
				tempValue = null;
			}
			var list = dataService.getList();
			var result = platformDataValidationService.validateMandatoryUniqEntity(entity, tempValue, model, list, service, dataService);

			if (result.valid) {
				var parentService = dataService.parentService();
				var parentItem = parentService.getSelected();
				if (parentItem && parentItem.Id === value) {
					result.valid = false;
					result.apply = true;
					result.error$tr$ = 'businesspartner.main.community.error.bpSelfForbidden';
				}
			}

			if (result.valid) {
				var bpValidatorService = businessPartnerLogicalValidator.getService({dataService: dataService, needLoadDefaultSupplier: false});
				bpValidatorService.businessPartnerValidator(entity, value);
			}
			return result;
		}
		function validatePercentage(entity, value, model) {
			let result = {apply: true, valid: true};
			let dataService = getDataService();
			let nowShowData = dataService.getList();
			if (nowShowData&&nowShowData.length>0) {
				let countPercent = 0;
				for (let i = 0; i < nowShowData.length; i++) {
					if (nowShowData[i].Id === entity.Id) {
						countPercent += value;
					} else {
						countPercent += nowShowData[i].Percentage;
					}
				}
				// region count no equal 100
				if (countPercent !== 100&&countPercent !== 0) {
					result.valid = false;
					result.error = $translate.instant('businesspartner.main.PercentageCountError');
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
					return result;
				}
				// endregion
				// region clean other row error
				_.forEach(nowShowData, function (item) {
					platformRuntimeDataService.applyValidationResult(result, item, model);
					platformDataValidationService.finishValidation(result, item, value, model, service, dataService);
				});
				dataService.gridRefresh();
				// endregion
			}
			platformRuntimeDataService.applyValidationResult(result, entity, model);
			platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
			return result;
		}
		function getDataService() {
			return $injector.get('businessPartnerMainCommunityService');
		}
	}

})(angular);