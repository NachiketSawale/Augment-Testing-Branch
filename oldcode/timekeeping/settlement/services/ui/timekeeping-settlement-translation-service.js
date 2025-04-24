/**
 * Created by Sudarshan on 30.08.2022
 */

(function (angular) {
	'use strict';

	// Modules, beside my own in alphabetic order
	let timekeepingSettlementModule = 'timekeeping.settlement';
	let logisticSundryServiceModule='logistic.sundryservice';
	let basicsCommonModule = 'basics.common';
	let cloudCommonModule = 'cloud.common';

	/**
	 * @ngdoc service
	 * @name timekeepingSettlementTranslationService
	 * @description Provides translations for the module.
	 */

	/* jshint -W106 */ // letiable name is forced by translation json file
	angular
		.module(timekeepingSettlementModule)
		.service(
			'timekeepingSettlementTranslationService',
			TimekeepingSettlementTranslationService
		);

	TimekeepingSettlementTranslationService.$inject = [
		'platformTranslationUtilitiesService',
	];

	function TimekeepingSettlementTranslationService(
		platformTranslationUtilitiesService
	) {
		let service = this;
		let data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [
				timekeepingSettlementModule,
				logisticSundryServiceModule,
				basicsCommonModule,
				cloudCommonModule,
			],
		};

		data.words = {
			SettlementNo: {
				location: timekeepingSettlementModule,
				identifier: 'SettlementNo'
			},
			SettlementRecipientNo:{
				location: timekeepingSettlementModule,
				identifier: 'SettlementRecipientNo'
			},
			Number: {
				location: timekeepingSettlementModule,
				identifier: 'number'
			},
			ClerkFk: {
				location: timekeepingSettlementModule,
				identifier: 'clerkFk'
			},
			DivisionFk: {
				location: timekeepingSettlementModule,
				identifier: 'divisionFk'
			},

			CompanyFk: { location: timekeepingSettlementModule, identifier: 'companyfk' },
			ProjectFk: { location: cloudCommonModule, identifier: 'entityProject' },
			LanguageFk: { location: timekeepingSettlementModule, identifier: 'language' },
			SettlementStatusFK: {
				location: timekeepingSettlementModule,
				identifier: 'statusfk'
			},
			VoucherTypeFk: {
				location: timekeepingSettlementModule,
				identifier: 'vouchertype'
			},
			InvoiceTypeFk: {
				location: timekeepingSettlementModule,
				identifier: 'billinvoicetype'
			},
			CurrencyFk: { location: timekeepingSettlementModule, identifier: 'entityCurrency' },
			ExchangeRate: { location: timekeepingSettlementModule, identifier: 'entityRate' },
			BusinessPartnerFk: {
				location: timekeepingSettlementModule,
				identifier: 'businessPartner'
			},
			SubsidiaryFk: {
				location: timekeepingSettlementModule,
				identifier: 'entitySubsidiary'
			},

			CustomerFk: {
				location: timekeepingSettlementModule,
				identifier: 'customer'
			},
			TaxCodeFk: { location: timekeepingSettlementModule, identifier: 'taxcode' },
			PaymentTermFk: {
				location: timekeepingSettlementModule,
				identifier: 'paymentTerm'
			},
			JobTypeFk: { location: timekeepingSettlementModule, identifier: 'jobtype' },
			PerformedFrom: {
				location: timekeepingSettlementModule,
				identifier: 'performedFrom'
			},
			PerformedTo: {
				location: timekeepingSettlementModule,
				identifier: 'performedTo'
			},
			business: {
				location: timekeepingSettlementModule,
				identifier: 'business'
			},
			billing: { location: timekeepingSettlementModule, identifier: 'billing' },
			ControllingUnitFk: {
				location: cloudCommonModule,
				identifier: 'entityControllingUnit'
			},
			Price: { location: timekeepingSettlementModule, identifier: 'price' },

			BookingText: {
				location: timekeepingSettlementModule,
				identifier: 'bookingText'
			},
			Iscanceled: { location: timekeepingSettlementModule, identifier: 'IsCanceled' },
			PostingDate: {location: cloudCommonModule, identifier: 'entityPostingDate' },
			ControllingUnitCode: {
				location: cloudCommonModule,
				identifier: 'entityControllingUnit'
			},
			Currency: { location: cloudCommonModule, identifier: 'entityCurrency' },
			CompanyChargedFk: {
				location: timekeepingSettlementModule,
				identifier: 'companyCharged'
			},
			ControllingUnitRevenueFk: {
				location: timekeepingSettlementModule,
				identifier: 'controllingUnitRevenue'
			},


			VatGroupFk: {
				location: timekeepingSettlementModule,
				identifier: 'entityVatGroupFk'
			},
			SupplierFk: {
				location: timekeepingSettlementModule,
				identifier: 'supplier'
			},
			SettlementDate: {
				location: timekeepingSettlementModule,
				identifier: 'SettlementDate'
			},
			SettlementTargetNo: {
				location: timekeepingSettlementModule,
				identifier: 'SettlementTargetNo'
			},
			PerformeFrom: {
				location: timekeepingSettlementModule,
				identifier: 'PerformeFrom'
			},
			PerformeTo: {
				location: timekeepingSettlementModule,
				identifier: 'PerformeTo'
			},
			PeriodFk: {
				location: timekeepingSettlementModule,
				identifier: 'PeriodFk'
			},
			UomFk: {
				location: timekeepingSettlementModule,
				identifier: 'UomFk'
			},

			SettledFrom: {
				location: timekeepingSettlementModule,
				identifier: 'SettledFrom'
			},
			SettledTo:{
				location: timekeepingSettlementModule,
				identifier: 'SettledTo'
			},


		};

		// Get some predefined packages of words used in project
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words,'basicData');
		platformTranslationUtilitiesService.addHistoryTranslation(data.words);
		platformTranslationUtilitiesService.addTranslationServiceInterface(
			service,
			data
		);
		platformTranslationUtilitiesService.loadModuleTranslation(data);
		platformTranslationUtilitiesService.registerModules(data);
	}
})(angular);
