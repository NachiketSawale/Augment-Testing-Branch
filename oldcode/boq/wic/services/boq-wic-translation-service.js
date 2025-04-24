/**
 * Created by bh on 05.05.2015.
 */
(function () {
	/* global */
	'use strict';

	var boqWicModule = 'boq.wic';
	var boqMainModule = 'boq.main';
	var cloudCommonModule = 'cloud.common';
	var basicsConfig = 'basics.config';
	var basicsClerk = 'basics.clerk';
	var basicsCompanyModule = 'basics.company';
	var projectStructureModel = 'project.structures';
	var prcContractModule = 'procurement.contract';
	var basicsCustomizeModule = 'basics.customize';

	/**
	 * @ngdoc service
	 * @name boqWicTranslationService
	 * @description provides translation for boq wic module
	 */
	angular.module(boqWicModule).service('boqWicTranslationService', ['platformUIBaseTranslationService', 'platformTranslationUtilitiesService',
		function (platformUIBaseTranslationService, platformTranslationUtilitiesService) {

			var boqWicTranslations = {
				translationInfos: {
					'extraModules': [boqWicModule, cloudCommonModule, boqMainModule, basicsConfig, basicsClerk, basicsCompanyModule, projectStructureModel, prcContractModule, basicsCustomizeModule],
					'extraWords': {
						wicGroupListTitle: {location: boqWicModule, identifier: 'wicGroupListTitle', initial: 'WIC Groups'},
						wicTab: {location: boqWicModule, identifier: 'wicTab', initial: 'WIC'},
						Reference: {location: boqMainModule, identifier: 'Reference', initial: 'Reference'},
						ExternalCode: {location: boqMainModule, identifier: 'ExternalCode', initial: 'External Code'},
						BriefInfo: {location: boqMainModule, identifier: 'BriefInfo', initial: 'Outline Specification'},
						IsDisabled: {location: boqMainModule, identifier: 'IsDisabled', initial: 'Disabled'},
						MdcMaterialCatalogFk: {location: boqWicModule, identifier: 'MdcMaterialCatalogFk', initial: 'WIC Framework'},
						BasCurrencyFk: {location: cloudCommonModule, identifier: 'entityCurrency', initial: 'Currency'},
						IsGCBoq: {location: boqMainModule, identifier: 'IsGCBoq', initial: 'GC BoQ'},
						Comment: {location: cloudCommonModule, identifier: 'entityComment', initial: 'Comments'},
						CopyTemplateOnly: {location: boqWicModule, identifier: 'CopyTemplateOnly', initial: 'Copy Template Only'},
						BpdBusinessPartnerFk: {location: cloudCommonModule, identifier: 'entityBusinessPartner', initial: 'Business Partner'},
						BpdSubsidiaryFk: {location: cloudCommonModule, identifier: 'entitySubsidiary', initial: 'Subsidiary'},
						BpdSupplierFk: {location: cloudCommonModule, identifier: 'entitySupplierCode', initial: 'SupplierCode'},
						BasPaymentTermFk: {location: cloudCommonModule, identifier: 'entityPaymentTermPA', initial: 'PaymentTermPA'},
						BasPaymentTermFiFk: {location: cloudCommonModule, identifier: 'entityPaymentTermFI', initial: 'Payment Term (FI)'},
						BasPaymentTermAdFk: {location: cloudCommonModule, identifier: 'entityPaymentTermAD', initial: 'Payment Term (AD)'},
						BasClerkFk: {location: prcContractModule, identifier: 'ConHeaderProcurementOwnerCode', initial: 'Responsible'},
						MdcWicTypeFk: { location: basicsCustomizeModule, identifier: 'wictype', initial: 'WIC Type' },
						ValidFrom: { location: cloudCommonModule, identifier: 'entityValidFrom'},
						ValidTo: { location: cloudCommonModule, identifier: 'entityValidTo'},
						ConHeaderFk: {location: cloudCommonModule, identifier: 'cloud.common.entityContract', initial: 'Contract'},
						OrdHeaderFk: {location: boqWicModule, identifier: 'OrdHeaderFk', initial: 'Sales Contract'},
						BpdCustomerFk: {location: cloudCommonModule, identifier: 'entityCustomer', initial: 'Customer'},
					}
				}
			};

			// Get some predefined packages of words used in project
			platformTranslationUtilitiesService.addClerkContainerTranslations(boqWicTranslations.translationInfos.extraWords);

			var translationService = {
				// overload: special handling of e.g. 'BoqRootItem.Reference'
				getTranslationInformation: function getTranslationInformation(key) {
					var information = translationService.words[key];
					if (angular.isUndefined(information) || (information === null)) {
						// Remove prefix from key that's supposed to be separated by a dot and check again.
						key = key.substring(key.indexOf('.') + 1);
						information = translationService.words[key];
					}
					return information;
				}
			};

			platformUIBaseTranslationService.call(this, [boqWicTranslations], translationService);
		}
	]);

})();