/**
 * Created by Frank Baedeker on 30.05.2016.
 */

(function (angular) {
	'use strict';
	const cloudTranslationModule = angular.module('cloud.translation');

	/**
	 * @ngdoc service
	 * @name cloudTranslationTranslationValidationService
	 * @description provides validation methods for translation translation entities
	 */
	cloudTranslationModule.service('cloudTranslationTranslationValidationService', CloudTranslationTranslationValidationService);
	CloudTranslationTranslationValidationService.$inject = ['platformDataValidationService', 'cloudTranslationTranslationDataService', 'cloudDesktopInfoService'];
	function CloudTranslationTranslationValidationService(platformDataValidationService, cloudTranslationTranslationDataService, cloudDesktopInfoService) {
		/* jshint -W040 */ // No calidation of this rule
		const self = this;

		self.validateLanguageFk = function validateLanguageFk(entity, value, model) {
			let errObj;
			if (!value) {
				errObj = platformDataValidationService.createErrorObject('cloud.common.emptyOrNullValueErrorMessage');
				return platformDataValidationService.finishValidation(errObj, entity, value, model, self, cloudTranslationTranslationDataService);
			} else {
				return platformDataValidationService.validateIsUnique(entity, value, model, cloudTranslationTranslationDataService.getList(), self, cloudTranslationTranslationDataService);
			}
		};

		self.validateIsApproved = function validateResourceFk(item, value) {
			const userName = cloudDesktopInfoService.read().userInfo ? cloudDesktopInfoService.read().userInfo.UserName : null;
			if (value === true) {
				// set the userName
				item.ApprovedBy = userName;
			} else {
				item.ApprovedBy = null;
			}
		};

	}
})(angular);
