(function (angular) {
	'use strict';

	const moduleName = 'procurement.pricecomparison';

	/**
	 * This constant describes the item/boq comparison tree row type.
	 */
	angular.module(moduleName).value('procurementPriceComparisonLineTypes', {
		requisition: -1,
		compareField: -2,
		grandTotal: -3,
		quoteDate: -4,
		quoteVersion: -5,
		quoteStatus: -6,
		quoteCode: -15,
		quoteDescription: -16,
		quoteExchangeRate: -17,
		quoteCurrency: -18,
		quotePaymentTermPA: -19,
		quotePaymentTermFI: -20,
		evaluationRank: -21,
		evaluationResult: -22,
		generalTotal: -7,
		generalItem: -8,
		characteristicTotal: -9,
		characteristicGroup: -10,
		characteristic: -11,
		rfq: -12,
		quoteNewItemTotal: -13,
		quoteNewItem: -14,
		prcItem: 0,
		// billing schema
		netTotal: -23,
		earlyPaymentDiscount: -24,
		subTotal: -25,
		vat: -26,
		runningTotal: -27,
		billingSchemaGroup: -28,
		billingSchemaChildren: -29,
		grandTotalRank: -30,
		quoteUserDefined: -31,
		quoteRemark: -32,
		overallDiscount: -33,
		overallDiscountOc: -34,
		overallDiscountPercent: -35,
		quoteTotal: -36,
		turnover: -37,
		evaluatedTotal: -38,
		avgEvaluationA: -39,
		avgEvaluationB: -40,
		avgEvaluationC: -41,
		avgEvaluationRank: -42,
		offeredTotal: -43,
		receiveDate: -44,
		priceFixingDate: -45,
		projectChange: -46,
		projectChangeStatus: -47,
		incoterms: -48,
		quotePaymentTermPaDesc: -49,
		quotePaymentTermFiDesc: -50,
		discountBasis: -51,
		discountBasisOc: -52,
		discountPercent: -53,
		discountAmount: -54,
		discountAmountOc: -55,
		totalType: -56
	});

	/**
	 * @ngdoc service
	 * @name procurementPriceComparisonCommonService
	 * @function
	 * @requires $injector, platformGridDomainService
	 * @description
	 * some common functions shared between item and boq
	 */
	angular.module(moduleName).factory('procurementPriceComparisonCommonService', [
		'$', '$q', '$injector', '$translate', 'platformGridDomainService', 'platformModalService', 'platformTranslateService', 'PlatformMessenger',
		'platformGridAPI', 'platformRuntimeDataService', 'procurementPriceComparisonLineTypes', 'platformObjectHelper',
		'procurementPriceComparisonBoqCompareRows', 'basicsCharacteristicTypeHelperService', 'basicsLookupdataLookupFilterService', '_',
		'globals', '$http', 'basicsLookupdataLookupDescriptorService', 'boqMainLineTypes', 'procurementPriceComparisonCheckBidderService', 'prcCommonItemCalculationHelperService', 'platformPermissionService', 'prcCommonGetVatPercent',
		/* jshint -W071 */
		function (
			$, $q, $injector, $translate, platformGridDomainService, platformModalService, platformTranslateService, PlatformMessenger,
			platformGridAPI, platformRuntimeDataService, compareLineTypes, platformObjectHelper,
			boqCompareRows, basicsCharacteristicTypeHelperService, lookupFilterService, _, globals, $http, lookupDescriptorService, boqMainLineTypes, checkBidderService, itemCalculationHelperService, platformPermissionService, prcCommonGetVatPercent) {
			let service = {};
			service.registerLoadFinish = new PlatformMessenger();
			service.itemCompareFields = {
				price: 'Price',
				priceOc: 'PriceOc',
				priceExtra: 'PriceExtra',
				priceExtraOc: 'PriceExtraOc',
				priceUnit: 'PriceUnit',
				totalPrice: 'TotalPrice',
				totalPriceOc: 'TotalPriceOc',
				total: 'Total',
				rank: 'Rank',
				percentage: 'Percentage',
				prcItemEvaluationFk: 'PrcItemEvaluationFk',
				prcPriceConditionFk: 'PrcPriceConditionFk',
				userDefined1: 'Userdefined1',
				userDefined2: 'Userdefined2',
				userDefined3: 'Userdefined3',
				userDefined4: 'Userdefined4',
				userDefined5: 'Userdefined5',
				leadTime: 'LeadTime',
				leadTimeExtra: 'LeadTimeExtra',
				quantity: 'Quantity',
				alternativeBid: 'BasItemType85Fk',
				totalOC: 'TotalOc',
				priceGross: 'PriceGross',
				priceOCGross: 'PriceGrossOc',
				totalPriceGross: 'TotalPriceGross',
				totalPriceOCGross: 'TotalPriceGrossOc',
				totalGross: 'TotalGross',
				totalOCGross: 'TotalGrossOc',
				discount: 'Discount',
				discountAbsolute: 'DiscountAbsolute',
				discountAbsoluteOc: 'DiscountAbsoluteOc',
				discountAbsoluteGross: 'DiscountAbsoluteGross',
				discountAbsoluteGrossOc: 'DiscountAbsoluteGrossOc',
				discountComment: 'DiscountComment',
				totalNoDiscount: 'TotalNoDiscount',
				totalOcNoDiscount: 'TotalCurrencyNoDiscount',
				commentClient: 'CommentClient',
				commentContractor: 'CommentContractor',
				factoredQuantity: 'QuantityConverted',
				isFreeQuantity: 'IsFreeQuantity',
				absoluteDifference: 'AbsoluteDifference',
				discountSplit: 'DiscountSplit',
				discountSplitOc: 'DiscountSplitOc',
				externalCode: 'ExternalCode',
				budgetPerUnit: 'BudgetPerUnit',
				budgetTotal: 'BudgetTotal',
				uomFk: 'UomFk',
				factorPriceUnit: 'FactorPriceUnit',
				exQtnIsEvaluated: 'ExQtnIsEvaluated',
				notSubmitted: 'NotSubmitted',
				paymentTermPaFk: 'PaymentTermPaFk',
				paymentTermFiFk: 'PaymentTermFiFk',
				co2Project: 'Co2Project',
				co2ProjectTotal: 'Co2ProjectTotal',
				co2Source: 'Co2Source',
				co2SourceTotal: 'Co2SourceTotal',
				prjChangeFk: 'PrjChangeFk',
				prjChangeStatusFk: 'PrjChangeStatusFk',
				factoredTotalPrice: 'FactoredTotalPrice',
				charge: 'Charge',
				chargeOc: 'ChargeOc'
			};

			service.boqCompareFields = {
				itemTotal: 'ItemTotal',
				unitRate: 'UnitRate',
				finalPrice: 'Finalprice'
			};

			service.itemEditableCompareFields = [
				service.itemCompareFields.quantity,
				service.itemCompareFields.price,
				service.itemCompareFields.priceOc,
				service.itemCompareFields.priceUnit,
				service.itemCompareFields.prcItemEvaluationFk,
				service.itemCompareFields.prcPriceConditionFk,
				service.itemCompareFields.alternativeBid,
				service.itemCompareFields.total,
				service.itemCompareFields.totalOC,
				service.itemCompareFields.totalGross,
				service.itemCompareFields.totalOCGross,
				service.itemCompareFields.discount,
				service.itemCompareFields.discountAbsolute,
				service.itemCompareFields.discountComment,
				service.itemCompareFields.totalNoDiscount,
				service.itemCompareFields.totalOcNoDiscount,
				service.itemCompareFields.commentClient,
				service.itemCompareFields.commentContractor,
				service.itemCompareFields.isFreeQuantity,
				service.itemCompareFields.priceGross,
				service.itemCompareFields.priceOCGross,
				service.itemCompareFields.uomFk,
				service.itemCompareFields.co2Project,
				service.itemCompareFields.charge,
				service.itemCompareFields.chargeOc
			];

			service.editableCompareStringFields = [
				service.itemCompareFields.discountComment,
				service.itemCompareFields.isFreeQuantity
			];

			service.quoteCompareFields = {
				code: 'Code',
				description: 'Description',
				quoteDate: 'DateQuoted',
				receiveDate: 'DateReceived',
				priceFixingDate: 'DatePricefixing',
				exchangeRate: 'ExchangeRate',
				currency: 'CurrencyFk',
				incoterms: 'IncotermFk',
				paymentTermPA: 'PaymentTermPaFk',
				paymentTermPaDesc: 'PaymentTermPaDesc',
				paymentTermFI: 'PaymentTermFiFk',
				paymentTermFiDesc: 'PaymentTermFiDesc',
				quoteStatus: 'StatusFk',
				quoteVersion: 'QuoteVersion',
				evaluationRank: 'EvaluationRank',
				evaluationResult: 'EvaluationResult',
				grandTotalRank: 'GrandTotalRank',
				userDefined1: 'UserDefined1',
				userDefined2: 'UserDefined2',
				userDefined3: 'UserDefined3',
				userDefined4: 'UserDefined4',
				userDefined5: 'UserDefined5',
				remark: 'Remark',
				overallDiscount: 'OverallDiscount',
				overallDiscountOc: 'OverallDiscountOc',
				overallDiscountPercent: 'OverallDiscountPercent',
				userDefinedDate01: 'UserDefinedDate01',
				turnover: 'Turnover',
				avgEvaluationA: 'AvgEvaluationA',
				avgEvaluationB: 'AvgEvaluationB',
				avgEvaluationC: 'AvgEvaluationC',
				avgEvaluationRank: 'AvgEvaluationRank',
				evaluatedTotal: 'EvaluatedTotal',
				offeredTotal: 'OfferedTotal',
				projectChange: 'PrjChangeFk',
				projectChangeStatus: 'PrjChangeStatusFk',
				discountBasis: 'AmountDiscountBasis',
				discountBasisOc: 'AmountDiscountBasisOc',
				discountPercent: 'PercentDiscount',
				discountAmount: 'AmountDiscount',
				discountAmountOc: 'AmountDiscountOc'
			};

			service.schemaCompareFields = {
				netTotal: 'NetTotal',
				earlyPaymentDiscount: 'EarlyPaymentDiscount',
				subTotal: 'SubTotal',
				vat: 'Vat',
				runningTotal: 'RunningTotal'
			};

			service.highlightFields = [
				service.itemCompareFields.quantity,
				service.itemCompareFields.price,
				'Discount'
			];

			service.itemDeviationFields = [
				service.itemCompareFields.quantity,
				service.itemCompareFields.price,
				service.itemCompareFields.total,
				service.itemCompareFields.percentage,
				service.itemCompareFields.absoluteDifference
			];

			service.boqDeviationFields = [
				boqCompareRows.quantity,
				boqCompareRows.price,
				boqCompareRows.finalPrice,
				boqCompareRows.percentage,
				boqCompareRows.absoluteDifference
			];

			service.itemDataToPriceFields = [
				service.itemCompareFields.total,
				service.itemCompareFields.totalOC,
				service.itemCompareFields.totalNoDiscount,
				service.itemCompareFields.totalOcNoDiscount,
				service.itemCompareFields.totalGross,
				service.itemCompareFields.totalOCGross,
				service.itemCompareFields.priceOc
			];

			service.boqDataToPriceFields = [
				boqCompareRows.priceOc,
				boqCompareRows.finalPrice,
				boqCompareRows.finalPriceOc,
				boqCompareRows.urBreakdown1,
				boqCompareRows.urBreakdown2,
				boqCompareRows.urBreakdown3,
				boqCompareRows.urBreakdown4,
				boqCompareRows.urBreakdown5,
				boqCompareRows.urBreakdown6,
				boqCompareRows.priceGross,
				boqCompareRows.priceGrossOc
			];

			service.qtnReference = {
				Id: 100,
				Sorting: 100,
				DescriptionInfo: {
					Description: 'Reference Quotation',
					Translated: 'Reference Quotation'
				}
			};

			service.configReadonlyFields = [
				service.itemCompareFields.isFreeQuantity,
				boqCompareRows.isLumpsum,
				boqCompareRows.notSubmitted,
				boqCompareRows.included,
				service.itemCompareFields.exQtnIsEvaluated,
				service.itemCompareFields.paymentTermPaFk,
				service.itemCompareFields.paymentTermFiFk
			];

			service.boqEditableCompareFields = [
				boqCompareRows.prcItemEvaluationFk,
				boqCompareRows.discount,
				boqCompareRows.discountPercentIT,
				boqCompareRows.quantity,
				boqCompareRows.price,
				boqCompareRows.priceOc,
				boqCompareRows.discountPercent,
				boqCompareRows.cost,
				boqCompareRows.unitRateFrom,
				boqCompareRows.unitRateTo,
				boqCompareRows.urBreakdown1,
				boqCompareRows.urBreakdown2,
				boqCompareRows.urBreakdown3,
				boqCompareRows.urBreakdown4,
				boqCompareRows.urBreakdown5,
				boqCompareRows.urBreakdown6,
				boqCompareRows.alternativeBid,
				boqCompareRows.commentContractor,
				boqCompareRows.commentClient,
				boqCompareRows.finalPrice,
				boqCompareRows.finalPriceOc,
				boqCompareRows.lumpsumPrice,
				boqCompareRows.isLumpsum,
				boqCompareRows.bidderComments,
				boqCompareRows.priceGross,
				boqCompareRows.priceGrossOc,
				boqCompareRows.notSubmitted,
				boqCompareRows.included,
				boqCompareRows.uomFk,
				boqCompareRows.quantityAdj
			];

			service.itemAllowEditVisibleFields = [
				service.itemCompareFields.total,
				service.itemCompareFields.totalOC,
				service.itemCompareFields.totalGross,
				service.itemCompareFields.totalOCGross,
				service.itemCompareFields.totalNoDiscount,
				service.itemCompareFields.totalOcNoDiscount,
				service.itemCompareFields.priceGross,
				service.itemCompareFields.priceOCGross,
				service.itemCompareFields.quantity,
				service.itemCompareFields.uomFk,
				service.itemCompareFields.co2Project,
				service.itemCompareFields.charge,
				service.itemCompareFields.chargeOc
			];

			// only below fields need to remove price condition when modified.
			service.itemNeedRemovePriceConditionFields = [
				service.itemCompareFields.total,
				service.itemCompareFields.totalOC,
				service.itemCompareFields.totalGross,
				service.itemCompareFields.totalOCGross,
			];

			service.boqNeedRemovePriceConditionFields = [
				boqCompareRows.finalPrice,
				boqCompareRows.finalPriceOc,
			];

			service.boqAllowEditVisibleFields = [
				boqCompareRows.finalPrice,
				boqCompareRows.finalPriceOc,
				boqCompareRows.quantity,
				boqCompareRows.price,
				boqCompareRows.priceOc,
				boqCompareRows.urBreakdown1,
				boqCompareRows.urBreakdown2,
				boqCompareRows.urBreakdown3,
				boqCompareRows.urBreakdown4,
				boqCompareRows.urBreakdown5,
				boqCompareRows.urBreakdown6,
				boqCompareRows.bidderComments,
				boqCompareRows.commentContractor,
				boqCompareRows.commentClient,
				boqCompareRows.discountPercentIT,
				boqCompareRows.discount,
				boqCompareRows.discountPercent,
				boqCompareRows.priceGross,
				boqCompareRows.priceGrossOc,
				boqCompareRows.uomFk,
				boqCompareRows.quantityAdj
			];

			service.co2Fields = [
				service.itemCompareFields.co2Project,
				service.itemCompareFields.co2ProjectTotal,
				service.itemCompareFields.co2Source,
				service.itemCompareFields.co2SourceTotal
			];

			service.discountAbsoluteFields = [
				service.itemCompareFields.discount,
				service.itemCompareFields.discountAbsolute,
				service.itemCompareFields.discountAbsoluteOc,
				service.itemCompareFields.discountAbsoluteGross,
				service.itemCompareFields.discountAbsoluteGrossOc
			];

			service.billingShemaTypes = {
				netTotal: 1,
				subTotal: 3,
				runningTotal: 4,
				vat: 11,
				earlyPaymentDiscount: 12
			};

			service.constant = {
				maxValueIncludeTarget: 'MaximumValue',                     // max value in bidders and BaseBoq and Target
				minValueIncludeTarget: 'MinimumValue',                     // min value in bidders and BaseBoq and Target
				averageValueIncludeTarget: 'AverageValue',                 // average value in bidders and BaseBoq and Target
				maxValueExcludeTarget: 'MaxValueExcludeTarget',            // max value only in bidders (exclude BaseBoq and Target)
				minValueExcludeTarget: 'MinValueExcludeTarget',            // min value only in bidders (exclude BaseBoq and Target)
				averageValueExcludeTarget: 'AverageValueExcludeTarget',    // average value only in bidders (exclude BaseBoq and Target)

				compareDescription: 'CompareDescription',   // filed value of 'Compare Description' column
				rowType: 'rowType',                         // type for compare filed row (item.rowType = 'Price/ UnitRateFrom')
				tagForNoQuote: '-',                         // just show this tag if the bidder has no quote value for prcItem/BoqItem's properties
				tagForValueSeparator: '/',                  // tag for column 'Compare Description' values' separator.
				prefix2: 'QuoteCol',                        // used to difine dynamic boq quote columns
				columnFieldSeparator: '_',                  // column definition field separator
				newCustomColumnVale: -3,                    // related to baseBoqValue. less then baseBoqValue.
				compareType: {
					prcItem: 1,                             // prcItem comparison
					boqItem: 2                              // boqItem comparison
				},
				compareSection: {
					UI: 1,
					PRINT: 2
				},
				rfqCharacteristicGroup: 'RfqCharacteristicGroup',   // rfq characteristic group data
				rfqCharacteristic: 'RfqCharacteristic',             // rfq characteristic data
				quoteCharacteristic: 'QuoteCharacteristic',          // quote characteristic data
				highlightQtn: 'HighlightQtn',
				deviationColumn: 'DeviationColumn',
				deviationRow: 'DeviationRow',
				Generals: 'Generals',
				Characteristics: 'Characteristics'
			};

			service.formatter = {
				descriptionFormatter: platformGridDomainService.formatter('description'),
				percentFormatter: platformGridDomainService.formatter('percent'),
				integerFormatter: platformGridDomainService.formatter('integer'),
				moneyFormatter: platformGridDomainService.formatter('money'),
				quantityFormatter: platformGridDomainService.formatter('quantity'),
				booleanFormatter: platformGridDomainService.formatter('boolean'),
				lookupFormatter: platformGridDomainService.formatter('lookup'),
				dateFormatter: platformGridDomainService.formatter('dateutc'),
				datetimeFormatter: platformGridDomainService.formatter('datetimeutc')
			};

			service.icons = {
				lineTypes: {
					grandTotal: 'ico-grand-total',
					rfqTotal: 'ico-fo-requisition-total',
					quoteDate: 'ico-date-submit',
					quoteVersion: 'ico-version',
					quoteStatus: 'ico-status',
					code: 'control-icons ico-domain-code',
					description: 'control-icons ico-domain-description',
					exchangeRate: 'control-icons ico-domain-exchangerate',
					currency: 'control-icons ico-currency',
					paymentTermPA: 'control-icons ico-payment-term1',
					paymentTermFI: 'control-icons ico-payment-term2',
					evaluationRank: 'control-icons ico-domain-description',
					evaluationResult: 'control-icons ico-domain-description',
					characteristicTotal: 'ico-fo-char-total',
					characteristicGroup: 'ico-fo-char-group',
					characteristicItem: 'ico-item-char',
					requisitionTotal: 'ico-fo-requisition-total',
					generalTotal: 'ico-fo-general-total',
					generalItem: 'ico-item-general',
					boqRoot: 'ico-folder-doc',
					boqLevel: 'ico-folder-empty',
					boqItem: 'ico-doc-position',
					compareField: 'ico-compare-fields',
					total: 'ico-total',
					procurementItem: 'ico-item-procurement',
					overallDiscount: 'tlb-icons ico-split-overall-discount',
					quoteTotal: 'ico-fo-requisition-total',
				},
				toolBars: {
					add: 'tlb-icons ico-rec-new',
					delete: 'tlb-icons ico-rec-delete',
					reload: 'tlb-icons ico-refresh',
					settings: 'tlb-icons ico-settings-doc',
					moveUp: 'tlb-icons ico-grid-row-up',
					moveDown: 'tlb-icons ico-grid-row-down',
					question: 'tlb-icons ico-question',
					addIdealQuote: 'tlb-icons ico-ideal-quote'
				}
			};

			service.boqSummaryFileds = [
				boqCompareRows.summaryStandardTotal,
				boqCompareRows.summaryStandardABS,
				boqCompareRows.summaryStandardPercent,
				boqCompareRows.summaryStandardDiscountTotal,
				boqCompareRows.summaryOptionalITTotal,
				boqCompareRows.summaryOptionalITABS,
				boqCompareRows.summaryOptionalITPercent,
				boqCompareRows.summaryOptionalITDiscountTotal,
				boqCompareRows.summaryOptionalWITTotal,
				boqCompareRows.summaryOptionalWITABS,
				boqCompareRows.summaryOptionalWITPercent,
				boqCompareRows.summaryOptionalWITDiscountTotal,
				boqCompareRows.summaryGrandTotal,
				boqCompareRows.summaryGrandABS,
				boqCompareRows.summaryGrandPercent,
				boqCompareRows.summaryGrandDiscountTotal,
				boqCompareRows.summaryAlternativeTotal,
				boqCompareRows.summaryAlternativeABS,
				boqCompareRows.summaryAlternativePercent,
				boqCompareRows.summaryAlternativeDiscountTotal
			];

			service.boqSummaryTypes = {
				standard: 'standard',
				optionWithIT: 'optionIT',
				optionWithoutIT: 'optionWIT',
				grand: 'grand',
				alternative: 'alternative'
			};

			service.boqSummaryRowTypes = {
				total: 'total',
				abs: 'abs',
				percent: 'percent',
				discountTotal: 'discountTotal'
			};

			service.itemEvaluationRelatedFields = {
				quoteCode: 'EvaluationQuoteCode',
				quoteId: 'EvaluationQuoteId',
				sourcePrcItemId: 'EvaluationSourcePrcItemId',
				sourceBoqHeaderId: 'EvaluationSourceBoqHeaderId',
				sourceBoqItemId: 'EvaluationSourceBoqItemId'
			};

			service.unitRateBreakDownFields = [
				boqCompareRows.urBreakdown1,
				boqCompareRows.urBreakdown2,
				boqCompareRows.urBreakdown3,
				boqCompareRows.urBreakdown4,
				boqCompareRows.urBreakdown5,
				boqCompareRows.urBreakdown6
			];

			service.commonEditableFields = [
				service.quoteCompareFields.exchangeRate
			];

			service.boqNotPositionFields = [
				boqCompareRows.discount,
				boqCompareRows.discountPercentIT,
				boqCompareRows.lumpsumPrice,
				boqCompareRows.isLumpsum,
			];

			service.valuableLeadingFields = [
				service.itemCompareFields.quantity,
				service.itemCompareFields.price,
				service.itemCompareFields.priceOc,
				service.itemCompareFields.total,
				service.itemCompareFields.totalOC,
				service.itemCompareFields.totalGross,
				service.itemCompareFields.totalOCGross,
				service.itemCompareFields.totalNoDiscount,
				service.itemCompareFields.totalOcNoDiscount,
				service.itemCompareFields.priceGross,
				service.itemCompareFields.priceOCGross,
				boqCompareRows.finalPrice,
				boqCompareRows.finalPriceOc,
				boqCompareRows.urBreakdown1,
				boqCompareRows.urBreakdown2,
				boqCompareRows.urBreakdown3,
				boqCompareRows.urBreakdown4,
				boqCompareRows.urBreakdown5,
				boqCompareRows.urBreakdown6,
				boqCompareRows.discountPercentIT,
				boqCompareRows.discount,
				boqCompareRows.discountPercent,
				boqCompareRows.priceGross,
				boqCompareRows.priceGrossOc,
				'ItemTotal',
				'ItemTotalOc',
				'Finalgross',
				'FinalgrossOc',
				'DiscountedPrice',
				'DiscountedPriceOc'
			];

			service.finalBillingSchemaCache = [];
			service.PrcGeneralsToSave = [];
			service.configColumns = [];
			service.commonModifiedData = [];
			service.boqModifiedData = {};
			service.changeDataList = {};
			service.setChangeData = function (changDataKey, entity, field, ownQuoteKey) {
				var oldExcRate = service.getChangeData(changDataKey, ownQuoteKey);
				if (!service.changeDataList[changDataKey] || !_.isArray(service.changeDataList[changDataKey])) {
					service.changeDataList[changDataKey] = [];
				}
				if (oldExcRate) {
					oldExcRate.Entity = entity;
					oldExcRate.Field = field;
					oldExcRate.ExchangeRate = entity[field];

				} else {
					var item = {
						OwnQuoteKey: ownQuoteKey,
						Entity: entity,
						Field: field,
						ExchangeRate: entity[field]
					};
					service.changeDataList[changDataKey].push(item);
				}
			};
			service.getChangeData = function (changDataKey, ownQuoteKey) {
				if (!!service.changeDataList[changDataKey] && _.isArray(service.changeDataList[changDataKey])) {
					return _.find(service.changeDataList[changDataKey], {key: ownQuoteKey});
				}
			};

			var exchangeList = [];
			/**
			 * @param rfqHeaderId: int
			 * @param qtnHeaderId: int base
			 * @param quoteKey: string base
			 * @param curExchangeRate: decimal
			 * @param curCurrencyFk: int
			 */
			service.setExchangeRate = function (rfqHeaderId, qtnHeaderId, quoteKey, curExchangeRate, curCurrencyFk) {

				var exchangeCache = _.find(exchangeList, function (item) {
					return item.RfqHeaderId === rfqHeaderId &&
						(item.QtnHeaderId === qtnHeaderId || item.QuoteKey === quoteKey);
				});

				if (exchangeCache) {
					exchangeCache.ExchangeRate = curExchangeRate;
					if (curCurrencyFk) {
						exchangeCache.CurrencyFk = curCurrencyFk;
					}
				} else {
					var obj = {
						RfqHeaderId: rfqHeaderId,
						QtnHeaderId: qtnHeaderId,
						QuoteKey: quoteKey,
						ExchangeRate: curExchangeRate,
						CurrencyFk: curCurrencyFk
					};
					exchangeList.push(obj);
				}
			};

			service.getExchangeRate = function (rfqHeaderId, qtnHeaderId, quoteKey) {
				var exchangeCache = _.find(exchangeList, function (item) {
					return item.RfqHeaderId === rfqHeaderId &&
						(item.QtnHeaderId === qtnHeaderId || item.QuoteKey === quoteKey);
				});

				return exchangeCache ? exchangeCache.ExchangeRate : 1;
			};

			service.getCurrencyFk = function getCurrencyFk(rfqHeaderId, qtnHeaderId, quoteKey) {
				var exchangeCache = _.find(exchangeList, function (item) {
					return item.RfqHeaderId === rfqHeaderId &&
						(item.QtnHeaderId === qtnHeaderId || item.QuoteKey === quoteKey);
				});

				return exchangeCache ? exchangeCache.CurrencyFk : null;
			};

			service.getFinalBillingSchema = function (quoteId) {
				return _.find(service.finalBillingSchemaCache, {HeaderFk: quoteId});
			};
			service.setFinalBillingSchema = function (billingSchemaList) {
				var billingSchemaGroups = _.groupBy(billingSchemaList, 'HeaderFk');
				_.forOwn(billingSchemaGroups, function (value, quoteId) {
					quoteId = _.parseInt(quoteId);
					var billingSchemaListSort = _.sortBy(value, 'Sorting');
					var firstFinalBillingSchema = _.find(billingSchemaListSort, function (item) {
						return item.FinalTotal && item.HeaderFk === quoteId;
					});
					_.remove(service.finalBillingSchemaCache, function (item) {
						return item.HeaderFk === quoteId;
					});
					if (firstFinalBillingSchema) {
						service.finalBillingSchemaCache.push(firstFinalBillingSchema);
					}
				});
			};

			/**
			 * set an object's value (e.g. -> a.b.c = 99)
			 */
			service.assignValue = function assignValue(entity, field, value) {
				var fields = field;
				var object = entity; // a dynamic reference to entity

				if (_.isString(field)) {
					fields = field.split('.');
				}

				for (var i = 0; i < fields.length - 1; i++) {
					if (_.isUndefined(object[fields[i]])) {
						object[fields[i]] = {};
					}
					object = object[fields[i]];
				}

				if (object[fields[i]] !== value) {
					object[fields[i]] = value;
					if (fields[i] === boqCompareRows.discountPercentIT) {
						object[boqCompareRows.discount] = 0;
					} else if (fields[i] === boqCompareRows.discount) {
						object[boqCompareRows.discountPercentIT] = 0;
					}
				}
			};

			/**
			 *  some money and quantity columns need to be text align right
			 */
			service.setTextAlignRight = function setTextAlignRight(column) {
				column.cssClass = 'cell-right ';
			};

			/**
			 * get tools (avoid dialog's toolbars 'add/delete' permission error --> toolbar.permission = {null: 4/8 })
			 */
			service.getTools = function getToolBars(tools, customToolbarItems) {

				function parsePermission(tool) {
					if (_.isString(tool.permission)) {
						var splits = tool.permission.split('#');
						tool.permission = {};
						tool.permission[splits[0]] = platformPermissionService.permissionsFromString(splits[1]);
					}
				}

				customToolbarItems = customToolbarItems || [];
				// keep toolbar 'search /setting'
				tools.items = _.filter(tools.items, function (item) {
					return _.includes(['tlb-icons ico-search', 'tlb-icons ico-settings', 'tlb-icons ico-print-preview'], item.iconClass || item.icoClass);
				});
				tools.items = customToolbarItems.concat(tools.items);

				// avoid error in console of explorer.
				tools.update = function () {
				};

				tools.refresh = function () {
					tools.refreshVersion += 1;
				};

				// It is a bad practice to override 'setTools' and 'getTools' function, for example, here missing some permission data transform lead to 'Grid Layout' config button disappear.
				_.each(tools.items, function (tool) {
					parsePermission(tool);
					if (tool.list && tool.list.items && _.isArray(tool.list.items)) {
						_.each(tool.list.items, function (subTool) {
							parsePermission(subTool);
						});
					}
				});

				return tools;
			};

			/**
			 * reserve the first 2 columns to show indicator and tree icon (fixed columns can avoid drag and drop columns error)
			 */
			service.getImageColumns = function getImageColumns() {
				return [
					{
						id: 'indicator',
						name: '',
						field: 'indicator',
						width: 20,
						minWidth: 20,
						resizable: false,
						sortable: false,
						behavior: 'selectAndMove',
						formatter: 'indicator',
						cssClass: 'indicator dnd',
						pinned: true,
						hidden: false,
						focusable: true

					},
					{
						id: 'tree',
						name: 'Structure',
						name$tr$: 'platform.gridTreeHeader',
						toolTip: 'Structure',
						toolTip$tr$: 'platform.gridTreeHeader',
						field: 'tree',
						width: 100,
						minWidth: 40,
						resizable: true,
						sortable: false,
						formatter: 'tree',
						pinned: true,
						hidden: false,
						focusable: true
					}
				];
			};

			/**
			 * show info dialog
			 * parameter @configData, if it is a string, regard it as bodyTextKey,
			 * if it is an object, extend it with local option.
			 */
			service.showInfoDialog = function showInfoDialog(configData) {
				var option = {
					headerTextKey: 'cloud.common.informationDialogHeader',
					showOkButton: true,
					iconClass: 'ico-info'
				};
				if (typeof configData === 'string') {
					option.bodyTextKey = configData;
				} else if (Object.prototype.toString.call(configData) === '[object Object]') {
					angular.extend(option, configData);
				}
				return platformModalService.showDialog(option);
			};

			service.checkBidderColumn = function (configColumns, quoteColumns, verticalCompareRows, isVerticalCompareRows) {
				let commonHelperService = $injector.get('procurementPriceComparisonCommonHelperService');
				let bidderColumn = _.find(configColumns, {id: '_rt$bidder'});
				let lineValue = bidderColumn && bidderColumn.children ? _.find(bidderColumn.children, {field: 'LineValue'}) : null;
				if (!lineValue) {
					lineValue = _.find(configColumns, {isLineValue: true});
				}
				let visibleColumns = _.map([{
					Field: 'LineValue',
					FieldName: $translate.instant('procurement.pricecomparison.lineValue'),
					DisplayName: lineValue ? lineValue.userLabelName : $translate.instant('procurement.pricecomparison.lineValue'),
					UserLabelName: lineValue ? lineValue.userLabelName : ''
				}].concat(verticalCompareRows), function (row) {
					return {
						field: row.Field,
						name: row.FieldName,
						userLabelName: row.UserLabelName,
						name$tr$: '',
						width: 100
					};
				});

				if (!bidderColumn) {
					bidderColumn = {
						id: '_rt$bidder',
						field: 'Bidder',
						name: 'Bidder',
						name$tr$: $translate.instant('procurement.pricecomparison.printing.bidder'),
						hidden: false,
						pinned: false,
						searchable: true,
						sortable: false,
						width: 100 * (verticalCompareRows.length + 1) * quoteColumns.length
					};

					let compareColumns = _.filter(configColumns, function (col) {
						return _.startsWith(col.id, 'QuoteCol_');
					});
					if (compareColumns.length > 0) {
						let visible = _.find(compareColumns, {hidden: true});
						if (visible) {
							bidderColumn.hidden = true;
						}
						let quoteKey = compareColumns[0].id.split('_').slice(0, 4).join('_');
						let groupCols = _.filter(configColumns, function (item) {
							return _.startsWith(item.id, quoteKey);
						});
						if (groupCols.length > 0) {
							_.each(groupCols, function (quoteCol) {
								let terms = (quoteCol.field || quoteCol.id).split('_');
								let field = terms.length === 5 ? terms[4] : 'LineValue';
								let target = _.find(visibleColumns, {field: field});
								if (target && quoteCol.width) {
									target.width = quoteCol.width;
								}
							});
						}
					}
				} else {
					_.extend(bidderColumn, {
						field: 'Bidder',
						name: 'Bidder',
						name$tr$: $translate.instant('procurement.pricecomparison.printing.bidder')
					});
				}
				if (!bidderColumn.children) {
					bidderColumn.children = _.map(visibleColumns, function (row) {
						return {
							id: bidderColumn.id + '_' + row.field.toLowerCase(),
							parentId: bidderColumn.id,
							field: row.field,
							name: row.name,
							name$tr$: row.name$tr$,
							userLabelName: row.userLabelName,
							hidden: bidderColumn.hidden,
							pinned: bidderColumn.pinned,
							searchable: bidderColumn.searchable,
							sortable: bidderColumn.sortable,
							width: row.width
						};
					});
				}
				_.each(bidderColumn.children, function (child) {
					let target = _.find(visibleColumns, {field: child.field});
					if (target) {
						child.name = target.name;
						child.name$tr$ = target.name$tr$;
					}
				});
				_.each(visibleColumns, function (row) {
					if (!_.some(bidderColumn.children, {field: row.field})) {
						bidderColumn.children.push({
							id: bidderColumn.id + '_' + row.field.toLowerCase(),
							parentId: bidderColumn.id,
							field: row.field,
							name: row.name,
							userLabelName: row.userLabelName,
							name$tr$: row.name$tr$,
							hidden: bidderColumn.hidden,
							pinned: bidderColumn.pinned,
							searchable: bidderColumn.searchable,
							sortable: bidderColumn.sortable,
							width: row.width
						});
					}
				});
				if (!isVerticalCompareRows) {
					_.remove(bidderColumn.children, function (child) {
						return child.field !== 'LineValue';
					});
				} else {
					_.remove(bidderColumn.children, function (child) {
						return !_.some(visibleColumns, {field: child.field});
					});
				}
				bidderColumn.width = _.sumBy(bidderColumn.children, 'width') * quoteColumns.length;

				bidderColumn.children = _.uniqBy(bidderColumn.children, 'id');
				let childrenColumn = bidderColumn.children;

				let lvIndex = childrenColumn.findIndex(function (c) {
					return commonHelperService.isLayoutBidderLineValueColumn(c.id);
				});
				let lvCol = childrenColumn[lvIndex];
				let lvPrevCol = lvIndex > 0 ? childrenColumn[lvIndex - 1] : null;
				let compareColumns = _.filter(childrenColumn, function (cCol) {
					return !commonHelperService.isLayoutBidderLineValueColumn(cCol.id);
				});

				compareColumns.sort(function (a, b) {
					return visibleColumns.findIndex(function (m) {
						return m.field === a.field;
					}) - visibleColumns.findIndex(function (n) {
						return n.field === b.field;
					});
				});

				let newChildrenColumn = compareColumns;
				if (lvPrevCol) {
					let lvPrevIndex = newChildrenColumn.findIndex(function (p) {
						return p.id === lvPrevCol.id;
					});
					newChildrenColumn.splice(lvPrevIndex + 1, 0, lvCol);
				} else {
					newChildrenColumn.unshift(lvCol);
				}

				bidderColumn.children = newChildrenColumn;

				return bidderColumn;
			};

			service.mergeCostGroupColumns = function (costGroupColumns, configColumns, columns, extendFn) {
				if (costGroupColumns && costGroupColumns.length) {
					let cgConfColumns = _.filter(configColumns, function (col) {
						return _.startsWith(col.id, 'costgroup_');
					});
					let cgSortedColumns = _.sortBy(costGroupColumns, function (cg) {
						let index = _.findIndex(cgConfColumns, {id: cg.id});
						return index !== -1 ? index : cgConfColumns.length + costGroupColumns.length;
					});
					_.each(cgSortedColumns, function (item) {
						let target = _.find(configColumns, {id: item.id});
						let targetItem = _.extend({
							hidden: false
						}, item);
						if (target) {
							targetItem = _.extend({}, item, {
								width: target.width,
								hidden: target.hidden,
								userLabelName: target.userLabelName,
								pinned: target.pinned
							});
							let targetIndex = _.findIndex(configColumns, target);
							if (targetIndex === 0 || _.includes(['indicator', 'tree'], configColumns[targetIndex - 1].id)) {
								columns.unshift(targetItem);
							} else {
								let prevItem = configColumns[targetIndex - 1];
								let nextIndex = -1;

								if (prevItem.id === '_rt$bidder' || _.startsWith(prevItem.id, 'QuoteCol_')) {
									nextIndex = _.findLastIndex(columns, function (col) {
										return _.startsWith(col.id, 'QuoteCol_') || col.id === '_rt$bidder';
									}) + 1;
								} else {
									nextIndex = _.findIndex(columns, function (col) {
										return col.id === prevItem.id;
									}) + 1;
								}
								columns.splice(nextIndex, 0, targetItem);
							}

						} else {
							let cgLastIndex = _.findLastIndex(columns, function (col) {
								return _.startsWith(col.id, 'costgroup_');
							});
							if (cgLastIndex === -1) {
								columns.push(targetItem);
							} else {
								columns.splice(cgLastIndex + 1, 0, targetItem);
							}
						}
						if (_.isFunction(extendFn)) {
							extendFn(targetItem);
						}
					});
				}
			};

			service.getGridLayoutColumns = function getGridLayoutColumns(gridId, staticColumns, quoteColumns, verticalCompareRows, isVerticalCompareRows, allConfigColumns, costGroupColumns) {

				let columns = [];
				let configColumns = [];

				if (allConfigColumns) {
					configColumns = allConfigColumns;
				} else {
					// get custom config columns from database
					let config = $injector.get('mainViewService').getViewConfig(gridId);
					if (config && config.Propertyconfig) {
						configColumns = _.isArray(config.Propertyconfig) ? config.Propertyconfig : JSON.parse(config.Propertyconfig);
					}
				}

				let bidderColumn = service.checkBidderColumn(configColumns, quoteColumns, verticalCompareRows, isVerticalCompareRows);

				// staticColumns.unshift(bidderColumn);
				_.forEach(configColumns, function (col) {
					let colDef = _.find(staticColumns, {id: col.id});

					if (colDef) {
						// some filed can't always use the custom settings in databse to avoid not updating when changed in client.
						delete colDef.cssClass;
						colDef.hidden = col.hidden;
						colDef.keyboard = col.keyboard;
						colDef.pinOrder = col.pinOrder;
						colDef.pinned = col.pinned;
						colDef.userLabelName = col.userLabelName;
						colDef.width = col.width;
						let copyCol = angular.copy(colDef);
						copyCol.name = $translate.instant(copyCol.name$tr$);
						columns.push(copyCol);
					}
				});

				_.forEach(staticColumns, function (staticCol) {
					let configCol = _.find(columns, {id: staticCol.id});
					if (!configCol) {
						delete staticCol.cssClass;
						let copyStatic = angular.copy(staticCol);
						copyStatic.name = $translate.instant(copyStatic.name$tr$);
						if (staticCol.id === bidderColumn.id) {
							columns.unshift(copyStatic);
						} else {
							columns.push(copyStatic);
						}
					}
				});

				configColumns = _.filter(configColumns, function (item) {
					return item && item.id !== 'tree';
				});
				let holder = getIndexForBidder(configColumns);
				columns.splice(holder.holderPos, 0, bidderColumn);

				// Cost Group
				service.mergeCostGroupColumns(costGroupColumns, configColumns, columns);

				return columns;
			};

			/**
			 * extend static columns with custom config columns in database and merge dynamic columns.
			 */
			service.getGridConfigColumns = function getGridConfigColumns(configColumns, staticColumns, dynamicColumns, costGroupColumns) {
				let columns = [];

				let treeColumn = _.find(configColumns, function (item) {
					return item && item.id === 'tree';
				});

				configColumns = _.filter(configColumns, function (item) {
					return item && item.id !== 'tree';
				});

				// extend static and dynamic quote columns with custom settings
				for (let i = 0; i < configColumns.length; i++) {
					let colDef = _.find(staticColumns, {id: configColumns[i].id}) || _.find(dynamicColumns, {id: configColumns[i].id});
					if (colDef) {
						colDef.hidden = !colDef.isDynamic ? !configColumns[i].hidden : colDef.hidden;
						colDef.keyboard = configColumns[i].keyboard;
						colDef.pinOrder = configColumns[i].pinOrder;
						colDef.pinned = configColumns[i].pinned;
						colDef.userLabelName = configColumns[i].userLabelName;
						colDef.width = configColumns[i].width;
					}
					if (colDef && !colDef.isDynamic) {
						columns.push(angular.copy(colDef));
					}
				}

				// (2) keep the columns which not exist in config columns, but exsit in static columns
				//    for the old custom config columns in database which is wrong and never shown in UI.
				//    so need be update the config columns from the default static columns
				for (let m = 0; m < staticColumns.length; m++) {
					let staticCol = _.find(configColumns, {id: staticColumns[m].id});
					if (!staticCol) {
						let cloneColumn = angular.copy(staticColumns[m]);
						cloneColumn.hidden = !cloneColumn.hidden;
						columns.push(cloneColumn);
					}
				}

				// (3) add dynamic columns to the right place that user configed.

				let configDynamicColumns = _.filter(configColumns, function (item) {
					return _.startsWith(item.id, 'QuoteCol_');
				});
				dynamicColumns.sort(function(a, b) {
					return configDynamicColumns.findIndex(function(m) {
						return m.field === a.field;
					}) - configDynamicColumns.findIndex(function(n) {
						return n.field === b.field;
					});
				});

				let holder = getIndexForBidder(configColumns);
				let bidderCol = holder.bidderCol;

				for (let n = 0, columnStartIndex = holder.holderPos; n < dynamicColumns.length && holder.holderPos >= 0; n++) {
					columns.splice(columnStartIndex, 0, dynamicColumns[n]);
					columnStartIndex++;
				}

				// Reset dynamic column's width
				if (bidderCol && bidderCol.children && bidderCol.children.length > 0) {
					_.each(dynamicColumns, function (col) {
						let terms = col.field.split('_');
						let field = terms.length === 5 ? terms[4] : 'LineValue';
						let configCol = _.find(bidderCol.children, {field: field});
						if (configCol) {
							col.width = configCol.width;
						}
					});
				}

				// Cost Group
				service.mergeCostGroupColumns(costGroupColumns, configColumns, columns, function (item) {
					item.hidden = !item.hidden;
				});

				// add structure column
				let imageColumns = angular.copy(service.getImageColumns());
				if (treeColumn && imageColumns[1]) {
					imageColumns[1].width = treeColumn.width;
				}

				let allColumns = imageColumns.concat(columns);
				platformTranslateService.translateGridConfig(allColumns);

				return allColumns;
			};

			function getIndexForBidder(configColumns) {

				var userColumns = _.filter(configColumns, function (col) {
					return !_.includes(['indicator', 'tree'], col.id);
				});
				var bidderCol = _.find(userColumns, function (item) {
					return item.id === '_rt$bidder' && item.hidden;
				});

				var dynamicCol = _.find(userColumns, function (item) {
					return _.startsWith(item.id, 'QuoteCol_') && item.hidden;
				});

				var firstDynamicCol = _.find(userColumns, function (item) {
					return _.startsWith(item.id, 'QuoteCol_');
				});

				if (dynamicCol && firstDynamicCol) {
					dynamicCol = firstDynamicCol;
				}

				var holderPos = bidderCol ? _.findIndex(userColumns, function (item) {
					return item.id === bidderCol.id;
				}) : (!dynamicCol ? -1 : _.findIndex(userColumns, function (item) {
					return dynamicCol.id === item.id;
				}));

				return {
					bidderCol: bidderCol,
					holderPos: holderPos
				};
			}

			/**
			 * flat hierarchy collection to a flat collection
			 */
			service.flatCharacteristicGroupTree = function flatCharacteristicGroupTree(itemTree, list) {
				_.forEach(itemTree, function (item) {
					var group = {};
					group.Id = item.Id;
					group.Description = item.Description;
					list.push(group);

					if (!_.isEmpty(item.Children)) {
						flatCharacteristicGroupTree(item.Children, list);
					}
				});
			};

			/**
			 * table Bas_Characteristic_Type
			 * 1    Boolean
			 * 2    String
			 * 3    Integer
			 * 4    Percent
			 * 5    Money
			 * 6    Quantity
			 * 7    Date
			 * 8    DateTime
			 * 9    NoValue
			 * 10  Lookup
			 */
			service.formatValueByCharacteristicTypeId = function formatValueByCharacteristicTypeId(item, value, isNoEditable) {
				/** @namespace item.CharacteristicTypeId */
				switch (item.CharacteristicTypeId) {
					case 1:
						// Note (special case): <value === 'ture'> is needed here, because value is a 'true/false' string bool value.
						// return '<input type="checkbox" disabled="disabled"' + (value === 'true' ? ' checked="checked"' : '') + '>';
						return '<div class="text-center domain-type-boolean grid-control ng-scope">' +
							'<input type="checkbox" ' + (value === true ? ' checked="checked"' : '') + (isNoEditable === true ? ' disabled="disabled"' : '') +
							'data-grid="true"' + 'class="ng-pristine ng-valid ng-not-empty ng-touched" >' +
							'</div>';
					// return service.formatter.booleanFormatter(0, 0, value, {});
					case 2:
						return service.formatter.descriptionFormatter(0, 0, value, {});
					case 3:
						return service.formatter.integerFormatter(0, 0, value, {});  // value is a string, here need the original value (type: number)
					case 4:
						return service.formatter.percentFormatter(0, 0, value, {});// + ' %';
					case 5:
						return service.formatter.moneyFormatter(0, 0, value, {});
					case 6:
						return service.formatter.quantityFormatter(0, 0, value, {});
					case 7:
						return service.formatter.dateFormatter(0, 0, value, {});
					case 8:
						return service.formatter.datetimeFormatter(0, 0, value, {});
					default:
						return service.formatter.descriptionFormatter(0, 0, value, {});
				}
			};

			/**
			 * translate dynamic columns Target/ Base Boq's name
			 */
			service.translateTargetOrBaseBoqName = function translateTargetOrBaseBoqName(quoteKey) {
				if (checkBidderService.item.isTarget(quoteKey)) {
					return $translate.instant('procurement.pricecomparison.RequisitionBasic');
				} else if (checkBidderService.item.isBase(quoteKey)) {
					return $translate.instant('procurement.pricecomparison.packageBasic');
				} else if (checkBidderService.item.isTargetPrice(quoteKey)) {
					return $translate.instant('procurement.pricecomparison.compareColumnTarget');
				} else if (checkBidderService.item.isMaterialPrice(quoteKey)) {
					return $translate.instant('procurement.pricecomparison.CataloguePrice');
				} else {
					return null;
				}
			};

			/**
			 * get quote id from the column definition
			 *
			 * field: equals quoteKey (prefix + qtnHeaderId + businessPartnerId + quoteVersion)
			 */
			service.getQuoteId = function getQuoteId(quoteKey) {
				if (quoteKey && _.includes(quoteKey, service.constant.columnFieldSeparator)) {
					return quoteKey.split(service.constant.columnFieldSeparator)[1];
				}
				return null;
			};

			/**
			 * get base rfq information according the selected rfq.
			 */
			service.getBaseRfqInfo = function getBaseRfqInfo() {
				var info = {baseRfqId: -1, isLoadBase: true};

				var mainItem = $injector.get('procurementPriceComparisonMainService').getSelected();
				if (mainItem && mainItem.RfqHeaderFk) {
					info.baseRfqId = mainItem.RfqHeaderFk;
					info.isLoadBase = false;
				} else {
					info.baseRfqId = mainItem.Id;
				}

				return info;
			};

			service.getNavigationToQuote = function getNavigationToQuote(columnDef, entity, disabled) {
				let column = angular.copy(columnDef);

				// specify it this way to tell the getNavData function in quote module to pass the quote header id
				let qtnHeaderId = parseInt(service.getQuoteId(column.id)) || -1;
				let options = {
					navigator: {
						moduleName: 'procurement.quote',
						registerService: 'procurementQuoteHeaderDataService'
					}
				};
				angular.extend(options, column);

				// a simple way to pass qtnHeaderId as entity to navigate to module 'quote'.
				let navBtnHtml = platformGridDomainService.getNavigator(options, qtnHeaderId, null);
				// make the arrow to the left, because the number is right align
				let navDom = $(navBtnHtml).css('position', 'relative');

				if (disabled) {
					navDom.attr('disabled', true);
				}

				return $('<div></div>').append(navDom).html();
			};

			/**
			 * calculate the average value.
			 */
			service.calculateAverageValue = function calculateAverageValue(values) {
				let total = 0;
				_.forEach(values, function (value) {
					total += value;
				});

				return values.length > 0 ? total / values.length : 0;
			};

			/**
			 * compare columns visible checkbox
			 */
			service.onCellChangeCallBack = function onCellChangeCallBack(item) {
				if (!item) {
					return;
				}
				// base QTN visible is false, set its children visible false and the children checkbox disable
				if (!item.CompareColumnFk && !item.Visible) {
					_.each(item.Children, function (child) {
						child.Visible = false;
						child.IsCountInTarget = false;
						var readonlyFields = [{field: 'Visible', readonly: true}, {
							field: 'IsCountInTarget',
							readonly: true
						}];
						platformRuntimeDataService.readonly(child, readonlyFields);
					});
					item.IsCountInTarget = false;
					platformRuntimeDataService.readonly(item, [{field: 'IsCountInTarget', readonly: true}]);
				} else if (!item.CompareColumnFk && item.Visible) {
					// base QTN visible is true, set its children visible true and the children checkbox able
					_.each(item.Children, function (child) {
						var readonlyFields = [{field: 'Visible', readonly: false}];
						platformRuntimeDataService.readonly(child, readonlyFields);
					});

					if (!item.IsIdealBidder && checkBidderService.item.isIncludedTargetCalculationColumn(item.Id)) {
						platformRuntimeDataService.readonly(item, [{field: 'IsCountInTarget', readonly: false}]);
					}
				} else {
					return false;
				}
				return true;
			};

			// grab the user settings from the popup
			service.getUserSettings = function getUserSettings(rowService, columnService, quoteRowService, billingSchemaService) {
				var compareColumnList = [], baseColumnList = [];
				var compareRowList = rowService.getList() || [];
				var compareQuoteRowList = quoteRowService.getList() || [];
				var compareBillingSchemaRowList = billingSchemaService.getList() || [];

				// get base /change quotes exclude BaseBoq/ Target (a tree only two level)
				_.forEach(columnService.getTree(), function (baseItem) {
					if (checkBidderService.item.isNotReference(baseItem.QtnHeaderFk)) {
						compareColumnList.push(baseItem);
					} else {
						baseColumnList.push(baseItem);
					}
					_.forEach(baseItem.Children, function (changeItem) {
						compareColumnList.push(changeItem);
					});
				});

				return {
					isVerticalCompareRows: !!rowService.isVerticalCompareRows,
					isLineValueColumn: !!rowService.isLineValueColumn,
					isCalculateAsPerAdjustedQuantity: !!rowService.isCalculateAsPerAdjustedQuantity,
					isFinalShowInTotal: !!billingSchemaService.isFinalShowInTotal,
					compareColumns: compareColumnList,
					compareFields: compareRowList,
					compareQuoteFields: compareQuoteRowList,
					compareBillingSchemaFields: compareBillingSchemaRowList,
					gridColumns: service.configColumns,
					baseColumnList: baseColumnList,
					deletedColumns: columnService.deletedColumns
				};
			};

			// get All PrcItemEvaluation
			service.getAllPrcItemEvaluation = function getAllPrcItemEvaluation(list, childProp, matchItemEvaluationFn) {
				var prcItems = [];
				angular.forEach(list, function (item) {
					if (_.isFunction(matchItemEvaluationFn) ? matchItemEvaluationFn(item) : item.rowType === service.itemCompareFields.prcItemEvaluationFk) {
						prcItems.push(item);
					}
					prcItems.push(...getAllPrcItemEvaluation(platformObjectHelper.getValue(item, childProp), childProp, matchItemEvaluationFn));
				});
				return prcItems;
			};

			service.getAllQuoteItems = function getAllQuoteItems(list, childProp) {
				var quoteItems = [];
				angular.forEach(list, function (item) {
					/** @namespace item.QuoteItems */
					quoteItems.push(...(item.QuoteItems ?? []));
					quoteItems.push(...getAllQuoteItems(platformObjectHelper.getValue(item, childProp), childProp));
				});
				return quoteItems;
			};

			service.collectPriceOcCompareRows = function collectPriceOcCompareRows(list, childProp, lineType, isVerticalCompareRows) {
				var quoteItems = [];
				angular.forEach(list, function (item) {
					if (!isVerticalCompareRows) {
						if (item[lineType] === compareLineTypes.compareField && item.rowType === service.itemCompareFields.priceOc) {
							quoteItems.push(item);
						} else {
							quoteItems.push(...collectPriceOcCompareRows(platformObjectHelper.getValue(item, childProp), childProp, lineType, isVerticalCompareRows));
						}
					} else {
						if (lineType === 'BoqLineTypeFk' && item[lineType] === boqMainLineTypes.position) {
							quoteItems.push(item);
						} else if (lineType === 'LineType' && item[lineType] === compareLineTypes.prcItem) {
							quoteItems.push(item);
						} else {
							quoteItems.push(...collectPriceOcCompareRows(platformObjectHelper.getValue(item, childProp), childProp, lineType, isVerticalCompareRows));
						}
					}
				});
				return quoteItems;
			};

			service.getPrcItemEvaluation = function getPrcItemEvaluation(entity, field) {
				var data = _.find(entity.parentItem.QuoteItems, {QuoteKey: field});
				return data && data.PrcItemEvaluationFk;
			};

			service.getCompareModifications = function getCompareModifications(entity, value, quoteKey, childProp, columnField, compareField, isVerticalCompareRows) {
				return function get(items) {
					var compareRowItemEvaluations = [];
					angular.forEach(items, function (item) {
						var dataNode = isVerticalCompareRows ? item : item.parentItem;
						if (entity === item && dataNode && dataNode.QuoteItems && (!_.isNaN(parseFloat(item[columnField])) || _.isNull(item[columnField]))) {
							var quote = _.find(dataNode.QuoteItems, {QuoteKey: quoteKey});
							if (quote) {
								var exchangeRate = service.getExchangeRate(entity.RfqHeaderId, quote.QtnHeaderId);
								var quoteCopy = angular.copy(quote);
								quoteCopy[compareField] = value;

								if (compareField === boqCompareRows.discountPercentIT) {
									quoteCopy[boqCompareRows.discount] = 0;
								} else if (compareField === boqCompareRows.discount) {
									quoteCopy[boqCompareRows.discountPercentIT] = 0;
								}

								// update 'Price' value when item evaluation changed.
								if (compareField === boqCompareRows.prcItemEvaluationFk && _.isNumber(value)) {
									quoteCopy[boqCompareRows.price] = value;
								}
								let taxCodes = lookupDescriptorService.getData('TaxCode');
								let currTaxCode = _.find(taxCodes, {Id: quote.TaxCodeFk});
								let vatPercent = currTaxCode ? currTaxCode.VatPercent : 0;

								let newPrice = 0;
								let priceOc = 0;
								if (childProp === 'Children' && _.includes(service.itemDataToPriceFields, compareField)) {

									let priceExtra = 0; // consider use 0 when recalculate backward price.

									switch (compareField) {
										case  service.itemCompareFields.total:
											newPrice = itemCalculationHelperService.getPriceFromTotal(quote, value, priceExtra);
											break;
										case  service.itemCompareFields.totalNoDiscount:
											newPrice = itemCalculationHelperService.getPriceFromTotalNoDiscount(quote, value, priceExtra);
											break;
										case service.itemCompareFields.totalOC:
											newPrice = itemCalculationHelperService.getPriceFromTotalOc(quote, value, priceExtra, exchangeRate);
											break;
										case service.itemCompareFields.totalOcNoDiscount:
											newPrice = itemCalculationHelperService.getPriceFromTotalOcNoDiscount(quote, value, priceExtra, exchangeRate);
											break;
										case  service.itemCompareFields.totalGross:
											newPrice = itemCalculationHelperService.getPriceFromTotalGross(value, quote.Quantity, priceExtra, vatPercent, quote.Discount, quote.PriceUnit, quote.FactorPriceUnit, quote.DiscountSplit);
											break;
										case service.itemCompareFields.totalOCGross:
											newPrice = itemCalculationHelperService.getPriceFromTotalOcGross(value, quote.Quantity, priceExtra, vatPercent, quote.Discount, quote.PriceUnit, quote.FactorPriceUnit, quote.DiscountSplitOc, exchangeRate);
											break;
										case  service.itemCompareFields.priceOc:
											if (exchangeRate !== 0) {
												newPrice = value / exchangeRate;
											}
											break;
									}
									quoteCopy[boqCompareRows.price] = newPrice;
								}

								if (childProp === 'BoqItemChildren' && _.includes(service.boqDataToPriceFields, compareField)) {
									newPrice = quoteCopy[boqCompareRows.price];
									switch (compareField) {
										case boqCompareRows.priceOc:
											newPrice = value / (exchangeRate || 1);
											break;
										case boqCompareRows.finalPrice:
											if (quote.Quantity !== 0 && (100 - quote.DiscountPercent) !== 0) {
												newPrice = value / quote.Quantity * 100 / (100 - quote.DiscountPercent);
											}
											break;
										case boqCompareRows.finalPriceOc:
											if (quote.Quantity !== 0 && (100 - quote.DiscountPercent) !== 0) {
												priceOc = value / quote.Quantity * 100 / (100 - quote.DiscountPercent);
												newPrice = priceOc / (exchangeRate || 1);
											}
											break;
										case boqCompareRows.urBreakdown1:
										case boqCompareRows.urBreakdown2:
										case boqCompareRows.urBreakdown3:
										case boqCompareRows.urBreakdown4:
										case boqCompareRows.urBreakdown5:
										case boqCompareRows.urBreakdown6:
											if (service.showUrbData(dataNode, compareField)) {
												newPrice = quote[boqCompareRows.urBreakdown1] + quote[boqCompareRows.urBreakdown2] +
													quote[boqCompareRows.urBreakdown3] + quote[boqCompareRows.urBreakdown4] + quote[boqCompareRows.urBreakdown5] +
													quote[boqCompareRows.urBreakdown6] - quote[compareField] + value;
												quote[compareField + 'Oc'] = value * (exchangeRate || 1);
											}
											break;
									}
									quoteCopy[boqCompareRows.price] = newPrice;
								}

								compareRowItemEvaluations.push(quoteCopy);
							}
						} else if (entity === item && dataNode && dataNode.QuoteItems && _.includes(service.editableCompareStringFields, compareField)) {
							var quoteItem = _.find(dataNode.QuoteItems, {QuoteKey: quoteKey});
							quoteItem[compareField] = value;
						}
						compareRowItemEvaluations.push(...(get(platformObjectHelper.getValue(item, childProp)) ?? []));
					});
					return compareRowItemEvaluations;
				};
			};

			/**
			 * add 'Characteristic Total' row to Rfq row if the Rfq has Characteristics.
			 */
			service.addCharacteristicTotalRow2RfqRow = function addCharacteristicTotalRow2RfqRow(configService, qtnMatchCache, itemList, rfqCharacteristicGroupTreeCache, children, lineType, quoteCompareRowsCache) {
				var characterConfig = _.find(quoteCompareRowsCache, {Field: service.constant.Characteristics});
				if (characterConfig && characterConfig.Visible && !_.isEmpty(rfqCharacteristicGroupTreeCache)) {
					var totalRow = {};
					totalRow.Id = 'characteristic_total_row_' + itemList[0].RfqHeaderId;
					totalRow[lineType] = compareLineTypes.characteristicTotal;
					totalRow.HasChildren = false;
					totalRow.RfqHeaderId = itemList[0].RfqHeaderId;
					totalRow.ReqHeaderId = itemList[0].ReqHeaderId;
					totalRow[children] = [];

					addCharacteristicGroupRow(totalRow, rfqCharacteristicGroupTreeCache, children, lineType);   // add group to characteristic total row
					addCharacteristicRow(totalRow[children], configService, qtnMatchCache, children, lineType);                                // add characteristic to characteristic group row

					itemList.unshift(totalRow);
				}
			};

			/**
			 * add 'Characteristic Group' row (hierarchy） to 'characteristic total' row.
			 */
			function addCharacteristicGroupRow(parentItem, groups, children, lineType) {
				_.forEach(groups, function (group) {
					var groupRow = {};
					groupRow.Id = 'characteristic_group_row_' + parentItem.RfqHeaderId + '_' + group.Id;
					groupRow.GroupId = group.Id;
					groupRow.SectionId = group.SectionId;
					groupRow[lineType] = compareLineTypes.characteristicGroup;
					groupRow.HasChildren = false;
					groupRow[children] = [];
					groupRow.RfqHeaderId = parentItem.RfqHeaderId;
					groupRow.ReqHeaderId = parentItem.ReqHeaderId;

					// add child group row
					addCharacteristicGroupRow(groupRow, group.Children, children, lineType);

					parentItem[children].push(groupRow);
					parentItem.HasChildren = true;
				});
			}

			/**
			 * add 'Characteristic' row to 'characteristic group' row (hierarchy).
			 */
			function addCharacteristicRow(groups, configService, qtnMatchCache, children, lineType) {
				_.forEach(groups, function (group) {
					// add characteristics to group (filter by section id and group id)
					var characteristics = _.filter(configService.rfqCharacteristicCache, {
						SectionId: group.SectionId,
						GroupId: group.GroupId
					}) || [];

					_.forEach(characteristics, function (item) {
						var itemRow = {};
						itemRow.Id = 'characteristic_row_' + item.Id;
						itemRow.CharacteristicDataId = item.Id;            // used for set row line name.
						itemRow.GroupId = group.GroupId;
						itemRow.CharacteristicId = item.CharacteristicId;
						itemRow[lineType] = compareLineTypes.characteristic;
						itemRow.Reference = item.Code;
						// row[commonService.constant.compareDescription] = item.Description;
						itemRow.HasChildren = false;
						itemRow[children] = [];
						itemRow.ReqHeaderId = group.ReqHeaderId;
						itemRow.RfqHeaderId = group.RfqHeaderId;
						itemRow.CharacteristicTypeId = item.CharacteristicTypeId;
						itemRow.CompareDescription = '';

						// add quote column's value for the characteristic row
						_.forEach(configService.visibleCompareColumnsCache, function (quoteColumn) {
							var itemList = qtnMatchCache[group.RfqHeaderId];
							var itemConfig = _.find(itemList, function (item) {
								return item.QuoteKey === quoteColumn.Id;
							});
							var quoteId = itemConfig ? itemConfig.QtnHeaderId : quoteColumn.QuoteHeaderId;

							if (quoteColumn.QuoteHeaderId === checkBidderService.constant.targetValue) {
								itemRow[quoteColumn.Id] = item.ValueText || '';
							} else if (quoteColumn.QuoteHeaderId !== checkBidderService.constant.baseBoqValue) {
								var quoteHeader = _.find(configService.quoteCharacteristicCache, {
									ObjectId: quoteId,
									CharacteristicId: itemRow.CharacteristicId
								});
								if (quoteHeader) {
									itemRow[quoteColumn.Id + '_$hasBidder'] = true;
								}
								if (itemRow.CharacteristicTypeId === 10) {
									itemRow[quoteColumn.Id] = quoteHeader ? quoteHeader.CharacteristicValueId : -1;
								} else {
									itemRow[quoteColumn.Id] = quoteHeader ? quoteHeader.ValueText : '';
								}
							}
						});
						configService.childrenCharacterCache.push(itemRow);
						group[children].push(itemRow);
						group.HasChildren = true;
					});

					// add characteristics to group's childGroup
					addCharacteristicRow(group[children], configService, qtnMatchCache, children, lineType);
				});
			}

			service.characterFormatter = function characterFormatter(dataContext, columnDef, rfqCharacteristics, quoteCharacteristics, qtnMatchCache, quoteKey, value) {
				if (quoteKey === checkBidderService.constant.targetKey) {
					var rfqCharacteristic = _.find(rfqCharacteristics, {Id: dataContext.CharacteristicDataId});

					if (!rfqCharacteristic) {
						return service.constant.columnFieldSeparator;
					}
					if (!basicsCharacteristicTypeHelperService.isLookupType(rfqCharacteristic.CharacteristicTypeId)) {
						value = basicsCharacteristicTypeHelperService.convertValue(value, rfqCharacteristic.CharacteristicTypeId);
					}
					return service.formatValueByCharacteristicTypeId(rfqCharacteristic, value, true);
				} else if (quoteKey !== checkBidderService.constant.baseBoqKey) {
					if (!dataContext[quoteKey + '_$hasBidder']) {   // if has not bidder, return '-'
						return service.constant.columnFieldSeparator;
					}
					if (_.isFunction(columnDef.domain)) {
						// dataContext[quoteKey] = value;
						columnDef.domain(dataContext, columnDef);
					}
					return (columnDef.dynamicFormatterFn || function () {
						return '';
					})(dataContext) || '';
				}
				return '';
			};

			service.characteristicDomain = function characteristicDomain(configService, qtnMatchCache, item, column) {
				var domain;
				var itemList = qtnMatchCache[item.RfqHeaderId];
				var itemConfig = _.find(itemList, function (item) {
					return item.QuoteKey === column.field;
				});
				var quoteCharacteristic;
				if (itemConfig) {
					var ownKey = itemConfig.OwnQuoteKey ? itemConfig.OwnQuoteKey : column.field;
					quoteCharacteristic = _.find(configService.allQuoteCharacteristicCache, {
						ObjectId: Number(service.getQuoteId(ownKey)),
						CharacteristicId: item.CharacteristicId
					});
					if (!quoteCharacteristic) {
						return service.constant.columnFieldSeparator;
					}
				} else {
					return service.constant.columnFieldSeparator;
				}

				if (basicsCharacteristicTypeHelperService.isLookupType(quoteCharacteristic.CharacteristicTypeId)) {
					var filters = [
						{
							key: 'characteristicDataDiscreteValueLookupFilter',
							serverSide: false,
							fn: function (item) {
								// remove all discrete values not belonging to the selected characteristic
								return quoteCharacteristic.CharacteristicId === item.CharacteristicFk;
							}
						}
					];
					if (!lookupFilterService.hasFilter(filters[0].key)) {
						lookupFilterService.registerFilter(filters);
					}
					domain = 'lookup';
					column.editorOptions = {
						lookupDirective: 'basics-lookup-data-by-custom-data-service-grid-less',
						lookupOptions: {
							dataServiceName: 'basicsCharacteristicDataDiscreteValueLookupService',
							lookupModuleQualifier: 'basicsCharacteristicDataDiscreteValueLookup',
							lookupType: 'basicsCharacteristicDataDiscreteValueLookup',
							valueMember: 'Id',
							displayMember: 'DescriptionInfo.Description',
							showClearButton: true,
							events: [
								{
									name: 'onSelectedItemChanged',
									handler: function (e, args) {
										item[column.id] = args.selectedItem.Id;
										item.description = args.selectedItem.DescriptionInfo.Translated;
										quoteCharacteristic.ValueText = item.description;
										quoteCharacteristic.CharacteristicValueId = args.selectedItem.Id;
									}
								}
							],
							filterKey: 'characteristicDataDiscreteValueLookupFilter'
						}
					};
					column.formatterOptions = {
						lookupType: 'basicsCharacteristicDataDiscreteValueLookup',
						dataServiceName: 'basicsCharacteristicDataDiscreteValueLookupService',
						valueMember: 'Id',
						displayMember: 'DescriptionInfo.Description',
						filter: function (item) {
							return item.SectionId;
						}
					};
					column.dynamicFormatterFn = function () {
						return quoteCharacteristic.ValueText;
					};
					column.validator = null;
				} else {
					domain = basicsCharacteristicTypeHelperService.characteristicType2Domain(quoteCharacteristic.CharacteristicTypeId);
					column.dynamicFormatterFn = function (entity) {
						// quoteCharacteristic =
						var tempValue = basicsCharacteristicTypeHelperService.convertValue(entity[column.id], entity.CharacteristicTypeId);
						return service.formatValueByCharacteristicTypeId(entity, tempValue);
					};
				}
				item[column.id] = basicsCharacteristicTypeHelperService.convertValue(item[column.id], quoteCharacteristic.CharacteristicTypeId);

				return domain;
			};

			service.collectCharacterModifiedData = function collectCharacterModifiedData(mainService, qtnMatchCache, argsBeforeValueChanged, args, isBoq) {

				var otherService = null, configService = null,
					quoteKey = args.grid.getColumns()[args.cell].field,
					itemList = qtnMatchCache[args.item.RfqHeaderId],
					itemConfig = _.find(itemList, function (item) {
						return item.QuoteKey === quoteKey && item.OwnQuoteKey;
					});
				var ownQuoteKey = itemConfig ? itemConfig.OwnQuoteKey : quoteKey;

				// update boq or item
				if (isBoq) {
					otherService = $injector.get('procurementPriceComparisonItemService');
					configService = $injector.get('procurementPriceComparisonItemConfigService');
					updateOtherCharacter(args, configService, otherService, quoteKey, ownQuoteKey);
				} else {
					otherService = $injector.get('procurementPriceComparisonBoqService');
					configService = $injector.get('procurementPriceComparisonBoqConfigService');
					updateOtherCharacter(args, configService, otherService, quoteKey, ownQuoteKey);
				}
				var characteristic = _.find(mainService.modifiedData.characteristic, {
					ObjectId: Number(service.getQuoteId(ownQuoteKey)),
					CharacteristicId: args.item.CharacteristicId
				});
				if (characteristic) {
					characteristic.ValueText = args.item[quoteKey];
					basicsCharacteristicTypeHelperService.dispatchValue(characteristic, characteristic.CharacteristicTypeId);
					return;
				}

				var quoteId = service.getQuoteId(ownQuoteKey);
				if (!mainService.modifiedData.characteristic) {
					if (otherService.modifiedData.characteristic) {
						mainService.modifiedData.characteristic = otherService.modifiedData.characteristic;
					} else {
						mainService.modifiedData.characteristic = [];
						otherService.modifiedData.characteristic = mainService.modifiedData.characteristic;
					}
				}

				characteristic = {};
				characteristic.ValueText = args.item[quoteKey];
				characteristic.CharacteristicId = args.item.CharacteristicId;
				characteristic.CharacteristicTypeId = args.item.CharacteristicTypeId;
				basicsCharacteristicTypeHelperService.dispatchValue(characteristic, characteristic.CharacteristicTypeId);
				// characteristic.CharacteristicValueId = characteristic.CharacteristicValueFk;
				characteristic.ObjectId = Number(quoteId);
				characteristic.RfqHeaderId = args.item.RfqHeaderId;
				mainService.modifiedData.characteristic.push(characteristic);

			};

			function updateOtherCharacter(args, configService, otherService, quoteKey, ownQuoteKey) {
				var childItems = _.find(configService.childrenCharacterCache, function (child) {
					return child.CharacteristicId === args.item.CharacteristicId && child.RfqHeaderId === args.item.RfqHeaderId;
				});
				if (childItems && (childItems[quoteKey] || childItems[quoteKey] === false)) {
					childItems[quoteKey] = args.item[quoteKey];
					var quoteCharacteristic = _.find(configService.allQuoteCharacteristicCache, {
						ObjectId: Number(service.getQuoteId(ownQuoteKey)),
						CharacteristicId: args.item.CharacteristicId
					});
					if (quoteCharacteristic) {
						if (basicsCharacteristicTypeHelperService.isLookupType(quoteCharacteristic.CharacteristicTypeId)) {
							quoteCharacteristic.ValueText = args.item.description;
							quoteCharacteristic.CharacteristicValueId = args.item[quoteKey];
						}
					}
					otherService.redrawTree(false, null);
				}
			}

			service.reloadNewVersion = function reloadNewVersion(quoteHeaderNews, compareType, qtnIds, callback) {

				// var quoteHeaderNews = response.data.QuoteHeaderNews;//get new qtn_headers .
				if (quoteHeaderNews && quoteHeaderNews.length > 0) {
					var updateData = {};
					updateData.compareColumns = [];
					var biznessPartners = lookupDescriptorService.getData('businesspartner');
					// var qtnIds = Object.keys(modifiedData) || [];
					var newItemId = service.constant.newCustomColumnVale;
					_.forEach(quoteHeaderNews, function (quoteHeaderNew) {
						var newItem = {};
						newItem.Version = 0;
						newItem.QtnHeaderFk = quoteHeaderNew.Id;
						newItem.Visible = true;
						newItem.BusinessPartnerId = quoteHeaderNew.BusinessPartnerFk;
						newItem.Children = [];
						newItem.Id = newItemId;
						newItemId--;
						var biznessPartner = _.find(biznessPartners, {Id: quoteHeaderNew.BusinessPartnerFk});
						newItem.DescriptionInfo = {};
						newItem.DescriptionInfo.Translated = biznessPartner ? biznessPartner.BusinessPartnerName1 : '';
						newItem.DescriptionInfo.Description = newItem.DescriptionInfo.Translated;
						newItem.DescriptionInfo.DescriptionTr = null;
						updateData.compareColumns.push(newItem);
					});
					var basInfo = service.getBaseRfqInfo();
					updateData.RfqHeaderFk = basInfo.baseRfqId;
					updateData.CompareType = compareType;
					updateData.OldQuoteIds = qtnIds;
					return $http.post(globals.webApiBaseUrl + 'procurement/pricecomparison/compareview/updatenewcomparecolumn', updateData).then(
						function (result) {
							if (_.isFunction(callback)) {
								callback();
							}
							return result;
						}
					);
				}
				return $q.when(false);
			};
			service.getLookupValue = function (type, key) {
				var items = lookupDescriptorService.getData(type);
				if (items) {
					return items[key];
				}
				return null;
			};

			// reset sorting
			service.resetSorting = function (list) {
				var index = 1;
				_.forEach(list, function (item) {
					item.Sorting = index++;
				});
				return list;
			};

			// find highlight
			// Quantity
			// Price
			// Discount
			service.checkHighlightQtn = function (compareColumnsCache, quoteItems) {
				if (!compareColumnsCache || !quoteItems) {
					return;
				}
				var differentFields = {};
				var differentNumbers = {};
				var checkHighlightFields = service.highlightFields;
				_.forEach(compareColumnsCache, function (col) {
					if (col.IsHighlightChanges === true) {
						var quoteItem = _.find(quoteItems, {QuoteKey: col.Id});
						if (quoteItem) {
							_.forEach(checkHighlightFields, function (field) {
								var tempField = differentNumbers[field];
								if ((tempField || tempField === 0) && tempField !== false && tempField !== quoteItem[field]) {
									differentFields[field] = false;
								}
								if ((!tempField && tempField !== 0)) {
									differentNumbers[field] = quoteItem[field];
								}
							});
						}
					}
					if (col.IsDeviationRef === true && !col.CompareColumnFk) {
						differentFields.markFieldQtn = col.Id;
					}
				});

				return differentFields;
			};
			// for fields readonly
			service.setFieldReadOnly = function (item, readonlyFields) {
				platformRuntimeDataService.readonly(item, readonlyFields);
			};
			// register change
			service.onHighlightSelectedChanged = new PlatformMessenger();
			service.getSelectedLookupMes = function (id) {
				var result = '';
				switch (id) {
					case 3:
						result = checkBidderService.constant.baseBoqKey;
						break;
					case 4:
					case 10:
					case 11:
						result = checkBidderService.constant.targetKey;
						break;
					case 5:
						result = service.constant.averageValueExcludeTarget;
						break;
					case 6:
						result = service.constant.minValueExcludeTarget;
						break;
					case 7:
						result = service.constant.maxValueExcludeTarget;
						break;
					case 100:
						result = service.constant.deviationColumn;
						break;
				}
				return result;
			};

			service.loadDeviation = function () {
				lookupDescriptorService.loadData('PrcItemEvaluation').then(function (data) {
					var deviation = angular.copy(data);
					deviation.push(service.qtnReference);
					lookupDescriptorService.updateData('DeviationReference', deviation);
				});
			};

			service.highlightRows = function (parentItem, newRow, visibleRow, deviationFields, fieldKeys, markFieldQtn, leadingField, compareType, isBoqLevelRow) {
				// for highlight function
				if (newRow && _.includes(deviationFields, visibleRow.Field) && visibleRow.DeviationField) {
					let deviationRef = null;
					let indexStr = service.getSelectedLookupMes(visibleRow.DeviationReference);

					if (indexStr === service.constant.deviationColumn && !!markFieldQtn) {
						if (visibleRow.Field === boqCompareRows.percentage) {
							if (_.has(newRow, 'percentages')) {
								deviationRef = newRow.percentages[markFieldQtn];
							} else {
								deviationRef = newRow[markFieldQtn];
							}
						} else if (visibleRow.Field === boqCompareRows.absoluteDifference) {
							deviationRef = 0;
						} else {
							let qtnItem = _.find(parentItem.QuoteItems, {QuoteKey: markFieldQtn});
							deviationRef = qtnItem ? qtnItem[visibleRow.Field] : null;
						}
					} else {
						let deviationField = visibleRow.Field;
						if (visibleRow.Field === service.itemCompareFields.absoluteDifference || visibleRow.Field === service.itemCompareFields.percentage) {
							deviationField = leadingField;
							switch (visibleRow.DeviationReference) {
								case 10:
									deviationField = service.itemCompareFields.price;
									break;
								case 11: {
									deviationField = compareType === service.constant.compareType.prcItem ? service.itemCompareFields.total : service.boqCompareFields.itemTotal;
									break;
								}
								default:
									break;
							}
						}
						deviationRef = getDeviationRefByIndexStr(parentItem, visibleRow, markFieldQtn, deviationField, compareType, isBoqLevelRow, indexStr);
					}

					if (!!deviationRef || deviationRef === 0) {
						let minDeviation = deviationRef * (1 - visibleRow.DeviationPercent / 100),
							maxDeviation = deviationRef * (1 + visibleRow.DeviationPercent / 100);
						// deal with the case when the deviationRef is negative value
						if (minDeviation > maxDeviation) {
							let tempDeviation = maxDeviation;
							maxDeviation = minDeviation;
							minDeviation = tempDeviation;
						}
						_.forIn(newRow, function (val, key) {
							if (_.includes(fieldKeys, key)) {
								let rowValue = val;
								if (visibleRow.Field === service.itemCompareFields.absoluteDifference) {
									rowValue = deviationRef + val;
								} else if (visibleRow.Field === service.itemCompareFields.percentage) {
									rowValue = deviationRef * val / 100;
								}
								newRow[key + service.constant.deviationRow] = (rowValue < minDeviation || rowValue > maxDeviation);
							}
						});
					}
				}
			};

			service.getBasicQuote = function (parentItem, visibleRow, quoteKey, markFieldQtn, leadingField, compareType, isBoqLevelRow) {
				if (checkBidderService.item.isReference(quoteKey)) {
					return {
						absoluteDifference: service.constant.tagForNoQuote,
						basicPercentage: service.constant.tagForNoQuote
					};
				}

				if (!_.includes(service.valuableLeadingFields, leadingField)) {
					return {
						absoluteDifference: 0,
						basicPercentage: 0
					};
				}

				let indexStr = service.getSelectedLookupMes(visibleRow.DeviationReference);
				let currentQuoteItem = _.find(parentItem.QuoteItems, {QuoteKey: quoteKey});
				let absoluteDifference = 0, basicPercentage = 0, basicFieldValue = 0, basicQuoteKey = markFieldQtn;
				let quoteItemsExclude = _.filter(parentItem.QuoteItems, function (item) {
					return checkBidderService.item.isNotReference(item.QuoteKey) && !item.IsIdealBidder;
				});
				let deviationField = leadingField;
				// select 'Is Deviation Reference' bidder as the Basic Quote, Leading Field is 'Price'
				if (indexStr === service.constant.deviationColumn && !!markFieldQtn) {
					let qtnItem = _.find(parentItem.QuoteItems, {QuoteKey: markFieldQtn});
					basicFieldValue = qtnItem ? qtnItem[deviationField] : 0;

					if (parentItem.LineType === compareLineTypes.requisition) {
						let totalValue = _.sumBy(_.filter(parentItem.QuoteItems, {QuoteKey: quoteKey}), deviationField);
						absoluteDifference = totalValue - basicFieldValue;
						if (basicFieldValue) {
							basicPercentage = totalValue / basicFieldValue * 100;
						}
					} else {
						absoluteDifference = (currentQuoteItem ? currentQuoteItem[deviationField] : 0) - basicFieldValue;
						if (basicFieldValue) {
							basicPercentage = (currentQuoteItem ? currentQuoteItem[deviationField] : 0) / basicFieldValue * 100;
						}
					}
				} else if (indexStr) {
					switch (visibleRow.DeviationReference) {
						case 10:
							deviationField = service.itemCompareFields.price;
							break;
						case 11: {
							deviationField = compareType === service.constant.compareType.prcItem ? service.itemCompareFields.total : service.boqCompareFields.itemTotal;
							break;
						}
						default:
							break;
					}
					// select the min, leading field is DeviationReference as Basic Quote
					// (DeviationReference => baseBoqKey,targetKey,averageValueExcludeTarget,minValueExcludeTarget,maxValueExcludeTarget)
					basicFieldValue = getDeviationRefByIndexStr(parentItem, visibleRow, markFieldQtn, leadingField, compareType, isBoqLevelRow, indexStr);

					if (parentItem.LineType === compareLineTypes.requisition) {
						let totalValue = _.sumBy(_.filter(parentItem.QuoteItems, {QuoteKey: quoteKey}), deviationField);
						absoluteDifference = totalValue - basicFieldValue;
						if (basicFieldValue) {
							basicPercentage = totalValue / basicFieldValue * 100;
						}
					} else {
						absoluteDifference = (currentQuoteItem ? currentQuoteItem[deviationField] : 0) - basicFieldValue;
						if (basicFieldValue) {
							basicPercentage = (currentQuoteItem ? currentQuoteItem[deviationField] : 0) / basicFieldValue * 100;
						}
					}
				} else {
					// the old leading field logic,select the min, leading field(checkbox) as Basic Quote
					let minLeadingFieldItem = _.minBy(quoteItemsExclude, deviationField);
					if (minLeadingFieldItem) {
						basicQuoteKey = minLeadingFieldItem.QuoteKey;
						basicFieldValue = minLeadingFieldItem[deviationField];

						if (parentItem.LineType === compareLineTypes.requisition) {
							let totalValue = _.sumBy(_.filter(parentItem.QuoteItems, {QuoteKey: quoteKey}), deviationField);
							absoluteDifference = totalValue - basicFieldValue;
							if (basicFieldValue) {
								basicPercentage = totalValue / basicFieldValue * 100;
							}
						} else {
							absoluteDifference = (currentQuoteItem ? currentQuoteItem[deviationField] : 0) - basicFieldValue;
							if (basicFieldValue) {
								basicPercentage = (currentQuoteItem ? currentQuoteItem[deviationField] : 0) / basicFieldValue * 100;
							}
						}
					}
				}

				if (basicQuoteKey === quoteKey) {
					absoluteDifference = service.constant.tagForNoQuote;
				}
				return {
					absoluteDifference: absoluteDifference,
					basicPercentage: basicPercentage
				};
			};

			function getDeviationRefByIndexStr(parentItem, visibleRow, markFieldQtn, leadingField, compareType, isBoqLevelRow, indexStr) {
				let basicFieldValue = null;
				let budgetPerUnit = service.itemCompareFields.budgetPerUnit,
					budgetTotal = service.itemCompareFields.budgetTotal;
				if (checkBidderService.item.isReference(indexStr)) {
					let noBidderItems = _.filter(parentItem.QuoteItems, {QuoteKey: indexStr});
					switch (visibleRow.DeviationReference) {
						case 4:
							basicFieldValue = noBidderItems ? _.sumBy(noBidderItems, leadingField) : 0;
							break;
						case 10:
							basicFieldValue = noBidderItems ? _.sumBy(noBidderItems, budgetPerUnit) : 0;
							break;
						case 11: {
							basicFieldValue = noBidderItems ? _.sumBy(noBidderItems, budgetTotal) : 0;
							break;
						}
						default:
							break;
					}
				} else {
					let quoteItemsExclude = _.filter(parentItem.QuoteItems, function (item) {
						return checkBidderService.item.isNotReference(item.QuoteKey) && !item.IsIdealBidder;
					});
					let priceValuesExclude = _.map(quoteItemsExclude, leadingField);
					if (indexStr === service.constant.averageValueExcludeTarget) {
						if (parentItem.LineType === compareLineTypes.requisition) {
							basicFieldValue = parentItem[service.constant.averageValueExcludeTarget] ? parentItem[service.constant.averageValueExcludeTarget] : 0;
						} else {
							basicFieldValue = service.calculateAverageValue(priceValuesExclude);
						}
					} else if (indexStr === service.constant.minValueExcludeTarget) {
						basicFieldValue = parentItem.LineType === compareLineTypes.requisition ? basicFieldValue = _.min(parentItem.totalValuesExcludeTarget) : basicFieldValue = _.min(priceValuesExclude);
					} else if (indexStr === service.constant.maxValueExcludeTarget) {
						basicFieldValue = parentItem.LineType === compareLineTypes.requisition ? basicFieldValue = _.max(parentItem.totalValuesExcludeTarget) : basicFieldValue = _.max(priceValuesExclude);
					}
				}

				return basicFieldValue;
			}

			service.onHighlightChanged = function (eventInfo, list, deviationFields) {
				var readonlyFields = [
					{field: 'DeviationReference', readonly: true}
				];
				_.forEach(list, function (item) {
					if (_.includes(deviationFields, item.Field)) {
						if (eventInfo.value && item.DeviationField) {
							item.DeviationReference = service.qtnReference.Id;
							service.setFieldReadOnly(item, readonlyFields);
						} else if (!eventInfo.value) {
							item.DeviationField = false;
							item.DeviationReference = null;
						}
					}
				});
			};
			// eslint-disable-next-line no-unused-vars
			service.highlightRowCellChanged = function (item, isDeviationColumn, percentage) {
				var readonlyFields = [
					{field: 'DeviationReference', readonly: (!item.DeviationField || isDeviationColumn)}
				];
				service.setFieldReadOnly(item, readonlyFields);
				if (item.DeviationField) { // if true set default value
					item.DeviationReference = isDeviationColumn ? service.qtnReference.Id : 5;
				} else {  // if false set fields null
					item.DeviationReference = null;
				}
			};

			service.highlightRowReadonly = function (item, deviationFields, isDeviationColumn) {
				let readonlyFields = [];
				if (_.includes(deviationFields, item.Field) && item.Field !== boqCompareRows.percentage) {
					if (!item.DeviationPercent) {
						item.DeviationPercent = 0;
					}
					if (item.DeviationReference === service.qtnReference.Id && !isDeviationColumn) {
						item.DeviationReference = 5;
					}
					readonlyFields.push({field: 'DeviationPercent', readonly: false});
					readonlyFields.push({field: 'DeviationField', readonly: false});
				} else {
					readonlyFields.push({field: 'DeviationField', readonly: true});
					readonlyFields.push({field: 'DeviationPercent', readonly: true});
				}
				let dFReadOnly = item.Field === boqCompareRows.percentage ? true : !item.DeviationField;
				let field = {field: 'DeviationReference', readonly: dFReadOnly};
				readonlyFields.push(field);

				return readonlyFields;
			};

			service.highlightColumnVisible = function (item) {
				// If Visible is unchecked, this Dev checkbox should be clear and readonly.
				if (!item.Visible && item.IsDeviationRef) {
					item.IsDeviationRef = false;
					service.onHighlightSelectedChanged.fire({
						eventName: 'ColumnHighlightChanged',
						value: false
					});
					_.forEach(item.Children, function (child) {
						child.IsDeviationRef = false;
					});
				}
				service.setFieldReadOnly(item, [{field: 'IsDeviationRef', readonly: !item.Visible}]);
			};

			service.highlightColumnDevRef = function (item, list) {
				_.forEach(list, function (col) {
					if (col.CompareColumnFk === item.Id) {
						col.IsDeviationRef = item.IsDeviationRef;
					} else if (col.Id !== item.Id && col.IsDeviationRef && item.IsDeviationRef) {
						col.IsDeviationRef = false;
					}
				});
				service.onHighlightSelectedChanged.fire({
					eventName: 'ColumnHighlightChanged',
					value: item.IsDeviationRef
				});
			};

			service.highlightColumnChanged = function (item) {
				_.forEach(item.Children, function (child) {
					child.IsHighlightChanges = item.IsHighlightChanges;
				});
			};

			service.highlightColumnReadonly = function (item) {
				// set Highlight readonly
				if (item.CompareColumnFk > 0) {
					platformRuntimeDataService.readonly(item, [
						{
							field: 'IsHigLightChanges',
							readonly: true
						},
						{
							field: 'IsDeviationRef',
							readonly: true
						}
					]);
				}
			};

			service.highlightColumnChangedFire = function (baseRfqs) {
				var deviationRfq = _.find(baseRfqs, function (item) {
					return item.IsDeviationRef;
				});
				if (deviationRfq) {
					service.onHighlightSelectedChanged.fire({
						eventName: 'ColumnHighlightChanged',
						value: true
					});
				}
			};

			service.clearFormatterOptions = function clearFormatterOptions(columnDef) {
				if (columnDef && columnDef.formatterOptions) {
					columnDef.formatterOptions = null;
					columnDef.dynamicFormatterFn = null;
				}
			};

			service.setReadonlyForNotVisible = function setReadonlyForNotVisible(list) {

				var fields = [{field: 'IsDeviationRef', readonly: true}];
				var notVisibleColumns = _.filter(list, {Visible: false});

				if (notVisibleColumns && notVisibleColumns.length > 0) {
					_.forEach(notVisibleColumns, function (item) {
						platformRuntimeDataService.readonly(item, fields);
					});
				}
			};

			// billing schema
			service.addSchemaCompareFieldRows = function (itemList, rfqHeaderId, reqHeaderId, configService, children, lineType) {
				let parentRow = {};
				parentRow.Id = 'quote_row_total' + rfqHeaderId;
				parentRow.LineName = $translate.instant('procurement.common.billingSchema');
				parentRow.HasChildren = true;
				parentRow[lineType] = compareLineTypes.billingSchemaGroup;
				parentRow[children] = [];
				parentRow.RfqHeaderId = rfqHeaderId;
				parentRow.ReqHeaderId = reqHeaderId;

				_.each(_.reverse(configService.visibleSchemaCompareRowsCache), function (schemaRow, index) {
					if (schemaRow.Visible) {
						let newRow = {};
						newRow.Id = 'quote_row_' + rfqHeaderId + '_' + schemaRow.Id;
						newRow.LineName = '';
						newRow.CompareDescription = schemaRow.DisplayName;
						newRow[lineType] = compareLineTypes.billingSchemaChildren;
						newRow.HasChildren = false;
						newRow[children] = [];
						newRow.RfqHeaderId = rfqHeaderId;
						newRow.ReqHeaderId = reqHeaderId;
						newRow.CompareField = schemaRow.Field;

						if (index === 0) {
							itemList.unshift(parentRow);
						}
						parentRow[children].unshift(newRow);

						let hasValue = false,
							totalValues = [],                 // store quote values for bidders (includeing Target)
							totalValuesExcludeTarget = [];    // store quote values for bidders (Exclude Target)
						_.forEach(configService.visibleCompareColumnsCache, function (item) {
							hasValue = false;
							newRow[item.Id] = 0;
							let billingSchema = _.find(item['BillingSchemaList'], function (entity) {
								return entity['CostLineTypeId'].toString() === schemaRow.Id;
							});
							if (billingSchema) {
								if (checkBidderService.item.isReference(item.Id)) {
									totalValues.push(billingSchema['CostLineTypeResult']);
									newRow[item.Id] = billingSchema['CostLineTypeResult'];
									hasValue = true;
								} else if (item.RfqHeaderId === rfqHeaderId) {
									if (!item.IsIdealBidder) {
										totalValues.push(billingSchema['CostLineTypeResult']);
										totalValuesExcludeTarget.push(billingSchema['CostLineTypeResult']);
									}
									newRow[item.Id] = billingSchema['CostLineTypeResult'];
									hasValue = true;
								}
							}

							if (item.RfqHeaderId !== rfqHeaderId && item.Children && item.Children.length > 0) {
								let child = _.find(item.Children, {RfqHeaderId: rfqHeaderId});
								if (child) {
									billingSchema = _.find(child['BillingSchemaList'], function (entity) {
										return entity['CostLineTypeId'].toString() === schemaRow.Id;
									});
									if (!item.IsIdealBidder) {
										totalValues.push(billingSchema ? billingSchema['CostLineTypeResult'] : 0);
										totalValuesExcludeTarget.push(billingSchema ? billingSchema['CostLineTypeResult'] : 0);
									}
									newRow[item.Id] = billingSchema ? billingSchema['CostLineTypeResult'] : 0;
									hasValue = true;
								}
							}

							if (!hasValue) { // give default value to calculate the max,min,avg value
								if (!item.IsIdealBidder) {
									let compareType = lineType === 'BoqLineTypeFk' ? service.constant.compareType.boqItem : service.constant.compareType.prcItem;
									let commonHelperService = $injector.get('procurementPriceComparisonCommonHelperService');
									commonHelperService.concludeTargetValue(item.Id, totalValues, totalValuesExcludeTarget, 0, compareType, configService.visibleCompareColumnsCache);
								}
							}
						});

						newRow.totals = totalValuesExcludeTarget;
						service.recalculateValue(newRow, totalValues, totalValuesExcludeTarget);
					}
				});
			};

			// when the change of Sub Container, reset compare field value.Then redraw tree
			service.onRefreshCompareField = new PlatformMessenger();

			/**
			 * @param billingSchemaTypeList: the new billing schema data which return from url,
			 * @param selectedQuote: the currency selected quote, if deal with register message, it will be null
			 * @param curService: the currency service
			 * @param configMatchCache: cache for QTN message
			 * @param children: item:'Children', boq:'BoqItemChildren'
			 * @param lineType: item:'LineType', boq:'BoqLineTypeFk'
			 * @param refreshType: item:RefreshBoqBillingSchema, boq:RefreshItemBillingSchema
			 * @param needRefresh: if deal with register message, it will be false
			 */
			service.resetBillingSchemaValue = function (billingSchemaTypeList, selectedQuote, curService, configMatchCache, children, lineType, refreshType, needRefresh, bidderColumns, billingSchemas) {
				var tree = curService.getTree(); // get the currency tree
				if (_.isEmpty(tree)) {
					if (needRefresh) { // fire the message
						service.onRefreshCompareField.fire({
							eventName: refreshType,
							value: billingSchemaTypeList,
							selectedQuote: selectedQuote,
							billingSchemas: billingSchemas
						});
					}
					return;
				}
				var code = null,
					cell = null,
					quote = null,
					grandTotalRow = null,
					totalValues = [],
					totalValuesExcludeTarget = [],
					qtnMatchCache = null,
					billingSchema = null,
					rfqTotalList = null,
					allRfqTotalList = null,
					currencyQuote = null,
					parentResultSelected = null,
					quoteList = lookupDescriptorService.getData('quote'),
					billingSchemaByQuote = _.groupBy(billingSchemaTypeList, 'QuoteId'),
					billingSchemaService = $injector.get('priceComparisonBillingSchemaService'),
					compareType = lineType === 'BoqLineTypeFk' ? service.constant.compareType.boqItem : service.constant.compareType.prcItem,
					commonHelperService = $injector.get('procurementPriceComparisonCommonHelperService'),
					structureService = compareType === service.constant.compareType.boqItem ? $injector.get('procurementPriceComparisonBoqDataStructureService') : $injector.get('procurementPriceComparisonItemDataStructureService');

				allRfqTotalList = _.filter(tree, function (item) {
					return item[lineType] === compareLineTypes.rfq;
				});
				grandTotalRow = _.find(tree, function (item) {
					return item[lineType] === compareLineTypes.grandTotal;
				});

				_.forOwn(billingSchemaByQuote, function (value, key) {
					// get currency quote, then can get its rfqHeaderFk
					quote = _.find(quoteList, {Id: _.toNumber(key)});
					if (!quote) {
						return;
					}
					// get all qtn message of rfq
					qtnMatchCache = configMatchCache[quote.RfqHeaderFk];
					// get currency qtn message
					currencyQuote = _.find(qtnMatchCache, function (item) {
						return item.QtnHeaderId === quote.Id;
					});
					if (_.isEmpty(currencyQuote)) {
						return;
					}
					// get billing schema message in tree
					rfqTotalList = _.find(tree, function (item) {
						return item.RfqHeaderId === quote.RfqHeaderFk && item[lineType] === compareLineTypes.rfq;
					});

					if (curService.isFinalShowInTotal()) {
						structureService.setColumnValuesForRfqRow(rfqTotalList);
						commonHelperService.setColumnValuesForGrandTotalRow(bidderColumns, grandTotalRow, allRfqTotalList, compareType);
					}

					parentResultSelected = _.find(rfqTotalList[children], function (item) {
						return item[lineType] === compareLineTypes.billingSchemaGroup;
					});
					if (_.isEmpty(parentResultSelected)) {
						return;
					}
					// foreach all billing schema, and update the result of it by the value
					_.forEach(parentResultSelected[children], function (item) {
						totalValues = [];
						totalValuesExcludeTarget = [];
						code = currencyQuote.QuoteKey;
						billingSchema = _.find(value, (schema) => schema.CostLineTypeId.toString() === commonHelperService.getCostLineTypeId(item.Id));
						item[code] = billingSchema ? billingSchema.CostLineTypeResult : 0;

						_.forOwn(item, function (value, key) {  // collecting the totalValues  to calculate max,min,avg
							if (_.startsWith(key, service.constant.prefix2)) {
								commonHelperService.concludeTargetValue(key, totalValues, totalValuesExcludeTarget, value, compareType, bidderColumns);
							}
						});
						item.totals = totalValuesExcludeTarget;
						service.recalculateValue(item, totalValues, totalValuesExcludeTarget); // recalculate max,min,avg
					});
				});

				if (curService.isFinalShowInTotal()) {
					var rfqHeaderId = -1;
					if (selectedQuote) {
						rfqHeaderId = selectedQuote.RfqHeaderId;
					} else {
						if (!billingSchemas || billingSchemas.length <= 0) {
							billingSchemas = billingSchemaService.getList();
						}
						var qtnHeaderId = billingSchemas.length > 0 ? billingSchemas[0].HeaderFk : -1;
						quote = _.find(quoteList, {Id: qtnHeaderId});
						rfqHeaderId = quote ? quote.RfqHeaderFk : -1;
					}

					var currRfqTotalList = _.find(tree, function (item) {
						return item.RfqHeaderId === rfqHeaderId && item[lineType] === compareLineTypes.rfq;
					});
					if (currRfqTotalList) {
						structureService.setColumnValuesForRfqRow(currRfqTotalList);
						commonHelperService.setColumnValuesForGrandTotalRow(bidderColumns, grandTotalRow, allRfqTotalList, compareType);
					}
				}

				if (needRefresh) {
					cell = curService.currentEnterCell || null; // cell used to set the selected item
				}
				curService.redrawTree(true, cell);

				if (needRefresh) { // fire the message
					service.onRefreshCompareField.fire({
						eventName: refreshType,
						value: billingSchemaTypeList,
						selectedQuote: selectedQuote,
						billingSchemas: billingSchemas
					});
				}
			};

			service.recalculateValue = function (item, totalValues, totalValuesExcludeTarget) {
				item[service.constant.maxValueIncludeTarget] = _.max(totalValues) || 0;
				item[service.constant.minValueIncludeTarget] = _.min(totalValues) || 0;
				item[service.constant.averageValueIncludeTarget] = service.calculateAverageValue(totalValues) || 0;
				item[service.constant.maxValueExcludeTarget] = _.max(totalValuesExcludeTarget) || 0;
				item[service.constant.minValueExcludeTarget] = _.min(totalValuesExcludeTarget) || 0;
				item[service.constant.averageValueExcludeTarget] = service.calculateAverageValue(totalValuesExcludeTarget) || 0;
			};

			// quote evaluation
			service.collectEvalValue = function (compareColumns, rfqHeaderId) {
				var totalValues = [],                 // store quote values for bidders (includeing Target)
					totalValuesExcludeTarget = [];    // store quote values for bidders (Exclude Target)

				_.forEach(compareColumns, function (item) {
					if (checkBidderService.item.isTarget(item.Id)) {
						if (item.IsCountInTarget) {
							totalValues.push(item.EvaluationResult);
						}
					} else if (item.RfqHeaderId === rfqHeaderId && checkBidderService.item.isNotReference(item.Id)) {
						if (item.IsCountInTarget) {
							totalValues.push(item.EvaluationResult);
						}
						totalValuesExcludeTarget.push(item.EvaluationResult);
					} else if (item.RfqHeaderId !== rfqHeaderId && item.Children && item.Children.length > 0 && checkBidderService.item.isNotReference(item.Id)) {
						var child = _.find(item.Children, {RfqHeaderId: rfqHeaderId});
						if (item.IsCountInTarget) {
							totalValues.push(child ? child.EvaluationResult : 0);
						}
						totalValuesExcludeTarget.push(child ? child.EvaluationResult : 0);
					}
				});

				// sort by ascending for calculate rank.
				totalValuesExcludeTarget = _.reverse(_.sortBy(totalValuesExcludeTarget));

				return {
					totalValues: totalValues,
					excludeTarget: totalValuesExcludeTarget
				};
			};

			/**
			 * @param rfqHeaderId
			 * @param baseCol: compareColumn
			 * @param newRow: structure obj
			 * @param totalValuesExcludeTarget: store evaluation values for bidders (Exclude Target)
			 */
			service.evalResultStructure = function (rfqHeaderId, baseCol, newRow, totalValuesExcludeTarget) {
				var child = null;
				if (checkBidderService.item.isNotReference(baseCol.Id)) {
					if (baseCol.RfqHeaderId === rfqHeaderId) {
						newRow[baseCol.Id] = Math.round((baseCol.EvaluationResult || 0) * 100) / 100;
					} else if (baseCol.RfqHeaderId !== rfqHeaderId && !!baseCol.Children && baseCol.Children.length > 0) {
						child = _.find(baseCol.Children, {RfqHeaderId: rfqHeaderId});
						newRow[baseCol.Id] = Math.round(((child ? child.EvaluationResult || 0 : 0)) * 100) / 100;
					} else {
						newRow[baseCol.Id] = Math.round(0) / 100;
					}
				} else {
					newRow[baseCol.Id] = Math.round(0) / 100;
				}
				newRow.totals = totalValuesExcludeTarget;
			};

			/**
			 * @param rfqHeaderId
			 * @param baseCol: compareColumn
			 * @param newRow: structure obj
			 * @param totalValuesExcludeTarget: store evaluation values for bidders (Exclude Target)
			 */
			service.evalRankStructure = function (rfqHeaderId, baseCol, newRow, totalValuesExcludeTarget) {
				var child = null,
					rank = 0;
				if (checkBidderService.item.isNotReference(baseCol.Id)) {
					if (baseCol.RfqHeaderId === rfqHeaderId) {
						rank = _.indexOf(totalValuesExcludeTarget, baseCol.EvaluationResult);
						newRow[baseCol.Id] = rank + 1;
					} else if (baseCol.RfqHeaderId !== rfqHeaderId && !!baseCol.Children && baseCol.Children.length > 0) {
						child = _.find(baseCol.Children, {RfqHeaderId: rfqHeaderId});
						rank = _.indexOf(totalValuesExcludeTarget, (child ? child.EvaluationResult || 0 : 0));
						newRow[baseCol.Id] = rank + 1;
					} else {
						rank = _.indexOf(totalValuesExcludeTarget, 0);
						newRow[baseCol.Id] = rank + 1;
					}
				}
			};

			service.evalTurnover = function (newRow, columnId, field, businessPartnerId, isIdealBidder) {
				if (isIdealBidder || checkBidderService.isReference(columnId)) {
					return;
				}
				let lookupItems = _.values(lookupDescriptorService.getData('Turnover'));
				let item = _.find(lookupItems, {Id: businessPartnerId});
				if (item) {
					newRow[columnId] = item[field];
					if (!newRow.totals && !newRow._totals) {
						newRow.totals = [];
						newRow._totals = {};
					}
					if (_.isUndefined(newRow._totals[businessPartnerId])) {
						newRow._totals[businessPartnerId] = item[field];
						newRow.totals.push(item[field]);
					}
				}
			};

			service.evalAvgEvaluationValue = function (newRow, columnId, field, businessPartnerId, isIdealBidder) {
				if (isIdealBidder || checkBidderService.isReference(columnId)) {
					return;
				}
				let lookupItems = _.values(lookupDescriptorService.getData('BusinessPartnerAvgEvaluationValue'));
				let item = _.find(lookupItems, {Id: businessPartnerId});
				if (item) {
					newRow[columnId] = !_.isNil(item[field]) ? item[field] : 0;
					if (!newRow.totals && !newRow._totals) {
						newRow.totals = [];
						newRow._totals = {};
					}
					if (_.isUndefined(newRow._totals[businessPartnerId])) {
						newRow._totals[businessPartnerId] = item[field];
						newRow.totals.push(item[field]);
					}
				}
			};

			service.evalAvgEvaluationRank = function (newRow, columnId, compareColumns, quoteCompareRows, isIdealBidder) {
				if (isIdealBidder || checkBidderService.isReference(columnId)) {
					return;
				}
				let avgEvaluationFields = _.filter(quoteCompareRows, row => {
					return _.includes([
						service.quoteCompareFields.avgEvaluationA,
						service.quoteCompareFields.avgEvaluationB,
						service.quoteCompareFields.avgEvaluationC
					], row.Field);
				});
				if (!_.isEmpty(avgEvaluationFields)) {
					if (!newRow._totals) {
						let lookupItems = _.values(lookupDescriptorService.getData('BusinessPartnerAvgEvaluationValue'));
						let filterQuotes = _.filter(compareColumns, col => {
							return !checkBidderService.isReference(col.Id) && !col.IsIdealBidder;
						});
						let totals = _.map(filterQuotes, col => {
							let item = _.find(lookupItems, {Id: col.BusinessPartnerId});
							let total = item ? _.sumBy(avgEvaluationFields, avgField => {
								return !_.isNil(item[avgField.Field]) ? item[avgField.Field] : 0;
							}) : 0;
							return {
								Id: col.Id,
								Total: total
							};
						});

						newRow._totals = _.reduce(_.sortBy(totals, 'Total').reverse(), (result, curr, index) => {
							if (_.isEmpty(result)) {
								result.push(_.extend(curr, {
									Rank: index + 1
								}));
							} else {
								let prev = result[result.length - 1];
								if (curr.Total === prev.Total) {
									result.push(_.extend(curr, {
										Rank: prev.Rank
									}));
								} else {
									result.push(_.extend(curr, {
										Rank: prev.Rank + 1
									}));
								}
							}
							return result;
						}, []);
					}
					newRow[columnId] = _.find(newRow._totals, {Id: columnId}).Rank;
				}
			};

			/**
			 * @param curService: the currency service
			 * @param evaluationPoints: Number => total points of the evaluation container
			 * @param targetQuote: the selected qtn message of the structure tree
			 * @param children: String => item:'Children', boq:'BoqItemChildren'
			 * @param lineType: String => item:'LineType', boq:'BoqLineTypeFk'
			 * @param refreshType: String => item:RefreshBoqEvaluation, boq:RefreshItemEvaluation
			 * @param needRefresh: bool => if deal with register message, it will be false
			 * @returns {boolean}
			 */
			service.resetEvaluationValue = function (curService, evaluationPoints, targetQuote, children, lineType, refreshType, needRefresh, bidderColumns) {
				if (_.isEmpty(targetQuote)) {
					return false;
				}

				var tree = curService.getTree();
				if ((_.isEmpty(tree) || tree.length < 1) && needRefresh) {
					refreshEvaluationFire(refreshType, evaluationPoints, targetQuote);
					return false;
				}

				var compareEvaluationRank = {},
					totalValues = [],
					totalValuesExcludeTarget = [],
					rfqTotalList = _.find(tree, function (item) {
						return item.RfqHeaderId === targetQuote.RfqHeaderId && item[lineType] === compareLineTypes.rfq;
					});

				if (_.isEmpty(rfqTotalList)) {
					if (needRefresh) {
						refreshEvaluationFire(refreshType, evaluationPoints, targetQuote);
					}
					return false;
				}

				var compareEvaluationResult = _.find(rfqTotalList[children], function (item) {
					return item[lineType] === compareLineTypes.evaluationResult;
				});

				if (_.isEmpty(compareEvaluationResult) && needRefresh) {
					refreshEvaluationFire(refreshType, evaluationPoints, targetQuote);
					return false;
				}

				// if the compare field 'evaluation result' is not equal to the point of the evaluation container
				if (compareEvaluationResult && compareEvaluationResult[targetQuote.QuoteKey] !== evaluationPoints) {
					compareEvaluationResult[targetQuote.QuoteKey] = evaluationPoints;
					// collect the total value of Evaluation Result
					_.forOwn(compareEvaluationResult, function (value, key) {
						if (_.startsWith(key, service.constant.prefix2)) {
							var compareType = lineType === 'BoqLineTypeFk' ? service.constant.compareType.boqItem : service.constant.compareType.prcItem;
							var commonHelperService = $injector.get('procurementPriceComparisonCommonHelperService');
							commonHelperService.concludeTargetValue(key, totalValues, totalValuesExcludeTarget, value, compareType, bidderColumns);
						}
					});
					compareEvaluationResult.totals = totalValuesExcludeTarget;
					totalValuesExcludeTarget = _.reverse(_.sortBy(totalValuesExcludeTarget));
					// recalculate max,min,avg
					service.recalculateValue(compareEvaluationResult, totalValues, totalValuesExcludeTarget);

					compareEvaluationRank = _.find(rfqTotalList[children], function (item) {
						return item[lineType] === compareLineTypes.evaluationRank;
					});
					// as the evaluation result changed, reset the evaluation rank
					_.forOwn(compareEvaluationRank, function (value, key) {
						if (_.startsWith(key, service.constant.prefix2) &&
							checkBidderService.item.isNotReference(key)) {
							var rank = _.indexOf(totalValuesExcludeTarget, compareEvaluationResult[key]);
							compareEvaluationRank[key] = rank + 1;
						}
					});

					if (needRefresh) { // fire the message
						refreshEvaluationFire(refreshType, evaluationPoints, targetQuote);
					}
					return true;
				}

				return false;
			};

			function refreshEvaluationFire(refreshType, evaluationPoints, targetQuote) {
				service.onRefreshCompareField.fire({
					eventName: refreshType,
					value: {
						points: evaluationPoints,
						quote: targetQuote
					}
				});
			}

			function assignItemEvaluation(itemEvaluation, isVerticalCompareRows, item, parentItem, childProp) {
				if (isVerticalCompareRows) {
					let property = item.QuoteKey + '_PrcItemEvaluationFk_$PrcItemEvaluationFk';
					parentItem[property] = itemEvaluation;
					property = item.QuoteKey + '_PrcItemEvaluationFk_$FirstEvaluationFk';
					parentItem[property] = itemEvaluation;
				} else {
					let prcItemEvalRow = _.find(parentItem[childProp], {Id: parentItem.Id + '_PrcItemEvaluationFk'});
					if (prcItemEvalRow) {
						let property = item.QuoteKey + '_$PrcItemEvaluationFk';
						prcItemEvalRow[property] = itemEvaluation;
						property = item.QuoteKey + '_$FirstEvaluationFk';
						prcItemEvalRow[property] = itemEvaluation;
					}
				}
			}

			/**
			 *
			 * @param rfqHeaderId int
			 * @param qtnHeaderId int
			 * @param quoteKey string =>  base qtn key
			 * @param property string => field
			 * @returns {string}
			 */
			service.setColumnValuesForQuoteCompareFieldRows = function (rfqHeaderId, qtnHeaderId, quoteKey, property) {
				var originalItem = _.find(lookupDescriptorService.getData('Quote'), {Id: qtnHeaderId});
				// set exchange rate
				if (originalItem) {
					service.setExchangeRate(rfqHeaderId, qtnHeaderId, quoteKey, originalItem[service.quoteCompareFields.exchangeRate], originalItem[service.quoteCompareFields.currency]);
				}
				return originalItem ? originalItem[property] ? originalItem[property] : '' : '';
			};

			/**
			 * @param curService object => item: itemService, boq: boqService
			 * @param currencyRfq int
			 * @param children string => item: Children, boq: BoqItemChildren
			 * @param lineType string => item: LineType, boq: BoqLineTypeFk
			 * @param itemIdStr string => item: PrcItemId, boq: BoqItemId
			 * @param localModifiedEntity object => collect the modified data
			 * @param validatePrice => call back function
			 * @param entity object => currency changed object
			 * @param quoteKey string => base QTN key
			 * @param ownQuoteKey string => own QTN key
			 * @param exchangeRate number
			 * @param updateExchangeRate bool => true: the call function from register
			 * @param isVerticalCompareRows
			 */
			service.updateAsExchangeRateChange = function (curService, currencyRfq, children, lineType, itemIdStr, localModifiedEntity,
				validatePrice, entity, quoteKey, ownQuoteKey, exchangeRate, updateExchangeRate, isVerticalCompareRows) {
				let field = '';
				let itemKey = -1;
				let quoteHeaderId = _.parseInt(service.getQuoteId(quoteKey));
				let quotes = lookupDescriptorService.getData('Quote');

				// update exchange rate
				if (updateExchangeRate === true) {
					let exchangeRateEntity = _.find(currencyRfq[children], function (currItem) {
						return currItem[lineType] === compareLineTypes.quoteExchangeRate;
					});
					if (exchangeRateEntity) {
						exchangeRateEntity[quoteKey] = exchangeRate;
					}
				}

				let itemList = service.collectPriceOcCompareRows([currencyRfq], children, lineType, isVerticalCompareRows);
				_.forEach(itemList, function (item) {
					let isItemNode = (lineType === 'BoqLineTypeFk' && item[lineType] === boqMainLineTypes.position) || (lineType === 'LineType' && item[lineType] === compareLineTypes.prcItem);
					let parentItem = isItemNode ? item : item.parentItem;
					let quoteItem = _.find(parentItem.QuoteItems, {QuoteKey: ownQuoteKey});
					let quote = quotes[quoteHeaderId];
					if (quoteItem) {
						quoteItem.Price = quoteItem.PriceOc / exchangeRate;
						quoteItem.PriceExtra = quoteItem.PriceExtraOc / exchangeRate;

						let vatPercent = prcCommonGetVatPercent.getVatPercent(quoteItem.TaxCodeFk, quote.BpdVatGroupFk);
						itemCalculationHelperService.setPricePriceOcPriceGrossPriceGrossOc(quoteItem, quoteItem.Price, 'Price', vatPercent, exchangeRate);

						// collect the changed data of price and priceExtra
						itemKey = quoteItem[itemIdStr]; // key
						field = ownQuoteKey + '.' + itemKey + '.' + service.itemCompareFields.price;
						service.assignValue(localModifiedEntity, field, quoteItem.Price);

						field = ownQuoteKey + '.' + itemKey + '.' + service.itemCompareFields.priceOc;
						service.assignValue(localModifiedEntity, field, quoteItem.PriceOc);

						field = ownQuoteKey + '.' + itemKey + '.' + service.itemCompareFields.priceExtra;
						service.assignValue(localModifiedEntity, field, quoteItem.PriceExtra);

						field = ownQuoteKey + '.' + itemKey + '.' + service.itemCompareFields.priceGross;
						service.assignValue(localModifiedEntity, field, quoteItem.PriceGross);

						field = ownQuoteKey + '.' + itemKey + '.' + service.itemCompareFields.priceOCGross;
						service.assignValue(localModifiedEntity, field, quoteItem.PriceGrossOc);

						_.forEach(service.unitRateBreakDownFields, function (unitRateBreakDown) {
							quoteItem[unitRateBreakDown] = quoteItem[unitRateBreakDown + 'Oc'] / exchangeRate;
							field = ownQuoteKey + '.' + itemKey + '.' + unitRateBreakDown;
							service.assignValue(localModifiedEntity, field, quoteItem[unitRateBreakDown]);
						});

						//  collect the changed data of price and priceExtra in Replacement Items
						if (quoteItem.ReplacementItems && quoteItem.ReplacementItems.length > 0) {
							_.forEach(quoteItem.ReplacementItems, function (replaceItem) {
								replaceItem.Price = replaceItem.PriceOc / exchangeRate;
								replaceItem.PriceExtra = replaceItem.PriceExtraOc / exchangeRate;

								field = ownQuoteKey + '.' + replaceItem.Id + '.' + service.itemCompareFields.price;
								service.assignValue(localModifiedEntity, field, replaceItem.Price);

								field = ownQuoteKey + '.' + itemKey + '.' + service.itemCompareFields.priceOc;
								service.assignValue(localModifiedEntity, field, replaceItem.PriceOc);

								field = ownQuoteKey + '.' + replaceItem.Id + '.' + service.itemCompareFields.priceExtra;
								service.assignValue(localModifiedEntity, field, replaceItem.PriceExtra);
							});
						}
						// collect data
						let data = {};
						_.map(localModifiedEntity, function (quoteKeys, qtnKey) {
							let quoteId = qtnKey.split('_')[1];
							data[quoteId] = _.map(quoteKeys, function (itemField, itemId) {
								return angular.extend({Id: itemId}, itemField);
							});
						});
						curService.modifiedData = data;

					}
				});

				if (lineType === 'BoqLineTypeFk') {
					validatePrice(quoteKey);
				} else {
					validatePrice(itemList, quoteKey, isVerticalCompareRows ? service.itemCompareFields.priceOc : null, true);
				}

				// collect the common modified data => exchangeRate
				if (!service.commonModifiedData) {
					service.commonModifiedData = {};
				}
				if (!service.commonModifiedData[service.quoteCompareFields.exchangeRate]) {
					service.commonModifiedData[service.quoteCompareFields.exchangeRate] = [];
				}
				if (service.commonModifiedData && service.commonModifiedData[service.quoteCompareFields.exchangeRate]) {
					let modifiedData = _.find(service.commonModifiedData[service.quoteCompareFields.exchangeRate], function (data) {
						return data.Id === quoteHeaderId;
					});
					if (modifiedData) {
						modifiedData.ExchangeRate = exchangeRate;
					} else {
						let quote = quotes[quoteHeaderId];
						let obj = {
							Id: quoteHeaderId,
							Code: quote.Code,
							ExchangeRate: exchangeRate
						};
						service.commonModifiedData[service.quoteCompareFields.exchangeRate].push(obj);
					}
				}

			};

			/**
			 * @param qtnMatchCache Object => item: itemQtnMatchCache, boq: boqQtnMatchCache
			 * @param field string => the communal column field
			 * @param rfqHeaderId int
			 * @param isVerticalCompareRows bool
			 * @returns {boolean}
			 */
			service.exchangeRateReadonly = function (qtnMatchCache, field, rfqHeaderId, isVerticalCompareRows) {
				if (checkBidderService.item.isReference(field) || isVerticalCompareRows) {
					return false;
				}
				let ownQuoteKey = service.getOwnQuoteKey(qtnMatchCache, field, rfqHeaderId);
				let quoteId = _.parseInt(ownQuoteKey.split('_')[1]);
				let currentQuote = _.find(lookupDescriptorService.getData('quote'), {Id: quoteId});
				if (!currentQuote) {
					return false;
				}
				let company = _.find(lookupDescriptorService.getData('Company'), {Id: currentQuote.CompanyFk});
				return !(company && company.CurrencyFk === currentQuote.CurrencyFk);
			};

			/**
			 * @param qtnMatchCache Object => item: itemQtnMatchCache, boq: boqQtnMatchCache
			 * @param field string => the communal column field
			 * @param rfqHeaderId int
			 * @returns return OwnQuoteKey
			 */
			service.getOwnQuoteKey = function (qtnMatchCache, field, rfqHeaderId) {
				var qtnMatch = qtnMatchCache[rfqHeaderId],
					itemConfig = _.find(qtnMatch, function (item) {
						return item.QuoteKey === field && item.OwnQuoteKey;
					});

				return itemConfig ? itemConfig.OwnQuoteKey : field;
			};

			service.showReloadInfoDialog = function (dataServices,bodyTextKey) {
				const option = {
					bodyTextKey: bodyTextKey ?? 'procurement.pricecomparison.saveToOriginalDoneAskReload',
					showCancelButton: true,
					okBtnText: $translate.instant('cloud.common.buttonReload')
				};
				return service.showInfoDialog(option).then(dialogResult => {
					if (dialogResult && dialogResult.ok) {
						dataServices.forEach(s => s.loadData());
					}
				});
			};

			/**
			 * @param currService => item: itemService, boq: boqService
			 * @param otherService => item: boqService, boq: itemService
			 */
			service.saveOriginalDialog = function (currService, otherService) {
				let hasCommonFieldChanged = _.keys(service.commonModifiedData).length > 0;
				currService.saveToQuote(false).then(function (currResult) {
					if (currResult.status) {
						// if common fields changed
						if (hasCommonFieldChanged) {
							// save another container changed data
							otherService.saveToQuote(false).then(function (otherResult) {
								if (otherResult.status) {
									service.showReloadInfoDialog([currService, otherService]);
								}
							});
						} else {
							service.showReloadInfoDialog([currService]);
						}
					}
				});
			};

			/**
			 * @param currService => item: itemService, boq: boqService
			 * @param otherService => item: boqService, boq: itemService
			 * @param currCompareType
			 * @param otherCompareType
			 * @param isSaveAll
			 */
			service.saveNewVersionDialog = function (currService, otherService, currCompareType, otherCompareType, isSaveAll) {
				var hasCommonFieldChanged = _.keys(service.commonModifiedData).length > 0;
				currService.saveToQuote(true, null, false, isSaveAll).then(function (currResult) {
					if (currResult.status) {
						service.reloadNewVersionData(currResult, currService, otherService, currCompareType, otherCompareType, hasCommonFieldChanged, isSaveAll, false);
					}
				});
			};

			service.reloadNewVersionData = function reloadNewVersionData(currResult, currService, otherService, currCompareType, otherCompareType, hasCommonFieldChanged, isSaveAll, isloadAll) {
				var option = {
					bodyTextKey: 'procurement.pricecomparison.saveToNewVersionDone',
					showCancelButton: true,
					okBtnText: $translate.instant('cloud.common.buttonReload')
				};
				var oldQtnIds = [];

				if (isSaveAll) {
					_.forEach(currResult.data.AllQuoteIds, function (id) {
						if (id > 0) {
							oldQtnIds.push(id);
						}
					});
				} else {
					if (!_.isEmpty(currResult.modifiedData)) {
						oldQtnIds = _.keys(currResult.modifiedData);
					} else if (currResult.data && !_.isEmpty(currResult.data.ModifiedData)) {
						oldQtnIds = _.keys(currResult.data.ModifiedData);
					} else if (currResult.data && !_.isEmpty(currResult.data.ModifiedQuoteIds)) {
						oldQtnIds = currResult.data.ModifiedQuoteIds;
					}
				}
				// if common fields changed
				if (hasCommonFieldChanged) {
					otherService.saveToQuote(false, currResult.data, true, isSaveAll).then(function (otherResult) {
						service.showInfoDialog(option).then(function (dialogResult) {
							// ask to reload new data
							if (dialogResult && dialogResult.ok) {
								service.reloadNewVersion(currResult.data.QuoteHeaderNews, currCompareType, oldQtnIds, currService.loadData).then(function () {
									if (otherResult.status) {
										service.reloadNewVersion(currResult.data.QuoteHeaderNews, otherCompareType, oldQtnIds, otherService.loadData);
									}
								});
							}
						});
					});
				} else {
					service.showInfoDialog(option).then(function (dialogResult) { // todo livia
						if (dialogResult && dialogResult.ok) {

							var quoteHeaderNews = currResult.data.QuoteHeaderNews;

							if (currService.isContainerUsing()) {
								service.reloadNewVersion(quoteHeaderNews, currCompareType, oldQtnIds, currService.loadData);
							}

							if (isloadAll) {
								if (otherService.isContainerUsing()) {
									service.reloadNewVersion(quoteHeaderNews, otherCompareType, oldQtnIds, otherService.loadData);
								}
							}
						}
					});
				}
			};

			service.beforeSaveNewVersionDialog = function () {
				var option = {
					headerTextKey: 'procurement.pricecomparison.saveToNewVersion',
					templateUrl: globals.appBaseUrl + 'procurement.pricecomparison/partials/before-save-new-version-dialog.html',
					showCancelButton: true,
					showOkButton: true,
					actionButtonText: $translate.instant('cloud.common.ok'),
					cancelButtonText: $translate.instant('cloud.common.cancel'),
					model: {
						saveNewVersionSelect: 'saveModified'
					}
				};

				return platformModalService.showDialog(option);
			};

			service.getQtnStatusById = function (qtnMatchCache, field, rfqHeaderId) {
				var allQtnStatus = lookupDescriptorService.getData('QuoteStatus'),
					quotes = lookupDescriptorService.getData('Quote'),
					ownQuoteKey = service.getOwnQuoteKey(qtnMatchCache, field, rfqHeaderId),
					quoteId = _.parseInt(ownQuoteKey.split('_')[1]),
					quote = _.find(quotes, {Id: quoteId});
				if (quote) {
					return _.find(allQtnStatus, {Id: quote.StatusFk});
				}
			};

			// by lta, move by ada
			service.getRowQuotePrcItem = function getRowQuoteItem(row, quoteKey) {
				var quoteItem;
				if (row.LineType === compareLineTypes.prcItem) {
					quoteItem = _.find(row.QuoteItems, {QuoteKey: quoteKey}) || {};
				} else if (row.LineType === compareLineTypes.compareField) {
					quoteItem = _.find(row.parentItem.QuoteItems, {QuoteKey: quoteKey}) || {};
				}
				return quoteItem;
			};

			service.getRowQuoteBoqItem = function (row, quoteKey) {
				var quoteItems = [];
				var commonHelperService = $injector.get('procurementPriceComparisonCommonHelperService');
				if (row.BoqLineTypeFk === compareLineTypes.compareField) {
					quoteItems = row.parentItem.QuoteItems;
				} else if (commonHelperService.isBoqRow(row.BoqLineTypeFk)) {
					quoteItems = row.QuoteItems;
				}
				return _.find(quoteItems, {QuoteKey: quoteKey});
			};

			service.clearData = function () {
				service.commonModifiedData = {};
				service.modifiedQuote = {};
				service.changeDataList = {};
				service.PrcGeneralsToSave = [];
			};

			service.clearExchangeRate = function clearExchangeRate() {
				exchangeList = [];
			};

			/**
			 * for defect 98361, MIN combined and MAX combined
			 * @param currentItem
			 * @param childrenItem
			 */
			service.combinedMaxMin = function combinedMaxMinAvg(currentItem, childrenItem) {
				currentItem[service.constant.maxValueIncludeTarget] = _.sumBy(childrenItem, service.constant.maxValueIncludeTarget) || 0;
				currentItem[service.constant.minValueIncludeTarget] = _.sumBy(childrenItem, service.constant.minValueIncludeTarget) || 0;
				currentItem[service.constant.maxValueExcludeTarget] = _.sumBy(childrenItem, service.constant.maxValueExcludeTarget) || 0;
				currentItem[service.constant.minValueExcludeTarget] = _.sumBy(childrenItem, service.constant.minValueExcludeTarget) || 0;
			};

			service.updateChangeData = function (updateAsExchangeRateChange) {
				// update common change data
				_.forOwn(service.changeDataList, function (changeData, key) {
					// exchangeRate
					if (key === service.quoteCompareFields.exchangeRate) {
						_.forEach(changeData, function (excRateData) {
							var quoteId = _.parseInt(excRateData.Field.split('_')[1]);
							service.setExchangeRate(excRateData.Entity.RfqHeaderId, quoteId, excRateData.Field, excRateData.ExchangeRate);
							updateAsExchangeRateChange(excRateData.Entity, excRateData.Field, excRateData.OwnQuoteKey, excRateData.ExchangeRate, true);
						});
					}
				});
			};

			// The Unit Rate Break Down is equal to 0 (or the Unit Rate Break Down Flag is not checked)
			service.showUrbData = function (parentItem, urbField) {
				var urbHasFlag = _.find(parentItem.QuoteItems, {IsUrb: true});
				if (urbHasFlag) {
					var urbNotEqualZero = _.find(parentItem.QuoteItems, function (qtnItem) {
						return qtnItem[urbField] !== null && qtnItem[urbField] !== 0;
					});
					return !!urbNotEqualZero;
				}
				return false;
			};

			service.onCompareCollectSetting = new PlatformMessenger();
			service.onItemTypeReadonly = new PlatformMessenger();
			service.typeSummary = {};
			service.modifiedQuote = {};
			service.collectQuoteModifiedData = function (quoteField, value, ownQuoteKey) {
				var quoteId = _.parseInt(ownQuoteKey.split('_')[1]);
				var originalQtn = _.find(lookupDescriptorService.getData('Quote'), {Id: quoteId});
				var modifiedQtnKey = _.findKey(service.modifiedQuote, {Id: originalQtn.Id});
				originalQtn[quoteField] = value;
				if (!!modifiedQtnKey && service.modifiedQuote[modifiedQtnKey]) {
					service.modifiedQuote[modifiedQtnKey][quoteField] = value;
				} else {
					var modifiedQuote = {
						Id: quoteId
					};
					modifiedQuote[quoteField] = value;
					service.modifiedQuote[quoteId] = modifiedQuote;
				}
			};

			service.resetQuote = function (dataService, children, lineType, field, value, quoteField) {
				var subTotal = _.find(dataService.getTree(), function (item) {
					return item[lineType] === compareLineTypes.rfq;
				});
				if (subTotal) {
					var userDefined = _.find(subTotal[children], {QuoteField: quoteField});
					if (userDefined) {
						userDefined[field] = value;
						dataService.redrawTree();
					}
				}
			};

			let wizardContractType = 'createContracts'; // default value
			service.setWizardContractType = function (value) {
				if (value) {
					wizardContractType = value;
				}
			};

			service.getWizardContractType = function () {
				return wizardContractType;
			};

			service.collectExchangeRateData = function(dataService, args, field, ownQuoteKey, eventName) {
				let quoteId = _.parseInt(field.split('_')[1]);
				if (!args.item[field]) {
					args.item[field] = service.getExchangeRate(args.item.RfqHeaderId, quoteId);
					dataService.redrawTree();
					return;
				}
				service.setExchangeRate(args.item.RfqHeaderId, quoteId, field, args.item[field]);
				dataService.updateAsExchangeRateChange(args.item, field, ownQuoteKey, args.item[field]);

				service.setChangeData(service.quoteCompareFields.exchangeRate, args.item, field, ownQuoteKey);
				service.onRefreshCompareField.fire({
					eventName: eventName,
					value: {
						entity: args.item,
						field: field,
						key: ownQuoteKey,
						exchangeRate: args.item[field]
					}
				});
			};

			service.collectPaymentTermData = function (dataService, args, lineType, field, ownQuoteKey) {
				let isNeedCalculate = true;
				let quoteId = _.parseInt(field.split('_')[1]);
				let quotes = lookupDescriptorService.getData('Quote');
				let currentQuote = _.find(quotes, { Id: quoteId });
				if (args.item.BoqLineTypeFk === compareLineTypes.quotePaymentTermFI){
					if (currentQuote.PaymentTermPaFk){
						isNeedCalculate = false;
					}
				}
				service.collectQuoteModifiedData(args.item.QuoteField, args.item[field], ownQuoteKey);

				if (isNeedCalculate) {
					let paymentTerms = lookupDescriptorService.getData('PaymentTerm');
					let paymentTermFk = args.item[field];
					if (args.item.BoqLineTypeFk === compareLineTypes.quotePaymentTermPA && paymentTermFk === null) {
						paymentTermFk = currentQuote.PaymentTermFiFk;
					}
					let paymentTerm = _.find(paymentTerms, { Id:  paymentTermFk});
					let discountPercent = 0;
					if (paymentTerm && paymentTerm.DiscountPercent) {
						discountPercent = paymentTerm.DiscountPercent;
					}
					service.collectQuoteModifiedData(service.quoteCompareFields.discountPercent, discountPercent, ownQuoteKey);
					let discountAmount = currentQuote.AmountDiscountBasis * (discountPercent / 100);
					service.collectQuoteModifiedData(service.quoteCompareFields.discountAmount, discountAmount, ownQuoteKey);
					let discountAmountOc = currentQuote.AmountDiscountBasisOc * (discountPercent / 100);
					service.collectQuoteModifiedData(service.quoteCompareFields.discountAmountOc, discountAmountOc, ownQuoteKey);

					service.onRefreshCompareField.fire({
						eventName: 'updateDiscountAmountField',
						value: {
							entity: args.item,
							ownQuoteKey: ownQuoteKey,
							discountPercent: discountPercent,
							discountAmount: discountAmount,
							discountAmountOc: discountAmountOc
						}
					});
				}
			};

			service.onRequisitionFieldChange = function(dataService, args, field){
				let columns = dataService.getCustomSettingsCompareColumns();
				let reqColumn = _.find(columns, col => checkBidderService.item.isTarget(col.Id));
				if (reqColumn && reqColumn.ApplyReqChangesToQuote){
					dataService.saveToRequisition(false, args.item, field);
				} else {
					let modalOptions = {
						headerText: $translate.instant('procurement.pricecomparison.updateRequisitionItemBoq.headerText'),
						headerText$tr$: 'procurement.pricecomparison.updateRequisitionItemBoq.headerText',
						bodyTemplateUrl: globals.appBaseUrl + 'procurement.pricecomparison/templates/requisition-item-boq-save-dialog.html',
						showOkButton: true,
						showCancelButton: true,
						resizeable: true,
						iconClass: 'ico-question',
						saveOption: {
							onlyRequisition: true,
							requisitionAndAllQuotes: false
						}
					};
					platformModalService.showDialog(modalOptions).then(function (result) {
						if (result.ok === true) {
							if (modalOptions.saveOption.onlyRequisition) {
								dataService.saveToRequisition(true, args.item, field);
							} else if (modalOptions.saveOption.requisitionAndAllQuotes) {
								dataService.saveToRequisition(false, args.item, field);
							}
						}
					});
				}
			};

			service.onHeaderCellRendered = function(e, args) {
				let node = args.node;
				let column = args.column;
				if (column.backgroundColor) {
					let value = column.backgroundColor;
					if (!dataService.isVerticalCompareRows()) {
						node.style.backgroundColor = _.padStart(value.toString(16), 7, '#000000');
					} else {
						let parentNode = node.parentNode.parentNode.childNodes[0];
						let brotherNodes = parentNode.childNodes;
						let groupNodes = _.filter(brotherNodes, function(node) {
							return node.innerText.trim() !== '' && node.id === '';
						});
						if (groupNodes.length > 0) {
							let groupNode;
							groupNode = groupNodes[column.groupIndex];
							if (groupNode) {
								groupNode.style.backgroundColor = _.padStart(value.toString(16), 7, '#000000');
							}
						}
					}
				}
			};

			service.removeToolbars = function(scope, removeItems, gridConfigId) {
				let commonHelperService = $injector.get('procurementPriceComparisonCommonHelperService');
				let identities = _.map(removeItems, function (item) {
					return angular.isObject(item) ? item.id : item;
				});
				scope.tools.items = _.filter(scope.tools.items, function (item) {
					if (item.id === gridConfigId) {
						item.list.items = [item.list.items[1]];
					}
					return item && identities.indexOf(item.id) === -1;
				});
				scope.tools.items = commonHelperService.refactorToolbarItems(scope.tools.items);
			};

			service.addToolbars = function(scope, addItems) {
				let commonHelperService = $injector.get('procurementPriceComparisonCommonHelperService');
				scope.tools.items = commonHelperService.refactorToolbarItems(scope.tools.items.concat(addItems));
			};

			service.onCompareModeChanged = function(scope) {
				scope.tools.update();
			};

			service.processEvaluatedStyle = function(grid, highlightNodes, styleKey){
				// step 1 remove style cache
				let itemEvaluatedCellStyle = grid.instance.getCellCssStyles(styleKey);
				if (itemEvaluatedCellStyle) {
					grid.instance.removeCellCssStyles(styleKey);
				}

				// step 2 add style to cache
				if (highlightNodes.length > 0) {
					let cssObject = {};
					_.forEach(highlightNodes, node => {
						let colCss = {};
						colCss[node.cell.col] = 'pc-item-evaluation';
						if (!Object.hasOwn(cssObject, node.cell.row)) {
							cssObject[node.cell.row] = colCss;
						} else {
							_.extend(cssObject[node.cell.row], colCss);
						}
					});
					grid.instance.addCellCssStyles(styleKey, cssObject);
				}
			}

			service.assignItemEvaluation = assignItemEvaluation;

			return service;
		}
	]);
})(angular);
