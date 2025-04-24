/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular){
	'use strict';

	let moduleName = 'estimate.assemblies';

	angular.module(moduleName).factory('estimateAssembliesDynamicUserDefinedColumnCalculationService', ['_', '$injector', 'estimateMainCompleteCalculationService', 'estimateMainRoundingService',
		function(_, $injector, estimateMainCompleteCalculationService, estimateMainRoundingService){
			let service = {
				setUserDefinedColumns : setUserDefinedColumns,
				doResourceCalculate : doResourceCalculate,
				doResourcesCalculate : doResourcesCalculate,
				doEstLineItemCalculate : doEstLineItemCalculate,
				calculateLineItemAndResoruce : calculateLineItemAndResoruce
			};

			let _userDefinedColumnsFields = [];

			function setUserDefinedColumns(columnFields){
				_userDefinedColumnsFields = columnFields;
			}

			function getResourceRootParent(resource, resourceList){

				if(!resource.EstResourceFk){
					return resource;
				}

				let parent = _.find(resourceList, {Id : resource.EstResourceFk});

				while(parent && parent.EstResourceFk){

					parent = _.find(resourceList, {Id : parent.EstResourceFk});
				}

				return parent ? parent : resource;
			}

			function calculateResourceTotal(resource, lineItem, anscetorCostFactor, fieldChangeSaveFnc){
				/*
				* resource.CostTotal = resource.QuantityTotal * resource.CostUnit * costFactor * resource.ExchangeRate * parentCostFactor * lineItem.CostFactor1 * lineItem.CostFactor2
				* total = resource.QuantityTotal * resource[field] * costFactor * resource.ExchangeRate * parentCostFactor * lineItem.CostFactor1 * lineItem.CostFactor2*
				*
				* */
				let costTotalInternal = _.isNumber(resource.CostTotalInternal) ? resource.CostTotalInternal : 1;
				_userDefinedColumnsFields.forEach(function(field){
					let fieldTotal = field + 'Total';
					resource[fieldTotal] = resource.IsInformation ? 0 : (resource[field] * costTotalInternal).toFixed(7) - 0;

					fieldChangeSaveFnc(resource, field, resource[field]);
					fieldChangeSaveFnc(resource, fieldTotal, resource[fieldTotal]);
				});
			}

			function calculateResourceCostUnitOfSubItem(resource, children){
				_userDefinedColumnsFields.forEach(function(field){
					resource[field] = 0;
				});

				angular.forEach(children, function(child){
					if(!child.IsDisabled && !child.IsDisabledPrc && !child.IsInformation){
						let costUnitTarget = child.QuantityReal * child.CostFactor1 * child.CostFactor2 * child.CostFactorCc * (child.ExchangeRate ? child.ExchangeRate : 1);

						_userDefinedColumnsFields.forEach(function(field){
							resource[field] += child[field] * costUnitTarget;
						});
					}
				});

			}

			function calculateResourceTree(resource, lineItem, getChildrenFunc, anscetorCostFactor, fieldChangeSaveFnc){
				if(estimateMainCompleteCalculationService.isMaterial(resource)){
					return;
				}

				/* subItem */
				if(estimateMainCompleteCalculationService.isSubItem(resource) || estimateMainCompleteCalculationService.isPlantAssembly(resource) || estimateMainCompleteCalculationService.isEquipmentAssembly(resource)){
					let children = getChildrenFunc(resource);

					if(children && children.length){
						/* calculate anscetor costFactor */
						let costFactor = angular.isDefined(anscetorCostFactor) && angular.isNumber(anscetorCostFactor) ? anscetorCostFactor : 1;
						costFactor = costFactor * resource.CostFactor1 * resource.CostFactor2;

						angular.forEach(children, function(child){
							calculateResourceTree(child, lineItem, getChildrenFunc, costFactor, fieldChangeSaveFnc);
						});
					}

					calculateResourceCostUnitOfSubItem(resource, children);
				}

				calculateResourceTotal(resource, lineItem, anscetorCostFactor, fieldChangeSaveFnc);
			}

			function doResourceCalculate(lineItem, item, resList, resFieldChangeSaveFnc, liFieldChangeSaveFnc){
				if (!lineItem) {
					return;
				}

				function getChildrenResources(parentResource){
					if(parentResource && angular.isArray(parentResource.EstResources) && parentResource.EstResources.length > 0){
						return parentResource.EstResources;
					}
					let children = _.filter(resList, function(item) {return item.EstResourceFk === parentResource.Id;});
					return _.uniqBy(children, 'Id');
				}

				updateResourceInternalValue(lineItem, resList, getChildrenResources);

				let rootResource = getResourceRootParent(item, resList, getChildrenResources);
				calculateResourceTree(rootResource, lineItem, getChildrenResources, null, resFieldChangeSaveFnc);

				doEstLineItemCalculate(lineItem, resList, liFieldChangeSaveFnc);
			}

			function updateResourceInternalValue(lineItem, resList, getChildrenResources){
				if(!lineItem || !angular.isArray(resList)){
					return;
				}

				let resourceTree = _.filter(resList, function(resource){
					return resource.EstResourceFk === null;
				});

				/*
				 * calculate quantity of resource tree
				 * */
				_.forEach(resourceTree, function(resource){
					InitResourceTreeInternalValue(resource, lineItem, getChildrenResources, null);
				});
			}

			function InitResourceTreeInternalValue(resource, lineItem, getChildrenFunc, anscetorCostFactor){
				if(estimateMainCompleteCalculationService.isMaterial(resource)){
					return;
				}
				let costFactor = angular.isDefined(anscetorCostFactor) && angular.isNumber(anscetorCostFactor) ? anscetorCostFactor : 1;
				costFactor = costFactor * resource.CostFactor1 * resource.CostFactor2;

				/* subItem or equipment assembly*/
				if(estimateMainCompleteCalculationService.isSubItem(resource) || estimateMainCompleteCalculationService.isPlantAssembly(resource) || estimateMainCompleteCalculationService.isEquipmentAssembly(resource)){
					let children = getChildrenFunc(resource);

					if(children && children.length){
						angular.forEach(children, function(child){
							InitResourceTreeInternalValue(child, lineItem, getChildrenFunc, costFactor);
						});
					}
				}

				resource.CostUnitLineItemInternal = resource.QuantityInternal * costFactor * resource.CostFactorCc * resource.ExchangeRate;
			}

			function doResourcesCalculate(lineItem, resList, resFieldChangeSaveFnc, liFieldChangeSaveFnc){

				function getChildrenResources(parentResource){
					if(parentResource && angular.isArray(parentResource.EstResources) && parentResource.EstResources.length > 0){
						return parentResource.EstResources;
					}
					let children = _.filter(resList, function(item) {return item.EstResourceFk === parentResource.Id;});
					return _.uniqBy(children, 'Id');
				}

				updateResourceCore(lineItem, resList, getChildrenResources, resFieldChangeSaveFnc);

				doEstLineItemCalculate(lineItem, resList, liFieldChangeSaveFnc);
			}

			function updateResourceCore(lineItem, resourceList, getChildrenResources, resFieldChangeSaveFnc){
				if(!lineItem || !angular.isArray(resourceList)){
					return;
				}

				let resourceTree = _.filter(resourceList, function(resource){
					return resource.EstResourceFk === null;
				});

				/*
				 * calculate quantity of resource tree
				 * */
				_.forEach(resourceTree, function(resource){
					calculateResourceTree(resource, lineItem, getChildrenResources, null, resFieldChangeSaveFnc);
				});
			}

			function initializeLineItemUnit(lineItem){
				if (!lineItem) {
					return;
				}

				_userDefinedColumnsFields.forEach(function(field){
					lineItem[field] = 0;

					lineItem['Ind' + field] = 0;

					lineItem['Dru' + field] = 0;

					lineItem['Ent' + field] = 0;
				});

				lineItem.DayWorkRateUnit = 0;
			}

			function calculateLineItemAndResoruce(lineItem, resList, resFieldChangeSaveFnc, liFieldChangeSaveFnc){
				if (!lineItem) {
					return;
				}

				let resourceTree = _.filter(resList, function(resource){
					return resource.EstResourceFk === null;
				});

				function getChildrenResources(parentResource){
					if(parentResource && angular.isArray(parentResource.EstResources) && parentResource.EstResources.length > 0){
						return parentResource.EstResources;
					}
					let children = _.filter(resList, function(item) {return item.EstResourceFk === parentResource.Id;});
					return _.uniqBy(children, 'Id');
				}

				_.forEach(resourceTree, function(resource){
					calculateResourceTree(resource, lineItem, getChildrenResources, null, resFieldChangeSaveFnc);
				});

				doEstLineItemCalculate(lineItem, resList, liFieldChangeSaveFnc);
			}

			function doEstLineItemCalculate(lineItem, resources, fieldChangeSaveFnc){
				if (!lineItem) {
					return;
				}

				function getChildrenResources(parentResource) {
					if (parentResource && angular.isArray(parentResource.EstResources) && parentResource.EstResources.length > 0) {
						return parentResource.EstResources;
					}
					let children = _.filter(resources, function (item) {
						return item.EstResourceFk === parentResource.Id;
					});
					return _.uniqBy(children, 'Id');
				}

				let isTotalWq = $injector.get('estimateMainService').getEstTypeIsTotalWq();

				initializeLineItemUnit(lineItem);

				if (resources) {
					let resourceTreeOfFirstLevel = _.filter(resources, function (resource) {
						return resource.EstResourceFk === null;
					});

					sumResourcesTotalToLineItem(lineItem, resourceTreeOfFirstLevel, getChildrenResources, false, false);
				}

				calculateLineItemTotal(lineItem, isTotalWq, fieldChangeSaveFnc);
			}

			function calculateLineItemTotal(lineItem, isTotalWq, fieldChangeSaveFnc) {
				if (!lineItem) {
					return;
				}

				// check IsTotalWq flag of Estimate Type to consider AQ or WQ quantity target in calculation
				let qtyTarget = lineItem.IsLumpsum ? 1 : (isTotalWq ? lineItem.WqQuantityTarget : lineItem.QuantityTarget);

				_userDefinedColumnsFields.forEach(function(field){
					let totalField = field + 'Total';


					lineItem[field] = lineItem['Ent' + field] + lineItem['Dru' + field] + lineItem['Ind' + field];
					lineItem[field] =  estimateMainRoundingService.doRoundingValue('DayWorkRateUnit', lineItem[field]);

					let lineItemCostUnitTarget = lineItem.QuantityUnitTarget * lineItem[field] * lineItem.CostFactor1 * lineItem.CostFactor2;
					lineItem[totalField] = lineItem.IsGc || estimateMainCompleteCalculationService.isOptionItemWithoutIT(lineItem) ? 0 : (qtyTarget * lineItemCostUnitTarget);
					lineItem[totalField] =  estimateMainRoundingService.doRoundingValue('DayWorkRateTotal', lineItem[totalField]);

					fieldChangeSaveFnc(lineItem, field, lineItem[field]);
					fieldChangeSaveFnc(lineItem, totalField, lineItem[totalField]);
				});
				lineItem.DayWorkRateTotal = lineItem.IsGc || lineItem.IsIncluded || estimateMainCompleteCalculationService.isOptionItemWithoutIT(lineItem) ? 0 : (qtyTarget * lineItem.QuantityUnitTarget * lineItem.DayWorkRateUnit * lineItem.CostFactor1 * lineItem.CostFactor2).toFixed(7) - 0;
				lineItem.DayWorkRateTotal =  estimateMainRoundingService.doRoundingValue('DayWorkRateTotal', lineItem.DayWorkRateTotal);
			}

			function sumAssemblyResourceTotalToLineItem(lineItem, resource){
				if (!lineItem || !resource) {
					return;
				}

				resource.CostUnitLineItemInternal = resource.CostUnitLineItemInternal || 1;

				if (resource.IsIndirectCost) {
					// calculate indirect cost unit(consider resource isIndirect flag true, Ind)
					_userDefinedColumnsFields.forEach(function(field){
						lineItem['Ind' + field] += resource[field] * resource.CostUnitLineItemInternal;
					});
				} else {
					_userDefinedColumnsFields.forEach(function(field){
						lineItem['Ent' + field] += resource[field] * resource.CostUnitLineItemInternal;
					});
				}
				lineItem.DayWorkRateUnit += resource.IsCost ? resource.DayWorkRateUnit * resource.CostUnitLineItemInternal : 0;
			}

			function sumSingleResourceTotalToLineItem(lineItem, resource, useParentIsCost, parentIsCost) {
				if (!lineItem || !resource  || resource.IsInformation) {
					return;
				}

				resource.CostUnitLineItemInternal = resource.CostUnitLineItemInternal || 1;

				let isCost = resource.IsCost;

				if (useParentIsCost) {
					isCost = parentIsCost;
				}

				if (isCost && !resource.IsInformation) {
					if (resource.IsIndirectCost) {
						// calculate indirect cost unit(consider resource isIndirect flag true, Ind)
						_userDefinedColumnsFields.forEach(function(field){
							lineItem['Ind' + field] += resource[field] * resource.CostUnitLineItemInternal;
						});
					} else {
						if (resource.EstRuleSourceFk > 0 /* && !res.IsEstimateCostCode && res.IsRuleMarkupCostCode */) {
							// calculate direct rule cost unit(consider resource created from rule and isIndirect flag false, Dru)
							_userDefinedColumnsFields.forEach(function(field){
								lineItem['Dru' + field] += resource[field] * resource.CostUnitLineItemInternal;
							});
						} else {
							// calculate entered cost unit(consider resource not created from rule, Ent)
							_userDefinedColumnsFields.forEach(function(field){
								lineItem['Ent' + field] += resource[field] * resource.CostUnitLineItemInternal;
							});
						}
					}
					lineItem.DayWorkRateUnit += resource.DayWorkRateUnit * resource.CostUnitLineItemInternal;
				}
			}

			function sumResourcesTotalToLineItem(lineItem, resources, getChildrenFunc, useParentIsCost, parentIsCost) {
				if (!lineItem || !resources || !getChildrenFunc) {
					return;
				}

				_.forEach(resources, function (item) {
					if (estimateMainCompleteCalculationService.isAssembly(item)) {
						if (estimateMainCompleteCalculationService.isCompositeAssembly(item)) {
							if ($injector.get('estimateAssembliesAssemblyTypeDataService').isPaAssembly(item.EstAssemblyTypeFk)) {
								sumAssemblyResourceTotalToLineItem(lineItem, item);
							} else {
								sumSingleResourceTotalToLineItem(lineItem, item);
							}

						} else {
							sumAssemblyResourceTotalToLineItem(lineItem, item);
						}
					} else {
						let children = getChildrenFunc(item);

						if (!children || !children.length) {
							sumSingleResourceTotalToLineItem(lineItem, item, useParentIsCost, parentIsCost);
						} else {
							if (estimateMainCompleteCalculationService.isCompositeAssembly(item)) {
								let isCost = item.IsCost || (useParentIsCost && parentIsCost);
								if ($injector.get('estimateAssembliesAssemblyTypeDataService').isPaAssembly(item.EstAssemblyTypeFk)) {
									sumResourcesTotalToLineItem(lineItem, children, getChildrenFunc, useParentIsCost, parentIsCost);
								} else {
									sumSingleResourceTotalToLineItem(lineItem, item, true, isCost);
								}
							} else {
								sumResourcesTotalToLineItem(lineItem, children, getChildrenFunc, useParentIsCost, parentIsCost);
							}
						}
					}
				});
			}

			return service;
		}]);
})(angular);