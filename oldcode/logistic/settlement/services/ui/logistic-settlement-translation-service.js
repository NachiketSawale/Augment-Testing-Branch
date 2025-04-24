/**
 * Created by baf on 14.03.2018
 */

(function (angular) {

	'use strict';
	var logisticSettlementModule = 'logistic.settlement';
	var logisticDispatchingModule = 'logistic.dispatching';
	var logisticSundryServiceModule = 'logistic.sundryservice';
	var logisticJobModule = 'logistic.job';
	var cloudCommonModule = 'cloud.common';
	var basicsBillingSchemaModule = 'basics.billingschema';
	var basicsCustomizeModule = 'basics.customize';
	var projectMainModule = 'project.main';
	var resourceWotModule = 'resource.wot';

	/**
	 * @ngdoc service
	 * @name logisticSettlementTranslationService
	 * @description provides translation methods for logistic settlement module
	 */
	angular.module(logisticSettlementModule).service('logisticSettlementTranslationService', LogisticSettlementTranslationService);

	LogisticSettlementTranslationService.$inject = ['_', 'platformTranslationUtilitiesService'];

	function LogisticSettlementTranslationService(_, platformTranslationUtilitiesService) {
		var self = this;
		var data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [logisticSettlementModule, logisticDispatchingModule, logisticSundryServiceModule, logisticJobModule, cloudCommonModule, basicsBillingSchemaModule, basicsCustomizeModule, projectMainModule, resourceWotModule, 'services.schedulerui']
		};
		var modules = ['logistic', 'resource', 'transport', 'scheduling', 'basics', 'project'];
		data.allUsedModules = _.concat(data.allUsedModules, platformTranslationUtilitiesService.getAllSubmodules(modules));

		data.words = {
			SettlementNo: {location: logisticSettlementModule, identifier: 'settlementNo'},
			RubricCategoryFk: {location: basicsCustomizeModule, identifier: 'rubriccategory'},
			CompanyFk: {location: basicsCustomizeModule, identifier: 'companyfk'},
			ProjectFk: {location: cloudCommonModule, identifier: 'entityProject'},
			LanguageFk: {location: basicsCustomizeModule, identifier: 'language'},
			SettlementStatusFk: {location: basicsCustomizeModule, identifier: 'statusfk'},
			SettlementDate: {location: cloudCommonModule, identifier: 'entityDate'},
			VoucherTypeFk: {location: basicsCustomizeModule, identifier: 'vouchertype'},
			InvoiceTypeFk: {location: basicsCustomizeModule, identifier: 'billinvoicetype'},
			CurrencyFk: {location: cloudCommonModule, identifier: 'entityCurrency'},
			ExchangeRate: {location: cloudCommonModule, identifier: 'entityRate'},
			BusinessPartnerFk: {location: cloudCommonModule, identifier: 'businessPartner'},
			SubsidiaryFk: {location: cloudCommonModule, identifier: 'entitySubsidiary'},
			CustomerFk: {location: logisticSettlementModule, identifier: 'customer'},
			BillingSchemaFk: {location: logisticSettlementModule, identifier: 'reference'},
			BillingSchemaMasterFk: {location: cloudCommonModule, identifier: 'entityBillingSchema'},
			TaxCodeFk: {location: basicsCustomizeModule, identifier: 'taxcode'},
			PaymentTermFk: {location: logisticSettlementModule, identifier: 'paymentTerm'},
			JobTypeFk: {location: basicsCustomizeModule, identifier: 'jobtype'},
			PerformedFrom: {location: logisticSettlementModule, identifier: 'performedFrom'},
			PerformedTo: {location: logisticSettlementModule, identifier: 'performedTo'},
			business: {location: logisticSettlementModule, identifier: 'business'},
			billing: {location: logisticSettlementModule, identifier: 'billing'},
			ItemNo: {location: logisticSettlementModule, identifier: 'itemNo'},
			DispatchRecordFk: {location: logisticDispatchingModule, identifier: 'dispatchingRecord'},
			DispatchHeaderFk: {location: logisticDispatchingModule, identifier: 'dispatchingHeader'},
			ControllingUnitFk: {location: cloudCommonModule, identifier: 'entityControllingUnit'},
			ProcurementStructureFk: {location: logisticSettlementModule, identifier: 'prcStructure'},
			Price: {location: logisticSettlementModule, identifier: 'price'},
			PricePortion1: {location: logisticSundryServiceModule, identifier: 'pricePortion01'},
			PricePortion2: {location: logisticSundryServiceModule, identifier: 'pricePortion02'},
			PricePortion3: {location: logisticSundryServiceModule, identifier: 'pricePortion03'},
			PricePortion4: {location: logisticSundryServiceModule, identifier: 'pricePortion04'},
			PricePortion5: {location: logisticSundryServiceModule, identifier: 'pricePortion05'},
			PricePortion6: {location: logisticSundryServiceModule, identifier: 'pricePortion06'},
			PriceTotal: {location: logisticSettlementModule, identifier: 'pricePortionSum'},
			PriceTotalQty: {location: logisticSettlementModule, identifier: 'priceTotal'},
			PriceOrigCur: {location: logisticSettlementModule, identifier: 'priceOrigCur'},
			PriceOrigCur1: {location: logisticSettlementModule, identifier: 'priceOrigCur01'},
			PriceOrigCur2: {location: logisticSettlementModule, identifier: 'priceOrigCur02'},
			PriceOrigCur3: {location: logisticSettlementModule, identifier: 'priceOrigCur03'},
			PriceOrigCur4: {location: logisticSettlementModule, identifier: 'priceOrigCur04'},
			PriceOrigCur5: {location: logisticSettlementModule, identifier: 'priceOrigCur05'},
			PriceOrigCur6: {location: logisticSettlementModule, identifier: 'priceOrigCur06'},
			PriceTotalOrigCur: {location: logisticSettlementModule, identifier: 'priceOrigCurSum'},
			PriceTotalOrigCurQty: {location: logisticSettlementModule, identifier: 'priceTotalOrigCur'},
			PriceTotalQtyPlant: {location: logisticSettlementModule, identifier: 'priceTotalQtyPlant'},
			PriceTotalQtyOcPlant: {location: logisticSettlementModule, identifier: 'priceTotalQtyOcPlant'},
			PriceTotalQtySundry: {location: logisticSettlementModule, identifier: 'priceTotalQtySundry'},
			PriceTotalQtyOcSundry: {location: logisticSettlementModule, identifier: 'priceTotalQtyOcSundry'},
			PriceTotalQtyMaterial: {location: logisticSettlementModule, identifier: 'priceTotalQtyMaterial'},
			PriceTotalQtyOcMaterial: {location: logisticSettlementModule, identifier: 'priceTotalQtyOcMaterial'},
			prices: {location: logisticSettlementModule, identifier: 'prices'},
			pricesorigcur: {location: logisticSettlementModule, identifier: 'pricesOrigCur'},
			BookingText: {location: logisticSettlementModule, identifier: 'bookingText'},
			ChangeFk: {location: projectMainModule, identifier: 'entityChange'},
			cancellation: {location: logisticSettlementModule, identifier: 'cancellation'},
			IsCanceled: {location: logisticSettlementModule, identifier: 'isCanceled'},
			CancellationNo: {location: logisticSettlementModule, identifier: 'cancellationNo'},
			CancellationReason: {location: logisticSettlementModule, identifier: 'cancellationReason'},
			CancellationDate: {location: logisticSettlementModule, identifier: 'cancellationDate'},
			CommentText: {location: cloudCommonModule, identifier: 'entityComment'},
			PostingDate: {location: cloudCommonModule, identifier: 'entityPostingDate'},
			controllingAssignments: {location: logisticSettlementModule, identifier: 'controllingAssignments'},
			ControllingUnitCode: {location: cloudCommonModule, identifier: 'entityControllingUnit'},
			DocumentType: {location: cloudCommonModule, identifier: 'entityDocumentType'},
			LineType: {location: logisticSettlementModule, identifier: 'lineType'},
			Currency: {location: cloudCommonModule, identifier: 'entityCurrency'},
			VoucherNumber: {location: cloudCommonModule, identifier: 'entityVoucherNumber'},
			VoucherDate: {location: cloudCommonModule, identifier: 'entityVoucherDate'},
			PostingNarritive: {location: cloudCommonModule, identifier: 'entityPostingNarritive'},
			NetDueDate: {location: logisticSettlementModule, identifier: 'netDueDate'},
			DiscountDueDate: {location: logisticSettlementModule, identifier: 'discountDueDate'},
			DiscountAmount: {location: logisticSettlementModule, identifier: 'discountAmount'},
			Debtor: {location: logisticSettlementModule, identifier: 'debtor'},
			DebtorGroup: {location: logisticSettlementModule, identifier: 'debtorGroup'},
			BusinessPostingGroup: {location: logisticSettlementModule, identifier: 'businessPostingGroup'},
			AccountReceiveAble: {location: logisticSettlementModule, identifier: 'accountReceiveAble'},
			NominalAccount: {location: logisticSettlementModule, identifier: 'nominalAccount'},
			Amount: {location: cloudCommonModule, identifier: 'entityAmount'},
			IsDebit: {location: logisticSettlementModule, identifier: 'isDebit'},
			VatAmount: {location: logisticSettlementModule, identifier: 'vatAmount'},
			VatCode: {location: logisticSettlementModule, identifier: 'vatCode'},
			IsProgress: {location: logisticSettlementModule, identifier: 'isProgress'},
			OrderNumber: {location: logisticSettlementModule, identifier: 'orderNumber'},
			AmountAuthorized: {location: logisticSettlementModule, identifier: 'amountAuthorized'},
			financialInfo: {location: logisticSettlementModule, identifier: 'financialInfo'},
			IsSuccess: {location: logisticSettlementModule, identifier: 'isSuccess'},
			TransactionId: {location: logisticSettlementModule, identifier: 'transactionId'},
			HandoverId: {location: logisticSettlementModule, identifier: 'handoverId'},
			ReturnValue: {location: logisticSettlementModule, identifier: 'returnValue'},
			LineNo: {location: logisticSettlementModule, identifier: 'lineNo'},
			PostingType: {location: logisticSettlementModule, identifier: 'postingType'},
			AssetNo: {location: logisticSettlementModule, identifier: 'assetNo'},
			CodeRetention: {location: logisticSettlementModule, identifier: 'codeRetention'},
			accountingInfo: {location: logisticSettlementModule, identifier: 'accountingInfo'},
			printingInfo: {location: logisticSettlementModule, identifier: 'printingInfo'},
			Sorting: {location: basicsBillingSchemaModule, identifier: 'entitySorting'},
			BillingLineTypeFk: {location: basicsBillingSchemaModule, identifier: 'entityBillingLineTypeFk'},
			GeneralsTypeFk: {location: basicsBillingSchemaModule, identifier: 'entityGeneralsTypeFk'},
			Value: {location: basicsBillingSchemaModule, identifier: 'entityValue'},
			Result: {location: basicsBillingSchemaModule, identifier: 'entityResult'},
			ResultOc: {location: basicsBillingSchemaModule, identifier: 'entityResultOc'},
			IsEditable: {location: basicsBillingSchemaModule, identifier: 'entityIsEditable'},
			Group1: {location: basicsBillingSchemaModule, identifier: 'entityGroup1'},
			Group2: {location: basicsBillingSchemaModule, identifier: 'entityGroup2'},
			Description2: {location: basicsBillingSchemaModule, identifier: 'entityDescription2'},
			IsPrinted: {location: basicsBillingSchemaModule, identifier: 'entityIsPrinted'},
			AccountNo: {location: basicsBillingSchemaModule, identifier: 'entityAccountNo'},
			OffsetAccountNo: {location: basicsBillingSchemaModule, identifier: 'entityOffsetAccountNo'},
			IsTurnover: {location: basicsBillingSchemaModule, identifier: 'entityIsTurnover'},
			FinalTotal: {location: basicsBillingSchemaModule, identifier: 'entityFinalTotal'},
			HasControllingUnit: {location: basicsBillingSchemaModule, identifier: 'entityHasControllingUnit'},
			IsBold: {location: basicsBillingSchemaModule, identifier: 'entityIsBold'},
			IsItalic: {location: basicsBillingSchemaModule, identifier: 'entityIsItalic'},
			IsUnderline: {location: basicsBillingSchemaModule, identifier: 'entityIsUnderline'},
			BillingSchemaDetailFk: {location: basicsBillingSchemaModule, identifier: 'entityBillingSchemaDetailFk'},
			CredFactor: {location: basicsBillingSchemaModule, identifier: 'credFactor'},
			DebFactor: {location: basicsBillingSchemaModule, identifier: 'debFactor'},
			CredLineTypeFk: {location: basicsBillingSchemaModule, identifier: 'creditorlinetype'},
			DebLineTypeFk: {location: basicsBillingSchemaModule, identifier: 'debitorlinetype'},
			BillingSchemaAaFk: {location: logisticSettlementModule, identifier: 'billingSchemaAsAl'},
			BillingSchemaTaxFk: {location: logisticSettlementModule, identifier: 'billingSchemaTax'},
			IsPrintedZero: {location: logisticSettlementModule, identifier: 'isPrintedZero'},
			Formula: {location: cloudCommonModule, identifier: 'formula'},
			MessageSeverityFk: {location: basicsCustomizeModule, identifier: 'messageseverity'},
			Message: {location: basicsCustomizeModule, identifier: 'message'},
			SettledFrom: {location: logisticSettlementModule, identifier: 'settledFrom'},
			SettledTo: {location: logisticSettlementModule, identifier: 'settledTo'},
			DivisionFk: {location: basicsCustomizeModule, identifier: 'division'},
			SettlementTypeFk: {location: basicsCustomizeModule, identifier: 'logisticssettlementtype'},
			SettlementItemTypeFk: {location: basicsCustomizeModule, identifier: 'logisticssettlementitemtype'},
			WorkOperationTypeFk: {location: resourceWotModule, identifier: 'entityWorkOperationType'},
			SettlementTargetNo: {location: logisticSettlementModule, identifier: 'settlementTargetNo'},
			CompanyRecipientFk: {location: logisticSettlementModule, identifier: 'companyRecipient'},
			ControllingUnitRevenueFk: {location: logisticSettlementModule, identifier: 'controllingUnitRevenue'},
			RecordType: {location: logisticDispatchingModule, identifier: 'recordType'},
			Article: {location: logisticDispatchingModule, identifier: 'entityArticleCode'},
			ArticleDescription: {location: logisticDispatchingModule, identifier: 'entityArticleDesc'},
			DocumentNo: {location: logisticSettlementModule, identifier: 'entityDocumentNo'},
			QuantityMultiplier: {location: logisticSettlementModule, identifier: 'entityQuantityMultiplier'},
			ControllingGroupSetFk: { location: logisticSettlementModule, identifier: 'controllingGroupSet'},
			VatGroupFk: { location: logisticSettlementModule, identifier: 'entityVatGroupFk'},
			TaxCodeMatrixFk:{ location: logisticSettlementModule, identifier: 'entityTaxCodeMatrixFk'},
			BatchInformation: { location: logisticSettlementModule, identifier: 'batchInformation'},
			BatchRunStartedDate: { location: logisticSettlementModule, identifier: 'batchRunStartedDate'},
			BatchFromDate: { location: logisticSettlementModule, identifier: 'batchFromDate'},
			BatchToDate: { location: logisticSettlementModule, identifier: 'batchToDate'},
			TransactionTypeFk: { location: logisticSettlementModule, identifier: 'transactiontypefk'},
			Creditor: { location: logisticSettlementModule, identifier: 'creditor'},
			CreditorGroup: { location: basicsCustomizeModule, identifier: 'creditorgroup', initial: 'Creditor Group' },
			ExternalNumber: { location: logisticSettlementModule, identifier: 'externalnumber'},
			ExternalDate: { location: logisticSettlementModule, identifier: 'externaldate'},
			BusinessPostingGroupCreditor: { location: logisticSettlementModule, identifier: 'businesspostinggroupcreditor'},
			AccountPayable: { location: logisticSettlementModule, identifier: 'accountpayable'},
			SupplierFk: { location: logisticSettlementModule, identifier: 'supplier'},
			PerformingJobFk: { location: logisticSettlementModule, identifier: 'performingJob'},
			ReceivingJobFk: { location: logisticSettlementModule, identifier: 'receivingJob'},
			PerformingJobGroupFk: { location: logisticSettlementModule, identifier: 'performingJobGroup'},
			ReceivingJobGroupFk: { location: logisticSettlementModule, identifier: 'receivingJobGroup'},
			BillingJobFk: {location: logisticSettlementModule, identifier: 'entityBillingJob'},
			BilledJobFk: {location: logisticSettlementModule, identifier: 'entityBilledJob'},
			EquipmentDivisionFk: {location: basicsCustomizeModule, identifier: 'equipmentdivision'},
			FromDate: {location: cloudCommonModule, identifier: 'requisitionHire.from'},
			ToDate: {location: cloudCommonModule, identifier: 'requisitionHire.to'},
			IsTestRun: {location: logisticSettlementModule, identifier: 'batchTestRun'},
			Started: {location: cloudCommonModule, identifier: 'entityStartDate'},
			Finished: {location: cloudCommonModule, identifier: 'entityEndDate'},
			PlantSupplierFk: { location: logisticSettlementModule, identifier: 'entityPlantSupplier'},
			JobPerformingFk: { location: logisticSettlementModule, identifier: 'entityJobPerforming'},
			JobReceivingFk: { location: logisticSettlementModule, identifier: 'entityJobReceiving'},
			PlantSupplyItemFk: { location: logisticSettlementModule, identifier: 'entityPlantSupplyItemFk' },
			Uom: { location: cloudCommonModule, identifier: 'entityUoM' },
			ProjectChangeFk: {location: cloudCommonModule, identifier: 'entityProjectChange'},
			ProjectChangeStatusFk: {location: basicsCustomizeModule, identifier: 'projectchangestatus', initial: 'Project Change Status'},
			PriceTotalQuantitySettled: { location: logisticSettlementModule, identifier: 'priceTotalQuantitySettled'},
			PriceTotalQuantitySettledOriginalCurrency: { location: logisticSettlementModule, identifier: 'priceTotalQuantitySettledOC'},
			settlement: { location: logisticSettlementModule, identifier: 'entitySettlement'},
			Id: { location: logisticSettlementModule, identifier: 'entityDispatchHeader'},
			Code: { location: logisticSettlementModule, identifier: 'entityDispHeaderCode'},
			DispatchStatusFk: { location: logisticSettlementModule, identifier: 'entityDispatchStatus'},
			DateDocumented: { location: logisticSettlementModule, identifier: 'entityDateDocumented'},
			SettlementNumber: { location: logisticSettlementModule, identifier: 'settlementNumber'},
			SettlementItemNumber: { location: logisticSettlementModule, identifier: 'settlementItemNumber'},
			SettlementItemTypeClaimFk: { location: logisticSettlementModule, identifier: 'settlementItemTypeFk'},
			DispRecordArticleCode: {location: logisticSettlementModule, identifier: 'dispRecordArticleCode'},
			DispHeaderCode: {location: logisticSettlementModule, identifier: 'dispHeaderCode'},
			ClaimReasonFk: { location: logisticSettlementModule, identifier: 'claimReasonFk'},
			JobClaimFk: { location: logisticSettlementModule, identifier: 'jobClaimFk'},
			DateEffective: { location: logisticSettlementModule, identifier: 'entityDateEffective'},
			IsHire: {location: resourceWotModule, identifier: 'isHire'},
			ExpectedEffectiveDate: {location: logisticSettlementModule, identifier: 'expectedEffectiveDate'},
			ExpectedQuantity: {location: logisticSettlementModule, identifier: 'expectedQuantity'},
			ExpectedWorkOperationTypeFk: {location: logisticSettlementModule, identifier: 'expectedWorkOperationTypeFk'},
			ExpectedIsHire: {location: logisticSettlementModule, identifier: 'expectedIsHire'},
			ExpectedUomFk: {location: logisticSettlementModule, identifier: 'expectedUomFk'},
			PreviousSettlementExist: {location: logisticSettlementModule, identifier: 'previousSettlementExist'},
			ClaimStatusFk: {location: logisticSettlementModule, identifier: 'claimStatusFk'},
			ClaimMethodFk: {location: logisticSettlementModule, identifier: 'claimMethodFk'},
			InstructionText: {location: logisticSettlementModule, identifier: 'instructionText'},
			ProvidedWizard: {location: logisticSettlementModule, identifier: 'providedWizard'},
			ClerkOwnerFk: {location: logisticSettlementModule, identifier: 'clerkOwnerFk'},
			ClerkResponsibleFk: {location: logisticSettlementModule, identifier: 'clerkResponsibleFk'},
			CompanyCode: {location: cloudCommonModule, identifier: 'entityCompanyCode'},
			JobFk: {location: logisticJobModule, identifier: 'entityJobCode'},
			JobCode: {location: logisticJobModule, identifier: 'entityJobCode'},
			PlantCode: {location: logisticSettlementModule, identifier: 'entityPlantCode'},
			PlantDescription: {location: logisticSettlementModule, identifier: 'entityPlantDescription'},
			DeparturRatingMultiplier: {location: logisticSettlementModule, identifier: 'entityDeparturRatingMultiplier'},
			ProjectNo: {location: cloudCommonModule, identifier: 'entityProjectNo'},
			ProjectName: {location: cloudCommonModule, identifier: 'entityProjectName'},
			LocationQuantity: {location: logisticSettlementModule, identifier: 'locationQuantity'},
			ClaimExist: {location: logisticSettlementModule, identifier: 'claimExist'},
			CompanyResponsibleFk: {
				location: projectMainModule,
				identifier: 'entityProfitCenter',
				initial: 'Profit Center'
			},
		};

		//Get some predefined packages of words used in project
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words, 'basicData');
		platformTranslationUtilitiesService.addHistoryTranslation(data.words);
		platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 5, 'UserDefinedText', '0', 'userdefinedtext');
		platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 3, 'UserDefined', '0');
		platformTranslationUtilitiesService.addUserDefinedNumberTranslation(data.words, 5, 'UserDefinedNumber', '0', 'userdefinednumber');
		platformTranslationUtilitiesService.addUserDefinedDateTranslation(data.words, 5, 'UserDefinedDate', '0', 'userdefineddate');
		platformTranslationUtilitiesService.addRequisitionAndReservationWords(data.words);
		var conf = {
			count: 10,
			default: 'Assignment',
			ident: 'controllingUnitAssign',
			interFix: '0',
			preFix: 'ControllingUnitAssign',
			where: logisticSettlementModule,
			words: data.words
		};
		platformTranslationUtilitiesService.addMultipleTranslations(conf);
		conf.default = 'Assignment Text';
		conf.ident = 'controllingUnitAssignText';
		conf.preFix = 'ControllingUnitAssignText';
		platformTranslationUtilitiesService.addMultipleTranslations(conf);
		platformTranslationUtilitiesService.addMultipleTranslations({
			count: 3,
			default: 'Nominal Dimension',
			ident: 'nominalDimension',
			interFix: '',
			preFix: 'NominalDimension',
			where: logisticSettlementModule,
			words: data.words
		});
		platformTranslationUtilitiesService.addClerkContainerTranslations(data.words);

		//Convert word list into a format used by platform translation service
		platformTranslationUtilitiesService.addMissingModules(data.allUsedModules, data.words);
		data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

		//Prepare interface of service and load translations
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);
		platformTranslationUtilitiesService.addTranslationServiceInterface(self, data);
		platformTranslationUtilitiesService.registerModules(data);
		platformTranslationUtilitiesService.loadModuleTranslation(data);
	}

})(angular);
