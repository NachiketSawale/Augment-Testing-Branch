(function (angular) {
	'use strict';
	var modName = 'procurement.invoice';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(modName).factory('procurementInvoiceTranslationService', ['platformUIBaseTranslationService', '$q',
		'procurementInvoiceLayout', 'procurementInvoicePesLayout', 'procurementInvoiceOtherLayout', 'procurementInvoiceRejectionLayout',
		'procurementInvoiceContractLayout', 'procurementInvoiceGeneralLayout',
		'procurementInvoiceHeader2HeaderLayout', 'procurementCommonBillingSchemaLayout', 'procurementInvoiceCertificateLayout',
		'procurementInvoiceImportResultLayout', 'procurementInvoicePaymentLayout', 'procurementInvoiceValidationLayout', 'procurementInvoiceTransactionLayout','businesspartnerCertificateToInvoiceLayout',
		'procurementInvoiceAccountAssignmentLayout','procurementInvoiceAccrualLayout','procurementInvoiceIcTransactionLayout',
		function (PlatformUIBaseTranslationService, $q, procurementInvoiceLayout, procurementInvoicePesLayout, procurementInvoiceOtherLayout,
			procurementInvoiceRejectionLayout, procurementInvoiceContractLayout, procurementInvoiceGeneralLayout, procurementInvoiceHeader2HeaderLayout,
			procurementCommonBillingSchemaLayout, procurementInvoiceCertificateLayout, procurementInvoiceImportResultLayout, procurementInvoicePaymentLayout,
			procurementInvoiceValidationLayout, procurementInvoiceTransactionLayout, businesspartnerCertificateToInvoiceLayout,
			procurementInvoiceAccountAssignmentLayout,procurementInvoiceAccrualLayout,procurementInvoiceIcTransactionLayout) {

			function MyTranslationService(layout) {
				PlatformUIBaseTranslationService.call(this, layout);
			}

			MyTranslationService.prototype = Object.create(PlatformUIBaseTranslationService.prototype);
			MyTranslationService.prototype.constructor = MyTranslationService;

			var service = new MyTranslationService(
				[
					procurementInvoicePesLayout,
					procurementInvoiceOtherLayout,
					procurementInvoiceRejectionLayout,
					procurementInvoiceContractLayout,
					procurementInvoiceGeneralLayout,
					procurementInvoiceHeader2HeaderLayout,
					procurementCommonBillingSchemaLayout,
					procurementInvoiceCertificateLayout,
					procurementInvoiceImportResultLayout,
					procurementInvoicePaymentLayout,
					procurementInvoiceValidationLayout,
					procurementInvoiceTransactionLayout,
					businesspartnerCertificateToInvoiceLayout,
					procurementInvoiceLayout,
					procurementInvoiceAccountAssignmentLayout,
					procurementInvoiceAccrualLayout,
					procurementInvoiceIcTransactionLayout
				]
			);

			// for container information service use
			service.loadTranslations = function loadTranslations() {
				return $q.when(false);
			};

			return service;
		}

	]);

})(angular);