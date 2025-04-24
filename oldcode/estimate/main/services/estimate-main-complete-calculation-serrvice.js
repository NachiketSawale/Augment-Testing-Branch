/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	'use strict';
	/* global _ */

	let moduleName = 'estimate.main';
	/**
	 * @ngdoc service
	 * @name estimateMainCommonService
	 * @function
	 * @description
	 * estimateMainCommonService is the data service for estimate related common functionality.
	 */

	angular.module(moduleName).factory('estimateMainCompleteCalculationService', ['$q', '$http', '$injector', 'basicsLookupdataLookupDescriptorService','estimateMainRoundingService','estimateMainResourceType', 'estimateMainLineItemType',
		function ($q, $http, $injector, basicsLookupdataLookupDescriptorService,estimateMainRoundingService,estimateMainResourceType, estimateMainLineItemType) {
			let service = {};

			service.isOptionItemWithIT = function isOptionItemWithIT(lineItem){
				return (lineItem.IsOptional && lineItem.IsOptionalIT) || lineItem.IsDaywork;
			};

			service.isOptionItemWithoutIT = function isOptionItemWithoutIT(lineItem){
				return lineItem.IsOptional && !lineItem.IsOptionalIT && !lineItem.IsDaywork;
			};

			function ignoreQuantityTarget(lineItem) {
				return lineItem.IsLumpsum || lineItem.LineItemType !== estimateMainLineItemType.LineItem;
			}

			function getQuantityTarget(lineItem) {
				return ignoreQuantityTarget(lineItem) ? 1 : ($injector.get('estimateMainService').getEstTypeIsTotalWq() ? lineItem.WqQuantityTarget : lineItem.QuantityTarget);
			}

			service.getQuantityTarget = getQuantityTarget;

			service.calItemBudget = function calItemBudget(item, field){
				let estimateMainExchangeRateService = $injector.get('estimateMainExchangeRateService');
				item.ExchangeRate = estimateMainExchangeRateService.getExchRate(item.BasCurrencyFk);
				let qtyTotalForBudget = getQuantityTotalForBudget(item);
				item.BudgetUnit = estimateMainRoundingService.doRoundingValue('BudgetUnit',item.BudgetUnit);
				let budget = item.BudgetUnit && qtyTotalForBudget ? qtyTotalForBudget * item.BudgetUnit * item.ExchangeRate : item.Budget;

				if(field === 'BudgetUnit' || field === 'IsOptional' || field === 'IsDisabled' || field === 'IsOptionalIT' || item.IsParentDisabled || item.IsDisabled || item.IsOptional){
					item.Budget = service.isOptionItemWithoutIT(item) || item.IsDisabled || item.IsDisabledPrc || item.IsParentDisabled ? 0 : budget;
				}else if(!item.IsFixedBudget && !item.IsFixedBudgetUnit){
					let opt = $injector.get('estimateMainService').getIsFixedBudgetTotalSystemOption();
					item.Budget = service.isOptionItemWithoutIT(item) || item.IsDisabled || item.IsDisabledPrc || item.IsParentDisabled ? item.Budget : (!opt ? budget : ( item.Budget === 0 && item.BudgetUnit > 0 ) ? budget : item.Budget);
				}else{
					item.Budget = service.isOptionItemWithoutIT(item) || item.IsDisabled || item.IsDisabledPrc || item.IsParentDisabled ? 0 : (!item.IsFixedBudget ? budget : item.Budget);
				}
				item.Budget = estimateMainRoundingService.doRoundingValue('Budget',item.Budget);
			};

			function calItemBudgetDiff(item, getChildren, fromResource){
				if(!item){return;}
				let children = getChildren(item);
				if(children && children.length){
					let totalBudget = 0;
					angular.forEach(children, function (res) {
						if(res && !res.IsDisabled && !res.IsDisabledPrc && res.IsBudget){
							totalBudget += res.Budget;
						}
					});
					item.Budget = item.IsFixedBudget ||  item.IsFixedBudgetUnit || item.IsDisabled || item.IsDisabledPrc || service.isOptionItemWithoutIT(item) ? item.Budget : totalBudget;
					item.Budget = estimateMainRoundingService.doRoundingValue('Budget',item.Budget);
					totalBudget = estimateMainRoundingService.doRoundingValue('Budget',totalBudget);
					item.BudgetDifference = item.IsDisabled || item.IsDisabledPrc || service.isOptionItemWithoutIT(item) ? 0 : item.Budget - totalBudget;
					item.BudgetDifference = estimateMainRoundingService.doRoundingValue('BudgetDifference',item.BudgetDifference);
				}else{
					item.BudgetDifference = 0;
				}
				service.calItemUnitBudget(item,undefined,fromResource);
			}

			service.calItemUnitBudget = function calItemUnitBudget(item, field,fromResource){
				let estimateMainExchangeRateService = $injector.get('estimateMainExchangeRateService');
				let qtyTotalForBudget = getQuantityTotalForBudget(item);
				item.ExchangeRate = estimateMainExchangeRateService.getExchRate(item.BasCurrencyFk);

				let budgetUnit = item.Budget && qtyTotalForBudget ? item.Budget/(item.ExchangeRate * qtyTotalForBudget) : item.Budget/item.ExchangeRate;

				if(field === 'Budget' || field === 'IsOptional' || field === 'IsDisabled' || field === 'IsOptionalIT' || field === 'IsDisabledPrc' || item.IsParentDisabled || item.IsDisabled || item.IsOptional){
					item.BudgetUnit = service.isOptionItemWithoutIT(item) || item.IsFixedBudgetUnit || item.IsDisabled || item.IsDisabledPrc || item.IsParentDisabled ? item.BudgetUnit : budgetUnit;
				}else if(!item.IsFixedBudget && !item.IsFixedBudgetUnit){
					let opt = $injector.get('estimateMainService').getIsFixedBudgetTotalSystemOption();
					item.BudgetUnit = service.isOptionItemWithoutIT(item) || item.IsDisabled || item.IsDisabledPrc || item.IsParentDisabled ? item.BudgetUnit : fromResource ? budgetUnit : (opt ? budgetUnit : item.BudgetUnit);
				}else{
					item.BudgetUnit = service.isOptionItemWithoutIT(item) || item.IsFixedBudgetUnit || item.IsDisabled || item.IsDisabledPrc || item.IsParentDisabled ? item.BudgetUnit : ( item.Budget && qtyTotalForBudget ? budgetUnit : item.Budget/item.ExchangeRate );
				}
				item.BudgetUnit = estimateMainRoundingService.doRoundingValue('BudgetUnit',item.BudgetUnit);
			};

			service.calResBudgetDiff = function calResBudgetDiff(res, resList, fromResource){
				function getChildren(parent){
					return _.filter(resList, function(item) {return item.EstResourceFk === parent.Id;});
				}
				function getParent(child){
					return _.find(resList, function(item) {return item.Id === child.EstResourceFk;});
				}
				calItemBudgetDiff(res, getChildren, fromResource);

				// calculate Budget Difference of all Parent Resources
				let parent = getParent(res);
				while(parent){
					calItemBudgetDiff(parent, getChildren, fromResource);
					parent = getParent(parent);
				}
			};

			service.calLineItemBudgetDiff = function calLineItemBudgetDiff(lineItem, resList, fromResource){
				function getChildren(parent){
					let children = _.filter(resList, function(item) {return item.EstResourceFk === null && item.EstLineItemFk === parent.Id;});
					if(children.length>0){
						return children;
					}else{
						let refReslist= basicsLookupdataLookupDescriptorService.getData('refLineItemResources');
						return _.filter(refReslist, function(item) {return item.EstResourceFk === null && item.EstLineItemFk === parent.Id;});
					}
				}
				service.calItemBudget(lineItem);
				calItemBudgetDiff(lineItem, getChildren, fromResource);
				service.calculateBudgetMargin(lineItem);
			};

			service.calResourceAndLineItemBudgetDiff = function calResourceAndLineItemBudgetDiff(res, resList, lineItem){
				service.calResBudgetDiff(res, resList,true);
				service.calLineItemBudgetDiff(lineItem, resList, true);
			};

			service.calculateBudget = function calculateBudget(item, field, projectId, resList, parentLineItem){
				if(!field || !item || !item.Id || (field !== 'Budget' && field !== 'BudgetUnit')){
					return $q.when();
				}
				let estimateMainExchangeRateService = $injector.get('estimateMainExchangeRateService');
				function getChildren(parent){
					return _.filter(resList, function(item) {return item.EstResourceFk === parent.Id;});
				}

				return estimateMainExchangeRateService.loadData(projectId).then(
					function () {
						calculateQuantityTotalOfResources(parentLineItem, resList, getChildren);
						if (field === 'Budget') {
							service.calItemUnitBudget(item, field);// to do calculate qty budget here
						}
						if (field === 'BudgetUnit') {
							service.calItemBudget(item, field);
						}
						if(parentLineItem && parentLineItem.Id){
							return service.calResourceAndLineItemBudgetDiff(item, resList, parentLineItem);
						}else{
							return service.calLineItemBudgetDiff(item, resList);
						}
					});

			};

			service.calculateBudgetMargin = function calculateBudgetMargin(lineItem) {
				if (!lineItem || lineItem === undefined) {
					return;
				}

				lineItem.BudgetMargin = lineItem.Budget - lineItem.DirCostTotal;
				lineItem.BudgetMargin = estimateMainRoundingService.doRoundingValue('BudgetMargin', lineItem.BudgetMargin);
			};

			service.calculateSubItemResourceBudget = function calculateSubItemResourceBudget(item, resList, parentLineItem, projectId){
				if(!item || !item.Id || item.IsFixedBudget){
					return $q.when();
				}
				let children = _.filter(resList, {EstResourceFk : item.Id});
				if(!children || !children.length){
					return $q.when();
				}
				let estimateMainExchangeRateService = $injector.get('estimateMainExchangeRateService');
				return estimateMainExchangeRateService.loadData(projectId).then(
					function () {
						if(parentLineItem && parentLineItem.Id){
							service.calResourceAndLineItemBudgetDiff(item, resList, parentLineItem);
						}else{
							service.calLineItemBudgetDiff(item, resList);
						}
						return service.calItemUnitBudget(item, 'Budget');
					});
			};

			function calCostInLocalCurrency(item){
				$injector.get('basicsMultiCurrencyCommonService').calculateMultiCurrencies(item);
			}

			function calculateResourcesBudgetDifference(resources, lineItem, getChildren){
				angular.forEach(resources, function(res){
					service.calItemBudget(res);
					service.calItemUnitBudget(res);
				});

				angular.forEach(resources, function(res){
					if(res.EstResourceFk !== null){
						let children = getChildren(res);
						if(!children || !children.length){
							service.calResBudgetDiff(res, resources);
						}
					}
				});
				service.calLineItemBudgetDiff(lineItem, resources);
			}

			function updateResourceCore(lineItem, resourceList, getChildrenResources){
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
					calculateResourceTree(resource, lineItem, getChildrenResources, null,1, false, false);
				});

				// calculate budget of all resources
				calculateResourcesBudgetDifference(resourceList, lineItem, getChildrenResources);

				// calculate LineItem Co2 (Sustainability)
				calculateLineItemCo2Total(lineItem, resourceList);
			}

			function calCostUnitLineItem(lineItem, resourceList, getChildrenResources){
				if(!lineItem || !angular.isArray(resourceList)){
					return;
				}

				let resourceTree = _.filter(resourceList, function(resource){
					return resource.EstResourceFk === null;
				});

				_.forEach(resourceTree, function(resource){
					calCostUnitLineItemInTree(resource, lineItem, getChildrenResources, null,1);
				});
			}

			function needToCalculateChildren(resource){
				let isPaAssembly = $injector.get('estimateAssembliesAssemblyTypeDataService').isPaAssembly(resource.EstAssemblyTypeFk);
				let protectedAssemblyAsOneRecordSystemOption = _.find($injector.get('basicCustomizeSystemoptionLookupDataService').getList(), {'Id':10126}).ParameterValue;
				let equipmentAssembliesAsOneRecordSystemOption = $injector.get('estimateMainService').getShowPlantAsOneRecordOption();

				return ((isSubItemOrCompositeAssembly(resource) && !((_.toLower(protectedAssemblyAsOneRecordSystemOption) === 'true' || protectedAssemblyAsOneRecordSystemOption === '1') && isPaAssembly)) || (resource.EstResourceTypeFk === estimateMainResourceType.Plant && !equipmentAssembliesAsOneRecordSystemOption) ||  resource.EstResourceTypeFk === estimateMainResourceType.PlantDissolved  || isEquipmentAssembly(resource));
			}

			function calCostUnitLineItemInTree(resource, lineItem, getChildrenFunc, parentResource, ancestorCostFactor){
				calculateQuantityOfResource(resource, lineItem, parentResource);

				if(needToCalculateChildren(resource))  {
					const children = getChildrenFunc(resource);
					if (children && children.length) {
						let costFactor = angular.isDefined(ancestorCostFactor) && angular.isNumber(ancestorCostFactor) ? ancestorCostFactor : 1;
						costFactor = costFactor * resource.CostFactor1 * resource.CostFactor2;
						angular.forEach(children, function (child) {
							calCostUnitLineItemInTree(child, lineItem, getChildrenFunc, resource, costFactor);
						});
					}
				}

				const parentCostFactor = angular.isDefined(ancestorCostFactor) && angular.isNumber(ancestorCostFactor) ? ancestorCostFactor : 1;
				resource.CostUnitLineItemInternal = resource.QuantityInternal * resource.CostFactor1 * resource.CostFactor2 * resource.CostFactorCc * resource.ExchangeRate * parentCostFactor;
			}

			service.updateResourcesInList = function updateResourcesInList(lineItem, resourceList){
				updateResourceCore(lineItem, resourceList, createGetChildrenFunc(resourceList));
			};

			service.updateResourcesNew = function updateResourcesNew(lineItem, resourceList){
				updateResourceCore(lineItem, resourceList, createGetChildrenFunc(resourceList));
			};

			service.updateResourceNew = function(resource, lineItem, resourceList){

				if(!resource || resource.Id <= 0){
					return [];
				}

				if(!lineItem || !angular.isArray(resourceList)){
					return [];
				}

				let getChildrenResources = createGetChildrenFunc(resourceList);

				let resourcesChanged = calculateResourceCore(resource, lineItem, resourceList);

				// calculate budget of all resources
				calculateResourcesBudgetDifference(resourceList, lineItem, getChildrenResources);

				// calculate LineItem Co2 (Sustainability)
				calculateLineItemCo2Total(lineItem, resourceList);

				return resourcesChanged;
			};

			function isMaterial(resource){
				return resource.EstResourceTypeFk === estimateMainResourceType.Material;
			}

			function isSubItem(resource){
				return resource.EstResourceTypeFk === estimateMainResourceType.SubItem;
			}

			function isAssembly(resource) {
				return resource.EstResourceTypeFk === estimateMainResourceType.Assembly;
			}

			function isEquipmentAssembly(resource) {
				return resource.EstResourceTypeFk === estimateMainResourceType.EquipmentAssembly;
			}

			function isPlantAssembly(resource) {
				return resource.EstResourceTypeFk === estimateMainResourceType.Plant || resource.EstResourceTypeFk === estimateMainResourceType.PlantDissolved;
			}

			function isCompositeAssembly(resource)
			{
				return resource.EstResourceTypeFk === estimateMainResourceType.Assembly && resource.EstAssemblyTypeFk && resource.EstAssemblyTypeFk > 0;
			}

			function isNormalAssembly(resource){
				return resource.EstResourceTypeFk === estimateMainResourceType.Assembly && !resource.EstAssemblyTypeFk;
			}

			function isSubItemOrCompositeAssembly(resource)
			{
				return isSubItem(resource) || isCompositeAssembly(resource);
			}

			function isAdvancedAllowanceCostCode(resource)
			{
				let advancedAllowanceCostCodeFk = $injector.get('estimateMainContextDataService').getAdvancedAllowanceCc();

				if (!advancedAllowanceCostCodeFk) { return false; }

				return (resource.EstResourceTypeFk === estimateMainResourceType.Assembly || resource.EstResourceTypeFk === estimateMainResourceType.CostCode) && resource.MdcCostCodeFk === advancedAllowanceCostCodeFk;
			}

			function getAncestorsCostFactor(ancestors){
				return angular.isArray(ancestors) && ancestors.length > 0 ? ancestors.reduce((accumulator, currentValue) => accumulator * currentValue.CostFactor1 * currentValue.CostFactor2, 1) : 1;
			}

			function getParent(ancestors){
				return angular.isArray(ancestors) && ancestors.length > 0 ? ancestors[0] : null;
			}

			function createGetChildrenFunc(resources){
				return function getChildrenResources(parentResource){
					if(parentResource && angular.isArray(parentResource.EstResources) && parentResource.EstResources.length > 0){
						return parentResource.EstResources;
					}
					let children = _.filter(resources, function(item) {return item.EstResourceFk === parentResource.Id;});
					return _.uniqBy(children, 'Id');
				};
			}

			function calculateResourceCore(resource, lineItem, resources){
				let retValue = [];
				if(!resource || !lineItem || !angular.isArray(resources)){
					return retValue;
				}

				let getChildrenResources = createGetChildrenFunc(resources);

				calCostUnitLineItem(lineItem, resources, getChildrenResources);

				/* collect ancestors */
				let ancestors = [];
				let currentResource = resource;
				while(currentResource && currentResource.EstResourceFk){
					currentResource = _.find(resources, { Id : currentResource.EstResourceFk });
					if(currentResource){
						ancestors.push(currentResource);
					}
				}

				/* calculate current resource and its children */
				let resourceChanged = calculateResourceTree(resource, lineItem, getChildrenResources, getParent(ancestors), getAncestorsCostFactor(ancestors));
				if(angular.isArray(resourceChanged) && resourceChanged.length > 0){
					retValue = retValue.concat(resourceChanged);
				}

				/* calculate ancestors */
				while (ancestors.length > 0){
					let currentItem = ancestors.shift();
					if(isSubItemOrCompositeAssembly(currentItem) || isEquipmentAssembly(currentItem)){
						let children = getChildrenResources(currentItem);
						if(children && children.length){
							/* the costUnit of subItem equal the sum of its children's cost/Unit subItem */
							calculateCostUnitOfSubItem(currentItem, children);
							calculateAdvancedAllowanceOfSubItem(currentItem, children);
							// calculate Parent Resource Co2 (Sustainability)
							calculateParentResourceCo2(currentItem, children);
							// TODO: set original price and quantity
							if(currentItem.Version === 0){
								currentItem.QuantityOriginal = currentItem.Quantity;
								currentItem.CostUnitOriginal = currentItem.CostUnit;
							}
						}else{
							currentItem.CostUnit = 0;
							currentItem.HoursUnit = 0;
							currentItem.DayWorkRateUnit = 0;
							currentItem.Co2Source = 0;
							currentItem.Co2Project = 0;
						}
					}
					calculateCostOfResource(currentItem, lineItem, getParent(ancestors), getAncestorsCostFactor(ancestors));
					calculateResourceCo2Total(currentItem);
					retValue.push(currentItem);
				}

				return retValue;
			}

			function calculateResourceTree(resource, lineItem, getChildrenFunc, parentResource, anscetorCostFactor){

				let retValue = [resource];

				calculateQuantityOfResource(resource, lineItem, parentResource);

				/* subItem */
				if(needToCalculateChildren(resource))  {
					let children = getChildrenFunc(resource);
					if (children && children.length) {
						/* calculate anscetor costFactor */
						let costFactor = angular.isDefined(anscetorCostFactor) && angular.isNumber(anscetorCostFactor) ? anscetorCostFactor : 1;
						costFactor = costFactor * resource.CostFactor1 * resource.CostFactor2;

						angular.forEach(children, function (child) {
							let childrenChanged = calculateResourceTree(child, lineItem, getChildrenFunc, resource, costFactor);
							if (angular.isArray(childrenChanged) && childrenChanged.length > 0) {
								retValue = retValue.concat(childrenChanged);
							}
						});

						/* the costUnit of subItem equal the sum of its children's cost/Unit subitem */
						calculateCostUnitOfSubItem(resource, children);

						calculateAdvancedAllowanceOfSubItem(resource, children);

						// calculate Parent Resource Co2 (Sustainability)
						calculateParentResourceCo2(resource, children);

						// TODO: set original price and quantity
						if (resource.Version === 0) {
							resource.QuantityOriginal = resource.Quantity;
							resource.CostUnitOriginal = resource.CostUnit;
						}
					} else {
						resource.CostUnit = 0;
						resource.HoursUnit = 0;
						resource.DayWorkRateUnit = 0;
						resource.Co2Source = 0;
						resource.Co2Project = 0;
					}
				}

				calculateCostOfResource(resource, lineItem, parentResource, anscetorCostFactor);

				calculateResourceCo2Total(resource);

				return retValue;
			}

			function calculateCostUnitOfSubItem(resource, children){
				resource.CostUnit = 0;
				resource.HoursUnit = 0;
				resource.DayWorkRateUnit = 0;

				angular.forEach(children, function(child){
					// let isCost = child.IsCost || (useParentIsCost && parentIsCost);
					// && isCost
					if(!child.IsDisabled && !child.IsDisabledPrc && !child.IsInformation){
						resource.CostUnit += child.CostUnit * child.QuantityReal * child.CostFactor1 * child.CostFactor2 * child.CostFactorCc * (child.ExchangeRate ? child.ExchangeRate : 1);
						resource.CostUnit =  estimateMainRoundingService.doRoundingValue('CostUnit',resource.CostUnit);
						resource.HoursUnit += child.HoursUnit * child.QuantityReal * child.HourFactor;
						resource.HoursUnit =  estimateMainRoundingService.doRoundingValue('HoursUnit',resource.HoursUnit);
						resource.DayWorkRateUnit += child.DayWorkRateUnit * child.QuantityReal * child.CostFactor1 * child.CostFactor2 * child.CostFactorCc * (child.ExchangeRate ? child.ExchangeRate : 1);
						resource.DayWorkRateUnit =  estimateMainRoundingService.doRoundingValue('DayWorkRateUnit',resource.DayWorkRateUnit);
					}
				});
			}

			function calculateResourceCo2Total(resource)
			{
				if (resource.Co2Source) {
					resource.Co2SourceTotal = resource.Co2Source * resource.QuantityTotal;
					resource.Co2SourceTotal = estimateMainRoundingService.doRoundingValue('QuantityTotal', resource.Co2SourceTotal);
				}
				if (resource.Co2Project) {
					resource.Co2ProjectTotal = resource.Co2Project * resource.QuantityTotal;
					resource.Co2ProjectTotal = estimateMainRoundingService.doRoundingValue('QuantityTotal', resource.Co2ProjectTotal);
				}

				if (resource.EstResources && resource.EstResources.length > 0) {
					let children = resource.EstResources;
					if (children && children.length) {
						angular.forEach(children, function (child) {
							calculateResourceCo2Total(child);

						});
					}
					calculateParentResourceCo2(resource, children);
				}

				if(isSubItem(resource) && (!resource.EstResources || resource.EstResources.length === 0)) {
					resource.Co2SourceTotal = 0;
					resource.Co2ProjectTotal = 0;
					resource.Co2Source = 0;
					resource.Co2Project = 0;
				}

			}

			function calculateParentResourceCo2(resource, children)
			{
				resource.Co2Source = 0;
				resource.Co2Project = 0;

				_.forEach(children, function(child){
					if(!child.IsDisabled && !child.IsDisabledPrc){
						if (child.Co2Source) {
							resource.Co2Source += child.Co2Source * child.QuantityReal;
							resource.Co2Source =  estimateMainRoundingService.doRoundingValue('Quantity',resource.Co2Source);
						}
						if (child.Co2Project) {
							resource.Co2Project += child.Co2Project * child.QuantityReal;
							resource.Co2Project =  estimateMainRoundingService.doRoundingValue('Quantity',resource.Co2Project);
						}
					}
				});
			}

			function calculateLineItemCo2Total(lineItem, resourceList)
			{
				if (!lineItem || !resourceList || resourceList.length === 0) { return; }

				lineItem.Co2SourceTotal = 0;
				lineItem.Co2ProjectTotal = 0;

				let parentResources = _.filter(resourceList, function(item) {
					return item.EstResourceFk === null && item.EstLineItemFk === lineItem.Id && item.EstHeaderFk === lineItem.EstHeaderFk;
				});

				if(parentResources.length === 0){
					parentResources = _.filter(resourceList, function(item) {
						return item.EstResourceFk === null && item.EstLineItemFk === lineItem.EstLineItemFk && item.EstHeaderFk === lineItem.EstHeaderFk;
					});
				}

				_.forEach(parentResources, function(resource){
					if (resource && !resource.IsDisabled && !resource.IsDisabledPrc){
						if (resource.Co2SourceTotal) {
							lineItem.Co2SourceTotal += resource.Co2SourceTotal;
							lineItem.Co2SourceTotal =  estimateMainRoundingService.doRoundingValue('QuantityTotal',lineItem.Co2SourceTotal);
						}
						if (resource.Co2ProjectTotal) {
							lineItem.Co2ProjectTotal += resource.Co2ProjectTotal;
							lineItem.Co2ProjectTotal =  estimateMainRoundingService.doRoundingValue('QuantityTotal',lineItem.Co2ProjectTotal);
						}
					}
				});

				lineItem.Co2TotalVariance = lineItem.Co2SourceTotal - lineItem.Co2ProjectTotal;
			}

			service.calculateResourceLineItemCo2Project = function calculateResourceLineItemCo2Project(resource, resourceList, lineItem) {

				calculateResourceCo2Total(resource);
				function getChildrenResources(parentResource){
					if(parentResource && angular.isArray(parentResource.EstResources) && parentResource.EstResources.length > 0){
						return parentResource.EstResources;
					}
					let children = _.filter(resourceList, function(item) {return item.EstResourceFk === parentResource.Id;});
					return _.uniqBy(children, 'Id');
				}

				return $q.when(calculateLineItemResourceCo2(resource, lineItem, resourceList, getChildrenResources));
			};

			function calculateLineItemResourceCo2(resource, lineItem,resList,getChildrenResources) {
				if(!lineItem || !angular.isArray(resList)){
					return;
				}
				if(resource.EstResourceFk!==null) {
					let findResourceParents = (res) => {
						let parent = _.find(resList, {Id: res.EstResourceFk});
						if (parent) {
							let children = getChildrenResources(parent);
							if (children && children.length) {
								calculateParentResourceCo2(parent, children);
								calculateResourceCo2Total(parent);
							}
							findResourceParents(parent);
						}
					};
					findResourceParents(resource);
				}
				// calculate LineItem Co2 (Sustainability)
				calculateLineItemCo2Total(lineItem, resList);
			}

			function calculateAdvancedAllowanceOfSubItem(resource, children)
			{
				resource.AdvancedAllowanceCostUnit = 0;

				if (resource.EstResourceTypeFk === estimateMainResourceType.SubItem)
				{
					if (!children || children.length === 0) { return; }

					_.forEach(children, function(child){
						if (!child.IsDisabled && !child.IsDisabledPrc && !child.IsInformation){
							resource.AdvancedAllowanceCostUnit += child.AdvancedAllowanceCostUnitSubItem;
						}
					});
					resource.AdvancedAllowanceCostUnit = estimateMainRoundingService.doRoundingValue('AdvancedAllowanceCostUnit',resource.AdvancedAllowanceCostUnit);
				}
				else if (resource.EstResourceTypeFk === estimateMainResourceType.Assembly)
				{
					resource.AdvancedAllowanceCostUnit = resource.CostUnit;
				}
			}

			function calculateCostOfResourceCore(resource, lineItem, parentResource, anscetorCostFactor){
				if(!resource || !lineItem){
					return;
				}
				estimateMainRoundingService.roundInitialCosts(resource);
				estimateMainRoundingService.roundInitialCosts(lineItem);

				resource.CostFactorCc = !isSubItemOrCompositeAssembly(resource) || !isEquipmentAssembly(resource) ? resource.CostFactorCc : 1;

				resource.ExchangeRate = resource.ExchangeRate ? resource.ExchangeRate : 1;

				/* CostInternal = CostReal x (product of all cost factors from all parent levels above) */
				let parentCostFactor =  angular.isDefined(anscetorCostFactor) && angular.isNumber(anscetorCostFactor) ? anscetorCostFactor : 1;

				let costFactor = resource.CostFactor1 * resource.CostFactor2 * resource.CostFactorCc;

				resource.CostReal = resource.CostUnit * costFactor;
				resource.CostReal = estimateMainRoundingService.doRoundingValue('CostReal',resource.CostReal);

				resource.CostInternal = resource.CostReal * resource.ExchangeRate;

				// resource.CostInternal = !isSubItemOrCompositeAssembly(resource) ? resource.CostInternal * parentCostFactor : resource.CostInternal;
				let costInternal = resource.CostInternal * parentCostFactor;
				resource.CostInternal = estimateMainRoundingService.doRoundingValue('CostInternal',costInternal);
				resource.CostUom = angular.copy(costInternal);
				resource.CostUom = estimateMainRoundingService.doRoundingValue('CostUom', resource.CostUom);

				/* CostUnitSubitem  = QuantityReal x CostInternal */
				resource.CostUnitSubItem = isSubItemOrCompositeAssembly(resource) || isEquipmentAssembly(resource) || isPlantAssembly(resource) ? resource.CostInternal * lineItem.CostFactor1 * lineItem.CostFactor2 : resource.QuantityReal * resource.CostInternal;
				resource.CostUnitSubItem = estimateMainRoundingService.doRoundingValue('CostUnitSubItem',resource.CostUnitSubItem);

				/* CostUnitLineItem  = QuantityInternal x CostInternal */
				resource.CostUnitLineItem = resource.QuantityInternal * resource.CostInternal;
				resource.CostUnitLineItem = estimateMainRoundingService.doRoundingValue('CostUnitLineItem',resource.CostUnitLineItem);

				resource.EscResourceCostTotal =  resource.EscResourceCostUnit * resource.QuantityTotal * costFactor * lineItem.CostFactor1 * lineItem.CostFactor2;
				resource.EscResourceCostTotal = estimateMainRoundingService.doRoundingValue('EscResourceCostTotal',resource.EscResourceCostTotal);

				/* CostUnitTarget = QuantityUnitTarget x CostInternal */
				resource.CostUnitTarget = resource.QuantityUnitTarget * resource.CostInternal;
				resource.CostUnitTarget = estimateMainRoundingService.doRoundingValue('CostUnitTarget',resource.CostUnitTarget);

				resource.CostTotalInternal = (resource.QuantityTotal * costFactor * resource.ExchangeRate * parentCostFactor * lineItem.CostFactor1 * lineItem.CostFactor2).toFixed(7) - 0;

				resource.CostUnitLineItemInternal = resource.QuantityInternal * costFactor * resource.ExchangeRate * parentCostFactor;

				/* CostTotal  = QuantityTotal x  CostInternal  x CostFactor1 (of parent Line Item) x CostFactor2 (of parent Line Item) */
				resource.CostTotal = resource.IsInformation ? 0 : (resource.QuantityTotal * resource.CostInternal * lineItem.CostFactor1 * lineItem.CostFactor2);
				resource.CostTotal = estimateMainRoundingService.doRoundingValue('CostTotal',resource.CostTotal);

				// Calculate Resource OriginalCurrency
				/* CostTotalOc  = QuantityTotal x  resource.CostReal  x CostFactor1 (of parent Line Item) x CostFactor2 (of parent Line Item) */
				resource.CostTotalOc =  resource.IsInformation ? 0 : !isSubItemOrCompositeAssembly(resource) || !isEquipmentAssembly(resource) ? (resource.QuantityTotal * resource.CostReal * lineItem.CostFactor1 * lineItem.CostFactor2): 0;
				resource.CostTotalOc =  estimateMainRoundingService.doRoundingValue('CostTotalOc',resource.CostTotalOc);

				resource.CostTotalCurrency =  resource.IsInformation ? 0 : isSubItemOrCompositeAssembly(resource) || isEquipmentAssembly(resource) ? resource.CostTotal : resource.QuantityTotal * resource.CostReal * parentCostFactor * lineItem.CostFactor1 * lineItem.CostFactor2;
				resource.CostTotalCurrency =  estimateMainRoundingService.doRoundingValue('CostTotalCurrency',resource.CostTotalCurrency);

				resource.HoursUnitSubItem = resource.QuantityReal * resource.HoursUnit * resource.HourFactor;
				resource.HoursUnitSubItem =  estimateMainRoundingService.doRoundingValue('HoursUnitSubItem',resource.HoursUnitSubItem);

				resource.HoursUnitLineItem = resource.QuantityInternal * resource.HoursUnit * resource.HourFactor;
				resource.HoursUnitLineItem =  estimateMainRoundingService.doRoundingValue('HoursUnitLineItem',resource.HoursUnitLineItem);

				resource.HoursUnitTarget = resource.QuantityUnitTarget * resource.HoursUnit * resource.HourFactor;
				resource.HoursUnitTarget =  estimateMainRoundingService.doRoundingValue('HoursUnitTarget',resource.HoursUnitTarget);

				resource.HoursTotal =  resource.IsInformation ? 0 : resource.QuantityTotal * resource.HoursUnit * resource.HourFactor;
				resource.HoursTotal = estimateMainRoundingService.doRoundingValue('HoursTotal',resource.HoursTotal);

				resource.DayWorkRateTotal =  resource.IsInformation ? 0 : resource.QuantityTotal * resource.DayWorkRateUnit * costFactor * parentCostFactor * resource.ExchangeRate * lineItem.CostFactor1 * lineItem.CostFactor2;
				resource.DayWorkRateTotal = estimateMainRoundingService.doRoundingValue('DayWorkRateTotal',resource.DayWorkRateTotal);

			}

			function calculateCostOfResource(resource, lineItem, parentResource, anscetorCostFactor){
				if(!resource || !lineItem){
					return;
				}

				calculateCostOfResourceCore(resource, lineItem, parentResource, anscetorCostFactor);

				let costFactor = resource.CostFactor1 * resource.CostFactor2 * resource.CostFactorCc;

				/* CostInternal = CostReal x (product of all cost factors from all parent levels above) */
				let parentCostFactor = angular.isDefined(anscetorCostFactor) && angular.isNumber(anscetorCostFactor) ? anscetorCostFactor : 1;

				// MultiCurrency
				calCostInLocalCurrency(resource);

				/* if current resource is advanced allowance, then AdvancedAllowanceCostUnitLineItem equal CostUnitLineItem */
				if (isAdvancedAllowanceCostCode(resource))
				{
					let activeAllowance = $injector.get('estimateMainContextDataService').getAllowanceEntity();

					if(resource.IsIndirectCost && _.isEmpty(activeAllowance)){
						resource.AdvancedAllowanceCostUnit = (lineItem.AdvancedAllowance === 0 && lineItem.AdvancedAll !== 0) ? 0 : resource.CostUnit;
					}else {
						resource.AdvancedAllowanceCostUnit = 0;
					}
				}
				else
				{
					resource.AdvancedAllowanceCostUnit = resource.EstResourceTypeFk === estimateMainResourceType.SubItem ? resource.AdvancedAllowanceCostUnit : 0;
				}
				resource.AdvancedAllowanceCostUnit = estimateMainRoundingService.doRoundingValue('AdvancedAllowanceCostUnit',resource.AdvancedAllowanceCostUnit);

				resource.AdvancedAllowanceCostUnitSubItem = resource.QuantityReal * resource.AdvancedAllowanceCostUnit * costFactor * resource.ExchangeRate * (!isSubItemOrCompositeAssembly(resource) || !isEquipmentAssembly(resource) ? parentCostFactor : 1);
				resource.AdvancedAllowanceCostUnitSubItem = estimateMainRoundingService.doRoundingValue('AdvancedAllowanceCostUnitSubItem',resource.AdvancedAllowanceCostUnitSubItem);
				resource.AdvancedAllowanceCostUnitLineItem = resource.QuantityInternal * resource.AdvancedAllowanceCostUnit * costFactor * resource.ExchangeRate * (!isSubItemOrCompositeAssembly(resource) || !isEquipmentAssembly(resource) ? parentCostFactor : 1);
				resource.AdvancedAllowanceCostUnitLineItem = estimateMainRoundingService.doRoundingValue('AdvancedAllowanceCostUnitLineItem',resource.AdvancedAllowanceCostUnitLineItem);
			}

			function calculateQuantityReal(resource){
				/* if resource is subitem, set quantityFactorCc = 1 */
				resource.QuantityFactorCc = resource && (isSubItemOrCompositeAssembly(resource) || isEquipmentAssembly(resource) || isPlantAssembly(resource)) ? 1 : resource.QuantityFactorCc;

				/** QuantityReal:Resources:QuantityReal = Quantity x QuantityFactor(1,2,3,4) x ProduktivityFactor / EfficiencyFactor(1, 2) x QuantityFactorCC
				 *Subitems:QuantityReal = Quantity x QuantityFactor(1,2,3,4) x ProduktivityFactor / EfficiencyFactor(1, 2)
				 */
				resource.QuantityReal = (resource.Quantity * resource.QuantityFactor1 * resource.QuantityFactor2 * resource.QuantityFactor3 * resource.QuantityFactor4 * resource.ProductivityFactor * resource.QuantityFactorCc)/(resource.EfficiencyFactor1 * resource.EfficiencyFactor2);

				/* if resource is Disabled, quantityReal equal 0 */
				resource.QuantityReal = !resource.IsDisabled && !resource.IsDisabledPrc ? resource.QuantityReal : 0;

				return resource.QuantityReal;
			}

			function calculateQuantityOfLumpsumResource(resource, lineItem, parentResource){

				/* calculate quantityReal */
				calculateQuantityReal(resource);

				/* if resource is lumpsum, quantityTotal equal quantityReal */
				resource.QuantityTotal = resource.QuantityReal;

				if (service.isOptionItemWithoutIT(lineItem) || lineItem.IsDisabled)
				{
					let lineItemQtyTarget = getQuantityTarget(lineItem);

					resource.QuantityUnitTarget = resource.QuantityTotal /  (lineItem.IsLumpsum ?  1 : lineItemQtyTarget);

					let quantityUnitTaret = lineItem.Quantity * lineItem.QuantityFactor1 * lineItem.QuantityFactor2 * lineItem.QuantityFactor3 * lineItem.QuantityFactor4 * lineItem.ProductivityFactor;

					resource.QuantityInternal = quantityUnitTaret !== 0 ? resource.QuantityUnitTarget / quantityUnitTaret : 0;

					if (parentResource !== null) {
						resource.QuantityReal = parentResource.QuantityInternal !== 0 ? resource.QuantityInternal / parentResource.QuantityInternal : 0;
					}
					else {
						resource.QuantityReal = resource.QuantityInternal;
					}

					resource.QuantityUnitTarget = 0;
					resource.QuantityTotal = 0;
				}
				else if(resource.QuantityTotal === 0 || lineItem.QuantityTotal === 0){

					resource.QuantityInternal = 0;

					resource.QuantityUnitTarget = 0;

					resource.QuantityReal = 0;
				}else {
					let lineItemQtyTarget = getQuantityTarget(lineItem);

					resource.QuantityUnitTarget = resource.QuantityTotal / lineItemQtyTarget;

					resource.QuantityInternal = resource.QuantityUnitTarget / lineItem.QuantityUnitTarget;

					if (parentResource) {
						resource.QuantityReal = resource.QuantityInternal / parentResource.QuantityInternal;
					} else {
						resource.QuantityReal = resource.QuantityInternal;
					}
				}
			}

			function calculateQuantityOfNormalResource(resource, lineItem, parentResource){

				/* calculate quantityReal */
				calculateQuantityReal(resource);

				if(parentResource){

					/* Next levels:QuantityInternal = QuantityReal * QuantityInternal(Level-1) */
					resource.QuantityInternal = resource.QuantityReal * parentResource.QuantityInternal;
				}else{

					/* First Level:QuantityInternal =  QuantityReal */
					resource.QuantityInternal = resource.QuantityReal;
				}

				/* QuantityUnitTarget  = QuantityUnitTarget (of parent Line Item) x QuantityInternal */
				resource.QuantityUnitTarget = lineItem.QuantityUnitTarget * resource.QuantityInternal;

				/* QuantityTotal = QuantityTotal (of parent Line Item) x QuantityInternal */
				resource.QuantityTotal = service.isOptionItemWithoutIT(lineItem) ? 0 : lineItem.QuantityTotal * resource.QuantityInternal;
				resource.QuantityTotal = estimateMainRoundingService.doRoundingValue('QuantityTotal',resource.QuantityTotal);
			}

			function calculateQuantityTotalOfResources(lineItem,resources, getChildren) {
				if (lineItem === null) {
					return;
				}
				if (resources !== null) {
					let resourcesOfFirstLevel = _.filter(resources, function(item) { return item.EstResourceFk === null; });
					calculateQuantityTotalOfResourcesInternal(lineItem, resourcesOfFirstLevel, null, getChildren);
				}
			}

			function calculateQuantityTotalOfResourcesInternal(lineItem, resources, parent,getChildren) {
				if (lineItem === null) {
					return;
				}

				if (resources !== null) {
					angular.forEach(resources, function(res){
						calculateQuantityOfResource(res,lineItem, parent);

						/* subItem */
						if (isSubItemOrCompositeAssembly(res) || isEquipmentAssembly(res) || isPlantAssembly(res)) {
							let children = getChildren(res);

							if (children !== null) {
								calculateQuantityTotalOfResourcesInternal(lineItem, children, res, getChildren);
							}
						}
					});
				}
			}

			function calculateQuantityOfResource(resource, lineItem, parentResource){
				estimateMainRoundingService.roundInitialQuantities(resource);
				if(resource.IsLumpsum){
					calculateQuantityOfLumpsumResource(resource, lineItem, parentResource);
				}else{
					calculateQuantityOfNormalResource(resource, lineItem, parentResource);
				}
			}

			function initializeLineItemUnit(lineItem)
			{
				if (!lineItem) {
					return;
				}

				lineItem.CostUnit = 0;

				lineItem.HoursUnit = 0;

				lineItem.EntCostUnit = 0;

				lineItem.EntHoursUnit = 0;

				lineItem.DruCostUnit = 0;

				lineItem.DruHoursUnit = 0;

				lineItem.DirCostUnit = 0;

				lineItem.DirHoursUnit = 0;

				lineItem.IndCostUnit = 0;

				lineItem.IndHoursUnit = 0;

				lineItem.AdvancedAllowanceCostUnit = 0;

				lineItem.MarkupCostUnit = 0;

				lineItem.DayWorkRateUnit = 0;

				lineItem.DayWorkRateTotal = 0;

				lineItem.AllowanceUnit = 0;

				lineItem.Co2SourceTotal = 0;

				lineItem.Co2ProjectTotal = 0;

				lineItem.EscalationCostUnit = 0;
			}

			/* jshint -W074 */ // ignore cyclomatic complexity warning
			function calculateLineItemTotal(lineItem, isTotalWq)
			{
				if (!lineItem) {
					return;
				}

				// check IsTotalWq flag of Estimate Type to consider AQ or WQ quantity target in calculation
				let qtyTarget = getQuantityTarget(lineItem);

				lineItem.EntCostUnitTarget = lineItem.QuantityUnitTarget * lineItem.EntCostUnit * lineItem.CostFactor1 * lineItem.CostFactor2;
				lineItem.EntCostUnitTarget = estimateMainRoundingService.doRoundingValue('EntCostUnitTarget',lineItem.EntCostUnitTarget);

				lineItem.EntCostTotal = service.isOptionItemWithoutIT(lineItem) ? 0 : qtyTarget * lineItem.EntCostUnitTarget;
				lineItem.EntCostTotal = estimateMainRoundingService.doRoundingValue('EntCostTotal',lineItem.EntCostTotal);

				lineItem.EntHoursUnitTarget = lineItem.EntHoursUnit * lineItem.QuantityUnitTarget;
				lineItem.EntHoursUnitTarget = estimateMainRoundingService.doRoundingValue('EntHoursUnitTarget',lineItem.EntHoursUnitTarget);
				lineItem.EntHoursTotal = service.isOptionItemWithoutIT(lineItem) ? 0 : qtyTarget * lineItem.EntHoursUnitTarget;
				lineItem.EntHoursTotal =  estimateMainRoundingService.doRoundingValue('EntHoursTotal',lineItem.EntHoursTotal);

				lineItem.DruCostUnitTarget = lineItem.QuantityUnitTarget * lineItem.DruCostUnit * lineItem.CostFactor1 * lineItem.CostFactor2;
				lineItem.DruCostUnitTarget =  estimateMainRoundingService.doRoundingValue('DruCostUnitTarget',lineItem.DruCostUnitTarget);
				lineItem.DruCostTotal = service.isOptionItemWithoutIT(lineItem) ? 0 : qtyTarget * lineItem.DruCostUnitTarget;
				lineItem.DruCostTotal = estimateMainRoundingService.doRoundingValue('DruCostTotal',lineItem.DruCostTotal);

				lineItem.DruHoursUnitTarget = lineItem.DruHoursUnit * lineItem.QuantityUnitTarget;
				lineItem.DruHoursUnitTarget = estimateMainRoundingService.doRoundingValue('DruHoursUnitTarget',lineItem.DruHoursUnitTarget );
				lineItem.DruHoursTotal = service.isOptionItemWithoutIT(lineItem) ? 0 : qtyTarget * lineItem.DruHoursUnitTarget;
				lineItem.DruHoursTotal = estimateMainRoundingService.doRoundingValue('DruHoursTotal',lineItem.DruHoursTotal);

				lineItem.IndCostUnitTarget = lineItem.QuantityUnitTarget * lineItem.IndCostUnit * lineItem.CostFactor1 * lineItem.CostFactor2;
				lineItem.IndCostUnitTarget = estimateMainRoundingService.doRoundingValue('IndCostUnitTarget',lineItem.IndCostUnitTarget);
				lineItem.IndCostTotal = service.isOptionItemWithoutIT(lineItem) ? 0 : qtyTarget * lineItem.IndCostUnitTarget;
				lineItem.IndCostTotal =  estimateMainRoundingService.doRoundingValue('IndCostTotal',lineItem.IndCostTotal);

				lineItem.IndHoursUnitTarget = lineItem.IndHoursUnit * lineItem.QuantityUnitTarget;
				lineItem.IndHoursUnitTarget =  estimateMainRoundingService.doRoundingValue('IndHoursUnitTarget',lineItem.IndHoursUnitTarget);
				lineItem.IndHoursTotal = service.isOptionItemWithoutIT(lineItem) ? 0 : qtyTarget * lineItem.IndHoursUnitTarget;
				lineItem.IndHoursTotal = estimateMainRoundingService.doRoundingValue('IndHoursTotal',lineItem.IndHoursTotal);

				lineItem.DirCostUnit = lineItem.EntCostUnit + lineItem.DruCostUnit;
				lineItem.DirCostUnit = estimateMainRoundingService.doRoundingValue('DirCostUnit',lineItem.DirCostUnit);
				lineItem.DirHoursUnit = lineItem.EntHoursUnit + lineItem.DruHoursUnit;
				lineItem.DirHoursUnit =  estimateMainRoundingService.doRoundingValue('DirHoursUnit',lineItem.DirHoursUnit);

				lineItem.DirCostUnitTarget = lineItem.QuantityUnitTarget * lineItem.DirCostUnit * lineItem.CostFactor1 * lineItem.CostFactor2;
				lineItem.DirCostUnitTarget =  estimateMainRoundingService.doRoundingValue('DirCostUnitTarget',lineItem.DirCostUnitTarget);
				lineItem.DirCostTotal = service.isOptionItemWithoutIT(lineItem) ? 0 : qtyTarget * lineItem.DirCostUnitTarget;
				lineItem.DirCostTotal =  estimateMainRoundingService.doRoundingValue('DirCostTotal',lineItem.DirCostTotal);

				lineItem.DirHoursUnitTarget = lineItem.DirHoursUnit * lineItem.QuantityUnitTarget;
				lineItem.DirHoursUnitTarget = estimateMainRoundingService.doRoundingValue('DirHoursUnitTarget',lineItem.DirHoursUnitTarget);
				lineItem.DirHoursTotal = service.isOptionItemWithoutIT(lineItem) ? 0 : qtyTarget * lineItem.DirHoursUnitTarget;
				lineItem.DirHoursTotal = estimateMainRoundingService.doRoundingValue('DirHoursTotal',lineItem.DirHoursTotal);

				lineItem.CostUnit = lineItem.DirCostUnit + lineItem.IndCostUnit;
				lineItem.CostUnit =  estimateMainRoundingService.doRoundingValue('CostUnit',lineItem.CostUnit);
				lineItem.HoursUnit = lineItem.DirHoursUnit + lineItem.IndHoursUnit;
				lineItem.HoursUnit =estimateMainRoundingService.doRoundingValue('HoursUnit',lineItem.HoursUnit);

				lineItem.CostUnitTarget = lineItem.QuantityUnitTarget * lineItem.CostUnit * lineItem.CostFactor1 * lineItem.CostFactor2;
				lineItem.CostUnitTarget =  estimateMainRoundingService.doRoundingValue('CostUnitTarget',lineItem.CostUnitTarget);
				lineItem.CostTotal = service.isOptionItemWithoutIT(lineItem) ? 0 : qtyTarget * lineItem.CostUnitTarget;
				lineItem.CostTotal = estimateMainRoundingService.doRoundingValue('CostTotal',lineItem.CostTotal);

				lineItem.HoursUnitTarget = lineItem.HoursUnit * lineItem.QuantityUnitTarget;
				lineItem.HoursUnitTarget = estimateMainRoundingService.doRoundingValue('HoursUnitTarget',lineItem.HoursUnitTarget);
				lineItem.HoursTotal = service.isOptionItemWithoutIT(lineItem) ? 0 : qtyTarget * lineItem.HoursUnitTarget;
				lineItem.HoursTotal =  estimateMainRoundingService.doRoundingValue('HoursTotal',lineItem.HoursTotal);

				/* calculate AdvancedAllowance */
				lineItem.AdvancedAllowance = service.isOptionItemWithoutIT(lineItem) ? 0 : qtyTarget * lineItem.QuantityUnitTarget * lineItem.AdvancedAllowanceCostUnit * lineItem.CostFactor1 * lineItem.CostFactor2;
				lineItem.AdvancedAllowance =  estimateMainRoundingService.doRoundingValue('AdvancedAllowance',lineItem.AdvancedAllowance);

				/* calculate Margin */
				lineItem.MarkupCostUnitTarget = lineItem.QuantityUnitTarget * lineItem.MarkupCostUnit * lineItem.CostFactor1 * lineItem.CostFactor2;
				lineItem.MarkupCostUnitTarget =  estimateMainRoundingService.doRoundingValue('MarkupCostUnitTarget',lineItem.MarkupCostUnitTarget);
				lineItem.MarkupCostTotal = service.isOptionItemWithoutIT(lineItem) ? 0 : qtyTarget * lineItem.MarkupCostUnitTarget;
				lineItem.MarkupCostTotal = estimateMainRoundingService.doRoundingValue('MarkupCostTotal',lineItem.MarkupCostTotal);

				/* calculate Escalation */
				lineItem.EscalationCostTotal = lineItem.EscalationCostUnit * qtyTarget * lineItem.QuantityUnitTarget * lineItem.CostFactor1 * lineItem.CostFactor2;
				lineItem.EscalationCostTotal = estimateMainRoundingService.doRoundingValue('EscalationCostTotal',lineItem.EscalationCostTotal);

				/* calculate AdvancedAll and ManualMarkup */
				lineItem.AdvancedAllUnitItem = lineItem.QuantityUnitTarget * lineItem.AdvancedAllUnit * lineItem.CostFactor1 * lineItem.CostFactor2;
				lineItem.AdvancedAllUnitItem =  estimateMainRoundingService.doRoundingValue('AdvancedAllUnitItem',lineItem.AdvancedAllUnitItem);
				lineItem.AdvancedAll = service.isOptionItemWithoutIT(lineItem) ? 0 : qtyTarget * lineItem.AdvancedAllUnitItem;
				lineItem.AdvancedAll = estimateMainRoundingService.doRoundingValue('AdvancedAll',lineItem.AdvancedAll);

				lineItem.ManualMarkupUnitItem = lineItem.QuantityUnitTarget * lineItem.ManualMarkupUnit * lineItem.CostFactor1 * lineItem.CostFactor2;
				lineItem.ManualMarkupUnitItem = estimateMainRoundingService.doRoundingValue('ManualMarkupUnitItem', lineItem.ManualMarkupUnitItem);
				lineItem.ManualMarkup = qtyTarget * lineItem.ManualMarkupUnitItem; // + URD
				lineItem.ManualMarkup = estimateMainRoundingService.doRoundingValue('ManualMarkup', lineItem.ManualMarkup);


				/* set the standard grandtotal as 0, while the line item is GC */
				lineItem.StandardGrandCostUnit = lineItem.IsGc || lineItem.IsIncluded ? 0 : lineItem.CostUnit + lineItem.MarkupCostUnit + lineItem.AllowanceUnit;
				lineItem.StandardGrandCostUnit = estimateMainRoundingService.doRoundingValue('GrandCostUnit',lineItem.StandardGrandCostUnit);
				lineItem.StandardGrandCostUnitTarget = lineItem.IsGc || lineItem.IsIncluded ? 0 : lineItem.QuantityUnitTarget * lineItem.StandardGrandCostUnit * lineItem.CostFactor1 * lineItem.CostFactor2;
				lineItem.StandardGrandCostUnitTarget =  estimateMainRoundingService.doRoundingValue('GrandCostUnitTarget',lineItem.StandardGrandCostUnitTarget);
				lineItem.StandardGrandTotal = lineItem.IsGc || lineItem.IsIncluded || service.isOptionItemWithoutIT(lineItem) ? 0 : (qtyTarget * lineItem.StandardGrandCostUnitTarget);
				lineItem.StandardGrandTotal =  estimateMainRoundingService.doRoundingValue('GrandTotal',lineItem.StandardGrandTotal);

				/* set the grandtotal as 0, while the line item is GC */
				if(lineItem.IsFixedPrice){
					lineItem.GrandCostUnitTarget = estimateMainRoundingService.doRoundingValue('GrandCostUnitTarget',lineItem.GrandCostUnitTarget);
					let quantityTargetFactor = lineItem.QuantityUnitTarget * lineItem.CostFactor1 * lineItem.CostFactor2;
					lineItem.GrandCostUnit = !quantityTargetFactor ? 0 : lineItem.GrandCostUnitTarget / quantityTargetFactor;
					lineItem.GrandCostUnit = estimateMainRoundingService.doRoundingValue('GrandCostUnit',lineItem.GrandCostUnit);
				}else{
					lineItem.GrandCostUnit = lineItem.StandardGrandCostUnit;
					lineItem.GrandCostUnit = estimateMainRoundingService.doRoundingValue('GrandCostUnit',lineItem.GrandCostUnit);
					lineItem.GrandCostUnitTarget = lineItem.IsGc || lineItem.IsIncluded ? 0 : lineItem.QuantityUnitTarget * lineItem.GrandCostUnit * lineItem.CostFactor1 * lineItem.CostFactor2;
					lineItem.GrandCostUnitTarget =  estimateMainRoundingService.doRoundingValue('GrandCostUnitTarget',lineItem.GrandCostUnitTarget);
				}

				lineItem.GrandTotal = lineItem.IsGc || lineItem.IsIncluded || service.isOptionItemWithoutIT(lineItem) ? 0 : (qtyTarget * lineItem.GrandCostUnitTarget);
				lineItem.GrandTotal =  estimateMainRoundingService.doRoundingValue('GrandTotal',lineItem.GrandTotal);

				/* calculate URD */
				lineItem.URD = lineItem.GrandTotal.toFixed(6) - lineItem.StandardGrandTotal.toFixed(6);
				lineItem.URDUnitItem = lineItem.GrandCostUnitTarget.toFixed(6) - lineItem.StandardGrandCostUnitTarget.toFixed(6);

				/* calculate Margin */
				lineItem.Margin1 = service.isOptionItemWithoutIT(lineItem) || lineItem.IsGc ? 0 : lineItem.Revenue > 0 ? lineItem.Revenue - lineItem.CostTotal - lineItem.Gc : 0;
				lineItem.Margin1 = estimateMainRoundingService.doRoundingValue('Margin1',lineItem.Margin1);
				lineItem.Margin2 = service.isOptionItemWithoutIT(lineItem) ? 0 : lineItem.Revenue > 0 ? lineItem.Revenue - lineItem.GrandTotal : 0;
				lineItem.Margin2 = estimateMainRoundingService.doRoundingValue('Margin2',lineItem.Margin2 );

				/* calculate Budget Margin */
				lineItem.BudgetMargin = lineItem.Budget - lineItem.DirCostTotal;
				lineItem.BudgetMargin = estimateMainRoundingService.doRoundingValue('BudgetMargin',lineItem.BudgetMargin);
			}

			function getLiQuantityTotalForBudget(lineItem) {
				if (!lineItem) {
					return;
				}
				if (lineItem.IsDisabled) {
					lineItem.QuantityTotalBudget = 0;
				} else {
					let quantityTarget = lineItem.IsLumpsum ? 1
						: $injector.get('estimateMainService').getEstTypeIsTotalAQBudget() ? lineItem.QuantityTarget
							: getQuantityTarget(lineItem);
					// if the type of item.Quantity isn't [object Number],such as [object Object]
					let quantity = (Object.prototype.toString.call(lineItem.Quantity) === '[object Number]') ? lineItem.Quantity : 1;
					let quantityUnitTarget = quantity * lineItem.QuantityFactor1 * lineItem.QuantityFactor2 * lineItem.QuantityFactor3 * lineItem.QuantityFactor4 * lineItem.ProductivityFactor;
					lineItem.QuantityTotalBudget = service.isOptionItemWithoutIT(lineItem) ? 0 : quantityTarget * quantityUnitTarget;
					lineItem.QuantityTotalBudget = estimateMainRoundingService.doRoundingValue('QuantityTotal', lineItem.QuantityTotalBudget);
				}
				return lineItem.QuantityTotalBudget;
			}

			function getResQuantityTotalForBudget(res, lineItem) {
				if (!lineItem || !res) {
					return;
				}
				getLiQuantityTotalForBudget(lineItem);

				/* QuantityTotal = QuantityTotal (of parent Line Item) x QuantityInternal */
				// resource.QuantityTotal =  lineItem.QuantityTotal * resource.QuantityInternal;
				res.QuantityTotalBudget = lineItem.QuantityTotalBudget * res.QuantityInternal;
				res.QuantityTotalBudget = estimateMainRoundingService.doRoundingValue('QuantityTotal', res.QuantityTotalBudget);
				return res.QuantityTotalBudget;
			}

			function getQuantityTotalForBudget(item) {
				if (!item) {
					return;
				}
				// eslint-disable-next-line no-prototype-builtins
				if(item.hasOwnProperty('EstResourceTypeFk')){
					let parentLineItem = _.find($injector.get('estimateMainService').getList(), function(liItem){
						if(liItem && liItem.Id === item.EstLineItemFk && liItem.EstHeaderFk === item.EstHeaderFk){
							return liItem;
						}
						return null;
					});
					return getResQuantityTotalForBudget(item, parentLineItem);
				}else{
					return getLiQuantityTotalForBudget(item);
				}
			}

			service.calculateCostOfResourceCore = calculateCostOfResourceCore;
			service.calculateQuantityOfResource = calculateQuantityOfResource;
			service.isSubItem = isSubItem;
			service.isEquipmentAssembly = isEquipmentAssembly;
			service.isPlantAssembly = isPlantAssembly;
			service.isAssembly = isAssembly;
			service.isNormalAssembly = isNormalAssembly;
			service.isCompositeAssembly = isCompositeAssembly;
			service.initializeLineItemUnit = initializeLineItemUnit;
			service.calculateLineItemTotal = calculateLineItemTotal;
			service.calculateLineItemCo2Total = calculateLineItemCo2Total;
			service.calculateResourceCo2Total = calculateResourceCo2Total;
			service.calculateParentResourceCo2 = calculateParentResourceCo2;
			service.calculateResourceCore = calculateResourceCore;
			service.getAncestorsCostFactor = getAncestorsCostFactor;
			service.getParent = getParent;
			service.isMaterial = isMaterial;

			return service;
		}]);
})(angular);
