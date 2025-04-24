/**
 * Created by jhe on 9/26/2018.
 */
// eslint-disable-next-line func-names
// eslint-disable-next-line no-redeclare
/* global angular */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.stock';
	angular.module(moduleName).factory('createOrderProposalValidationService',
		['businessPartnerLogicalValidator', 'procurementStockOrderProposalDataService',
			// eslint-disable-next-line func-names
			function (businessPartnerLogicalValidator, orderProposalDataService) {

				var service = {};

				service.getModule = () => ({name: moduleName});

				var businessPartnerValidatorService = businessPartnerLogicalValidator.getService(
					{
						dataService: orderProposalDataService,
						BusinessPartnerFk: 'bpdBusinessPartnerFk',
						SubsidiaryFk: 'bpdSubsidiaryFk',
						SupplierFk: 'bpdSupplierFk',
						ContactFk: 'bpdContactFk'
					}
				);
				// eslint-disable-next-line func-names
				service.validateBpdBusinessPartnerFk = function (entity, value) {
					businessPartnerValidatorService.businessPartnerValidator(entity, value);
				};

				return service;
			}
		]);
})(angular);