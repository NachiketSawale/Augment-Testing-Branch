/*
 * Created by salopek on 07.10.2019.
 */
(function (angular) {
	'use strict';
	var moduleName = 'basics.riskregister';
	var riskRegisterModule = angular.module(moduleName);
	/*global angular,globals,_*/
	/**
	 * @ngdoc service
	 * @name basicsRiskRegisterAssignedResourcesMainService
	 * @function
	 *
	 * @description
	 * basicsRiskRegisterAssignedResourcesMainService is the data service for all costcodes related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	riskRegisterModule.factory('basicsRiskRegisterAssignedResourcesMainService', ['_', 'PlatformMessenger','platformDataServiceFactory', 'platformModalService', 'platformGridAPI', 'basicsCommonMandatoryProcessor',
		'ServiceDataProcessArraysExtension', 'basicsCostCodesImageProcessor', 'basicsLookupdataLookupDescriptorService', '$http', '$q', 'hourfactorReadonlyProcessor', '$injector',
		function (_, PlatformMessenger,platformDataServiceFactory, platformModalService, platformGridAPI, basicsCommonMandatoryProcessor,
				  ServiceDataProcessArraysExtension, basicsCostCodesImageProcessor, basicsLookupdataLookupDescriptorService, $http, $q, hourfactorReadonlyProcessor, $injector) {
			var selected = {};

			var showPreserverSelection = true,
				isOverwrite = true,
				isAssignToChildren = true,
				isPreserveSelection = false,
				companyCostCodes = null;

			var factorFieldsToRecalculate = {
				'FactorCosts': 'RealFactorCosts',
				'FactorQuantity': 'RealFactorQuantity'
			};

			var canChildCostCode = function canChildCostCode() {
				var selectedItem = service.getSelected();
				return !(selectedItem && selectedItem.IsEditable);
			};

			// The instance of the main service - to be filled with functionality below
			var basicsCostCodesMainServiceOptions = {
				hierarchicalRootItem: {
					module: riskRegisterModule,
					serviceName: 'basicsRiskRegisterAssignedResourcesMainService',
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
								var list = serviceContainer.service.getList();
								if (creationData.parentId && list && list.length > 0) {
									var parent = _.find(list, {Id: creationData.parentId});
									creationData.realFactorCost = parent.RealFactorCosts;
									creationData.realFactorQuantity = parent.RealFactorQuantity;
									creationData.costCodeTypeFk = parent.CostCodeTypeFk;
									creationData.costGroupPortionsFk = parent.CostGroupPortionsFk;
									creationData.costCodePortionsFk = parent.CostCodePortionsFk;
									creationData.abcClassificationFk = parent.AbcClassificationFk;
									creationData.prcStructureFk = parent.PrcStructureFk;
								}
							},
							incorporateDataRead: function incorporateDataRead(readItems, data) {
								serviceContainer.data.sortByColumn(readItems);
								return serviceContainer.data.handleReadSucceeded(readItems, data);
							}
						}
					},
					dataProcessor: [new ServiceDataProcessArraysExtension(['CostCodes']), basicsCostCodesImageProcessor, hourfactorReadonlyProcessor],
					entityRole: {
						root: {
							codeField: 'Code',
							descField: 'Description',
							itemName: 'CostCodes',
							moduleName: 'basics.riskregister.moduleDisplayNameRiskRegisters',
							handleUpdateDone: function (updateData, response, data) {
								clearCompanyCostCodes();
								if (data.itemList && response.CostCodes && response.CostCodes.length > 0) {

									angular.forEach(response.CostCodes, function (costCodeItem) {
										var index = data.itemList.indexOf(_.find(data.itemList, {Id: costCodeItem.Id}));
										if (index >= 0) {
											var subItems = data.itemList[index].CostCodes;
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
									//refresh cost code lookup data
									basicsLookupdataLookupDescriptorService.removeData('estmdccostcodes');
								}
								service.onUpdated.fire();
								//service.refresh();
							}
						}
					},
					translation: {
						uid: 'basicsCostCodesMainService',
						title: 'basics.costcodes.costCodes',
						columns: [{header: 'cloud.common.descriptionInfo', field: 'DescriptionInfo'},
							{header: 'basics.costcodes.description2', field: 'Description2Info'}]
					},
					entitySelection: {supportsMultiSelection: true}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(basicsCostCodesMainServiceOptions);//jshint ignore:line
			var service = serviceContainer.service;

			service.onUpdated = new PlatformMessenger();

			service.load();

			// service.addSelectionColumn = function addSelectionColumn(gridId) {
			// 	var grid;
			// 	if (platformGridAPI.grids.exist(gridId)) {
			// 		grid = platformGridAPI.grids.element('id', gridId);
			// 	}
			// 	if (grid) {
			// 		var checkboxSelector = new Slick.CheckboxSelectColumn({ });
			// 		grid.columns.push(checkboxSelector.getColumnDefinition());
			// 	}
			// };

			//TODO: it is just a work around to clear modifications when do call search
			service.executeSearchFilterBase = serviceContainer.service.executeSearchFilter;
			service.executeSearchFilter = function executeSearchFilter(e, filter) {
				//clear modify
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

			service.setCompanyCostCodes = function setCompanyCostCodes(includeChild){
				companyCostCodes = [];
				if(includeChild){
					var items = service.getSelectedEntities();
					var cloudCommonGridService = $injector.get('cloudCommonGridService');
					angular.forEach(items, function(item){
						companyCostCodes.push(angular.copy(item));
						var children = cloudCommonGridService.getAllChildren(item, 'CostCodes');
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
					var list = service.getList();
					var selectItem = list && list.length ? _.find(list, {Id:item.Id}) : {};
					service.setSelected(selectItem);
				});
			};

			function clearCompanyCostCodes(){
				companyCostCodes = null;
			}

			return service;

			function fieldChanged(item, column) {
				if (column === 'ContrCostCodeFk') {
					assignControllingCostCodeInternal(item, item.ContrCostCodeFk);
				} else if (factorFieldsToRecalculate[column]) {
					var updatedItems = [];
					recalculateFactorValues(item, column, null, updatedItems);
					serviceContainer.service.markEntitiesAsModified(updatedItems);
				}
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
				var showAssignToChildren = false;
				var showOverwrite = false;

				if (_.isArray(costCode.CostCodes) && costCode.CostCodes.length > 0) {
					showAssignToChildren = true;
					showOverwrite = true;
				}
				var assignControllingCostCodePromise;
				if (showAssignToChildren || showOverwrite) {
					if (!isPreserveSelection) {
						var modalOptions = {
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
				var returnPromise = $q.when(false);
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
				var deferred = $q.defer();
				var costCodesToUpdate = [];
				if (!costCode.ContrCostCodeFk || isOverwrite) {
					costCodesToUpdate.push(costCode);
				}
				if (isAssignToChildren) {
					// costCodeIds = costCodeIds.concat(_.map(_.filter(costCode.CostCodes, function (c) {
					// 	return !c.ContrCostCodeFk || options.isOverwrite;
					// }), 'Id'));
					// // Commented above code and added new logic to get cost code ids recursively
					getCostCodeChildrenToAssign(costCode, isOverwrite, costCodesToUpdate);
				}
				if (costCodesToUpdate.length > 0) {
					var costCodesToBeModified = [];
					_.forEach(costCodesToUpdate, function (cc) {
						//cc = serviceContainer.service.getItemById(cc.Id);
						if ((!cc.ContrCostCodeFk || isOverwrite) && cc.ContrCostCodeFk !== contrCostCodeId) {
							cc.ContrCostCodeFk = contrCostCodeId;
							costCodesToBeModified.push(cc);
						}
					});
					deferred.resolve(costCodesToBeModified);
					// if (costCodesToBeModified.length > 0) {
					// 	serviceContainer.service.markEntitiesAsModified(costCodesToBeModified);
					// }
					// assignControllingCostCode(contrCostCodeId, costCodesToUpdate);
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
				var realFactorColumn = factorFieldsToRecalculate[column];
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
						var newFactor = parentItem[realFactorColumn] * item[column];
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
})(angular, _);
