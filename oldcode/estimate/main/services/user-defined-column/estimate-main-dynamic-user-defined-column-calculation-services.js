/**
 * Created by myh on 09/01/2021.
 */

(function(angular){
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainDynamicUserDefinedColumnCalculationService', ['_', '$injector', 'estimateMainCompleteCalculationService', 'estimateMainRoundingService', 'estimateMainResourceType',
		function(_, $injector, estimateMainCompleteCalculationService, estimateMainRoundingService, estimateMainResourceType){
			let service = {
				setUserDefinedColumns : setUserDefinedColumns,
				doResourceCalculate : doResourceCalculate,
				doResourcesCalculate : doResourcesCalculate,
				doEstLineItemCalculate : doEstLineItemCalculate,
				calculateLineItemAndResoruce : calculateLineItemAndResoruce,
				calculateResourceNew : calculateResourceNew
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

			function isSubItemOrCompositeAssembly(resource) {
				return resource.EstResourceTypeFk === estimateMainResourceType.SubItem || resource.EstResourceTypeFk === estimateMainResourceType.Assembly;
			}

			function isEquipmentAssembly(resource) {
				return resource.EstResourceTypeFk === estimateMainResourceType.SubItem || resource.EstResourceTypeFk === estimateMainResourceType.Assembly;
			}

			function calculateResourceTotal(resource, lineItem, anscetorCostFactor, fieldChangeSaveFnc, oldResource){
				let isChanged = false;
				let costTotalInternal = _.isNumber(resource.CostTotalInternal) ? resource.CostTotalInternal : 1;
				_userDefinedColumnsFields.forEach(function(field){
					let fieldTotal = field + 'Total';

					resource[field] =  estimateMainRoundingService.doRoundingValue('CostUnit', resource[field]);
					resource[fieldTotal] = resource.IsInformation ? 0 : (resource[field] * costTotalInternal);
					resource[fieldTotal] =  estimateMainRoundingService.doRoundingValue('CostTotal', resource[fieldTotal]);

					if(lineItem.EstLineItemFk === null && ((resource[field] !==  oldResource[field] || resource[fieldTotal] !==  oldResource[fieldTotal]) || resource.IsInformation)) {
						fieldChangeSaveFnc(resource, field, resource[field]);
						fieldChangeSaveFnc(resource, fieldTotal, resource[fieldTotal]);
						isChanged = true;
					}
				});

				return isChanged;
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
					return [];
				}

				let retValue = [];
				let oldResource = angular.copy(resource);

				/* subItem */
				if(isSubItemOrCompositeAssembly(resource) || isEquipmentAssembly(resource)){
					let children = getChildrenFunc(resource);

					if(children && children.length){
						/* calculate anscetor costFactor */
						let costFactor = angular.isDefined(anscetorCostFactor) && angular.isNumber(anscetorCostFactor) ? anscetorCostFactor : 1;
						costFactor = costFactor * resource.CostFactor1 * resource.CostFactor2;

						angular.forEach(children, function(child){
							let childrenChanged = calculateResourceTree(child, lineItem, getChildrenFunc, costFactor, fieldChangeSaveFnc);
							if(angular.isArray(childrenChanged) && childrenChanged.length > 0){
								retValue = retValue.concat(childrenChanged);
							}
						});
					}

					calculateResourceCostUnitOfSubItem(resource, children);
				}

				if(calculateResourceTotal(resource, lineItem, anscetorCostFactor, fieldChangeSaveFnc, oldResource)){
					retValue = retValue.concat(resource);
				}

				return retValue;
			}

			function doResourceCalculate(lineItem, item, resList, resFieldChangeSaveFnc, liFieldChangeSaveFnc){
				if (!lineItem) {
					return;
				}

				function getChildrenResources(parentResource){
					return _.filter(resList, function(item) {return item.EstResourceFk === parentResource.Id;});
				}

				estimateMainCompleteCalculationService.calculateResourceCore(item, lineItem, resList);

				let rootResource = getResourceRootParent(item, resList);
				calculateResourceTree(rootResource, lineItem, getChildrenResources, null, resFieldChangeSaveFnc);

				doEstLineItemCalculate(lineItem, resList, liFieldChangeSaveFnc);
			}

			function calculateLineItemAndResoruce(lineItem, resList, resFieldChangeSaveFnc, liFieldChangeSaveFnc){
				if (!lineItem) {
					return;
				}

				calculateResources(lineItem, resList, resFieldChangeSaveFnc);

				doEstLineItemCalculate(lineItem, resList, liFieldChangeSaveFnc);
			}

			function getAncestorsCostFactor(ancestors){
				return angular.isArray(ancestors) && ancestors.length > 0 ? ancestors.reduce((accumulator, currentValue) => accumulator * currentValue.CostFactor1 * currentValue.CostFactor2, 1) : 1;
			}

			function calculateResourceNew(lineItem, res, resList, resFieldChangeSaveFnc, liFieldChangeSaveFnc){
				let retValue = [];
				if (!lineItem) {
					return retValue;
				}
				estimateMainCompleteCalculationService.updateResourceNew(res,lineItem,  resList);

				/* collect ancestors */
				let ancestors = [];
				let currentResource = res;
				while(currentResource && currentResource.EstResourceFk){
					currentResource = _.find(resList, { Id : currentResource.EstResourceFk });
					if(currentResource){
						ancestors.push(currentResource);
					}
				}

				let getChildrenFunc = createGetChildrenFunc(resList);

				/* calculate current resource and its children */
				let resourceChanged = calculateResourceTree(res, lineItem, getChildrenFunc, getAncestorsCostFactor(ancestors), resFieldChangeSaveFnc);
				if(angular.isArray(resourceChanged) && resourceChanged.length > 0){
					retValue = retValue.concat(resourceChanged);
				}

				/* calculate ancestors */
				while (ancestors.length > 0){
					let currentItem = ancestors.shift();
					let oldResource = angular.copy(currentItem);
					/* subItem */
					if(isSubItemOrCompositeAssembly(currentItem) || isEquipmentAssembly(currentItem)){
						let children = getChildrenFunc(currentItem);

						// if(children && children.length){
						// 	/* calculate anscetor costFactor */
						// 	let ancestorsCostFactor = getAncestorsCostFactor(ancestors);
						// 	ancestorsCostFactor = ancestorsCostFactor * currentItem.CostFactor1 * currentItem.CostFactor2;
						//
						// 	angular.forEach(children, function(child){
						// 		calculateResourceTree(child, lineItem, getChildrenFunc, ancestorsCostFactor, resFieldChangeSaveFnc);
						// 	});
						// }

						calculateResourceCostUnitOfSubItem(currentItem, children);
					}

					calculateResourceTotal(currentItem, lineItem, getAncestorsCostFactor(ancestors), resFieldChangeSaveFnc, oldResource);

					retValue.push(currentItem);
				}

				doEstLineItemCalculate(lineItem, resList, liFieldChangeSaveFnc);
				return retValue;
			}

			function createGetChildrenFunc(resList){
				return function getChildrenResources(parentResource){
					if(parentResource && angular.isArray(parentResource.EstResources) && parentResource.EstResources.length > 0){
						return parentResource.EstResources;
					}
					let children = _.filter(resList, function(item) {return item.EstResourceFk === parentResource.Id;});
					return _.uniqBy(children, 'Id');
				};
			}

			function calculateResources(lineItem, resList, resFieldChangeSaveFnc){

				estimateMainCompleteCalculationService.updateResourcesNew(lineItem, resList);

				updateResourceCore(lineItem, resList, createGetChildrenFunc(resList), resFieldChangeSaveFnc);
			}

			function doResourcesCalculate(lineItem, resList, resFieldChangeSaveFnc, liFieldChangeSaveFnc){

				estimateMainCompleteCalculationService.updateResourcesNew(lineItem, resList);

				updateResourceCore(lineItem, resList, createGetChildrenFunc(resList), resFieldChangeSaveFnc);

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

				if(!_userDefinedColumnsFields){
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

			function doEstLineItemCalculate(lineItem, resources, fieldChangeSaveFnc){
				if (!lineItem) {
					return;
				}

				let isTotalWq = $injector.get('estimateMainService').getEstTypeIsTotalWq();

				let oldLineItem = angular.copy(lineItem);
				initializeLineItemUnit(lineItem);

				if (resources) {
					let resourceTreeOfFirstLevel = _.filter(resources, function (resource) {
						return resource.EstResourceFk === null;
					});

					sumResourcesTotalToLineItem(lineItem, resourceTreeOfFirstLevel, createGetChildrenFunc(resources), false, false);
				}

				calculateLineItemTotal(lineItem, isTotalWq, fieldChangeSaveFnc, oldLineItem);
			}

			function calculateLineItemTotal(lineItem, isTotalWq, fieldChangeSaveFnc, oldLineItem) {
				if (!lineItem) {
					return;
				}

				// check IsTotalWq flag of Estimate Type to consider AQ or WQ quantity target in calculation
				let qtyTarget = lineItem.IsLumpsum ? 1 : (isTotalWq ? lineItem.WqQuantityTarget : lineItem.QuantityTarget);

				if(!_userDefinedColumnsFields){
					return;
				}

				_userDefinedColumnsFields.forEach(function(field){
					let totalField = field + 'Total';

					lineItem[field] = lineItem['Ent' + field] + lineItem['Dru' + field] + lineItem['Ind' + field];
					lineItem[field] =  estimateMainRoundingService.doRoundingValue('CostUnit', lineItem[field]);

					let costUnitTarget = lineItem.QuantityUnitTarget * lineItem[field] * lineItem.CostFactor1 * lineItem.CostFactor2;
					lineItem[totalField] = lineItem.IsGc || lineItem.IsIncluded || estimateMainCompleteCalculationService.isOptionItemWithoutIT(lineItem) ? 0 : (qtyTarget * costUnitTarget);
					lineItem[totalField] =  estimateMainRoundingService.doRoundingValue('CostTotal', lineItem[totalField]);

					if(lineItem[field] !==  oldLineItem[field] || lineItem[totalField] !==  oldLineItem[totalField]){
						fieldChangeSaveFnc(lineItem, field, lineItem[field]);
						fieldChangeSaveFnc(lineItem, totalField, lineItem[totalField]);
					}
				});
				lineItem.DayWorkRateTotal = lineItem.IsGc || lineItem.IsIncluded || estimateMainCompleteCalculationService.isOptionItemWithoutIT(lineItem) ? 0 : (qtyTarget * lineItem.QuantityUnitTarget * lineItem.DayWorkRateUnit * lineItem.CostFactor1 * lineItem.CostFactor2).toFixed(7) - 0;
				lineItem.DayWorkRateTotal = estimateMainRoundingService.doRoundingValue('DayWorkRateTotal',lineItem.DayWorkRateTotal);
			}

			function sumSingleResourceTotalToLineItem(lineItem, resource, useParentIsCost, parentIsCost) {
				if (!lineItem || !resource || resource.IsInformation) {
					return;
				}

				let isCost = resource.IsCost;

				if (useParentIsCost) {
					isCost = parentIsCost;
				}

				if (isCost && !resource.IsInformation) {
					let costUnitLineItemInternal = _.isNumber(resource.CostUnitLineItemInternal) ? resource.CostUnitLineItemInternal : 1;
					if (resource.IsIndirectCost) {
						// calculate indirect cost unit(consider resource isIndirect flag true, Ind)
						_userDefinedColumnsFields.forEach(function(field){
							lineItem['Ind' + field] += resource[field] * costUnitLineItemInternal;
						});
					} else {
						if (resource.EstRuleSourceFk > 0 /* && !res.IsEstimateCostCode && res.IsRuleMarkupCostCode */) {
							// calculate direct rule cost unit(consider resource created from rule and isIndirect flag false, Dru)
							_userDefinedColumnsFields.forEach(function(field){
								lineItem['Dru' + field] += resource[field] * costUnitLineItemInternal;
							});
						} else {
							// calculate entered cost unit(consider resource not created from rule, Ent)
							_userDefinedColumnsFields.forEach(function(field){
								lineItem['Ent' + field] += resource[field] * costUnitLineItemInternal;
							});
						}
					}
					lineItem.DayWorkRateUnit += resource.DayWorkRateUnit * costUnitLineItemInternal;
					lineItem.DayWorkRateUnit = estimateMainRoundingService.doRoundingValue('DayWorkRateUnit',lineItem.DayWorkRateUnit);
				}
			}

			function sumResourcesTotalToLineItem(lineItem, resources, getChildrenFunc, useParentIsCost, parentIsCost) {
				if (!lineItem || !resources || !getChildrenFunc) {
					return;
				}

				_.forEach(resources, function (item) {
					let children = getChildrenFunc(item);

					if (!children || !children.length) {
						if (item.AdvancedAllowanceCostUnitLineItem) {
							lineItem.AdvancedAllowanceCostUnit += item.AdvancedAllowanceCostUnitLineItem;
						}
						sumSingleResourceTotalToLineItem(lineItem, item, useParentIsCost, parentIsCost);
					} else {
						if (estimateMainCompleteCalculationService.isCompositeAssembly(item)) {
							if (item.AdvancedAllowanceCostUnitLineItem) {
								lineItem.AdvancedAllowanceCostUnit += item.AdvancedAllowanceCostUnitLineItem;
							}
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
				});
			}

			return service;
		}]);
})(angular);