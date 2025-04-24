(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name procurementCommonPrcItemValidationService
	 * @description provides validation methods for prcItem
	 */
	angular.module('procurement.common').factory('procurementCommonSubcontractorValidationDataService',
		['basicsLookupdataLookupDataService', 'basicsLookupdataLookupDescriptorService', 'businessPartnerLogicalValidator',
			function (lookupService, basicsLookupdataLookupDescriptorService, businessPartnerLogicalValidator) {
				return function (dataService) {
					var service = {};
					var businessPartnerValidatorService = businessPartnerLogicalValidator.getService({
						dataService: dataService,
						BusinessPartnerFk: 'BpdBusinesspartnerFk',
						SubsidiaryFk: 'BpdSubsidiaryFk',
						SupplierFk: 'BpdSupplierFk',
						ContactFk: 'BpdContactFk'
					});

					// get validators from business partner
					service.validateBpdBusinesspartnerFk = function(item, value) {
						var result = businessPartnerValidatorService.businessPartnerValidator.apply(service, arguments);
						// businessPartnerValidatorService.setDefaultContact(item, value, 'BpdContactFk').then(function(){
						// 	dataService.fireItemModified(item);
						// });
						item.BpdBusinesspartnerFk = value;
						dataService.updateReadOnly(item);
						return result;
					};

					service.validateBpdSupplierFk = businessPartnerValidatorService.supplierValidator;
					service.validateBpdSubsidiaryFk = businessPartnerValidatorService.subsidiaryValidator;

					service.validateEntity = function (entity) {
						service.validateBpdBusinesspartnerFk(entity, entity.BusinessPartnerFk);
					};

					return service;
				};
			}
		]);
})(angular);
