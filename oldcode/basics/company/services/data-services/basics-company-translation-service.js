/**
 * Created by henkel on 16.09.2014.
 */

(function (angular) {
	'use strict';

	var basicsCompanyModule = 'basics.company';
	var basicsCommonModule ='basics.common';
	var cloudCommonModule = 'cloud.common';
	var basicsSiteModule = 'basics.site';
	var jobModule = 'logistic.job';

	/**
	 * @ngdoc service
	 * @name basicsCompanyTranslationService
	 * @description provides translation for basics company module
	 */
	angular.module(basicsCompanyModule).factory('basicsCompanyTranslationService', ['platformTranslationUtilitiesService',

		function (platformTranslationUtilitiesService) {
			var service = {};

			var data = {
				toTranslate: {},
				translate: null,
				updateCallback: null,
				allUsedModules: [basicsCompanyModule, cloudCommonModule, basicsCommonModule, basicsSiteModule, jobModule]
			};

			data.words = {

				// Header Name
				address: {location: cloudCommonModule, identifier: 'entityAddress', initial: 'Address'},
				standardValues: {
					location: basicsCompanyModule,
					identifier: 'entityStandardValues',
					initial: 'Standard Values'
				},
				masterDataPool: {
					location: basicsCompanyModule,
					identifier: 'entityMasterDataPool',
					initial: 'Master Data Pool'
				},
				userDefTextGroup: {location: cloudCommonModule, identifier: 'entityAddress', initial: 'Address'},

				// Container Address
				LoginAllowed: {location: basicsCompanyModule, identifier: 'entityLoginAllowed', initial: 'Login Allowed'},
				IsRibArchive:{location: basicsCompanyModule, identifier: 'entityIsRibArchive', initial: 'Rib Archive'},
				IsCalculateOverGross:{location: basicsCompanyModule, identifier: 'entityIsCalculateOverGross', initial: 'Calculate Over Gross'},
				Code: {location: cloudCommonModule, identifier: 'entityCode', initial: 'Code'},
				CompanyName: {location: basicsCompanyModule, identifier: 'entityName', initial: 'Name'},
				CurrencyFk: {
					location: basicsCompanyModule,
					identifier: 'entityCurrencyFk',
					initial: 'Currency'
				},
				LanguageFk: {location: basicsCompanyModule, identifier: 'entityLanguageFk', initial: 'Language'},
				CompanyTypeFk: {
					location: basicsCompanyModule,
					identifier: 'entityCompanyTypeFk',
					initial: 'Company Type'
				},
				Profitcenter: {
					location: basicsCompanyModule,
					identifier: 'entityProfitcenter',
					initial: 'Profitcenter'
				},
				DunsNo: {
					location: basicsCompanyModule,
					identifier: 'dunsNo',
					initial: 'Duns No.'
				},
				ExternalCode: {
					location: basicsCompanyModule,
					identifier: 'externalCode',
					initial: 'External Code'
				},
				Signatory: {location: basicsCompanyModule, identifier: 'entitySignatory', initial: 'Signatory'},
				CountryFk: {location: basicsCompanyModule, identifier: 'entityCountry', initial: 'Signatory'},

				// Standard Values
				BillingSchemaFk: {
					location: basicsCompanyModule,
					identifier: 'entitymdcBillingSchemaFk',
					initial: 'Billing Schema'
				},
				TaxCodeFk: {location: basicsCompanyModule, identifier: 'entityTaxCodeFk', initial: 'Tax Code'},
				PaymentTermPaFk: {
					location: basicsCompanyModule,
					identifier: 'entityPaymentTermPaFk',
					initial: 'Payment Term (Pa)'
				},
				PaymentTermFiFk: {
					location: basicsCompanyModule,
					identifier: 'entityPaymentTermFiFk',
					initial: 'Payment Term (Fi)'
				},
				CalendarFk: {
					location: basicsCompanyModule,
					identifier: 'entityCalCalendarFk',
					initial: 'Calendar (Fi)'
				},
				LineItemContextFk: {
					location: basicsCompanyModule,
					identifier: 'entityLineItemContextFk',
					initial: 'Line Item Context'
				},

				// Master Data Pool
				ContextFk: {
					location: basicsCompanyModule,
					identifier: 'entityContextFk',
					initial: 'Master Data Context'
				},
				SchedulingContextFk: {
					location: basicsCompanyModule,
					identifier: 'entitySchedulingContextFk',
					initial: 'Scheduling Context'
				},
				HsqContextFk:{
					location: basicsCompanyModule,
					identifier: 'entityHsqContextFk',
					initial: 'Hsq Context'
				},
				LedgerContextFk: {
					location: basicsCompanyModule,
					identifier: 'entityMdcLedgerContextFk',
					initial: 'Ledger Context'
				},
				SubledgerContextFk: {
					location: basicsCompanyModule,
					identifier: 'entityBpdSubledgerContextFk',
					initial: 'Subledger Context'
				},
				ModuleContextFk: {
					location: basicsCompanyModule,
					identifier: 'entityModuleContextFk',
					initial: 'Module Context'
				},
				TextModuleContextFk: {
					location: basicsCompanyModule,
					identifier: 'entityTextModuleContextFk',
					initial: 'Text Module Context'
				},
				ResourceContextFk:{location: basicsCompanyModule, identifier: 'entityResourceContextFk', initial: 'Resource Context'},
				EquipmentContextFk:{location: basicsCompanyModule, identifier: 'entityEquipmentContextFk', initial: 'Equipment Context'},
				DefectContextFk: {location: basicsCompanyModule, identifier: 'entityDefectContextFk', initial: 'Defect Context'},
				TimesheetContextFk:	{location: basicsCompanyModule, identifier: 'entityTimesheetContextFk', initial: 'Timesheet Context'},
				LogisticContextFk:	{location: basicsCompanyModule, identifier: 'entityLogisticContextFk', initial: 'Logistic Context'},

				// TextModule
				TextModuleFk: {location: basicsCompanyModule, identifier: 'entityTextModuleFk', initial: 'Text Module'},
				TextModuleTypeFk: {
					location: basicsCompanyModule,
					identifier: 'entityTextModuleTypeFk',
					initial: 'Text Module Type'
				},

				// Year
				baseGroup: {location: basicsCompanyModule, identifier: 'entityBaseGroup', initial: 'Base Group'},
				TradingYear: {location: basicsCompanyModule, identifier: 'entityTradingYear', initial: 'Trading Year'},
				EndDate: {location: basicsCompanyModule, identifier: 'entityEndDate', initial: 'End Date'},
				StartDate: {location: basicsCompanyModule, identifier: 'entityStartDate', initial: 'Start Date'},

				// Category
				CompanyFk: {location: basicsCompanyModule, identifier: 'entityBasCompanyFk', initial: 'Company'},
				RubricFk: {location: basicsCompanyModule, identifier: 'entityBasRubricFk', initial: 'Rubric'},
				RubricCategoryFk: {
					location: basicsCompanyModule,
					identifier: 'entityBasRubricCategoryFk',
					initial: 'Category'
				},

				// Surcharge/CostCode
				Contribution: {
					location: basicsCompanyModule,
					identifier: 'entityContribution',
					initial: 'Contribution'
				},
				Extra: {location: basicsCompanyModule, identifier: 'entityExtra', initial: 'Extra'},
				MdcCostCodeFk: {
					location: basicsCompanyModule,
					identifier: 'entityMdcCostCodeFk',
					initial: 'Mdc Cost Code'
				},
				Rate: {location: basicsCompanyModule, identifier: 'entityRate', initial: 'Rate'},
				Remark: {location: basicsCompanyModule, identifier: 'entityRemark', initial: 'Remark'},
				Surcharge: {location: basicsCompanyModule, identifier: 'entitySurcharge', initial: 'Surcharge'},
				IsDefault: {location: cloudCommonModule, identifier: 'entityIsDefault', initial: 'Is Default'},

				// Clerk
				ClerkFk: {location: basicsCompanyModule, identifier: 'entityClerkFk', initial: 'Clerk'},
				ValidFrom: {location: basicsCompanyModule, identifier: 'entityValidfrom', initial: 'Valid From'},
				ValidTo: {location: basicsCompanyModule, identifier: 'entityValidto', initial: 'Valid To'},
				ClerkRoleFk: {location: basicsCompanyModule, identifier: 'entityRole', initial: 'Role'},
				CommentText: {location: cloudCommonModule, identifier: 'entityComment', initial: 'Comment'},

				// Number
				GenerateNumber: {
					location: basicsCompanyModule,
					identifier: 'entityGenerateNumber',
					initial: 'Generate Number'
				},
				CodeGenerationSequenceTypeFk: {
					location: basicsCompanyModule,
					identifier: 'entitySequenceType',
					initial: 'SequenceType'
				},
				NumberMask: {location: basicsCompanyModule, identifier: 'entityNumberMask', initial: 'NumberMask'},
				NumberSequenceFk: {
					location: basicsCompanyModule,
					identifier: 'entityNumberSequenceFk',
					initial: 'NumberSequence'
				},
				CheckNumber: {location: basicsCompanyModule, identifier: 'entityCheckNumber', initial: 'CheckNumber'},
				CheckMask: {location: basicsCompanyModule, identifier: 'entityCheckMask', initial: 'CheckMask'},
				MinLength: {location: basicsCompanyModule, identifier: 'entityMinLength', initial: 'MinLength'},
				MaxLength: {location: basicsCompanyModule, identifier: 'entityMaxLength', initial: 'MaxLength'},
				Description: {location: basicsCompanyModule, identifier: 'description', initial: 'Description'},
				// Periods
				PeriodStatusFk: {
					location: basicsCompanyModule,
					identifier: 'entityPeriodStatusSettlement',
					initial: 'Period Status Settlement'
				},
				CompanyYearFk: {
					location: basicsCompanyModule,
					identifier: 'entityTradingYear',
					initial: 'Company Year'
				},
				TradingPeriod: {location: basicsCompanyModule, identifier: 'entityTradingPeriod', initial: 'Trading Period'},
				StartValue: {location: basicsCompanyModule, identifier: 'entityStartValue', initial: 'Start Value'},
				LastValue: {location: basicsCompanyModule, identifier: 'entityLastValue', initial: 'Last Value'},
				IncrementValue: {
					location: basicsCompanyModule,
					identifier: 'entityIncrementValue',
					initial: 'Increment Value'
				},
				EndValue: {location: basicsCompanyModule, identifier: 'entityEndValue', initial: 'EndValue Value'},
				entityPeriod: {location: basicsCompanyModule, identifier: 'entityPeriod', initial: 'Period'},
				PeriodDate: {location: basicsCompanyModule, identifier: 'entityPeriod', initial: 'Period'},
				entityPeriodFk: {location: basicsCompanyModule, identifier: 'entityPeriod', initial: 'Period'},
				entityNumber: {location: basicsCompanyModule, identifier: 'entityNumber', initial: 'Number'},
				entityBusinessYear: {
					location: basicsCompanyModule,
					identifier: 'entityBusinessYear',
					initial: 'Business Year'
				},
				entityCategoryIndex: {
					location: basicsCompanyModule,
					identifier: 'entityCategoryIndex',
					initial: 'Category Index'
				},
				entityTextModule: {
					location: basicsCompanyModule,
					identifier: 'entityTextModule',
					initial: 'Textmodule'
				},
				CompanyUrltypeFk: {
					location: basicsCompanyModule,
					identifier: 'entityCompanyUrltypeFk',
					initial: 'Urltype'
				},
				url: {location: basicsCompanyModule, identifier: 'entityUrl', initial: 'Url'},
				UrlUser: {location: basicsCompanyModule, identifier: 'entityUrlUser', initial: 'Url User'},
				UrlPassword: {location: basicsCompanyModule, identifier: 'entityUrlPassword', initial: 'Url Password'},
				Settings: { location: basicsCommonModule, identifier: 'settings', initial: 'Settings'},

				// UtilisableGroup
				GroupFk:{location: cloudCommonModule, identifier: 'entityGroup', initial: 'Group'},
				IsActive: {location: basicsCompanyModule, identifier: 'entityIsActive', initial: 'IsActive'},

				// IC Partner Card
				Id:{location: basicsCompanyModule, identifier: 'entityId', initial: 'Id'},
				BasCompanyPartnerFk:{location: basicsCompanyModule, identifier: 'entityCompanyICPartner', initial: 'Company ICPartner'},
				BpdCustomerFk:{location: basicsCompanyModule, identifier: 'entityCustomer', initial: 'Customer'},
				BpdSupplierFk:{location: basicsCompanyModule, identifier: 'entitySupplier', initial: 'Supplier'},
				AccountRevenue:{location: basicsCompanyModule, identifier: 'entityICRevenueAccount', initial: 'IC Revenue Account'},
				AccountCost:{location: basicsCompanyModule, identifier: 'entityICCostAccount', initial: 'IC Cost Account'},
				MdcControllingunitIcFk:{location: basicsCompanyModule, identifier: 'entityClearingControllingUnit', initial: 'Clearing Controlling Unit'},
				PrcConfigurationBilFk:{location:basicsCompanyModule,identifier:'entityPrcConfigurationBilFk',initial:'IC Bill Configuration'},
				MdcBillSchemaBilFk:{location:basicsCompanyModule,identifier:'entityMdcBillSchemaBilFk',initial:'IC Bill Billing Schema'},
				PrcConfigurationInvFk:{location:basicsCompanyModule,identifier:'entityPrcConfigurationInvFk',initial:'IC Invoice Configuration'},
				MdcBillSchemaInvFk:{location:basicsCompanyModule,identifier:'entityMdcBillSchemaInvFk',initial:'IC Invoice Billing Schema'},

				// IC Partner Card
				PrcStructureFk:{location: basicsCompanyModule, identifier: 'entityStructure', initial: 'Procurement Structure'},
				SurchargePercent:{location: basicsCompanyModule, identifier: 'entitySurcharge', initial: 'Surcharge'},
				AccountRevenueSurcharge:{location: basicsCompanyModule, identifier: 'entityICRevenueAccountSurcharge', initial: 'IC Revenue Account Surcharge'},

				// Transaction/Transheader
				controllingUnit: {location: basicsCompanyModule, identifier: 'entityControllingUnit', initial: 'Controlling Unit'},
				offsetContUnit: {location: basicsCompanyModule, identifier: 'entityOffsetContUnit', initial: 'Offset Cont Unit'},
				DocumentType: {location: cloudCommonModule, identifier: 'entityDocumentType', initial: 'Offset Cont Unit'},
				TransactionTypeFk: {location: cloudCommonModule, identifier: 'entityTransactionTypeFk', initial: 'Offset Cont Unit'},
				CompanyTransHeaderStatusFk: {location: basicsCompanyModule, identifier: 'entityTransactionStatusFk', initial: 'Transaction Status'},
				Currency: {location: cloudCommonModule, identifier: 'entityCurrency', initial: 'Currency'},
				PostingDate: {location: cloudCommonModule, identifier: 'entityPostingDate', initial: 'Offset Cont Unit'},
				VoucherNumber: {location: cloudCommonModule, identifier: 'entityVoucherNumber', initial: 'Voucher Number'},
				VoucherDate: {location: cloudCommonModule, identifier: 'entityVoucherDate', initial: 'Voucher Date'},
				Account: {location: basicsCompanyModule, identifier: 'entityAccount', initial: 'Account'},
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
				PesHeaderFk: {location: basicsCompanyModule, identifier: 'entityPesHeaderFk', initial: 'Pes Header'},
				InvHeaderFk: {location: basicsCompanyModule, identifier: 'entityInvHeaderFk', initial: 'Inv Header'},
				NominalDimension: {location: basicsCompanyModule, identifier: 'entityNominalDimension', initial: 'Nominal Dimension'},
				NominalDimension2: {location: basicsCompanyModule, identifier: 'entityNominalDimension2', initial: 'Nominal Dimension2'},
				NominalDimension3: {location: basicsCompanyModule, identifier: 'entityNominalDimension3', initial: 'Nominal Dimension3'},
				CompanyPeriodFk: {location: basicsCompanyModule, identifier: 'entityCompanyPeriodFk', initial: 'Company Period'},
				ReturnValue: {location: basicsCompanyModule, identifier: 'entityReturnValue', initial: 'Return Value'},
				IsSuccess: {location: basicsCompanyModule, identifier: 'entityIsSuccess', initial: 'Is Success'},
				AccessRoleFk: {location: basicsCompanyModule, identifier: 'entityAccessRoleFk', initial: 'Access Role'},
				ProjectContextFk: {location: basicsCompanyModule, identifier: 'entityProjektContextFk', initial: 'Projekt Context'},
				PriceConditionFk: {location: basicsCompanyModule, identifier: 'entityPriceConditionFk', initial: 'Price Condition'},
				PostingArea: {location: basicsCompanyModule, identifier: 'entityPostingArea', initial: 'Posting Area'},

				// Deferaltype
				IsLive: {location: cloudCommonModule, identifier: 'entityIsLive', initial: 'Is Live'},
				CodeFinance: {location: basicsCompanyModule, identifier: 'entityCodeFinance', initial: 'Code Finance'},

				PeriodStatusStockFk: {location: basicsCompanyModule, identifier: 'entityPeriodStatusStockFk', initial: 'Period Status Stock'},
				PeriodStatusApFk: {location: basicsCompanyModule, identifier: 'entityPeriodStatusApFk', initial: 'Period Status Accounts Payables'},
				PeriodStatusArFk: {location: basicsCompanyModule, identifier: 'entityPeriodStatusArFk', initial: 'Period Status Accounts Receivable'},
				CompanyName2: {location: basicsCompanyModule, identifier: 'entityCompanyName2', initial: 'Company Name 2'},
				CompanyName3: {location: basicsCompanyModule, identifier: 'entityCompanyName3', initial: 'Company Name 3'},
				IsStartDateMandatory: {location: basicsCompanyModule, identifier: 'entityIsStartDateMandatory', initial: 'Is Start Date Mandatory'},
				ControllingGroupFk: {location: basicsCompanyModule, identifier: 'entityControllinggroupFk', initial: 'Controlling Group'},
				ControllingGrpDetailFk: {location: basicsCompanyModule, identifier: 'entityControllinggroupdetailFk', initial: 'Controlling Group Detail'},

				ProjectFk:{location: cloudCommonModule, identifier: 'entityProject', initial: '*Project'},
				JobFk:{location: jobModule, identifier: 'entityJob', initial: '*Job'},
				SiteFk:{location: basicsSiteModule, identifier: 'entitySite', initial: '*Site'},
				SiteStockFk:{location: basicsSiteModule, identifier: 'entityStockSite', initial: '*Stock Site'},
				SupplierFk: {location: cloudCommonModule, identifier: 'entitySupplier', initial: 'Supplier'},
				CustomerFk: {location: cloudCommonModule, identifier: 'entityCustomer', initial: 'Customer'},
				basicData: { location: cloudCommonModule, identifier: 'entityProperties', initial: 'Basic Data' },
				EquipmentDivisionFk: {location: basicsCompanyModule, identifier: 'equipmentDivision', initial: 'EquipmentDivision'},
				Icon: {location: cloudCommonModule, identifier: 'entityIcon', initial: 'XX'},
				CrefoNo: {location: basicsCompanyModule, identifier: 'entityCrefoNo', initial: 'Crefo No.'},
				VatNo: {location: basicsCompanyModule, identifier: 'entityVatNo', initial: 'VAT No.'},
				TaxNo: {location: basicsCompanyModule, identifier: 'entityTaxNo', initial: 'Tax No.'},
				CompanyTransheader: {location: basicsCompanyModule, identifier: 'entityTransheader', initial: 'Transaction Header'},
				BusinessPartnerFk: {location: cloudCommonModule, identifier: 'businessPartner'},
				PrrMethodFk:{location: basicsCompanyModule, identifier: 'entityRevenueRecognition', initial: 'Revenue Recognition Method.'},
				WipHeaderFk: {location: basicsCompanyModule, identifier: 'entityWipHeaderFk', initial: 'WIP Code'},
				BilHeaderFk: {location: basicsCompanyModule, identifier: 'entityBillNo', initial: 'Bill No.'},
				CompanyReceivingFk: {location: basicsCompanyModule, identifier: 'entityReceivingCompany', initial: 'Receiving Company'},
				ControllingUnitFk: {location: basicsCompanyModule, identifier: 'entityControllingUnit', initial: 'Controlling Unit'},
				PreliminaryActual: {location: basicsCompanyModule, identifier: 'entityPreliminaryActual', initial: 'Preliminary Actual'},
				CompanyTransheaderStatusFk: {location: basicsCompanyModule, identifier: 'companyTransheaderStatusFk', initial: 'Company Transheader Status'},
				RoundingConfigFk: {location: basicsCompanyModule, identifier: 'timekeepingRoundingConfig', initial: 'Timekeeping Rounding Config'},
				IsRestrictedToProfitCenter: {location: basicsCompanyModule, identifier: 'isVisibilityRestrictedToProfitCenter' },
				IsSequenceBasedOnProfitCenter: {location: basicsCompanyModule, identifier: 'isSequenceBasedOnProfitCenter' },
				StockValuationRuleFk: {location: basicsCompanyModule, identifier: 'stockValuationRule' , initial: 'Stock Valuation Rule'},
				IsReportVerification: {location: basicsCompanyModule, identifier: 'entityIsReportVerification' , initial: 'Is Report Verification'},
			};

			// Get some predefined packages of words used in project
			platformTranslationUtilitiesService.addHistoryTranslation(data.words);
			platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);
			platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 5, 'UserDefined');
			// Convert word list into a format used by platform translation service
			data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

			// Prepare interface of service and load translations
			platformTranslationUtilitiesService.addTeleComTranslation(data.words);
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
