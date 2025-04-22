/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	var salesCommonModule = 'sales.common';
	var cloudCommonModule = 'cloud.common';
	var boqMainModule = 'boq.main';
	var objectMainModule = 'object.main';
	var basicsBillingSchema = 'basics.billingschema';
	var basicsCustomizeModule = 'basics.customize';


	/* jshint -W106 */ // Variable name is according usage in translation json
	angular.module(salesCommonModule).value('salesCommonTranslations', {
		translationInfos: {
			'extraModules': [cloudCommonModule, boqMainModule, objectMainModule, basicsBillingSchema, basicsCustomizeModule, salesCommonModule],
			'extraWords': {
				customerData: { location: salesCommonModule, identifier: 'customerData', initial: 'Customer Data' },
				paymentData: { location: salesCommonModule, identifier: 'paymentData', initial: 'Payment Data' },
				datesData: { location: salesCommonModule, identifier: 'datesData', initial: 'Dates' },
				otherData: { location: salesCommonModule, identifier: 'otherData', initial: 'Other' },
				userDefDates: { location: salesCommonModule, identifier: 'userDefDates', initial: 'User Defined Dates' },

				RubricCategoryFk: { location: salesCommonModule, identifier: 'entityRubricCategoryFk', initial: 'Rubric Category' },
				CompanyFk: { location: salesCommonModule, identifier: 'entityCompanyFk', initial: 'Company' },
				CompanyResponsibleFk: { location: salesCommonModule, identifier: 'entityCompanyResponsibleFk', initial: 'Company Responsible' },

				ProjectFk: { location: salesCommonModule, identifier: 'entityProjectFk', initial: 'Project' },
				PriceFixingDate: { location: salesCommonModule, identifier: 'entityPriceFixingDate', initial: 'Price Fixing Date' },
				PlannedStart: { location: salesCommonModule, identifier: 'entityPlannedStart', initial: 'Planned Start' },
				PlannedEnd: { location: salesCommonModule, identifier: 'entityPlannedEnd', initial: 'Planned End' },
				PerformedFrom: { location: salesCommonModule, identifier: 'entityPerformedFrom', initial: 'Performed From' },
				PerformedTo: { location: salesCommonModule, identifier: 'entityPerformedTo', initial: 'Performed To' },

				LanguageFk: { location: salesCommonModule, identifier: 'entityLanguageFk', initial: 'Language' },
				CurrencyFk: { location: salesCommonModule, identifier: 'entityCurrencyFk', initial: 'Currency' },
				ExchangeRate: { location: salesCommonModule, identifier: 'entityExchangeRate', initial: 'Exchange Rate' },
				ClerkFk: { location: salesCommonModule, identifier: 'entityClerkFk', initial: 'Clerk' },

				EstimationCode: { location: salesCommonModule, identifier: 'entityEstimationHeader', initial: 'Estimate Code' },
				EstimationDescription: { location: salesCommonModule, identifier: 'entityEstimationDesc', initial: 'Estimate Desc.' },

				BusinesspartnerFk: { location: salesCommonModule, identifier: 'entityBusinesspartnerFk', initial: 'Businesspartner' },
				SubsidiaryFk: { location: salesCommonModule, identifier: 'entitySubsidiaryFk', initial: 'Subsidiary' },
				CustomerFk: { location: salesCommonModule, identifier: 'entityCustomerFk', initial: 'Customer' },

				BillingSchemaFk: { location: salesCommonModule, identifier: 'entityBillingSchemaFk', initial: 'Billing Schema' },
				PaymentTermFiFk: { location: salesCommonModule, identifier: 'entityPaymentTermFiFk', initial: 'Payment Term (Fi)' },
				PaymentTermPaFk: { location: salesCommonModule, identifier: 'entityPaymentTermPaFk', initial: 'Payment Term (Pa)' },
				PaymentTermAdFk: { location: salesCommonModule, identifier: 'entityPaymentTermAdFk', initial: 'Payment Term (Ad)' },

				BlobsSalutationFk: { location: salesCommonModule, identifier: 'entityBlobsSalutationFk', initial: 'Salutation' },
				BlobsHeaderFk: { location: salesCommonModule, identifier: 'entityBlobsHeaderFk', initial: 'Header' },
				BlobsFooterFk: { location: salesCommonModule, identifier: 'entityBlobsFooterFk', initial: 'Footer' },
				BlobsSubjectFk: { location: salesCommonModule, identifier: 'entityBlobsSubjectFk', initial: 'Subject' },
				BlobsReferenceFk: { location: salesCommonModule, identifier: 'entityBlobsReferenceFk', initial: 'Reference' },
				BlobsOffereeFk: { location: salesCommonModule, identifier: 'entityBlobsOffereeFk', initial: 'Offeree' },

				ContractTypeFk: { location: salesCommonModule, identifier: 'entityContracttypeFk', initial: 'Contract Type' },
				OrdConditionFk: { location: salesCommonModule, identifier: 'entityOrdConditionFk', initial: 'Contractual Condition' },
				TaxCodeFk: { location: salesCommonModule, identifier: 'entityTaxCodeFk', initial: 'Tax Code' },
				VatGroupFk: { location: basicsCustomizeModule, identifier: 'vatgroupfk', initial: 'VAT Group' },
				PrjChangeFk : { location: salesCommonModule, identifier: 'entityPrjChange', initial: 'Project Change'},
				PrjChangeStatusFk : { location: salesCommonModule, identifier: 'entityPrjChangeStatus', initial: 'Project Change-Status'},
				ChangeOrderFk : { location: salesCommonModule, identifier: 'entityChangeOrder', initial: 'Change Order'},
				ChangeOrderStatusFk : { location: salesCommonModule, identifier: 'entityChangeOrderStatus', initial: 'Change Order-Status'},

				PrcStructureFk: { location: salesCommonModule, identifier: 'entityPrcStructureFk', initial: 'Procurement Structure' },
				ControllingUnitFk: { location: salesCommonModule, identifier: 'entityControllingUnitFk', initial: 'Controlling Unit' },

				UserDefined1: { location: cloudCommonModule, identifier: 'entityUserDefined', param: { p_0: '1' }, initial: 'User Defined 1' },
				UserDefined2: { location: cloudCommonModule, identifier: 'entityUserDefined', param: { p_0: '2' }, initial: 'User Defined 2' },
				UserDefined3: { location: cloudCommonModule, identifier: 'entityUserDefined', param: { p_0: '3' }, initial: 'User Defined 3' },
				UserDefined4: { location: cloudCommonModule, identifier: 'entityUserDefined', param: { p_0: '4' }, initial: 'User Defined 4' },
				UserDefined5: { location: cloudCommonModule, identifier: 'entityUserDefined', param: { p_0: '5' }, initial: 'User Defined 5' },

				UserDefinedDate01: { location: salesCommonModule, identifier: 'entityUserDefinedDate', param: { p_0: '1' }, initial: 'User Defined Date 1' },
				UserDefinedDate02: { location: salesCommonModule, identifier: 'entityUserDefinedDate', param: { p_0: '2' }, initial: 'User Defined Date 2' },
				UserDefinedDate03: { location: salesCommonModule, identifier: 'entityUserDefinedDate', param: { p_0: '3' }, initial: 'User Defined Date 3' },
				UserDefinedDate04: { location: salesCommonModule, identifier: 'entityUserDefinedDate', param: { p_0: '4' }, initial: 'User Defined Date 4' },
				UserDefinedDate05: { location: salesCommonModule, identifier: 'entityUserDefinedDate', param: { p_0: '5' }, initial: 'User Defined Date 5' },

				OrdHeaderFk: { location: salesCommonModule, identifier: 'entityOrdHeaderFk', initial: 'Contract' },
				ObjUnitFk: { location: objectMainModule, identifier: 'entityUnitFk', initial: 'Unit' },

				TextType: { location: salesCommonModule, identifier: 'entityTextType', initial: 'Text Type' },

				Remark: { location: salesCommonModule, identifier: 'entityRemark', initial: 'Remark' },
				CommentText: { location: salesCommonModule, identifier: 'entityCommentText', initial: 'CommentText' },
				Factor: {location: basicsBillingSchema, identifier: 'factor', initial: 'Factor'},
				CostLineTypeFk: { location: basicsBillingSchema, identifier: 'costLineTypeFk', initial: 'Cost Line Type' },
				SalesDocumentTypeFk: { location: salesCommonModule, identifier: 'document.salesDocumentTypeFk', initial: 'Sales Document Type' },
				DocumentTypeFk: {location: cloudCommonModule, identifier: 'entityType', initial: 'Document Type'},
				DocumentDate: { location: cloudCommonModule, identifier: 'entityDate', initial: 'Date' },
				OriginFileName: {location: cloudCommonModule, identifier: 'documentOriginFileName', initial: 'Document Origin File Name' },
				BusinesspartnerBilltoFk: {location: salesCommonModule, identifier: 'entityBusinesspartnerBilltoFk', initial: '#Bill to Businesspartner'},
				ContactBilltoFk: {location: salesCommonModule, identifier: 'entityContactBilltoFk', initial: '#Bill to Contact'},
				SubsidiaryBilltoFk: {location: salesCommonModule, identifier: 'entitySubsidiaryBilltoFk', initial: 'Branch (Payer)'},
				CustomerBilltoFk: {location: salesCommonModule, identifier: 'entityCustomerBilltoFk', initial: 'Customer (Payer)'},
				BasWarrantysecurityFk: { location: salesCommonModule, identifier: 'warranty.basWarrantySecurityFk', initial: 'Warranty Security' },
				BasWarrantyobligationFk: { location: salesCommonModule, identifier: 'warranty.basWarrantyObligationFk', initial: 'Warranty Obligation' },
				Description: { location: cloudCommonModule, identifier: 'entityDescription', initial: 'Description' },
				HandoverDate: { location: salesCommonModule, identifier: 'warranty.handOverDate', initial: 'Hand Over Date' },
				DurationMonths: { location: salesCommonModule, identifier: 'warranty.durationMonths', initial: 'Duration Months' },
				WarrantyEnddate: { location: salesCommonModule, identifier: 'warranty.warrantyEndDate', initial: 'Warranty End Date' },
				UserDefinedText1: { location: cloudCommonModule, identifier: 'entityUserDefinedText', initial: 'entityUserDefinedText', param: {'p_0': '1'} },
				UserDefinedText2: { location: cloudCommonModule, identifier: 'entityUserDefinedText', initial: 'entityUserDefinedText', param: {'p_0': '2'} },
				UserDefinedText3: { location: cloudCommonModule, identifier: 'entityUserDefinedText', initial: 'entityUserDefinedText', param: {'p_0': '3'} },
				UserDefinedText4: { location: cloudCommonModule, identifier: 'entityUserDefinedText', initial: 'entityUserDefinedText', param: {'p_0': '4'} },
				UserDefinedText5: { location: cloudCommonModule, identifier: 'entityUserDefinedText', initial: 'entityUserDefinedText', param: {'p_0': '5'} },
				UserDefinedDate1: { location: cloudCommonModule, identifier: 'entityUserDefinedDate', initial: 'entityUserDefinedDate', param: {'p_0': '1'} },
				UserDefinedDate2: { location: cloudCommonModule, identifier: 'entityUserDefinedDate', initial: 'entityUserDefinedDate', param: {'p_0': '2'} },
				UserDefinedDate3: { location: cloudCommonModule, identifier: 'entityUserDefinedDate', initial: 'entityUserDefinedDate', param: {'p_0': '3'} },
				UserDefinedDate4: { location: cloudCommonModule, identifier: 'entityUserDefinedDate', initial: 'entityUserDefinedDate', param: {'p_0': '4'} },
				UserDefinedDate5: { location: cloudCommonModule, identifier: 'entityUserDefinedDate', initial: 'entityUserDefinedDate', param: {'p_0': '5'} },
				UserDefinedNumber1: { location: cloudCommonModule, identifier: 'entityUserDefinedNumber1', initial: 'User Defined Number 1'},
				UserDefinedNumber2: { location: cloudCommonModule, identifier: 'entityUserDefinedNumber2', initial: 'User Defined Number 2'},
				UserDefinedNumber3: { location: cloudCommonModule, identifier: 'entityUserDefinedNumber3', initial: 'User Defined Number 3'},
				UserDefinedNumber4: { location: cloudCommonModule, identifier: 'entityUserDefinedNumber4', initial: 'User Defined Number 4'},
				UserDefinedNumber5: { location: cloudCommonModule, identifier: 'entityUserDefinedNumber5', initial: 'User Defined Number 5'},
				SalesDateKindFk: { location: salesCommonModule, identifier: 'milestone.entitySalesDateKind', initial: 'Sales Date Kind' },
				SalesDateTypeFk: { location: salesCommonModule, identifier: 'milestone.entitySalesDateType', initial: 'Sales Date Type' },
				MilestoneDate: { location: salesCommonModule, identifier: 'milestone.entityMilestoneDate', initial: 'Milestone Date' },
				MilestoneDateOrg: { location: salesCommonModule, identifier: 'milestone.entityMilestoneDateOrg', initial: 'Milestone Date Org' },
				MdcTaxCodeFk: { location: cloudCommonModule, identifier: 'entityTaxCode', initial: 'entityTaxCode'},
				MdcSalesTaxGroupFk: { location: salesCommonModule, identifier: 'entityMdcSalesTaxGroup', initial: 'Sales Tax Group'},
				Amount: { location: cloudCommonModule, identifier: 'entityAmount', initial: 'entityAmount'},
				IsNetAdjusted: {location: basicsBillingSchema, identifier: 'entityIsNetAdjusted', initial: 'Net Adjusted'},
				ConfigurationFk: {'location': salesCommonModule, identifier: 'entityConfigurationFk', initial: 'Configuration'}
			}
		}
	});

	/**
	 * @ngdoc service
	 * @name salesCommonTranslationService
	 * @description provides translation for sales bid module
	 */
	angular.module(salesCommonModule).service('salesCommonTranslationService', ['platformUIBaseTranslationService', 'salesCommonTranslations',
		function (platformUIBaseTranslationService, salesCommonTranslations) {
			var localBuffer = {};
			platformUIBaseTranslationService.call(this, [salesCommonTranslations], localBuffer);
		}

	]);

})();
