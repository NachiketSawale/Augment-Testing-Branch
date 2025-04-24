/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name estimateMainLineItemHighlightColumnService
	 * @function
	 * @description
	 * Main service for Confidence Check container > Estimate LineItem Columns for Highlighting color
	 */

	let moduleName = 'estimate.main';
	let serviceName = 'estimateMainLineItemHighlightColumnService';

	angular.module(moduleName).factory('estimateMainLineItemHighlightColumnService', [
		function () {
			//EstimateConfidence = 10001, Costing = 10002, Budgeting = 10003, Packages = 10004, Pricing = 10005,
			//MetadataAssociation = 10006, ProjectChanges = 10023,
			const parentColumnIds = [10001, 10002, 10003, 10004, 10005, 10006, 10023];

			function getSubColumnIds (parentColumnId){
				let columnList = [];
				//IsGcFalse = 10007, IsGcTrue = 10008, GrandTotal = 10009, IsLumpsum = 100010, IsNoEscalation = 10011, IsDisabled = 10012
				let costingGroup = [10007, 10008, 10009, 10010, 10011, 10012];
				//IsFixedBudget = 10013, Budget = 10014, TotalBudget = 10033,
				let budgetingGroup = [10013, 10014, 10033];
				//PrcServicePackageFk = 10015, PrcMaterialPackageFk = 10022, PrcPackageGeneratedPrc = 10032 /*package create but price not updated*/
				let packagesGroup = [10015, 10022, 10032 ];
				//IsIncluded = 10016, IsFixedPrice = 10017,	IsNoMarkup = 10018,
				let pricingGroup = [10016, 10017, 10018];
				//BoqItemFk = 10019,	PsdActivityFk = 10020, MdcControllingUnitFk = 10021,
				let metadataGroup = [10019, 10020, 10021];
				//PrjChangesIdentified = 10024, PrjChangesAnnounced = 10025, PrjChangesSubmitted = 10026, PrjChangesWithdrawn = 10027,
				// PrjChangesRejected = 10028, PrjChangesRejectedWithProtest = 10029, PrjChangesAcceptedInPrinciple = 10030, PrjChangesApproved = 10031,
				let prjChangesGroup = [10024, 10025, 10026, 10027, 10028, 10029, 10030, 10031];

				switch (parentColumnId) {
					case 10001: //EstimateConfidence = 10001
						columnList = costingGroup.concat(budgetingGroup).concat(packagesGroup).concat(pricingGroup).concat(metadataGroup).concat(prjChangesGroup);
						break;
					case 10002: //Costing = 10002
						columnList = costingGroup;
						break;
					case 10003://Budgeting = 10003
						columnList = budgetingGroup;
						break;
					case 10004://Packages = 10004
						columnList = packagesGroup;
						break;
					case 10005://Pricing = 10005
						columnList = pricingGroup;
						break;
					case 10006://MetadataAssociation = 10006
						columnList = metadataGroup;
						break;
					case 10023://ProjectChanges = 10023
						columnList = prjChangesGroup;
						break;
				}
				return columnList;
			}

			function getColumns (checkItemId){
				let columnList = [];
				switch (checkItemId) {
					//IsGcFalse = 10007, IsGcTrue = 10008, GrandTotal = 10009, IsLumpsum = 100010, IsNoEscalation = 10011, IsDisabled = 10012
					case 10007:/* columnList = [Direct Cost/Unit, Direct Cost/Unit Item,	Direct Cost Total, General Cost];*/
						columnList = [{field: 'DirCostUnit', css: ' cm-positive '},
							{field: 'DirCostUnitTarget', css: ' cm-positive '},
							{field: 'DirCostTotal', css: ' cm-positive '},
							{field: 'IsGc', css: ' cm-positive '}];
						break;
					case 10008:/* Indirect Cost/Unit, Indirect  Cost/Unit Item, Indirect  Cost Total, General Cost*/
						columnList = [{field: 'IndCostUnit', css: ' cm-positive '},
							{field: 'IndCostUnitTarget', css: ' cm-positive '},
							{field: 'IndCostTotal', css: ' cm-positive '},
							{field: 'IsGc', css: ' cm-positive '}];
						break;
					case 10009://GrandTotal
						columnList = [{field: 'GrandTotal', css: ' cm-negative '}];
						break;
					case 10010://columnList =  [Lumpsum];
						columnList = [{field: 'IsLumpsum', css: ' cm-positive '}];
						break;
					case 10011://columnList =   [No Escalation];
						columnList = [{field: 'IsNoEscalation', css: ' cm-negative '}];
						break;
					case 10012://columnList =   [Disabled];
						columnList = [{field: 'IsDisabled', css: ' cm-negative '}];
						break;
					//IsFixedBudget = 10013, Budget = 10014, TotalBudget = 10033
					case 10013: /* columnList =  [Budget/Unit, Budget Total,	Budget Difference, Fix Budget	Fix Budget/Unit];*/
						columnList = [{field: 'BudgetUnit', css: ' cm-positive '},
							{field: 'Budget', css: ' cm-positive '},
							{field: 'BudgetDifference', css: ' cm-positive '},
							{field: 'IsFixedBudgetUnit', css: ' cm-positive '},
							{field: 'IsFixedBudget', css: ' cm-positive '}];
						break;
					case 10014:/* columnList =   [Budget/Unit, Budget Total, Budget Difference];*/
						columnList = [{field: 'BudgetUnit', css: ' cm-negative '},
							{field: 'Budget', css: ' cm-negative '},
							{field: 'BudgetDifference', css: ' cm-negative '}];
						break;
					case 10033:/* columnList =   [Budget/Unit, Budget Total,	Budget Difference, Grand Total];*/
						columnList = [{field: 'BudgetUnit', css: ' cm-negative '},
							{field: 'Budget', css: ' cm-negative '},
							{field: 'BudgetDifference', css: ' cm-negative '},
							{field: 'GrandTotal', css: ' cm-negative '}];
						break;
					//PrcServicePackageFk = 10015, PrcMaterialPackageFk = 10022, PrcPackageGeneratedPrc = 10032
					case 10015:// columnList =  [Package];
					case 10022:
					case 10032:
						columnList = [{field: 'PackageAssignments', css: ' cm-positive '}];
						break;
					//IsIncluded = 10016, IsFixedPrice = 10017,	IsNoMarkup = 10018
					case 10016:// columnList =   [Included];
						columnList = [{field: 'IsIncluded', css: ' cm-negative '}];
						break;
					case 10017:// columnList =  [Fixed Price, Grand Cost/Unit Item];
						columnList = [{field: 'IsFixedPrice', css: ' cm-negative '},
							{field: 'GrandCostUnitTarget', css: ' cm-negative '}];
						break;
					case 10018:// columnList =   [No Markup];
						columnList = [{field: 'IsNoMarkup', css: ' cm-negative '}];
						break;
					//BoqItemFk = 10019,	PsdActivityFk = 10020, MdcControllingUnitFk = 10021
					case 10019:	/*columnList =   [BoQ Root Item Ref. No., BoQ Item Ref. No., BoQ Item Ref. No.-Brief Info, Boq Split Quantity, Boq Split Quantity-AQ Quantity,
						// Boq Split Quantity-Comment, Boq Split Quantity-Quantity, Boq Split Quantity-Unit Rate, Boq Split Quantity-Unit Rate OC];*/
						columnList = [{field: 'BoqRootRef', css: ' cm-negative '},
							{field: 'BoqItemFk', css: ' cm-negative '},
							{field: 'BoqItemFkBrief', css: ' cm-negative '},
							{field: 'BoqSplitQuantityFk', css: ' cm-negative '},
							{field: 'BoqSplitQuantityFkQuantityAdj', css: ' cm-negative '},
							{field: 'BoqSplitQuantityFkCommentText', css: ' cm-negative '},
							{field: 'BoqSplitQuantityFkQuantity', css: ' cm-negative '},
							{field: 'BoqSplitQuantityFkPrice', css: ' cm-negative '},
							{field: 'BoqSplitQuantityFkPriceOc', css: ' cm-negative '}];
						break;
					case 10020:	// columnList =  [Activity Schedule, Activity,	Activity-Description];
						columnList = [{field: 'PsdActivitySchedule', css: ' cm-negative '},
							{field: 'PsdActivityFk', css: ' cm-negative '},
							{field: 'PsdActivityFkDec', css: ' cm-negative '}];
						break;
					case 10021:// columnList =   [Controlling Units, Controlling Units-Description];
						columnList = [{field: 'MdcControllingUnitFk', css: ' cm-negative '},
							{field: 'MdcControllingUnitFkDescription', css: ' cm-negative '}];
						break;
					/*PrjChangesIdentified = 10024, PrjChangesAnnounced = 10025, PrjChangesSubmitted = 10026, PrjChangesWithdrawn = 10027,
					// PrjChangesRejected = 10028, PrjChangesRejectedWithProtest = 10029, PrjChangesAcceptedInPrinciple = 10030, PrjChangesApproved = 10031*/
					case 10024: // 	columnList =   [Project Change, Project Change Status, Project Change - Description];
					case 10025:
					case 10026:
					case 10027:
					case 10030:
					case 10031:
						columnList = [{field: 'PrjChangeFk', css: ' cm-positive '},
							{field: 'PrjChangeFkStatusFk', css: ' cm-positive '},
							{field: 'PrjChangeFkDescription', css: ' cm-positive '}];
						break;
					case 10028:
					case 10029:
						columnList = [{field: 'PrjChangeFk', css: ' cm-negative '},
							{field: 'PrjChangeFkStatusFk', css: ' cm-negative '},
							{field: 'PrjChangeFkDescription', css: ' cm-negative '}];
						break;
				}
				return columnList;
			}

			function getHighlightFields (lineItems, confidenceCheckId){
				let result = {};
				confidenceCheckId = _.isString(confidenceCheckId) ? confidenceCheckId : '';
				let checkIds = confidenceCheckId.split(',');
				checkIds = _.map(checkIds, function (id) {
					return parseInt(id); // Convert the strings to integers
				});

				//set css for each item's changed properties
				for (let i = 0; i < lineItems.length; i++) {
					let item = lineItems[i];
					let cssObject = {};
					let columnList = [];
					angular.forEach(checkIds, function (checkItemId){
						let subCheckIds = [];
						if(parentColumnIds.includes(checkItemId)){
							subCheckIds = getSubColumnIds(checkItemId);
						}else{
							subCheckIds.push(checkItemId);
						}
						angular.forEach(subCheckIds, function (checkItemId){
							let columns = getColumns(checkItemId);
							if(columns && columns.length > 0){
								columnList.push(columns);
							}
						});
					});

					if (item && columnList.length > 0 ) {
						columnList.map(function (colItems) {
							colItems.map(function (colItem) {
								if(colItem !== null && colItem !== undefined && colItem.field) {
									cssObject[colItem.field.toLowerCase()] = colItem.css;
								}
							});
						});
						result[i] = {};
						angular.extend(result[i], cssObject);
					}
				}
				return result;
			}

			return {
				getHighlightFields: getHighlightFields
			};
		}]);

})(angular);