/**
 * Created by chi on 2/20/2021.
 */

(function (angular) {
	'use strict';

	var moduleName = 'procurement.rfq';
	angular.module(moduleName).factory('procurementRfqBidderSettingValidationService', procurementRfqBidderSettingValidationService);

	procurementRfqBidderSettingValidationService.$inject = ['procurementRfqBidderSettingService'];

	function procurementRfqBidderSettingValidationService(procurementRfqBidderSettingService) {
		var service = {};
		service.asyncValidateClerkEmailBcc = update;
		service.asyncValidateSendWithOwnMailAddress = update;
		service.asyncValidateGenerateSafeLink = update;
		service.asyncValidateDisableDataFormatExport = update;
		service.asyncValidateReplyToClerk = update;
		service.asyncValidateDisableZipping = update;
		service.asyncValidateLinkAndAttachment = update;
		service.asyncValidateFileNameFromDescription = update;
		service.asyncValidateAdditionalEmailForBCC = update;
		service.asyncValidateUseAccessTokenForSafeLink = update;
		service.asyncValidateSafeLinkLifetime = update;

		return service;

		// /////////////////////////

		function update(entity, modelValue, field) {
			entity[field] = modelValue;
			return procurementRfqBidderSettingService.update(entity);
		}
	}

})(angular);