/**
 * Created by Helmut Buck on 07.05.2015.
 */

(function () {
	/* global */
	'use strict';

	var moduleName = 'boq.wic';

	/**
	 * @ngdoc service
	 * @name boqWicCatBoqValidationService
	 * @description provides validation methods for wic cat boq entities
	 */
	angular.module(moduleName).factory('boqWicCatBoqValidationService', ['$injector', 'platformDataValidationService', 'businessPartnerLogicalValidator',
		function ($injector, platformDataValidationService, businessPartnerLogicalValidator) {

			var service = {};

			var dataService = $injector.get('boqWicCatBoqService');

			service.validateBoqRootItem$Reference = function (entity, value) {

				var items = dataService.getList();

				return platformDataValidationService.validateMandatoryUniqEntity(entity, value, 'BoqRootItem.Reference', items, service, dataService);
			};

			service.validateWicCatBoq$ValidFrom = function (entity, value, model) {
				if (!entity.ValidTo) {
					return true;
				}
				const validFrom = new Date(value);
				const validTo = new Date(entity.ValidTo);
				return platformDataValidationService.validatePeriod(validFrom, validTo, entity, model, service, dataService, 'WicBoq.ValidTo');
			};

			service.validateWicCatBoq$ValidTo = function (entity, value, model) {
				if (!entity.ValidFrom) {
					return true;
				}
				const validFrom = new Date(entity.ValidFrom);
				const validTo = new Date(value);
				return platformDataValidationService.validatePeriod(validFrom, validTo, entity, model, service, dataService, 'WicBoq.ValidFrom');
			};

			var businessPartnerValidatorService = businessPartnerLogicalValidator.getService({
				dataService: dataService,
				needLoadDefaultSupplier: true,
				BusinessPartnerFk: 'BpdBusinessPartnerFk',
				SubsidiaryFk: 'BpdSubsidiaryFk',
				SupplierFk: 'BpdSupplierFk'
			});

			// get validators from business partner
			service.validateWicCatBoq$BpdBusinessPartnerFk = function (entity, value) {
				var result = businessPartnerValidatorService.businessPartnerValidator(entity.WicBoq, value);
				businessPartnerValidatorService.GetDefaultSupplier(entity.WicBoq, value).then(function(){
					dataService.markItemAsModified(entity);
				});
				return result;
			};
			service.validateWicCatBoq$BpdSubsidiaryFk = function (entity, value) {
				return businessPartnerValidatorService.subsidiaryValidator(entity.WicBoq, value);
			};
			service.validateWicCatBoq$BpdSupplierFk = function (entity, value) {
				return businessPartnerValidatorService.supplierValidator(entity.WicBoq, value);
			};

			return service;
		}
	]);

})();