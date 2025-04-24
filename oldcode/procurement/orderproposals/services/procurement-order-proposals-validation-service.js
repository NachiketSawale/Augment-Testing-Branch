(function (angular) {
	'use strict';

	angular.module('procurement.orderproposals').factory('procurementOrderProposalsValidationService',
		['$translate', 'procurementOrderProposalsDataService', 'businessPartnerLogicalValidator', 'basicsLookupdataLookupDataService',
			function procurementOrderProposalsValidationService($translate, dataService, businessPartnerLogicalValidator, lookupDataService) {

				var service = {};
				var businessPartnerValidatorService = businessPartnerLogicalValidator.getService({dataService: dataService});
				service.validateSubsidiaryFk = businessPartnerValidatorService.subsidiaryValidator;
				// get validators from business partner
				service.validateBusinessPartnerFk = function (entity, value, model, isFromBasic) {
					businessPartnerValidatorService.resetArgumentsToValidate();
					businessPartnerValidatorService.businessPartnerValidator.apply(null, arguments);
				};
				service.validateSupplierFk = function (entity, value) {
					businessPartnerValidatorService.resetArgumentsToValidate();
					businessPartnerValidatorService.supplierValidator(entity, value);
					if (entity.validateSupplierFk !== value) {
						lookupDataService.getItemByKey('supplier', value).then(function (data) {
							entity.SupplierFk = value;
							if (!angular.isObject(data)) {
								return true;
							}
						}, function (error) {
							window.console.error(error);
						});
					}
				};

				return service;

			}]);
})(angular);