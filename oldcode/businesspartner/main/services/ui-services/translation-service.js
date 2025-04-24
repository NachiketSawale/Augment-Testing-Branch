/**
 * Created by chi on 4/16/2015.
 */
(function (angular) {
	'use strict';

	var moduleName = 'businesspartner.main';

	/**
	 * @ngdoc service
	 * @name businesspartnerMainTranslationService
	 * @description provides translation for this module
	 */
	angular.module(moduleName).service('businesspartnerMainTranslationService', ['$q', 'platformUIBaseTranslationService', 'businesspartnerMainRealestateLayout', 'businesspartnerMainBankLayout', 'businessPartnerMainContactLayout',
		'businessPartnerMainBusinessPartner2CompanyLayout', 'businesspartnerMainCustomerLayout', 'businesspartnerMainSupplierLayout', 'businesspartnerMainActivityLayout', 'businessPartnerMainSubsidiaryLayout',
		'businesspartnerMainHeaderLayout', 'businesspartnerCertificateToBpLayout', 'businessPartnerEvaluationDetailLayout',
		'businessPartnerEvaluationItemDataDetailLayout', 'businessPartnerEvaluationGroupDataDetailLayout', 'businesspartnerMainProcurementStructureLayout', 'businessPartnerRelationLayout', 'businesspartnerMainAgreementLayout',
		'businessPartnerCustomerCompanyLayout', 'businessPartnerSupplierCompanyLayout', 'businessPartnerEvaluationDocumentDataDetailLayout', 'businessPartnerGuarantorLayout', 'businessPartnerMainBusinessPartner2ExternalLayout', 'businessPartnerMainGeneralsLayout', 'businessPartnerMainUnitgroupLayout',
		'businesspartnerMainUpdateRequestLayout', 'businessPartnerMainCommunityLayout','businessPartnerMainExtRoleLayout',
		/* jshint -W072 */
		function ($q, platformUIBaseTranslationService, businesspartnerMainRealestateLayout, businesspartnerMainBankLayout, businessPartnerMainContactLayout,
			businessPartnerMainBusinessPartner2CompanyLayout, businesspartnerMainCustomerLayout, businesspartnerMainSupplierLayout, businesspartnerMainActivityLayout, businessPartnerMainSubsidiaryLayout,
			businesspartnerMainHeaderLayout, businesspartnerMainCertificateLayout, businessPartnerEvaluationDetailLayout,
			businessPartnerEvaluationItemDataDetailLayout, businessPartnerEvaluationGroupDataDetailLayout, businesspartnerMainProcurementStructureLayout, businessPartnerRelationLayout, businesspartnerMainAgreementLayout,
			businessPartnerCustomerCompanyLayout, businessPartnerSupplierCompanyLayout, businessPartnerEvaluationDocumentDataDetailLayout, businessPartnerGuarantorLayout, businessPartnerMainBusinessPartner2ExternalLayout, businessPartnerMainGeneralsLayout, businessPartnerMainUnitgroupLayout,
			businesspartnerMainUpdateRequestLayout, businessPartnerMainCommunityLayout,businessPartnerMainExtRoleLayout) {
			var layouts = [businesspartnerMainRealestateLayout, businesspartnerMainBankLayout, businessPartnerMainContactLayout,
				businessPartnerMainBusinessPartner2CompanyLayout, businesspartnerMainCustomerLayout, businesspartnerMainSupplierLayout, businesspartnerMainActivityLayout, businessPartnerMainSubsidiaryLayout,
				businesspartnerMainHeaderLayout, businesspartnerMainCertificateLayout, businessPartnerEvaluationDetailLayout,
				businessPartnerEvaluationItemDataDetailLayout, businessPartnerEvaluationGroupDataDetailLayout, businesspartnerMainProcurementStructureLayout, businessPartnerRelationLayout, businesspartnerMainAgreementLayout,
				businessPartnerCustomerCompanyLayout, businessPartnerSupplierCompanyLayout, businessPartnerEvaluationDocumentDataDetailLayout, businessPartnerGuarantorLayout, businessPartnerMainBusinessPartner2ExternalLayout, businessPartnerMainGeneralsLayout, businessPartnerMainUnitgroupLayout,
				businesspartnerMainUpdateRequestLayout, businessPartnerMainCommunityLayout,businessPartnerMainExtRoleLayout];
			var localBuffer = {};

			function TranslationService(layouts) {
				platformUIBaseTranslationService.call(this, layouts, localBuffer);
			}

			TranslationService.prototype = Object.create(platformUIBaseTranslationService.prototype);
			TranslationService.prototype.constructor = TranslationService;
			var service = new TranslationService(layouts);

			// platformUIBaseTranslationService.call(this, layouts, localBuffer);
			// for container information service use   module container lookup
			service.loadTranslations = function loadTranslations() {
				return $q.when(false);
			};
			return service;
		}
	]);

})(angular);