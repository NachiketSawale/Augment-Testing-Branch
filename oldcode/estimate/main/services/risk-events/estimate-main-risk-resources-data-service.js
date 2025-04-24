/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals,_ */
	'use strict';
	let moduleName = 'estimate.main';
	angular.module(moduleName).service('estimateMainRiskResourcesDataService', [
		'estimateMainRiskEventsDataService', 'basicsRiskRegisterDataService', 'estimateMainService', 'platformDataServiceFactory', 'PlatformMessenger',
		'estimateMainResourceImageProcessor', '$injector', 'platformRuntimeDataService',
		'platformSchemaService', '$http', 'cloudCommonGridService',
		function (estimateMainRiskEventsDataService, basicsRiskRegisterDataService, estimateMainService, platformDataServiceFactory, PlatformMessenger,
			estimateMainResourceImageProcessor, $injector, platformRuntimeDataService,
			platformSchemaService, $http, cloudCommonGridService) {
			let serviceOptions = {
				hierarchicalNodeItem: {
					module: angular.module(moduleName),
					serviceName: 'estimateMainRiskResourcesDataService',
					entityNameTranslationID: 'estimate.main.riskResourcesContainer',
					httpCreate: {route: globals.webApiBaseUrl + 'basics/riskregister/resources/', endCreate: 'create'},
					httpRead: {
						route: globals.webApiBaseUrl + 'basics/riskregister/resources/',
						endRead: 'master_list',
						initReadData: function initReadData(readData) {
							let selectedItem = estimateMainRiskEventsDataService.getSelected();
							// eslint-disable-next-line no-prototype-builtins
							if (selectedItem && selectedItem.hasOwnProperty('Id')) {
								readData.riskEventFk = selectedItem.Id;

							}

						},
						usePostForRead: true
					},
					httpUpdate: {route: globals.webApiBaseUrl + 'estimate/main/lineitem/', endUpdate: 'update'},
					entitySelection: {},
					setCellFocus: true,
					presenter: {
						tree: {
							parentProp: 'RiskResourcesFk', childProp: 'RiskResourcess', childSort: true, isDynamicModified: false,
							initCreationData: function initCreationData() {
								// let selectedItem = estimateMainRiskEventsDataService.getSelected();
								// let selectedResourceItem = serviceContainer.service.getSelected();

							},
							incorporateDataRead: function incorporateDataRead(readData, data) {
								if (readData.dtos && readData.dtos.length > 0) {

									angular.forEach(readData.dtos, function (dto) {
										setReadOnly(dto);
									});

									serviceContainer.data.handleReadSucceeded(readData.dtos, data);
								}
							},
							handleCreateSucceeded: function (newData) {
								// set Indirect Cost based on LineItem's IsGc flag
								let riskEvent = estimateMainRiskEventsDataService.getSelected();
								if (riskEvent) {

									newData.RiskEventFk = riskEvent.Id;
									newData.isMaster = true;

								}

								return newData;
							}
						}
					},
					entityRole: {
						leaf: {
							codeField: 'Code',
							itemName: 'RiskResource',
							moduleName: 'Estimate RiskRegister Resources',
							parentService: estimateMainRiskEventsDataService
						}
					}
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);

			// Do not download data when container is not displayed
			// serviceContainer.data.doesRequireLoadAlways = true;
			// serviceContainer.data.doNotLoadOnSelectionChange = false;
			let service = serviceContainer.service;

			service.toolHasAdded = false;

			service.refreshData = new PlatformMessenger();

			service.fireListLoaded = function fireListLoaded() {
				serviceContainer.data.listLoaded.fire();
			};
			service.setList = function setList(data) {
				data = data ? data : [];
				cloudCommonGridService.sortTree(data, 'Sorting', 'RiskResources');
				serviceContainer.data.itemTree = _.filter(data, function (item) {
					return item.RiskResourcesFk === null;
				});
				let flatResList = [];
				cloudCommonGridService.flatten(data, flatResList, 'RiskResources');
				flatResList = _.uniq(flatResList, 'Id');
				estimateMainResourceImageProcessor.processItems(flatResList);
				// estimateMainResourceProcessor.processItems(flatResList, false);
				serviceContainer.data.itemList = flatResList;

			};
			service.updateList = function updateList(resList, isReadOnly) {
				service.setList(resList, isReadOnly);
				service.fireListLoaded();
			};

			service.handleUpdateDone = handleUpdateDone;
			service.fieldChange = fieldChange;
			service.hasToLoadOnSelectionChange = function hasToLoadOnSelectionChange(riskEvent) {

				serviceContainer.data.doNotLoadOnSelectionChange = !!riskEvent.RiskEventFk;

			};
			service.clearModifications = function clearModifications() {

				let items = serviceContainer.data.itemList;

				angular.forEach(items, function (item) {

					serviceContainer.data.doClearModifications(item, serviceContainer.data);

				});
			};
			service.getResources = function (selectedRisk) {

				let data = {
					riskEventFk: selectedRisk.Id
				};
				return $http.post(globals.webApiBaseUrl + 'basics/riskregister/resources/master_list', data).then(function (response) {
					let result = response.data;
					let resources = _.filter(result.dtos, function (item) {
						return item.RiskEventFk === selectedRisk.Id;

					});
					service.clearModifications();
					return resources;
				});
			};

			service.getAssemblyLookupSelectedItems = function getAssemblyLookupSelectedItems(entity, assemblySelectedItems) {
				if (!_.isEmpty(assemblySelectedItems) && _.size(assemblySelectedItems) > 1) {
					let assemblyIds = _.map(assemblySelectedItems, 'Id');
					let riskID = estimateMainRiskEventsDataService.getSelected();
					let resourceTypeAssembly = 4;

					// service.resolveResourcesAndAssign(riskID, assemblyIds, resourceTypeAssembly);
					service.refreshMasterList(riskID, assemblyIds, resourceTypeAssembly);
				}
			};

			service.getCostCodeLookupSelectedItems = function getCostCodeLookupSelectedItems(entity, costCodeSelectedItems) {
				if (!_.isEmpty(costCodeSelectedItems) && _.size(costCodeSelectedItems) > 1) {
					let costCodeIds = _.map(costCodeSelectedItems, 'OriginalId');
					let riskID = estimateMainRiskEventsDataService.getSelected();
					let resourceTypeCostCode = 1;

					// service.resolveResourcesAndAssign(riskID, costCodeIds, resourceTypeCostCode);
					service.refreshMasterList(riskID, costCodeIds, resourceTypeCostCode);
				}
			};

			service.getMaterialLookupSelectedItems = function getMaterialLookupSelectedItems(entity, materialSelectedItems) {
				if (!_.isEmpty(materialSelectedItems) && _.size(materialSelectedItems) > 1) {
					let materialIds = _.map(materialSelectedItems, 'Id');
					let assemblyItem = estimateMainRiskEventsDataService.getSelected();
					let resourceTypeMaterial = 2;

					// service.resolveResourcesAndAssign(assemblyItem, materialIds, resourceTypeMaterial);
					service.refreshMasterList(assemblyItem, materialIds, resourceTypeMaterial);
				}
			};

			service.setSelectedLookupItem = function (costCodeLookupItem) {
				let itemSelected = service.getSelected();
				if (itemSelected && costCodeLookupItem) {
					itemSelected.Code = costCodeLookupItem.Code;
					itemSelected.MdcCostCodeFk = costCodeLookupItem.Id;
					itemSelected.DescriptionInfo = costCodeLookupItem.DescriptionInfo;
				}
			};

			service.setSelectedMaterialLookupItem = function (materialLookupItem) {
				let itemSelected = service.getSelected();
				if (itemSelected && materialLookupItem) {
					itemSelected.Code = materialLookupItem.Code;
					itemSelected.MdcMaterialFk = materialLookupItem.Id;
					itemSelected.DescriptionInfo = materialLookupItem.DescriptionInfo;
				}
			};

			service.setSelectedAssemblyLookupItem = function (assemblyLookupItem) {
				let itemSelected = service.getSelected();
				if (itemSelected && assemblyLookupItem) {
					itemSelected.Code = assemblyLookupItem.Code;
					itemSelected.AssemblyFk = assemblyLookupItem.Id;
					itemSelected.AssemblyHeaderFk = assemblyLookupItem.EstHeaderFk;
					itemSelected.DescriptionInfo = assemblyLookupItem.DescriptionInfo;
				}
			};

			service.refreshMasterList = function refreshMasterList(lineItem, assemblyIds, resourceType) {
				let postData = {
					MainItemId: lineItem.Id,
					ItemIds: assemblyIds,
					ResourceType: resourceType,
				};
				return getAssignedRiskResourcesRequest(postData);
			};
			return service;

			function getAssignedRiskResourcesRequest(customPostData) {

				let postData = {
					HeaderFk: estimateMainService.getSelectedEstHeaderId(),
					// AssemblyIds: assemblyIds, //Set customPostData to send assemblyIds
					SectionId: 33,
					ProjectId: estimateMainService.getSelectedProjectId()
				};
				angular.extend(postData, customPostData);

				let newResponse = null;
				$http.post(globals.webApiBaseUrl + 'basics/riskregister/resources/assignedriskresources', postData).then(function (response) {
					newResponse = response.data;
				},
				function (/* err */) {
					// console.error(err);
				});

				service.gridRefresh();
				return newResponse;
			}

			function handleUpdateDone(data) {
				let itemListResponse = angular.copy(_.map(data, 'RiskResource'));

				let updateTree = function updateTree(list) {
					_.forEach(list, function (oldItem) {
						let updatedItem = _.find(itemListResponse, {Id: oldItem.Id});
						if (updatedItem) {
							oldItem.Version = updatedItem.Version;
						}
						if (oldItem.HasChildren) {
							updateTree(oldItem.EstResources);
						}
					});
				};

				updateTree(serviceContainer.data.itemTree);

				let itemListOriginal = [];
				serviceContainer.data.flatten(serviceContainer.data.itemTree, itemListOriginal, serviceContainer.data.treePresOpt.childProp);
				estimateMainResourceImageProcessor.processItems(itemListOriginal);

				serviceContainer.data.itemListOriginal = angular.copy(itemListOriginal);

			}

			function fieldChange(/* item, field, column */) {

			}

			function setReadOnly(dto) {
				let selectedItem = estimateMainRiskEventsDataService.getSelected();
				if (selectedItem && selectedItem.IsMaster === true) {
					let temp = platformSchemaService.getSchemaFromCache({
						typeName: 'RiskResourcesDto',
						moduleSubModule: 'Basics.RiskRegister'
					}).properties;
					let fields = [];

					for (let prop in temp) {
						// eslint-disable-next-line no-prototype-builtins
						if (temp.hasOwnProperty(prop)) {
							fields.push({field: prop, readonly: true});
						}
					}

					platformRuntimeDataService.readonly(dto, fields);
					return dto;
					/* angular.forEach(readData.dtos,function (dto) {
						platformRuntimeDataService.readonly(dto, fields);
						$injector.get('basicsRiskregisterResourceConfigurationService').getStandardConfigForListView().columns
					}); */
				}
			}
		}
	]);
})(angular);
