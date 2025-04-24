(function (angular) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';

	/**
	 * @ngdoc service
	 * @name procurementPriceComparisonTranslationService
	 *
	 * @description provides translation for procurement pricecomparison module
	 */
	angular.module(moduleName).factory('procurementPricecomparisonTranslationService', [
		'platformTranslateService', 'platformTranslationUtilitiesService',
		function (platformTranslateService, platformTranslationUtilitiesService) {

			var cloudCommonModule = 'cloud.common';
			var boqMainModule = 'boq.main';
			var procurementPriceComparisonModule = 'procurement.pricecomparison';
			var procurementCommonModule = 'procurement.common';
			var procurementRfqModule = 'procurement.rfq';
			var procurementQuoteModule = 'procurement.quote';
			var businesspartnerMainModule = 'businesspartner.main';

			var service = {instant: platformTranslateService.instant};
			var data = {
				toTranslate: {},
				translate: null,
				updateCallback: null,
				allUsedModules: [procurementPriceComparisonModule, cloudCommonModule, boqMainModule, procurementCommonModule,
					procurementRfqModule, procurementQuoteModule, businesspartnerMainModule, 'basics.material']
			};

			data.words = {
				// Header group
				supplierGroup: {location: procurementRfqModule, identifier: 'headerGroupDesiredSupplier', initial: 'Suggested Supplier'},
				deliveryRequirementsGroup: {location: procurementRfqModule, identifier: 'headerGroupDeliveryRequirements', initial: 'Delivery Requirements'},

				// Header
				RfqStatusFk: {location: cloudCommonModule, identifier: 'entityState', initial: 'Status'},
				DateRequested: {location: cloudCommonModule, identifier: 'entityDateRequested', initial: 'Requested'},
				DateReceived: {location: cloudCommonModule, identifier: 'entityReceived', initial: 'Cancelled'},
				DateCanceled: {location: cloudCommonModule, identifier: 'entityCancelled', initial: 'RFQ Header Code'},
				ProjectFk: {location: cloudCommonModule, identifier: 'entityProjectNo', initial: 'Project No.'},
				ProjectFk$ProjectName: {location: cloudCommonModule, identifier: 'entityProjectName', initial: 'Project Name'},
				ClerkPrcFk: {location: cloudCommonModule, identifier: 'entityResponsible', initial: 'Responsible'},
				ClerkPrcFk$Description: {location: cloudCommonModule, identifier: 'entityResponsibleDescription', initial: 'Responsible Description'},
				ClerkReqFk: {location: cloudCommonModule, identifier: 'entityRequisitionOwner', initial: 'Requisition Owner'},
				ClerkReqFk$Description: {location: cloudCommonModule, identifier: 'entityRequisitionOwnerDescription', initial: 'Requisition Owner Description'},
				PaymentTermFiFk: {location: cloudCommonModule, identifier: 'entityPaymentTermFI', initial: 'Payment Term (FI)'},
				PaymentTermFiFk$Description: {location: cloudCommonModule, identifier: 'entityPaymentTermFiDescription', initial: 'Payment Term (FI) Description'},
				PaymentTermPaFk: {location: cloudCommonModule, identifier: 'entityPaymentTermPA', initial: 'Payment Term (PA)'},
				PaymentTermPaFk$Description: {location: cloudCommonModule, identifier: 'entityPaymentTermPaDescription', initial: 'Payment Term (PA) Description'},
				CurrencyFk: {location: cloudCommonModule, identifier: 'entityCurrency', initial: 'Currency'},
				RfqTypeFk: {location: cloudCommonModule, identifier: 'entityType', initial: 'Type'},
				PrcContractTypeFk: {location: procurementRfqModule, identifier: 'headerPrcContractType', initial: 'Contract Type'},
				PrcAwardMethodFk: {location: cloudCommonModule, identifier: 'entityAwardMethod', initial: 'Award Method'},
				PrcConfigurationFk: {location: procurementRfqModule, identifier: 'headerConfiguration', initial: 'Configuration'},
				PrcStrategyFk: {location: procurementRfqModule, identifier: 'headerStrategy', initial: 'Strategy'},
				AwardReference: {location: procurementRfqModule, identifier: 'headerAwardReference', initial: 'Award Reference'},
				DateQuoteDeadline: {location: cloudCommonModule, identifier: 'entityDeadline', initial: 'Deadline'},
				TimeQuoteDeadline: {location: cloudCommonModule, identifier: 'entityTime', initial: 'Time'},
				LocaQuoteDeadline: {location: procurementRfqModule, identifier: 'headerLocalQuoteDeadline', initial: 'Local'},
				DateAwardDeadline: {location: procurementRfqModule, identifier: 'headerDataAwardDeadline', initial: 'Award'},

				RfqDescription: {location: procurementQuoteModule, identifier: 'headerRfqHeaderDescription', initial: 'Award'},
				Code: {location: cloudCommonModule, identifier: 'entityCode', initial: 'Award'},
				QtnDescription: {location: cloudCommonModule, identifier: 'entityDesc', initial: 'Award'},
				QtnStatus: {location: cloudCommonModule, identifier: 'entityState', initial: 'Award'},
				QtnValueNet: {location: procurementCommonModule, identifier: 'reqTotalValueNet', initial: 'Award'},
				QtnValueNetOc: {location: procurementCommonModule, identifier: 'reqTotalValueNetOc', initial: 'Award'},
				QtnValueTax: {location: procurementCommonModule, identifier: 'reqTotalValueTax', initial: 'Award'},
				QtnValueTaxOc: {location: procurementCommonModule, identifier: 'reqTotalValueTaxOc', initial: 'Award'},
				QtnVersion: {location: procurementQuoteModule, identifier: 'headerVersion', initial: 'Award'},
				BasCompany: {location: cloudCommonModule, identifier: 'entityCompany', initial: 'Award'},
				ExchangeRate: {location: cloudCommonModule, identifier: 'entityRate', initial: 'Award'},
				BpName1: {location: businesspartnerMainModule, identifier: 'name1', initial: 'Award'},
				BpName2: {location: businesspartnerMainModule, identifier: 'name2', initial: 'Award'},
				BpName3: {location: businesspartnerMainModule, identifier: 'name3', initial: 'Award'},
				BpName4: {location: businesspartnerMainModule, identifier: 'name4', initial: 'Award'},
				IsMainAddress: {location: businesspartnerMainModule, identifier: 'isMainAddress', initial: 'Award'},
				Subsidiary: {location: cloudCommonModule, identifier: 'entitySubsidiary', initial: 'Award'},
				SubsidiaryAddress: {location: cloudCommonModule, identifier: 'address', initial: 'Award'},
				SubsidiaryTelephone: {location: cloudCommonModule, identifier: 'telephoneNumber', initial: 'Award'},
				SubsidiaryTelefax: {location: cloudCommonModule, identifier: 'fax', initial: 'Award'},
				SubsidiaryMobileNo: {location: cloudCommonModule, identifier: 'mobile', initial: 'Award'},
				SupplierCode: {location: cloudCommonModule, identifier: 'entitySupplierCode', initial: 'Award'},
				DateQuoted: {location: procurementQuoteModule, identifier: 'headerDateQuoted', initial: 'Award'},
				DatePricefixing: {location: procurementQuoteModule, identifier: 'headerDataPricefixing', initial: 'Award'},
				BusinesspartnerEmail: {location: businesspartnerMainModule, identifier: 'email', initial: 'Award'},
				basicData: { location: cloudCommonModule, identifier: 'entityProperties', initial: 'Basic Data' }
			};

			// Get some predefined packages of words used in project
			platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);
			platformTranslationUtilitiesService.addHistoryTranslation(data.words);
			platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 5, 'UserDefined');

			// Convert word list into a format used by platform translation service
			data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

			// Prepare interface of service and load translations
			platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
			platformTranslationUtilitiesService.loadModuleTranslation(data);
			platformTranslationUtilitiesService.registerModules(data);

			service.loadTranslations = function loadTranslations() {
				return platformTranslationUtilitiesService.registerModules(data);
			};

			return service;
		}
	]);
})(angular);
