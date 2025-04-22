/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	var salesContractModule = 'sales.contract';
	var salesCommonModule = 'sales.common';
	var salesBillingModule = 'sales.billing';
	var basicsCommonModule = 'basics.common';
	var cloudCommonModule = 'cloud.common';
	var projectMainModule = 'project.main';
	var estimateMainModule = 'estimate.main';
	var businesspartnerMainModule = 'businesspartner.main';
	var boqMainModule = 'boq.main';
	var billingschemaModule= 'basics.billingschema';
	var basicsCustomizeModule = 'basics.customize';
	var salesBidModule = 'sales.bid';
	var basicsClerkModule = 'basics.clerk';
	var procurementRfqModule = 'procurement.rfq';
	var basicsCostCodesModule = 'basics.costcodes';
	var basicsBankModule = 'basics.bank';
	var basicsUserFormModule = 'basics.userform';
	var basicsProcurementstructure = 'basics.procurementstructure';
	var modelEvaluationModule = 'model.evaluation';
	var modelMainModule = 'model.main';
	var modelSimulationModule = 'model.simulation';
	var modelViewerModule = 'model.viewer';

	/* jshint -W106 */ // Variable name is according usage in translation json
	angular.module(salesContractModule).value('salesContractTranslations', {
		translationInfos: {
			'extraModules': [salesContractModule, salesCommonModule, salesBillingModule, projectMainModule, cloudCommonModule, basicsCommonModule, businesspartnerMainModule, boqMainModule, estimateMainModule, billingschemaModule, basicsCustomizeModule, salesBidModule, basicsClerkModule, procurementRfqModule, basicsCostCodesModule, basicsBankModule, basicsUserFormModule, basicsProcurementstructure,
				modelEvaluationModule, modelMainModule, modelSimulationModule, modelViewerModule],
			'extraWords': {

				TypeFk: { location: salesContractModule, identifier: 'entityContractTypeFk', initial: 'Type' },
				IsFramework: { location: salesContractModule, identifier: 'IsFramework', initial: 'Is Framework' },
				IsFreeItemsAllowed: { location: salesContractModule, identifier: 'IsFreeItemsAllowed', initial: 'New Items Allowed' },
				BoqWicCatFk: { location: salesContractModule, identifier: 'entityFwBoqWicCatFk', initial: 'Framework WIC Group' },
				BoqWicCatBoqFk: { location: salesContractModule, identifier: 'entityFwBoqWicCatBoqFk', initial: 'Framework WIC BoQ' },
				generalSettingsData: { location: salesContractModule, identifier: 'generalSettingsData', initial: 'General Settings for WIPs' },
				deliveryRequirements: { location: salesContractModule, identifier: 'deliveryRequirements', initial: 'Delivery Requirements' },
				WipTypeFk: { location: salesContractModule, identifier: 'entityWipTypeFk', initial: 'WIP Type' },
				RevisionApplicable: { location: salesContractModule, identifier: 'entityRevisionApplicable', initial: 'Revision Applicable' },
				WipFirst: { location: salesContractModule, identifier: 'entityWipFirst', initial: 'WIP First' },
				WipDuration: { location: salesContractModule, identifier: 'entityWipDuration', initial: 'WIP Duration' },
				IsDays: { location: salesContractModule, identifier: 'entityIsDays', initial: 'Is Days' },
				WipCurrent: { location: salesContractModule, identifier: 'entityWipCurrent', initial: 'WIP Current' },
				WipFrom: { location: salesContractModule, identifier: 'entityWipFrom', initial: 'WIP From' },
				WipUntil: { location: salesContractModule, identifier: 'entityWipUntil', initial: 'WIP Until' },
				IsWarrenty: { location: salesContractModule, identifier: 'entityIsWarrenty', initial: 'Is Warrenty' },
				WarrantyAmount: { location: salesContractModule, identifier: 'entityWarrantyAmount', initial: 'Warrenty Amount' },
				OrdWarrentyTypeFk: { location: salesContractModule, identifier: 'entityOrdWarrentyTypeFk', initial: 'Warrenty Type' },
				IsDiverseDebitorsAllowed: { location: salesContractModule, identifier: 'isDiverseDebitorsAllowed', initial: 'Is diverse debitors allowed'},

				AmountNet: { location: salesBillingModule, identifier: 'entityAmountNet', initial: 'Net Amount' },
				AmountGross: { location: salesBillingModule, identifier: 'entityAmountGross', initial: 'Gross Amount' },
				AmountNetOc: { location: salesBillingModule, identifier: 'entityAmountNetOc', initial: 'Net Amount Oc' },
				AmountGrossOc: { location: salesBillingModule, identifier: 'entityAmountGrossOc', initial: 'Gross Amount Oc' },

				DocumentType: { location: salesContractModule, identifier: 'entityDocumentType', initial: 'Document Type' },

				OrdStatusFk: { location: salesContractModule, identifier: 'entityOrdStatusFk', initial: 'OrdStatusFk' },
				OrderDate: { location: salesContractModule, identifier: 'entityOrderDate', initial: 'OrderDate' },
				OrderNoCustomer: { location: salesContractModule, identifier: 'entityOrderNoCustomer', initial: 'OrderNoCustomer' },
				ProjectnoCustomer: { location: salesContractModule, identifier: 'entityProjectNoCustomer', initial: 'ProjectnoCustomer' },

				// override translations from common and use 'change order' translation here
				PrjChangeFk : { location: salesCommonModule, identifier: 'entityChangeOrder', initial: 'Change Order'},
				PrjChangeStatusFk : { location: salesCommonModule, identifier: 'entityChangeOrderStatus', initial: 'Change Order-Status'},

				BidHeaderFk: { location: salesContractModule, identifier: 'entityBidHeaderFk', initial: 'BidHeaderFk' },
				OrdHeaderFk: { location: salesContractModule, identifier: 'entityOrdHeaderFk', initial: 'Main Contract' },
				FrameworkContractFk: { location: salesContractModule, identifier: 'entityFrameworkContractFk', initial: 'Framework Contract' },
				OrdHeaderCode: { location: salesContractModule, identifier: 'entityOrdHeaderCode', initial: 'Main Contract-Code' },
				OrdHeaderDescription: { location: salesContractModule, identifier: 'entityOrdHeaderDescription', initial: 'Main Contract-Description' },
				EstHeaderFk: { location: salesContractModule, identifier: 'entityEstHeaderFk', initial: 'Estimate' },

				CredFactor: {location: billingschemaModule, identifier: 'credFactor', initial: 'Cred Factor'},
				DebFactor: {location: billingschemaModule, identifier: 'debFactor', initial: 'Deb Factor'},
				DetailAuthorAmountFk: {location: billingschemaModule, identifier: 'billingschmdtlaafk', initial: 'Author.Amount Ref'},
				BillingSchemaDetailTaxFk: {location: billingschemaModule, identifier: 'billingSchmDtlTaxFk', initial: 'Tax Ref'},
				CredLineTypeFk: {location: billingschemaModule, identifier: 'creditorlinetype', initial: 'Treatment Cred'},
				DebLineTypeFk: {location: billingschemaModule, identifier: 'debitorlinetype', initial: 'Treatment Deb'},
				DateEffective:{location: basicsCommonModule, identifier: 'dateEffective', initial: 'Date Effective'},

				BankFk: {location: basicsBankModule, identifier: 'entityBank', initial: 'Bank'},
				PrcIncotermFk: {location: cloudCommonModule, identifier: 'entityIncoterms', initial: 'Incoterms'},
				ContactFk: {location: 'project.main', identifier: 'entityContact', initial: '*Contact'},
				IndividualPerformance: {location: salesContractModule, identifier: 'entityIndividualPerformance', initial: 'Individual Performance'},
				Start: {location: salesContractModule, identifier: 'entityStart', initial: 'Start'},
				End: {location: salesContractModule, identifier: 'entityEnd', initial: 'End'},
				QtoHeaderCode: {location: salesContractModule, identifier: 'entityQtoCode', initial: 'Qto'},
				QtoHeaderDescription: {location: salesContractModule, identifier: 'entityQtoDescription', initial: 'Qto Description'},
				QtoHeaderFk: {location: salesContractModule, identifier: 'entityQtoHeaderFk', initial: 'Qto Header'},
				BasSalesTaxMethodFk: {location: salesBillingModule, identifier: 'entityBasSalesTaxMethodFk', initial: 'Sales Tax Method'},
				AddressEntity: { location: cloudCommonModule, identifier: 'entityDeliveryAddress', initial: 'Delivery Address'},
				BillToFk: {location: 'project.main', identifier: 'billToEntity', initial: 'Bill To'},
				PrcTexttypeFk: { location: salesBidModule, identifier: 'headerText.prcTextType', initial: 'Text Type'},
				BasTextModuleTypeFk: { location: salesBidModule, identifier: 'bastextmoduletype', initial: 'Text Module Type'},
				baseGroup: { location: cloudCommonModule, identifier: 'entityProperties', initial: 'Basic Data'},
				IsNotAccrualPrr:{location: salesContractModule, identifier: 'IsNotAccrualPrr', initial: 'Is Not Accrual'},
				IsCanceled: { location: salesContractModule, identifier: 'entityIsCanceled', initial: 'Is Canceled' },
				IsBillOptionalItems: { location: salesContractModule, identifier: 'IsBillOptionalItems', initial: 'Bill altern. / opt. items' },
				BillingMethodFk: { location: salesContractModule, identifier: 'BillingMethodFk', initial: 'Billing Method' }
			}
		}
	});

	/**
	 * @ngdoc service
	 * @name salesContractTranslationService
	 * @description provides translation for sales contract module
	 */
	angular.module(salesContractModule).service('salesContractTranslationService', ['platformUIBaseTranslationService', 'salesContractTranslations', 'salesCommonTranslations', 'salesContractBillingSchemaTranslations',
		'salesCommonCertificateLayout', 'salesOrdPaymentScheduleLayout', 'businesspartnerCertificateToSalesLayout', 'salesOrdTransactionLayout', 'salesContractAdvanceDetailLayout', 'ordMandatoryDeadlineLayout', 'salesWipTranslations', 'salesBillingTranslations','salesContractValidationConfigurationService',
		function (platformUIBaseTranslationService, salesContractTranslations, salesCommonTranslations, salesContractBillingSchemaTranslations,
			salesCommonCertificateLayout, salesOrdPaymentScheduleLayout, businesspartnerCertificateToSalesLayout, salesOrdTransactionLayout, salesContractAdvanceDetailLayout, ordMandatoryDeadlineLayout, salesWipTranslations, salesBillingTranslations,salesContractValidationConfigurationService) {
			var localBuffer = {};
			platformUIBaseTranslationService.call(this, [salesCommonTranslations, salesContractTranslations, salesContractBillingSchemaTranslations, salesCommonCertificateLayout,
				salesOrdPaymentScheduleLayout, businesspartnerCertificateToSalesLayout, salesOrdTransactionLayout, salesContractAdvanceDetailLayout, ordMandatoryDeadlineLayout, salesWipTranslations, salesBillingTranslations,salesContractValidationConfigurationService], localBuffer);
		}

	]);

})();
