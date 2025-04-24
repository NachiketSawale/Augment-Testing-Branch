/**
 * Created by janas on 12.11.2014.
 */

(function (angular) {


	'use strict';

	var moduleName = 'controlling.structure';
	var basicsCustomizeModuleName = 'basics.customize';
	var cloudCommonModule = 'cloud.common';
	var basicsCommonModule = 'basics.common';
	var basicsClerkModule = 'basics.clerk';
	var prcCommonModule = 'procurement.common';
	var procurementContractModule = 'procurement.contract';
	var procurementPesModuleName = 'procurement.pes';
	var controllingActualsModuleName = 'controlling.actuals';
	var basicsCompanyModule = 'basics.company';

	/**
	 * @ngdoc service
	 * @name controllingStructureTranslationService
	 * @description provides translation for controlling structure module
	 */
	angular.module(moduleName).service('controllingStructureTranslationService', ['platformUIBaseTranslationService','controllingStructureLineItemLayout',
		function (platformUIBaseTranslationService,controllingStructureLineItemLayout) {

			var controllingStructureTranslations = {
				translationInfos: {
					'extraModules': [moduleName, basicsCustomizeModuleName, cloudCommonModule, basicsCommonModule, basicsClerkModule, prcCommonModule, procurementContractModule, procurementPesModuleName, controllingActualsModuleName, basicsCompanyModule],
					'extraWords': {
						ContrFormulaPropDefFk: { location: moduleName, identifier: 'contrFormulaPropDefFk', initial: 'Costs at Completion' },
						baseGroup: {location: cloudCommonModule, identifier: 'entityProperties', initial: 'Basic Data'},
						userDefTextGroup: { location: cloudCommonModule, identifier: 'UserdefTexts', initial: 'Userdefined Texts' },
						ControllingCatFk: {location: moduleName, identifier: 'entityControllingCatFk', initial: 'Category'},
						ControllingunitstatusFk: {location: moduleName, identifier: 'entityControllingUnitStatusFk', initial: 'Status'},
						Quantity:{ location: cloudCommonModule, identifier: 'entityQuantity', initial: 'Quantity' },
						UomFk: { location: cloudCommonModule, identifier: 'entityUoM', initial: 'UoM' },
						StockFk: { location: cloudCommonModule, identifier: 'entityStock', initial: 'Stock' },
						CompanyFk: {location: cloudCommonModule, identifier: 'entityCompany', initial: 'Company'},
						CompanyResponsibleFk: {location: moduleName, identifier: 'entityCompanyResponsible', initial: 'Profit Center'},
						EtmPlantFk: { location: cloudCommonModule, identifier: 'entityPlant', initial: 'Plant' },
						IsBillingElement: {location: moduleName, identifier: 'entityIsBilling', initial: 'Is Billing'},
						IsAccountingElement: {location: moduleName, identifier: 'entityIsAccounting', initial: 'Is Accounting'},
						IsTimekeepingElement: {location: moduleName, identifier: 'entityIsTimekeeping', initial: 'For Timekeeping'},
						IsPlanningElement: {location: moduleName, identifier: 'entityIsPlanning', initial: 'Is Planning'},
						IsAssetmanagement: {location: moduleName, identifier: 'entityIsAssetmanagement', initial: 'Is Assetmanagement'},
						IsStockmanagement: {location: moduleName, identifier: 'entityIsStockmanagement', initial: 'Is Stockmanagement'},
						IsPlantmanagement: {location: moduleName, identifier: 'entityIsPlantmanagement', initial: 'Is Plantmanagement'},
						PlannedStart: {location: moduleName, identifier: 'entityPlannedStart', initial: 'Planned Start'},
						PlannedEnd: {location: moduleName, identifier: 'entityPlannedEnd', initial: 'Planned End'},
						PlannedDuration: {location: moduleName, identifier: 'entityPlannedDuration', initial: 'Planned Duration'},
						CommentText: {location: cloudCommonModule, identifier: 'entityCommentText', initial: 'Comment Text'},
						ControllinggroupFk: {location: moduleName, identifier: 'entityControllinggroupFk', initial: 'Controlling Group'},
						ControllinggroupdetailFk: {location: moduleName, identifier: 'entityControllinggroupdetailFk', initial: 'Group Detail'},
						/* jshint -W106 */ // Variable name is according usage in translation json
						assignments: { location: moduleName, identifier: 'entityAssignments', initial: 'Assignment' },
						Assignment01: { location: moduleName, identifier: 'entityAssignment', param: { p_0: '01' }, initial: 'Assignment 01' },
						Assignment02: { location: moduleName, identifier: 'entityAssignment', param: { p_0: '02' }, initial: 'Assignment 02' },
						Assignment03: { location: moduleName, identifier: 'entityAssignment', param: { p_0: '03' }, initial: 'Assignment 03' },
						Assignment04: { location: moduleName, identifier: 'entityAssignment', param: { p_0: '04' }, initial: 'Assignment 04' },
						Assignment05: { location: moduleName, identifier: 'entityAssignment', param: { p_0: '05' }, initial: 'Assignment 05' },
						Assignment06: { location: moduleName, identifier: 'entityAssignment', param: { p_0: '06' }, initial: 'Assignment 06' },
						Assignment07: { location: moduleName, identifier: 'entityAssignment', param: { p_0: '07' }, initial: 'Assignment 07' },
						Assignment08: { location: moduleName, identifier: 'entityAssignment', param: { p_0: '08' }, initial: 'Assignment 08' },
						Assignment09: { location: moduleName, identifier: 'entityAssignment', param: { p_0: '09' }, initial: 'Assignment 09' },
						Assignment10: { location: moduleName, identifier: 'entityAssignment', param: { p_0: '10' }, initial: 'Assignment 10' },
						UserDefined1: { location: cloudCommonModule, identifier: 'entityUserDefined', param: { p_0: '1' }, initial: 'User Defined 1' },
						UserDefined2: { location: cloudCommonModule, identifier: 'entityUserDefined', param: { p_0: '2' }, initial: 'User Defined 2' },
						UserDefined3: { location: cloudCommonModule, identifier: 'entityUserDefined', param: { p_0: '3' }, initial: 'User Defined 3' },
						UserDefined4: { location: cloudCommonModule, identifier: 'entityUserDefined', param: { p_0: '4' }, initial: 'User Defined 4' },
						UserDefined5: { location: cloudCommonModule, identifier: 'entityUserDefined', param: { p_0: '5' }, initial: 'User Defined 5' },
						Budget:{location: moduleName, identifier: 'budget', initial: 'Budget'},
						IsFixedBudget:{location: moduleName, identifier: 'isFixedBudget', initial: 'Fix Budget'},
						IsDefault:{location: moduleName, identifier: 'isDefault', initial: 'Is Default'},
						IsIntercompany:{location: moduleName, identifier: 'isIntercompany', initial: 'Intercompany'},
						BudgetDifference:{location: moduleName, identifier: 'budgetDiff', initial: 'Budget Difference'},
						BudgetCostDiff:{location: moduleName, identifier: 'budgetCostDiff', initial: 'Budget Difference'},
						EstimateCost:{location: moduleName, identifier: 'estCost', initial: 'Estimate Cost'},
						RibCompanyId:{location: moduleName, identifier: 'ribCompanyId', initial: 'Company'},
						RibPrjVersion:{location: moduleName, identifier: 'ribPrjVersion', initial: 'Project Version'},
						RibHistoryId:{location: moduleName, identifier: 'ribHistoryId', initial: 'History Version'},
						HistoryDescription:{location: moduleName, identifier: 'historyDescription', initial: 'Description'},
						HistoryRemark:{location: moduleName, identifier: 'historyRemark', initial: 'Remark'},
						ReportLog:{location: moduleName, identifier: 'reportLog', initial: 'Report Log'},
						HeaderId:{location: cloudCommonModule, identifier: 'entityCode', initial: 'Code'},
						HeaderCode:{location: cloudCommonModule, identifier: 'entityCode', initial: 'Code'},
						HeaderDescription:{location: cloudCommonModule, identifier: 'entityDescription', initial: 'Description'},
						ControllingUnitCode:{location: moduleName, identifier: 'controllingUnitCode', initial: 'Controlling Unit Code'},
						ControllingUnitDescription:{location: moduleName, identifier: 'controllingUnitDescription', initial: 'Controlling Unit Description'},
						ContrCostCodeCode:{location: moduleName, identifier: 'contrCostCodeCode', initial: 'Controlling Cost Code'},
						ContrCostCodeDescription:{location: moduleName, identifier: 'contrCostCodeDescription', initial: 'Controlling Cost Code Description'},
						HeaderTotal:{location: moduleName, identifier: 'headerTotal', initial: 'Header Total'},
						ItemFilteredTotal:{location: moduleName, identifier: 'itemFilteredTotal', initial: 'Item Filtered Total'},
						StatusFk:{location: cloudCommonModule, identifier: 'entityStatus', initial: 'Status'},
						BusinessPartnerFk:{location: cloudCommonModule, identifier: 'entityBusinessPartner', initial: 'Business Partner'},
						HistoryDate :{location: moduleName, identifier: 'historydate', initial: 'Date'},
						'DateOrdered': {
							'location': procurementContractModule,
							'identifier': 'ConHeaderDateOrdered',
							'initial': 'ConHeaderDateOrdered'
						},
						'DateReported': {
							'location': procurementContractModule,
							'identifier': 'ConHeaderDateReported',
							'initial': 'ConHeaderDateReported'
						},
						'DateCanceled': {
							'location': procurementContractModule,
							'identifier': 'ConHeaderDateCancelled',
							'initial': 'ConHeaderDateCancelled'
						},
						'DateDelivery': {
							'location': procurementContractModule,
							'identifier': 'ConHeaderDateDelivery',
							'initial': 'ConHeaderDateDelivery'
						},
						'DateCallofffrom': {
							'location': procurementContractModule,
							'identifier': 'ConHeaderDateCallOffFrom',
							'initial': 'ConHeaderDateCallOffFrom'
						},
						'DateCalloffto': {
							'location': procurementContractModule,
							'identifier': 'ConHeaderDateCallOffTo',
							'initial': 'ConHeaderDateCallOffTo'
						},
						'ConfirmationDate': {
							'location': procurementContractModule,
							'identifier': 'confirmationDate',
							'initial': 'confirmationDate'
						},
						'DatePenalty': {
							'location': procurementContractModule,
							'identifier': 'entityDatePenalty',
							'initial': 'Date Penalty'
						},
						'DateEffective': {
							'location': basicsCommonModule,
							'identifier': 'dateEffective',
							'initial': 'Date Effective'
						},
						'ExecutionStart': {
							location: procurementContractModule,
							identifier: 'entityExecutionStart',
							initial: 'Bank'
						},
						'ExecutionEnd': {
							location: procurementContractModule,
							identifier: 'entityExecutionEnd',
							initial: 'Bank'
						},
						'ValidFrom': {location: prcCommonModule, identifier: 'entityValidFrom', initial: 'Valid From'},
						'ValidTo': {location: prcCommonModule, identifier: 'entityValidTo', initial: 'Valid To'},
						DocumentDate: {
							location: procurementPesModuleName,
							identifier: 'entityDocumentDate',
							initial: 'Document Date'
						},
						DateDeliveredFrom: {
							location: procurementPesModuleName,
							identifier: 'entityDateDeliveredFrom',
							initial: 'Date Delivered From'
						},
						DateDelivered: {
							location: procurementPesModuleName,
							identifier: 'entityDateDelivered',
							initial: 'Date Delivered'
						},
						CompanyCostHeaderFk: {location: controllingActualsModuleName, identifier: 'companyCostHeaderFk', initial: 'Company Cost Header'},
						CompanyYearFk: {location: controllingActualsModuleName, identifier:'entityCompanyYearServiceFk',initial:'Company Year Service'},
						CompanyYearFkStartDate: {location: controllingActualsModuleName, identifier:'entityCompanyYearServiceFkStartDate',initial:'Company Year Service Start Date'},
						CompanyYearFkEndDate: {location: controllingActualsModuleName, identifier:'entityCompanyYearServiceFkEndDate',initial:'Company Year Service End Date'},
						CompanyPeriodFk: {location: controllingActualsModuleName, identifier: 'entityCompanyTradingPeriodFk', initial: 'Trading Period'},
						CompanyPeriodFkStartDate: {location: controllingActualsModuleName, identifier:'entityCompanyTradingPeriodFkStartDate',initial:'Trading Period Start Date'},
						CompanyPeriodFkEndDate: {location: controllingActualsModuleName, identifier:'entityCompanyTradingPeriodFkEndDate',initial:'Trading Period End Date'},
						StartDate: {location:controllingActualsModuleName, identifier:'entityStartDate', initial: 'Start Date'},
						EndDate: {location:controllingActualsModuleName, identifier:'entityEndDate', initial: 'End Date'},
						ValueTypeFk: {location: controllingActualsModuleName, identifier: 'entityValueTypeFk', initial: 'Value Type'},
						HasCostCode:{location: controllingActualsModuleName, identifier: 'entityHasCostCode', initial: 'Has Cost Code'},
						HasContCostCode: {location: controllingActualsModuleName, identifier: 'entityHasControllingCostCode', initial: 'Has Controlling Cost Code'},
						HasAccount: {location: controllingActualsModuleName, identifier: 'entityHasAccount', initial: 'Has Account'},
						MdcControllingUnitFk:{location: controllingActualsModuleName, identifier: 'entityControllingUnitFk', initial: 'Controlling Unit'},
						MdcCostCodeFk: {location: controllingActualsModuleName, identifier: 'entityCostCodeFk', initial: 'Cost Code'},
						MdcContrCostCodeFk: {location: controllingActualsModuleName, identifier: 'entityControllingCodeFk', initial: 'Controlling Cost Code'},
						AccountFk: {location: controllingActualsModuleName, identifier: 'entityAccountFk', initial: 'Account'},
						Amount: {location: controllingActualsModuleName, identifier: 'entityAmount', initial: 'Amount'},
						CurrencyFk: {location: basicsCompanyModule, identifier: 'entityCurrencyFk', initial: 'Currency'},
						AmountOc: {location: controllingActualsModuleName, identifier: 'entityAmountOc', initial: 'Amount OC'},
						ProjectFk: {location: controllingActualsModuleName, identifier: 'entityProjectFk', initial: 'Project'},
						Total: {location: controllingActualsModuleName, identifier: 'entityTotal', initial: 'Total'},
						TotalOc: {location: controllingActualsModuleName, identifier: 'entityTotalOc', initial: 'Total Oc'},
						NominalDimension1: {location: controllingActualsModuleName, identifier: 'nominalDimension1', initial: 'Nominal Dimension 1'},
						NominalDimension2: {location: controllingActualsModuleName, identifier: 'nominalDimension2', initial: 'Nominal Dimension 2'},
						NominalDimension3: {location: controllingActualsModuleName, identifier: 'nominalDimension3', initial: 'Nominal Dimension 3'},
						IsFinal: {location: controllingActualsModuleName, identifier: 'isFinal', initial: 'Is Final'},
						ClerkFk: {location: basicsClerkModule, identifier: 'entityClerk', initial: 'Clerk'}
					}
				}
			};
			var localBuffer = {};
			platformUIBaseTranslationService.call(this, [controllingStructureTranslations,controllingStructureLineItemLayout], localBuffer);
		}
	]);
})(angular);
