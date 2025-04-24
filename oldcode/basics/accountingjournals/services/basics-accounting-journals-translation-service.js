/**
 * Created by jhe on 11/20/2018.
 */
(function (angular) {
	'use strict';

	var basicsAccountingJournalsModule = 'basics.accountingjournals';
	var cloudCommonModule = 'cloud.common';
	var basicsCompanyModule = 'basics.company';

	angular.module(basicsAccountingJournalsModule).factory('basicsAccountingJournalsTranslationService', ['platformTranslationUtilitiesService',

		function (platformTranslationUtilitiesService) {
			var service = {};
			var data = {
				toTranslate: {},
				translate: null,
				updateCallback: null,
				allUsedModules: [basicsAccountingJournalsModule, cloudCommonModule, basicsCompanyModule]
			};

			data.words = {
				// attributes AccountingJournals
				CompanyYearFk: {location: basicsAccountingJournalsModule, identifier: 'entityTradingYear', initial: 'Trading Year'},
				CompanyPeriodFk: {location: basicsAccountingJournalsModule, identifier: 'entityTradingPeriod', initial: 'Trading Period'},
				TradingPeriodStartDate: {location: basicsAccountingJournalsModule, identifier: 'entityTradingPeriodStartDate', initial: 'Trading Period Start Date'},
				TradingPeriodEndDate: {location: basicsAccountingJournalsModule, identifier: 'entityTradingPeriodEndDate', initial: 'Trading Period End Date'},
				TransactionTypeDescription: {location: basicsAccountingJournalsModule, identifier: 'entityTransactionTypeDescription', initial: 'Transaction Type Description'},
				TransactionTypeAbbreviation: {location: basicsAccountingJournalsModule, identifier: 'entityTransactionTypeAbbreviation', initial: 'Transaction Type Abbreviation'},
				Description: {location: basicsAccountingJournalsModule, identifier: 'entityDescription', initial: 'Description'},
				PostingDate: {location: basicsAccountingJournalsModule, identifier: 'entityPostingDate', initial: 'Posting Date'},
				CommentText: {location: basicsAccountingJournalsModule, identifier: 'entityCommentText', initial: 'Comment Text'},
				ReturnValue: {location: basicsAccountingJournalsModule, identifier: 'entityReturnValue', initial: 'Return Value'},
				IsSuccess: {location: basicsAccountingJournalsModule, identifier: 'entityIsSuccess', initial: 'Is Success'},
				CompanyTransHeaderStatusFk: {location: basicsCompanyModule, identifier: 'entityTransactionStatusFk', initial: 'Transaction Status'},
				CompanyTransheaderStatusFk: {location: basicsCompanyModule, identifier: 'entityTransactionStatusFk', initial: 'Transaction Status'},
				IsCancel: {location: basicsAccountingJournalsModule, identifier: 'entityIsCancel', initial: 'Is Cancel'},
				// attributes Transaction
				controllingUnit: {location: basicsAccountingJournalsModule, identifier: 'entityControllingUnit', initial: 'Controlling Unit'},
				offsetContUnit: {location: basicsAccountingJournalsModule, identifier: 'entityOffsetContUnit', initial: 'Offset Cont Unit'},
				DocumentType: {location: cloudCommonModule, identifier: 'entityDocumentType', initial: 'Offset Cont Unit'},
				TransactionTypeFk: {location: cloudCommonModule, identifier: 'entityTransactionTypeFk', initial: 'Offset Cont Unit'},
				Currency: {location: cloudCommonModule, identifier: 'entityCurrency', initial: 'Offset Cont Unit'},
				VoucherNumber: {location: cloudCommonModule, identifier: 'entityVoucherNumber', initial: 'Voucher Number'},
				VoucherDate: {location: cloudCommonModule, identifier: 'entityVoucherDate', initial: 'Voucher Date'},
				Account: {location: basicsAccountingJournalsModule, identifier: 'entityAccount', initial: 'Account'},
				OffsetAccount: {location: cloudCommonModule, identifier: 'entityOffsetAccount', initial: 'Offset Account'},
				PostingNarritive: {location: cloudCommonModule, identifier: 'entityPostingNarritive', initial: 'Posting Narritive'},
				Amount: {location: cloudCommonModule, identifier: 'entityAmount', initial: 'Amount'},
				AmountOc: {location: cloudCommonModule, identifier: 'entityAmountOc', initial: 'Amount Oc'},
				Quantity: {location: cloudCommonModule, identifier: 'entityQuantity', initial: 'Quantity'},
				ControllingUnitCode: {location: cloudCommonModule, identifier: 'entityControllingUnitCode', initial: 'Controlling Unit Code'},
				ControllingUnitAssign01: {location: cloudCommonModule, identifier: 'entityControllingUnitAssign01', initial: 'ControllingUnitAssign01'},
				ControllingUnitAssign01Desc: {location: cloudCommonModule, identifier: 'entityControllingUnitAssign01Desc', initial: 'Controlling Unit Assign 01 Desc'},
				ControllingUnitAssign02: {location: cloudCommonModule, identifier: 'entityControllingUnitAssign02', initial: 'ControllingUnitAssign02'},
				ControllingUnitAssign02Desc: {location: cloudCommonModule, identifier: 'entityControllingUnitAssign02Desc', initial: 'Controlling Unit Assign 02 Desc'},
				ControllingUnitAssign03: {location: cloudCommonModule, identifier: 'entityControllingUnitAssign03', initial: 'ControllingUnitAssign03'},
				ControllingUnitAssign03Desc: {location: cloudCommonModule, identifier: 'entityControllingUnitAssign03Desc', initial: 'Controlling Unit Assign 03 Desc'},
				ControllingUnitAssign04: {location: cloudCommonModule, identifier: 'entityControllingUnitAssign04', initial: 'ControllingUnitAssign04'},
				ControllingUnitAssign04Desc: {location: cloudCommonModule, identifier: 'entityControllingUnitAssign04Desc', initial: 'Controlling Unit Assign 04 Desc'},
				ControllingUnitAssign05: {location: cloudCommonModule, identifier: 'entityControllingUnitAssign05', initial: 'ControllingUnitAssign05'},
				ControllingUnitAssign05Desc: {location: cloudCommonModule, identifier: 'entityControllingUnitAssign05Desc', initial: 'Controlling Unit Assign 05 Desc'},
				ControllingUnitAssign06: {location: cloudCommonModule, identifier: 'entityControllingUnitAssign06', initial: 'ControllingUnitAssign06'},
				ControllingUnitAssign06Desc: {location: cloudCommonModule, identifier: 'entityControllingUnitAssign06Desc', initial: 'Controlling Unit Assign 06 Desc'},
				ControllingUnitAssign07: {location: cloudCommonModule, identifier: 'entityControllingUnitAssign07', initial: 'ControllingUnitAssign07'},
				ControllingUnitAssign07Desc: {location: cloudCommonModule, identifier: 'entityControllingUnitAssign07Desc', initial: 'Controlling Unit Assign 07 Desc'},
				ControllingUnitAssign08: {location: cloudCommonModule, identifier: 'entityControllingUnitAssign08', initial: 'ControllingUnitAssign08'},
				ControllingUnitAssign08Desc: {location: cloudCommonModule, identifier: 'entityControllingUnitAssign08Desc', initial: 'Controlling Unit Assign 08 Desc'},
				ControllingUnitAssign09: {location: cloudCommonModule, identifier: 'entityControllingUnitAssign09', initial: 'ControllingUnitAssign09'},
				ControllingUnitAssign09Desc: {location: cloudCommonModule, identifier: 'entityControllingUnitAssign09Desc', initial: 'Controlling Unit Assign 09 Desc'},
				ControllingUnitAssign10: {location: cloudCommonModule, identifier: 'entityControllingUnitAssign10', initial: 'ControllingUnitAssign10'},
				ControllingUnitAssign10Desc: {location: cloudCommonModule, identifier: 'entityControllingUnitAssign10Desc', initial: 'Controlling Unit Assign 10 Desc'},
				OffsetContUnitCode: {location: cloudCommonModule, identifier: 'entityOffsetContUnitCode', initial: 'Offset Cont Unit Code'},
				OffsetContUnitAssign01: {location: cloudCommonModule, identifier: 'entityOffsetContUnitAssign01', initial: 'Offset Cont Unit Code Assign 01'},
				OffsetContUnitAssign01Desc: {location: cloudCommonModule, identifier: 'entityOffsetContUnitAssign01Desc', initial: 'Offset Cont Unit Code Assign 01 Desc'},
				OffsetContUnitAssign02: {location: cloudCommonModule, identifier: 'entityOffsetContUnitAssign02', initial: 'Offset Cont Unit Code Assign 02'},
				OffsetContUnitAssign02Desc: {location: cloudCommonModule, identifier: 'entityOffsetContUnitAssign02Desc', initial: 'Offset Cont Unit Code Assign 02 Desc'},
				OffsetContUnitAssign03: {location: cloudCommonModule, identifier: 'entityOffsetContUnitAssign03', initial: 'Offset Cont Unit Code Assign 03'},
				OffsetContUnitAssign03Desc: {location: cloudCommonModule, identifier: 'entityOffsetContUnitAssign03Desc', initial: 'Offset Cont Unit Code Assign 03 Desc'},
				OffsetContUnitAssign04: {location: cloudCommonModule, identifier: 'entityOffsetContUnitAssign04', initial: 'Offset Cont Unit Code Assign 04'},
				OffsetContUnitAssign04Desc: {location: cloudCommonModule, identifier: 'entityOffsetContUnitAssign04Desc', initial: 'Offset Cont Unit Code Assign 04 Desc'},
				OffsetContUnitAssign05: {location: cloudCommonModule, identifier: 'entityOffsetContUnitAssign05', initial: 'Offset Cont Unit Code Assign 05'},
				OffsetContUnitAssign05Desc: {location: cloudCommonModule, identifier: 'entityOffsetContUnitAssign05Desc', initial: 'Offset Cont Unit Code Assign 05 Desc'},
				OffsetContUnitAssign06: {location: cloudCommonModule, identifier: 'entityOffsetContUnitAssign06', initial: 'Offset Cont Unit Code Assign 06'},
				OffsetContUnitAssign06Desc: {location: cloudCommonModule, identifier: 'entityOffsetContUnitAssign06Desc', initial: 'Offset Cont Unit Code Assign 06 Desc'},
				OffsetContUnitAssign07: {location: cloudCommonModule, identifier: 'entityOffsetContUnitAssign07', initial: 'Offset Cont Unit Code Assign 07'},
				OffsetContUnitAssign07Desc: {location: cloudCommonModule, identifier: 'entityOffsetContUnitAssign07Desc', initial: 'Offset Cont Unit Code Assign 07 Desc'},
				OffsetContUnitAssign08: {location: cloudCommonModule, identifier: 'entityOffsetContUnitAssign08', initial: 'Offset Cont Unit Code Assign 08'},
				OffsetContUnitAssign08Desc: {location: cloudCommonModule, identifier: 'entityOffsetContUnitAssign08Desc', initial: 'Offset Cont Unit Code Assign 08 Desc'},
				OffsetContUnitAssign09: {location: cloudCommonModule, identifier: 'entityOffsetContUnitAssign09', initial: 'Offset Cont Unit Code Assign 09'},
				OffsetContUnitAssign09Desc: {location: cloudCommonModule, identifier: 'entityOffsetContUnitAssign09Desc', initial: 'Offset Cont Unit Code Assign 09 Desc'},
				OffsetContUnitAssign10: {location: cloudCommonModule, identifier: 'entityOffsetContUnitAssign10', initial: 'Offset Cont Unit Code Assign 10'},
				OffsetContUnitAssign10Desc: {location: cloudCommonModule, identifier: 'entityOffsetContUnitAssign10Desc', initial: 'Offset Cont Unit Code Assign 10 Desc'},
				PesHeaderFk: {location: basicsAccountingJournalsModule, identifier: 'entityPesHeaderFk', initial: 'Pes Header'},
				InvHeaderFk: {location: basicsAccountingJournalsModule, identifier: 'entityInvHeaderFk', initial: 'Inv Header'},
				PrjStockFk : {location: basicsAccountingJournalsModule, identifier: 'entityPrjStockFk', initial: 'Stock Header'},
				NominalDimension: {location: basicsAccountingJournalsModule, identifier: 'entityNominalDimension', initial: 'Nominal Dimension'},
				NominalDimension2: {location: basicsAccountingJournalsModule, identifier: 'entityNominalDimension2', initial: 'Nominal Dimension 2'},
				NominalDimension3: {location: basicsAccountingJournalsModule, identifier: 'entityNominalDimension3', initial: 'Nominal Dimension 3'},
				AccessRoleFk: {location: basicsAccountingJournalsModule, identifier: 'entityAccessRoleFk', initial: 'Access Role'},
				ProjectContextFk: {location: basicsAccountingJournalsModule, identifier: 'entityProjektContextFk', initial: 'Projekt Context'},
				PriceConditionFk: {location: basicsAccountingJournalsModule, identifier: 'entityPriceConditionFk', initial: 'Price Condition'},
				PostingArea: {location: basicsCompanyModule, identifier: 'entityPostingArea', initial: 'Posting Area'},
				WipHeaderFk: {location: basicsAccountingJournalsModule, identifier: 'entityWipHeaderFk', initial: 'WIP Code'},
				BilHeaderFk: {location: basicsAccountingJournalsModule, identifier: 'entityBillNo', initial: 'Bill No.'},
				PrrHeaderDes: {location: basicsAccountingJournalsModule, identifier: 'entityPrrHeaderFkDesc', initial: 'Revenue Recognition'}
			};

			// Get some predefined packages of words used in project
			platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);
			platformTranslationUtilitiesService.addHistoryTranslation(data.words);

			// Convert word list into a format used by platform translation service
			data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

			// Prepare interface of service and load translations
			platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
			platformTranslationUtilitiesService.loadModuleTranslation(data);
			platformTranslationUtilitiesService.registerModules(data);

			return service;
		}
	]);
})(angular);