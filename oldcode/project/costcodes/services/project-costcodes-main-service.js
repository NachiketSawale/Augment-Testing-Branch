/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/* global globals, _ */
	let moduleName = 'project.costcodes';
	let projectCostCodesModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name projectCostCodesMainService
	 * @function
	 *
	 * @description
	 * projectCostCodesMainService is the data service for all project costcodes related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('projectCostCodesMainService',
		['$http',
			'$q',
			'$log',
			'$injector',
			'projectMainService',
			'platformDataServiceFactory',
			'cloudCommonGridService',
			'hourfactorReadonlyProcessor',
			'ProjectCostCodesProcessor',
			'ServiceDataProcessArraysExtension',

			function ($http,
				$q,
				$log,
				$injector,
				projectMainService,
				platformDataServiceFactory,
				cloudCommonGridService,
				hourfactorReadonlyProcessor,
				ProjectCostCodesProcessor,
				ServiceDataProcessArraysExtension) {

				let selectedItemId = null;
				let showUpdateRelatedAssemblyPrompt = true;
				let updateRelatedAssembly = false;

				let prjCostCodeServiceInfo = {
					hierarchicalNodeItem: {
						module: projectCostCodesModule,
						serviceName: 'projectCostCodesMainService',
						httpRead: { route: globals.webApiBaseUrl + 'project/costcodes/'},
						httpCreate: { route: globals.webApiBaseUrl + 'project/costcodes/', endCreate: 'create' },
						httpUpdate: {route: globals.webApiBaseUrl + 'project/main/', endUpdate: 'update'},
						actions: { create: 'hierarchical', canCreateCallBackFunc: canCreate,
							canCreateChildCallBackFunc: canCreateChild, delete: false},
						dataProcessor: [new ServiceDataProcessArraysExtension(['ProjectCostCodes']), ProjectCostCodesProcessor, hourfactorReadonlyProcessor],
						entityRole: {
							node: {
								codeField: 'Code',
								itemName: 'PrjCostCodes',
								parentService: projectMainService,
								parentFilter: 'projectId' }},
						entitySelection: {},
						presenter: {
							tree: {
								parentProp: 'CostCodeParentFk',
								childProp: 'ProjectCostCodes',
								childSort : true,
								isInitialSorted:true, sortOptions: {initialSortColumn: {field: 'Code', id: 'code'}, isAsc: true},
								initCreationData: function initCreationData(creationData) {
									let selectedItem =  projectMainService.getSelected();
									if (selectedItem && selectedItem.Id > 0) {
										creationData.projectId = selectedItem.Id;
									}
									creationData.ParentCostCode = creationData.parent;
								},
								incorporateDataRead: incorporateDataRead,
								handleCreateSucceeded : function(newCreatedItem){
									let projectCostCodesDynamicUserDefinedColumnService = $injector.get('projectCostCodesDynamicUserDefinedColumnService');
									projectCostCodesDynamicUserDefinedColumnService.attachEmptyDataToColumn(newCreatedItem);

									return newCreatedItem;
								}
							}
						}
					}
				};
				let container = platformDataServiceFactory.createNewComplete(prjCostCodeServiceInfo);

				let service = container.service;

				function canCreate(){
					var selectedItem = service.getSelected();
					let parentItem = selectedItem ? service.getItemById(selectedItem.CostCodeParentFk) : null;
					if (parentItem) {
						return parentItem.IsChildAllowed;
					}
					return false;
				}

				function canCreateChild(item){
					let result = false;

					if(!item){
						return result;
					}

					result = item && item.IsChildAllowed;

					return result;
				}

				function incorporateDataRead(readItems, data) {
					let basCostCode = {};
					angular.forEach(readItems, function(item){
						basCostCode = cloudCommonGridService.addPrefixToKeys(item.BasCostCode, 'BasCostCode');
						angular.extend(item, basCostCode);
					});
					$injector.get('platformDataServiceEntitySortExtension').sortTree(readItems, 'Code', 'ProjectCostCodes');

					let result = container.data.handleReadSucceeded(readItems, data);
					let projectCostCodesDynamicUserDefinedColumnService = $injector.get('projectCostCodesDynamicUserDefinedColumnService');
					projectCostCodesDynamicUserDefinedColumnService.attachDataToColumn(data.getList());
					let selectedProjectItem = projectMainService.getSelected();
					projectCostCodesDynamicUserDefinedColumnService.setProjectId(selectedProjectItem ? selectedProjectItem.Id : -1);

					if(selectedItemId){
						let list = service.getList();
						let selectItem = list && list.length ? _.find(list, {Id:selectedItemId}) : {};
						selectedItemId = null;
						if(selectItem && selectItem.Id){
							service.setSelected({}).then(function(){
								service.setSelected(selectItem);
							});
						}
					}
					return result;
				}

				let factorFieldsToRecalculate = {
					'FactorCosts': 'RealFactorCosts',
					'FactorQuantity': 'RealFactorQuantity'
				};

				service.calcRealFactors = function calcRealFactors (arg){
					let item = arg.item;
					let column = arg.grid.getColumns()[arg.cell].field;

					if (factorFieldsToRecalculate[column]) {
						let updatedItems = [];
						calculateHierarchyFactors(item, column, null, updatedItems);
						container.service.markEntitiesAsModified(updatedItems);
					}
				};

				function calculateHierarchyFactors(item, column, parentItem, updatedItems) {
					let realFactorColumn = factorFieldsToRecalculate[column];
					item = container.service.getItemById(item.Id);
					if (!item.CostCodeParentFk) {
						if (item[realFactorColumn] !== item[column]) {
							item[realFactorColumn] = item[column];
							updatedItems.push(item);
						}
					} else {
						if (!parentItem) {
							parentItem = container.service.getItemById(item.CostCodeParentFk);
						}
						if (parentItem) {
							let newFactor = parentItem[realFactorColumn] * item[column];
							if (item[realFactorColumn] !== newFactor) {
								item[realFactorColumn] = newFactor;
								updatedItems.push(item);
							}
						}
					}
					if (angular.isArray(item.ProjectCostCodes) && item.ProjectCostCodes.length > 0) {
						_.forEach(item.ProjectCostCodes, function (cc) {
							calculateHierarchyFactors(cc, column, item, updatedItems);
						});
					}
				}

				service.navigateTo = function navigateTo(item) {
					if (_.isObject(item) && _.isFunction(service.parentService().showTargetContainer)) {
						let targetCostCodesContainer = '30';
						let success = service.parentService().showTargetContainer(targetCostCodesContainer);
						if (success) {
							selectedItemId = item.Id;
							if(service.parentService().getIfSelectedIdElse(null)){
								service.load();
							}else{
								service.parentService().load();
							}
						}
					}
				};

				service.updateEstimatePrice = function(){
					if(showUpdateRelatedAssemblyPrompt){
						let platformModalService = $injector.get('platformModalService');
						platformModalService.showDialog({
							templateUrl: globals.appBaseUrl + 'project.costcodes/templates/project-costcodes-update-estimate-price-related-assembly-dialog.html',
							controller: 'projectCostcodesUpdateEstimatePriceRelatedAssemblyDialogController',
							width: '640px'
						}).then(function (result) {
							updateRelatedAssembly = result && result.update;
						});
					}
				}

				service.disableUpdatePrompt = function(){
					showUpdateRelatedAssemblyPrompt = false;
				}

				service.provideUpdateData = function provideUpdateData(updateData){
					if(updateData && updateData.PrjCostCodesToSave && updateData.PrjCostCodesToSave.length > 0){
						_.forEach(updateData.PrjCostCodesToSave, function(costCodeToSave){
							costCodeToSave.UpdateRelatedAssembly = updateRelatedAssembly;
						});
					}

					return updateData;
				}

				service.fieldChanged = function(item, column) {
					if(column === 'VhbSheetGcTypeFk' || column === 'VhbSheetDjcTypeFk'){					
						assignColumnValuesToChildren(item,column);
					}
				}

				function assignColumnValuesToChildren(prjCostCode, columnName) {
					const modifiedItems = []; 
					
					function recurseCostCode(prjCc) {
						_.forEach(prjCc.ProjectCostCodes, function (cc) {
							cc[columnName] = prjCc[columnName];
							modifiedItems.push(cc); 
	
							if (cc.ProjectCostCodes && cc.ProjectCostCodes.length > 0) {
								recurseCostCode(cc,columnName);
							}
						});
					}
				
					recurseCostCode(prjCostCode,columnName); 				
					
					container.service.markEntitiesAsModified(modifiedItems);
				}

				return service;

			}]);
})(angular);
