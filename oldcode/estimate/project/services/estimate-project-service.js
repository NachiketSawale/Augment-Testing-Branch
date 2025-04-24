/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

/* global globals, _, Platform */

(function () {
	'use strict';
	let moduleName = 'estimate.project';
	let estimateMainName = 'estimate.main';
	let estimateProjectModule = angular.module(moduleName);

	// processor to extend 'EstimateComposite' with addition information about the selected project for use in estimation (-> navigator)
	// TODO: as soon as navigator provides parameter options, this processor can be removed
	angular.module(estimateMainName).factory('estimateProjectExtendProjectInfoProcessor',
		['$http', 'projectMainService',
			function ($http, projectMainService) {
				return {
					processItem: function processItem(estimateComposite) {
						if (estimateComposite && projectMainService.getSelected()) {
							let projectEntity = projectMainService.getSelected();
							// only some properties are needed
							estimateComposite.projectInfo = {
								ProjectNo: projectEntity.ProjectNo,
								ProjectName: projectEntity.ProjectName
							};
						}
					}
				};
			}]);

	/**
	 * @ngdoc service
	 * @name estimateProjectService
	 * @function
	 *
	 * @description
	 * estimateProjectService is the data service for project estimate Header functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	estimateProjectModule.factory('estimateProjectService', ['$q', '$http', '$timeout', '$injector', '$translate', 'platformDataServiceFactory', 'projectMainService', 'platformRuntimeDataService', 'estimateProjectExtendProjectInfoProcessor', 'mainViewService', 'cloudDesktopSidebarService', 'estimateProjectProcessor', 'estimateProjectSpecificationService', 'platformCreateUuid',
		function ($q, $http, $timeout, $injector, $translate, platformDataServiceFactory, projectMainService, platformRuntimeDataService, estimateProjectExtendProjectInfoProcessor, mainViewService, cloudDesktopSidebarService, estimateProjectProcessor, estimateProjectSpecificationService, platformCreateUuid) {

			let isFilterActive = true;
			let allEstHeaderOfPrj = [];

			function getCreationData(creationData) {
				let selectedItem = projectMainService.getSelected();
				if (projectMainService.isSelection(selectedItem) && selectedItem.Id > 0) {
					creationData.PrjProjectFk = selectedItem.Id;

					// Increment the code of the estimate header

					let uiEstHeaders = _.map(serviceContainer.service.getList(), 'EstHeader');
					allEstHeaderOfPrj = isFilterActive ? allEstHeaderOfPrj.concat(uiEstHeaders) : allEstHeaderOfPrj;
					allEstHeaderOfPrj = _.uniqBy(allEstHeaderOfPrj, 'Id');

					let estHeaderList = isFilterActive ? allEstHeaderOfPrj : uiEstHeaders;

					let convertibleCodes = _.filter(estHeaderList, function (item) {
						return /^\d+$/.test(item.Code); // Make sure we only take the codes that can be converted to integers
					});

					creationData.Codes = _.map(convertibleCodes, 'Code');

					let convertedCodes = _.map(convertibleCodes, function (item) {
						return parseInt(item.Code, 10); // Convert the strings to integers
					});

					let maxCode = (convertedCodes.length === 0) ? null : _.max(convertedCodes);
					if (maxCode) {
						maxCode = (maxCode + 1).toString();
					}

					creationData.Code = maxCode || '1';
				}
				return creationData;
			}

			// The instance of the main service - to be filled with functionality below
			let estimateMainHeaderServiceOptions = {
				flatNodeItem: {
					module: estimateProjectModule,
					serviceName: 'estimateProjectService',
					httpCreate: {route: globals.webApiBaseUrl + 'estimate/project/'},
					httpRead: {
						route: globals.webApiBaseUrl + 'estimate/project/',
						endRead: 'list',
						initReadData: function initReadData(readData) {
							readData.projectFk = projectMainService.getIfSelectedIdElse (null);
							readData.IsFilterActive = isFilterActive;
						},
						usePostForRead: true
					},
					actions: {delete: true, create: 'flat'},
					entityRole: {
						node: {
							itemName: 'EstimateComplete',
							moduleName: 'Estimate Project',
							parentService: projectMainService
						}
					},
					entitySelection: {},
					dataProcessor: [estimateProjectExtendProjectInfoProcessor, estimateProjectProcessor],
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								getCreationData (creationData);
							},
							incorporateDataRead: function (readData, data) {

								let gccOrder = _.find (readData, {'IsGCOrder': true});
								if (gccOrder) {
									platformRuntimeDataService.readonly (gccOrder, true);
								}

								let result = serviceContainer.data.handleReadSucceeded (readData, data);
								selectEstHeader (readData);
								serviceContainer.service.onSelectProjectToolbarStatus.fire();
								return result;
							}
						}
					},
					translation: {
						uid: 'estimateProjectService',
						title: 'project.main.estimate',
						columns: [{header: 'cloud.common.entityDescription', field: 'EstHeader.DescriptionInfo'}],
						dtoScheme: {
							typeName: 'EstHeaderDto',
							moduleSubModule: 'Estimate.Project'
						}
					}
				}
			};

			/* jshint -W003 */
			let serviceContainer = platformDataServiceFactory.createNewComplete (estimateMainHeaderServiceOptions);
			let service = serviceContainer.service ? serviceContainer.service : {};
			service.provideSpecUpdate = new Platform.Messenger ();
			service.updateToolItems = new Platform.Messenger ();
			service.updateTextEditor = new Platform.Messenger ();

			serviceContainer.data.newEntityValidator = newEntityValidator ();

			function newEntityValidator() {
				return {
					validate: function validate(newItem) {
						let validationService = $injector.get ('estimateProjectValidationService');
						validationService.validateEstHeader$LgmJobFk (newItem, newItem.EstHeader.LgmJobFk, 'EstHeader.LgmJobFk');
					}
				};
			}

			service.handleUpdateDone = function (data) {
				if (data && data.EstimateCompleteToSave) {
					let estimateCompletes = _.map (data.EstimateCompleteToSave, 'EstimateComplete');
					let gccOrder = _.find (estimateCompletes, {'IsGCOrder': true});
					if (gccOrder) {
						platformRuntimeDataService.readonly (gccOrder, true);
					}
				}

				if (data && data.EstimateCompleteToDelete && data.EstimateCompleteToDelete.length > 0) {
					let isReLoad = data.EstimateCompleteToDelete[0].IsReLoad;
					if (isReLoad) {
						service.load ();
					}
				}
			};

			serviceContainer.data.provideUpdateData = function (updateData) {
				service.provideSpecUpdate.fire ();
				let headerTextToSave = estimateProjectSpecificationService.getModifiedSpecification ();
				if (headerTextToSave && headerTextToSave.length) {
					updateData.EntitiesCount += 1;
					updateData.EstimateCompleteTosave = updateData.EstimateCompleteToSave && updateData.EstimateCompleteToSave.length ? updateData.EstimateCompleteToSave : [];
					angular.forEach (headerTextToSave, function (item) {
						if (item && item.ParentId) {
							let matchedItem = _.find (updateData.EstimateCompleteTosave, {MainItemId: item.CompositeItemId});
							if (matchedItem) {
								angular.merge (matchedItem, {
									EstimateComplete: {
										EstHeaderId: item.ParentId,
										EstHeaderTextToSave: item
									}
								});
							} else {
								let itemToSave = {
									MainItemId: item.CompositeItemId,
									EstimateComplete: {
										Id: item.CompositeItemId,
										EstHeaderId: item.ParentId,
										EstHeaderTextToSave: item
									}
								};
								updateData.EstimateCompleteTosave.push (itemToSave);
							}
						}
					});
				}
				return updateData;
			};

			let originalOnDeleteDone = serviceContainer.data.onDeleteDone;

			serviceContainer.data.onDeleteDone = function onDeleteDone(deleteParams, data, response) {
				originalOnDeleteDone (deleteParams, data, response);
				$injector.get ('estimateProjectValidationService').validateEstimateItemsUniqueCode (deleteParams.entities);
				$injector.get ('estimateMainService').clear ();
			};

			let basCommonLookupService = $injector.get ('basicsCurrencyLookupService');

			basCommonLookupService.loadLookupData ();// load data for currency a and b

			let onItemSelectionChanged = function onItemSelectionChanged() {
				service.updateTextEditor.fire(false);
				let estimateCompositeItem = serviceContainer.service.getSelected ();
				if (serviceContainer.service.isSelection (estimateCompositeItem) && estimateCompositeItem.Id > 0) {
					let estHeader = estimateCompositeItem.EstHeader;
					if (estHeader && estHeader.Id > 0) {
						service.updateTextEditor.fire(true);
						estimateProjectSpecificationService.loadSpecification (estHeader, estimateCompositeItem.Id);
					}
				}
			};

			serviceContainer.service.registerSelectionChanged (onItemSelectionChanged);

			service.getSelctionItem = function(){
				let estimateCompositeItem = serviceContainer.service.getSelected ();
				if(estimateCompositeItem) {
					let estHeader = estimateCompositeItem.EstHeader;
					return estHeader;
				}
			};
			serviceContainer.service.saveParentService = function saveParentService() {
				var deferred = $q.defer();
				if (angular.isObject(serviceContainer.data) && angular.isObject(serviceContainer.data.parentService)) {
					serviceContainer.data.parentService.updateAndExecute(function () {
						deferred.resolve();
					});
				}
				return deferred.promise;
			};

			serviceContainer.service.onToggleCreateButton = new Platform.Messenger ();
			serviceContainer.service.onSelectProjectToolbarStatus = new Platform.Messenger ();
			function createEstHeaer() {
				createEstimate ().then (function (data) {
					// This function returns Item with 2nd largest Id from passed array
					function findSecondLargeIdItem(arr) {
						if (arr && arr.length <= 1) {
							return null;
						}
						let fLargeNum = 0;
						let sLargeNum = 0;
						for (let i = 0; i < arr.length; i++) {
							if (fLargeNum < arr[i].Id) {
								sLargeNum = fLargeNum;
								fLargeNum = arr[i].Id;
							} else if (sLargeNum < arr[i].Id) {
								sLargeNum = arr[i].Id;
							}
						}
						return _.find (arr, {Id: sLargeNum});
					}

					if (data && data.DoChangeActiveEstimate) {
						let list = serviceContainer.service.getList ();
						let headerList = _.map (list, 'EstHeader');
						let sLargeItem = findSecondLargeIdItem (headerList);
						if (sLargeItem && sLargeItem.Id) {
							sLargeItem.IsActive = false;
							let itemModified = _.find (list, {EstHeader: sLargeItem});
							serviceContainer.service.markItemAsModified (itemModified);
						}
					}

					// do validation for estheader code
					if (data && data.EstHeader && data.EstHeader.Code === '9999999999999999'){
						$injector.get('estimateProjectValidationService').validateEstHeader$Code(data, data.EstHeader.Code);
					}

					serviceContainer.service.onToggleCreateButton.fire (false);

				});
			}

			let createEstimate = serviceContainer.service.createItem;
			serviceContainer.service.createItem = function () {
				serviceContainer.service.onToggleCreateButton.fire (true);
				if (isFilterActive) {
					service.getAllEstHeaderByProject ().then (function () {
						createEstHeaer ();
					});
				} else {
					createEstHeaer ();
				}
			};

			let estHeaderIdToSelect = null;
			let estProjectIdToSelect = null;
			serviceContainer.service.navigateToEstHeader = function navigateToEstHeader(estHeader) {
				let estimateTargetContainer = '29';
				let success = showTargetContainer (estimateTargetContainer);
				if (success) {
					estHeaderIdToSelect = estHeader.Id;
					estProjectIdToSelect = estHeader.ProjectFk;
					serviceContainer.service.setFilter ('projectId=' + estProjectIdToSelect);
					serviceContainer.data.doNotLoadOnSelectionChange = true;
					let execFilter = {
						ProjectContextId: estHeader.ProjectFk
					};
					cloudDesktopSidebarService.onExecuteSearchFilter.fire (null, execFilter);
					projectMainService.registerListLoaded (selectProjectOnListLoaded);
				}
			};

			function selectProjectOnListLoaded() {
				projectMainService.setSelected (projectMainService.getItemById (estProjectIdToSelect));
				projectMainService.unregisterListLoaded (selectProjectOnListLoaded);
				estProjectIdToSelect = null;
				$timeout (function () {
					serviceContainer.service.load ();
				}, 260);
			}

			service.navigateToAssembly = function navigateToProjectAssembly(entity, triggerFieldOption) {
				let success = showTargetContainer ('project.main.assembly.list', false);
				if (success) {
					let projectAssemblyMainService = $injector.get ('projectAssemblyMainService');
					projectAssemblyMainService.setNavigateId (entity[triggerFieldOption.field]);
					let projectSelected = projectMainService.getSelected ();
					if (!projectSelected || (projectSelected.Id !== triggerFieldOption.ProjectFk)) {
						searchProject (triggerFieldOption.ProjectFk);
					}
				}
			};

			service.navigateToAssemblyFromPrj = function navigateToProjectAssembly(entity, triggerFieldOption) {
				let success = showTargetContainer ('project.main.assembly.list', true);
				if (success) {
					let projectAssemblyMainService = $injector.get ('projectAssemblyMainService');
					let assembly = projectAssemblyMainService.getItemById (entity[triggerFieldOption.field]);
					if (assembly) {
						projectAssemblyMainService.setSelected (assembly);
					} else {
						projectAssemblyMainService.setNavigateId (entity[triggerFieldOption.field]);
						projectAssemblyMainService.load ();
					}
				}
			};

			service.navigateToAssemblyCategory = function navigateToAssemblyCategory(entity, triggerFieldOption) {
				let success = showTargetContainer ('project.assembly.structure', false);
				if (success) {
					let projectAssemblyStructureService = $injector.get ('projectAssemblyStructureService');
					let assemblyStructure = projectAssemblyStructureService.getItemById (entity[triggerFieldOption.field]);
					if (assemblyStructure) {
						projectAssemblyStructureService.setSelected (assemblyStructure);
					} else {
						projectAssemblyStructureService.setNavigateId (entity[triggerFieldOption.field]);
						let projectSelected = projectMainService.getSelected ();
						if (!projectSelected || (projectSelected.Id !== triggerFieldOption.ProjectFk)) {
							searchProject (triggerFieldOption.ProjectFk);
						}
					}
				}
			};

			function searchProject(projectId) {
				projectMainService.setProjectSelectedId (projectId);
				let execFilter = {
					ProjectContextId: projectId
				};
				cloudDesktopSidebarService.onExecuteSearchFilter.fire (null, execFilter);
			}

			function selectEstHeader(list) {
				if (estHeaderIdToSelect) {
					let item = _.find (list, function (item) {
						return item.PrjEstimate.EstHeaderFk === estHeaderIdToSelect;
					});
					serviceContainer.service.setSelected (item);
					estHeaderIdToSelect = serviceContainer.data.doNotLoadOnSelectionChange = null;
				}
			}

			function showTargetContainer(targetContainer, forceActiveTab) {
				let containerConfig = getTargetContainerConfig (targetContainer);
				if (containerConfig.isMatching) {
					setActiveTab (containerConfig.tabIndex, forceActiveTab);
					setActiveSubviewTab (containerConfig.pane, containerConfig.subTabIndex);
				}
				return containerConfig.isMatching;
			}

			function getTargetContainerConfig(targetContainer) {
				let containerConfig = {
					isMatching: false,
					tabIndex: -1,
					pane: null,
					subTabIndex: -1
				};
				_.some (mainViewService.getTabs (), function (tab, tabIndex) {
					if (_.isObject (tab.activeView) && _.isObject (tab.activeView.Config)) {
						let config = tab.activeView.Config;
						if (_.isArray (config.subviews)) {
							return _.some (config.subviews, function (subView) {
								if (_.isObject (subView)) {
									let content = subView.content;
									let subTabIndex = 0;
									if (_.isString (content) && targetContainer === content) {
										containerConfig.isMatching = true;
									} else if (_.isArray (content)) {
										subTabIndex = _.findIndex (content, function (item) {
											return item === targetContainer;
										});
										containerConfig.isMatching = (subTabIndex >= 0);
									}
									if (containerConfig.isMatching) {
										containerConfig.tabIndex = tabIndex;
										containerConfig.pane = subView.pane;
										containerConfig.subTabIndex = subTabIndex;
									}
								}
								return containerConfig.isMatching;
							});
						}
					}
					return false;
				});
				return containerConfig;
			}

			function setActiveTab(tabIndex, forceActiveTab) {
				if ((mainViewService.getActiveTab () !== tabIndex) || forceActiveTab) {
					mainViewService.setActiveTab (tabIndex);
				}
			}

			function setActiveSubviewTab(pane, subTabIndex) {
				if (pane) {
					mainViewService.updateSubviewTab (pane, subTabIndex);
				}
			}

			serviceContainer.service.createDeepCopy = function createDeepCopy() {
				let data = {};
				let compositePrjEst = serviceContainer.service.getSelected ();
				data.containerData = serviceContainer.data;
				data.EstimateComplete = compositePrjEst;
				data.EstHeader = data.EstimateComplete.EstHeader;
				if (!data.EstHeader) {
					return;
				}
				let estimateProjectEsttypeDialogService = $injector.get ('estimateProjectEstTypeDialogService');

				if (isFilterActive) {
					service.getAllEstHeaderByProject ().then (function () {
						data = getCreationData (data);
						estimateProjectEsttypeDialogService.showDialog (data);
					});
				} else {
					data = getCreationData (data);
					estimateProjectEsttypeDialogService.showDialog (data);
				}
			};

			let deleteDialogId = platformCreateUuid ();
			serviceContainer.service.deleteEntities = function deleteEntities(entities) {
				let platformDeleteSelectionDialogService = $injector.get ('platformDeleteSelectionDialogService');
				platformDeleteSelectionDialogService.showDialog ({
					dontShowAgain: true,
					id: deleteDialogId
				}).then (result => {
					if (result.ok || result.delete) {
						serviceContainer.data.deleteEntities (entities, serviceContainer.data);
					}
				});
			};

			let filters = [
				{
					key: 'estimate-main-lookup-filter',
					serverKey: 'rubric-category-by-rubric-company-lookup-filter',
					serverSide: true,
					fn: function () {
						return {Rubric : 18}; // Estimate Rubric is 18
					}
				}
			];

			serviceContainer.service.registerFilters = function registerFilters() {
				$injector.get ('basicsLookupdataLookupFilterService').registerFilter (filters);
			};

			serviceContainer.service.unregisterFilters = function unregisterFilters() {
				$injector.get ('basicsLookupdataLookupFilterService').unregisterFilter (filters);
			};
			serviceContainer.service.showPinningDocuments = {
				active: true,
				moduleName: 'estimate.main',
				id: 'EstHeader.Id',
				projectId: 'PrjEstimate.PrjProjectFk',
				description: 'EstHeader.DescriptionInfo.Translated'
			};

			function refreshJobLookup() {
				let jobLookupServ = $injector.get ('estimateMainJobLookupByProjectDataService');
				if (jobLookupServ) {
					jobLookupServ.resetCache ({lookupType: 'estimateMainJobLookupByProjectDataService'});
				}

				jobLookupServ = $injector.get ('logisticJobLookupByProjectDataService');
				if (jobLookupServ) {
					jobLookupServ.resetCache ({lookupType: 'logisticJobLookupByProjectDataService'});
				}
			}

			serviceContainer.service.createEstimateBackup = function (item) {
				let backupData = {};

				let headerSelected = service.getSelected ();
				let data = {},
					compositePrjEst = serviceContainer.service.getSelected ();
				backupData = getCreationData (data);

				backupData.VersionNo = item.VersionNo;
				backupData.VersionDescription = item.VersionDescription;
				backupData.VersionComment = item.VersionComment;
				backupData.JobCode = item.JobCode;
				backupData.JobDescription = item.JobDescription;

				backupData.containerData = serviceContainer.data;
				backupData.EstimateComplete = compositePrjEst;
				backupData.EstHeader = data.EstimateComplete.EstHeader;
				backupData.Code = data.EstHeader.Code;
				backupData.NewEstType = headerSelected.EstTypeFk;
				backupData.IsCopyBudget = true;
				backupData.IsCopyCostTotalToBudget = false;
				backupData.IsCopyBaseCost = false;
				backupData.DoCalculateRuleParam = false;
				backupData.SetFixUnitPrice = false;
				$http.post (globals.webApiBaseUrl + 'estimate/project/createbackup', backupData)
					.then (function (response) {
						if (!isFilterActive) {
							serviceContainer.data.handleOnCreateSucceeded (response.data, serviceContainer.data);
						}

						// set source estheader version
						if (response.data.EstHeader && headerSelected.EstHeader) {
							headerSelected.EstHeader.VersionNo = response.data.EstHeader.VersionNo + 1;
							service.markItemAsModified (headerSelected);
							projectMainService.update ();
							refreshJobLookup ();
						}
					});
			};

			serviceContainer.service.restoreEstimateByVersion = function (item) {
				let backupData = {};

				let headerSelected = service.getSelected ();
				let data = {},
					compositePrjEst = serviceContainer.service.getSelected ();
				backupData = getCreationData (data);

				backupData.JobCode = item.CurrentJob;
				backupData.JobDescription = item.CurrentJobDescription;
				backupData.VersionJob = item.VersionJob;
				backupData.VersionJobDescription = item.VersionJobDescription;

				backupData.containerData = serviceContainer.data;
				backupData.EstimateComplete = compositePrjEst;
				backupData.EstHeader = data.EstimateComplete.EstHeader;
				backupData.NewEstType = headerSelected.EstTypeFk;
				backupData.IsCopyBudget = true;
				backupData.IsCopyCostTotalToBudget = false;
				backupData.IsCopyBaseCost = false;
				backupData.DoCalculateRuleParam = false;
				backupData.SetFixUnitPrice = false;
				$http.post (globals.webApiBaseUrl + 'estimate/project/restoreestimate', backupData)
					.then (function (response) {
						serviceContainer.data.handleOnCreateSucceeded (response.data, serviceContainer.data);
						refreshJobLookup ();
						service.load ();
					});
			};

			serviceContainer.service.getFilterStatus = function getFilterStatus() {
				return isFilterActive;
			};

			serviceContainer.service.setFilterStatus = function setFilterStatus(value) {
				isFilterActive = value;
			};

			serviceContainer.service.getAllEstHeaderByProject = function getAllEstHeaderByProject() {
				let readData = {};
				readData.projectFk = projectMainService.getIfSelectedIdElse (null);
				readData.IsFilterActive = false;

				return $http.post (globals.webApiBaseUrl + 'estimate/project/list', readData)
					.then (function (response) {
						allEstHeaderOfPrj = _.map (response.data, 'EstHeader');
						return allEstHeaderOfPrj;
					});
			};

			return serviceContainer.service;
		}]);
})();
