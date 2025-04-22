/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	var salesBidModule = 'sales.bid';
	var salesContractModule = 'sales.contract';
	var salesBillingModule = 'sales.billing';
	var billingschemaModule= 'basics.billingschema';
	var basicsCustomizeModule = 'basics.customize';
	var procurementRfqModule = 'procurement.rfq';
	var procurementCommon = 'procurement.common';
	var basicsUserFormModule = 'basics.userform';
	var estimateMainModule = 'estimate.main';
	var cloudCommonModule = 'cloud.common';
	var modelEvaluationModule = 'model.evaluation';
	var modelMainModule = 'model.main';
	var modelSimulationModule = 'model.simulation';
	var modelViewerModule = 'model.viewer';
	var ppsHeader = 'productionplanning.header';
	var basicSite = 'basics.site';
	var ppsCommon = 'productionplanning.common';

	/* jshint -W106 */ // Variable name is according usage in translation json
	angular.module(salesBidModule).value('salesBidTranslations', {
		translationInfos: {
			'extraModules': [salesBidModule, salesContractModule, salesBillingModule, billingschemaModule, basicsCustomizeModule, procurementRfqModule, procurementCommon, 'sales.common', 'project.main', 'boq.main', 'cloud.common', 'basics.common', 'basics.clerk', 'businesspartner.main', basicsUserFormModule, estimateMainModule,
				modelEvaluationModule, modelMainModule, modelSimulationModule, modelViewerModule, ppsHeader, basicSite, ppsCommon],
			'extraWords': {

				TypeFk: { location: salesBidModule, identifier: 'entityBidTypeFk', initial: 'Type' },
				BidStatusFk: { location: salesBidModule, identifier: 'entityBidStatusFk', initial: 'BidStatusFk' },
				QuoteDate: { location: salesBidModule, identifier: 'entityQuoteDate', initial: 'QuoteDate' },
				BidHeaderFk: { location: salesBidModule, identifier: 'entityBidHeaderFk', initial: 'BidHeaderFk' },
				EstHeaderFk: { location: estimateMainModule, identifier: 'estHeaderFk', initial: 'Estimate' },

				AmountNet: { location: salesBillingModule, identifier: 'entityAmountNet', initial: 'Net Amount' },
				AmountGross: { location: salesBillingModule, identifier: 'entityAmountGross', initial: 'Gross Amount' },
				AmountNetOc: { location: salesBillingModule, identifier: 'entityAmountNetOc', initial: 'Net Amount Oc' },
				AmountGrossOc: { location: salesBillingModule, identifier: 'entityAmountGrossOc', initial: 'Gross Amount Oc' },

				DocumentType: { location: salesBidModule, identifier: 'entityDocumentType', initial: 'Document Type' },

				// group "Contract Probability"
				contractProbability: { location: salesBidModule, identifier: 'contractProbability', initial: 'Contract Probability' },
				OrdPrbltyPercent: { location: salesBidModule, identifier: 'entityOrdPrbltyPercent', initial: 'Contract Probability (in %)' },
				// combination of last valuation date and user who updated the probability
				OrdPrbltyLastvalDateAndWhoupd: { location: salesBidModule, identifier: 'entityOrdPrbltyLastvalDateAndWhoupd', initial: 'Last Valuation' },

				CredFactor: {location: billingschemaModule, identifier: 'credFactor', initial: 'Cred Factor'},
				DebFactor: {location: billingschemaModule, identifier: 'debFactor', initial: 'Deb Factor'},
				DetailAuthorAmountFk: {location: billingschemaModule, identifier: 'billingschmdtlaafk', initial: 'Author.Amount Ref'},
				BillingSchemaDetailTaxFk: {location: billingschemaModule, identifier: 'billingSchmDtlTaxFk', initial: 'Tax Ref'},
				CredLineTypeFk: {location: billingschemaModule, identifier: 'creditorlinetype', initial: 'Treatment Cred'},
				DebLineTypeFk: {location: billingschemaModule, identifier: 'debitorlinetype', initial: 'Treatment Deb'},
				DateEffective:{location: 'basics.common', identifier: 'dateEffective', initial: 'Date Effective'},
				PrcIncotermFk: {location: cloudCommonModule, identifier: 'entityIncoterms', initial: '*Incoterms'},
				BpdContactFk: {location: 'project.main', identifier: 'entityContact', initial: '*Contact'},
				BasSalesTaxMethodFk: {location: salesBillingModule, identifier: 'entityBasSalesTaxMethodFk', initial: 'Sales Tax Method'},
				PrcTexttypeFk: { location: salesBidModule, identifier: 'headerText.prcTextType', initial: 'Text Type'},
				BasTextModuleTypeFk: { location: salesBidModule, identifier: 'bastextmoduletype', initial: 'Text Module Type'},
				baseGroup: { location: cloudCommonModule, identifier: 'entityProperties', initial: 'Basic Data'}
			}
		}
	});

	/**
	 * @ngdoc service
	 * @name salesBidTranslationService
	 * @description provides translation for sales bid module
	 */
	angular.module(salesBidModule).service('salesBidTranslationService', ['platformUIBaseTranslationService', 'salesBidTranslations', 'salesCommonTranslations', 'salesBidBillingSchemaTranslations',
		'salesCommonCertificateLayout', 'businesspartnerCertificateToSalesLayout',
		function (platformUIBaseTranslationService, salesBidTranslations, salesCommonTranslations, salesBidBillingSchemaTranslations,
			salesCommonCertificateLayout, businesspartnerCertificateToSalesLayout) {
			var localBuffer = {};
			platformUIBaseTranslationService.call(this, [salesCommonTranslations, salesBidTranslations, salesBidBillingSchemaTranslations, salesCommonCertificateLayout,
				businesspartnerCertificateToSalesLayout], localBuffer);
		}

	]);

})();
