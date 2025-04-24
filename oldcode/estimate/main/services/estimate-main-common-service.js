/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	/* global globals, _, Platform */
	'use strict';

	let moduleName = 'estimate.main';

	/**
	 * This constant describes the Estimate Item Info Types
	 */
	angular.module(moduleName).value('estimateMainItemInfoTypes', {
		disabled: 'estimate.main.itemInfo.disabled',             // Disabled Item
		disabledPrc: 'estimate.main.itemInfo.disabledPrc',       // Disabled by Procurement (Resource Container)
		optional: 'estimate.main.itemInfo.disabled',             // Optional Item
		optionalIT: 'estimate.main.itemInfo.optionalIT',         // Optional Item with IT
		lumpsum: 'estimate.main.itemInfo.lumpSum',               // Lumpsum Item
		dayWorkItem: 'estimate.main.itemInfo.dayWorkItem',       // DayWork Rate Item (LineItem Container)
		gcItem: 'estimate.main.itemInfo.gcItem',                 // GC Item
		noMarkup: 'estimate.main.itemInfo.noMarkup',             // No Markup Item (LineItem Container)
		fixedBudget: 'estimate.main.itemInfo.fixedBudget',       // Fixed Budget Item
		fixedPrice: 'estimate.main.itemInfo.fixedPrice',         // Fixed Price Item (LineItem Container)
		noLeadQuantity: 'estimate.main.itemInfo.noLeadQuantity', // No Lead Quantity Item (LineItem Container)
		included: 'estimate.main.itemInfo.included',             // Included Quantity Item
		markupCost: 'estimate.main.itemInfo.markupCost',         // Markup Cost on Resource (Resource Container)
		noBudget: 'estimate.main.itemInfo.noBudget',             // No Budget on Resource Item (Resource Container)
		generateByPrc: 'estimate.main.itemInfo.generateByPrc'    // Is Generated From Procurement (Resource Container)
	});

	/**
	 * @ngdoc service
	 * @name estimateMainCommonService
	 * @function
	 * @description
	 * estimateMainCommonService is the data service for estimate related common functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	/* jshint -W061 */ // eval can be harmful
	/* jshint -W074 */ //
	/* jshint -W073 */ //
	angular.module(moduleName).factory('estimateMainCommonService', ['$q', '$http', '$injector', '$translate', 'estimateMainLookupService', 'cloudCommonGridService',
		'basicsLookupdataLookupDescriptorService', 'platformRuntimeDataService', 'estimateMainExchangeRateService',
		'platformGridAPI', 'platformTranslateService', 'estimateMainCompleteCalculationService', 'estimateMainColumnConfigService', 'estimateMainConfigDetailService',
		'estimateMainResourceType','estimateMainRoundingService','estimateMainStandardAllowanceCalculationService', 'estimateMainItemInfoTypes',
		function ($q, $http, $injector, $translate, estimateMainLookupService, cloudCommonGridService,
			basicsLookupdataLookupDescriptorService, platformRuntimeDataService, estimateMainExchangeRateService,
			platformGridAPI, platformTranslateService, estimateMainCompleteCalculationService, estimateMainColumnConfigService, estimateMainConfigDetailService,
			estimateMainResourceType,estimateMainRoundingService, estimateMainStandardAllowanceCalculationService, estimateItemInfoTypes) {
			let service = {},
				estCostCodesList = [],
				selectedLookupItem = {},
				selectedLookupItems = [],
				modifiedPrjCostCodes = [],
				total = {'totalCost': 0, 'totalCostRisk': 0, 'totalHours': 0, 'majorCostCode': [], 'majorCostTotal': 0, 'isValid': false},
				estAssemblyTypeLogics = {
					'StandardAssembly': 1, 'WorkItemAssembly': 2, 'CrewAssembly': 3, 'MaterialAssembly': 4, 'MaterialAssemblyUpdated': 5,
					'CrewAssemblyUpdated': 6,'DissolvableAssembly': 7, 'ProtectedAssembly': 8
				},
				estResourceTypes = {'CostCode': 1, 'Material': 2, 'Plant': 3, 'Assembly': 4, 'SubItem': 5, 'Res Resource': 6, 'EquipmentAssembly': 11},
				lsumUom = null;

			let isLookupSelected = false;

			let checkBoxFields = [
				'IsLumpsum',
				'IsDisabled',
				'IsGc',
				'IsOptional',
				'IsOptionalIT',
				'IsFixedPrice',
				'IsIncluded',
				'IsDaywork'
			];

			service.isOptionItemWithIT = function (lineItem) {
				return estimateMainCompleteCalculationService.isOptionItemWithIT(lineItem);
			};

			service.isOptionItemWithoutIT = function (lineItem) {
				return estimateMainCompleteCalculationService.isOptionItemWithoutIT(lineItem);
			};

			service.isLookupSelected = function(){
				return isLookupSelected;
			};

			service.setLookupSelected = function(value){
				isLookupSelected = value;
			};

			let totalUpdated = new Platform.Messenger();
			service.onLinkBoqItemSucceeded = new Platform.Messenger();

			function calculateDetails(item, colName, dataService, ignoreCalculateDetail) {
				let mainDataService = dataService || $injector.get('estimateMainService');
				$injector.get('estimateMainDetailCalculationService').calculateDetails(item, colName, mainDataService, ignoreCalculateDetail);
			}

			function calCostInLocalCurrency(item) {
				$injector.get('basicsMultiCurrencyCommonService').calculateMultiCurrencies(item);
			}

			// calculate cost unit, hours unit and related fields of Line Item
			function calculateCostOfLineItem(lineItem, resources) {
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

				estimateMainCompleteCalculationService.initializeLineItemUnit(lineItem);

				if (resources) {
					let resourceTreeOfFirstLevel = _.filter(resources, function (resource) {
						return resource.EstResourceFk === null;
					});

					sumResourcesTotalToLineItem(lineItem, resourceTreeOfFirstLevel, getChildrenResources, false, false);
				}

				estimateMainCompleteCalculationService.calculateLineItemTotal(lineItem, isTotalWq);

				estimateMainStandardAllowanceCalculationService.calculateStandardAllowance(lineItem, resources, getChildrenResources);

				if(lineItem.AdvancedAllowance !== 0){
					lineItem.AdvancedAll = lineItem.AdvancedAllowance;
					$injector.get('estimateMainStandardAllowanceCalculationService').reCalculateAdvAllowance(lineItem,'AdvancedAll');
					// lineItem.AdvancedAllowance = 0;
				}

				$injector.get('estimateMainCompleteCalculationService').calLineItemBudgetDiff(lineItem, resources);

				calCostInLocalCurrency(lineItem);
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
							lineItem.AdvancedAllowanceCostUnit = estimateMainRoundingService.doRoundingValue('AdvancedAllowanceCostUnit',lineItem.AdvancedAllowanceCostUnit);
						}

						sumSingleResourceTotalToLineItem(lineItem, item, useParentIsCost, parentIsCost);
					} else {
						if (estimateMainCompleteCalculationService.isCompositeAssembly(item)) {
							if (item.AdvancedAllowanceCostUnitLineItem) {
								lineItem.AdvancedAllowanceCostUnit += item.AdvancedAllowanceCostUnitLineItem;
								lineItem.AdvancedAllowanceCostUnit = estimateMainRoundingService.doRoundingValue('AdvancedAllowanceCostUnit',lineItem.AdvancedAllowanceCostUnit);
							}

							let isCost = item.IsCost || (useParentIsCost && parentIsCost);

							if($injector.get('estimateAssembliesAssemblyTypeDataService').isPaAssembly(item.EstAssemblyTypeFk)){
								sumResourcesTotalToLineItem(lineItem, children, getChildrenFunc, useParentIsCost, parentIsCost);
							}else{
								sumSingleResourceTotalToLineItem(lineItem, item, true, isCost);
							}
						} else {
							sumResourcesTotalToLineItem(lineItem, children, getChildrenFunc, useParentIsCost, parentIsCost);
						}
					}
				});
			}

			function sumSingleResourceTotalToLineItem(lineItem, resource, useParentIsCost, parentIsCost) {
				if (!lineItem || !resource || resource.IsInformation) {
					return;
				}

				lineItem.EscalationCostUnit += resource.EscResourceCostUnit * resource.QuantityInternal;
				lineItem.EscalationCostUnit = estimateMainRoundingService.doRoundingValue('EscalationCostUnit',lineItem.EscalationCostUnit);

				resource.CostUnitLineItemInternal = resource.CostUnitLineItemInternal || 1;

				let isCost = resource.IsCost;

				if (useParentIsCost) {
					isCost = parentIsCost;
				}

				if (isCost) {
					if (resource.IsIndirectCost) {
						// calculate indirect cost unit(consider resource isIndirect flag true, Ind)
						lineItem.IndCostUnit += resource.CostUnitLineItem;
						lineItem.IndCostUnit = estimateMainRoundingService.doRoundingValue('IndCostUnit',lineItem.IndCostUnit);
						lineItem.IndHoursUnit += resource.HoursUnitLineItem;
						lineItem.IndHoursUnit =  estimateMainRoundingService.doRoundingValue('IndHoursUnit',lineItem.IndHoursUnit);
					} else {
						if (resource.EstRuleSourceFk > 0 /* && !res.IsEstimateCostCode && res.IsRuleMarkupCostCode */) {
							// calculate direct rule cost unit(consider resource created from rule and isIndirect flag false, Dru)
							lineItem.DruCostUnit += resource.CostUnitLineItem;
							lineItem.DruCostUnit = estimateMainRoundingService.doRoundingValue('DruCostUnit',lineItem.DruCostUnit);
							lineItem.DruHoursUnit += resource.HoursUnitLineItem;
							lineItem.DruHoursUnit = estimateMainRoundingService.doRoundingValue('DruHoursUnit',lineItem.DruHoursUnit);
						} else {
							// ALM 107101 new changes(like old logic) and ALM 107748
							// calculate entered cost unit(consider resource not created from rule, Ent)
							lineItem.EntCostUnit += resource.CostUnitLineItem;
							lineItem.EntCostUnit = estimateMainRoundingService.doRoundingValue('EntCostUnit',lineItem.EntCostUnit);
							lineItem.EntHoursUnit += resource.HoursUnitLineItem;
							lineItem.EntHoursUnit = estimateMainRoundingService.doRoundingValue('EntHoursUnit',lineItem.EntHoursUnit);
						}
					}
					lineItem.DayWorkRateUnit += resource.DayWorkRateUnit * resource.CostUnitLineItemInternal;
					lineItem.DayWorkRateTotal += lineItem.IsGc || lineItem.IsIncluded ? 0 : resource.DayWorkRateTotal;
					lineItem.DayWorkRateTotal = estimateMainRoundingService.doRoundingValue('DayWorkRateTotal',lineItem.DayWorkRateTotal);
				} else {
					lineItem.MarkupCostUnit += resource.CostUnitLineItem;
					lineItem.MarkupCostUnit = estimateMainRoundingService.doRoundingValue('MarkupCostUnit',lineItem.MarkupCostUnit);
				}
			}

			function getQuantityTarget(lineItem) {
				return estimateMainCompleteCalculationService.getQuantityTarget(lineItem);
			}

			function calculateQuantityOfLineItemCore(lineItem) {
				if (!lineItem) {
					return;
				}
				service.setQuantityByLsumUom(lineItem, true);

				let quantityTarget = getQuantityTarget(lineItem);

				if (lineItem.IsDisabled) {

					lineItem.QuantityUnitTarget = 0;

					lineItem.QuantityTotal = quantityTarget * lineItem.QuantityUnitTarget;
					lineItem.QuantityTotal = estimateMainRoundingService.doRoundingValue('QuantityTotal',lineItem.QuantityTotal);
				} else {

					// if the type of item.Quantity isn't [object Number],such as [object Object]
					lineItem.Quantity = (Object.prototype.toString.call(lineItem.Quantity) === '[object Number]') ? lineItem.Quantity : 1;
					estimateMainRoundingService.roundInitialQuantities(lineItem);

					lineItem.QuantityUnitTarget = lineItem.Quantity * lineItem.QuantityFactor1 * lineItem.QuantityFactor2 * lineItem.QuantityFactor3 * lineItem.QuantityFactor4 * lineItem.ProductivityFactor;
					lineItem.QuantityUnitTarget = estimateMainRoundingService.doRoundingValue('QuantityUnitTarget',lineItem.QuantityUnitTarget);

					let qtyTarget = lineItem.IsLumpsum? 1 : quantityTarget;

					lineItem.QuantityTotal = service.isOptionItemWithoutIT(lineItem) ? 0 : qtyTarget * lineItem.QuantityUnitTarget;
					lineItem.QuantityTotal =  estimateMainRoundingService.doRoundingValue('QuantityTotal',lineItem.QuantityTotal);
				}
			}

			// calculate Quantity Unit Target for line item
			function calQuantityUnitTarget(lineItem) {

				/* validate lineItem is not null */
				if (!lineItem) {
					return;
				}

				calculateQuantityOfLineItemCore(lineItem);

				let calculationService = $injector.get('estimateMainCompleteCalculationService');

				calculationService.calItemBudget(lineItem);

				calculationService.calItemUnitBudget(lineItem);
			}

			// set resource type readonly if code/description is set
			function setResourceTypeReadOnly(col, resItem) {
				if (col === 'Code' || col === 'DescriptionInfo') {
					let subItemHasChildren = resItem.EstResources && resItem.EstResources.length > 0;
					let isResourceTypeReadOnly = subItemHasChildren ? false : _.isEmpty(resItem.Code);
					platformRuntimeDataService.readonly(resItem, [{field: 'EstResourceTypeFkExtend', readonly: !isResourceTypeReadOnly}]);
					platformRuntimeDataService.readonly(resItem, [{field: 'EstResourceTypeShortKey', readonly: !isResourceTypeReadOnly}]);
				}
			}

			// update total cost and hours of line items
			function updateTotalCostNHours(lineItemList) {
				if (lineItemList && lineItemList.length > 0) {
					total.totalCost = 0;
					total.totalCostRisk = 0;
					total.totalHours = 0;
					angular.forEach(lineItemList, function (lineItem) {
						if (lineItem.EstCostRiskFk !== null && lineItem.EstCostRiskFk > 0) {
							total.totalCostRisk += lineItem.CostTotal;
						} else {
							total.totalCost += lineItem.CostTotal;
						}
						total.totalHours += lineItem.HoursTotal;
					});
				}
			}

			function getMajorCC(resItem) {
				let item = {},
					cc = {'code': '', 'descInfo': ''};
				estCostCodesList = basicsLookupdataLookupDescriptorService.getData('estcostcodeslist');

				if (resItem.MdcCostCodeFk) {
					item = _.find(estCostCodesList, {Id: resItem.MdcCostCodeFk});
				}

				if (item) {
					if (angular.isDefined(item.CostCodeParentFk)) {
						if (item.CostCodeParentFk !== null) {
							let parentItem = cloudCommonGridService.getRootParentItem(item, estCostCodesList, 'CostCodeParentFk');
							if (parentItem) {
								cc.code = parentItem.Code;
								cc.descInfo = parentItem.DescriptionInfo;
							}
						} else {
							cc.code = item.Code;
							cc.descInfo = item.DescriptionInfo;
						}
					}
				}
				return cc;
			}

			function handlerTotalCalculation(response) {
				let majorCC = [],
					cc = {'code': '', 'costTotal': 0};

				if (response.data && response.data.length > 0) {
					majorCC = [];
					angular.forEach(response.data, function (item) {
						if (item.EstResources && item.EstResources.length > 0) {
							angular.forEach(item.EstResources, function (res) {
								if (res.EstResourceTypeFk !== 5) {
									let costCode = getMajorCC(res);
									if (costCode.code !== '') {
										cc.code = costCode.code;
										cc.desc = costCode.descInfo.Description;
										cc.costTotal = res.CostTotal;
										majorCC.push(angular.copy(cc));
									}
								}
							});
						}
					});
					updateTotalCostNHours(response.data);
				}

				if (majorCC.length > 0) {
					let result = _.chain(majorCC)
						.groupBy('code')
						.pairs()
						.map(function (item) {
							// TODO CHECK UPGRADE TO LODASH 4.17
							// return _.object(_.zip(['code', 'costCodeDetail'], item));
							return _.zipObject(['code', 'costCodeDetail'], item);
						})
						.value();

					if (result && result.length > 0) {
						total.majorCostTotal = 0;

						angular.forEach(result, function (ccDetail) {
							if (ccDetail.costCodeDetail) {
								let costTotal = 0;

								angular.forEach(ccDetail.costCodeDetail, function (costCodeDetail) {
									costTotal += costCodeDetail.costTotal;
								});

								ccDetail.costTotal = costTotal;
								ccDetail.desc = ccDetail.costCodeDetail[0].desc;
								total.majorCostTotal += costTotal;
							}
						});
					}

					total.majorCostCode = result;
				}
				total.isValid = true;
				totalUpdated.fire();
			}

			let setCostUnitReadOnly = function setCostUnitReadOnly(resItem, selectedItem) {
				let isRate = selectedItem.IsRate;
				if (resItem.EstResourceTypeFk === estimateMainResourceType.Material) {
					if (!selectedItem.IsLabour) {
						isRate = true;
					}
				}
				let resProcessor = $injector.get('estimateMainResourceProcessor');
				resProcessor.setCostUnitReadOnly(resItem, isRate);
			};

			// resources specific calculation
			function calculateResource(resource, lineItem, resources) {
				/* calculate resources */
				let resChanged = estimateMainCompleteCalculationService.calculateResourceCore(resource, lineItem, resources);

				/* calculate cost and hour of lineItem */
				calculateCostOfLineItem(lineItem, resources);

				/* calculate user defined column value in resource  */
				$injector.get('estimateMainResourceDynamicUserDefinedColumnService').calculate(lineItem, resource, resources);

				return resChanged;
			}

			// Update Currencies
			// service.updateCurrencies()
			// as per disable flag calculate total cost, hours and quantity
			function calculateLineItemAndResources(lineItem, resources, calculateExtendColumns) {

				let deferred = $q.defer();

				/* validate lineItem is not null */
				if (!lineItem) {
					deferred.resolve('');
					return deferred;
				}

				if(_.isArray(resources) && resources.length > 0){
					if(lineItem.EstLineItemFk === null && lineItem.Id !== resources[0].EstLineItemFk) {
						deferred.resolve('');
						return deferred;
					}
				}

				/* calculate quantity of lineItem */
				calculateQuantityOfLineItemCore(lineItem);

				deferred = $injector.get('estimateMainLineItemDetailService').calculateResourceSystemParam(lineItem, resources);

				return deferred.promise.then(function (){
					/* calculate quantity and cost of resources */
					estimateMainCompleteCalculationService.updateResourcesNew(lineItem, resources);

					/* calculate cost and hour of lineItem */
					calculateCostOfLineItem(lineItem, resources);

					fireLiAndResAsModified(lineItem, resources);

					if (angular.isUndefined(calculateExtendColumns) || calculateExtendColumns) {
						service.calculateExtendColumnValuesOfLineItem(lineItem, resources);
					}

					/* calculate user defined column value in lineItem and resource */
					$injector.get('estimateMainDynamicUserDefinedColumnService').calculate(lineItem, resources);
				});
			}

			function fireLiAndResAsModified(lineItem, resources){
				if (lineItem) {
					$injector.get('estimateMainService').fireItemModified(lineItem);
				}
				if(_.isArray(resources) && resources.length > 0){
					_.forEach(resources, function(resource){
						$injector.get('estimateMainResourceService').fireItemModified(resource);
					});
				}
			}

			function calculateReferenceLineItem(selectedLineItem, flattenResources) {

				/* get all lineItem */
				let lineItemList = $injector.get('estimateMainService').getList();

				/* get lineItems which reference to current lineItem */
				let referenceLineItems = getReferenceLineItems(selectedLineItem, lineItemList);

				if (!referenceLineItems || referenceLineItems.length === 0) {
					return;
				}

				_.forEach(referenceLineItems, function (item) {

					let resourcesClone = cloneAndFilterResources(flattenResources);
					basicsLookupdataLookupDescriptorService.updateData('refLineItemResources', resourcesClone);

					/* calculate reference lineitem */
					calculateLineItemAndResources(item, resourcesClone);

					/* calculate dynamic column of reference lineitem */
					estimateMainColumnConfigService.attachExtendColumnsToLineItem(item, resourcesClone, estimateMainConfigDetailService.getColumnConfigDetails());
					basicsLookupdataLookupDescriptorService.updateData('refLineItemResources', '');
				});

				function cloneAndFilterResources(flattenResources) {

					let cloneResources = angular.copy(flattenResources);

					return _.filter(cloneResources, function (item) {
						return item.EstResourceFk === null;
					});
				}

				function getReferenceLineItems(lineItem, estLineItemList) {

					let allRefLineItemList = [];

					// get the lineItems which reference to this lineItem
					let refLineItems = _.filter(estLineItemList, {EstLineItemFk: lineItem.Id});

					if (angular.isDefined(refLineItems) && refLineItems !== null && refLineItems.length > 0) {

						allRefLineItemList = allRefLineItemList.concat(refLineItems);

						_.forEach(refLineItems, function (item) {

							let curRefLineItems = getReferenceLineItems(item, estLineItemList);

							if (angular.isDefined(curRefLineItems) && curRefLineItems !== null && curRefLineItems.length > 0) {

								allRefLineItemList = allRefLineItemList.concat(curRefLineItems);
							}
						});
					}

					return allRefLineItemList;
				}
			}

			service.calculateExtendColumnValuesOfLineItem = function (selectedLineItem, resourceList, lookupItem) {

				estimateMainColumnConfigService.attachExtendColumnsToLineItem(selectedLineItem, resourceList, estimateMainConfigDetailService.getColumnConfigDetails(), lookupItem);

				// modify the lineitems which reference to current lineitem
				calculateReferenceLineItem(selectedLineItem, resourceList);
			};

			function createDetailAndCostTotalCalculationFunc(dataService, calculateFunc, isAssembly, assemblyType) {

				return function (arg, resItemList, parentLineItem, lookupItem) {
					let retValue = [];
					let col = arg.cell ? arg.grid.getColumns()[arg.cell].field : arg.colName;
					let resItem = (arg && arg.Id > 0) ? arg : arg.item;
					if (!resItem) {
						return retValue;
					}

					/* calculate detail */
					calculateDetails(resItem, col, dataService, true);

					retValue.push(resItem);

					let extractItemProp = true;

					switch (resItem.EstResourceTypeFk) {
						case estimateMainResourceType.CostCode:
						case estimateMainResourceType.Material:
						case estimateMainResourceType.Plant:
						case estimateMainResourceType.EquipmentAssembly:
						case estimateMainResourceType.Assembly:
						case estimateMainResourceType.PlantDissolved:{
							/* get information from selectedItem, if resource is not composite assembly */
							if (!((resItem.EstResourceTypeFk === estimateMainResourceType.Assembly && resItem.EstAssemblyTypeFk > 0))) {
								service.setSelectedCodeItem(col, resItem, extractItemProp, lookupItem, isAssembly);
							}

							/* calculate resources and lineItem */
							retValue = calculateFunc(resItem, parentLineItem, resItemList, assemblyType);
							break;
						}
						case estimateMainResourceType.SubItem: {
							/* calculate resources and lineItem */
							retValue = calculateFunc(resItem, parentLineItem, resItemList, assemblyType);
							break;
						}
						case estimateMainResourceType.ResResource: {
							if (resItem.EstResKindFk > 0) {
								service.setSelectedCodeItem(col, resItem, extractItemProp, lookupItem);
							}
							break;
						}
					}

					setResourceTypeReadOnly(col, resItem);

					dataService.fireItemModified(parentLineItem);

					return retValue;
				};
			}

			// sync calculation for Resource container
			service.estimateResources = function estimateResources(arg, resItemList, parentLineItem, lookupItem) {

				return createDetailAndCostTotalCalculationFunc($injector.get('estimateMainService'), service.calculateResource, false)(arg, resItemList, parentLineItem, lookupItem);
			};

			service.calculateDetailAndCostTotalOfAssembly = function (arg, resItemList, parentLineItem, lookupItem, assemblyType) {

				return createDetailAndCostTotalCalculationFunc($injector.get('estimateAssembliesService'), $injector.get('estimateAssembliesCalculationService').calculateResourceOfAssembly, true, assemblyType)(arg, resItemList, parentLineItem, lookupItem);
			};

			/* jsHint : W071 */ // This function has too many statements
			service.extractSelectedItemProp = function (selectedItem, resItem, isAssembly) {

				if (resItem && selectedItem && selectedItem.Id) {

					resItem.MdcCostCodeFk = null;
					resItem.MdcMaterialFk = null;
					resItem.EstAssemblyFk = null;
					resItem.IsInformation = selectedItem.IsInformation;

					if (resItem.EstResourceTypeFk !== 6) {
						resItem.Code = selectedItem.Code;
						resItem.DescriptionInfo = selectedItem.DescriptionInfo;
						resItem.DescriptionInfo1 = selectedItem.Description2Info || selectedItem.DescriptionInfo2;
						if (_.isEmpty(resItem.DescriptionInfo1)) {
							resItem.DescriptionInfo1 = {};
						}
					}
					// Costcodes
					if (resItem.EstResourceTypeFk === estimateMainResourceType.CostCode) {
						if (selectedLookupItem.Id) {
							modifiedPrjCostCodes.push(selectedLookupItem);
						}
						resItem.CostUnit = selectedItem.Rate;
						resItem.CostUnitOriginal = resItem.CostUnit;
						resItem.BasUomFk =  selectedItem.UomFk ? selectedItem.UomFk : resItem.BasUomFk;
						resItem.MdcCostCodeFk = selectedItem.IsOnlyProjectCostCode ? null : (selectedItem.BasCostCode && selectedItem.BasCostCode.Id) ? selectedItem.BasCostCode.Id : (selectedItem.OriginalId || selectedItem.Id);
						resItem.ProjectCostCodeFk = selectedItem.IsOnlyProjectCostCode ? (selectedItem.OriginalId || selectedItem.Id) : null;
						resItem.EstCostTypeFk = selectedItem.EstCostTypeFk;
						resItem.BasCurrencyFk = selectedItem.CurrencyFk;
						resItem.QuantityFactorCc = selectedItem.RealFactorQuantity;
						resItem.HourFactor = selectedItem.FactorHour;
						resItem.CostFactorCc = selectedItem.RealFactorCosts;
						resItem.HoursUnit = selectedItem.IsLabour ? 1 : (selectedItem.BasCostCode && selectedItem.BasCostCode.IsLabour) ? 1 : 0;
						resItem.HoursUnit = selectedItem.HourUnit ? selectedItem.HourUnit : resItem.HoursUnit;
						resItem.PrcStructureFk = selectedItem.PrcStructureFk;
						resItem.IsRate = selectedItem.IsRate;
						resItem.IsEditable = selectedItem.IsEditable;
						resItem.IsBudget = selectedItem.IsBudget;
						resItem.IsCost = selectedItem.IsCost;
						resItem.IsEstimateCostCode = selectedItem.IsEstimateCostCode;
						resItem.IsRuleMarkupCostCode = selectedItem.IsRuleMarkupCostCode;
						resItem.DayWorkRateUnit = selectedItem.DayWorkRate;
						let resProcessor = $injector.get('estimateMainResourceProcessor');
						resProcessor.setBudgetReadOnly(resItem, selectedItem.IsBudget);
						setCostUnitReadOnly(resItem, selectedItem);
						resItem.DescriptionInfo.DescriptionTr = null;
						resItem.Co2Source = selectedItem.Co2Source;
						resItem.Co2Project = selectedItem.Co2Project;

					}
					// Material
					else if (resItem.EstResourceTypeFk === estimateMainResourceType.Material) {
						resItem.MdcMaterialFk = (selectedItem.BasMaterial && selectedItem.BasMaterial.Id) ? selectedItem.BasMaterial.Id : selectedItem.Id;
						resItem.MdcCostCodeFk = selectedItem.MdcCostCodeFk ? selectedItem.MdcCostCodeFk : (selectedItem.BasMaterial && selectedItem.BasMaterial.MdcCostCodeFk) ? selectedItem.BasMaterial.MdcCostCodeFk : resItem.MdcCostCodeFk;
						resItem.EstCostTypeFk = selectedItem.EstCostTypeFk;
						resItem.BasUomFk = selectedItem.BasUomFk ? selectedItem.BasUomFk : selectedItem.UomFk ? selectedItem.UomFk : resItem.BasUomFk;
						resItem.BasCurrencyFk = selectedItem.BasCurrencyFk;
						resItem.HourFactor = selectedItem.FactorHour;
						resItem.HoursUnit = selectedItem.IsLabour ? 1 : 0;
						resItem.HoursUnit = selectedItem.HourUnit ? selectedItem.HourUnit : resItem.HoursUnit;
						resItem.PrcStructureFk = selectedItem.PrcStructureFk;
						resItem.DayWorkRateUnit = selectedItem.DayWorkRate || selectedItem.DayworkRate;
						let factorPriceUnit = selectedItem.FactorPriceUnit ? selectedItem.FactorPriceUnit : 1;
						let priceUnit = selectedItem.PriceUnit ? selectedItem.PriceUnit : 1;
						resItem.CostUnit = selectedItem.EstimatePrice * factorPriceUnit / priceUnit;// ALM 101673
						resItem.CostUnitOriginal = resItem.CostUnit;
						resItem.MaterialPriceListFk = selectedItem.MaterialPriceListFk;

						resItem.IsBudget = selectedItem.MdcCostCodeFk ? selectedItem.CostCodeIsBudget : resItem.IsBudget;
						resItem.IsCost = selectedItem.MdcCostCodeFk ? selectedItem.CostCodeIsCost : false;
						resItem.IsEstimateCostCode = selectedItem.MdcCostCodeFk ? selectedItem.CostCodeTypeIsEstimateCc : resItem.IsEstimateCostCode;
						resItem.IsRuleMarkupCostCode = selectedItem.MdcCostCodeFk ? (selectedItem.CostCodeTypeIsAllowance || selectedItem.CostCodeTypeIsRp || selectedItem.CostCodeTypeIsAm || selectedItem.CostCodeTypeIsGa) : resItem.IsRuleMarkupCostCode;

						resItem.Co2Source = selectedItem.Co2Source;
						resItem.Co2Project = selectedItem.Co2Project;

						if (resItem.MdcCostCodeFk) {
							let mdcCC = basicsLookupdataLookupDescriptorService.getData('estcostcodeslist');
							let mdcCostCode = _.find(mdcCC, {Id: resItem.MdcCostCodeFk});
							if (mdcCostCode) {
								modifiedPrjCostCodes.push(mdcCostCode);
							}
						}

						if (selectedItem.IsLabour) {
							if (selectedItem.IsRate) {
								resItem.IsRate = true;
							}
						} else {
							resItem.IsRate = true;
						}
						resItem.DescriptionInfo.DescriptionTr = null;

						setCostUnitReadOnly(resItem, selectedItem);

						resetLastPriceListToResource(resItem, selectedItem);
					}
					// Assembly
					else if (resItem.EstResourceTypeFk === estimateMainResourceType.Assembly || resItem.EstResourceTypeFk === estimateMainResourceType.Plant) {
						resItem.EstAssemblyFk = selectedItem.Id;

						if (resItem.Version === 0) {
							resItem.EstHeaderAssemblyFk = selectedItem.EstHeaderFk;
							resItem.BasUomFk = selectedItem.BasUomFk;
							resItem.BasCurrencyFk = selectedItem.CurrencyFk;
							resItem.CostFactor1 = selectedItem.CostFactor1;
							resItem.CostFactor2 = selectedItem.CostFactor2;
							resItem.CostFactorDetail1 = selectedItem.CostFactorDetail1;
							resItem.CostFactorDetail2 = selectedItem.CostFactorDetail2;
							resItem.CostTotal = selectedItem.CostTotal;
							resItem.CostUnit = isAssembly && selectedItem.MarkupCostUnit ? selectedItem.CostUnit + selectedItem.MarkupCostUnit : selectedItem.CostUnit;
							resItem.CostUnitOriginal = resItem.CostUnit;
							resItem.IsDisabled = selectedItem.IsDisabled;
							resItem.IsDisabledPrc = selectedItem.IsDisabledPrc;
							resItem.IsLumpsum = selectedItem.IsLumpsum;
							resItem.Quantity = selectedItem.Quantity;
							resItem.QuantityDetail = selectedItem.QuantityDetail;
							resItem.QuantityFactor1 = selectedItem.QuantityFactor1;
							resItem.QuantityFactor2 = selectedItem.QuantityFactor2;
							resItem.QuantityFactor3 = selectedItem.QuantityFactor3;
							resItem.QuantityFactor4 = selectedItem.QuantityFactor4;
							resItem.QuantityFactorDetail1 = selectedItem.QuantityFactorDetail1;
							resItem.QuantityFactorDetail2 = selectedItem.QuantityFactorDetail2;
							resItem.ProductivityFactor = selectedItem.ProductivityFactor;
							resItem.ProductivityFactorDetail = selectedItem.ProductivityFactorDetail;
						} else {
							resItem.EstHeaderAssemblyFk = selectedItem.EstHeaderFk;
							resItem.BasUomFk = selectedItem.BasUomFk;
							resItem.BasCurrencyFk = selectedItem.CurrencyFk;
							resItem.CostTotal = selectedItem.CostTotal;
							resItem.CostUnit = selectedItem.CostUnit;
							resItem.CostUnitOriginal = resItem.CostUnit;
						}
						resItem.HoursTotal = selectedItem.HoursTotal;
						resItem.HoursUnit = selectedItem.HoursUnit;
						resItem.DayWorkRateUnit = selectedItem.DayWorkRateUnit ? selectedItem.DayWorkRateUnit : (selectedItem.QuantityTotal ? (selectedItem.DayWorkRateTotal/selectedItem.QuantityTotal) : 0);
						resItem.Co2SourceTotal = selectedItem.Co2SourceTotal;
						resItem.Co2ProjectTotal = selectedItem.Co2ProjectTotal;
						resItem.Co2Source = selectedItem.QuantityTotal ? (selectedItem.Co2SourceTotal/selectedItem.QuantityTotal) : selectedItem.Co2SourceTotal;
						resItem.Co2Project = selectedItem.QuantityTotal ? (selectedItem.Co2ProjectTotal/selectedItem.QuantityTotal) : selectedItem.Co2ProjectTotal;
					}
					else if (resItem.EstResourceTypeFk === estimateMainResourceType.ResResource) {
						resItem.MdcCostCodeFk = selectedItem.Id;
						resItem.EstCostTypeFk = selectedItem.EstCostTypeFk;
						resItem.QuantityFactorCc = selectedItem.RealFactorQuantity;
						resItem.CostFactorCc = selectedItem.RealFactorCosts;
						resItem.HoursUnit = selectedItem.IsLabour ? 1 : 0;
						resItem.PrcStructureFk = selectedItem.PrcStructureFk;
						resItem.IsBudget = selectedItem.IsBudget;
						resItem.IsCost = selectedItem.IsCost;
						resItem.IsEstimateCostCode = selectedItem.IsEstimateCostCode;
						resItem.IsRuleMarkupCostCode = selectedItem.IsRuleMarkupCostCode;
						setCostUnitReadOnly(resItem, selectedItem);
					}
				}
				//  Reset
				else if (resItem && _.isEmpty(selectedItem)) {
					resItem.Code = null;
					resItem.DescriptionInfo = {};
					resItem.DescriptionInfo1 = {};
					resItem.MdcCostCodeFk = null;
					resItem.MdcMaterialFk = null;
					resItem.EstAssemblyFk = null;
					resItem.EstCostTypeFk = null;
					resItem.BasCurrencyFk = null;
					resItem.BasUomFk = 0;
					// resItem.ColumnId = 0;
					resItem.CostFactorCc = 1;
					resItem.CostFactor1 = 1;
					resItem.CostFactor2 = 1;
					resItem.CostFactorDetail1 = null;
					resItem.CostFactorDetail2 = null;
					resItem.CostTotal = 0;
					resItem.CostUnit = 0;
					resItem.HoursTotal = 0;
					resItem.HoursUnit = 0;
					resItem.IsDisabled = false;
					resItem.IsDisabledPrc = false;
					resItem.IsLumpsum = false;
					resItem.ProductivityFactor = 1;
					resItem.Quantity = 1;
					resItem.QuantityDetail = null;
					resItem.QuantityFactor1 = 1;
					resItem.QuantityFactor2 = 1;
					resItem.QuantityFactor3 = 1;
					resItem.QuantityFactor4 = 1;
					resItem.EfficiencyFactor1 = 1;
					resItem.EfficiencyFactor2 = 1;
					resItem.QuantityFactorCc = 1;
					resItem.QuantityInternal = 1;
					resItem.QuantityReal = 1;
					resItem.QuantityTotal = 1;
					resItem.QuantityUnitTarget = 1;
					resItem.QuantityFactorDetail1 = null;
					resItem.QuantityFactorDetail2 = null;
					resItem.EstResourceFlagFk = null;
					resItem.DayWorkRateUnit = 0;
					resItem.DayWorkRateTotal = 0;
					resItem.IsInformation = false;
					resItem.Co2SourceTotal = 0;
					resItem.Co2ProjectTotal = 0;
					resItem.Co2Source = 0;
					resItem.Co2Project = 0;
				}
			};

			function resetLastPriceListToResource(resItem, selectedItem) {
				resItem.MaterialPriceListFk = selectedItem.MaterialPriceListFk;
				if (resItem.MaterialPriceListFk && selectedItem.PriceLists && selectedItem.PriceLists.length > 0) {
					var priceItem = _.find(selectedItem.PriceLists, {Id: resItem.MaterialPriceListFk});
					if (priceItem) {
						resItem.Charges = priceItem.Charges;
						resItem.Cost = priceItem.Cost;
						resItem.BasCurrencyFk = priceItem.CurrencyFk;
						resItem.Discount = priceItem.Discount;
						resItem.ListPrice = priceItem.ListPrice;
						resItem.PriceExtra = priceItem.PriceExtras;
						resItem.RetailPrice = priceItem.RetailPrice;
						resItem.Co2Source = priceItem.Co2Source;
						resItem.BasCo2SourceFk = priceItem.BasCo2SourceFk;
						resItem.Co2Project = priceItem.Co2Project;
						resItem.MdcTaxCodeFk = priceItem.TaxCodeFk;
						resItem.DayworkRate = priceItem.DayworkRate;
						resItem.EstimatePrice = priceItem.EstimatePrice;
						resItem.DayWorkRateUnit = priceItem.DayWorkRate || priceItem.DayworkRate;
					}
				}
			}

			// select code item for costcode, material etc
			service.setSelectedCodeItem = function setSelectedCodeItem(col, resItem, extractItemProp, lookupItem, isAssembly) {
				let selectedItem = selectedLookupItem;
				let isLookupSelected = selectedItem && selectedItem.Id;
				if ((col === 'Code' || col === 'DescriptionInfo') && isLookupSelected) {
					if (extractItemProp) {
						service.extractSelectedItemProp(selectedItem, resItem, isAssembly);
					}
				} else {
					if (lookupItem !== null && angular.isDefined(lookupItem) && angular.isDefined(lookupItem.Id)) {
						service.extractSelectedItemProp(lookupItem, resItem, isAssembly);
					}
				}
				resItem.ExchangeRate = estimateMainExchangeRateService.getExchRate(resItem.BasCurrencyFk);
			};

			service.ModifyIsIndirectValue = function (res) {
				let advancedAllowanceCostCode = $injector.get('estimateMainContextDataService').getAdvancedAllowanceCc();
				let activeAllowance = $injector.get('estimateMainContextDataService').getAllowanceEntity();
				let lineItem = $injector.get('estimateMainService').getSelected();

				if (res.EstResourceTypeFk === estimateMainResourceType.CostCode && res.MdcCostCodeFk !== null && res.MdcCostCodeFk === advancedAllowanceCostCode) {
					res.IsIndirectCost = true;

					if(_.isEmpty(activeAllowance)){
						res.IsIndirectCost = (lineItem.AdvancedAllowance === 0 && lineItem.AdvancedAll === 0) ? false : (!(lineItem.AdvancedAllowance === 0 && lineItem.AdvancedAll !== 0));
						// res.IsIndirectCost = (!(lineItem.AdvancedAllowance === 0 && lineItem.AdvancedAll !== 0));
					} else {
						res.IsIndirectCost = false;
					}
				}
			};

			/**
			 * @ngdoc function
			 * @name assignAssembly
			 * @function
			 * @methodOf commonCalcResNSub
			 * @description assign assembly to lineitem and set properties
			 * @param {object} lineItem
			 * @param {object} assembly
			 * @param {integer} projectId
			 * @param {bool} isAssemblyToWic
			 * @param {bool} overwrite some flags(overwrite resource and rules)
			 * @param {object} pastedContent when drag from assembly wic
			 * @returns {promise}
			 */
			service.assignAssembly = function assignAssembly(lineItem, assembly, projectId, isAssemblyToWic, overwrite, pastedContent, isNewLineItem) {
				let numPropsToCopy = [
						// foreign keys
						'BasUomFk', 'MdcAssetMasterFk', 'MdcWorkCategoryFk', 'EstCostRiskFk', 'PrcStructureFk',
						'LicCostGroup1Fk', 'LicCostGroup2Fk', 'LicCostGroup3Fk', 'LicCostGroup4Fk', 'LicCostGroup5Fk',
						// numeric values
						'CostTotal', 'CostUnit', 'CostUnitTarget',
						'HoursTotal', 'HoursUnit', 'HoursUnitTarget',
						'Co2Source', 'Co2SourceTotal', 'Co2Project', 'Co2ProjectTotal', 'Co2TotalVariance'
					],
					boolPropsToCopy = [
						'IsDisabled', 'IsLumpsum'
					],
					strPropsToCopy = [
						'DescriptionInfo',
						'UserDefined1', 'UserDefined2', 'UserDefined3', 'UserDefined4', 'UserDefined5',
						'CommentText',
						'CostFactorDetail1', 'CostFactorDetail2', 'QuantityFactorDetail1', 'QuantityFactorDetail2',
						'QuantityDetail', 'ProductivityFactorDetail'
					],
					factorFieldsToCopy = [
						'CostFactor1', 'CostFactor2',
						'QuantityFactor1', 'QuantityFactor2', 'QuantityFactor3', 'QuantityFactor4',
						'Quantity',
						'QuantityUnitTarget',
						'ProductivityFactor'
					];

				_.forEach(strPropsToCopy, function (prop) {
					if (prop === 'DescriptionInfo') {
						if ((isAssemblyToWic && !lineItem.DescriptionInfo.Translated) || !lineItem.DescriptionInfo.Translated || (overwrite && overwrite.overwriteFlag)) {
							let translatedDesc = assembly.DescriptionInfo.Translated;
							lineItem.DescriptionInfo.Translated = translatedDesc ? translatedDesc : assembly.DescriptionInfo.Description;
							lineItem.DescriptionInfo.Description = assembly.DescriptionInfo.Description;
							lineItem.DescriptionInfo.Modified = true;
						}
					} else {
						if (_.isEmpty(lineItem[prop])) {
							if (!isNewLineItem || prop !== 'QuantityDetail'){
								lineItem[prop] = assembly[prop];
							}
						}
					}
				});

				if (overwrite && overwrite.overwriteFlag && overwrite.canRuleOverwrite) {
					let args = {entity: lineItem};
					let scope = {
						entity: lineItem,
						$parent: {
							$parent: {
								config: {
									formatterOptions: {
										dataServiceMethod: 'getItemByRuleAsync',
										dataServiceName: 'estimateRuleFormatterService',
										itemName: 'EstLineItems',
										itemServiceName: 'estimateMainService',
										serviceName: 'basicsCustomizeRuleIconService',
										validItemName: 'EstLineItems'
									}
								}
							}
						}
					};
					$injector.get('estimateRuleComplexLookupCommonService').clearAllItems(args, scope, true);

					scope.$parent.$parent.config.formatterOptions = {
						dataServiceMethod: 'getItemByParamAsync',
						dataServiceName: 'estimateParameterFormatterService',
						itemName: 'EstLineItems',
						itemServiceName: 'estimateMainService',
						serviceName: 'estimateParameterFormatterService',
						validItemName: 'EstLineItems'
					};
					$injector.get('estimateParamComplexLookupCommonService').clearAllItems(args, scope, true);
				}

				_.forEach(numPropsToCopy, function (prop) {
					if (lineItem[prop] <= 0) {
						lineItem[prop] = assembly[prop];
					}
				});
				_.forEach(boolPropsToCopy, function (prop) {
					lineItem[prop] = assembly[prop];
				});
				_.forEach(factorFieldsToCopy, function (prop) {
					if (lineItem[prop] === 1) {
						lineItem[prop] = assembly[prop];
					}
				});

				// assign controlling unit depending on assembly's ctrl group assignments
				if (lineItem.MdcControllingUnitFk <= 0) {
					service.findControllingUnit(assembly.Id, projectId).then(function (response) {
						if (response.data && response.data !== null) {
							lineItem.MdcControllingUnitFk = response.data;
						}
					}
					);
				}

				// While using WIC related assembly container to overwrite line item assembly, UoM and quantity will be overwrite according to takeover quantity and the UoM of the assembly.
				if (overwrite && pastedContent) {
					let takeOverQuantity = pastedContent.data && pastedContent.data.length > 0 ? pastedContent.data[0].Wic2AssemblyQuantity : null;
					if (takeOverQuantity) {
						lineItem.QuantityDetail = lineItem.Quantity = takeOverQuantity;
					}
					lineItem.BasUomFk = assembly.BasUomFk;
				} else if (overwrite && !overwrite.hasSameUom) {
					// While using lookup function to overwrite assembly,
					// system should judge the UoM between the original UoM of line item and the UoM of the assembly,
					// if the UoMs are the same or synonymous, the quantity will remain,
					// otherwise the quantity will be overwrite from the quantity of assembly(Most case is 1).
					lineItem.QuantityDetail = lineItem.Quantity = assembly.Quantity;
					lineItem.BasUomFk = assembly.BasUomFk;
				}

				function getLeafBoqItem(boqItem) {
					if (boqItem && boqItem.BoQItems && boqItem.BoQItems.length === 1) {
						return getLeafBoqItem(boqItem.BoQItems[0]);
					}
					return boqItem;
				}

				if (!isAssemblyToWic) {
					// link boqitem by assembly-wic configuration
					service.linkBoqItemByAssembly(assembly.Id, assembly.EstHeaderFk, lineItem.EstHeaderFk, projectId).then(function (response) {
						if (response.data) {

							// refresh the boqitem lookup cache
							let estimateMainBoqLookupService = $injector.get('estimateMainBoqLookupService');
							estimateMainBoqLookupService.forceReload().then(function (lookupresponse) {
								let estBoqItems = angular.copy(lookupresponse.data);
								estimateMainBoqLookupService.setLookupData(estBoqItems);

								let output = [];
								cloudCommonGridService.flatten(estBoqItems, output, 'BoqItems');
								basicsLookupdataLookupDescriptorService.updateData('estboqitems', output);

								let leafBoqItem = getLeafBoqItem(response.data);
								lineItem.BoqItemFk = leafBoqItem.Id;
								lineItem.BoqHeaderFk = leafBoqItem.BoqHeaderFk;

								// let estimateMainService = $injector.get('estimateMainService');
								// estimateMainService.markItemAsModified(lineItem);
								// estimateMainService.fireItemModified(lineItem);
								// refresh the boqs structure container
								service.onLinkBoqItemSucceeded.fire(response.data);
							});
						}
					});
				}

				let estimateMainAssemblyCategoryCopyAssemblyTemplateRuleService = $injector.get('estimateMainAssemblyCategoryCopyAssemblyTemplateRuleService');
				estimateMainAssemblyCategoryCopyAssemblyTemplateRuleService.assignAssemblyCategoryRules(assembly, lineItem);

				let estimateMainLineItemCopyAssemblyTemplateRuleService = $injector.get('estimateMainLineItemCopyAssemblyTemplateRuleService');
				return estimateMainLineItemCopyAssemblyTemplateRuleService.assignAssemblyRules(assembly, lineItem, isAssemblyToWic, overwrite).then(function () {
					return service.getAssemblyResources(assembly, projectId, lineItem.EstHeaderFk, [lineItem.Id]);
				});
			};

			service.getAssemblyResources = function (assembly, projectId, estHeaderFk, estLineItemIds) {
				// create prepared resources (assemblies are resolved to subitems) from given assembly
				return $http.post(globals.webApiBaseUrl + 'estimate/main/resource/copyResourcesWhenAssignAssembly', {
					AssemblyHeaderId: assembly.EstHeaderFk,
					AssemblyId: assembly.Id,
					ProjectId: projectId,
					EstHeaderId: estHeaderFk,
					EstLineItemIds: estLineItemIds
				});
			};

			service.checkIfResourceCanBeDeleted = function (lineItemId, lineItemUomFk, assemblyUomFk, estHeaderFk) {
				let selectedItem = $injector.get('estimateMainService').getSelected();
				let estLineItemId = lineItemId ? lineItemId : (selectedItem ? selectedItem.Id : null);
				let estHeaderId = estHeaderFk ? estHeaderFk : (selectedItem ? selectedItem.EstHeaderFk : null);
				lineItemUomFk = lineItemUomFk ? lineItemUomFk : -1;
				assemblyUomFk = assemblyUomFk ? assemblyUomFk : -1;

				if (estLineItemId) {
					return $http.post(globals.webApiBaseUrl + 'estimate/main/resource/docheckresourceallowtodelete?lineItemFk=' + estLineItemId + '&lineItemUomFk=' + lineItemUomFk + '&assemblyUomFk=' + assemblyUomFk + '&estHeaderId=' + estHeaderId);
				} else {
					return $q.when();
				}
			};

			service.findControllingUnit = function (assemblyId, projectId) {
				// Try to find a controlling units which:
				// - matches the controlling group assignments of given assembly
				// - and belongs to given project id
				return $http.get(globals.webApiBaseUrl + 'estimate/assemblies/findcontrollingunit?assemblyId=' + assemblyId + '&projectId=' + projectId);
			};

			service.linkBoqItemByAssembly = function (assemblyId, assemblyHeaderId, lineItemHeaderFk, projectId) {
				if (angular.isUndefined(assemblyId) || angular.isUndefined(assemblyHeaderId) || angular.isUndefined(lineItemHeaderFk) || angular.isUndefined(projectId)) {
					return null;
				}
				return $http.get(globals.webApiBaseUrl + 'estimate/main/lineitem/linkboqitemtolineitem?assemblyId=' + assemblyId + '&assemblyHeaderId=' + assemblyHeaderId + '&lineItemHeaderFk=' + lineItemHeaderFk + '&projectId=' + projectId);
			};

			service.resetTotal = function () {
				total = {'totalCost': 0, 'totalCostRisk': 0, 'totalHours': 0, 'majorCostCode': [], 'majorCostTotal': 0, 'isValid': false};

				totalUpdated.fire();
			};

			service.getTotal = function () {
				return total;
			};

			service.setTotal = function (sum) {
				total = sum;
				total.isValid = true;
				totalUpdated.fire();
			};

			service.registerTotalUpdated = function registerTotalUpdated(callBackFn) {
				totalUpdated.register(callBackFn);
			};

			service.unregisterTotalUpdated = function unregisterTotalUpdated(callBackFn) {
				totalUpdated.unregister(callBackFn);
			};

			service.getPrjCostCodes = function getPrjCostCodes() {
				return modifiedPrjCostCodes;
			};

			service.addPrjCostCodes = function addPrjCostCodes(costCode) {
				let item = _.find(modifiedPrjCostCodes, {Id: costCode.Id});
				if (!item) {
					modifiedPrjCostCodes.push(costCode);
				}
			};

			service.setPrjCostCodes = function setPrjCostCodes(projectId) {
				modifiedPrjCostCodes = [];
				if (projectId > 0) {
					$http.get(globals.webApiBaseUrl + 'estimate/main/lineitem/prjcostcodes?projectId=' + projectId).then(function (response) {
						basicsLookupdataLookupDescriptorService.removeData('estprjcostcodes');
						if (response.data && response.data.length) {
							basicsLookupdataLookupDescriptorService.updateData('estprjcostcodes', response.data);
						}
					});
				}
			};

			// calculate total of all major costcodes of resources
			service.getTotalMajorCCByEstHeader = function getTotalMajorCCByEstHeader(estHeaderFk) {

				$http.get(globals.webApiBaseUrl + 'estimate/main/lineitem/getresourcesbyestheaderfk?estHeaderFk=' + estHeaderFk
				).then(function (response) {
					handlerTotalCalculation(response);
				});

			};

			// calculate total of all major costcodes of resources
			service.getTotalMajorCCBySelectedLineItem = function getTotalMajorCCBySelectedLineItem(lineItemId) {

				$http.get(globals.webApiBaseUrl + 'estimate/main/lineitem/getresourcesbylineitem?lineItemId=' + lineItemId
				).then(function (response) {
					handlerTotalCalculation(response);
				});

			};

			// calculate total of all major costcodes of resources
			service.getTotalMajorCCByFilter = function getTotalMajorCCByFilter() {
				function getFilterItemId(serviceName) {
					let service = $injector.get(serviceName);
					if (service && service.getList()) {
						let checkedItems = _.filter(service.getList(), {IsMarked: true});
						if (checkedItems && checkedItems[0]) {
							return checkedItems[0].Id;
						}
					}
					return -1;
				}

				let totalCaluationParam = {
					estHeaderId: $injector.get('estimateMainService') ? $injector.get('estimateMainService').getSelectedEstHeaderId() : -1,
					prjProjectFk: $injector.get('estimateMainService') ? $injector.get('estimateMainService').getSelectedProjectId() : -1,

					boqItemFk: getFilterItemId('estimateMainBoqService'),
					psdActivityFk: getFilterItemId('estimateMainActivityService'),
					prjLocationFk: getFilterItemId('estimateMainLocationService'),
				};

				$http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/getresourcesbyfilter', totalCaluationParam).then(function (response) {
					handlerTotalCalculation(response);
				});
			};

			service.setSelectedLookupItem = function setSelectedLookupItem(lookupItem) {
				selectedLookupItem = lookupItem;
				isLookupSelected = true;
			};

			service.getSelectedLookupItem = function setSelectedLookupItem() {
				return selectedLookupItem;
			};

			service.resetLookupItem = function resetLookupItem() {
				selectedLookupItem = {};
				isLookupSelected = false;
				selectedLookupItems =[];
			};

			service.setSelectedLookupItems = function setSelectedLookupItems(lookupItems) {
				selectedLookupItems = lookupItems;
			};

			service.getSelectedLookupItems = function getSelectedLookupItems() {
				return selectedLookupItems;
			};

			service.getAssemblyType = function getAssemblyType(assemblyId) {
				return $http.get(globals.webApiBaseUrl + 'estimate/assemblies/assemblytype/assemblytypebyassemblyid?assemblyId=' + assemblyId);
			};

			service.CheckAssemblyCircularDependency = function CheckAssemblyCircularDependency(/* assemblyId */) {
				return $q.when({data: false});
			};

			service.getAssemblyById = function getAssemblyById(id) {
				return $http.get(globals.webApiBaseUrl + 'estimate/main/lineitem/getassemblybyid?id=' + id);
			};

			service.getAssembliesById = function getAssembliesById(ids) {
				return $http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/getassembliesbyid', ids);
			};

			service.getAssemblyTypeById = function getAssemblyTypeById(id) {
				return basicsLookupdataLookupDescriptorService.getLookupItem('estassemblytypes', id);
			};

			service.getResourceTypeByAssemblyType = function getResourceTypeByAssemblyType(assemblyType) {
				let defer = $q.defer();
				$injector.get('estimateMainResourceTypeLookupService').getListAsync().then(function (resourceTypes) {
					let resourceType = _.find(resourceTypes, {EstAssemblyTypeFk: assemblyType.Id, EstAssemblyTypeLogicFk: assemblyType.EstAssemblyTypeLogicFk});
					defer.resolve(resourceType);
				});
				return defer.promise;
			};

			service.moveSelectedItemTo = function moveSelectedItemTo(type, gridId) {

				let items = platformGridAPI.items.data(gridId);
				let selectedData = getGridSelectedInfos(gridId);
				let i;

				selectedData.selectedRows = sortNumber(selectedData.selectedRows);

				switch (type) {
					case 1:
						// moveUp
						for (i = 0; (i < selectedData.selectedRows.length && selectedData.selectedRows[i] - 1 >= 0); i++) {
							items.splice(selectedData.selectedRows[i] - 1, 0, items.splice(selectedData.selectedRows[i], 1)[0]);
						}
						break;
					case 3:
						// moveDown
						selectedData.selectedRows = selectedData.selectedRows.reverse();
						for (i = 0; (i < selectedData.selectedRows.length && selectedData.selectedRows[i] + 1 < items.length); i++) {
							items.splice(selectedData.selectedRows[i] + 1, 0, items.splice(selectedData.selectedRows[i], 1)[0]);
						}
						break;
				}

				platformGridAPI.items.data(gridId, items);
				platformGridAPI.rows.selection({gridId: gridId, rows: selectedData.selectedItems});

				// update the sorting
				let index = 0;
				angular.forEach(items, function (item) {
					item.Sorting = index;
					index++;
				});
			};

			function getGridSelectedInfos(gridId) {
				let selectedInfo = {};
				let gridinstance = platformGridAPI.grids.element('id', gridId).instance;
				selectedInfo.selectedRows = angular.isDefined(gridinstance) ? gridinstance.getSelectedRows() : [];
				selectedInfo.selectedItems = selectedInfo.selectedRows.map(function (row) {
					return gridinstance.getDataItem(row);
				});
				return selectedInfo;
			}

			function sortNumber(toSort) {
				return toSort.sort(function (a, b) {
					return a - b;
				});
			}

			/* characteristic in esitmate and assembly */
			// get all item by section Id
			service.generateCharacteristicColumns = function generateCharacteristicColumns(dataService, sectionId) {
				let CharacteristicDataService = $injector.get('basicsCharacteristicDataServiceFactory');
				let charaDataService = CharacteristicDataService.getService(dataService, sectionId);
				return charaDataService.getAllItemBySectionId(true);
			};

			service.appendCharactiricColumnData = function appendCharactiricColumnData(data, dataService, items, isCreateAssignDefault) {
				let lineItems = items ? items : dataService.getList() || [];
				let platformRuntimeDataService = $injector.get('platformRuntimeDataService');
				let CharacteristicTypeService = $injector.get('basicsCharacteristicTypeHelperService');
				let fields = [];

				let groupData = _.groupBy(data,function(item){ return service.appendCharacCol(null, item);});

				let getCharacteristicValue = function(characteristic){
					if (characteristic.CharacteristicTypeFk === 10) {
						characteristic.ValueText = null;
						if (characteristic.CharacteristicValueFk !== null) {
							characteristic.ValueText = characteristic.CharacteristicValueFk;
						} else {
							characteristic.ValueText = null;
						}
					}

					return CharacteristicTypeService.convertValue(characteristic.ValueText, characteristic.CharacteristicTypeFk);
				};

				angular.forEach(lineItems, function (lineItem) {
					angular.forEach(groupData, function(groupItems, characteristicCol){
						if(isCreateAssignDefault){
							let lastCharacteristic = _.last(groupItems);
							lineItem[characteristicCol] = getCharacteristicValue(lastCharacteristic);
						}else{
							let characteristic = _.find(groupItems, {ObjectFk: lineItem.Id});
							if(characteristic){
								lineItem[characteristicCol] = getCharacteristicValue(characteristic);
							}else if (lineItem[characteristicCol] === undefined) {
								let lastCharacteristic = _.last(groupItems);
								let type = CharacteristicTypeService.characteristicType2Domain(lastCharacteristic.CharacteristicTypeFk);
								lineItem[characteristicCol] = type === 'boolean' ? false : null;
							}
						}
					});

					if (lineItem.EstRuleSourceFk) {
						if (fields.length === 0) {
							for (let item in lineItem) {
								// eslint-disable-next-line no-prototype-builtins
								if(lineItem.hasOwnProperty(item)){
									fields.push({field: item, readonly: true});
								}
							}
						}

						platformRuntimeDataService.readonly(lineItem, fields);
					}
				});
			};

			service.setDynamicColumnsData = function setDynamicColumnsData(readData, dynamicColumns, isCombined){
				let dynamicColService = $injector.get('estimateMainDynamicColumnService');

				let dynColumns = readData.dynamicColumns || {};

				let estLineItemConfigDetails = dynColumns.ColumnConfigDetails || [];
				let estLineItemCharacteristics = dynColumns.Characteristics || [];
				let defaultCharacteristics = dynColumns.DefaultCharacteristics || [];
				let characteristicGroupIds = dynColumns.CharacteristicsGroupIds || [];
				let extendColumnValues = readData.ExtendColumns || [];
				let udpValues = dynColumns.liUDPs || [];

				if (_.size(estLineItemConfigDetails) > 0 ){
					dynamicColService.appendExtendColumnValuesToLineItem(readData.dtos, extendColumnValues);
				}

				// default line item character
				if(_.size(defaultCharacteristics) > 0) {
					let groupsIds = characteristicGroupIds;
					defaultCharacteristics = _.filter(defaultCharacteristics, function (item) {
						return item.Characteristic && groupsIds.indexOf(item.Characteristic.CharacteristicGroupFk) >= 0;
					});
					dynamicColService.setDefaultCharacteristics(defaultCharacteristics);
				}

				if(_.size(estLineItemCharacteristics) > 0){
					service.appendCharactiricColumnData(estLineItemCharacteristics, service, readData.dtos);
				}

				if (!isCombined) {
					// load user defined column and attach data into lineitems
					let estimateMainDynamicUserDefinedColumnService = $injector.get('estimateMainDynamicUserDefinedColumnService');
					estimateMainDynamicUserDefinedColumnService.attachUpdatedValueToColumn(readData.dtos, udpValues, false);
				}

				dynamicColService.setDyAndCharCols(dynamicColumns);
			};

			// get characteristic culomn
			service.getCharactCols = function getCharactCols(data) {
				let charactCols = [];
				if (data) {
					angular.forEach(data, function (item) {
						let characteristicCode = _.findLast(item.CharacteristicEntity.Code) === '.' ? _.trimEnd(item.CharacteristicEntity.Code, '.') : item.CharacteristicEntity.Code;
						let columnIdorField = characteristicCode.replace(/ /g, '');
						let columnName = characteristicCode;
						let characteristicCol = service.appendCharacCol(columnIdorField, item);
						let colData = _.filter(charactCols, {'id': characteristicCol});
						if (!colData || (colData && colData.length === 0)) {
							let charactCol = service.createCharactCol(item, columnIdorField, columnName);
							charactCols.push(charactCol);
						}
					});
				}
				return charactCols;
			};

			service.appendCharacCol = function appendCharacCol(idorField, item) {
				// let columnIdorField = idorField.replace(/ /g, '');

				if (item.CharacteristicEntity && item.CharacteristicEntity.Id > 0) {
					item.CharacteristicGroupFk = item.CharacteristicEntity.CharacteristicGroupFk;
					item.CharacteristicTypeFk = item.CharacteristicEntity.CharacteristicTypeFk;
				}
				return 'charactercolumn' + '_' /* + columnIdorField + '_' */ + item.CharacteristicGroupFk.toString() + '_' + item.CharacteristicTypeFk + '_' + item.CharacteristicFk.toString();
			};

			// create one characteristic column
			service.createCharactCol = function createCharactCol(item, columnIdorField, columnName) {
				let formatterData = service.getFormatter(item);
				let characteristicColumn = service.appendCharacCol(columnIdorField, item);

				// Characteristic column name
				let characteristicColumnName = columnName;
				if (item.CharacteristicSectionFk === 28||item.CharacteristicSectionFk === 30||item.CharacteristicSectionFk === 33) { // Estimate characteristic2||Assemblies Characteristics2||Estimate Resources Characteristics
					characteristicColumnName = _.isEmpty(item.CharacteristicEntity.DescriptionInfo.Description) ? characteristicColumnName : item.CharacteristicEntity.DescriptionInfo.Description;
				}

				let charactCol = platformTranslateService.translateGridConfig({
					domain: formatterData.formatter,
					id: characteristicColumn,
					editor: formatterData.formatter,
					field: characteristicColumn,
					name: characteristicColumnName,
					name$tr$: undefined,
					formatter: formatterData.formatter,
					editorOptions: formatterData.editorOptions,
					formatterOptions: formatterData.formatterOptions,
					hidden: false,
					bulkSupport: false,
					required: false,
					grouping: {
						title: characteristicColumnName,
						getter: characteristicColumn,
						aggregators: [],
						aggregateCollapsed: true
					},
					sortable: true,
					isCharacteristic: true,
					isCharacteristicExpired: item.IsReadonly,
					validator: function validator(entity, value, model) {
						if (item.IsReadonly) {
							entity[model + '__revert'] = entity[model];
						}
						return true;
					}
				});
				return charactCol;
			};

			// get the formatter for characteristic
			service.getFormatter = function getFormatter(item) {
				let domain = {
					formatter: null,
					editorOptions: null,
					formatterOptions: null
				};
				switch (item.CharacteristicTypeFk) {
					case 10:
						domain.formatter = 'lookup';
						domain.editorOptions = {
							directive: 'basics-characteristic-value-combobox'
						};
						domain.formatterOptions = {
							lookupType: 'CharacteristicValue',
							displayMember: 'DescriptionInfo.Translated'
						};
						break;
					default:
						var CharacteristicTypeService = $injector.get('basicsCharacteristicTypeHelperService');
						domain.formatter = CharacteristicTypeService.characteristicType2Domain(item.CharacteristicTypeFk);
						domain.editorOptions = null;
						domain.formatterOptions = null;
						break;
				}
				return domain;
			};

			// true: remove column, false: do not remove
			service.isRemoveColunm = function isRemoveColunm(selectItem, idorField, dataService) {
				let lineItems = dataService.getList() || [];
				return !_.some(lineItems, function (lineItem) {
					if (lineItem.Id !== selectItem.Id && (lineItem[idorField] !== null && lineItem[idorField])) {
						return true;
					} else {
						return false;
					}
				});
			};

			service.syncCharacteristicCol = function syncCharacteristicCol(lineItem, characteristicCol, type, dataService) {
				let lineItemList = dataService.getList();
				angular.forEach(lineItemList, function (item) {
					if (item.Id !== lineItem.Id) {
						item[characteristicCol] = type === 'boolean' ? false : null;
						// estimateMainService.markItemAsModified(item);
					}
				});
			};

			service.isCharacteristicCulumn = function isCharacteristicCulumn(col) {
				if (col && col.isCharacteristic) {
					return true;
				}
				return false;
			};

			service.isCharacteristicColumnExpired = function isCharacteristicColumnExpired(col) {
				return (col && col.isCharacteristicExpired);
			};

			service.getCharacteristicColValue = function getCharacteristicColValue(lineItem, colArray) {
				let itemValue = lineItem;
				angular.forEach(colArray, function (col) {
					if (itemValue[col]) {
						itemValue = itemValue[col];
					}
				});

				return itemValue;
			};

			let _companyContextFk = -1;
			service.setCompanyContextFk = function setCompanyContextFk(contextFk) {
				_companyContextFk = contextFk;
			};

			service.getCompanyContextFk = function getCompanyContextFk() {
				return _companyContextFk;
			};

			service.DeletePrcPackageAssignments = function DeletePrcPackageAssignments(item, level) {
				if (!item) {
					return;
				}
				let items = !_.isArray(item) ? [item] : item;
				let data = {
					EstLineItems: level === 'LineItems' ? items : [],
					EstResources: level === 'Resources' ? items : []
				};

				return $http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/deleteprcpackageassignment', data).then(function () {
					return;
				});
			};

			service.collectRule2Deleted = function collectRule2Deleted(updateData) {

				$injector.get ('estimateMainRootService').setRuleToDelete(updateData.EstHeaderRuleToDelete);

				$injector.get ('estimateMainControllingService').setRuleToDelete(updateData.EstCtuRuleToDelete);

				$injector.get ('estimateMainProcurementStructureService').setRuleToDelete(updateData.EstPrcStructureRuleToDelete);

				$injector.get ('estimateMainLocationService').setRuleToDelete(updateData.EstPrjLocationRuleToDelete);

				$injector.get ('costGroupStructureDataServiceFactory').setRuleToDelete(updateData.EstCostGrpRuleToDelete);

				$injector.get ('estimateMainBoqService').setRuleToDelete(updateData.EstBoqRuleToDelete);

				$injector.get ('estimateMainActivityService').setRuleToDelete(updateData.EstActivityRuleToDelete);

				$injector.get ('estimateMainAssembliesCategoryService').setRuleToDelete(updateData.EstAssemblyCatRuleToDelete);

				$injector.get ('estimateMainService').setRuleToDelete(updateData.EstLineItemsRuleToDelete);

			};


			service.GetResourcesByLineItemIds = function GetResourcesByLineItemIds(lineItemIds, headerIds) {
				let postData = {
					lineItemIds: lineItemIds,
					headerIds: headerIds
				};
				return $http.post(globals.webApiBaseUrl + 'estimate/main/resource/GetResourcesByLineItemIds', postData);
			};

			let isActivate = false;
			/**
			 * @ngdoc function
			 * @name getActivateEstIndicator
			 * @function
			 * @methodOf calItemBudgetDiff
			 * @description check activate estimate indicator in system option
			 */
			service.getActivateEstIndicator = function getActivateEstIndicator() {
				return isActivate;
			};

			/**
			 * @ngdoc function
			 * @name setActivateEstIndicator
			 * @function
			 * @methodOf calItemBudgetDiff
			 * @description set activate estimate indicator from system option
			 */
			service.setActivateEstIndicator = function setActivateEstIndicator() {
				isActivate = false;// default value

				let basicCustomizeSystemoptionLookupDataService = $injector.get('basicCustomizeSystemoptionLookupDataService');
				if (basicCustomizeSystemoptionLookupDataService) {
					let systemOptions = basicCustomizeSystemoptionLookupDataService.getList();
					if (systemOptions && systemOptions.length > 0) {
						let items = _.filter(systemOptions, function (systemOption) {
							if (systemOption.Id === 10011) {
								return systemOption;
							}
						});

						if (items && items.length > 0) {
							if (items[0].ParameterValue && (items[0].ParameterValue.toLowerCase() === 'true' || items[0].ParameterValue === '1')) {
								isActivate = true;
							}
						}
					}
				}
			};

			service.getEstAssemblyTypeLogics = function () {
				return estAssemblyTypeLogics;
			};

			service.getEStResourceTypes = function () {
				return estResourceTypes;
			};

			service.isLumpsumUom = function isLumpsumUom(uomId) {
				return $injector.get('basicsUnitLookupDataService').getItemByIdAsync(uomId, {lookupType:'Uom', dataServiceName:'basicsUnitLookupDataService'})
					.then(function(uom){
						if(uom && uom.UomTypeFk === 8){
							lsumUom = uom;
							return true;
						}
						return false;
					});
			};

			service.setQuantityByLsumUom = function setQuantityByLsumUom(lineItem, doCheckLsum, isLsumUom) {
				if(!lineItem){
					return;
				}
				if(doCheckLsum){
					isLsumUom = lineItem.BasUomFk !== null && service.getLsumUomId() === lineItem.BasUomFk;
				}
				if(isLsumUom){
					lineItem.WqQuantityTarget = 1;
					lineItem.WqQuantityTargetDetail = lineItem.WqQuantityTarget.toString();
					lineItem.QuantityTarget = 1;
					lineItem.QuantityTargetDetail = lineItem.QuantityTarget.toString();
				}
			};

			service.setLsumUom = function setLsumUom() {
				$injector.get('basicsUnitLookupDataService').getList({lookupType:'Uom', dataServiceName:'basicsUnitLookupDataService'})
					.then(function(list){
						lsumUom = _.find(list, {UomTypeFk : 8});
					});
			};

			service.getLsumUomId = function getLsumUomId() {
				return lsumUom ? lsumUom.Id : null;
			};

			service.calculateDetails = calculateDetails;
			service.calQuantityUnitTarget = calQuantityUnitTarget;
			service.calculateResource = calculateResource;
			service.calculateLineItemAndResources = calculateLineItemAndResources;

			service.setMergeCell = function setMergeCell(item, gridId) {
				let mergeCells = [];
				if (item !== null && item !== undefined) {
					let baseColumn = {};
					let colspanCount = {};
					baseColumn = {baseField: 'descriptioninfo'};
					colspanCount = getColSpanCount(baseColumn, gridId);
					mergeCells = [
						{colid: baseColumn.baseField, colspan: colspanCount}
					];
					if (item.__rt$data) {
						platformGridAPI.cells.mergeCells(gridId, mergeCells, item);
					}
				}
			};

			service.ClearDeserializationError = function (updateData){
				if (updateData && updateData.PrjEstLineItemToSave){
					_.each(updateData.PrjEstLineItemToSave, function (estLineItem){
						if (estLineItem.PrjEstLineItem){
							estLineItem.PrjEstLineItem.DayWorkRateUnit = estLineItem.PrjEstLineItem.DayWorkRateUnit ? estLineItem.PrjEstLineItem.DayWorkRateUnit : 0;
							estLineItem.PrjEstLineItem.BudgetUnit = estLineItem.PrjEstLineItem.BudgetUnit ? estLineItem.PrjEstLineItem.BudgetUnit : 0;
							estLineItem.PrjEstLineItem.DayWorkRateTotal = estLineItem.PrjEstLineItem.DayWorkRateTotal ? estLineItem.PrjEstLineItem.DayWorkRateTotal : 0;
						}

						if (estLineItem.PrjEstResourceToSave){
							_.each(estLineItem.PrjEstResourceToSave, function (estResrouce){
								if (estResrouce.PrjEstResource){
									estResrouce.PrjEstResource.DayWorkRateTotal = estResrouce.PrjEstResource.DayWorkRateTotal ? estResrouce.PrjEstResource.DayWorkRateTotal : 0;
								}
							});
						}
					});
				}

				if(updateData.PrjEstRuleToSave){
					_.each(updateData.PrjEstRuleToSave, function (prjEstRule){
						if (prjEstRule.PrjEstRuleParamToSave){
							_.each(prjEstRule.PrjEstRuleParamToSave, function (prjEstRuleParam){
								if (prjEstRuleParam.PrjEstRuleParam) {
									prjEstRuleParam.PrjEstRuleParam.DefaultValue = prjEstRuleParam.PrjEstRuleParam.DefaultValue ? prjEstRuleParam.PrjEstRuleParam.DefaultValue : 0;
								}
							});
						}
					});
				}
			};

			service.translateCommentCol = function(item){
				if(item && item.CommentText){
					item.originCommentText = item.originCommentText || item.CommentText;
					item.CommentText = service.translateCommentColtext(item.CommentText);
				}
			};

			service.translateCommentColtext = function (commentText){
				let reg = /{.*?}/ig;
				if(commentText && reg.test(commentText)){
					let translate = $injector.get('$translate');
					let list = commentText.match(reg);
					_.forEach(list, function (item){
						commentText = commentText.replace(item, translate.instant('estimate.main.' + item.substring(1,item.length - 1)));
					});
				}

				return _.trimEnd(commentText, ', ');
			};

			function getCommonItemInfo(item, itemInfos){
				if (item.IsDisabled || item.IsOptional) {
					itemInfos.push($translate.instant(estimateItemInfoTypes.disabled));
				}
				if (item.IsLumpsum) {
					itemInfos.push($translate.instant(estimateItemInfoTypes.lumpsum));
				}
				if (item.IsGc) {
					itemInfos.push($translate.instant(estimateItemInfoTypes.gcItem));
				}
				if (item.IsFixedBudget) {
					itemInfos.push($translate.instant(estimateItemInfoTypes.fixedBudget));
				}
				if (item.IsIncluded) {
					itemInfos.push($translate.instant(estimateItemInfoTypes.included));
				}
			}

			service.buildLineItemInfo = function buildLineItemInfo(item) {
				let itemInfos = [];
				let result;

				getCommonItemInfo(item, itemInfos);

				if (item.IsOptionalIT) {
					itemInfos.push($translate.instant(estimateItemInfoTypes.optionalIT));
				}
				if (item.IsNoMarkup) {
					itemInfos.push($translate.instant(estimateItemInfoTypes.noMarkup));
				}
				if (item.IsFixedPrice) {
					itemInfos.push($translate.instant(estimateItemInfoTypes.fixedPrice));
				}
				if (item.NoLeadQuantity) {
					itemInfos.push($translate.instant(estimateItemInfoTypes.noLeadQuantity));
				}

				result = itemInfos.join();
				return result;
			};

			service.buildResourceItemInfo = function buildResourceItemInfo(item) {
				let itemInfos = [];
				let result;

				getCommonItemInfo(item, itemInfos);

				if (item.IsDisabledPrc) {
					itemInfos.push($translate.instant(estimateItemInfoTypes.disabledPrc));
				}
				if (item.IsRuleMarkupCostCode) {
					itemInfos.push($translate.instant(estimateItemInfoTypes.markupCost));
				}
				if (!item.IsBudget) {
					itemInfos.push($translate.instant(estimateItemInfoTypes.noBudget));
				}
				if (item.IsGeneratedPrc) {
					itemInfos.push($translate.instant(estimateItemInfoTypes.generateByPrc));
				}

				result = itemInfos.join();
				return result;
			};

			let detailColumns = ['CostFactorDetail1','CostFactorDetail2','WqQuantityTargetDetail',
				'QuantityFactorDetail1','QuantityFactorDetail2','QuantityTargetDetail', 'ProductivityFactorDetail', 'QuantityDetail', 'EfficiencyFactorDetail1','EfficiencyFactorDetail2'
			];

			service.checkDetailFormat = function (dtos, dataService){
				if(!dtos || dtos.length <= 0){return;}

				let formulas = [],
					numReg = new RegExp('^(-)?\\d+(\\.\\d+)?$');

				_.forEach(dtos, function (dto){
					_.forEach(detailColumns, function (col){
						let formula = angular.copy(dto[col]);
						removeUselessChars(formula);
						if(formula && col === 'QuantityDetail' && dto.EstResourceTypeFk === estimateMainResourceType.ComputationalLine){
							formula= formula.replace(/(\d+)\(([^)]+)\)/g,'$1*($2)'); // brackets
							formula = formula.replace(/(\d+)\s*([A-Za-z_]+)|([A-Za-z_]+)*\s(\d+)/g, '$1*$2'); // consecutive text
						}
						if(formula && !numReg.test(formula) && formulas.indexOf(formula) < 0){
							formulas.push(formula);
						}
					});
				});

				if(formulas.length > 0){
					$http.post(globals.webApiBaseUrl + 'basics/common/calculateexpressions/formulascheck', formulas).then(function (response){
						if(response && response.data){
							_.forEach(dtos, function (dto){
								_.forEach(detailColumns, function (col){
									let formula = angular.copy(dto[col]);
									removeUselessChars(formula);

									if(formula && !numReg.test(formula) && response.data[formula]){
										dto.__rt$data = dto.__rt$data || {};
										dto.__rt$data.errors = dto.__rt$data.errors || {};
										let errStr = '', i = 1;
										if (response.data[formula].length > 1) {
											_.forEach(response.data[formula], function (item) {
												errStr += '【' + i + ', ' + item + '】';
												i++;
											});
										}else {
											errStr = response.data[formula][0];
										}
										dto.__rt$data.errors[col] = {error: errStr};
									}
								});
							});
							dataService.gridRefresh();
						}
					});
				}
			};

			function removeUselessChars(formula){
				if(!formula){return null;}
				formula = formula.replace(/[,]/gi, '.');
				formula = formula.replace(/\s/gi, '');
				formula = formula.replace(/mod/gi, '%').replace(/'.*?'/gi, '').replace(/{.*?}/gi, '');
				formula = formula.replace(/div/gi, '%');
				return formula;
			}

			service.collectConfDetailColumnsToSave = function (combinedLineItems, confDetailColumns){
				let confDetail = [],
					confDetailItems={};
				angular.forEach(combinedLineItems,function(items){
					if(items.CombinedLineItems && items.CombinedLineItems.length > 0)
					{
						angular.forEach(confDetailColumns,function(col){
							if(items.CombinedLineItems[0][col.id]){
								confDetailItems.key = col.id;
								confDetailItems.value = items.CombinedLineItems[0][col.id];
								if(confDetailItems) {
									confDetail.push(confDetailItems);
								}
							}
						});

					}
				});

				return confDetail;
			};

			let boqHeader2Id2SplitQtyList = [];
			service.setBoqHeader2Id2SplitQtyList = function setBoqHeader2Id2SplitQtyList(list){
				boqHeader2Id2SplitQtyList = list && list.length ? list : [];
			};

			// Enable/disable Calculate Split Quantity at LineItem
			service.doCalculateSplitQuantity = function doCalculateSplitQuantity(boqItemId, boqHeaderId){
				let boqItem = _.find(boqHeader2Id2SplitQtyList, {Item1:boqHeaderId, Item2:boqItemId});
				return boqItem && boqItem.Item3;
			};

			service.setCLMergeCell = function setCLMergeCell(item,gridId) {
				let mergeCells = [];
				let mergeCellResult = {};
				if (item !== null && item !== undefined) {
					let baseColumn ={};

					let colspanCount ={};
					baseColumn = {baseField:'quantitydetail'};

					colspanCount = getColSpanCount(baseColumn, gridId);

					mergeCellResult = {resultField: 'quantity', makeVisible: true};

					mergeCells = [
						{colid: baseColumn.baseField, colspan: colspanCount}
					];
				}
				if(item.__rt$data){
					platformGridAPI.cells.mergeCells(gridId, mergeCells, item, mergeCellResult);
				}
			};

			service.showConcurrencyBox = function showConcurrencyBox(response){

				if(!response || !response.isConcurrencyErr){
					return;
				}

				let msgBoxOptions = {
					bodyText: response.errorLog,
					headerText: platformTranslateService.instant('platform.concurrencyExceptionHeader', undefined, true),
					iconClass: 'ico-info',
					windowClass: 'msgbox',
					bodyMarginLarge: true,
					buttons: [{
						id: 'reload',
						caption$tr$: 'platform.concurrencyReload',
						autoClose: true,
						fn: function () {
							$injector.get('estimateMainService').load();
						}
					}, {
						id: 'cancel',
						caption$tr$: 'platform.cancelBtn'
					}]
				};

				return $injector.get('platformDialogService').showDialog(msgBoxOptions);

			};

			function getColSpanCount(baseColumn, gridId) {
				let cols = platformGridAPI.columns.configuration(gridId).visible;
				let allVisibleCols = [];
				let totalCellToMerge = 6;
				if (cols !== null && cols !== undefined) {
					allVisibleCols = _.map(cols, 'id');
				}
				let colspanCount = 1;
				let sIndex = allVisibleCols.indexOf(baseColumn.baseField);

				for (let i = sIndex + 1; i <= sIndex+totalCellToMerge; i++) {
					colspanCount++;
				}
				return colspanCount;
			}

			return service;
		}]);
})(angular);
