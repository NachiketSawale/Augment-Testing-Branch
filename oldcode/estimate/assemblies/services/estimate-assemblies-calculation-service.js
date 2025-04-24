/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular){
	/* global globals,_ */
	'use strict';

	let moduleName = 'estimate.assemblies';

	angular.module(moduleName).factory('estimateAssembliesCalculationService',['$q', '$http', '$injector','estimateMainCompleteCalculationService', 'estimateMainRoundingService',
		function($q, $http, $injector, estimateMainCompleteCalculationService, estimateMainRoundingService){
			let service = {};

			function calculateLineItemAndResourcesOfAssembly(lineItem, resources, assemblyType){

				/* validate lineItem is not null */
				if(!lineItem) {
					return;
				}

				/* calculate quantity of lineItem */
				calculateQuantityOfLineItem(lineItem);

				/* calculate quantity and cost of resources */
				updateResourcesOfAssembly(lineItem, resources);

				/* calculate cost and hour of lineItem */
				calculateLineItemTotal(lineItem, resources);

				/* calculate user defined column value in lineitem and resource */
				getResourceUserDefinedColumnService(assemblyType).calculateResources(lineItem, resources);
			}

			function createGetChildrenFunc(resourceList){
				return function getChildrenResources(parentResource){
					if(parentResource && angular.isArray(parentResource.EstResources) && parentResource.EstResources.length > 0){
						return parentResource.EstResources;
					}
					let children = _.filter(resourceList, function(item) {return item.EstResourceFk === parentResource.Id;});
					return _.uniqBy(children, 'Id');
				};
			}

			function updateResourcesOfAssembly(lineItem, resourceList){
				updateResourceOfAssemblyCore(lineItem, resourceList, createGetChildrenFunc(resourceList));
			}

			function calculateResourceOfAssembly(resource, lineItem, resources, assemblyType){
				/* calculate resources */
				let resourcesChanged = calculateResourceCoreOfAssembly(resource, lineItem, resources);

				/* calculate cost and hour of lineItem */
				calculateLineItemTotal(lineItem, resources);

				/* calculate user defined column value in resource  */
				getResourceUserDefinedColumnService(assemblyType).calculate(lineItem, resource, resources);

				return resourcesChanged;
			}

			function getResourceUserDefinedColumnService(assemblyType){
				if(assemblyType){
					switch (assemblyType) {
						case $injector.get('estimateCommonAssemblyType').ProjectPlantAssembly:
							return $injector.get('projectPlantAssemblyResourceDynamicUserDefinedColumnService');
						case $injector.get('estimateCommonAssemblyType').ProjectAssembly:
							return $injector.get('projectAssemblyResourceDynamicUserDefinedColumnService');
						default:
							return $injector.get('estimateAssembliesResourceDynamicUserDefinedColumnService');
					}
				}
				return $injector.get('estimateAssembliesResourceDynamicUserDefinedColumnService');
			}

			function updateResourceOfAssembly(resource, lineItem, resourceList){
				let retValue = [];
				if(!resource || resource.Id <= 0){
					return retValue;
				}

				if(!lineItem || !angular.isArray(resourceList)){
					return retValue;
				}

				let rootParent = getRootParent(resource, resourceList);

				retValue = calculateResourceTreeOfAssembly(rootParent, lineItem, createGetChildrenFunc(resourceList), null, 1);

				// calculate LineItem Co2 (Sustainability)
				estimateMainCompleteCalculationService.calculateLineItemCo2Total(lineItem, resourceList);

				return retValue;
			}

			function calculateQuantityOfLineItem(lineItem){
				if(!lineItem){return;}

				let quantityTarget = 1;

				if(lineItem.IsDisabled){

					lineItem.QuantityUnitTarget = 0;

					lineItem.QuantityTotal = quantityTarget * lineItem.QuantityUnitTarget;
				}
				else {

					// if the type of item.Quantity isn't [object Number],such as [object Object]
					lineItem.Quantity = (Object.prototype.toString.call(lineItem.Quantity) === '[object Number]') ? lineItem.Quantity : 1;
					estimateMainRoundingService.roundInitialQuantities(lineItem);

					lineItem.QuantityUnitTarget = (lineItem.Quantity * lineItem.QuantityFactor1 * lineItem.QuantityFactor2 * lineItem.QuantityFactor3 * lineItem.QuantityFactor4 * lineItem.ProductivityFactor);
					doRoundingValues(['QuantityUnitTarget'], lineItem);

					let qtyTarget = lineItem.IsLumpsum ? 1: quantityTarget;

					lineItem.QuantityTotal = estimateMainCompleteCalculationService.isOptionItemWithoutIT(lineItem) ? 0 : qtyTarget * lineItem.QuantityUnitTarget;
					doRoundingValues(['QuantityTotal'], lineItem);
				}
			}

			function calculateLineItemTotal(lineItem, resources){

				if(!lineItem) {
					return;
				}

				function getChildrenResources(parentResource){
					if(parentResource && angular.isArray(parentResource.EstResources) && parentResource.EstResources.length > 0){
						return parentResource.EstResources;
					}
					let children = _.filter(resources, function(item) {return item.EstResourceFk === parentResource.Id;});
					return _.uniqBy(children, 'Id');
				}

				estimateMainCompleteCalculationService.initializeLineItemUnit(lineItem);

				if(resources){
					let resourceTreeOfFirstLevel = _.filter(resources, function(resource){
						return resource.EstResourceFk === null;
					});

					sumResourcesTotalToLineItem(lineItem, resourceTreeOfFirstLevel, getChildrenResources);
				}

				estimateMainCompleteCalculationService.calculateLineItemTotal(lineItem);

				// calculate LineItem Co2 (Sustainability)
				estimateMainCompleteCalculationService.calculateLineItemCo2Total(lineItem, resources);
			}

			function sumResourcesTotalToLineItem(lineItem, resources, getChildrenFunc)
			{
				if (!lineItem || !resources || !getChildrenFunc) {
					return;
				}

				_.forEach (resources, function(item){
					if(estimateMainCompleteCalculationService.isAssembly(item)){
						if (estimateMainCompleteCalculationService.isCompositeAssembly(item)) {
							if ($injector.get('estimateAssembliesAssemblyTypeDataService').isPaAssembly(item.EstAssemblyTypeFk)) {
								sumAssemblyResourceTotalToLineItem(lineItem, item);
							} else {
								sumSingleResourceTotalToLineItem(lineItem, item);
							}
						}
						else
						{
							// ALM 113372 get assembly resources in detail to consider cost based on Iscost Flag on it
							sumAssemblyResourceTotalToLineItem(lineItem, item);
						}
					}else{
						let children = getChildrenFunc(item);

						if (!children || !children.length)
						{
							sumSingleResourceTotalToLineItem(lineItem, item);
						}
						else
						{
							sumResourcesTotalToLineItem(lineItem, children, getChildrenFunc);
						}
					}
				});
			}

			function sumAssemblyResourceTotalToLineItem(lineItem, resource){
				if (!lineItem || !resource) {
					return;
				}

				let markupCostUnitLineItem = resource.MarkupCostUnitLineItem ? resource.MarkupCostUnitLineItem : 0;

				if (resource.IsIndirectCost)
				{
					lineItem.IndCostUnit += (resource.CostUnitLineItem - markupCostUnitLineItem);
					lineItem.IndHoursUnit += resource.HoursUnitLineItem;
				}
				else
				{
					lineItem.EntCostUnit += (resource.CostUnitLineItem - markupCostUnitLineItem);
					lineItem.EntHoursUnit += resource.HoursUnitLineItem;
				}

				lineItem.MarkupCostUnit += markupCostUnitLineItem;
				lineItem.DayWorkRateUnit += resource.IsCost ? resource.DayWorkRateUnit : 0;
				lineItem.DayWorkRateTotal += lineItem.IsGc || lineItem.IsIncluded || !resource.IsCost ? 0 : resource.DayWorkRateTotal;
			}

			function sumSingleResourceTotalToLineItem(lineItem, resource)
			{
				if (!lineItem || !resource || resource.IsInformation) {
					return;
				}

				if (resource.IsCost) {

					if (resource.IsIndirectCost)
					{
						// calculate indirect cost unit(consider resource isIndirect flag true, Ind)
						lineItem.IndCostUnit += resource.CostUnitLineItem;
						lineItem.IndHoursUnit += resource.HoursUnitLineItem;
					}
					else
					{
						if (resource.EstRuleSourceFk > 0 /* && !res.IsEstimateCostCode && res.IsRuleMarkupCostCode */)
						{
							// calculate direct rule cost unit(consider resource created from rule and isIndirect flag false, Dru)
							lineItem.DruCostUnit += resource.CostUnitLineItem;
							lineItem.DruHoursUnit += resource.HoursUnitLineItem;
						}
						else
						{
							// ALM 107101 new changes(like old logic) and ALM 107748
							// calculate entered cost unit(consider resource not created from rule, Ent)
							lineItem.EntCostUnit += resource.CostUnitLineItem;
							lineItem.EntHoursUnit += resource.HoursUnitLineItem;
						}
					}
					resource.CostUnitLineItemInternal = resource.CostUnitLineItemInternal || 1;
					lineItem.DayWorkRateUnit += resource.DayWorkRateUnit * resource.CostUnitLineItemInternal;
					lineItem.DayWorkRateTotal += lineItem.IsGc || lineItem.IsIncluded ? 0 : resource.DayWorkRateTotal;
				} else {
					lineItem.MarkupCostUnit += resource.CostUnitLineItem;
				}
			}

			function getAssemblyLineItem(compoAssemblyResource){
				let estimateMainResourceType = $injector.get('estimateMainResourceType');
				if (compoAssemblyResource && compoAssemblyResource.EstResourceTypeFk === estimateMainResourceType.Assembly) {
					return _.find($injector.get('basicsLookupdataLookupDescriptorService').getData('compositeAssemblyWithDetailResources'), {'Id': compoAssemblyResource.EstAssemblyFk});
				}

				return null;
			}

			function updateResourceOfAssemblyCore(lineItem, resourceList, getChildrenResources){
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
					calculateResourceTreeOfAssembly(resource, lineItem, getChildrenResources, null,1);
				});

				// calculate LineItem Co2 (Sustainability)
				estimateMainCompleteCalculationService.calculateLineItemCo2Total(lineItem, resourceList);
			}

			function calculateCostOfResourceCore(resource, lineItem, parentResource, anscetorCostFactor){
				if(!resource || !lineItem){
					return;
				}

				resource.CostFactorCc = !estimateMainCompleteCalculationService.isSubItem(resource) || !estimateMainCompleteCalculationService.isEquipmentAssembly(resource) ? resource.CostFactorCc : 1;

				resource.ExchangeRate = resource.ExchangeRate ? resource.ExchangeRate : 1;

				/* CostInternal = CostReal x (product of all cost factors from all parent levels above) */
				let parentCostFactor =  angular.isDefined(anscetorCostFactor) && angular.isNumber(anscetorCostFactor) ? anscetorCostFactor : 1;

				let costFactor = resource.CostFactor1 * resource.CostFactor2 * resource.CostFactorCc;

				resource.CostReal = resource.CostUnit * costFactor;
				doRoundingValues(['CostReal'], resource);

				resource.CostInternal = resource.CostReal * resource.ExchangeRate;
				doRoundingValues(['CostInternal'], resource);

				// resource.CostInternal = !estimateMainCompleteCalculationService.isSubItem(resource) ? resource.CostInternal * parentCostFactor : resource.CostInternal;
				resource.CostInternal = resource.CostInternal * parentCostFactor;

				resource.CostUom = resource.CostInternal;
				doRoundingValues(['CostUom'], resource);

				/* CostUnitSubitem  = QuantityReal x CostInternal */
				resource.CostUnitSubItem = resource.QuantityReal * resource.CostInternal;
				doRoundingValues(['CostUnitSubItem'], resource);

				resource.CostTotalInternal = (resource.QuantityTotal * costFactor * resource.ExchangeRate * parentCostFactor * lineItem.CostFactor1 * lineItem.CostFactor2).toFixed(7) - 0;

				resource.CostUnitLineItemInternal = resource.QuantityInternal * costFactor * resource.ExchangeRate * parentCostFactor;

				/* CostUnitLineItem  = QuantityInternal x CostInternal */
				resource.CostUnitLineItem = resource.QuantityInternal * resource.CostInternal;
				doRoundingValues(['CostUnitLineItem'], resource);

				/* CostUnitTarget = QuantityUnitTarget x CostInternal */
				resource.CostUnitTarget = resource.QuantityUnitTarget * resource.CostInternal;
				doRoundingValues(['CostUnitTarget'], resource);

				/* CostTotal  = QuantityTotal x  CostInternal  x CostFactor1 (of parent Line Item) x CostFactor2 (of parent Line Item) */
				resource.CostTotal =  resource.IsInformation ? 0 : resource.QuantityTotal * resource.CostInternal * lineItem.CostFactor1 * lineItem.CostFactor2;
				doRoundingValues(['CostTotal'], resource);

				resource.CostTotalCurrency = resource.IsInformation ? 0 : estimateMainCompleteCalculationService.isSubItem(resource) || estimateMainCompleteCalculationService.isPlantAssembly(resource) || estimateMainCompleteCalculationService.isEquipmentAssembly(resource) ? resource.CostTotal : resource.QuantityTotal * resource.CostReal * parentCostFactor * lineItem.CostFactor1 * lineItem.CostFactor2;
				doRoundingValues(['CostTotalCurrency'], resource);

				resource.HoursUnitSubItem = resource.QuantityReal * resource.HoursUnit * resource.HourFactor;
				doRoundingValues(['HoursUnitSubItem'], resource);

				resource.HoursUnitLineItem = resource.QuantityInternal * resource.HoursUnit * resource.HourFactor;
				doRoundingValues(['HoursUnitLineItem'], resource);

				resource.HoursUnitTarget = resource.QuantityUnitTarget * resource.HoursUnit * resource.HourFactor;
				doRoundingValues(['HoursUnitTarget'], resource);

				resource.HoursTotal = resource.IsInformation ? 0 : resource.QuantityTotal * resource.HoursUnit * resource.HourFactor;
				doRoundingValues(['HoursTotal'], resource);

				/* MarkupCostUnit and MarkupCostUnitLineItem */
				if(estimateMainCompleteCalculationService.isNormalAssembly(resource) || $injector.get('estimateAssembliesAssemblyTypeDataService').isPaAssembly(resource.EstAssemblyTypeFk)){
					let normalAssembly = getAssemblyLineItem(resource);
					resource.MarkupCostUnit = normalAssembly && normalAssembly.MarkupCostUnit ? normalAssembly.MarkupCostUnit : 0;
				}else if(estimateMainCompleteCalculationService.isSubItem(resource) || estimateMainCompleteCalculationService.isPlantAssembly(resource) || estimateMainCompleteCalculationService.isEquipmentAssembly(resource)){
					resource.MarkupCostUnit = resource.MarkupCostUnit ? resource.MarkupCostUnit : 0;
				}else{
					resource.MarkupCostUnit = 0;
				}
				doRoundingValues(['MarkupCostUnit'], resource);

				resource.MarkupCostUnitLineItem = resource.QuantityInternal * resource.MarkupCostUnit * costFactor * resource.ExchangeRate * anscetorCostFactor;
				doRoundingValues(['MarkupCostUnitLineItem'], resource);

				resource.DayWorkRateTotal = resource.IsInformation ? 0 : resource.QuantityTotal * resource.DayWorkRateUnit * costFactor * parentCostFactor * resource.ExchangeRate * lineItem.CostFactor1 * lineItem.CostFactor2;
				doRoundingValues(['DayWorkRateTotal'], resource);
			}

			function calculateResourceTreeOfAssembly(resource, lineItem, getChildrenFunc, parentResource, anscetorCostFactor){
				let retValue = [resource];
				estimateMainCompleteCalculationService.calculateQuantityOfResource(resource, lineItem, parentResource);

				/* subItem */
				if(estimateMainCompleteCalculationService.isSubItem(resource) || estimateMainCompleteCalculationService.isPlantAssembly(resource) || estimateMainCompleteCalculationService.isEquipmentAssembly(resource)){

					let children = getChildrenFunc(resource);

					if(children && children.length){

						/* calculate anscetor costFactor */
						let costFactor = angular.isDefined(anscetorCostFactor) && angular.isNumber(anscetorCostFactor) ? anscetorCostFactor : 1;
						costFactor = costFactor * resource.CostFactor1 * resource.CostFactor2;

						angular.forEach(children, function(child){
							let childrenChanged = calculateResourceTreeOfAssembly(child, lineItem, getChildrenFunc, resource, costFactor);
							if(angular.isArray(childrenChanged) && childrenChanged.length > 0){
								retValue = retValue.concat(childrenChanged);
							}
						});

						/* the costUnit of subItem equal the sum of its children's cost/Unit subitem */
						calculateCostUnitOfSubItemOfAssembly(resource, children);

						// calculate Parent Resource Co2 (Sustainability)
						estimateMainCompleteCalculationService.calculateParentResourceCo2(resource, children);

						if(resource.Version === 0){
							resource.QuantityOriginal = resource.Quantity;
							resource.CostUnitOriginal = resource.CostUnit;
						}
					}else {
						resource.CostUnit = 0;
						resource.HoursUnit = 0;
						resource.DayWorkRateUnit = 0;
						resource.Co2Source = 0;
						resource.Co2Project = 0;
					}
				}
				calculateCostOfResourceCore(resource, lineItem, parentResource, anscetorCostFactor);

				estimateMainCompleteCalculationService.calculateResourceCo2Total(resource);

				return retValue;
			}

			function calculateResourceCoreOfAssembly(resource, lineItem, resources){
				let retValue = [];
				if(!resource || !lineItem || !angular.isArray(resources)){
					return retValue;
				}

				let getChildrenResources = createGetChildrenFunc(resources);

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
				let resourceChanged = calculateResourceTreeOfAssembly(resource, lineItem, getChildrenResources, estimateMainCompleteCalculationService.getParent(ancestors), estimateMainCompleteCalculationService.getAncestorsCostFactor(ancestors));
				if(angular.isArray(resourceChanged) && resourceChanged.length > 0){
					retValue = retValue.concat(resourceChanged);
				}

				/* calculate ancestors */
				while (ancestors.length > 0){
					let currentItem = ancestors.shift();
					if(estimateMainCompleteCalculationService.isSubItem(currentItem) || estimateMainCompleteCalculationService.isPlantAssembly(currentItem) || estimateMainCompleteCalculationService.isEquipmentAssembly(currentItem)){
						let children = getChildrenResources(currentItem);
						if(children && children.length){
							/* the costUnit of subItem equal the sum of its children's cost/Unit subItem */
							calculateCostUnitOfSubItemOfAssembly(currentItem, children);
							estimateMainCompleteCalculationService.calculateParentResourceCo2(currentItem, children);
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
					calculateCostOfResourceCore(currentItem, lineItem, estimateMainCompleteCalculationService.getParent(ancestors), estimateMainCompleteCalculationService.getAncestorsCostFactor(ancestors));
					estimateMainCompleteCalculationService.calculateResourceCo2Total(resource);
					retValue.push(currentItem);
				}

				return retValue;
			}

			function calculateCostUnitOfSubItemOfAssembly(resource, children){
				resource.CostUnit = 0;
				resource.HoursUnit = 0;
				resource.MarkupCostUnit = 0;
				resource.DayWorkRateUnit = 0;

				angular.forEach(children, function(child){

					if(!child.IsDisabled && !child.IsDisabledPrc && !child.IsInformation){
						resource.CostUnit += child.CostUnit * child.QuantityReal * child.CostFactor1 * child.CostFactor2 * child.CostFactorCc * (child.ExchangeRate ? child.ExchangeRate : 1);
						resource.MarkupCostUnit += (child.MarkupCostUnit | 0) * child.QuantityReal * child.CostFactor1 * child.CostFactor2 * child.CostFactorCc * (child.ExchangeRate ? child.ExchangeRate : 1);
						resource.HoursUnit += child.HoursUnit * child.QuantityReal * child.HourFactor;
						resource.DayWorkRateUnit += child.DayWorkRateUnit * child.QuantityReal * child.CostFactor1 * child.CostFactor2 * child.CostFactorCc * (child.ExchangeRate ? child.ExchangeRate : 1);
					}
				});
				doRoundingValues(['CostUnit', 'MarkupCostUnit', 'HoursUnit', 'DayWorkRateUnit'], resource);
			}

			function getRootParent(resource, resourceList){

				if(!resource.EstResourceFk){
					return resource;
				}

				let parent = _.find(resourceList, {Id : resource.EstResourceFk});

				while(parent && parent.EstResourceFk){
					parent = _.find(resourceList, {Id : parent.EstResourceFk});
				}

				return parent ? parent : resource;
			}

			let cacheIds = [];

			function loadCompositeAssemblyResources(items) {
				if (!items) {
					return $q.when([]);
				}

				if (items && items.length <= 0){
					return $q.when([]);
				}

				let assemblies = _.filter(items, function (item) {
					return item.EstAssemblyFk !== null;
				});
				let assemblyIds = _.map(assemblies, 'EstAssemblyFk');
				let estHeaderId = items[0].EstHeaderFk;
				assemblyIds = _.isArray(assemblyIds) ? assemblyIds : [assemblyIds];
				if (assemblyIds.length <= 0) {
					return $q.when([]);
				}

				let lookupType = 'compositeAssemblyWithDetailResources';
				let lookupDescriptorService = $injector.get('basicsLookupdataLookupDescriptorService');
				let postData = {
					EstHeaderId: estHeaderId,
					AssemblyIds: assemblyIds
				};

				if (cacheIds.length > 0){
					let hasCache = true;
					for(let i=0; i<assemblyIds.length; i++){
						if (cacheIds.indexOf(assemblyIds[i]) === -1){
							hasCache = false;
							cacheIds.push(assemblyIds[i]);
						}
					}

					if (hasCache){
						return $q.when([]);
					}
				}
				else {
					cacheIds = cacheIds.concat(assemblyIds);
				}

				return $http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/getassemblywithresourcesdetail', postData).then(function (response) {
					lookupDescriptorService.updateData(lookupType, response.data);
					return response.data;
				});
			}

			function doRoundingValues(fields, resource){
				if(!resource || !fields || !fields.length){
					return;
				}
				return estimateMainRoundingService.doRoundingValues(fields, resource);
			}

			service.clearCacheIds = function (){
				cacheIds = [];
			};

			service.calculateLineItemAndResourcesOfAssembly = calculateLineItemAndResourcesOfAssembly;
			service.updateResourcesOfAssembly = updateResourcesOfAssembly;
			service.calculateResourceOfAssembly = calculateResourceOfAssembly;
			service.updateResourceOfAssembly = updateResourceOfAssembly;
			service.calculateQuantityOfLineItem = calculateQuantityOfLineItem;
			service.loadCompositeAssemblyResources = loadCompositeAssemblyResources;

			return service;
		}]);
})(angular);
