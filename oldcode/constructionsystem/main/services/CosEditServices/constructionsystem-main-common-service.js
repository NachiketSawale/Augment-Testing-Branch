/**
 * Created by waldrop on 01.16.2019.
 */

(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global _, angular */

	var moduleName = 'constructionsystem.main';
	/**
	 * @ngdoc service
	 * @name constructionsystemMainCommonService
	 * @function
	 * @description
	 * constructionsystemMainCommonService is the data service for constructionsystem related common functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	/* jshint -W061 */ // eval can be harmful
	/* jshint -W074 */ //
	/* jshint -W073 */ //
	angular.module(moduleName).factory('constructionsystemMainCommonService', ['$q', '$http', '$injector', 'estimateMainLookupService', 'cloudCommonGridService',
		'estimateMainDynamicUserDefinedColumnCalculationService', 'estimateMainCompleteCalculationService',
		function ($q, $http, $injector, estimateMainLookupService, cloudCommonGridService,
			estimateMainDynamicUserDefinedColumnCalculationService, estimateMainCompleteCalculationService) {
			var service = {}, estResourceList = [];

			// calculate sub item's cost unit and hours unit
			var calSubItemCostHoursUnit = function calSubItemCostHoursUnit(item) {
				var childList = [];
				if (item && item.HasChildren) {
					if (Object.prototype.hasOwnProperty.call(item, 'EstResources') && item.EstResources !== null) {
						childList = cloudCommonGridService.getDirectChildren(item, 'EstResources', 'EstResourceFk');
						if (childList && childList.length > 0) {
							item.CostUnit = 0;
							item.HoursUnit = 0;
							angular.forEach(childList, function (cItem) {
								// cItem.CostReal = cItem.CostUnit * cItem.CostFactor1 * cItem.CostFactor2 * cItem.CostFactorCc;
								var isItemDisabled = !!cItem.IsDisabled || !!cItem.IsDisabledPrc;
								if (!isItemDisabled) {
									cItem.ExchangeRate = cItem.ExchangeRate ? cItem.ExchangeRate : 1;
									cItem.CostReal = cItem.CostUnit * cItem.CostFactor1 * cItem.CostFactor2 * cItem.CostFactorCc * cItem.ExchangeRate;
									item.CostUnit = item.CostUnit + (cItem.QuantityReal * cItem.CostReal); // consider lumpsum flag also
									item.HoursUnit = item.HoursUnit + cItem.HoursUnitSubItem;
								}
							});
						}
					}
				}
				item.CostReal = item.CostUnit * item.CostFactor1 * item.CostFactor2;
			};

			// calculate  sub item's cost internal //change name because it calculates both real and internal cost
			var calItemCostInternal = function calItemCostInternal(item) {
				var parentItems = [],
					cc = item.EstResourceTypeFk !== 5 ? item.CostFactorCc : 1;

				function calcCostInternal() {
					// eslint-disable-next-line no-undef
					cloudCommonGridService.getParentItems(item, parentItems, 'EstResourceFk', estResourceList);
					var costFactorsProduct = 1;
					if (parentItems.length > 0) {
						angular.forEach(parentItems, function (pItem) {
							if (pItem && pItem.Id !== item.Id) {
								costFactorsProduct = costFactorsProduct * (pItem.CostFactorCc * pItem.CostFactor1 * pItem.CostFactor2);
							}
						});
					}
					var isItemDisabled = !!item.IsDisabled || !!item.IsDisabledPrc;
					item.CostInternal = !isItemDisabled ? item.CostReal * costFactorsProduct : 0;
				}

				item.ExchangeRate = item.ExchangeRate ? item.ExchangeRate : 1;
				item.CostReal = item.CostUnit * item.CostFactor1 * item.CostFactor2 * cc * item.ExchangeRate;

				if (item.EstResourceFk === null) {
					var isItemDisabled = !!item.IsDisabled || !!item.IsDisabledPrc;
					item.CostInternal = !isItemDisabled ? item.CostReal : 0;
				} else {
					calcCostInternal();
				}
				return item.CostInternal;
			};

			// calculate both real and internal cost of sub item and resource
			var calResRealInternalCost = function calResRealInternalCost(item) {
				var parentItems = [],
					cc = item.EstResourceTypeFk !== 5 ? item.CostFactorCc : 1;

				function calcCostInternal() {
					// eslint-disable-next-line no-undef
					cloudCommonGridService.getParentItems(item, parentItems, 'EstResourceFk', estResourceList);
					var costFactorsProduct = 1;
					if (parentItems.length > 0) {
						angular.forEach(parentItems, function (pItem) {
							if (pItem && pItem.Id !== item.Id) {
								costFactorsProduct = costFactorsProduct * (pItem.CostFactorCc * pItem.CostFactor1 * pItem.CostFactor2);
							}
						});
					}
					var isItemDisabled = !!item.IsDisabled || !!item.IsDisabledPrc;
					item.CostInternal = !isItemDisabled ? item.CostReal * costFactorsProduct : 0;
				}

				item.ExchangeRate = item.ExchangeRate ? item.ExchangeRate : 1;
				item.CostReal = item.CostUnit * item.CostFactor1 * item.CostFactor2 * cc * item.ExchangeRate;

				if (item.EstResourceFk === null) {
					var isItemDisabled = !!item.IsDisabled || !!item.IsDisabledPrc;
					item.CostInternal = !isItemDisabled ? item.CostReal : 0;
				} else {
					calcCostInternal();
				}
			};

			// calculate cost and hours UnitTarget and Total of resorces and sub items
			var calResUnitTargetNTotal = function calResUnitTargetNTotal(resItem, parentLineItem) {
				if (!resItem || !parentLineItem) {
					return;
				}
				resItem.CostUnitTarget = resItem.QuantityUnitTarget * resItem.CostInternal;
				resItem.CostTotal = resItem.QuantityTotal * resItem.CostInternal * parentLineItem.CostFactor1 * parentLineItem.CostFactor2;
				resItem.HoursUnitTarget = resItem.QuantityUnitTarget * resItem.HoursUnit;
				resItem.HoursTotal = resItem.QuantityTotal * resItem.HoursUnit;
			};

			// calculate  sub item's cost and hours unit line item and unit sub item
			var calResCostHoursUnitLineNSubItem = function calResCostHoursUnitLineNSubItem(item) {
				item.CostUnitSubItem = item.QuantityReal * item.CostInternal;
				item.CostUnitLineItem = item.QuantityInternal * item.CostInternal;
				item.HoursUnitSubItem = item.QuantityReal * item.HoursUnit;
				item.HoursUnitLineItem = item.QuantityInternal * item.HoursUnit;
			};

			// calculate all affected children due to parent sub item change
			var calAffectedChildren = function calAffectedChildren(parentItem, parentLineItem) {
				if (parentItem && parentItem.HasChildren) {
					if (Object.prototype.hasOwnProperty.call(parentItem, 'EstResources') && parentItem.EstResources !== null) {
						var childList = cloudCommonGridService.getDirectChildren(parentItem, 'EstResources', 'EstResourceFk');
						if (childList && childList.length > 0) {
							angular.forEach(childList, function (subItem) {
								subItem.QuantityInternal = subItem.QuantityReal * parentItem.QuantityInternal;
								var isItemDisabled = !!subItem.IsDisabled || !!subItem.IsDisabledPrc;
								subItem.CostInternal = !isItemDisabled ? calItemCostInternal(subItem) : 0;
								calResCostHoursUnitLineNSubItem(subItem);
								calResUnitTargetNTotal(subItem, parentLineItem);
								calAffectedChildren(subItem, parentLineItem);
							});
						}
					}
				}
			};

			// calculate all affected parent due to child item change
			var calAffectedParent = function calAffectedParent(childItem, parentLineItem) {
				if (estResourceList.length > 0) {
					var affectedParent = _.find(estResourceList, {Id: childItem.EstResourceFk});
					if (affectedParent && affectedParent.EstResourceTypeFk === 5) {
						calSubItemCostHoursUnit(affectedParent);
						calItemCostInternal(affectedParent);
						calResCostHoursUnitLineNSubItem(affectedParent);
						calResUnitTargetNTotal(affectedParent, parentLineItem);
						calAffectedParent(affectedParent, parentLineItem);
					}
				}
			};

			// resources specific calculation
			service.CalculateResources = function CalculateResources(item, parentLineItem, resItemList) {
				estimateMainDynamicUserDefinedColumnCalculationService.doResourceCalculate(parentLineItem, item, resItemList);
			};

			// subItem specific calculation
			service.CalculateSubItems = function CalculateSubItems(item, parentLineItem, resItemList) {
				estimateMainCompleteCalculationService.calculateQuantityOfResource(item, parentLineItem, resItemList);
				calSubItemCostHoursUnit(item);// only QuantityReal is used in this fn
				commonCalcResNSub(item, parentLineItem, resItemList);
			};

			// common calculation for subitems and resources
			function commonCalcResNSub(item, parentLineItem, resItemList) {
				var isParentEdit = item.EstResourceFk === null;
				var isChildEdit = item.EstResourceFk !== null;
				calResRealInternalCost(item);
				calResCostHoursUnitLineNSubItem(item);
				calResUnitTargetNTotal(item, parentLineItem);
				if (isParentEdit) {
					calAffectedChildren(item, parentLineItem);
				} else if (isChildEdit) {
					calAffectedParent(item, parentLineItem);
				} else {
					calAffectedChildren(item, parentLineItem);
					calAffectedParent(item, parentLineItem);
				}
				estimateMainCompleteCalculationService.calculateLineItemTotal(parentLineItem);
				estimateMainCompleteCalculationService.calLineItemBudgetDiff(parentLineItem, resItemList);
			}

			var advancedAllowanceCostCode = '';
			service.GenerateLineItemAdvancedAllowance = function (lineItem, resourceList) {

				if (resourceList && resourceList.length > 0) {
					lineItem.AdvancedAllowance = 0;
					angular.forEach(resourceList, function (res) {

						if (res.EstResourceFk === null) {
							if (res.Code === advancedAllowanceCostCode && res.EstResourceTypeFk === 1) {
								lineItem.AdvancedAllowance += res.CostTotal;
							}

							var subResource = res.EstResources;
							while (!!subResource && subResource.length > 0) {
								var subTemp = [];
								_.forEach(subResource, function (item) {
									if (item.Code === advancedAllowanceCostCode && item.EstResourceTypeFk === 1) {
										lineItem.AdvancedAllowance += item.CostTotal;
									}

									if (!!item.EstResources && item.EstResources.length > 0) {
										_.forEach(item.EstResources, function (subRes) {
											subTemp.push(subRes);
										});
									}
								});

								subResource = subTemp;
							}
						}

					});
				}

			};

			return service;
		}]);
})(angular);
