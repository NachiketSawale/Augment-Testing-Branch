/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	/* global _ */
	let moduleName = 'estimate.main';
	/**
     * @ngdoc service
     * @name estimateMainResourceDetailService
     * @function
     *
     * @description
     * estimateMainResourceDetailService is the data service for resource related functionality.
     */
	angular.module(moduleName).factory('estimateMainResourceDetailService',
		['$q', '$injector','PlatformMessenger','estimateMainResourceService', 'estimateMainService', 'estimateMainResourceImageProcessor', 'estimateMainSubItemCodeGenerator',
			'estimateMainResourceProcessor', 'estimateMainCommonService', 'estimateMainCommonCalculationService', 'estimateMainGenerateSortingService', 'estimateMainExchangeRateService', 'estimateMainResourceType',
			function ($q, $injector, PlatformMessenger,estimateMainResourceService, estimateMainService, estimateMainResourceImageProcessor, estimateMainSubItemCodeGenerator,
				estimateMainResourceProcessor, estimateMainCommonService, estimateMainCommonCalculationService, estimateMainGenerateSortingService, estimateMainExchangeRateService, estimateMainResourceType) {
				let resList = [];
				let service = {
					fieldChange: fieldChange,
					valueChangeCallBack: valueChangeCallBack,
					estResourceChangeCode: estResourceChangeCode,
					updateCodeAndSorting: updateCodeAndSorting,
					setResourcesBusinessPartnerName: setResourcesBusinessPartnerName,
					changeSubitemChildrenCode:changeSubitemChildrenCode
				};

				service.cellStyleChanged = new PlatformMessenger();

				let calcFields = [
					'Code',
					'DescriptionInfo',
					'EstCostTypeFk',
					'EstResourceFlagFk',
					'BasUomFk',
					'LgmJobFk'
				];

				function fireLiAndResAsModified(lineItem, resources){
					if (lineItem) {
						estimateMainService.fireItemModified(lineItem);
					}
					if(_.isArray(resources) && resources.length > 0){
						_.forEach(resources, function(resource){
							estimateMainResourceService.fireItemModified(resource);
						});
					}
				}

				function refreshDataForResourceTree(lineItem, resource, type) {
					const resourcesToBeMarked = [];
					resourcesToBeMarked.push(resource);
					let allResourcesList = estimateMainResourceService.getList();
					let resourceParents = type === 'parent' || _.isEmpty(type) ? getAllResourceParents(resource, allResourcesList) : [];
					let resourceChildren = type === 'child' || _.isEmpty(type) ? getAllResourceChildren(resource, allResourcesList) : [];
					fireLiAndResAsModified(lineItem, resourcesToBeMarked.concat(resourceParents, resourceChildren));
				}

				function getAllResourceParents(resource, allResources) {
					const resourceParents = [];
					const findResourceParents = (resource) => {
						const parent = _.find(allResources, { Id: resource.EstResourceFk });
						if (parent) {
							resourceParents.push(parent);
							findResourceParents(parent);
						}
					};
					findResourceParents(resource);
					return resourceParents;
				}

				function getAllResourceChildren(resource, allResources) {
					const resourceChildren = [];
					const findResourceChildren = (resource) => {
						const itemChildren = _.filter(allResources, { EstResourceFk: resource.Id });
						if (itemChildren.length > 0) {
							resourceChildren.push(...itemChildren);
							_.forEach(itemChildren, (child) => {
								findResourceChildren(child);
							});
						}
					};
					findResourceChildren(resource);
					return resourceChildren;
				}

				function fieldChange(item, field, column) {
					resList = estimateMainResourceService.getList();
					let parentLineItem = estimateMainService.getSelected(),
						selectedResourceItem = estimateMainResourceService.getSelected(),
						projectInfo = estimateMainService.getSelectedProjectInfo();

					if (item && item.Id && field) {
						let argData = {item: item, colName: field};

						let calculateAndRefresh = function calculateAndRefresh() {
							estimateMainExchangeRateService.loadData(projectInfo.ProjectId).then(
								function () {
									$injector.get('estimateMainExchangeRateService').setExchRate(item.BasCurrencyFk).then(function () {
										let resourcesChanged = estimateMainCommonService.estimateResources(argData, resList, parentLineItem, null);
										estimateMainCommonService.calculateExtendColumnValuesOfLineItem(parentLineItem, resList);
										fireLiAndResAsModified(parentLineItem, resourcesChanged);
									});
								});
						};

						if (field === 'EstResourceTypeFkExtend' || field === 'EstResourceTypeShortKey') {
							// TODO: set original price and quantity

							if(item.EstResourceTypeFk === estimateMainResourceType.ComputationalLine){
								service.cellStyleChanged.fire(item,'CL');
							}

							if(item.EstResourceTypeFk === estimateMainResourceType.TextLine || item.EstResourceTypeFk === estimateMainResourceType.InternalTextLine){
								service.cellStyleChanged.fire(item,'IT');
							}

							if (item.Version === 0) {
								item.QuantityOriginal = item.Quantity;
								item.CostUnitOriginal = item.CostUnit;
							}

							if(item.EstResourceTypeFk === estimateMainResourceType.Assembly){
								estimateMainResourceProcessor.processItem(item, null);
							}

							// item.ColumnId = 0;
							// do not take over if resource type is assembly || resource type is material
							if (item.EstResourceTypeFk !== 4) {
								item.BasUomFk = parentLineItem.BasUomFk;
							}
							item.BasCurrencyFk = projectInfo && projectInfo.ProjectCurrency ? projectInfo.ProjectCurrency : null;
							item.Code = item.DescriptionInfo.Translated = item.DescriptionInfo.Description = '';
							estimateMainResourceImageProcessor.processItem(item);

							if (item.EstResourceTypeFk === estimateMainResourceType.Material) { // Material
								item.BasCurrencyFk = null;
								item.BasUomFk = 0; // uom is not null, set as 0
							} else if (item.EstResourceTypeFk === estimateMainResourceType.SubItem) { // SubItem?
								estimateMainSubItemCodeGenerator.getSubItemCode(item, resList);
								estimateMainResourceProcessor.processItem(item, null);
								estimateMainResourceProcessor.setCostUnitReadOnly(item, true);
								estimateMainResourceProcessor.setLineTypeReadOnly(item, true);
								// estimateMainResourceProcessor.setSubItemResourceProcurementPackageReadOnly(item );
							} else if(item.EstResourceTypeFk === estimateMainResourceType.InternalTextLine || item.EstResourceTypeFk === estimateMainResourceType.TextLine) {
								item.BasCurrencyFk = null;
								item.BasUomFk = 0; // uom is not null, set as 0
								estimateMainResourceProcessor.processItem(item, null);
								estimateMainResourceProcessor.setCostUnitReadOnly(item, true);
								estimateMainResourceProcessor.setLineTypeReadOnly(item, true);
							} else {
								return;
							}
							calculateAndRefresh();
						}
						else {
							// TODO: set original price and quantity
							if (field === 'Code' && item.Version === 0) {
								item.QuantityOriginal = item.Quantity;
								item.CostUnitOriginal = item.CostUnit;
							}

							if (field === 'CostUnit' && item.Version === 0) {
								item.CostUnitOriginal = item.CostUnit;
							}

							if (field === 'Quantity' && item.Version === 0) {
								item.QuantityOriginal = item.Quantity;
							}

							// calculation if code, description,cost type, resource flag, uom changes
							if (calcFields.indexOf(field) !== -1) {
								let info = {
									'projectInfo': projectInfo,
									'selectedResourceItem': selectedResourceItem,
									'parentLineItem': parentLineItem,
									'resList': resList,
									'lineItemList': estimateMainService.getList()
								};
								estimateMainCommonCalculationService.setInfo(info);

								// code extracted to function to use it twice (caused by async call below)
								if ([1, 2, 4].indexOf(item.EstResourceTypeFk) !== -1 && field === 'Code' && !_.isEmpty(item[field])) { // Cost Code/ Material/ Assembly
									item.Code = _.toUpper(item.Code);
								}

								if (field === 'Code' || field === 'DescriptionInfo') {
									estimateMainCommonService.ModifyIsIndirectValue(item);
								}

								if (item.IsIndirectCost) {
									setIsIndirectCostReadOnly(item);
								}

								if (field === 'LgmJobFk') {
									if (item.EstResourceTypeFk === estimateMainResourceType.CostCode) {
										$injector.get('estimateMainJobCostcodesLookupService').getEstCCByIdAsyncByJobId(item.MdcCostCodeFk || item.ProjectCostCodeFk, item).then(function (result) {
											if (result && result.Id) {
												if (item.IsRate) {
													estimateMainCommonService.setSelectedCodeItem(field, item, false, result);
												} else {
													item.BasCurrencyFk = result.CurrencyFk;
													item.QuantityFactorCc = result.RealFactorQuantity;
													item.CostFactorCc = result.RealFactorCosts;
												}
												calculateAndRefresh();
											}
										});
									}

									if (item.EstResourceTypeFk === estimateMainResourceType.Material && item.IsRate) {
										$injector.get('estimateMainPrjMaterialLookupService').getEstMaterialByIdAsyncByJobId(item.MdcMaterialFk, item).then(function (result) {
											if (result && result.Id) {
												estimateMainCommonService.setSelectedCodeItem(field, item, false, result);
												calculateAndRefresh();
											}
										});
									} else {
										calculateAndRefresh();
									}
								} else {
									calculateAndRefresh();
								}
							}
						}

						$injector.get('estimateMainResourceDynamicUserDefinedColumnService').fieldChange(item, field, item[field], parentLineItem, resList);

						if (estimateMainCommonService.isCharacteristicCulumn(column)) {
							if (estimateMainCommonService.isCharacteristicColumnExpired(column)) {
								$injector.get('platformModalService').showErrorBox('cloud.common.currentCharacteristicIsExpired', 'cloud.common.errorMessage').then(function () {
									// eslint-disable-next-line no-prototype-builtins
									if (item.hasOwnProperty(field)) {
										item[field] = item[field + '__revert'];
										delete item[field + '__revert'];
										estimateMainResourceService.gridRefresh();
									}
								});
							} else {
								if (item[field] === undefined) {
									item[field] = estimateMainCommonService.getCharacteristicColValue(angular.copy(item), _.split(field, '.'));
								}
								let characteristicDataService = $injector.get('basicsCharacteristicDataServiceFactory').getService(estimateMainResourceService, 33, null, 'EstHeaderFk', 'EstLineItemFk');
								characteristicDataService.syncUpdateCharacteristic(field, item);
							}
						}

						if (calcFields.indexOf(field) === -1) {
							estimateMainCommonService.calculateExtendColumnValuesOfLineItem(parentLineItem, resList);
						}

						if(field === 'Code' && item.EstResourceTypeFk === estimateMainResourceType.SubItem){
							if(item.NewCode) {
								item.Code = item.NewCode;
								delete item.NewCode;
							}
						}
					}
				}

				function estResourceChangeCode(estResourceList, resource, oldCode, service) {
					let result = true;
					if (resource && resource.EstResourceTypeFk === estimateMainResourceType.SubItem && resource.EstAssemblyFk === null) {
						let existingItem = _.find(estResourceList, (item) => item.Code === resource.Code.toString() && item.EstResourceTypeFk === estimateMainResourceType.SubItem && item.Id !== resource.Id);
						if (existingItem) {
							// Case 1: Update existing record and increment subsequent records
							result = fitResourceAndRenumberCode(estResourceList, resource, existingItem, service);
						} else {
							// Case 2: Add a new record as a child
							result = fitResourceAsNew(estResourceList, resource, oldCode, service);
						}
						if(result) {
							service.addList(estResourceList);
							service.gridRefresh();
							service.setSelected(resource);
						}
					}
					return result;
				}

				function fitResourceAsNew(resources, resource, oldCode, service) {
					let isItemAdded = false;
					for (let i = resource.Code.length - 1; i > 0; i--) {
						let currentCode = resource.Code.substring(0, i);
						if(currentCode === oldCode) {
							return false;
						}
						/* jshint -W083 */
						let newParent = resources.find((x) => x.Code === currentCode);
						if (newParent) {
							let isSelfReferenced = checkIfSelfReferenced(newParent, resource.EstResources);
							if(newParent.Id === resource.Id || isSelfReferenced){
								return false;
							}
							service.removeItem(resource);
							let siblingResources = resources.filter((x) => x.EstResourceFk === newParent.Id);
							resource.EstResourceFk = newParent.Id;
							updateSorting(siblingResources,resource,newParent);
							resource.nodeInfo.level = newParent.nodeInfo.level + 1;
							newParent.EstResources = newParent.EstResources.concat(resource);
							if(newParent.EstResources.length > 0) {
								newParent.HasChildren = true;
							}
							if (resource.HasChildren && resource.EstResources.length > 0) {
								if (resource.EstResources.length > 0) {
									updateCodeAndSorting(resource.EstResources, resource, service);
								}
							}
							resources.push(resource);
							service.markItemAsModified(resource);
							service.markItemAsModified(newParent);
							isItemAdded = true;
							break;
						}
					}
					if(!isItemAdded){
						service.removeItem(resource);
						let siblingResources = resources.filter((x) => x.EstResourceFk === null);
						let oldParent = resources.find((x) => x.Id === resource.EstResourceFk);
						resource.EstResourceFk = null;
						updateSorting(siblingResources,resource,null);
						resource.nodeInfo.level = 0;
						if (resource.HasChildren && resource.EstResources.length > 0) {
							if (resource.EstResources.length > 0) {
								updateCodeAndSorting(resource.EstResources, resource, service);
							}
						}
						resources.push(resource);
						service.markItemAsModified(resource);
						service.markItemAsModified(oldParent);
					}
					return true;
				}

				function fitResourceAndRenumberCode(estResourceList, resource, existingItem, service) {
					let isSelfReferenced = checkIfSelfReferenced(existingItem, resource.EstResources);
					if(isSelfReferenced){
						return false;
					}
					let parent = estResourceList.find(item => item.Id === existingItem.EstResourceFk);
					let resources = estResourceList.filter((e) => e.EstResourceFk === (parent ? parent.Id : null) && e.Id !== resource.Id);
					resources = _.orderBy(resources, 'Sorting');
					let isItemAdded = false;
					let isCodeIncrementSatisfied = false;
					let SortingNumber = null;
					for (let i = 0; i < resources.length; i++) {
						if (resources[i].Code === resource.Code && resource.EstResourceTypeFk === estimateMainResourceType.SubItem && !isItemAdded) {
							isItemAdded = true;
							service.removeItem(resource, service);
							SortingNumber = resources[i].Sorting;
							resource.Sorting = SortingNumber;
							resource.EstResourceFk = parent ? parent.Id : null;
							resource.nodeInfo.level = parent ? parent.nodeInfo.level + 1 : 0;
							if (resource.HasChildren && resource.EstResources.length > 0) {
								if (resource.EstResources.length > 0) {
									updateCodeAndSorting(resource.EstResources, resource, service);
								}
							}
							if(parent){
								parent.EstResources = parent.EstResources.concat(resource);
								if(parent.EstResources.length > 0) {
									parent.HasChildren = true;
								}
							}
							service.markItemAsModified(resource);
							service.markItemAsModified(parent);
						}
						if(isItemAdded){
							if(!isCodeIncrementSatisfied && resources[i].EstResourceTypeFk === estimateMainResourceType.SubItem){
								let parentCode = parent.EstAssemblyFk !== null ? estResourceList.find(item => item.Id === parent.EstResourceFk).Code : parent ? parent.Code : '';
								let CodeSuffix = resources[i].Code.substring(parentCode.length, resources[i].Code.length);
								let newCode = parentCode + estimateMainSubItemCodeGenerator.incrementCode(CodeSuffix);
								/* jshint -W083 */
								isCodeIncrementSatisfied = !(resources.find((x) => x.Code === newCode));
								resources[i].Code = newCode;
							}
							resources[i].Sorting = SortingNumber ? ++SortingNumber : resources[i].Sorting + 1;
							service.markItemAsModified(resources[i]);
							if (resources[i].HasChildren && resources[i].EstResources.length > 0) {
								if (resources[i].EstResources.length > 0) {
									updateCodeAndSorting(resources[i].EstResources, resources[i], service);
								}
							}
						}
					}
					if(isItemAdded){
						estResourceList.push(resource);
					}
					return true;
				}

				function updateSorting(resources, entity, newParent) {
					let lastRecord;
					let sorting;
					let isEntitySortingUpdated = false;
					if(resources.length > 0) {
						resources = _.orderBy(resources, 'Sorting');
						angular.forEach(resources, function (resource) {
							let isSubItem = resource.EstResourceTypeFk === estimateMainResourceType.SubItem;
							if ((compareCodes(resource.Code, entity.Code) || !isSubItem )&& !isEntitySortingUpdated) {
								lastRecord = resource;
								return;
							}
							if (isEntitySortingUpdated) {
								resource.Sorting = ++sorting;
								if(resource.EstResources && resource.EstResources.length > 0){
									updateChildrenSorting(resource.EstResources, resource);
								}
							} else if(lastRecord) {
								sorting = lastRecord.Sorting + 1;
								entity.Sorting = sorting;
								resource.Sorting = ++sorting;
								if(resource.EstResources && resource.EstResources.length > 0){
									updateChildrenSorting(resource.EstResources, resource);
								}
								isEntitySortingUpdated = true;
							}
						});
						if (!isEntitySortingUpdated) {
							let maxSortingResource = _.maxBy(resources, 'Sorting');
							entity.Sorting = maxSortingResource.Sorting + 1;
						}
					}
					else{
						entity.Sorting = newParent ? ((newParent.Sorting * 10) + 1) : 1;
					}
				}

				function compareCodes(code1, code2) {
					if (code1.length < code2.length) {
						return true;
					} else if (code1.length > code2.length) {
						return false;
					}
					for (let i = 0; i < code1.length; i++) {
						if (code1.charAt(i) < code2.charAt(i)) {
							return true;
						} else if (code1.charAt(i) > code2.charAt(i)) {
							return false;
						}
					}
					return true;
				}

				function changeSubitemChildrenCode(subItem, resList){
					let inc = 1,
						newCode = '';

					let result = subItem.EstResourceFk > 0 ? _.filter(resList, function(item){
						return item.EstResourceTypeFk === 5 && item.EstResourceFk === subItem.EstResourceFk;
					}): _.filter(resList, function(item){
						return item.EstResourceTypeFk === 5 && item.EstResourceFk === null;
					});

					$injector.get('cloudCommonGridService').sortList(result, 'Sorting');
					let filterEstAssembly = _.filter(result,e => {return e.EstAssemblyFk === null;});
					let lastItem = filterEstAssembly.length > 0 ? filterEstAssembly[filterEstAssembly.length - 1].Id === subItem.Id ? filterEstAssembly[filterEstAssembly.length - 2]:filterEstAssembly[filterEstAssembly.length - 1] : null;
					if (lastItem && lastItem.Code) {
						newCode =  lastItem && lastItem.Code  ? $injector.get('estimateMainSubItemCodeGenerator').incrementCode(lastItem.Code) : subItem.EstResourceFk === null ? inc
							: _.find(resList, {Id:subItem.EstResourceFk}) &&  _.find(resList, {Id:subItem.EstResourceFk}).Code ?
								_.find(resList, {Id:subItem.EstResourceFk}).Code + inc.toString() : inc;
					} else if(_.find(resList, {Id:subItem.EstResourceFk}) &&  _.find(resList, {Id:subItem.EstResourceFk}).Code) {
						newCode = _.find(resList, {Id:subItem.EstResourceFk}).Code;
					} else {
						newCode = 1;
					}

					subItem.Code = newCode.toString();

					updateCodeAndSorting(subItem.EstResources, subItem, estimateMainResourceService, false);
				};

				function updateCodeAndSorting(resources, parent, service, doConsiderSort = true) {
					let sortNumber = parent.Sorting * 10;
					let codeSuffix = 0;
				
					for (let i = 0; i < resources.length; i++) {
						const item = resources[i];
						const isSubItem = item.EstResourceTypeFk === estimateMainResourceType.SubItem;
						const hasAssembly = item.EstAssemblyFk !== null;
				
						let originalCode = null;
				
						if (isSubItem) {
							if (hasAssembly) {
								// Store original code and temporarily assign parent code
								originalCode = angular.copy(item.Code);
								item.Code = parent.Code;
							} else {
								codeSuffix = estimateMainSubItemCodeGenerator.incrementCode(codeSuffix);
								item.Code = parent.Code + codeSuffix;
							}
						}
				
						item.Sorting = doConsiderSort ? ++sortNumber : item.Sorting;
						item.nodeInfo.level = parent ? parent.nodeInfo.level + 1 : 0;
				
						// Recurse before restoring code to ensure children get correct parent code
						if (item.EstResources && item.EstResources.length > 0) {
							updateCodeAndSorting(item.EstResources, item, service, doConsiderSort);
						}
				
						if (isSubItem && hasAssembly) {
							item.Code = originalCode;
						}
				
						service.markItemAsModified(item);
						service.fireItemModified(item);
					}
				}

				function updateChildrenSorting(resources, parent) {

					let SortNumber = parent.Sorting * 10;
					for (let i = 0; i < resources.length; i++) {
						resources[i].Sorting = ++SortNumber;
						if (resources[i].EstResources && resources[i].EstResources.length > 0) {
							updateChildrenSorting(resources[i].EstResources, resources[i]);
						}
					}
				}

				function checkIfSelfReferenced(existingItem, resources) {
					let isSelfReferenced = false;
					function checkRecursively(item, resourceArray) {
						for (let i = 0; i < resourceArray.length; i++) {
							if (item.Id === resourceArray[i].Id) {
								isSelfReferenced = true;
								return;
							}
							if (resourceArray[i].EstResources && resourceArray[i].EstResources.length > 0) {
								checkRecursively(item, resourceArray[i].EstResources);
							}
						}
					}
					checkRecursively(existingItem, resources);
					return isSelfReferenced;
				}


				function estimateResourcesChildItems(item, field) {
					angular.forEach(item.EstResources, function (childItem) {
						if (childItem.HasChildren) {
							childItem[field] = item.IsIndirectCost;
							estimateResourcesChildItems(childItem, field);
						}
						childItem[field] = item.IsIndirectCost;
					});
				}

				// bulk edit changes
				function valueChangeCallBack(item, field, newValue) {
					resList = estimateMainResourceService.getList();
					let isPrcPackageChanged = false; // #80834
					let parentLineItem = estimateMainService.getSelected(),
						selectedResourceItem = estimateMainResourceService.getSelected(),
						projectInfo = estimateMainService.getSelectedProjectInfo();

					if (item && item.Id && field) {
						let argData = {item: item, colName: field};

						if (field === 'IsDisabled' || field === 'IsDisabledPrc') {
							item.forceBudgetCalc = !item.IsDisabled && !item.IsDisabledPrc;
							let resourcesChanged = estimateMainCommonService.calculateResource(item, parentLineItem, resList);
							return estimateMainResourceProcessor.processItemsAsync(resList).then(function () {
								return fireLiAndResAsModified(parentLineItem, resourcesChanged);
							});
						} else if (field === 'IsGeneratedPrc') {
							if (selectedResourceItem.IsGeneratedPrc) {
								setResourcesBusinessPartnerName(parentLineItem, [selectedResourceItem]);
							} else {
								selectedResourceItem.BusinessPartner = '';
							}
						} else if (field === 'IsLumpsum') {
							let resourcesChanged = estimateMainCommonService.estimateResources(argData, resList, parentLineItem, null);
							fireLiAndResAsModified(parentLineItem, resourcesChanged);
							return $q.when();
						} else if (field === 'IsIndirectCost') {
							if (item.HasChildren) {
								if (item.EstResources !== null) {
									estimateResourcesChildItems(item, field);
								}
							}
							if (item.EstResourceFk > 0 && !item.IsIndirectCost) {
								angular.forEach(resList, function (parentItem) {
									if (parentItem.Id === item.EstResourceFk) {
										parentItem[field] = item.IsIndirectCost;
									}
								});
							}

							handleLineItemReadonly(item,parentLineItem);
							let resourcesChanged = estimateMainCommonService.estimateResources(argData, resList, parentLineItem, null);
							fireLiAndResAsModified(parentLineItem, resourcesChanged);
							return $q.when();
						}else if (field === 'Sorting') {
							estimateMainGenerateSortingService.sortOnEdit(resList, item, estimateMainResourceService);
							return $q.when();

						}
						else if (field === 'GcBreakdownTypeFk') {
							if (item && item.EstResources !== null) {
								let flatResource = $injector.get('cloudCommonGridService').flatten(item.EstResources, [], 'EstResources');
								estimateMainResourceService.handleGcBreakdownType(parentLineItem, newValue, flatResource);
							}
						}
						else if (field === 'IsFixedBudget' ) {
							let fields =[];
							fields.push({field: 'Budget',readonly: !item.IsFixedBudget});

							if (item && item.Id) {

								if (item.IsFixedBudget) {
									item.IsFixedBudgetUnit= !item.IsFixedBudget;
									fields.push({field: 'BudgetUnit',readonly: !item.IsFixedBudgetUnit});

									return $injector.get('estimateMainCompleteCalculationService').calculateSubItemResourceBudget(item, resList, parentLineItem, projectInfo.ProjectId).then(function () {
										estimateMainResourceProcessor.processItem(item);
										estimateMainResourceService.fireItemModified(item);
										return refreshDataForResourceTree(parentLineItem,item);
									});
								}
								$injector.get('platformRuntimeDataService').readonly(item, fields);
							}
							return $q.when();

						} else if(field === 'IsFixedBudgetUnit') {
							let fields =[];
							fields.push({field: 'BudgetUnit', readonly: !item.IsFixedBudgetUnit});

							if (item && item.Id) {

								if (item.IsFixedBudgetUnit) {
									item.IsFixedBudget = !item.IsFixedBudgetUnit;
									fields.push({field: 'Budget',readonly: !item.IsFixedBudget});
									return $injector.get('estimateMainCompleteCalculationService').calculateSubItemResourceBudget(item, resList, parentLineItem, projectInfo.ProjectId).then(function () {
										estimateMainResourceProcessor.processItem(item);
										estimateMainResourceService.fireItemModified(item);
										return refreshDataForResourceTree(parentLineItem,item);
									});

								}
								$injector.get('platformRuntimeDataService').readonly(item, fields);

							}
							return $q.when();

						} else if (field === 'BudgetUnit' || field === 'Budget') {
							let calculationService = $injector.get('estimateMainCompleteCalculationService');
							return calculationService.calculateBudget(item, field, projectInfo.ProjectId, resList, parentLineItem).then(function(){
								return refreshDataForResourceTree(parentLineItem,item);
							});
						} else if (field === 'Co2Project') {
							return $injector.get('estimateMainCompleteCalculationService').calculateResourceLineItemCo2Project(item, resList, parentLineItem).then(function () {
								estimateMainResourceService.fireItemModified(item);
								return refreshDataForResourceTree(parentLineItem,item,'parent');
							});
						} else {
							// calculation if quantity or any details field changes
							let info = {
								'projectInfo': projectInfo,
								'selectedResourceItem': selectedResourceItem,
								'parentLineItem': parentLineItem,
								'resList': resList,
								'lineItemList': estimateMainService.getList()
							};
							estimateMainCommonCalculationService.setInfo(info);
							// code extracted to function to use it twice (caused by async call below)
							let calculateAndRefresh = function calculateAndRefresh() {
								return estimateMainExchangeRateService.loadData(projectInfo.ProjectId).then(
									function () {
										let resourcesChanged = estimateMainCommonService.estimateResources(argData, resList, parentLineItem, null, true);
										estimateMainCommonService.calculateExtendColumnValuesOfLineItem(parentLineItem, resList);
										fireLiAndResAsModified(parentLineItem, resourcesChanged);
										return resourcesChanged;
									});
							};

							// Code was set for resource of type 'Assembly'?
							if (item.EstResourceTypeFk === estimateMainResourceType.Assembly && (field === 'Code' || field === 'DescriptionInfo')) {
								let assembly = estimateMainCommonService.getSelectedLookupItem();
								if (assembly && assembly.Id) {
									// set relation to assembly
									item.EstAssemblyFk = assembly.Id;
									item.EstHeaderAssemblyFk = assembly.EstHeaderFk;
									item.Code = assembly.Code;
									item.DescriptionInfo = assembly.DescriptionInfo;
									// take over properties from assembly
									item.BasUomFk = assembly.BasUomFk;
									item.MdcCostCodeFk = assembly.MdcCostCodeFk;
									item.MdcMaterialFk = assembly.MdcMaterialFk;

									// take over cost type from assembly costCode or material
									estimateMainResourceService.takeOverCostTypeFromAssembly(item.MdcCostCodeFk, item.MdcMaterialFk, item);

									if (selectedResourceItem.EstAssemblyTypeFk) {
										let subResourcesToRemove = estimateMainResourceService.getList().filter(function (resource) {
											return resource.EstResourceFk === item.Id;
										});
										_.forEach(subResourcesToRemove, function (resource) {
											estimateMainResourceService.deleteItem(resource);
										});
									}
								}
							}

							if (field === 'WorkOperationTypeFk') {
								item.LgmJobFk = estimateMainService.getLgmJobId(item);
								return $injector.get('estimateMainPlantEstimateMultiplierService').updateMultipliersFrmEquipmentEstimate(item).then(function () {
									estimateMainResourceService.fireItemModified(item);
									let flatResources = $injector.get('cloudCommonGridService').flatten(item.EstResources, [], 'EstResources');
									angular.forEach(flatResources, function (resItem) {
										estimateMainResourceService.markItemAsModified(resItem);
										estimateMainResourceService.fireItemModified(resItem);
									});
									return calculateAndRefresh();
								});
							}else{
								return calculateAndRefresh();
							}
						}

						estimateMainCommonService.calculateExtendColumnValuesOfLineItem(parentLineItem, resList);
					}
				}

				function setResourcesBusinessPartnerName(parentLineItem, resourceList) {
					let promises = [];
					let flatResource = $injector.get('cloudCommonGridService').flatten(resourceList, [], 'EstResources');
					angular.forEach(flatResource, function (resource) {
						let deferred = $q.defer();
						promises.push(deferred.promise);
						if (!resource.IsDisabledPrc && resource.IsGeneratedPrc ) {
							if(resource.ConHeaderFk){
								$injector.get('estLineItemPrcPackageLookupDataService').getConOfResourceAsync(resource.ConHeaderFk).then(function (result) {
									if (result && result.BusinessPartnerFk) {
										$injector.get('estLineItemPrcPackageLookupDataService').getBusinessPartnerName(result.BusinessPartnerFk).then(function (businessPartnerName) {
											resource.BusinessPartner = businessPartnerName;
											deferred.resolve();
										});
									} else {
										deferred.resolve();
									}
								});
							}else if(resource.QtnHeaderFk){
								$injector.get('estLineItemPrcPackageLookupDataService').getQtnOfResourceAsync(resource.QtnHeaderFk).then(function (result) {
									if (result && (result.IdealQtnBusinessPartnerFk || result.BusinessPartnerFk)) {
										$injector.get('estLineItemPrcPackageLookupDataService').getBusinessPartnerName((result.IdealQtnBusinessPartnerFk || result.BusinessPartnerFk)).then(function (businessPartnerName) {
											if(resource.PackageAssignments)
											{
												resource.BusinessPartner = businessPartnerName;
											}

											deferred.resolve();
										});
									} else {
										deferred.resolve();
									}
								});
							}else{
								deferred.resolve();
							}

						} else {
							resource.BusinessPartner = '';
							deferred.resolve();
						}
					});
					return $q.all(promises).then(function () {
					});
				}

				function isAdvancedAllowanceCostCode(resource) {
					let advancedAllowanceCostCodeFk = $injector.get('estimateMainContextDataService').getAdvancedAllowanceCc();
					if (!advancedAllowanceCostCodeFk) { return false; }
					return (resource.EstResourceTypeFk === estimateMainResourceType.Assembly || resource.EstResourceTypeFk === estimateMainResourceType.CostCode) && resource.MdcCostCodeFk === advancedAllowanceCostCodeFk;
				}

				function handleLineItemReadonly(item,parentLineItem) {
					if (isAdvancedAllowanceCostCode(item)) {
						let activeAllowance = $injector.get('estimateMainContextDataService').getAllowanceEntity();
						if(_.isEmpty(activeAllowance) && item.IsIndirectCost){
							let AAResources = _.filter(resList, function(res) {
								return isAdvancedAllowanceCostCode(res) && res.IsIndirectCost;
							});
							if(AAResources.length === 1 && parentLineItem.AdvancedAll === 0){
								estimateMainService.setAAReadonly(true, parentLineItem);
								setIsIndirectCostReadOnly(item);
							}
							if(parentLineItem.AdvancedAllowance > 0){
								setIsIndirectCostReadOnly(item);
							}
						}
					}
				}

				function setIsIndirectCostReadOnly(item) {
					$injector.get('platformRuntimeDataService').readonly(item, [{field: 'IsIndirectCost', readonly: true}]);
				}

				return service;
			}

		]);
})();
