/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals,_ */
	'use strict';
	let moduleName = 'estimate.main';
	angular.module(moduleName).service('estimateMainRiskEventsDataService', ['ServiceDataProcessArraysExtension','basicsRiskRegisterDependencyFormatterService',
		'platformDataServiceFactory','estimateMainService','basicsRiskRegisterImpactDetailService',
		'cloudCommonGridService','PlatformMessenger','$injector',
		function (ServiceDataProcessArraysExtension,basicsRiskRegisterDependencyFormatterService,
			platformDataServiceFactory,estimateMainService,basicsRiskRegisterImpactDetailService,cloudCommonGridService,
			PlatformMessenger,$injector) {
			let service = {},
				selected = {};

			let canChildRiskRegister = function canChildRiskRegister() {
				let selectedItem = service.getSelected();
				return selectedItem !== null;
			};
			let options = {
				hierarchicalNodeItem: {
					module: moduleName,
					serviceName: 'estimateMainRiskEventsDataService',
					entityNameTranslationID: 'estimate.main.estimateRiskEvents',
					httpCreate:{
						route: globals.webApiBaseUrl + 'estimate/main/riskcalculator/',
						endCreate:'create'
					},
					httpRead: {
						route: globals.webApiBaseUrl + 'estimate/main/riskcalculator/',
						endPointRead:'tree',
						usePostForRead: true,
						initReadData: function initReadData(readData) {
							readData.filter = estimateMainService.getSelectedEstHeaderId();
						}
					},
					actions: {create: 'hierarchical', canCreateChildCallBackFunc: canChildRiskRegister, delete: true},
					presenter: {
						tree: {
							parentProp: 'RiskRegisterParentFk',
							childProp: 'RiskRegisters',
							initCreationData: function initCreationData(creationData) {
								creationData.riskRegisterId = creationData.parentId;
								creationData.estimateHeaderFk = estimateMainService.getSelectedEstHeaderId();
							},
							incorporateDataRead: function incorporateDataRead(readItems, data) {
								serviceContainer.data.sortByColumn(readItems);
								serviceContainer.service.setList(readItems);
								angular.forEach(readItems,function (item) {

									basicsRiskRegisterImpactDetailService.transfromLowAndHighImpacts(item);
								});
								return serviceContainer.data.handleReadSucceeded(readItems, data);
							},
							handleCreateSucceeded: function (newItem) {
								newItem.EstHeaderFk = estimateMainService.getSelectedEstHeaderId();
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
							parentService: estimateMainService

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

			service = serviceContainer.service;
			service.updatedDoneMessenger = new PlatformMessenger();

			serviceContainer.data.provideUpdateData = function (updateData) {

				// eslint-disable-next-line no-prototype-builtins
				if(updateData.hasOwnProperty('RiskRegistersToSave')){
					angular.forEach(updateData.RiskRegistersToSave,function (riskregisterObj) {
						// eslint-disable-next-line no-prototype-builtins
						if(riskregisterObj.hasOwnProperty('RiskRegisters')){
							riskregisterObj.RiskRegisters = [riskregisterObj.RiskRegisters];// converts to a list if single
							// update to new if obj is master version
							angular.forEach(riskregisterObj.RiskRegisters,function (risk) {
								if(risk.IsMaster){
									risk.Id = null;
									risk.Version = 0;
									risk.RiskResourcesEntities = [];
									risk.DescriptionInfo.Description = risk.origDescription.Description + ' - Edited';
									risk.DescriptionInfo.Translated = risk.origDescription.Translated + ' - Edited';
									let riskResourceService = $injector.get('estimateMainRiskResourcesDataService');
									let resources = riskResourceService.getList();
									angular.forEach(resources,function (res) {
										res.Id = null;
										res.RiskEventFk = null;
										risk.RiskResourcesEntities.push(res);
									});
								}
							});
						}else{
							riskregisterObj.RiskRegisters = [service.getSelected()];
						}


					});
				}
				return updateData;
			};

			service.fieldChange = function fieldChange(item,field,column){
				basicsRiskRegisterImpactDetailService.editFields(service,item,field,column);
			};

			service.handleUpdateDone =  function handleUpdateDone(updateData, response, data) {
				// updateData.RiskRegisters[0].RiskRegisterImpactEntities=$scope.newEntity;
				let itemListResponse = data.RiskRegisters;// angular.copy(_.map(data, 'RiskRegisters'));

				let updateTree = function updateTree(list){
					_.forEach(list, function(oldItem){
						let updatedItem = _.find(itemListResponse,{ Id: oldItem.Id });
						if (updatedItem){
							oldItem.Version = updatedItem.Version;
						}
						if (oldItem.HasChildren){
							updateTree(oldItem.RiskRegisters);
						}
					});
				};

				updateTree(serviceContainer.data.itemTree);

				let itemListOriginal = [];
				serviceContainer.data.flatten(serviceContainer.data.itemTree, itemListOriginal, serviceContainer.data.treePresOpt.childProp);
				// estimateMainResourceImageProcessor.processItems(itemListOriginal);

				serviceContainer.data.itemListOriginal = angular.copy(itemListOriginal);
				if (serviceContainer.data.itemList && response.RiskRegistersToSave && response.RiskRegistersToSave.length > 0) {

					angular.forEach(response.RiskRegistersToSave,function (payload) {
						angular.forEach(payload.RiskRegisters,function (riskRegisterItem) {

							let index = serviceContainer.data.itemList.indexOf(_.find(serviceContainer.data.itemList, {Id: riskRegisterItem.Id}));
							if (index >= 0) {
								let subItems = serviceContainer.data.itemList[index].RiskRegisters;
								angular.extend(serviceContainer.data.itemList[index], riskRegisterItem);
								if (subItems !== null && subItems.length > 0) {
									serviceContainer.data.itemList[index].HasChildren = true;
									serviceContainer.data.itemList[index].RiskRegisters = subItems;
								}
							}
						});
					});
					/* angular.forEach(response.RiskRegistersToSave.RiskRegisters, function (riskRegisterItem) {
						let index = data.itemList.indexOf(_.find(serviceContainer.data.itemList, {Id: riskRegisterItem.Id}));
						if (index >= 0) {
							let subItems = serviceContainer.data.itemList[index].RiskRegisters;
							angular.extend(serviceContainer.data.itemList[index], riskRegisterItem);
							if (subItems !== null && subItems.length > 0) {
								serviceContainer.data.itemList[index].HasChildren = true;
								serviceContainer.data.itemList[index].RiskRegisters = subItems;
							}
						}
					}); */
					// serviceContainer.data.handleOnUpdateSucceeded(updateData, response, data, false);
					selected = serviceContainer.data.selectedItem;
					serviceContainer.data.sortByColumn(serviceContainer.data.itemTree);
					serviceContainer.service.gridRefresh();
					serviceContainer.data.listLoaded.fire();
					serviceContainer.service.setSelected(selected);

				} else {
					serviceContainer.service.updatedDoneMessenger.fire(null, updateData);
				}
				basicsRiskRegisterDependencyFormatterService.handleUpdateDone(response);
				$injector.get('estimateMainRiskResourcesDataService').load();
				// serviceContainer.data.handleOnUpdateSucceeded(updateData, response, data, true);
				// serviceContainer.service.load();
			};

			service.setList = function setList(data) {
				data = data ? data : [];
				cloudCommonGridService.sortTree(data, 'Sorting', 'RiskRegisters');
				serviceContainer.data.itemTree = _.filter(data, function(item){
					return item.RiskRegisterParentFk === null;
				});
				let flatResList = [];
				cloudCommonGridService.flatten(data, flatResList, 'RiskRegisters');
				flatResList = _.uniq(flatResList, 'Id');

				serviceContainer.data.itemList = flatResList;


			};

			return service;
		}
	]);
})(angular);
