/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	var salesBillingModule = 'sales.billing';
	var salesCommonModule = 'sales.common';

	/**
	 * //TODO: see comment
	 * Translation service for billing payments
	 * Payments will have first an own translation service until it's clarified
	 * which translations can be reused.
	 */
	/* jshint -W106 */ // Variable name is according usage in translation json
	angular.module(salesBillingModule).value('salesBillingPaymentTranslations', {
		translationInfos: {
			'extraModules': [salesBillingModule, salesCommonModule],
			'extraWords': {
				PaymentDate: { location: salesBillingModule, identifier: 'entityPaymentDate', initial: 'Payment Date' },
				PostingDate: { location: salesBillingModule, identifier: 'entityPostingDate', initial: 'Posting Date' },
				Amount: { location: salesBillingModule, identifier: 'entityAmount', initial: 'Amount' },
				AmountVat: { location: salesBillingModule, identifier: 'entityAmountVat', initial: 'VAT Amount' },
				AmountNet: { location: salesBillingModule, identifier: 'entityAmountNet', initial: 'Net Amount' },
				DiscountAmount: { location: salesBillingModule, identifier: 'entityDiscountAmount', initial: 'Discount Amount' },
				DiscountAmountVat: { location: salesBillingModule, identifier: 'entityDiscountAmountVat', initial: 'VAT Discount Amount' },
				DiscountAmountNet: { location: salesBillingModule, identifier: 'entityDiscountAmountNet', initial: 'Net Discount Amount' },
				IsRetention: { location: salesBillingModule, identifier: 'entityIsRetention', initial: 'Is Retention' },
				CodeRetention: { location: salesBillingModule, identifier: 'entityCodeRetention', initial: 'Code Retention' },
				BankVoucherNo: { location: salesBillingModule, identifier: 'entityBankVoucherNo', initial: 'Bank Voucher No' },
				BankAccount: { location: salesBillingModule, identifier: 'entityBankAccount', initial: 'Bank Account' },
				PostingNarritive: { location: salesBillingModule, identifier: 'entityPostingNarritive', initial: 'Posting Narritive' },
				AmountOc: { location: salesBillingModule, identifier: 'entityAmountOc', initial: 'Amount Oc' },
				AmountVatOc: { location: salesBillingModule, identifier: 'entityAmountVatOc', initial: 'VAT Amount Oc' },
				AmountNetOc: { location: salesBillingModule, identifier: 'entityAmountNetOc', initial: 'Net Amount Oc' },
				DiscountAmountOc: { location: salesBillingModule, identifier: 'entityDiscountAmountOc', initial: 'Discount Amount Oc' },
				DiscountAmountVatOc: { location: salesBillingModule, identifier: 'entityDiscountAmountVatOc', initial: 'VAT Discount Amount Oc' },
				DiscountAmountNetOc: { location: salesBillingModule, identifier: 'entityDiscountAmountNetOc', initial: 'Net Discount Amount Oc' },
				IsOverPayment: { location: salesBillingModule, identifier: 'entityIsOverPayment', initial: 'Is Over Payment' },
				BankEntryNo: { location: salesBillingModule, identifier: 'entityBankEntryNo', initial: 'Bank entry No.' },
				PaymentStatusFk: { location: salesBillingModule, identifier: 'entityPaymentStatusFk', initial: 'Payment Status' }
			}
		}
	});

	/**
	 * @ngdoc service
	 * @name salesBillingPaymentTranslationService
	 * @description provides payment translation for sales billing module
	 */
	angular.module(salesBillingModule).service('salesBillingPaymentTranslationService', ['platformUIBaseTranslationService', 'salesBillingPaymentTranslations', 'salesCommonTranslations',
		function (platformUIBaseTranslationService, salesBillingPaymentTranslations, salesCommonTranslations) {
			var localBuffer = {};
			platformUIBaseTranslationService.call(this, [salesCommonTranslations, salesBillingPaymentTranslations], localBuffer);
		}
	]);

})();
