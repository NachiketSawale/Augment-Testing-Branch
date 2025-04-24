/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/* global globals */

	let moduleName = 'basics.costcodes';
	let costCodesModule = angular.module(moduleName);
	/**
	 * @ngdoc service
	 * @name basicsCostCodesMainService
	 * @function
	 *
	 * @description
	 * basicsCostCodesMainService is the data service for all costcodes related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	costCodesModule.factory('basicsCostCodesMainService', ['_', 'PlatformMessenger','platformDataServiceFactory', 'platformModalService', 'basicsCommonMandatoryProcessor',
		'ServiceDataProcessArraysExtension', 'basicsCostCodesImageProcessor', 'basicsLookupdataLookupDescriptorService', '$http', '$q', 'hourfactorReadonlyProcessor', '$injector', 'basicsCostCodesProcessorService',
		function (_, PlatformMessenger,platformDataServiceFactory, platformModalService, basicsCommonMandatoryProcessor, ServiceDataProcessArraysExtension, basicsCostCodesImageProcessor, basicsLookupdataLookupDescriptorService, $http, $q, hourfactorReadonlyProcessor, $injector, basicsCostCodesProcessorService) {
			let selected = {};

			let showPreserverSelection = true,
				isOverwrite = true,
				isAssignToChildren = true,
				isPreserveSelection = false,
				isLoad = true,
				companyCostCodes = null;

			let factorFieldsToRecalculate = {
				'FactorCosts': 'RealFactorCosts',
				'FactorQuantity': 'RealFactorQuantity'
			};

			let canChildCostCode = function canChildCostCode() {
				let selectedItem = service.getSelected();
				return selectedItem && selectedItem.IsEditable ? false : true;
			};

			// The instance of the main service - to be filled with functionality below
			let basicsCostCodesMainServiceOptions = {
				hierarchicalRootItem: {
					module: costCodesModule,
					serviceName: 'basicsCostCodesMainService',
					entityNameTranslationID: 'basics.costcodes.costCodes',
					httpCRUD: {route: globals.webApiBaseUrl + 'basics/costcodes/'},
					actions: { create: 'hierarchical', canCreateChildCallBackFunc: canChildCostCode, delete : {}},
					presenter: {
						tree: {
							parentProp: 'CostCodeParentFk',
							childProp: 'CostCodes',
							childSort: true,
							isInitialSorted: true,
							sortOptions: {initialSortColumn: {field: 'Code', id: 'code'}, isAsc: true},
							initCreationData: function initCreationData(creationData) {
								creationData.costCodeId = creationData.parentId;
								let list = serviceContainer.service.getList();
								if (creationData.parentId && list && list.length > 0) {
									let parent = _.find(list, {Id: creationData.parentId});
									creationData.realFactorCost = parent.RealFactorCosts;
									creationData.realFactorQuantity = parent.RealFactorQuantity;
									creationData.costCodeTypeFk = parent.CostCodeTypeFk;
									creationData.costGroupPortionsFk = parent.CostGroupPortionsFk;
									creationData.costCodePortionsFk = parent.CostCodePortionsFk;
									creationData.abcClassificationFk = parent.AbcClassificationFk;
									creationData.prcStructureFk = parent.PrcStructureFk;
									creationData.contrCostCodeFk= parent.ContrCostCodeFk;
								}
							},
							handleCreateSucceeded: function handleCreateSucceeded(entity){
								let basicsCostCodesDynamicUserDefinedColumnService = $injector.get('basicsCostCodesDynamicUserDefinedColumnService');
								basicsCostCodesDynamicUserDefinedColumnService.attachEmptyDataToColumn(entity);

								return entity;
							},
							incorporateDataRead: function incorporateDataRead(readItems, data) {
								serviceContainer.data.sortByColumn(readItems);

								let result = serviceContainer.data.handleReadSucceeded(readItems, data);
								let basicsCostCodesDynamicUserDefinedColumnService = $injector.get('basicsCostCodesDynamicUserDefinedColumnService');
								basicsCostCodesDynamicUserDefinedColumnService.attachDataToColumn(data.getList());

								return result;
							}
						}
					},
					dataProcessor: [new ServiceDataProcessArraysExtension(['CostCodes']), basicsCostCodesImageProcessor, hourfactorReadonlyProcessor, basicsCostCodesProcessorService],
					entityRole: {
						root: {
							codeField: 'Code',
							descField: 'Description',
							itemName: 'CostCodes',
							moduleName: 'basics.costcodes.moduleDisplayNameCostCodes',
							handleUpdateDone: function (updateData, response, data) {
								clearCompanyCostCodes();
								if (data.itemList && response.CostCodes && response.CostCodes.length > 0) {

									angular.forEach(response.CostCodes, function (costCodeItem) {
										let index = data.itemList.indexOf(_.find(data.itemList, {Id: costCodeItem.Id}));
										if (index >= 0) {
											let subItems = data.itemList[index].CostCodes;
											angular.extend(data.itemList[index], costCodeItem);
											if (subItems !== null && subItems.length > 0) {
												data.itemList[index].HasChildren = true;
												data.itemList[index].CostCodes = subItems;
											}
										}
									});
									data.handleOnUpdateSucceeded(updateData, response, data, false);
									selected = serviceContainer.data.selectedItem;
									serviceContainer.data.sortByColumn(serviceContainer.data.itemTree);
									serviceContainer.data.listLoaded.fire();
									serviceContainer.service.setSelected(selected);
									// refresh cost code lookup data
									basicsLookupdataLookupDescriptorService.removeData('estmdccostcodes');
								}

								let basicsCostCodesDynamicUserDefinedColumnService = $injector.get('basicsCostCodesDynamicUserDefinedColumnService');
								basicsCostCodesDynamicUserDefinedColumnService.update();

								service.onUpdated.fire();
								// service.refresh();
							},
							handleSelection: function () {
								service.setSelectedLineItem(selected);
							}
						}
					},
					translation: {
						uid: 'basicsCostCodesMainService',
						title: 'basics.costcodes.costCodes',
						columns: [{header: 'cloud.common.descriptionInfo', field: 'DescriptionInfo'},
							{header: 'basics.costcodes.description2', field: 'Description2Info'}],
						dtoScheme: { typeName: 'CostCodeDto', moduleSubModule: 'Basics.CostCodes' }
					},
					entitySelection: {supportsMultiSelection: true}
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(basicsCostCodesMainServiceOptions);// jshint ignore:line
			let service = serviceContainer.service;

			service.getIsload = function getIsLoad() {
				return isLoad;
			};
			service.setIsLoad = function setIsLoad() {
				isLoad = false;
			};

			service.fireListLoaded = function fireListLoaded() {
				serviceContainer.data.listLoaded.fire();
			};

			service.setSelectedLineItem = function setSelectedLineItem(selectedLineItem) {
				if (selectedLineItem && selectedLineItem.Id) {
					serviceContainer.data.selectionAfterSort.fire(selectedLineItem);
				}
			};

			service.addList = function addList(data) {
				let list = serviceContainer.data.itemTree;
				if (data && data.length) {
					angular.forEach(data, function (d) {
						let item = _.find(list, {Id: d.Id});
						if (item) {
							angular.extend(list[list.indexOf(item)], d);
						} else {
							list.push(d);
						}
					});
					let context = {
						treeOptions:{
							parentProp: 'CostCodeParentFk',
							childProp: 'CostCodes',
						},
						IdProperty: 'Id'
					};
					serviceContainer.data.itemTree = $injector.get('basicsLookupdataTreeHelper').buildTree(list, context);
					service.fireListLoaded();
				}
			};

			service.onUpdated = new PlatformMessenger();

			// TODO: it is just a work around to clear modifications when do call search
			service.executeSearchFilterBase = serviceContainer.service.executeSearchFilter;
			service.executeSearchFilter = function executeSearchFilter(e, filter) {
				// clear modify
				serviceContainer.data.doClearModifications(null, serviceContainer.data);
				serviceContainer.data.refreshRequested.fire();
				service.executeSearchFilterBase(e, filter);
			};

			service.fieldChanged = fieldChanged;
			service.assignControllingCostCode = assignControllingCostCode;

			serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'CostCodeDto',
				moduleSubModule: 'Basics.CostCodes',
				validationService: 'basicsCostCodesValidationService'});

			let originalOnDeleteDone = serviceContainer.data.onDeleteDone;
			serviceContainer.data.onDeleteDone = function(deleteParams, data, response){
				// remove the user defined column value of deleted line item
				let basicsCostCodesDynamicUserDefinedColumnService = $injector.get('basicsCostCodesDynamicUserDefinedColumnService');
				basicsCostCodesDynamicUserDefinedColumnService.handleEntitiesDeleted(deleteParams.entities);

				return originalOnDeleteDone(deleteParams, data, response);
			};


			service.setCompanyCostCodes = function setCompanyCostCodes(includeChild){
				companyCostCodes = [];
				if(includeChild){
					let items = service.getSelectedEntities();
					let cloudCommonGridService = $injector.get('cloudCommonGridService');
					angular.forEach(items, function(item){
						companyCostCodes.push(angular.copy(item));
						let children = cloudCommonGridService.getAllChildren(item, 'CostCodes');
						companyCostCodes = companyCostCodes.concat(angular.copy(children));
					});
				}else{
					companyCostCodes = angular.copy(service.getSelectedEntities());
				}
			};

			serviceContainer.data.provideUpdateData = function (updateData) {
				updateData.SelectedCostCodes = companyCostCodes;
				return updateData;
			};

			service.navigateTo = function navigateTo(item) {
				service.load().then(function () {
					let list = service.getList();
					let selectItem = list && list.length ? _.find(list, {Id:item.Id}) : {};
					service.setSelected(selectItem);
				});
			};

			service.registerRefreshRequested($injector.get('basicsCommonUserDefinedColumnConfigService').reLoad);

			function clearCompanyCostCodes(){
				companyCostCodes = null;
			}

			return service;

			function fieldChanged(item, column) {
				if (column === 'ContrCostCodeFk') {
					assignControllingCostCodeInternal(item, item.ContrCostCodeFk);
				} else if (factorFieldsToRecalculate[column]) {
					let updatedItems = [];
					recalculateFactorValues(item, column, null, updatedItems);
					serviceContainer.service.markEntitiesAsModified(updatedItems);
				}

				if(column === 'VhbSheetGcTypeFk' || column === 'VhbSheetDjcTypeFk'){
					assignColumnValuesToChildren(item,column);
				}

				if(column === 'IsSubcontractedWork'){
					assignColumnValuesToChildren(item,column);
					basicsCostCodesProcessorService.processChildren(item);
				}

				let basicsCostCodesDynamicUserDefinedColumnService = $injector.get('basicsCostCodesDynamicUserDefinedColumnService');
				basicsCostCodesDynamicUserDefinedColumnService.fieldChange(item, column, item[column]);
			}

			function assignColumnValuesToChildren(costCode, columnName) {
				const modifiedItems = [];

				function recurseCostCode(costCode) {
					_.forEach(costCode.CostCodes, function (cc) {
						cc[columnName] = costCode[columnName];
						modifiedItems.push(cc);

						if (cc.CostCodes && cc.CostCodes.length > 0) {
							recurseCostCode(cc,columnName);
						}
					});
				}

				recurseCostCode(costCode,columnName);

				serviceContainer.service.markEntitiesAsModified(modifiedItems);
			}

			function assignControllingCostCode(costCode, contrCostCodeId) {
				assignControllingCostCodeInternal(costCode, contrCostCodeId).then(function (data) {
					if (data) {
						// Code to save drag operation changes.
						// This will also save all other changes done before drag and drop.
						// This may have issue with field currently getting edited by user.
						serviceContainer.service.update();
					}
				});
			}

			function assignControllingCostCodeInternal(costCode, contrCostCodeId) {
				let showAssignToChildren = false;
				let showOverwrite = false;

				if (_.isArray(costCode.CostCodes) && costCode.CostCodes.length > 0) {
					showAssignToChildren = true;
					showOverwrite = true;
				}
				let assignControllingCostCodePromise;
				if (showAssignToChildren || showOverwrite) {
					if (!isPreserveSelection) {
						let modalOptions = {
							headerTextKey: 'basics.costcodes.controlling.assignToCostCodeTitle',
							bodyTemplateUrl: globals.appBaseUrl + 'basics.costcodes/templates/basics-costcodes-controlling-assign-dialog-template.html',
							value: {
								showAssignToChildren: showAssignToChildren,
								showOverwrite: showOverwrite,
								showPreserveSelection: showPreserverSelection,
								isOverwrite: true,
								isAssignToChildren: true,
								isPreserveSelection: false
							}
						};
						assignControllingCostCodePromise = platformModalService.showDialog(modalOptions).then(function (result) {
							if (result.ok) {
								isOverwrite = result.value.isOverwrite;
								isAssignToChildren = result.value.isAssignToChildren;
								isPreserveSelection = result.value.isPreserveSelection;
								return assignControllingCostCodeResponse(contrCostCodeId, costCode, isOverwrite, isAssignToChildren);
							}
						});
					} else {
						assignControllingCostCodePromise = assignControllingCostCodeResponse(contrCostCodeId, costCode, isOverwrite, isAssignToChildren);
					}
				} else {
					assignControllingCostCodePromise = assignControllingCostCodeResponse(contrCostCodeId, costCode, true, false);
				}
				let returnPromise = $q.when(false);
				if (assignControllingCostCodePromise) {
					returnPromise = assignControllingCostCodePromise.then(function (costCodes) {
						if (costCodes.length > 0) {
							serviceContainer.service.markEntitiesAsModified(costCodes);
							return true;
						}
						return false;
					});
				}
				return returnPromise;
			}

			function assignControllingCostCodeResponse(contrCostCodeId, costCode, isOverwrite, isAssignToChildren) {
				let deferred = $q.defer();
				let costCodesToUpdate = [];
				if (!costCode.ContrCostCodeFk || isOverwrite) {
					costCodesToUpdate.push(costCode);
				}
				if (isAssignToChildren) {
					// // Commented above code and added new logic to get cost code ids recursively
					getCostCodeChildrenToAssign(costCode, isOverwrite, costCodesToUpdate);
				}
				if (costCodesToUpdate.length > 0) {
					let costCodesToBeModified = [];
					_.forEach(costCodesToUpdate, function (cc) {
						// cc = serviceContainer.service.getItemById(cc.Id);
						if ((!cc.ContrCostCodeFk || isOverwrite) && cc.ContrCostCodeFk !== contrCostCodeId) {
							cc.ContrCostCodeFk = contrCostCodeId;
							costCodesToBeModified.push(cc);
						}
					});
					deferred.resolve(costCodesToBeModified);
				} else {
					deferred.reject('No controlling cost code to update');
				}
				return deferred.promise;
			}

			function getCostCodeChildrenToAssign(costCode, isOverwrite, costCodesToUpdate) {
				_.forEach(costCode.CostCodes, function (cc) {
					costCodesToUpdate.push(cc);
					getCostCodeChildrenToAssign(cc, isOverwrite, costCodesToUpdate);
				});
			}

			function recalculateFactorValues(item, column, parentItem, updatedItems) {
				let realFactorColumn = factorFieldsToRecalculate[column];
				item = serviceContainer.service.getItemById(item.Id);
				if (!item.CostCodeParentFk) {
					if (item[realFactorColumn] !== item[column]) {
						item[realFactorColumn] = item[column];
						updatedItems.push(item);
					}
				} else {
					if (!parentItem) {
						parentItem = serviceContainer.service.getItemById(item.CostCodeParentFk);
					}
					if (parentItem) {
						let newFactor = parentItem[realFactorColumn] * item[column];
						if (item[realFactorColumn] !== newFactor) {
							item[realFactorColumn] = newFactor;
							updatedItems.push(item);
						}
					}
				}
				if (angular.isArray(item.CostCodes) && item.CostCodes.length > 0) {
					_.forEach(item.CostCodes, function (cc) {
						recalculateFactorValues(cc, column, item, updatedItems);
					});
				}
			}
		}
	]);
})(angular);
