/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	var salesBillingModule = 'sales.billing';
	var salesCommonModule = 'sales.common';
	var basicsCommonModule = 'basics.common';
	var basicsBankModule = 'basics.bank';
	var cloudCommonModule = 'cloud.common';
	var boqMainModule = 'boq.main';
	var projectMainModule = 'project.main';
	var businesspartnerMainModule = 'businesspartner.main';
	var billingschemaModule = 'basics.billingschema';
	var basicsCustomizeModule = 'basics.customize';
	var prcInvoiceModName = 'procurement.invoice';
	var basicsUserFormModule = 'basics.userform';
	var basicsCostcodesModule = 'basics.costcodes';
	var procurementCommonModule = 'procurement.common';
	var prcStructureModule = 'basics.procurementstructure';
	var modelEvaluationModule = 'model.evaluation';
	var modelMainModule = 'model.main';
	var modelSimulationModule = 'model.simulation';
	var modelViewerModule = 'model.viewer';
	var estimateMainModule = 'estimate.main';
	var estimateProjectModule = 'estimate.project';
	var basicsCostCodesModule = 'basics.costcodes';
	var basicsMaterialModule = 'basics.material';
	var estimateRuleModule = 'estimate.Rule';
	var estimateParamModule = 'estimate.param';
	var salesBidModule = 'sales.bid';
	var constructionSystemMainModule = 'constructionsystem.main';
	var projectStructuresModule = 'project.structures';
	var modelWdeViewerModule = 'model.wdeviewer';
	var procurementPackageModule = 'procurement.package';
	var procurementRequisitionModule = 'procurement.requisition';
	var procurementStructureModule = 'procurement.structure';
	var companyModule = 'basics.company';
	var basicsProcurementconfiguration = 'basics.procurementconfiguration';
	var basicsAssetMaster = 'basics.assetmaster';
	var basicsCostGroups = 'basics.costgroups';
	var qtoMainModule = 'qto.main';
	var controllingStructureModule = 'controlling.structure';

	// TODO: see r18230 Task: #125794 Sales BIM Container Integration (see wiki)

	/* jshint -W106 */ // Variable name is according usage in translation json
	angular.module(salesBillingModule).value('salesBillingTranslations', {
		translationInfos: {
			'extraModules': [salesBillingModule, salesCommonModule, projectMainModule, cloudCommonModule, basicsCommonModule, basicsBankModule, boqMainModule, businesspartnerMainModule, billingschemaModule, basicsCustomizeModule, prcInvoiceModName, basicsUserFormModule, basicsCostcodesModule, procurementCommonModule, prcStructureModule,
				modelEvaluationModule, modelMainModule, modelSimulationModule, modelViewerModule],
			'extraWords': {

				TypeFk: {location: salesBillingModule, identifier: 'entityBillTypeFk', initial: 'Type'},
				BilStatusFk: {location: salesBillingModule, identifier: 'entityBilStatusFk', initial: 'Billing Status'},
				BillDate: {location: salesBillingModule, identifier: 'entityBillDate', initial: 'Bill Date'},
				DatePosted: {location: salesBillingModule, identifier: 'entityPostingDate', initial: 'Posting Date'},
				InvoiceTypeFk: {location: salesBillingModule, identifier: 'entityInvoiceTypeFk', initial: 'Invoice Type'},
				BillNo: {location: salesBillingModule, identifier: 'entityBillNo', initial: 'BillNo'},
				ConsecutiveBillNo: {location: salesBillingModule, identifier: 'entityConsecutiveBillNo', initial: 'Consecutive Bill No.'},
				ProgressInvoiceNo: {location: salesBillingModule, identifier: 'entityProgressInvoiceNo', initial: 'Progress Invoice'},
				FinalGroup: {location: salesBillingModule, identifier: 'entityFinalGroupNo', initial: 'Final Invoice Group'},
				BillingSchemaFk: {location: cloudCommonModule, identifier: 'entityBillingSchema', initial: 'Billing Schema'},
				BlobsBillToPartyFk: {location: salesBillingModule, identifier: 'entityBlobsBillToPartyFk', initial: 'Bill To Party'},
				IsCanceled: {location: salesBillingModule, identifier: 'entityIsCanceled', initial: 'Is Canceled'},
				CancellationNo: {location: salesBillingModule, identifier: 'entityCancellationNo', initial: 'Cancellation No'},
				CancellationReason: {location: salesBillingModule, identifier: 'entityCancellationReason', initial: 'Cancellation Reason'},
				CancellationDate: {location: salesBillingModule, identifier: 'entityCancellationDate', initial: 'Cancellation Date'},
				BookingText: {location: salesBillingModule, identifier: 'entityBookingText', initial: 'Booking Text'},
				IsNotAccrual: {location: salesBillingModule, identifier: 'entityIsNotAccrual', initial: 'Is not accrual'},

				// override translations from common and use 'change order' translation here
				PrjChangeFk : { location: salesCommonModule, identifier: 'entityChangeOrder', initial: 'Change Order'},
				PrjChangeStatusFk : { location: salesCommonModule, identifier: 'entityChangeOrderStatus', initial: 'Change Order-Status'},

				CredFactor: {location: billingschemaModule, identifier: 'credFactor', initial: 'Cred Factor'},
				DebFactor: {location: billingschemaModule, identifier: 'debFactor', initial: 'Deb Factor'},
				DetailAuthorAmountFk: {location: billingschemaModule, identifier: 'billingschmdtlaafk', initial: 'Author.Amount Ref'},
				BillingSchemaDetailTaxFk: {location: billingschemaModule, identifier: 'billingSchmDtlTaxFk', initial: 'Tax Ref'},
				CredLineTypeFk: {location: billingschemaModule, identifier: 'creditorlinetype', initial: 'Treatment Cred'},
				DebLineTypeFk: {location: billingschemaModule, identifier: 'debitorlinetype', initial: 'Treatment Deb'},

				MessageseverityFk: {location: basicsCustomizeModule, identifier: 'messageseverityfk', initial: 'Message Severity'},
				MessageFk: {location: salesBillingModule, identifier: 'message', initial: 'Message'},
				Parameter1: {location: salesBillingModule, identifier: 'parameter1', initial: 'Parameter 1'},
				Parameter2: {location: salesBillingModule, identifier: 'parameter2', initial: 'Parameter 2'},
				Parameter3: {location: salesBillingModule, identifier: 'parameter3', initial: 'Parameter 3'},
				Message: {location: salesBillingModule, identifier: 'message', initial: 'Message'},

				DocumentType: {location: prcInvoiceModName, identifier: 'transaction.documentType', initial: 'Document Type'},
				Documentno: {location: prcInvoiceModName, identifier: 'entityDocumentNo', initial: 'Document No.'},
				LineType: {location: prcInvoiceModName, identifier: 'transaction.lineType', initial: 'Line Type'},
				Currency: {location: prcInvoiceModName, identifier: 'transaction.currency', initial: 'Currency'},
				VoucherNumber: {location: prcInvoiceModName, identifier: 'transaction.voucherNumber', initial: 'Voucher Number'},
				VoucherDate: {location: salesBillingModule, identifier: 'entityBillDate', initial: 'Bill Date'},
				PostingNarritive: {location: prcInvoiceModName, identifier: 'transaction.postingNarritive', initial: 'Posting Narritive'},
				PostingDate: {location: prcInvoiceModName, identifier: 'transaction.postingDate', initial: 'Posting Date'},
				NetDuedate: {location: prcInvoiceModName, identifier: 'transaction.netDuedate', initial: 'Net Due Date'},
				DiscountDuedate: {location: prcInvoiceModName, identifier: 'transaction.discountDueDate', initial: 'Discount Due Date'},
				DiscountAmount: {location: prcInvoiceModName, identifier: 'transaction.discountAmount', initial: 'Discount Amount'},
				Debtor: {location: salesBillingModule, identifier: 'debtor', initial: 'Debtor'},
				DebtorGroup: {location: salesBillingModule, identifier: 'debtorGroup', initial: 'Debtor Group'},
				BusinesspostingGroup: {location: prcInvoiceModName, identifier: 'transaction.businesspostingGroup', initial: 'Businessposting Group'},
				AccountReceiveable: {location: salesBillingModule, identifier: 'accountReceiveable', initial: 'Account Receiveable'},
				NominalAccount: {location: prcInvoiceModName, identifier: 'transaction.nominalAccount', initial: 'Nominal Account'},
				Amount: {location: prcInvoiceModName, identifier: 'transaction.amount', initial: 'Amount'},
				Quantity: {location: cloudCommonModule, identifier: 'entityQuantity', initial: 'Quantity'},
				IsDebit: {location: prcInvoiceModName, identifier: 'transaction.isdebit', initial: 'Is Debit'},
				VatAmount: {location: prcInvoiceModName, identifier: 'transaction.vatAmount', initial: 'Vat Amount'},
				VatCode: {location: prcInvoiceModName, identifier: 'transaction.vatCode', initial: 'Vat Code'},
				IsProgress: {location: prcInvoiceModName, identifier: 'transaction.isprogress', initial: 'Is Progress'},
				OrderNumber: {location: prcInvoiceModName, identifier: 'transaction.orderNumber', initial: 'Order Number'},
				AmountAuthorized: {location: prcInvoiceModName, identifier: 'transaction.amountAuthorized', initial: 'Amount Authorized'},
				ControllingUnitCode: {location: prcInvoiceModName, identifier: 'transaction.controllingUnitCode', initial: 'Controlling Unit Code'},
				ControllingUnitAssign01: {location: prcInvoiceModName, identifier: 'transaction.controllingUnitAssign01', initial: 'Controlling Unit Assign01'},
				ControllingUnitAssign02: {location: prcInvoiceModName, identifier: 'transaction.controllingUnitAssign02', initial: 'Controlling Unit Assign02'},
				ControllingUnitAssign03: {location: prcInvoiceModName, identifier: 'transaction.controllingUnitAssign03', initial: 'Controlling Unit Assign03'},
				ControllingUnitAssign04: {location: prcInvoiceModName, identifier: 'transaction.controllingUnitAssign04', initial: 'Controlling Unit Assign04'},
				ControllingUnitAssign05: {location: prcInvoiceModName, identifier: 'transaction.controllingUnitAssign05', initial: 'Controlling Unit Assign05'},
				ControllingUnitAssign06: {location: prcInvoiceModName, identifier: 'transaction.controllingUnitAssign06', initial: 'Controlling Unit Assign06'},
				ControllingUnitAssign07: {location: prcInvoiceModName, identifier: 'transaction.controllingUnitAssign07', initial: 'Controlling Unit Assign07'},
				ControllingUnitAssign08: {location: prcInvoiceModName, identifier: 'transaction.controllingUnitAssign08', initial: 'Controlling Unit Assign08'},
				ControllingUnitAssign09: {location: prcInvoiceModName, identifier: 'transaction.controllingUnitAssign09', initial: 'Controlling Unit Assign09'},
				ControllingUnitAssign10: {location: prcInvoiceModName, identifier: 'transaction.controllingUnitAssign10', initial: 'Controlling Unit Assign10'},
				ControllingunitAssign01desc: {location: prcInvoiceModName, identifier: 'transaction.controllingUnitAssign01Desc', initial: 'Controlling Unit Assign01 Description'},
				ControllingunitAssign02desc: {location: prcInvoiceModName, identifier: 'transaction.controllingUnitAssign02Desc', initial: 'Controlling Unit Assign02 Description'},
				ControllingunitAssign03desc: {location: prcInvoiceModName, identifier: 'transaction.controllingUnitAssign03Desc', initial: 'Controlling Unit Assign03 Description'},
				ControllingunitAssign04desc: {location: prcInvoiceModName, identifier: 'transaction.controllingUnitAssign04Desc', initial: 'Controlling Unit Assign04 Description'},
				ControllingunitAssign05desc: {location: prcInvoiceModName, identifier: 'transaction.controllingUnitAssign05Desc', initial: 'Controlling Unit Assign05 Description'},
				ControllingunitAssign06desc: {location: prcInvoiceModName, identifier: 'transaction.controllingUnitAssign06Desc', initial: 'Controlling Unit Assign06 Description'},
				ControllingunitAssign07desc: {location: prcInvoiceModName, identifier: 'transaction.controllingUnitAssign07Desc', initial: 'Controlling Unit Assign07 Description'},
				ControllingunitAssign08desc: {location: prcInvoiceModName, identifier: 'transaction.controllingUnitAssign08Desc', initial: 'Controlling Unit Assign08 Description'},
				ControllingunitAssign09desc: {location: prcInvoiceModName, identifier: 'transaction.controllingUnitAssign09Desc', initial: 'Controlling Unit Assign09 Description'},
				ControllingunitAssign10desc: {location: prcInvoiceModName, identifier: 'transaction.controllingUnitAssign10Desc', initial: 'Controlling Unit Assign10 Description'},
				ControllingUnitAssign01Comment: {location: prcInvoiceModName, identifier: 'transaction.controllingUnitAssign01Comment', initial: 'Controlling Unit Assign01 Comment'},
				ControllingUnitAssign02Comment: {location: prcInvoiceModName, identifier: 'transaction.controllingUnitAssign02Comment', initial: 'Controlling Unit Assign02 Comment'},
				ControllingUnitAssign03Comment: {location: prcInvoiceModName, identifier: 'transaction.controllingUnitAssign03Comment', initial: 'Controlling Unit Assign03 Comment'},
				ControllingUnitAssign04Comment: {location: prcInvoiceModName, identifier: 'transaction.controllingUnitAssign04Comment', initial: 'Controlling Unit Assign04 Comment'},
				ControllingUnitAssign05Comment: {location: prcInvoiceModName, identifier: 'transaction.controllingUnitAssign05Comment', initial: 'Controlling Unit Assign05 Comment'},
				ControllingUnitAssign06Comment: {location: prcInvoiceModName, identifier: 'transaction.controllingUnitAssign06Comment', initial: 'Controlling Unit Assign06 Comment'},
				ControllingUnitAssign07Comment: {location: prcInvoiceModName, identifier: 'transaction.controllingUnitAssign07Comment', initial: 'Controlling Unit Assign07 Comment'},
				ControllingUnitAssign08Comment: {location: prcInvoiceModName, identifier: 'transaction.controllingUnitAssign08Comment', initial: 'Controlling Unit Assign08 Comment'},
				ControllingUnitAssign09Comment: {location: prcInvoiceModName, identifier: 'transaction.controllingUnitAssign09Comment', initial: 'Controlling Unit Assign09 Comment'},
				ControllingUnitAssign10Comment: {location: prcInvoiceModName, identifier: 'transaction.controllingUnitAssign10Comment', initial: 'Controlling Unit Assign10 Comment'},
				IsSuccess: {location: prcInvoiceModName, identifier: 'transaction.issuccess', initial: 'Is Success'},
				TransactionId: {location: prcInvoiceModName, identifier: 'transaction.transactionId', initial: 'transactionId'},
				HandoverId: {location: prcInvoiceModName, identifier: 'transaction.handoverId', initial: 'HandoverId'},
				ReturnValue: {location: prcInvoiceModName, identifier: 'transaction.returnValue', initial: 'Return Value'},
				NominalDimension: {location: prcInvoiceModName, identifier: 'transaction.nominalDimension', initial: 'Nominal Dimension'},
				NominalDimension2: {location: prcInvoiceModName, identifier: 'transaction.nominalDimension2', initial: 'Nominal Dimension2'},
				NominalDimension3: {location: prcInvoiceModName, identifier: 'transaction.nominalDimension3', initial: 'Nominal Dimension3'},
				LineNo: {location: salesBillingModule, identifier: 'lineNo', initial: 'Line No'},
				ControllingUnitIcFk: {location: prcInvoiceModName, identifier: 'transaction.controllingUnitIc', initial: 'Clearing Controlling Unit'},
				BilItemDescription: {location: salesBillingModule, identifier: 'bilItemDesc', initial: 'Billing Item Description'},

				ItemNo: {location: procurementCommonModule, identifier: 'prcItemItemNo', initial: 'Item No'},
				Description1: {location: procurementCommonModule, identifier: 'prcItemDescription1', initial: 'Description1'},
				Description2: {location: procurementCommonModule, identifier: 'prcItemDescription2', initial: 'Description2'},
				Specification: {location: cloudCommonModule, identifier: 'EntitySpec', initial: 'Specification'},
				CostCodeFk: {location: cloudCommonModule, identifier: 'entityCostCode', initial: 'Cost Code'},
				MdcMaterialFk: {location: procurementCommonModule, identifier: 'prcItemMaterialNo', initial: 'Material No'},
				UomFk: {location: cloudCommonModule, identifier: 'entityUoM', initial: 'UoM'},
				Price: {location: cloudCommonModule, identifier: 'entityPrice', initial: 'Price'},
				PriceOc: {location: salesBillingModule, identifier: 'entityPriceOC', initial: 'Price OC'},
				TaxCodeFk: {location: cloudCommonModule, identifier: 'entityTaxCode', initial: 'Tax Code'},
				TaxCodeMatrixCode: {location: procurementCommonModule, identifier: 'transaction.taxcodematrix', initial: 'Tax Code Matrix'},

				// Amount translations are used by bills and bill items
				AmountNet: {location: salesBillingModule, identifier: 'entityAmountNet', initial: 'Net Amount'},
				AmountGross: {location: salesBillingModule, identifier: 'entityAmountGross', initial: 'Gross Amount'},
				AmountVat: {location: salesBillingModule, identifier: 'entityAmountVat', initial: 'VAT Amount'},
				AmountNetOc: {location: salesBillingModule, identifier: 'entityAmountNetOc', initial: 'Net Amount Oc'},
				AmountGrossOc: {location: salesBillingModule, identifier: 'entityAmountGrossOc', initial: 'Gross Amount Oc'},

				Assetno: {location: salesBillingModule, identifier: 'AssetNo', initial: 'Asset No'},
				PostingType: {location: prcInvoiceModName, identifier: 'group.postingtype', initial: 'Posting Type'},
				CodeRetention: {location: prcInvoiceModName, identifier: 'header.codeRetention', initial: 'Code Retention'},
				PaymentTermFk: {location: prcInvoiceModName, identifier: 'header.paymentTerm', initial: 'Payment Term'},



				PaymentScheduleCode: {location: salesBillingModule, identifier: 'paymentSchedule', initial: 'Payment Schedule'},

				AmountTotal: {location: salesBillingModule, identifier: 'amountTotal', initial: '"Total Payment'},
				DiscountAmountTotal: {location: salesBillingModule, identifier: 'discountAmountTotal', initial: 'Total Payment Discount'},
				DateEffective: {location: basicsCommonModule, identifier: 'dateEffective', initial: 'Date Effective'},
				DateDiscount: {location: salesBillingModule, identifier: 'entityDateDiscount', initial: 'Discount Date'},
				DateNetpayable: {location: salesBillingModule, identifier: 'entityDateNetpayable', initial: 'Net Payable'},
				ControllinggrpsetFk: {location: cloudCommonModule, identifier: 'entityControllinggrpset', initial: 'Controlling grp set'},

				BankTypeFk: {location: basicsCustomizeModule, identifier: 'banktype', initial: 'Bank Type'},
				BankFk: {location: basicsBankModule, identifier: 'entityBank', initial: 'Bank'},
				ContactFk: {location: 'project.main', identifier: 'entityContact', initial: '*Contact'},
				PreviousBillFk: {location: salesBillingModule, identifier: 'entityPreviousBillFk', initial: 'Previous Bill'},
				RelatedBillHeaderFk: {location: salesBillingModule, identifier: 'entityRelatedBillHeaderFk', initial: 'Reference Bill'},
				ReferenceStructured: {location: salesBillingModule, identifier: 'entityReferenceStructured', initial: 'Reference Structured'},

				ItemReference: {location: procurementCommonModule, identifier: 'transaction.entityItemreference', initial: 'Item reference'},
				ExtOrderNo: {location: procurementCommonModule, identifier: 'orderNo', initial: 'Order No'},
				NominalAccountFi: {location: salesBillingModule, identifier: 'entityNominalAccountFi', initial: 'Nominal Account Fi'},
				DocumentNo: {location: prcInvoiceModName, identifier: 'entityDocumentNo', initial: 'Document No.'},
				PrcPriceConditionFk: {
					location: cloudCommonModule,
					identifier: 'entityPriceCondition',
					initial: 'entityPriceCondition'
				},
				PriceExtra: {
					location: procurementCommonModule,
					identifier: 'prcItemPriceExtras',
					initial: 'prcItemPriceExtras'
				},
				PriceExtraOc: {
					location: procurementCommonModule,
					identifier: 'prcItemPriceExtrasCurrency',
					initial: 'prcItemPriceExtrasCurrency'
				},
				TotalPrice: {location: procurementCommonModule, identifier: 'prcItemTotalPrice', initial: 'Total Price'},
				TotalPriceOc: {location: procurementCommonModule, identifier: 'prcItemTotalPriceCurrency', initial: 'Total Price(OC)'},
				PriceGross: {location: procurementCommonModule, identifier: 'priceGross', initial: 'Price Gross'},
				PriceGrossOc: {location: procurementCommonModule, identifier: 'priceOcGross', initial: 'Price Gross (Oc)'},
				TotalPriceGross: {location: procurementCommonModule, identifier: 'totalPriceGross', initial: 'Total Price Gross'},
				TotalPriceGrossOc: {location: procurementCommonModule, identifier: 'totalPriceGrossOc', initial: 'Total Price Gross (OC)'},
				Total: {location: cloudCommonModule, identifier: 'entityTotal', initial: 'entityTotal'},
				TotalOc: {location: procurementCommonModule, identifier: 'prcItemTotalCurrency', initial: 'prcItemTotalCurrency'},
				TotalGross: {location: procurementCommonModule, identifier: 'totalGross', initial: 'Total (Gross)'},
				TotalGrossOc: {location: procurementCommonModule, identifier: 'totalOcGross', initial: 'Total Gross (Oc)'},
				BasSalesTaxMethodFk: {location: salesBillingModule, identifier: 'entityBasSalesTaxMethodFk', initial: 'Sales Tax Method'},
				VatGroupFk: {location: procurementCommonModule, identifier: 'entityVatGroup', initial: 'Vat Group'},
				PrcTexttypeFk: { location: salesBidModule, identifier: 'headerText.prcTextType', initial: 'Text Type'},
				BasTextModuleTypeFk: { location: salesBidModule, identifier: 'bastextmoduletype', initial: 'Text Module Type'},
				baseGroup: { location: cloudCommonModule, identifier: 'entityProperties', initial: 'Basic Data'},

				// IndirectCostsBalancing
				IsDeficitDjcRisk: {location: salesBillingModule, identifier: 'entityIsDeficitDjcRisk', initial: 'Direct Job Costs (DJC) Risk'},
				IsDeficitGcRisk: {location: salesBillingModule, identifier: 'entityIsDeficitGcRisk', initial: 'General Costs (GC) Risk'},
				IsDeficitDjcProfit: {location: salesBillingModule, identifier: 'entityIsDeficitDjcProfit', initial: 'Direct Job Costs (DJC) Profit'},
				IsDeficitGcProfit: {location: salesBillingModule, identifier: 'entityIsDeficitGcProfit', initial: 'General Costs (GC) Profit'},
				IsSurplusGcOnly: {location: salesBillingModule, identifier: 'entityIsSurplusGcOnly', initial: 'General Costs only'},
				CalculationBase: {location: salesBillingModule, identifier: 'entityCalculationBase', initial: 'Calculation Base'}, // TODO:
				AdminGeneralPercentage: {location: salesBillingModule, identifier: 'entityAdminGeneralPercentage', initial: 'General and Administrative Costs [%]'},
				RiskPercentage: {location: salesBillingModule, identifier: 'entityRiskPercentage', initial: 'Risk [%]'},
				ProfitPercentage: {location: salesBillingModule, identifier: 'entityProfitPercentage', initial: 'Profit [%]'},
				IsLowerLimitStrdBaseAlternItem: {location: salesBillingModule, identifier: 'entityIsLowerLimitStrdBaseAlternItem', initial: 'BQ Quantity <'},
				LowerLimitStrdBaseAlternItem: {location: salesBillingModule, identifier: 'entityLowerLimitStrdBaseAlternItem', initial: 'WQ Quantity *'},
				IsUpperLimitStrdBaseAlternItem: {location: salesBillingModule, identifier: 'entityIsUpperLimitStrdBaseAlternItem', initial: 'BQ Quantity >'},
				UpperLimitStrdBaseAlternItem: {location: salesBillingModule, identifier: 'entityUpperLimitStrdBaseAlternItem', initial: 'WQ Quantity *'},
				IsLowerLimitPrjChgItem: {location: salesBillingModule, identifier: 'entityIsLowerLimitPrjChgItem', initial: 'BQ Quantity <'},
				LowerLimitPrjChgItem: {location: salesBillingModule, identifier: 'entityLowerLimitPrjChgItem', initial: 'WQ Quantity *'},
				IsUpperLimitPrjChgItem: {location: salesBillingModule, identifier: 'entityIsUpperLimitPrjChgItem', initial: 'BQ Quantity >'},
				UpperLimitPrjChgItem: {location: salesBillingModule, identifier: 'entityUpperLimitPrjChgItem', initial: 'WQ Quantity *'},
				IsBalanceBoqItemTypeOptional: {location: salesBillingModule, identifier: 'entityIsBalanceBoqItemTypeOptional', initial: 'Optional Items'},
				IsBalanceBoqItemType2BaseAlt: {location: salesBillingModule, identifier: 'entityIsBalanceBoqItemType2BaseAlt', initial: 'Alternative/Postponed Base Items'},
				IsBalanceBoqItemTypeDwtmItem: {location: salesBillingModule, identifier: 'entityIsBalanceBoqItemTypeDwtmItem', initial: 'DW/T+M Items'},
				IsBalanceBoqItemPrjChg: {location: salesBillingModule, identifier: 'entityIsBalanceBoqItemPrjChg', initial: 'Change Order Items'},

				// new groups
				decreasedMargins: {location: salesBillingModule, identifier: 'groupDecreasedMargins', initial: 'Decreased Margins'},
				increasedMargins: {location: salesBillingModule, identifier: 'groupIncreasedMargins', initial: 'Increased Margins'},
				markups: {location: salesBillingModule, identifier: 'groupMarkups', initial: 'Markups'},
				standardAwardedBaseAlternativeItems: {location: salesBillingModule, identifier: 'groupStandardAwardedBaseAlternativeItems', initial: 'Standard and Awarded Base/Alternative Items'},
				changeOrderItems: {location: salesBillingModule, identifier: 'groupChangeOrderItems', initial: 'Change Order Items'},
				specialBalancing: {location: salesBillingModule, identifier: 'groupSpecialBalancing', initial: 'Special Balancing for'},
				CompanyIcDebtorFk: {location: salesBillingModule, identifier: 'iCCompanyCustomer', initial: 'IC Company Customer'},
				ICInvHeaderCode: {location: prcInvoiceModName, identifier: 'iCInvoiceNo', initial: 'IC Invoice No.'}
				// End IndirectCostsBalancing
			}
		}
	});

	var estimateMainTranslations = {
		translationInfos: {
			'extraModules': [procurementPackageModule,estimateMainModule, estimateProjectModule, cloudCommonModule, basicsCostCodesModule, basicsMaterialModule,
				estimateRuleModule, estimateParamModule,salesBidModule, salesCommonModule, projectMainModule, modelMainModule, modelViewerModule, modelWdeViewerModule,
				basicsCommonModule, basicsCustomizeModule, modelSimulationModule, constructionSystemMainModule, projectStructuresModule,procurementStructureModule,
				companyModule, procurementCommonModule, procurementRequisitionModule,basicsProcurementconfiguration, boqMainModule, procurementCommonModule, basicsAssetMaster, basicsCostGroups,
				modelEvaluationModule, qtoMainModule,controllingStructureModule],
			'extraWords': {
				moduleName: {'location': procurementPackageModule, 'identifier': 'moduleName', 'initial': 'package'},
				HeaderGroupHeader: {'location': procurementPackageModule, 'identifier': 'entityGroup', 'initial': 'Group'},
				projectAddressGroup: {location: projectMainModule, identifier: 'projectAddressGroup', initial: 'Project Address'},
				Requisition: {'location': procurementPackageModule, 'identifier': 'entityRequisition.group', 'initial': 'Requisition'},
				RfQ: {'location': procurementPackageModule, 'identifier': 'entityRfQ.group', 'initial': 'RfQ'},
				Quote: {'location': procurementPackageModule, 'identifier': 'entityQuote.group', 'initial': 'Quote'},
				Contract: {'location': procurementPackageModule, 'identifier': 'entityContract.group', 'initial': 'Contract'},

				ExternalResponsible: {'location': procurementPackageModule, 'identifier': 'externalResponsible.group', 'initial': 'External Responsible'},

				Performance: {'location': procurementPackageModule, 'identifier': 'entityPerformance.group', 'initial': 'Performance'},
				Event: {'location': procurementPackageModule, 'identifier': 'entityEvent.group', 'initial': 'Event'},
				HeaderGroupUserDefinedFields: {'location': procurementPackageModule, 'identifier': 'entityUserDefined', 'initial': 'UserDefined'},
				ProjectFk: {'location': cloudCommonModule, 'identifier': 'entityProjectNo', 'initial': 'ProjectNo'},
				ProjectStatusFk: {'location': procurementPackageModule, 'identifier': 'projectStatus', 'initial': 'Project Status'},
				CompanyFk: {'location': cloudCommonModule, 'identifier': 'entityCompany', 'initial': 'Company'},
				ComCurrencyCode: {'location': procurementPackageModule, 'identifier': 'ComCurrencyCode', 'initial': 'Company Currency'},
				ComCurrencyDes: {'location': procurementPackageModule, 'identifier': 'entityComCurrencyDes', 'initial': 'Company Currency Description'},
				PackageStatusFk: {'location': cloudCommonModule, 'identifier': 'entityState', 'initial': 'State'},
				StructureFk: {'location': basicsCommonModule, 'identifier': 'entityPrcStructureFk', 'initial': 'Procurement Structure'},
				PrcContractTypeFk: {location: basicsProcurementconfiguration, identifier: 'configuration.prccontracttypeFk', initial: 'Contract Type'},
				Code: {'location': cloudCommonModule, 'identifier': 'entityCode', 'initial': 'Code'},
				Description: {'location': cloudCommonModule, 'identifier': 'entityDescription', 'initial': 'description'},
				TaxCodeFk: {'location': cloudCommonModule, 'identifier': 'entityTaxCode', 'initial': 'TaxCode'},
				CurrencyFk: {'location': cloudCommonModule, 'identifier': 'entityCurrency', 'initial': 'Currency'},
				ExchangeRate: {'location': cloudCommonModule, 'identifier': 'entityRate', 'initial': 'entityRate'},
				PlannedStart: {'location': procurementPackageModule, 'identifier': 'entityPlannedStart', 'initial': 'Planned Start'},
				PlannedEnd: {'location': procurementPackageModule, 'identifier': 'entityPlannedEnd', 'initial': 'Planned End'},
				ActualStart: {'location': procurementPackageModule, 'identifier': 'entityActualStart', 'initial': 'Actual Start'},
				ActualEnd: {'location': procurementPackageModule, 'identifier': 'entityActualEnd', 'initial': 'Actual End'},
				PackageTypeFk: {'location': procurementPackageModule, 'identifier': 'entityPackageType', 'initial': 'PackageType'},
				ClerkPrcFk: {'location': cloudCommonModule, 'identifier': 'entityResponsible', 'initial': 'Responsible'},
				ClerkReqFk: {'location': cloudCommonModule, 'identifier': 'entityRequisitionOwner', 'initial': 'Requisition Owner'},
				Remark: {'location': cloudCommonModule, 'identifier': 'entityRemark', 'initial': 'Remark'},
				Remark2: {'location': procurementPackageModule, 'identifier': 'entityRemark2', 'initial': 'Remark2'},
				Remark3: {'location': procurementPackageModule, 'identifier': 'entityRemark3', 'initial': 'Remark3'},
				ActivityFk: {'location': procurementPackageModule, 'identifier': 'entityActivity', 'initial': 'Activity'},
				AssetMasterFk: { location: estimateMainModule, identifier: 'mdcAssetMasterFk', initial: 'Asset Master'},
				ScheduleFk: {'location': procurementPackageModule, 'identifier': 'entitySchedule', 'initial': 'Schedule'},
				Userdefined1: {'location': cloudCommonModule, 'identifier': 'entityUserDefined', 'initial': 'Userdefined1', param: {'p_0': '1'}},
				Userdefined2: {'location': cloudCommonModule, 'identifier': 'entityUserDefined', 'initial': 'Userdefined2', param: {'p_0': '2'}},
				Userdefined3: {'location': cloudCommonModule, 'identifier': 'entityUserDefined', 'initial': 'Userdefined3', param: {'p_0': '3'}},
				Userdefined4: {'location': cloudCommonModule, 'identifier': 'entityUserDefined', 'initial': 'Userdefined4', param: {'p_0': '4'}},
				Userdefined5: {'location': cloudCommonModule, 'identifier': 'entityUserDefined', 'initial': 'Userdefined5', param: {'p_0': '5'}},
				RequisitionCode: {'location': procurementPackageModule, 'identifier': 'entityRequisition.code', 'initial': 'Requisition Code'},
				RequisitionDescription: {'location': procurementPackageModule, 'identifier': 'entityRequisition.description', 'initial': 'Requisition Description'},
				RequisitionStatus: {'location': procurementPackageModule, 'identifier': 'entityRequisition.status', 'initial': 'Requisition Status'},
				RfqCode: {'location': procurementPackageModule, 'identifier': 'entityRfQ.code', 'initial': 'RfQ Code'},
				RfqDescription: {'location': procurementPackageModule, 'identifier': 'entityRfQ.description', 'initial': 'RfQ Description'},
				RfqStatus: {'location': procurementPackageModule, 'identifier': 'entityRfQ.status', 'initial': 'RfQ Status'},
				ContractCode: {'location': procurementPackageModule, 'identifier': 'entityContract.code', 'initial': 'Contract Code'},
				ContractDescription: {'location': procurementPackageModule, 'identifier': 'entityContract.description', 'initial': 'Contract Description'},
				BusinessPartnerName: {'location': procurementPackageModule, 'identifier': 'entityContract.businessPartnerName', 'initial': 'Business Partner Name'},
				BusinessPartnerSubsidiaryName: {'location': procurementPackageModule, 'identifier': 'entityContract.subsidiaryName', 'initial': 'Subsidiary Name'},
				SupplierNumber: {'location': procurementPackageModule, 'identifier': 'entityContract.supplierNumber', 'initial': 'Supplier Number'},
				BusinessPartnerFk: {'location': cloudCommonModule, 'identifier': 'entityBusinessPartner', 'initial': 'Business Partner'},
				SubsidiaryFk: {'location': cloudCommonModule, 'identifier': 'entitySubsidiary', 'initial': 'Subsidiary'},
				SupplierFk: {'location': cloudCommonModule, 'identifier': 'entitySupplier', 'initial': 'Supplier'},
				ContractStatus: {'location': procurementPackageModule, 'identifier': 'entityContract.status', 'initial': 'Contract Status'},
				ReqHeaderFk: { location: procurementPackageModule, identifier: 'entityReqCode', initial: 'Comment'},

				CountryFk: {location: cloudCommonModule, identifier: 'entityCountry', initial: 'Country'},
				RegionFk: {location: projectMainModule, identifier: 'entityRegion', initial: 'Region'},
				TelephoneNumberFk: {location: cloudCommonModule, identifier: 'TelephoneDialogPhoneNumber', initial: 'Telephone Number'},
				TelephoneTelefaxFk: {location: cloudCommonModule, identifier: 'fax', initial: 'Telephone Telefax'},
				TelephoneMobileFk: {location: procurementCommonModule, identifier: 'contactMobile', initial: 'Telephone Mobil'},
				Email: {location: cloudCommonModule, identifier: 'email', initial: 'Email'},

				BaselinePath: {location: procurementPackageModule, identifier: 'baselinePath', initial: 'Baseline Path'},
				BaselineUpdate: {location: procurementPackageModule, identifier: 'baselineUpdate', initial: 'Baseline Update'},
				BaselinePhase: {location: procurementPackageModule, identifier: 'baselinePhase', initial: 'Baseline Phase'},

				PrcEventTypeFk: {location: procurementStructureModule, identifier: 'eventType', initial: 'eventType'},
				StartCalculated: {location: procurementPackageModule, identifier: 'event.startCalculated', initial: 'startCalculated'},
				EndCalculated: {location: procurementPackageModule, identifier: 'event.endCalculated', initial: 'endCalculated'},
				StartOverwrite: {location: procurementPackageModule, identifier: 'event.startOverwrite', initial: 'startOverwrite'},
				EndOverwrite: {location: procurementPackageModule, identifier: 'event.endOverwrite', initial: 'endOverwrite'},
				StartActual: {location: procurementPackageModule, identifier: 'event.startActual', initial: 'startActual'},
				EndActual: {location: procurementPackageModule, identifier: 'event.endActual', initial: 'endActual'},
				StartRelevant: {location: procurementPackageModule, identifier: 'event.startRelevant', initial: 'startRelevant'},
				EndRelevant: {location: procurementPackageModule, identifier: 'event.endRelevant', initial: 'endRelevant'},

				DescriptionInfo: {location: cloudCommonModule, identifier: 'entityDescription', initial: 'Description'},
				MdcLineItemContextFk: {location: procurementPackageModule, 'identifier': 'entityMdcLineItemContextFk', 'initial': 'Mdc LineItem Context'},

				Status: {location: procurementPackageModule, identifier: 'import.status', initial: 'Status'},

				userDefText: { location: cloudCommonModule, identifier: 'UserdefTexts', initial: 'User Defined Text' },

				ProjectNo: {location: estimateMainModule, identifier: 'projectNo', initial: 'Project-Number'},
				ProjectName: {location: estimateMainModule, identifier: 'projectName', initial: 'Project-Name'},
				EstimationCode: { location: estimateMainModule, identifier: 'entityEstimationHeader', initial: 'Estimate Code' },
				EstimationDescription: { location: estimateMainModule, identifier: 'entityEstimationDesc', initial: 'Estimate Desc.' },

				Id:{ location: estimateMainModule, identifier: 'id', initial: 'Id' },
				Info:{ location: estimateMainModule, identifier: 'info', initial: 'Info' },
				Rule:{location: estimateRuleModule, identifier: 'rules', initial: 'Rules' },
				Param:{location: estimateParamModule, identifier: 'params', initial: 'Params' },

				Filter:{location: estimateMainModule, identifier: 'filter', initial: 'Filter' },

				Reference: { location: cloudCommonModule, identifier: 'entityReference', initial: 'Reference' },
				BriefInfo: { location: cloudCommonModule, identifier: 'entityBriefInfo', initial: 'Outline Specification' },

				BasUomFk: { location: cloudCommonModule, identifier: 'entityUoM', initial: 'UoM' },
				BasCurrencyFk: { location: cloudCommonModule, identifier: 'entityCurrency', initial: 'Currency' },
				BasUomTargetFk:{ location: estimateMainModule, identifier: 'basUomTargetFk', initial: 'UoM Target' },

				UoMFk: { location: cloudCommonModule, identifier: 'entityUoM', initial: 'UoM' },
				UomFk: { location: cloudCommonModule, identifier: 'entityUoM', initial: 'UoM' },
				QuantityUoMFk: { location: estimateMainModule, identifier: 'quantityUoM', initial: 'UoM' },

				TotalOf: { location: estimateMainModule, identifier: 'totalOf', initial: 'Total of' },
				Total: { location: estimateMainModule, identifier: 'total', initial: 'Total' },
				CurUoM: { location: estimateMainModule, identifier: 'curOrUoM', initial: 'Cur/UoM' },
				Estimate: { location: estimateMainModule, identifier: 'estimate', initial: 'Estimate' },
				ExternalCode: { location: estimateMainModule, identifier: 'ExternalCode', initial: 'External Code' },

				// quantiyAndFactors
				QuantityDetail:{ location: estimateMainModule, identifier: 'quantityDetail', initial: 'Quantity Detail' },
				Quantity:{ location: cloudCommonModule, identifier: 'entityQuantity', initial: 'Quantity' },
				QuantityTarget:{ location: estimateMainModule, identifier: 'quantityTarget', initial: 'Quantity Target' },
				QuantityTargetDetail:{ location: estimateMainModule, identifier: 'quantityTargetDetail', initial: 'Quantity Target Detail' },
				WqQuantityTarget:{ location: estimateMainModule, identifier: 'wqQuantityTarget', initial: ' Wq Quantity Item' },
				QuantityUnitTarget:{ location: estimateMainModule, identifier: 'quantityUnitTarget', initial: 'QuantityUnitTarget' },
				QuantityTotal:{ location: estimateMainModule, identifier: 'quantityTotal', initial: 'QuantityTotal' },
				QuantityFactorDetail1:{ location: estimateMainModule, identifier: 'quantityFactorDetail1', initial: 'QuantityFactorDetail1' },
				QuantityFactor1:{ location: estimateMainModule, identifier: 'quantityFactor1', initial: 'QuantityFactor1' },
				QuantityFactorDetail2:{ location: estimateMainModule, identifier: 'quantityFactorDetail2', initial: 'QuantityFactorDetail2' },
				QuantityFactor2:{ location: estimateMainModule, identifier: 'quantityFactor2', initial: 'QuantityFactor2' },
				QuantityFactor3:{ location: estimateMainModule, identifier: 'quantityFactor3', initial: 'QuantityFactor3' },
				QuantityFactor4:{ location: estimateMainModule, identifier: 'quantityFactor4', initial: 'QuantityFactor4' },
				QuantityFactorCc:{ location: estimateMainModule, identifier: 'quantityFactorCc', initial: 'QuantityFactorCc' },
				ProductivityFactorDetail:{ location: estimateMainModule, identifier: 'productivityFactorDetail', initial: 'ProductivityFactorDetail' },
				ProductivityFactor:{ location: estimateMainModule, identifier: 'productivityFactor', initial: 'ProductivityFactor' },
				QuantityReal:{ location: estimateMainModule, identifier: 'quantityReal', initial: 'QuantityReal' },
				QuantityInternal:{ location: estimateMainModule, identifier: 'quantityInternal', initial: 'QuantityInternal' },
				QuantityOriginal:{ location: estimateMainModule, identifier: 'quantityOriginal', initial: 'QuantityOriginal' },
				EfficiencyFactorDetail1:{ location: estimateMainModule, identifier: 'efficiencyFactorDetail1', initial: 'EfficiencyFactorDetail1' },
				EfficiencyFactor1:{ location: estimateMainModule, identifier: 'efficiencyFactor1', initial: 'EfficiencyFactor1' },
				EfficiencyFactorDetail2:{ location: estimateMainModule, identifier: 'efficiencyFactorDetail2', initial: 'EfficiencyFactorDetail2' },
				EfficiencyFactor2:{ location: estimateMainModule, identifier: 'efficiencyFactor2', initial: 'EfficiencyFactor2' },

				// costFactors
				CostFactorDetail1:{ location: estimateMainModule, identifier: 'costFactorDetail1', initial: 'CostFactorDetail1' },
				CostFactor1:{ location: estimateMainModule, identifier: 'costFactor1', initial: 'CostFactor1' },
				CostFactorDetail2:{ location: estimateMainModule, identifier: 'costFactorDetail2', initial: 'CostFactorDetail2' },
				CostFactor2:{ location: estimateMainModule, identifier: 'costFactor2', initial: 'CostFactor2' },
				CostFactorCc:{ location: estimateMainModule, identifier: 'costFactorCc', initial: 'CostFactorCc' },

				MdcControllingUnitFk:{ location: estimateMainModule, identifier: 'mdcControllingUnitFk', initial: 'Controlling Unit' },
				BoqRootRef: { location: estimateMainModule, identifier: 'boqRootRef', initial: 'BoQ Root Item Ref. No' },
				BoqHeaderFk:{ location: estimateMainModule, identifier: 'boqHeaderFk', initial: 'BoqHeader' },
				BoqItemFk:{ location: estimateMainModule, identifier: 'boqItemFk', initial: 'BoqItem'},
				PsdActivitySchedule:{ location: estimateMainModule, identifier: 'activitySchedule', initial: 'Activity Schedule' },
				PsdActivityFk:{ location: estimateMainModule, identifier: 'psdActivityFk', initial: 'PsdActivity' },
				LicCostGroup1Fk:{ location: estimateMainModule, identifier: 'licCostGroup1Fk', initial: 'LicCostGroup1' },
				LicCostGroup2Fk:{ location: estimateMainModule, identifier: 'licCostGroup2Fk', initial: 'LicCostGroup2' },
				LicCostGroup3Fk:{ location: estimateMainModule, identifier: 'licCostGroup3Fk', initial: 'LicCostGroup3' },
				LicCostGroup4Fk:{ location: estimateMainModule, identifier: 'licCostGroup4Fk', initial: 'LicCostGroup4' },
				LicCostGroup5Fk:{ location: estimateMainModule, identifier: 'licCostGroup5Fk', initial: 'LicCostGroup5' },

				PrjCostGroup1Fk:{ location: estimateMainModule, identifier: 'prjCostGroup1Fk', initial: 'PrjCostGroup1' },
				PrjCostGroup2Fk:{ location: estimateMainModule, identifier: 'prjCostGroup2Fk', initial: 'PrjCostGroup2' },
				PrjCostGroup3Fk:{ location: estimateMainModule, identifier: 'prjCostGroup3Fk', initial: 'PrjCostGroup3' },
				PrjCostGroup4Fk:{ location: estimateMainModule, identifier: 'prjCostGroup4Fk', initial: 'PrjCostGroup4' },
				PrjCostGroup5Fk:{ location: estimateMainModule, identifier: 'prjCostGroup5Fk', initial: 'PrjCostGroup5' },

				MdcWorkCategoryFk:{ location: estimateMainModule, identifier: 'mdcWorkCategoryFk', initial: 'MdcWorkCategory' },
				MdcAssetMasterFk:{ location: estimateMainModule, identifier: 'mdcAssetMasterFk', initial: 'MdcAssetMaster' },

				PrjLocationFk:{ location: estimateMainModule, identifier: 'prjLocationFk', initial: 'PrjLocation' },

				UserDefined1: { location: cloudCommonModule, identifier: 'entityUserDefined', param: { p_0: '1' }, initial: 'User Defined 1' },
				UserDefined2: { location: cloudCommonModule, identifier: 'entityUserDefined', param: { p_0: '2' }, initial: 'User Defined 2' },
				UserDefined3: { location: cloudCommonModule, identifier: 'entityUserDefined', param: { p_0: '3' }, initial: 'User Defined 3' },
				UserDefined4: { location: cloudCommonModule, identifier: 'entityUserDefined', param: { p_0: '4' }, initial: 'User Defined 4' },
				UserDefined5: { location: cloudCommonModule, identifier: 'entityUserDefined', param: { p_0: '5' }, initial: 'User Defined 5' },

				UserDefinedDate1: { location: cloudCommonModule, identifier: 'entityUserDefinedDate', param: { p_0: '1' }, initial: 'User Defined Date 1' },
				UserDefinedDate2: { location: cloudCommonModule, identifier: 'entityUserDefinedDate', param: { p_0: '2' }, initial: 'User Defined Date 2' },
				UserDefinedDate3: { location: cloudCommonModule, identifier: 'entityUserDefinedDate', param: { p_0: '3' }, initial: 'User Defined Date 3' },
				UserDefinedDate4: { location: cloudCommonModule, identifier: 'entityUserDefinedDate', param: { p_0: '4' }, initial: 'User Defined Date 4' },
				UserDefinedDate5: { location: cloudCommonModule, identifier: 'entityUserDefinedDate', param: { p_0: '5' }, initial: 'User Defined Date 5' },

				// flags
				IsLumpsum:{ location: estimateMainModule, identifier: 'isLumpSum', initial: 'IsLumpSum' },
				IsDisabled:{ location: estimateMainModule, identifier: 'isDisabled', initial: 'IsDisabled' },
				IsGc:{ location: estimateMainModule, identifier: 'isGc', initial: 'General Cost'},

				// costAndHours
				CostUnit:{ location: estimateMainModule, identifier: 'costUnit', initial: 'CostUnit' },
				CostUnitTarget:{ location: estimateMainModule, identifier: 'costUnitTarget', initial: 'CostUnitTarget' },
				CostTotal:{ location: estimateMainModule, identifier: 'costTotal', initial: 'CostTotal' },
				CostUnitSubItem:{ location: estimateMainModule, identifier: 'costUnitSubItem', initial: 'CostUnitSubItem' },
				CostUnitLineItem:{ location: estimateMainModule, identifier: 'costUnitLineItem', initial: 'CostUnitLineItem' },
				HoursUnitSubItem:{ location: estimateMainModule, identifier: 'hoursUnitSubItem', initial: 'HoursUnitSubItem' },
				HoursUnitLineItem:{ location: estimateMainModule, identifier: 'hoursUnitLineItem', initial: 'HoursUnitLineItem' },
				CostUnitOriginal:{ location: estimateMainModule, identifier: 'costUnitOriginal', initial: 'CostUnitOriginal' },
				HourFactor:{ location: estimateMainModule, identifier: 'hourFactor', initial: 'HourFactor' },
				HoursUnit:{ location: estimateMainModule, identifier: 'hoursUnit', initial: 'HoursUnit' },
				HoursUnitTarget:{ location: estimateMainModule, identifier: 'hoursUnitTarget', initial: 'HoursUnitTarget' },
				HoursTotal:{ location: estimateMainModule, identifier: 'hoursTotal', initial: 'HoursTotal' },

				EstCostRiskFk:{ location: estimateMainModule, identifier: 'estCostRiskFk', initial: 'estCostRisk' },
				EstHeaderFk:{ location: estimateMainModule, identifier: 'estHeaderFk', initial: 'EstHeader' },
				EstLineItemFk:{ location: estimateMainModule, identifier: 'estLineItemFk', initial: 'Line Item Ref.' },
				EstAssemblyFk:{ location: estimateMainModule, identifier: 'estAssemblyFk', initial: 'Assembly Template' },
				EstResourceFk:{ location: estimateMainModule, identifier: 'estResourceFk', initial: 'EstResource' },
				EstResourceTypeFk:{ location: estimateMainModule, identifier: 'estResourceTypeFk', initial: 'Resource Type' },
				EstResourceTypeFkExtend:{ location: estimateMainModule, identifier: 'estResourceTypeFk', initial: 'Resource Type' },
				MdcCostCodeFk:{ location: estimateMainModule, identifier: 'mdcCostCodeFk', initial: 'MdcCostCode' },
				MdcMaterialFk:{ location: estimateMainModule, identifier: 'mdcMaterialFk', initial: 'MdcMaterial' },
				PrcPackageFk:{ location: estimateMainModule, identifier: 'prcPackageFk', initial: 'PrcPackage' },
				PrcStructureFk:{ location: estimateMainModule, identifier: 'prcStructureFk', initial: 'PrcStructure' },

				EstQtyRelBoqFk:{ location: estimateMainModule, identifier: 'estQtyRelBoq', initial: 'Boq Qty Relation' },
				EstQtyRelActFk:{ location: estimateMainModule, identifier: 'estQtyRelAct', initial: 'Act Qty Relation' },
				EstQtyRelGtuFk:{ location: estimateMainModule, identifier: 'estQtyRelGtu', initial: 'Ctu Qty Relation' },
				EstQtyTelAotFk:{ location: estimateMainModule, identifier: 'estQtyRelAot', initial: 'Aot Qty Relation' },

				CosInstanceCode:{ location: estimateMainModule, identifier: 'cosInstanceCode', initial: 'COS Instance C' },
				CosInstanceDescription:{ location: estimateMainModule, identifier: 'cosInstanceDescription', initial: 'COS Instance Desc' },

				CosMasterHeaderCode:{ location: constructionSystemMainModule, identifier: 'masterHeaderCode', initial: 'Master Header Code' },
				CosMasterHeaderDescription:{ location: constructionSystemMainModule, identifier: 'masterHeaderDescription', initial: 'Master Header Description' },

				CommentText:{ location: estimateMainModule, identifier: 'comment', initial: 'Comment' },

				IsRate:{ location: estimateMainModule, identifier: 'isRate', initial: 'Fix' },
				IsLabour:{ location: estimateMainModule, identifier: 'isLabour', initial: 'Labour' },
				// TODO: PrjChangeFk : { location: estimateMainModule, identifier: 'prjChange', initial: 'Project Change'},

				MdlModelFk : { location: modelMainModule, identifier: 'entityModel', initial: 'Model'},
				MdlObjectFk : { location: modelMainModule, identifier: 'entityObject', initial: 'Object'},
				ContainerFk : { location: modelMainModule, identifier: 'entityContainer', initial: 'Container'},

				EntCostUnit:{ location: estimateMainModule, identifier: 'entCostUnit', initial: 'Ent CostUnit' },
				EntCostUnitTarget:{ location: estimateMainModule, identifier: 'entCostUnitTarget', initial: 'Ent CostUnitTarget' },
				EntCostTotal : { location: estimateMainModule, identifier: 'entCostTotal', initial: 'Ent CostTotal'},
				EntHoursUnit:{ location: estimateMainModule, identifier: 'entHoursUnit', initial: 'Ent HoursUnit' },
				EntHoursUnitTarget:{ location: estimateMainModule, identifier: 'entHoursUnitTarget', initial: 'EntHoursUnitTarget' },
				EntHoursTotal : { location: estimateMainModule, identifier: 'entHoursTotal', initial: 'EntHoursTotal'},

				DruCostUnit:{ location: estimateMainModule, identifier: 'druCostUnit', initial: 'Dru CostUnit' },
				DruCostUnitTarget:{ location: estimateMainModule, identifier: 'druCostUnitTarget', initial: 'Dru CostUnitTarget' },
				DruCostTotal : { location: estimateMainModule, identifier: 'druCostTotal', initial: 'Dru CostTotal'},
				DruHoursUnit:{ location: estimateMainModule, identifier: 'druHoursUnit', initial: 'Dru HoursUnit' },
				DruHoursUnitTarget:{ location: estimateMainModule, identifier: 'druHoursUnitTarget', initial: 'DruHoursUnitTarget' },
				DruHoursTotal : { location: estimateMainModule, identifier: 'druHoursTotal', initial: 'DruHoursTotal'},

				DirCostUnit:{ location: estimateMainModule, identifier: 'dirCostUnit', initial: 'Dir CostUnit' },
				DirCostUnitTarget:{ location: estimateMainModule, identifier: 'dirCostUnitTarget', initial: 'Dir CostUnitTarget' },
				DirCostTotal : { location: estimateMainModule, identifier: 'dirCostTotal', initial: 'Dir CostTotal'},
				DirHoursUnit:{ location: estimateMainModule, identifier: 'dirHoursUnit', initial: 'Dir HoursUnit' },
				DirHoursUnitTarget:{ location: estimateMainModule, identifier: 'dirHoursUnitTarget', initial: 'DirHoursUnitTarget' },
				DirHoursTotal : { location: estimateMainModule, identifier: 'dirHoursTotal', initial: 'DirHoursTotal'},

				IndCostUnit:{ location: estimateMainModule, identifier: 'indCostUnit', initial: 'Ind CostUnit' },
				IndCostUnitTarget:{ location: estimateMainModule, identifier: 'indCostUnitTarget', initial: 'Ind CostUnitTarget' },
				IndCostTotal : { location: estimateMainModule, identifier: 'indCostTotal', initial: 'Ind CostTotal'},
				IndHoursUnit:{ location: estimateMainModule, identifier: 'indHoursUnit', initial: 'Ind HoursUnit' },
				IndHoursUnitTarget:{ location: estimateMainModule, identifier: 'indHoursUnitTarget', initial: 'IndHoursUnitTarget' },
				IndHoursTotal : { location: estimateMainModule, identifier: 'indHoursTotal', initial: 'IndHoursTotal'},

				RuleType:{ location: estimateMainModule, identifier: 'type', initial: 'Type' },
				RuleCode:{ location: estimateMainModule, identifier: 'ruleCode', initial: 'Rule Code' },
				RuleDescription : { location: estimateMainModule, identifier: 'ruleDesc', initial: 'Rule Description'},
				EvalSequenceFk:{location: estimateRuleModule, identifier: 'evaluationSequence', initial: 'Evaluation Sequence'},
				ElementCode:{ location: estimateMainModule, identifier: 'elemCode', initial: 'Element Code' },
				ElementDescription : { location: estimateMainModule, identifier: 'elemDesc', initial: 'Element Description'},

				IsIndirectCost :{location: estimateMainModule, identifier : 'isIndirectCost', initial:'Indirect Cost'},
				Sorting :{location: cloudCommonModule, identifier: 'entitySorting', initial: 'Sorting'},
				EstTypeFk :{location: estimateMainModule, identifier: 'estType', initial: 'Estimate Type'},
				EstStatusFk: {location: cloudCommonModule, identifier: 'entityStatus', initial: 'Status'},
				FromDate :{location: estimateMainModule, identifier: 'fromDate', initial: 'From Date'},
				ToDate :{location: estimateMainModule, identifier: 'toDate', initial: 'To Date'},

				// resource summary
				EstimatePrice:{ location: estimateMainModule, identifier: 'estimatePrice', initial: 'Estimate Price' },
				AdjustPrice:{ location: estimateMainModule, identifier: 'adjustPrice', initial: 'Adjust Price' },
				QuantitySummary:{ location: estimateMainModule, identifier: 'quantitySummary', initial: 'Quantity Summary' },
				CostSummary:{ location: estimateMainModule, identifier: 'costSummary', initial: 'Cost Summary' },
				AdjQuantitySummary:{ location: estimateMainModule, identifier: 'adjQuantitySummary', initial: 'Adjust Quantity Summary' },
				AdjCostSummary:{ location: estimateMainModule, identifier: 'adjCostSummary', initial: 'Adjust Cost Summary' },
				EstimateCostUnit:{ location: estimateMainModule, identifier: 'estimateCostUnit', initial: 'Estimate Cost/unit' },
				AdjustCostUnit:{ location: estimateMainModule, identifier: 'adjustCostUnit', initial: 'Adjust Cost/unit' },
				DescriptionInfo1:{ location: estimateMainModule, identifier: 'descriptionInfo1', initial: 'Additional Description' },
				DetailsStack:{ location: estimateMainModule, identifier: 'detailsStack', initial: 'Details Stack' },
				// LineItemCode:{ location: estimateMainModule, identifier: 'lineItemCode', initial: 'Line Item Code' },
				LineItemDescriptionInfo:{ location: estimateMainModule, identifier: 'lineItemDes', initial: 'Line Item Description' },
				AssemblyCode:{ location: estimateMainModule, identifier: 'assemblyTemplateCode', initial: 'Assembly Template Code' },
				AssemblyDescriptionInfo:{ location: estimateMainModule, identifier: 'assemblyTemplateDes', initial: 'Assembly Template Description' },

				// below taken for estimate.resource too
				references : {location: estimateMainModule, identifier: 'references', initial: 'References' },
				ruleAndParam : {location: estimateMainModule, identifier: 'ruleAndParam', initial: 'Rule/Parameter' },
				itemQuantity : {location: estimateMainModule, identifier: 'itemQuantity', initial: 'Item Quantity' },
				quantityRelation : {location: estimateMainModule, identifier: 'quantityRelation', initial: 'Quantity Relation' },
				quantiyAndFactors : {location: estimateMainModule, identifier: 'quantityAndFactors', initial: 'Quantiy/Factors' },
				costFactors : {location: estimateMainModule, identifier: 'costFactors', initial: 'Cost Factors' },
				costAndHours : {location: estimateMainModule, identifier: 'costAndHours', initial: 'Cost/Hours' },
				directIndCost : {location: estimateMainModule, identifier: 'directIndCost', initial: 'Direct/Indirect Cost' },
				flags : {location: estimateMainModule, identifier: 'flags', initial: 'Flags' },
				assignments : {location: estimateMainModule, identifier: 'assignments', initial: 'Assignments' },
				sortCodes : {location: estimateMainModule, identifier: 'sortCodes', initial: 'Sort Codes' },
				packageAndCos : {location: estimateMainModule, identifier: 'packageAndCos', initial: 'Package/COS' },
				duration : {location: estimateMainModule, identifier: 'duration', initial: 'Duration' },
				ruleInfo:{location: estimateMainModule, identifier: 'ruleInfo', initial: 'Rules' },
				package:{location: cloudCommonModule, identifier: 'entityPackage', initial: 'Package' },
				comment :{ location: estimateMainModule, identifier: 'comment', initial: 'Comment' },

				CosMatchText: { location: estimateMainModule, identifier: 'cosMatchText', initial: 'COS Match Text'},
				EstCostTypeFk: { location: basicsCostCodesModule, identifier: 'costType', initial: 'Cost Type' },
				QuantityTypeFk: { location: estimateMainModule, identifier: 'quantityType', initial: 'Quantity Type'},
				EstResourceFlagFk: { location: estimateMainModule, identifier: 'resourceFlag', initial: 'Resource Flag'},
				Date: { location: estimateMainModule, identifier: 'date', initial: 'Date'},
				PrjCharacter : {location: boqMainModule, identifier: 'PrjCharacter', initial: 'Project Characteristic' },
				WorkContent : {location: boqMainModule, identifier: 'WorkContent', initial: 'Work Content' },
				BoqItemFlagFk:{location: estimateMainModule, identifier: 'boqItemFlagFk', initial: 'BoQ Item Flag'},
				Hint:{location: estimateMainModule, identifier: 'hint', initial: 'Copy Source'},
				Budget:{location: estimateMainModule, identifier: 'budget', initial: 'Budget'},
				IsNoMarkup:{location: estimateMainModule, identifier: 'isNoMarkup', initial: 'No Markup'},
				IsDisabledPrc:{location: estimateMainModule, identifier: 'isDisabledPrc', initial: 'Disabled Prc'},
				IsGeneratedPrc:{location: estimateMainModule, identifier: 'isGeneratedPrc', initial: 'Generated Prc'},
				BudgetUnit:{location: estimateMainModule, identifier: 'budgetUnit', initial: 'Budget/Unit'},
				IsFixedBudget:{location: estimateMainModule, identifier: 'isFixedBudget', initial: 'Fix Budget'},
				BudgetDifference:{location: estimateMainModule, identifier: 'budgetDiff', initial: 'Budget Difference'},
				Checked:{location: estimateMainModule, identifier: 'checked', initial: 'Checked'},
				Color:{location: estimateMainModule, identifier: 'color', initial: 'Color'},
				IsOptional:{location: estimateMainModule, identifier: 'estIsOptional', initial: 'Optional'},
				IsExecute:{location: estimateMainModule, identifier: 'lineItemSelStatement.isExecute', initial: 'Select'},
				WicCatFk:{location: estimateMainModule, identifier: 'wicCatFk', initial: 'WIC Group Ref.No.'},
				LoggingMessage:{location: estimateMainModule, identifier: 'loggingMessage', initial: 'Last Execution History'},
				UnitRateStrQty:{location: estimateMainModule, identifier: 'unitRateStrQty', initial: 'Unit Rate/Structure Quantity'},
				StructureQty:{location: estimateMainModule, identifier: 'structureQty', initial: 'Structure Quantity'},
				StructureUom:{location: estimateMainModule, identifier: 'structureUom', initial: 'Structure UoM'},
				SelectStatement: {location: estimateMainModule, identifier: 'lineItemSelStatement.selectStatement', initial: 'Select Statement'},
				WicItemFk: {location: estimateMainModule, identifier: 'lineItemSelStatement.wicItemRefNo', initial: 'WIC Item Ref. No.'},
				WicHeaderItemFk :{ location: estimateMainModule, identifier: 'wicBoqHeaderFk', initial: 'WIC BoQ -Root Item ref.No'},
				BoqLineTypeFk: { location: boqMainModule, identifier: 'BoqLineTypeFk', initial: 'BoQ Line Type' },
				BoqItemReferenceFk: { location: boqMainModule, identifier: 'BoqItemReferenceFk', initial: 'Reference to' },
				BoqItemReferenceDescription: { location: boqMainModule, identifier: 'BoqItemReferenceDescription', initial: 'Reference to Description' },
				BoqItemReferenceDesignDescription: { location: boqMainModule, identifier: 'BoqItemReferenceDesignDescription', initial: 'Reference to Design Description' },
				PrcItemEvaluationFk: { location: boqMainModule, identifier: 'PrcItemEvaluationFk', initial: 'Procurement Item Evaluation' },
				PrcStructureDescription: { location: boqMainModule, identifier: 'PrcStructureDescription', initial: 'Procurement Structure Description' },
				MdcTaxCodeFk: { location: cloudCommonModule, identifier: 'entityTaxCode', initial: 'Tax Code' },
				TaxCodeDescription: { location: cloudCommonModule, identifier: 'entityTaxCodeDescription', initial: 'Tax Code Description' },
				BpdAgreementFk: { location: boqMainModule, identifier: 'BpdAgreementFk', initial: 'Agreement' },
				BasItemTypeFk: { location: boqMainModule, identifier: 'BasItemTypeFk', initial: 'Item Type Stand/Opt' },
				BasItemType2Fk: { location: boqMainModule, identifier: 'BasItemType2Fk', initial: 'Item Type Base/Alt' },
				ControllingUnitDescription: { location: cloudCommonModule, identifier: 'entityControllingUnitDesc', initial: 'Controlling Unit Description' },
				LicCostGroup1Description: { location: boqMainModule, identifier: 'costGroup1Description', initial: 'Cost Group 1 Description' },
				LicCostGroup2Description: { location: boqMainModule, identifier: 'costGroup2Description', initial: 'Cost Group 2 Description' },
				LicCostGroup3Description: { location: boqMainModule, identifier: 'costGroup3Description', initial: 'Cost Group 3 Description' },
				LicCostGroup4Description: { location: boqMainModule, identifier: 'costGroup4Description', initial: 'Cost Group 4 Description' },
				LicCostGroup5Description: { location: boqMainModule, identifier: 'costGroup5Description', initial: 'Cost Group 5 Description' },
				PrjCostGroup1Description: { location: estimateMainModule, identifier: 'prjCostGroup1Description', initial: 'Project Cost Group 1 Description' },
				PrjCostGroup2Description: { location: estimateMainModule, identifier: 'prjCostGroup2Description', initial: 'Project Cost Group 2 Description' },
				PrjCostGroup3Description: { location: estimateMainModule, identifier: 'prjCostGroup3Description', initial: 'Project Cost Group 3 Description' },
				PrjCostGroup4Description: { location: estimateMainModule, identifier: 'prjCostGroup4Description', initial: 'Project Cost Group 4 Description' },
				PrjCostGroup5Description: { location: estimateMainModule, identifier: 'prjCostGroup5Description', initial: 'Project Cost Group 5 Description' },

				// spec property
				PrcPackage2HeaderFk:{ location: estimateMainModule, identifier: 'prcPackage2HeaderFk', initial: 'PrcPackage2HeaderFk' },
				// TODO: PrjChangeStatusFk : { location: estimateMainModule, identifier: 'prjChangeStatus', initial: 'Project Change Status'},

				IsActive: {location: projectMainModule, identifier: 'entityIsActive', initial: 'Is Active'},
				LgmJobFk: {location: estimateProjectModule, identifier: 'lgmJobFk', initial: 'Job'},
				IsControlling: {location: estimateProjectModule, identifier: 'isControlling', initial: 'Is Controlling'},
				AdvancedAllowance :{location: estimateMainModule, identifier : 'advancedAllowance', initial:'Advanced Allowance'},

				SortCode01Fk: { location: projectStructuresModule, identifier: 'sortCode01', initial: 'Sort Code 1'},
				SortCode02Fk: { location: projectStructuresModule, identifier: 'sortCode02', initial: 'Sort Code 2'},
				SortCode03Fk: { location: projectStructuresModule, identifier: 'sortCode03', initial: 'Sort Code 3'},
				SortCode04Fk: { location: projectStructuresModule, identifier: 'sortCode04', initial: 'Sort Code 4'},
				SortCode05Fk: { location: projectStructuresModule, identifier: 'sortCode05', initial: 'Sort Code 5'},
				SortCode06Fk: { location: projectStructuresModule, identifier: 'sortCode06', initial: 'Sort Code 6'},
				SortCode07Fk: { location: projectStructuresModule, identifier: 'sortCode07', initial: 'Sort Code 7'},
				SortCode08Fk: { location: projectStructuresModule, identifier: 'sortCode08', initial: 'Sort Code 8'},
				SortCode09Fk: { location: projectStructuresModule, identifier: 'sortCode09', initial: 'Sort Code 9'},
				SortCode10Fk: { location: projectStructuresModule, identifier: 'sortCode10', initial: 'Sort Code 10'},

				EndDate:{location: companyModule, identifier: 'entityEndDate', initial: 'Period End Date'},
				PercentOfTime: {location: basicsCommonModule, identifier: 'percentOfTime', initial: 'Percent Of Time'},
				PercentOfCost: {location: basicsCommonModule, identifier: 'percentOfCost', initial: 'Percent Of Cost'},
				CalcCumCost: {location: basicsCommonModule, identifier: 'calcCumCost', initial: 'Calculated Cumulative Cost'},
				CalcPeriodCost: {location: basicsCommonModule, identifier: 'calcPeriodCost', initial: 'Calculated Period Cost'},
				CalcCumCash: {location: basicsCommonModule, identifier: 'calcCumCash', initial: 'Calculated Cumulative Cash'},
				CalcPeriodCash: {location: basicsCommonModule, identifier: 'calcPeriodCash', initial: 'Calculated Period Cash'},
				CumCost: {location: basicsCommonModule, identifier: 'cumCost', initial: 'Cumulative Cost'},
				PeriodCost: {location: basicsCommonModule, identifier: 'periodCost', initial: 'Period Cost'},
				CumCash: {location: basicsCommonModule, identifier: 'cumCash', initial: 'Cumulative Cash'},
				PeriodCash: {location: basicsCommonModule, identifier: 'periodCash', initial: 'Period Cash'},
				ActPeriodCost: {location: basicsCommonModule, identifier: 'actPeriodCost', initial: 'Actual Period Cost'},
				ActPeriodCash: {location: basicsCommonModule, identifier: 'actPeriodCash', initial: 'Actual Period Cash'},
				TotalLeadTime: {location: procurementCommonModule, identifier: 'totalLeadTime', initial: 'Total Lead Time'},
				AddressEntity: {location: cloudCommonModule, identifier: 'entityDeliveryAddress', initial: 'entityDeliveryAddress'},
				PrcItemMaterialCode: {location: procurementCommonModule, identifier: 'prcItemMaterialNo', initial: 'Material No.'},
				PrcItemDescription1: {location: procurementCommonModule, identifier: 'prcItemDescription1', initial: 'Description 1'},
				PrcItemFk: {location: procurementCommonModule, identifier: 'prcItemMaterial', initial: 'Material'},
				PrcItemDescription: {location: procurementCommonModule, identifier: 'prcItemDescription', initial: 'Item Description'},
				LineItemCode: {
					location: procurementPackageModule, identifier: 'itemAssignment.lineItemCode', initial: 'Line Item Code'
				},
				LineItemDescription: {
					location: procurementPackageModule, identifier: 'itemAssignment.lineItemDescription', initial: 'Line Item Description'
				},
				BoqHeaderReference: {
					location: estimateMainModule, identifier: 'boqRootRef', initial: 'BoQ-Root Item Ref.No'
				},
				StatusOfLineItemAssignedToPackage: {
					location: procurementPackageModule, identifier: 'generated', initial: 'Generated'
				},
				BoqItemReference: {location: estimateMainModule, identifier: 'boqItemFk', initial: 'BoQ-Item Ref.No'},
				Brief: {location: cloudCommonModule, identifier: 'entityBrief', initial: 'Brief'},
				PriceMaterial: {location: procurementCommonModule, identifier: 'entityMaterialPrice', initial: 'Material Price'},
				QuantityMaterial: {location: procurementCommonModule, identifier: 'entityMaterialQuantity', initial: 'Material Quantity'},
				DateEffective:{location: basicsCommonModule, identifier: 'dateEffective', initial: 'Date Effective'},
				BpdVatGroupFk: {location: procurementCommonModule, identifier: 'entityVatGroup', initial: 'Vat Group'},
				LiPreviousQuantity: {location: salesBillingModule, identifier: 'LiPreviousQuantity', initial: 'Previous Quantity'},
				LiQuantity: {location: salesBillingModule, identifier: 'LiQuantity', initial: 'Installed Quantity'},
				LiBilledQuantity: {location: salesBillingModule, identifier: 'LiBilledQuantity', initial: 'Billed Quantity'},
				LiTotalQuantity: {location: salesBillingModule, identifier: 'LiTotalQuantity', initial: 'Total Quantity'},
				LiPercentageQuantity: {location: salesBillingModule, identifier: 'LiPercentageQuantity', initial: 'Percentage Quantity'},
				LiCumulativePercentage: {location: salesBillingModule, identifier: 'LiCumulativePercentage', initial: 'Cumulative Percentage'},
				IsDiverseDebitorsAllowed: {location: salesBillingModule, identifier: 'DiverseDebitorsAllowed', initial: 'DivDeb'},
				IsContractRelated: {location: salesBillingModule, identifier: 'IsContractRelated', initial: 'ICS'},
				LineReference: {location: prcInvoiceModName, identifier: 'entityLineReference', initial: 'Line Reference'}
			}
		}
	};

	/**
	 * @ngdoc service
	 * @name salesBillingTranslationService
	 * @description provides translation for sales billing module
	 */
	angular.module(salesBillingModule).service('salesBillingTranslationService', ['platformUIBaseTranslationService', 'salesBillingTranslations', 'salesCommonTranslations',
		'salesBillingSchemaTranslations', 'salesWipTranslations', 'businesspartnerCertificateToSalesLayout',
		function (platformUIBaseTranslationService, salesBillingTranslations, salesCommonTranslations, salesBillingSchemaTranslations, salesWipTranslations, businesspartnerCertificateToSalesLayout) {
			var localBuffer = {};
			var translationService = {
				// overloading
				getTranslationInformation: function getTranslationInformation(key) {
					var information = translationService.words[key];
					if (angular.isUndefined(information) || (information === null)) {
						// Remove prefix from key that's supposed to be separated by a dot and check again.
						key = key.substring(key.indexOf('.') + 1);
						information = translationService.words[key];
					}
					return information;
				}
			};

			platformUIBaseTranslationService.call(this, [salesCommonTranslations, salesBillingTranslations, salesBillingSchemaTranslations, salesWipTranslations,
				businesspartnerCertificateToSalesLayout, estimateMainTranslations], localBuffer);
		}

	]);

})();
