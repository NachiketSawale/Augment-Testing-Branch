/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals, _, $ */
	'use strict';
	let moduleName = 'estimate.main';
	angular.module(moduleName).service('estimateMainCalculateRiskDataService', [
		'$injector','ServiceDataProcessArraysExtension','estimateMainService','basicsRiskRegisterDependencyFormatterService',
		'platformDataServiceFactory','platformRuntimeDataService','platformDataValidationService',
		'$q','$http','platformModalService',
		function ($injector,ServiceDataProcessArraysExtension,estimateMainService,basicsRiskRegisterDependencyFormatterService,
			platformDataServiceFactory,platformRuntimeDataService,platformDataValidationService,
			$q,$http,platformModalService) {

			let selected = {};
			let service = {};

			let options = {
				hierarchicalNodeItem: {
					module: moduleName,
					serviceName: 'estimateMainCalculateRiskDataService',
					entityNameTranslationID: '',
					httpRead: {
						route: globals.webApiBaseUrl + 'estimate/main/riskcalculator/',
						endRead: 'assignedrisks',
						usePostForRead: true,
						initReadData: function initReadData(readData) {
							let selectedItem = estimateMainService.getSelected();
							readData.filter = selectedItem.EstHeaderFk;
							readData.estLineItemId = 0;

						}
					},
					httpDelete: {route: globals.webApiBaseUrl + 'estimate/main/riskcalculator/', endDelete: 'delete'},
					actions: {delete:true},
					presenter: {
						tree: {
							parentProp: 'RiskRegisterParentFk',
							childProp: 'RiskRegisters',
							// childSort: true,
							// isInitialSorted: true,
							// sortOptions: {initialSortColumn: {field: 'Code', id: 'code'}, isAsc: true},
							initCreationData: function initCreationData(creationData) {
								creationData.riskRegisterId = creationData.parentId;
								/* let list = serviceContainer.service.getList();
                                if (creationData.parentId && list && list.length > 0) {
                                    let parent = _.find(list, {Id: creationData.parentId});
                                } */
							},
							incorporateDataRead: function incorporateDataRead(readItems, data) {
								serviceContainer.data.sortByColumn(readItems);
								return serviceContainer.data.handleReadSucceeded(readItems, data);
							},
							handleCreateSucceeded: function (newItem) {
								return newItem;
							}
						}
					},
					setCellFocus: true,
					dataProcessor: [new ServiceDataProcessArraysExtension(['RiskRegisters'])],
					entityRole: {
						node: {
							codeField: 'Code',
							descField: 'Description',
							itemName: 'RiskRegisters',
							moduleName: 'basics.riskregister.moduleDisplayNameRiskRegisters',
							parentService: estimateMainService,
							handleUpdateDone: function (updateData, response, data) {

								if (data.itemList && response.RiskRegisters && response.RiskRegisters.length > 0) {

									angular.forEach(response.RiskRegisters, function (riskRegisterItem) {
										let index = data.itemList.indexOf(_.find(data.itemList, {Id: riskRegisterItem.Id}));
										if (index >= 0) {
											let subItems = data.itemList[index].RiskRegisters;
											angular.extend(data.itemList[index], riskRegisterItem);
											if (subItems !== null && subItems.length > 0) {
												data.itemList[index].HasChildren = true;
												data.itemList[index].RiskRegisters = subItems;
											}
										}
									});
									data.handleOnUpdateSucceeded(updateData, response, data, false);
									selected = serviceContainer.data.selectedItem;
									serviceContainer.data.sortByColumn(serviceContainer.data.itemTree);
									serviceContainer.data.listLoaded.fire();
									serviceContainer.service.setSelected(selected);
								} else {
									serviceContainer.service.updatedDoneMessenger.fire(null, updateData);
								}
								basicsRiskRegisterDependencyFormatterService.handleUpdateDone(response);
								data.handleOnUpdateSucceeded(updateData, response, data, true);
								// service.onUpdated.fire();
							}
						}
					},
					translation: {
						uid: 'basicsRiskRegisterDataService',
						title: 'basics.riskregister.riskEventsGridTitle',
						columns: [{header: 'cloud.common.descriptionInfo', field: 'DescriptionInfo'}]
					},
					entitySelection: {supportsMultiSelection: true}
				}
			};
			let serviceContainer = platformDataServiceFactory.createNewComplete(options);// jshint ignore:line
			serviceContainer.data.deleteItem = function deleteRootItem(entity, data) {
				if (platformRuntimeDataService.isBeingDeleted(entity)) {
					return $q.when(true);
				}
				platformRuntimeDataService.markAsBeingDeleted(entity);

				let deleteParams = {};
				deleteParams.entity = entity;
				deleteParams.index = data.itemList.indexOf(entity);
				deleteParams.service = service;
				platformDataValidationService.removeDeletedEntityFromErrorList(entity, service);
				data.doPrepareDelete(deleteParams, data);

				if (entity.Version === 0) {
					data.onDeleteDone(deleteParams, data, null);
					return $q.when(true);
				}
				else {
					deleteParams.entities = [deleteParams.entity];
					deleteRequest(deleteParams, data);
				}
			};

			serviceContainer.service.deleteEntities = function deleteRootItems(entities, data) {
				data = serviceContainer.data;
				if (platformRuntimeDataService.isBeingDeleted(entities)) {
					return $q.when(true);
				}

				let deleteParams = { entities: [] };
				let deleteParamsOnBackside = { entities: [] };
				deleteParams.service = service;
				platformRuntimeDataService.markListAsBeingDeleted(entities);
				entities.forEach(function (item) {
					item.index = data.itemList.indexOf(item);
				});
				platformDataValidationService.removeDeletedEntitiesFromErrorList(entities, service);
				data.doPrepareDelete({entities: entities}, data);

				$.extend(true, deleteParams.entities, entities);
				_.forEach(deleteParams.entities, function(val) {

					deleteParamsOnBackside.entities.push(val);

				});

				if (deleteParamsOnBackside.entities.length !== 0) {
					deleteRequest(deleteParamsOnBackside, data);
				}
			};

			function deleteRequest(deleteParams, data) {
				return platformModalService.showYesNoDialog('Delete Calculate Risks', 'no').then(function (result) {
					if (result.yes) {
						let deleteList = [];
						angular.forEach(deleteParams.entities,function (entity) {
							let deleteObj = {
								riskEventFk: 0,
								estHeaderFk: 0
							};
							deleteObj.riskEventFk = entity.Id;
							deleteObj.estHeaderFk = estimateMainService.getSelectedEstHeaderId();
							deleteList.push(deleteObj);
						});
						return $http.post(data.httpDeleteRoute +'delete', deleteList).then(function (response) {
							let resp = response.data;
							if (resp === 'Success') {
								// data.onDeleteDone(deleteParams, data, resp);
								service.load();
								service.gridRefresh();

								return true;
							}
						});
					}
					else {
						platformRuntimeDataService.removeMarkAsBeingDeletedFromList(deleteParams.entities);
					}
				});
			}
			service = serviceContainer.service;

			return service;
		}
	]);
})(angular);
