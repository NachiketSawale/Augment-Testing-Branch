/**
 * Created by wui on 5/11/2015.
 */

(function (angular) {
	'use strict';

	var moduleName = 'businesspartner.certificate';
	var cloudCommonModule = 'cloud.common';

	angular.module(moduleName).value('businesspartnerCertificateTranslations', {
		'translationInfos': {
			'extraModules': [moduleName],
			'extraWords': {
				userDefText: {location: cloudCommonModule, identifier: 'UserdefTexts', initial: 'User Defined Text'},
				BusinessPartnerFk: {location: moduleName, identifier: 'businessPartner', initial: 'Business Partner'},
				ConHeaderFk: {location: moduleName, identifier: 'contractCode', initial: 'Contract Code'},
				CompanyFk: {location: moduleName, identifier: 'company', initial: 'Company'},
				CertificateStatusFk: {location: moduleName, identifier: 'status', initial: 'Status'},
				CertificateTypeFk: {location: moduleName, identifier: 'type', initial: 'Type'},
				CertificateDate: {location: moduleName, identifier: 'date', initial: 'Date'},
				Issuer: {location: moduleName, identifier: 'issuer', initial: 'Issuer'},
				BusinessPartnerIssuerFk: {location: moduleName, identifier: 'issuerBP', initial: 'Issuer Business Partner'},
				ValidFrom: {location: moduleName, identifier: 'validFrom', initial: 'Valid From'},
				ValidTo: {location: moduleName, identifier: 'validTo', initial: 'Valid To'},
				Reference: {location: cloudCommonModule, identifier: 'entityReferenceName', initial: 'Reference Name'},
				ReferenceDate: {location: moduleName, identifier: 'referenceDate', initial: 'Reference Date'},
				ProjectFk: {location: moduleName, identifier: 'project', initial: 'Project No.'},
				Amount: {location: moduleName, identifier: 'amount', initial: 'Amount'},
				CurrencyFk: {location: moduleName, identifier: 'currency', initial: 'Currency'},
				ExpirationDate: {location: moduleName, identifier: 'expirationDate', initial: 'Expiration Date'},
				RequiredDate: {location: moduleName, identifier: 'requiredDate', initial: 'Required By'},
				DischargedDate: {location: moduleName, identifier: 'dischargeDate', initial: 'Discharged Date'},
				ValidatedDate: {location: moduleName, identifier: 'validatedDate', initial: 'Validated Date'},
				CommentText: {location: cloudCommonModule, identifier: 'entityCommentText', initial: 'Comment'},
				GuaranteeCost: {location: moduleName, identifier: 'guaranteecost', initial: 'Guarantee Cost'},
				GuaranteeCostPercent: {location: moduleName, identifier: 'guaranteecostpercent', initial: 'Guarantee Cost Percent'},
				ReclaimDate1: {location: moduleName, identifier: 'reclaimdate1', initial: 'Reclaim Date 1'},
				ReclaimDate2: {location: moduleName, identifier: 'reclaimdate2', initial: 'Reclaim Date 2'},
				ReclaimDate3: {location: moduleName, identifier: 'reclaimdate3', initial: 'Reclaim Date 3'},
				Islimited: {location: moduleName, identifier: 'islimited', initial: 'Is Limited'},
				CostReimbursable: {location: moduleName, identifier: 'costreimbursable', initial: 'Cost Reimbursable'},
				CostReimbursedDate: {location: moduleName, identifier: 'costreimburseddate', initial: 'Cost Reimbursed Date'},
				OrdHeaderFk: {location: moduleName, identifier: 'orderHeader', initial: 'Sales Contract'},
				'Userdefined1': {'location': cloudCommonModule, 'identifier': 'entityUserDefined', 'initial': 'entityUserDefined', param: {'p_0': '1'}},
				'Userdefined2': {'location': cloudCommonModule, 'identifier': 'entityUserDefined', 'initial': 'entityUserDefined', param: {'p_0': '2'}},
				'Userdefined3': {'location': cloudCommonModule, 'identifier': 'entityUserDefined', 'initial': 'entityUserDefined', param: {'p_0': '3'}},
				'Userdefined4': {'location': cloudCommonModule, 'identifier': 'entityUserDefined', 'initial': 'entityUserDefined', param: {'p_0': '4'}},
				'Userdefined5': {'location': cloudCommonModule, 'identifier': 'entityUserDefined', 'initial': 'entityUserDefined', param: {'p_0': '5'}}
				// SubsidiaryFk: {location: cloudCommonModule, identifier: 'entityAddress', initial: 'Address'}
			}
		}
	});

	angular.module(moduleName).service('businesspartnerCertificateTranslationService', ['platformUIBaseTranslationService',
		'businesspartnerCertificateCertificateLayout', 'businesspartnerCertificateReminderLayout', 'businesspartnerCustomerCertificateToSubsidiaryLayout', '$q',

		function (platformUIBaseTranslationService, businesspartnerCertificateLayout,
			businesspartnerCertificateReminderLayout, businesspartnerCustomerCertificateToSubsidiaryLayout, $q) {

			var layouts = [businesspartnerCertificateLayout, businesspartnerCertificateReminderLayout, businesspartnerCustomerCertificateToSubsidiaryLayout],
				localBuffer = [];

			function TranslationService(layouts) {
				platformUIBaseTranslationService.call(this, layouts, localBuffer);
			}

			TranslationService.prototype = Object.create(platformUIBaseTranslationService.prototype);
			TranslationService.prototype.constructor = TranslationService;
			var service = new TranslationService(layouts);
			// for container information service use   module container lookup
			service.loadTranslations = function loadTranslations() {
				return $q.when(false);
			};
			return service;

		}

	]);

})(angular);
