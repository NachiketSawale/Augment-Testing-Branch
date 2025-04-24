/**
 * Created by welss on 10.06.2014.
 */
(function () {
	/* global moment globals Platform */
	'use strict';
	let moduleName = 'scheduling.main';
	let schedulingMainModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name schedulingService
	 * @function
	 *
	 * @description
	 * schedulingService is the data service for all scheduling data functions.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	schedulingMainModule.factory('schedulingMainService',
		['_', '$http', '$q', '$translate', 'platformModalFormConfigService', 'platformTranslateService', 'platformDataServiceFactory', 'schedulingLookupService', 'schedulingSchedulePresentService', 'platformDataServiceProcessDatesBySchemeExtension',
			'ServiceDataProcessArraysExtension', 'schedulingMainActivityImageProcessor', 'schedulingMainModifyActivityProcessor',
			'platformModuleNavigationService', 'platformDataServiceDataProcessorExtension', 'platformModalService', 'platformDataServiceSidebarSearchExtension',
			'schedulingLookupActivityDataService', '$injector', 'schedulingScheduleTimelinePresentService',
			'$timeout', 'projectMainPinnableEntityService', 'platformRuntimeDataService',
			'schedulingSchedulePinnableEntityService', 'schedulingProjectScheduleService', 'schedulingMainDueDateService',
			'cloudDesktopPinningContextService', 'schedulingMainHammockExtensionService',
			'basicsLookupdataLookupFilterService', 'schedulingMainConstantValues', 'schedulingMainProgressReportTempService', 'ServiceDataProcessDatesExtension', 'platformPermissionService', 'permissions', 'platformContextService',
			'platformDataServiceEntitySortExtension', 'platformDeleteSelectionDialogService', 'platformCreateUuid', 'platformDialogService', 'cloudDesktopSidebarService','platformModalGridConfigService','platformSidebarWizardConfigService',

			/* jshint -W071 */ // Parameter are needed cause of dependency injection, I am sorry J.S.Hint
			function (_, $http, $q, $translate, platformModalFormConfigService, platformTranslateService, platformDataServiceFactory, schedulingLookupService, schedulingSchedulePresentService, platformDataServiceProcessDatesBySchemeExtension,
				ServiceDataProcessArraysExtension, schedulingMainActivityImageProcessor, schedulingMainModifyActivityProcessor, naviService,
				platformDataServiceDataProcessorExtension, platformModalService, platformDataServiceSidebarSearchExtension,
				schedulingLookupActivityDataService, $injector, schedulingScheduleTimelinePresentService,
				$timeout, projectMainPinnableEntityService, platformRuntimeDataService,
				schedulingSchedulePinnableEntityService, schedulingProjectScheduleService, schedulingMainDueDateService,
				cloudDesktopPinningContextService, schedulingMainHammockExtensionService,
				basicsLookupdataLookupFilterService, schedulingMainConstantValues, schedulingMainProgressReportTempService, ServiceDataProcessDatesExtension, platformPermissionService, permissions, platformContextService,
				platformDataServiceEntitySortExtension, platformDeleteSelectionDialogService, platformCreateUuid, platformDialogService, cloudDesktopSidebarService,platformModalGridConfigService,platformSidebarWizardConfigService) {

				// private code
				let service;
				let data;
				let selectedProjectId = null;
				let selectedSchedule = null;
				let activitiesEffected = [];
				let activityPlanningChange;
				let insertActivity = false;
				let schedule2Select = null;
				let hasSchedule2Select = false;
				let updateHammockToolBar = [];
				let transientRootEntityEnabled = false;
				let isCreating = false;
				let isValidateDone = true;
				let isUpdateDone = true;
				let deleteDialogId = platformCreateUuid();
				let readOnlyFlag = false;
				let scheduleReadOnlyFlag = false;
				let activityReadOnlyFlag = false;
				let progressReadOnlyFlag = false;
				let containerRestrictFlag = false;
				let permissionLineItem = [
					'681223e37d524ce0b9bfa2294e18d650'
				];
				let permissionActivity = [schedulingMainConstantValues.uuid.container.activityList,
					schedulingMainConstantValues.uuid.container.hierarchicalList,
					schedulingMainConstantValues.uuid.container.hierarchicalGanttList,
					schedulingMainConstantValues.uuid.container.ganttList];
				let permissionArray = [
					schedulingMainConstantValues.uuid.container.relationshipPredecessorList,
					schedulingMainConstantValues.uuid.container.relationshipList,
					schedulingMainConstantValues.uuid.container.clerkList,
					schedulingMainConstantValues.uuid.container.baselinePredecessorList,
					schedulingMainConstantValues.uuid.container.baselineCmp,
					schedulingMainConstantValues.uuid.container.baselineList,
					schedulingMainConstantValues.uuid.container.baselineSuccessorList,
					schedulingMainConstantValues.uuid.container.requisitionList,
					schedulingMainConstantValues.uuid.container.progressReportList,
					schedulingMainConstantValues.uuid.container.observationList,
					schedulingMainConstantValues.uuid.container.lineItemProgressList,
					schedulingMainConstantValues.uuid.container.hammockList,
					schedulingMainConstantValues.uuid.container.eventList,
					'97a08a10b54a4d609f49ebfb8b55a3e5', // requistion list
					'184289166b0b4504abf9c7a9b1a5fe69', // Activity Line Items Type Job Estimate
					'55915f693e8a4c5883eb698542b3c10d', // Activity Resources Type Job Estimate
					'142e4cf45b4a47c887b7ce58d2b4edc0', // Activity Line Items Type Bid Estimate
					'03b05f50e57449908e53d8e1d6d75749', // Activity Resources Type Bid Estimate
					'681223e37d524ce0b9bfa2294e18d650', // LI permission
					'713b7d2a532b43948197621ba89ad67a', // Estimate header permission
					'291a21ca7ab94d549d2d0c541ec09f5d', // requisition main permission
					'2236d94d1c8f4cdd8f9ab9150492ccdb', // requisition item permission
					'6540965b6c84450aa1da41fd1c870a47', // reservation permission
					'c4f6e415194d44d49b995d4f2f4e8a69', // characteristic
					'4eaa47c530984b87853c6f2e4e4fc67e']; // documentsProject

				function getProjectFromEntityOrPinningContext(entity) {
					return (entity && entity.ProjectLongNo) ? {ProjectNo: entity.ProjectLongNo ?? entity.ProjectNo, ProjectName: entity.ProjectName, Id: entity.ProjectFk ?? -1} : selectedSchedule ? selectedSchedule.Project : null;
					// return (entity && entity.Schedule) ? entity.Schedule.Project : selectedSchedule ? selectedSchedule.Project : null;
				}

				function getScheduleFromEntityOrPinningContext(entity) {
					if (_.isNil(entity)){
						if (!_.isNil(selectedSchedule)){
							setScheduleReadonly(selectedSchedule.IsReadOnly);
						}
					} else {
						_.assign(entity.Schedule, {ScheduleFk: entity.ScheduleFk });
						setReadOnly(entity);
					}
					return (entity) ? entity.Schedule : selectedSchedule;
				}

				function takeOverRelationsShips(response) {
					if (response.RelationshipsToSave && response.RelationshipsToSave.length > 0) {
						let relServ = $injector.get('schedulingMainRelationshipService');
						relServ.takeOverRelations(response.RelationshipsToSave);
						_.forEach(response.RelationshipsToSave, function (rel) {
							service.processActivity(rel.ChildActivityFk);
						});
					}
					if (response.RelationshipsToDelete && response.RelationshipsToDelete.length > 0) {
						let relServ = $injector.get('schedulingMainRelationshipService');
						_.forEach(response.RelationshipsToDelete, function (rel) {
							relServ.removeDeletedRelationship(rel);
						});
					}
				}

				function takeOverHammocks(response) {
					if (response.HammockActivityToSave && response.HammockActivityToSave.length > 0) {
						let hamServ = $injector.get('schedulingMainHammockAllService');
						hamServ.takeOverHammocks(response.HammockActivityToSave);
					}
				}

				function takeOverEvents(response) {
					if (response.EventsToSave && response.EventsToSave.length > 0) {
						let eveServ = $injector.get('schedulingMainEventService');
						eveServ.takeOverEvents(response.EventsToSave);
					}
				}

				function takeOverAct2ModelObjects(response, hasToModified) {
					if (response.ObjModelSimulationToSave && response.ObjModelSimulationToSave.length > 0) {
						let objServ = $injector.get('schedulingMainObjectBaseSimulationDataService');
						objServ.takeOver(response.ObjModelSimulationToSave, hasToModified);
					}
				}

				// The instance of the main service - to be filled with functionality below
				let serviceContainer = null;

				let activityServiceOption = {
					hierarchicalRootItem: {
						module: schedulingMainModule,
						serviceName: 'schedulingMainService',
						entityNameTranslationID: 'scheduling.main.entityActivity',
						httpCRUD: {
							route: globals.webApiBaseUrl + 'scheduling/main/activity/',
							endRead: 'filtered',
							usePostForRead: true
						},
						dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
							typeName: 'ActivityDto',
							moduleSubModule: 'Scheduling.Main'
						}),
							new ServiceDataProcessArraysExtension(['Activities']),
							schedulingMainActivityImageProcessor,
							schedulingMainModifyActivityProcessor,
							{
								processItem: function (act) {
									if(act!==null) {
										setReadOnly(act);
									}
									if (hasSchedule2Select) {
										hasSchedule2Select = false;
										schedulingSchedulePresentService.loadSchedule(act.ScheduleFk, true).then(function () {
											schedule2Select = schedulingSchedulePresentService.getItemById(act.ScheduleFk);
											schedulingSchedulePresentService.setSelected(schedule2Select);
										});
									}
									if (act.Id === -1) {// transient root activity is complete read only
										platformRuntimeDataService.readonly(act, true);
									}
									if (act.HasReports) {
										platformRuntimeDataService.readonly(act, [{
											field: 'ProgressReportMethodFk',
											readonly: true
										}]);
									}
								}
							},
							new ServiceDataProcessDatesExtension(['Schedule.TargetStart', 'Schedule.TargetEnd'])
						],
						entitySelection: {supportsMultiSelection: true},
						presenter: {
							tree: {
								parentProp: 'ParentActivityFk',
								childProp: 'Activities',
								childSort: true,
								sortOptions: {initialSortColumn: {field: 'Code', id: 'code'}, isAsc: true},
								isInitialSorted: true,
								initCreationData: function initCreationData(creationData, data) {
									if(creationData.parentId && creationData.parentId === data.selectedItem.Id){
										creationData.parent = data.selectedItem;
									}
									let activity = creationData.parent;
									if (activity && activity.ScheduleFk) {
										creationData.scheduleId = activity.ScheduleFk;
										creationData.projectId = activity.ProjectFk;
									} else {
										creationData.scheduleId = selectedSchedule.Id;
										creationData.projectId = selectedSchedule.ProjectFk;
									}
									creationData.lastCode = '';
									if (data.selectedItem) {
										if (data.selectedItem.Id === -1) {
											creationData.parent = data.selectedItem;
											creationData.parentId = -1;
										}
										creationData.lastCode = data.selectedItem.Code;
										creationData.insertActivity = insertActivity;
									} else {
										creationData.insertActivity = false;
									}
									if (creationData.parent) {
										creationData.newHierarchy = creationData.lastCode === creationData.parent.Code;
									} else {
										creationData.parentId = null;
									}
									creationData.selectedActivity = data.selectedItem;
									insertActivity = false;
									isCreating = true;
									data.updateToolBar.fire();
								},
								incorporateDataRead: function incorporateDataRead(readItems, data) {
									let items;
									if (Object.prototype.hasOwnProperty.call(readItems, 'FilterResult')
										&& Object.prototype.hasOwnProperty.call(readItems, 'dtos')) { // must be a filtered dto
										items = readItems.dtos;
										if (data.sidebarSearch) {
											data.clearSidebarFilter(readItems, data);
										}
									} else {
										items = readItems;
									}
									data.sortByColumn(items);
									data.takeOverPinningContextSchedule(items, data);
									isValidateDone = true;
									isUpdateDone = true;
									isCreating = false;
									if (items !== null){
										let allActivities = [];
										data.flatten(items, allActivities, data.treePresOpt.childProp);
										let notUpdatedActs = _.filter(allActivities,['IsUpdatedToEstimate', false]);
										// let isNotUpdated = _.some(allActivities,['IsUpdatedToEstimate', false]);
										if (notUpdatedActs.length > 0){
											// platformDialogService.showMsgBox('scheduling.main.errorMsgNotUpdatedToEstimate', 'basics.common.modalInfo.headerTextKey', 'info');
											let modalOptions = {
												width: '700px',
												headerText$tr$: 'scheduling.main.modalInfoMessage',
												iconClass: 'ico-info',
												bodyText$tr$: 'scheduling.main.errorMsgNotUpdatedToEstimate',
												details: {
													type: 'grid',
													options: {
														id: platformCreateUuid(),
														columns: [{
															id: 'Code',
															field: 'Code',
															name: 'Code',
															width: 180,
															formatter: 'code',
															name$tr$: 'cloud.common.entityCode'
														},
															{
																id: 'Description',
																field: 'Description',
																name: 'Description',
																width: 300,
																formatter: 'description',
																name$tr$: 'cloud.common.entityDescription'
															}],
														options: {
															idProperty: 'Code'
														}
													},
													value: notUpdatedActs
												}
											};
											platformDialogService.showDetailMsgBox(modalOptions);
										}
										let progressUpdatedToEstimateActs = _.filter(allActivities,['IsProgressUpdatedToEstimate', true]);
										if (progressUpdatedToEstimateActs.length > 0){
											// platformDialogService.showMsgBox('scheduling.main.errorMsgNotUpdatedToEstimate', 'basics.common.modalInfo.headerTextKey', 'info');
											let modalOptions = {
												width: '700px',
												headerText$tr$: 'scheduling.main.modalInfoMessage',
												iconClass: 'ico-info',
												bodyText$tr$: 'scheduling.main.errorMsgProgressAddedToUpdatedToEstimate',
												details: {
													type: 'grid',
													options: {
														id: platformCreateUuid(),
														columns: [{
															id: 'Code',
															field: 'Code',
															name: 'Code',
															width: 180,
															formatter: 'code',
															name$tr$: 'cloud.common.entityCode'
														},
															{
																id: 'Description',
																field: 'Description',
																name: 'Description',
																width: 300,
																formatter: 'description',
																name$tr$: 'cloud.common.entityDescription'
															}],
														options: {
															idProperty: 'Code'
														}
													},
													value: progressUpdatedToEstimateActs
												}
											};
											platformDialogService.showDetailMsgBox(modalOptions);
										}									}
									return data.handleReadSucceeded(items, data);
								},
								handleCreateSucceeded: function handleCreateSucceeded(newItem /* , data */) {
									let valServ = $injector.get('schedulingMainActivityValidationService');
									valServ.validateCode(newItem, newItem.Code, 'Code');
									isCreating = false;

									if (newItem.ParentActivityFk && _.isNumber(newItem.ParentActivityFk)) {
										let serv = $injector.get('schedulingMainRelationshipService');
										serv.removeLinksToNewSummary(newItem.ParentActivityFk);

										let parent = data.getItemById(newItem.ParentActivityFk, data);
										if (parent && parent.ActivityTypeFk !== 2) {
											isValidateDone = false;
											if (parent.ActivityTypeFk === 1) {
												parent.ActivityTypeFk = 2;
												schedulingMainActivityImageProcessor.processItem(parent);
											}
											validationHelperForMakeSummary(newItem, parent, -1);
										}
									}
									return newItem;
								}
							}
						},
						entityRole: {
							root: {
								itemName: 'Activities',
								moduleName: 'cloud.desktop.moduleDisplayNameSchedulingMain',
								addToLastObject: true,
								lastObjectModuleName: moduleName,
								handleUpdateDone: function (updateData, response, data) {
									let param = {first: null};
									_.forEach(response.Activities, function (item) {
										let treeInfo;
										let oldItem = _.find(data.itemList, {Id: item.Id});
										if (oldItem) {
											treeInfo = {};
											if (data.saveItemChildInfo) {
												data.saveItemChildInfo(oldItem, treeInfo, data);
											}

											platformDataServiceDataProcessorExtension.doProcessItem(oldItem, data);
											platformDataServiceDataProcessorExtension.doProcessItem(item, data);
											angular.extend(oldItem, item);

											if (treeInfo.hasChildren) {
												data.reestablishItemChildInfo(oldItem, treeInfo, data);
											}
										} else {
											platformDataServiceDataProcessorExtension.doProcessItem(item, data);
											activitiesEffected.push(item);
										}
									});

									if (updateData.PostProcess && updateData.PostProcess.Action === 2 /* SchedulingAction splitActivityByLocation */) {
										// Location wizard:
										_.forEach(response.Activities, function (activity) {
											encorporateNewChildrenOfSplittedActivity(activity, param, data);
										});
									}

									if (updateData.PostProcess && updateData.PostProcess.Action === 8 /* SchedulingAction createRelationshipComplete */) {
										_.forEach(response.Activities, function (activity) {
											data.markItemAsModified(activity, data);
										});
									}

									service.calculateActivities(null, response);

									removeDeletedPredecessorSuccessor(updateData); // 104999 addition

									takeOverRelationsShips(response);
									takeOverHammocks(response);
									takeOverAct2ModelObjects(response);

									if (response.RelationshipsToDelete && response.RelationshipsToDelete.length > 0) {
										_.forEach(response.RelationshipsToDelete, function (rel) {
											service.processActivity(rel.ChildActivityFk);
										});
									}

									data.handleOnUpdateSucceeded(updateData, response, data, true);

									if (!response.Valid) {
										platformDialogService.showMsgBox(response.ValidationError, 'scheduling.main.modalInfoMessage', 'info');
									}
									let mainActivityEntity;
									angular.forEach(response.Activities, function (activity) {
										if (activity.Id === response.MainItemId) {
											mainActivityEntity = activity;
										}
									});

									if (mainActivityEntity && mainActivityEntity.ActivityTypeFk === 5) {
										let schedulingMainRelationshipService = $injector.get('schedulingMainRelationshipService');
										let schedulingMainSuccessorRelationshipDataService = $injector.get('schedulingMainSuccessorRelationshipDataService');
										let schedulingMainHammockAllService = $injector.get('schedulingMainHammockAllService');
										schedulingMainHammockAllService.removeLinksToNewHammock(response.MainItemId);
										// schedulingMainSuccessorRelationshipDataService.deleteEntitiesAndUpdateUi(response.RelationshipsToDelete);
										schedulingMainRelationshipService.removeLinksToNewSummary(response.MainItemId);
										schedulingMainSuccessorRelationshipDataService.deleteEntitiesAndUpdateUi(response.RelationshipsToDelete);
									}
									if (param.first !== null) {
										response.Activities[0].nodeInfo = {children: true, collapsed: false};
										if (!response.Activities[0].ParentActivityFk) {
											response.Activities[0].nodeInfo.level = 0;
										} else {
											let activities = service.getList();
											let oldParent = _.find(activities, {Id: response.Activities[0].ParentActivityFk});
											response.Activities[0].nodeInfo.level = oldParent.nodeInfo.level + 1;
										}
										data.listLoaded.fire();
									}
									isUpdateDone = true;
									data.updateToolBar.fire();
									schedulingLookupActivityDataService.resetCache({lookupType: 'schedulingLookupActivityDataService'});
									if (updateData.BelongsToActivityEstLineItemDtoToDelete || updateData.BelongsToActivityEstLineItemDtoToSave) {
										data.updateResource.fire();
									}
								},
								showProjectHeader: {
									getProject: function (entity) {
										return getProjectFromEntityOrPinningContext(entity);
									},
									getHeaderEntity: function (entity) {
										return getScheduleFromEntityOrPinningContext(entity);
									},
									getHeaderOptions: function () {
										return {codeField: 'Code', descField: 'DescriptionInfo.Translated', idField: 'ScheduleFk'};
									}
								},
								mergeAffectedItems: function mergeAffectedItems(response, data) {
									platformDataServiceDataProcessorExtension.doProcessData(response, data);
									service.takeOverActivities(response);
								},
								collaborationContextProvider: function () {
									if (serviceContainer) {
										const selectedItem = serviceContainer.service.getSelected();
										return {
											area: 'scheduling.main',
											context: selectedItem ? `${selectedItem.ScheduleFk}` : ''
										};
									}
								}
							}
						},
						sidebarSearch: {
							options: {
								moduleName: moduleName,
								enhancedSearchEnabled: true,
								enhancedSearchVersion: '2.0',
								useIdentification: true,
								includeDateSearch: false,
								pattern: '',
								pageSize: 10000,
								useCurrentClient: null,
								includeNonActiveItems: false,
								showOptions: true,
								showProjectContext: false, // TODO: rei remove it
								pinningOptions: {
									isActive: true,
									showPinningContext: [{token: 'project.main', show: true}, {
										token: 'scheduling.main',
										show: true
									}],
									setContextCallback: setCurrentPinningContext // may own context service
								},
								withExecutionHints: false
							},
							http: {endPointRead: 'filtered'}
						},
						sidebarWatchList: {active: true},  // @7.12.2015 enable watchlist support for this module
						filterByViewer: true
					}
				};

				serviceContainer = platformDataServiceFactory.createNewComplete(activityServiceOption); // jshint ignore:line
				service = serviceContainer.service;
				data = serviceContainer.data;
				data.fireSelectionChangedEventAlways = false;
				data.hasToReduceTreeStructures = true;
				data.updateToolBar = new Platform.Messenger();
				data.updateResource = new Platform.Messenger();
				data.dropped = new Platform.Messenger();

				service.deleteItem = function deleteItem(entity){
					return $http.post(globals.webApiBaseUrl + 'scheduling/main/activity/canbedeleted',[entity]).then(function (response) {
						if (response && response.data) {
							if (response.data.canBeDeleted) {
								platformDeleteSelectionDialogService.showDialog({dontShowAgain: true, id: deleteDialogId}).then(result => {
									if (result.ok || result.delete) {
										data.deleteItem(entity, data);
									}
								});
							} else {
								platformDialogService.showMsgBox(response.data.errorMsg, 'scheduling.main.infoDeleteActivity', 'info');
							}
						}
					});
				};
				service.deleteEntities = function deleteEntities(entities){
					return $http.post(globals.webApiBaseUrl + 'scheduling/main/activity/canbedeleted',entities).then(function (response) {
						if (response && response.data){
							if (response.data.canBeDeleted) {
								platformDeleteSelectionDialogService.showDialog({dontShowAgain: true, id: deleteDialogId}).then(result => {
									if (result.ok || result.delete) {
										data.deleteEntities(entities, data);
									}
								});
							} else {
								let modalOptions = {
									width: '700px',
									headerText$tr$: 'scheduling.main.infoDeleteActivity',
									iconClass: 'ico-info',
									bodyText$tr$: 'scheduling.main.infoDeleteBody',
									details: {
										type: 'grid',
										options: {
											id: platformCreateUuid(),
											columns: [{ id: 'Code', field: 'Code', name: 'Code', width: 180, formatter: 'code', name$tr$: 'cloud.common.entityCode' },
												{ id: 'Description', field: 'Description', name: 'Description', width: 300, formatter: 'description', name$tr$: 'cloud.common.entityDescription' }],
											options: {
												idProperty: 'Code'
											}
										},
										value: response.data.errorMsg
									}
								};

								platformDialogService.showDetailMsgBox(modalOptions).then(
									function (result) {
										if (result.ok) {
											console.log(result.value);
										}
									}
								);
								// platformDialogService.showMsgBox( response.data.errorMsg,  'scheduling.main.infoDeleteActivity', 'info');
							}
						}
					});
				};

				service.registerUpdateToolBar = function registerUpdateToolBar(callBackFn) {
					data.updateToolBar.register(callBackFn);
				};

				service.unregisterUpdateToolBar = function unregisterUpdateToolBar(callBackFn) {
					data.updateToolBar.unregister(callBackFn);
				};

				service.registerUpdateResource = function registerUpdateToolBar(callBackFn) {
					data.updateResource.register(callBackFn);
				};

				service.unregisterUpdateResource = function unregisterUpdateToolBar(callBackFn) {
					data.updateResource.unregister(callBackFn);
				};

				service.registerDropped = function registerUpdateToolBar(callBackFn) {
					data.dropped.register(callBackFn);
				};

				service.unregisterDropped = function unregisterUpdateToolBar(callBackFn) {
					data.dropped.unregister(callBackFn);
				};

				service.doPrepareUpdateCall = function doPrepareUpdateCall(updateData) {
					// Check all unsaved records of progress report and remove duplicate PerformanceDate before save to avoid miscalculation
					if(updateData.ProgressReportsToSave){
						let tmpArray = [];
						for (let i=updateData.ProgressReportsToSave.length-1; i>=0; i--)
						{
							let exists = false;
							_.forEach(tmpArray, function (val2) {
								if(angular.equals(updateData.ProgressReportsToSave[i].PerformanceDate, val2.PerformanceDate) && angular.equals(updateData.ProgressReportsToSave[i].EstLineItemFk, val2.EstLineItemFk)){
									exists = true;
								}
							});
							if(exists === false && updateData.ProgressReportsToSave[i] !== '') {
								tmpArray.push(updateData.ProgressReportsToSave[i]);
							}
						}
						if(tmpArray.length > 0){
							updateData.ProgressReportsToSave = tmpArray;
						}
					}


					if (updateData && updateData.ActivityPlanningChange && updateData.ActivityPlanningChange.Id && updateData.MainItemId !== updateData.ActivityPlanningChange.Id) {
						updateData.MainItemId = updateData.ActivityPlanningChange.Id;
					}

					schedulingMainProgressReportTempService.handleOutReportsForActivity(updateData);
					if (updateData.ProgressReportsToSave && updateData.ProgressReportsToSave.length > 0 && updateData.ActivityPlanningChange){
						updateData.ActivityPlanningChange.CalculationNeeded = true;
					}
				};


				service.getFilterData = function () {
					return data.filter;
				};

				schedulingMainHammockExtensionService.addHammockRefreshDateFieldServersideLogic(serviceContainer, activityServiceOption);

				/*
                                data.processNewParent = function processNewSummaryActivity(newParent) {
                                    if (newParent.ActivityTypeFk === 1) {
                                        newParent.ActivityTypeFk = 2;
                                        schedulingMainActivityImageProcessor.processItem(newParent);
                                    }
                                };
                */

				data.takeOverPinningContextSchedule = function takeOverPinningContextSchedule(items) {
					if (!selectedSchedule && items && items.length > 0) {
						let cloudDesktopPinningContextService = $injector.get('cloudDesktopPinningContextService');
						let context = cloudDesktopPinningContextService.getPinningItem('scheduling.main');

						if (context && context.id === items[0].ScheduleFk) {
							schedulingSchedulePresentService.asPinnedSchedule(items[0].Schedule);
							service.setSelectedSchedule(items[0].Schedule);
						}
					}
				};

				function addActivityToEffected(activity) {
					if (activitiesEffected) {
						if (activitiesEffected.length > 0) {
							let act = _.find(activitiesEffected, {Id: activity.Id});
							if (act) {
								angular.extend(act, activity);
								return;
							}
						}
						activitiesEffected.push(activity);
					}
				}

				data.handleOnDeleteSucceeded = function handleOnDeleteSucceeded(deleteParams) {
					isCreating = false;
					let hammocks = _.filter(deleteParams.Entities, function (act) {
						return act.HasHammock;
					});
					if (hammocks.length >= 1) {
						let hamServ = $injector.get('schedulingMainHammockAllService');
						hamServ.removeDeletedEntitiesFromDataItemList(hammocks);
					}
					let items = _.filter(deleteParams.entities, function (act) {
						return act.Version === 0;
					});
					if (items && items.length > 0/* && activityPlanningChange && activityPlanningChange.ChangedField === 'MakeParentSummary' */) {
						// if(activityPlanningChange && activityPlanningChange.ChangedField === 'MakeParentSummary') {
						// activityPlanningChange = null;
						// }
						_.forEach(items, function (item) {
							// if(activityPlanningChange.Id === item.Id) {
							if (item.ParentActivityFk) {
								let parent = data.getItemById(item.ParentActivityFk, data);
								// service.upgradeActivity(item);
								if (parent) {
									let oldPos = _.indexOf(parent.Activities, item);
									if (parent.Activities.length === 0) {
										parent.ActivityTypeFk = 1;
										parent.nodeInfo.children = false;
										parent.nodeInfo.collapsed = true;
										parent.HasChildren = false;
									}
									if (oldPos !== parent.Activities.length) {
										parent.nodeInfo.collapsed = true;
									}
									addActivityToEffected(parent);
									platformDataServiceDataProcessorExtension.doProcessItem(parent, data);
									data.itemModified.fire(null, parent);
									if (oldPos !== parent.Activities.length) {
										serviceContainer.data.sortByColumn(serviceContainer.data.itemTree);
										serviceContainer.data.listLoaded.fire();
									}
								}
							}
							// }
						});
					}
				};

				/**
				 * function setScheduleToPinnningContext
				 * set pinningContext from a scheduleItem
				 * we set the pinningContext from a scheduleItem,
				 * Context will have set the projectId and scheduleId with corresponding info
				 *
				 * @param scheduleItem
				 * @returns {*}
				 */
				function setScheduleToPinnningContext(scheduleItem) {
					if (scheduleItem) {
						let ids = {};
						schedulingSchedulePinnableEntityService.appendId(ids, scheduleItem.Id);
						projectMainPinnableEntityService.appendId(ids, scheduleItem.ProjectFk);
						return schedulingSchedulePinnableEntityService.pin(ids, serviceContainer.service).then(function () {
							return true;
						});
					} else {
						return $q.when(false);
					}
				}

				/**
				 * function setCurrentPinningContext set the pinning context
				 *
				 * first read current selected item and read schedule item.
				 * sets the projectid of the schedule and the scheduleid into the pinning conte
				 * xt
				 * @param {object} dataService
				 * @returns {*}
				 */
				function setCurrentPinningContext(dataService) {
					let currentItem = dataService.getSelected();
					if (currentItem && angular.isNumber(currentItem.ScheduleFk)) {
						schedulingSchedulePresentService.loadSchedule(currentItem.ScheduleFk, true).then(function () {
							let scheduleItem = schedulingSchedulePresentService.getItemById(currentItem.ScheduleFk);
							schedulingSchedulePresentService.setSelected(scheduleItem);
							setScheduleToPinnningContext(scheduleItem);
						});
					}

				}

				data.getDataServiceForSearchedTable = function getDataServiceForSearchedTable(filter) {
					let furfil = _.isArray(filter.furtherFilters) ? filter.furtherFilters[0] : filter.furtherFilters;

					if (furfil && furfil.Token === 'PSD_SCHEDULE') {
						schedulingSchedulePresentService.loadSchedule(furfil.Value, true).then(function () {
							let item = schedulingSchedulePresentService.getItemById(furfil.Value);
							schedulingSchedulePresentService.setSelected(item);
							setScheduleToPinnningContext(item);  // put projectid and scheduleid into the pinningContext
						});
					}

					if (filter && filter.furtherFilters) {
						// rei@29.2.16 if scheduling was triggered by api via navInfo we extend the filter with the Token='PSD_SCHEDULE', because the id indicate a schedule
						if (filter.furtherFilters.navInfo) {
							let navInfo = filter.furtherFilters.navInfo;
							if (navInfo.id) {
								filter.furtherFilters = [{Token: 'PSD_SCHEDULE', Value: navInfo.id}];
								filter.PKeys = null;
								filter.furtherFilters.navInfo = null;
							} else if (_.isString(navInfo.search)) { // support code as filter as well, search pattern stands for the code value
								filter.furtherFilters = [
									{Token: 'PSD_SCHEDULE.CODE', Value: navInfo.search},
									{Token: 'PSD_SCHEDULE.PROJECTNO', Value: navInfo.project}];
								filter.furtherFilters.navInfo = null;
								filter.Pattern = null;
								filter.UseCurrentClient = true; // search within current client only, rei@ 7.9 changed to pascal case.

								hasSchedule2Select = true;
							}
						}
					}

					return undefined;
				};

				data.provideUpdateData = function provideSchedulingUpdateData(updateData) {
					if (activityPlanningChange) {
						updateData.ActivityPlanningChange = activityPlanningChange;
					} else if (schedulingMainDueDateService.hasDueDate()) {
						updateData.ActivityPlanningChange = {
							DueDate: schedulingMainDueDateService.getPerformanceDueDateAsString()
						};
					}

					if (activitiesEffected && activitiesEffected.length > 0) {
						if (activityPlanningChange && activityPlanningChange.ChangedField && activityPlanningChange.ChangedField === 'MakeParentSummary' && updateData.MainItemId === activityPlanningChange.Id) {
							let exist = _.find(data.itemList, {Id: activityPlanningChange.Id});
							if (_.isNil(exist)) {
								updateData.ActivityPlanningChange = {
									DueDate: schedulingMainDueDateService.getPerformanceDueDateAsString()
								};
								updateData.MainItemId = activitiesEffected[0].Id;
								// return;
							}
						}
						updateData.Activities = updateData.Activities || [];

						_.forEach(activitiesEffected, function (act) {
							updateData.Activities.push(act);
						});

						updateData.EntitiesCount += activitiesEffected.length;
						activitiesEffected.length = 0;
						isUpdateDone = false;
					}

					if (data.postProcess) {
						updateData.PostProcess = data.postProcess;
						updateData.EntitiesCount += 1;
					}
					activityPlanningChange = null;
				};

				let checkHasStillSameChildData = data.hasStillSameChildData;
				data.hasStillSameChildData = function scheduleStillSameChildData(updateData, data) {
					return updateData.RelationshipsToSave || updateData.EventsToSave || checkHasStillSameChildData(updateData, data);
				};

				function encorporateNewChildrenOfSplittedActivity(activity, param, data) {
					if (param.first === null) {
						param.first = activity;
					}
					platformDataServiceDataProcessorExtension.doProcessItem(activity, data);
					let oldItem = _.find(data.itemList, {Id: activity.Id});
					if (oldItem) {
						angular.extend(oldItem, activity);
					} else {
						data.itemList.push(activity);
					}
					data.iterateHierachy(activity, encorporateNewChildrenOfSplittedActivity, param, data);
				}

				// define messengers here
				service.selectedScheduleChanged = new Platform.Messenger();
				service.selectedProjectChanged = new Platform.Messenger();

				service.registerSelectedProjectChanged = function registerSelectedProjectChanged(callBackFn) {
					service.selectedProjectChanged.register(callBackFn);
				};

				service.unregisterSelectedProjectChanged = function unregisterSelectedProjectChanged(callBackFn) {
					service.selectedProjectChanged.unregister(callBackFn);
				};

				service.getEffectedActivities = function getEffectedActivities() {
					return activitiesEffected;
				};

				// schedule service calls
				service.setSelectedSchedule = function setSelectedSchedule(schedule, activityIdToSelect) {
					selectedSchedule = schedule;
					service.selectedScheduleChanged.fire(selectedSchedule);

					if (schedule) {
						schedulingScheduleTimelinePresentService.setFilter('mainItemID=' + selectedSchedule.Id);
						schedulingScheduleTimelinePresentService.load();

						if (selectedProjectId !== schedule.ProjectFk) {
							selectedProjectId = schedule.ProjectFk;
							service.selectedProjectChanged.fire(selectedProjectId);
						}
					} else if (selectedProjectId !== null) {
						selectedProjectId = null;
						service.selectedProjectChanged.fire(selectedProjectId);
					}

					if(activityIdToSelect) {
						let item2Select = service.getItemById(activityIdToSelect);
						if (item2Select) {
							service.setSelected(item2Select);
						}
					}

					data.showHeaderAfterSelectionChanged(null);
				};

				service.getSelectedSchedule = function getSelectedSchedule() {
					return selectedSchedule;
				};

				service.getSelectedProjectId = function getSelectedProjectId() {
					return selectedProjectId;
				};

				service.getSelectedProject = function getSelectedProject() {
					let result = null;
					let act = null;
					if (selectedProjectId) {
						act = _.find(data.itemList, function (act) {
							return act.ProjectFk === selectedProjectId;
						});
					} else if (data.itemList.length >= 1) {
						act = data.itemList[0];
					}
					// if (act && act.Schedule && act.Schedule.Project) {
					// 	result = act.Schedule.Project;
					// }
					if (act && act.Schedule && act.Schedule.Project) {
						result = {ProjectNo: act.ProjectNo, ProjectName: act.ProjectName, ProjectName2: act.ProjectName2, Id: act.ProjectId};
					}

					return result;
				};

				service.canCreate = function canCreate() {
					let context = cloudDesktopPinningContextService.getContext();
					let findPinning = _.findIndex(context, {'token': 'scheduling.main'});
					return !isCreating && isValidateDone && isUpdateDone && !!context && findPinning !== -1 && !service.isCurrentTransientRoot();

				};

				service.isCurrentTransientRoot = function isCurrentTransientRoot() {
					let selectedItem = service.getSelected();
					return (selectedItem && selectedItem.Id === schedulingMainConstantValues.activity.transientRootEntityId);
				};

				function canCreateChildOn(activity) {
					return !isCreating && isValidateDone && isUpdateDone && !!activity && (activity.ActivityTypeFk === 2 || !activity.IsAssignedToEstimate) && !activity.HasHammock && activity.ActivityTypeFk !== 4;
				}

				service.canCreateChild = function checkIfCanCreateChildOfEntity() {
					let activity = service.getSelected();
					if(activity!==null && activity.IsReadOnly===true) {
						return false;
					}
					return canCreateChildOn(activity);
				};

				service.canCreateCopy = function () {
					let activity = service.getSelected();
					if(activity!==null) {
						if(activity.Version === 0)
						{
							return false;
						}
					}
					return service.getSelected().ActivityTypeFk !== schedulingMainConstantValues.activity.transientRootActivityTypeFk;
				};

				service.canDelete = function canDelete() {
					let res = (data.itemList.length > 0);
					if (res) {
						let item = service.getSelected();
						if(item!==null && item.IsReadOnly===true)
						{
							return false;
						}
						res = service.isSelection(item);
					}
					return !isCreating && isValidateDone && isUpdateDone && res;
				};

				service.reload = function reload() {
					service.refresh();
					activitiesEffected = [];
					activityPlanningChange = null;
					isValidateDone = true;
					isUpdateDone = true;
					isCreating = false;
				};

				// toolbar
				service.toolbarEnabled = function toolbarEnabled() {
					let activity = service.getSelected();
					if (_.isEmpty(activity) === true) {
						return true;
					}

					return !(activity.ActivityTypeFk === 1 || activity.ActivityTypeFk === 3 || (activity.ActivityTypeFk === 4 && activity.ScheduleSubFk === null) || (activity.ActivityTypeFk === 5 && !activity.HasHammock));

				};

				// change Activity type
				service.changeActivityType = function changeActivityType() {
					let activities, fire, parameter;
					let activity = service.getSelected();
					if (activity && activity.ActivityTypeFk === 1 || activity.ActivityTypeFk === 3 || activity.ActivityTypeFk === 4 || activity.ActivityTypeFk === 5) {
						if (activity.ActivityTypeFk === 1) {
							if (activity.PlannedDuration === 1) {
								activity.PlannedDuration = 0;
								activity.CurrentDuration = 0;
								parameter = {
									Id: activity.Id,
									Duration: 0
								};
							}
							activity.ActivityTypeFk = 3;
						} else if (activity.ActivityTypeFk === 3 && !activity.IsAssignedToHammock) {
							if (activity.PlannedDuration === 0) {
								activity.PlannedDuration = 1;
								activity.CurrentDuration = 1;
								parameter = {
									Id: activity.Id,
									Duration: 1
								};
							}
							activity.ActivityTypeFk = 5;
							// var schedulingMainSuccessorRelationshipDataService = $injector.get('schedulingMainSuccessorRelationshipDataService');
							// schedulingMainSuccessorRelationshipDataService.clearList();
							// updateHammockToolBar();
						} else if (activity.ActivityTypeFk === 5 && activity.Schedule.ScheduleMasterFk === null) {
							activity.ActivityTypeFk = 4;
							data.updateToolBar.fire();
						} else if (activity.ActivityTypeFk === 5 && activity.Schedule.ScheduleMasterFk !== null) {
							activity.ActivityTypeFk = 1;
						} else if (activity.ActivityTypeFk === 4 && activity.Schedule.ScheduleMasterFk === null) {
							activity.ActivityTypeFk = 1;
							data.updateToolBar.fire();
						} else if (activity.IsAssignedToHammock && activity.ActivityTypeFk === 3) {
							if (activity.PlannedDuration === 0) {
								activity.PlannedDuration = 1;
							}
							activity.ActivityTypeFk = 1;
						}

						if (!_.isUndefined(parameter) && !_.isNil(parameter)) {
							if (activityPlanningChange === null || activityPlanningChange === undefined) {
								activityPlanningChange = {};
							}
							mergePlanningChange(activityPlanningChange, parameter);
						}

						fire = false;
						activities = service.getList();
						angular.forEach(activities, function (item) {
							if (item.Id === activity.Id) {
								item.ActivityTypeFk = activity.ActivityTypeFk;
								platformDataServiceDataProcessorExtension.doProcessItem(item, data);

								fire = true;
								data.markItemAsModified(item, data);
							}
						});
						if (fire) {
							data.dataModified.fire();
						}
						service.doCallBackOnChangeActivityType();
					}
				};

				service.doCallBackOnChangeActivityType = function doCallBackOnChangeActivityType() {
					if (updateHammockToolBar.length > 0) {
						angular.forEach(updateHammockToolBar, function (method) {
							method();
						});
					}
				};

				service.registerSelectionChanged(function (e, selectedItem) {
					if(selectedItem){
						// setReadOnly(selectedItem);
						setContainerReadOnly(selectedItem);
					}
				});
				service.registerDataModified (function (){
					var selected = service.getSelected();
					if(selected){
						setContainerReadOnly(selected);
					}
				});

				function setContainerRestrict(flag){
					if(flag=== containerRestrictFlag){
						return;
					}
					if (_.isNil(flag) || !flag){
						setTimeout(function () {
							platformPermissionService.restrict([permissionLineItem], false);
						}, 0);
					} else {
						setTimeout(function () {
							platformPermissionService.restrict([permissionLineItem], permissions.read);
						}, 0);
					}
					containerRestrictFlag = flag;
				}

				function setScheduleReadonly(flag){
					if (flag === scheduleReadOnlyFlag){
						return;
					}
					if (_.isNil(flag) || !flag){
						flag = false;
						platformPermissionService.restrict(
							[permissionArray.concat(permissionActivity)], false);
					} else {
						platformPermissionService.restrict(
							[permissionArray.concat(permissionActivity)], permissions.read);
					}
					scheduleReadOnlyFlag = flag;
				}
				function setReadOnly(selectedItem){
					if(selectedItem.DurationEstimationIsReadOnly)
					{
						platformRuntimeDataService.readonly(selectedItem, [{
							field: 'IsDurationEstimationDriven',
							readonly: true
						}]);
					}
					if (selectedItem !== null && selectedItem.IsReadOnly){
						let fields = [];
						let readOnlyFlag = !!selectedItem.IsReadOnly;
						fields.push({field: 'Code', readonly: readOnlyFlag});
						fields.push({field: 'Description', readonly: readOnlyFlag});
						fields.push({field: 'QuantityUoMFk', readonly: readOnlyFlag});
						fields.push({field: 'Productivity', readonly: readOnlyFlag});
						fields.push({field: 'ChartPresentationFk', readonly: readOnlyFlag});
						fields.push({field: 'CalendarFk', readonly: readOnlyFlag});
						fields.push({field: 'SCurveFk', readonly: readOnlyFlag});
						fields.push({field: 'PrcStructureFk', readonly: readOnlyFlag});
						fields.push({field: 'Bas3dVisualizationTypeFk', readonly: readOnlyFlag});
						fields.push({field: 'PlannedStart', readonly: readOnlyFlag});
						fields.push({field: 'Quantity', readonly: readOnlyFlag});
						fields.push({field: 'ActivityTemplateFk', readonly: readOnlyFlag});
						fields.push({field: 'PlannedFinish', readonly: readOnlyFlag});
						fields.push({field: 'PlannedDuration', readonly: readOnlyFlag});
						fields.push({field: 'ControllingUnitFk', readonly: readOnlyFlag});
						fields.push({field: 'PlannedDuration', readonly: readOnlyFlag});
						fields.push({field: 'AddressFk', readonly: readOnlyFlag});
						fields.push({field: 'SchedulingMethodFk', readonly: readOnlyFlag});
						fields.push({field: 'TaskTypeFk', readonly: readOnlyFlag});
						fields.push({field: 'IsQuantityEvaluated', readonly: readOnlyFlag});
						fields.push({field: 'Specification', readonly: readOnlyFlag});
						fields.push({field: 'Note', readonly: readOnlyFlag});
						fields.push({field: 'ProjectReleaseFk', readonly: readOnlyFlag});
						fields.push({field: 'ScheduleSubFk', readonly: readOnlyFlag});
						fields.push({field: 'constraintGroup', readonly: readOnlyFlag});
						fields.push({field: 'ActualStart', readonly: readOnlyFlag});
						fields.push({field: 'ActualFinish', readonly: readOnlyFlag});
						fields.push({field: 'ExecutionStarted', readonly: readOnlyFlag});
						fields.push({field: 'ExecutionFinished', readonly: readOnlyFlag});
						fields.push({field: 'PercentageCompletion', readonly: readOnlyFlag});
						fields.push({field: 'performanceMeasurementGroup', readonly: readOnlyFlag});
						fields.push({field: 'RemainingQuantity', readonly: readOnlyFlag});
						fields.push({field: 'RemainingWork', readonly: readOnlyFlag});
						fields.push({field: 'ProgressReportMethodFk', readonly: readOnlyFlag});
						fields.push({field: 'Perf2UoMFk', readonly: readOnlyFlag});
						fields.push({field: 'Perf1UoMFk', readonly: readOnlyFlag});
						fields.push({field: 'UserDefinedText01', readonly: readOnlyFlag});
						fields.push({field: 'UserDefinedText02', readonly: readOnlyFlag});
						fields.push({field: 'UserDefinedText03', readonly: readOnlyFlag});
						fields.push({field: 'UserDefinedText04', readonly: readOnlyFlag});
						fields.push({field: 'UserDefinedText05', readonly: readOnlyFlag});
						fields.push({field: 'UserDefinedText06', readonly: readOnlyFlag});
						fields.push({field: 'UserDefinedText07', readonly: readOnlyFlag});
						fields.push({field: 'UserDefinedText08', readonly: readOnlyFlag});
						fields.push({field: 'UserDefinedText09', readonly: readOnlyFlag});
						fields.push({field: 'UserDefinedText10', readonly: readOnlyFlag});
						fields.push({field: 'UserDefinedNumber01', readonly: readOnlyFlag});
						fields.push({field: 'UserDefinedNumber02', readonly: readOnlyFlag});
						fields.push({field: 'UserDefinedNumber03', readonly: readOnlyFlag});
						fields.push({field: 'UserDefinedNumber04', readonly: readOnlyFlag});
						fields.push({field: 'UserDefinedNumber05', readonly: readOnlyFlag});
						fields.push({field: 'UserDefinedNumber06', readonly: readOnlyFlag});
						fields.push({field: 'UserDefinedNumber07', readonly: readOnlyFlag});
						fields.push({field: 'UserDefinedNumber08', readonly: readOnlyFlag});
						fields.push({field: 'UserDefinedNumber09', readonly: readOnlyFlag});
						fields.push({field: 'UserDefinedNumber10', readonly: readOnlyFlag});
						fields.push({field: 'UserDefinedDate01', readonly: readOnlyFlag});
						fields.push({field: 'UserDefinedDate02', readonly: readOnlyFlag});
						fields.push({field: 'UserDefinedDate03', readonly: readOnlyFlag});
						fields.push({field: 'UserDefinedDate04', readonly: readOnlyFlag});
						fields.push({field: 'UserDefinedDate05', readonly: readOnlyFlag});
						fields.push({field: 'UserDefinedDate06', readonly: readOnlyFlag});
						fields.push({field: 'UserDefinedDate07', readonly: readOnlyFlag});
						fields.push({field: 'UserDefinedDate08', readonly: readOnlyFlag});
						fields.push({field: 'UserDefinedDate09', readonly: readOnlyFlag});
						fields.push({field: 'UserDefinedDate10', readonly: readOnlyFlag});
						fields.push({field: 'LocationFk', readonly: readOnlyFlag});
						fields.push({field: 'ActivityPresentationFk', readonly: readOnlyFlag});
						fields.push({field: 'LocationSpecification', readonly: readOnlyFlag});
						fields.push({field: 'LobLabelPlacementFk', readonly: readOnlyFlag});
						fields.push({field: 'ConstraintTypeFk', readonly: readOnlyFlag});
						fields.push({field: 'Work', readonly: readOnlyFlag});
						fields.push({field: 'DueDateQuantityPerformance', readonly: readOnlyFlag});
						fields.push({field: 'PeriodQuantityPerformance', readonly: readOnlyFlag});
						fields.push({field: 'RemainingLineItemQuantity', readonly: readOnlyFlag});
						fields.push({field: 'RemainingActivityWork', readonly: readOnlyFlag});
						fields.push({field: 'PerformanceFactor', readonly: readOnlyFlag});
						fields.push({field: 'ResourceFactor', readonly: readOnlyFlag});
						fields.push({field: 'RemainingQuantity', readonly: readOnlyFlag});
						fields.push({field: 'IsDurationEstimationDriven', readonly: readOnlyFlag});

						platformRuntimeDataService.readonly(selectedItem, fields);
					}
				}

				function setContainerReadOnly(selectedItem){
					if (selectedItem === null){
						if (activityReadOnlyFlag || scheduleReadOnlyFlag) {
							activityReadOnlyFlag = false;
							scheduleReadOnlyFlag = false;
							platformPermissionService.restrict([permissionArray.concat(permissionActivity)], false);
						}
						return;
					}
					if(selectedItem.IsInterCompany && platformContextService.signedInClientId !== selectedItem.CompanyFk) {
						selectedItem.ScheduleIsReadOnly = true;
					}

					if (selectedItem.ScheduleIsReadOnly && !scheduleReadOnlyFlag){
						platformPermissionService.restrict([permissionArray.concat(permissionActivity)], permissions.read);
						scheduleReadOnlyFlag = true;
						activityReadOnlyFlag = true;
						progressReadOnlyFlag = true;
					} else if (!selectedItem.ScheduleIsReadOnly && scheduleReadOnlyFlag){
						if (!selectedItem.IsReadOnly) {
							platformPermissionService.restrict([permissionArray.concat(permissionActivity)], false);
							scheduleReadOnlyFlag = false;
							activityReadOnlyFlag = false;
							progressReadOnlyFlag = false;
						} else if (selectedItem.IsReadOnly ){
							platformPermissionService.restrict([permissionActivity], false);
							// platformPermissionService.restrict([permissionArray], permissions.read);
							scheduleReadOnlyFlag = false;
							activityReadOnlyFlag = true;
						}
					} else if (!selectedItem.ScheduleIsReadOnly && !scheduleReadOnlyFlag){
						if (selectedItem.IsReadOnly && !activityReadOnlyFlag) {
							platformPermissionService.restrict([permissionArray], permissions.read);
							scheduleReadOnlyFlag = false;
							activityReadOnlyFlag = true;
							progressReadOnlyFlag = true;
						} else if (!selectedItem.IsReadOnly && activityReadOnlyFlag){
							platformPermissionService.restrict([permissionArray], false);
							scheduleReadOnlyFlag = false;
							activityReadOnlyFlag = false;
							progressReadOnlyFlag = false;
						}
					}
					// Integrated Logic for DEV-29771
					if (selectedItem && selectedItem.ScheduleMasterFk && selectedItem.ScheduleMasterFk > 0) {
						setContainerRestrict(true);
						if(selectedItem!== null){
							selectedItem.IsDurationEstimationDriven =false;
							platformRuntimeDataService.readonly(selectedItem, [{
								field: 'IsDurationEstimationDriven',
								readonly: true
							}]);
						}
					}
					else{
						setContainerRestrict(false);
					}
					if (!selectedItem.ScheduleTypeIsExecution && !scheduleReadOnlyFlag && !progressReadOnlyFlag) {
						platformPermissionService.restrict([schedulingMainConstantValues.uuid.container.progressReportList,
							schedulingMainConstantValues.uuid.container.lineItemProgressList], permissions.read);
						progressReadOnlyFlag = true;
					} else if (selectedItem.ScheduleTypeIsExecution && progressReadOnlyFlag) {
						platformPermissionService.restrict([schedulingMainConstantValues.uuid.container.progressReportList,
							schedulingMainConstantValues.uuid.container.lineItemProgressList], null);
						progressReadOnlyFlag = false;
					}
				}

				service.registerCallBackOnChangeActivityType = function registerCallBackOnChangeActivityType(method) {
					updateHammockToolBar.push(method);
				};

				service.unRegisterCallBackOnChangeActivityType = function unRegisterCallBackOnChangeActivityType(method) {
					updateHammockToolBar = updateHammockToolBar.filter(function (item) {
						return item !== method;
					});
				};

				service.getItemStatus = function getItemStatus() {
					return {
						IsReadonly: platformRuntimeDataService.isReadonly(service.getSelected())
					};
				};

				// General stuff

				schedulingSchedulePresentService.registerSelectionChanged(function (e, schedule) {
					service.setSelectedSchedule(schedule);
					if (schedule && schedule2Select && schedule.Id === schedule2Select.Id) {
						schedule2Select = null;
					}
				});

				function getNavigationSchedule(itemId){
					if (!_.isNaN(itemId)) {
						let getActivityEndpoint = globals.webApiBaseUrl + 'scheduling/main/activity/getactivitybyactivityid';
						$http.get(getActivityEndpoint, {params: {activityId: itemId}}).then(function (response) {
							let activityEntity = response.data;
							let getScheduleEndpoint = globals.webApiBaseUrl + 'scheduling/schedule/instance';
							$http.get(getScheduleEndpoint, {params: {scheduleID: activityEntity.ScheduleFk}}).then(function (response) {
								let scheduleEntity = _.first(response.data);
								selectAfterNavigationUsingSchedule(scheduleEntity, itemId).then(function () {
									let activityFromList = _.find(data.itemList, function (item) {
										return item.Id === itemId;
									});
									if (activityFromList) {
										service.setSelected(activityFromList);
									}
								});
							});
						});
					} else {
						let errorMsg = platformTranslateService.instant('scheduling.main.noActivityWithId').scheduling.main.noActivityWithId;
						platformModalService.showErrorBox(errorMsg, 'scheduling.main.workflowLinkError');
					}

				}
				/**
				 * Schedule navigation handler
				 * @param item
				 * @param triggerField
				 */
				function selectAfterNavigation(item, triggerField) {
					if (service.getSelectedSchedule() && service.getSelectedSchedule().Id !== item.Id && triggerField!=='ChildActivityFk' && triggerField!=='ParentActivityFk') {
						service.clear();
					}
					switch (triggerField) {
						case 'Id':
							// set or reset current PermissionObjectInfo
							if (item && (_.has(item, 'PermissionObjectInfo'))) {
								platformContextService.setPermissionObjectInfo(item.PermissionObjectInfo || null);
							}

							if (_.isString(item)) {
								let itemId = parseInt(item);
								getNavigationSchedule(itemId);
							} else {
								selectAfterNavigationUsingSchedule(item);
							}
							break;

						case 'activityWithSchedule':
							schedulingProjectScheduleService.loadItembyId(item.scheduleId).then(function (schedule) {
								selectedSchedule = schedule;
								service.load().then(function () {
									service.setSelectedSchedule(schedule, item.activityId);
								});
							});
							break;
						case 'Ids':
							const ids = item.Ids.split(',').map(e => parseInt(e));
							item = { Id: ids[0] };
							schedulingProjectScheduleService.loadItembyId(item.Id).then(function (schedule) {
								selectAfterNavigationUsingSchedule(schedule[0]);
							});
							break;
						case 'ParentActivityFk':
						case 'ChildActivityFk': {
							let activityFk = null;
							activityFk = _.get(item, triggerField);
							let scheduleId = _.get(item, 'ChildScheduleFk');
							if (triggerField === 'ParentActivityFk') {
								scheduleId = _.get(item, 'ScheduleFk');
							}
							if (service.getSelectedSchedule() && service.getSelectedSchedule().Id !== scheduleId) {
								schedulingSchedulePresentService.loadSchedule(scheduleId, true).then(function () {
									let schedule = schedulingSchedulePresentService.getItemById(scheduleId);
									selectAfterNavigationUsingSchedule(schedule, activityFk);
								});
							} else {
								let activityToList = service.getItemById(activityFk);
								if (activityToList) {
									service.setSelected(activityToList);
								}
							}
							break;
						}
						default:
							if (Object.prototype.hasOwnProperty.call(item, 'ScheduleFk')
								|| Object.prototype.hasOwnProperty.call(item, 'PsdScheduleFk')) {
								let activityFk = null;
								if (triggerField === 'PsdActivityFk') {
									activityFk = _.get(item, triggerField);
								}

								if (Object.prototype.hasOwnProperty.call(item, 'ScheduleFk')) {
									triggerField = 'ScheduleFk';
								} else {
									triggerField = 'PsdScheduleFk';
								}

								let scheduleId = _.get(item, triggerField);// navigation.getNavData?navigation.getNavData(item,triggerField):item;
								if (activityFk && !scheduleId) {
									getNavigationSchedule(activityFk);
								} else {
									schedulingSchedulePresentService.loadSchedule(scheduleId, true).then(function () {
										let schedule = schedulingSchedulePresentService.getItemById(scheduleId);
										selectAfterNavigationUsingSchedule(schedule, activityFk);
									});
								}
							}
							break;
					}
				}

				function selectAfterNavigationUsingSchedule(schedule, activityIdToSelect) {
					if ( !selectedSchedule || selectedSchedule && (selectedSchedule.Id !== schedule.Id || (selectedSchedule.Id === schedule.Id && selectedSchedule.Version !== schedule.Version)) || data.itemList.length === 0){
						schedulingSchedulePresentService.useSchedule(schedule);
						return setScheduleToPinnningContext(schedule).then(function () {// put projectid and scheduleid into the pinningContext
							selectedSchedule = schedule;
							setScheduleReadonly(schedule.IsReadOnly);
							if (data.sidebarSearch) {
								let result = {
									FilterResult: {
										ExecutionInfo: null,
										RecordsFound: 0,
										RecordsRetrieved: 0,
										ResultIds: null
									},
									dtos: []
								}
								data.clearSidebarFilter(result, data);
								cloudDesktopSidebarService.filterRequest.includeDateSearch = false;
							}
							return service.load().then(function () {
								setTimeout(function () {
									service.setSelectedSchedule(schedule, activityIdToSelect);
								}, 2000);
							});
						});
					}
					return $q.when(true)
				}

				service.selectAfterNavigation = selectAfterNavigation;

				function adjustLevel(activity, delta) {
					activity.nodeInfo.level += delta;

					_.forEach(activity.Activities, function (act) {
						adjustLevel(act, delta);
					});
				}

				service.upgradeDowngradeActivity = new Platform.Messenger();

				function sortItem(itemA, itemB) {
					let codeA = itemA.Code.toLowerCase();
					let codeB = itemB.Code.toLowerCase();
					if (codeA < codeB) {
						return -1;
					}
					if (codeA > codeB) {
						return 1;
					}
					return 0;
				}

				service.canUpgradeActivity = function canUpgradeActivity() {
					let canUpGrade = false;
					let sel = service.getSelected();
					if (!_.isNil(sel) && ((!transientRootEntityEnabled && !!sel.ParentActivityFk) || (transientRootEntityEnabled && sel.ParentActivityFk !== schedulingMainConstantValues.activity.transientRootEntityId && !!sel.ParentActivityFk))) {
						canUpGrade = true;
					}

					return canUpGrade;
				};

				/* jshint -W074 */ // It is not really complex - try harder J.S.Hint
				service.upgradeActivity = function upgradeActivity() {
					let activities, oldParent, newParent;
					let activity = service.getSelected();

					activities = service.getList();

					if (activity && activity.ParentActivityFk !== null) {
						oldParent = _.find(activities, {Id: activity.ParentActivityFk});
						let oldPos;
						let index;
						let help, diff;
						if (oldParent && oldParent.ParentActivityFk) {
							oldPos = _.indexOf(oldParent.Activities, activity);
							oldParent.Activities.splice(oldPos, 1);
							activity.ParentActivityFk = oldParent.ParentActivityFk;
							newParent = _.find(activities, {Id: activity.ParentActivityFk});
							index = _.indexOf(newParent.Activities, oldParent);
							// newParent.Activities.push(activity); //there is no real change to data so no need to add newParent to list of effected activities
							newParent.Activities.splice(index + 1, 0, activity);
							help = angular.copy(newParent.Activities);
							newParent.Activities.sort(sortItem);
							diff = 0;
							for (let i = 0; i < newParent.Activities.length; i++) {
								if (newParent.Activities[i].Code !== help[i].Code) {
									diff++;
									break;
								}
							}
						} else {
							activity.ParentActivityFk = null;
							index = _.indexOf(oldParent.Activities, activity);
							oldParent.Activities.splice(index, 1);
							let tree = service.getTree();
							oldPos = _.indexOf(tree, oldParent);
							tree.splice(oldPos + 1, 0, activity);
							help = angular.copy(tree);
							tree.sort(sortItem);
							diff = 0;
							for (let j = 0; j < tree.length; j++) {
								if (tree[j].Code !== help[j].Code) {
									diff++;
									break;
								}
							}
						}
						adjustLevel(activity, -1);

						// oldParent.Activities.pop(activity);
						// data.markItemAsModified(activity, data); changed the order,
						// because the stored procedure which set the activity levels wasn't called.
						data.markItemAsModified(oldParent, data);
						data.markItemAsModified(activity, data);

						platformDataServiceDataProcessorExtension.doProcessItem(activity, data);
						data.itemModified.fire(null, activity);

						if (oldParent) {
							if (oldParent.Activities.length === 0) {
								oldParent.ActivityTypeFk = 1;
								oldParent.nodeInfo.children = false;
								oldParent.nodeInfo.collapsed = true;
								oldParent.HasChildren = false;
							}
							if (oldPos !== oldParent.Activities.length) {
								oldParent.nodeInfo.collapsed = true;
							}
							activitiesEffected.push(oldParent);
							platformDataServiceDataProcessorExtension.doProcessItem(oldParent, data);
							data.itemModified.fire(null, oldParent);
							if (oldPos !== oldParent.Activities.length || diff > 0) {
								serviceContainer.data.sortByColumn(serviceContainer.data.itemTree);
								serviceContainer.data.listLoaded.fire();
								service.upgradeDowngradeActivity.fire(activity);
							}
							data.itemModified.fire(null, oldParent);
							oldParent = null;
						}
					}
				};

				function getDownGradeSiblings(activity) {
					if (activity.ParentActivityFk) {
						let predecessor = service.getItemById(activity.ParentActivityFk);
						if (predecessor) {
							return predecessor.Activities;
						}
					}

					return service.getTree();
				}

				service.isActivityIdAssignmentToAHammock = function isActivityIdAssignmentToAHammock(actId) {
					let activity = _.find(data.itemList, function (item) {
						return item.Id === actId;
					});
					return service.isActivityAssignmentToAHammock(activity);
				};

				service.isActivityAssignmentToAHammock = function isActivityAssignmentToAHammock(activity) {
					return activity.IsAssignedToHammock;
				};

				service.downgradeActivity = function downgradeActivity() {
					let activity, firstActivities, selectedActivities, predecessor, ret, index;
					ret = false;

					selectedActivities = service.getSelectedEntities();
					for (let firstIndex = 1; firstIndex <= selectedActivities.length; firstIndex++) {
						activity = selectedActivities[firstIndex -1];

						if (activity) {
							if (firstIndex === 1) {
								firstActivities = getDownGradeSiblings(activity);
								index = firstActivities.indexOf(activity);
								predecessor = firstActivities[index -1];
								if (predecessor.ActivityTypeFk !== 2){
									let serv = $injector.get('schedulingMainRelationshipService');
									serv.removeLinksToNewSummary(predecessor.Id);
									predecessor.ActivityTypeFk = 2;
								}
								activity.ParentActivityFk = predecessor.Id;
								adjustLevel(activity, +1);
								predecessor.Activities.push(activity);
								let help = angular.copy(predecessor.Activities);
								predecessor.Activities.sort(sortItem);
								for (let j = 0; j < predecessor.Activities.length; j++) {
									if (predecessor.Activities[j].Code !== help[j].Code) {
										break;
									}
								}
								_.remove(firstActivities, function (treeItem) {
									return treeItem.Id === activity.Id;
								});
								predecessor.nodeInfo.children = true;
								predecessor.nodeInfo.collapsed = false;
								predecessor.HasChildren = true;
								ret += validationHelperForMakeSummary(activity, predecessor, 0);
							}

							if (firstIndex > 1) {
								firstActivities = getDownGradeSiblings(activity);
								index = firstActivities.indexOf(activity);
								predecessor = firstActivities[index -1];
								if (predecessor.ActivityTypeFk !== 2) {
									let serv = $injector.get('schedulingMainRelationshipService');
									serv.removeLinksToNewSummary(predecessor.Id);
									predecessor.ActivityTypeFk = 2;
								}
								activity.ParentActivityFk = predecessor.Id;
								adjustLevel(activity, +1);
								predecessor.Activities.push(activity);
								let help = angular.copy(predecessor.Activities);
								predecessor.Activities.sort(sortItem);
								for (let j = 0; j < predecessor.Activities.length; j++) {
									if (predecessor.Activities[j].Code !== help[j].Code) {
										break;
									}
								}
								_.remove(firstActivities, function (treeItem) {
									return treeItem.Id === activity.Id;
								});

								ret += validationHelperForMakeSummary(activity, predecessor, 0);
							}
						}
					}
					return ret;
				};

				function validationHelperForMakeSummary(activity, predecessor, diff) {
					let valServ = $injector.get('schedulingMainActivityValidationService');
					return valServ.asyncValidatePlannedMove(activity, [asDate(activity.PlannedStart), asDate(activity.PlannedFinish)], 'PlannedMove', 'MakeParentSummary').then(function () {
						data.markItemAsModified(activity, data);
						platformDataServiceDataProcessorExtension.doProcessItem(activity, data);
						data.itemModified.fire(null, activity);
						platformDataServiceDataProcessorExtension.doProcessItem(predecessor, data);
						data.itemModified.fire(null, predecessor);
						activitiesEffected.push(_.cloneDeep(predecessor));
						if (diff > 0 && predecessor.Activities.length > 0) {
							data.sortByColumn(serviceContainer.data.itemTree);
							data.listLoaded.fire();
							service.upgradeDowngradeActivity.fire(activity);
						}
						predecessor = null;
						isValidateDone = true;
						data.updateToolBar.fire();

						return true;
					}, function () {
						isValidateDone = true;
						data.updateToolBar.fire();
					});
				}

				function asDate(value) {
					if (_.isString(value)) {
						return moment.utc(value);
					}

					return value;
				}

				service.canDowngradeActivity = function canDowngradeActivity() {
					let canDownGrade = false;
					let sel = service.getSelected();
					if (!_.isNil(sel) && sel.Id !== schedulingMainConstantValues.activity.transientRootEntityId) {
						let activities = getDownGradeSiblings(sel);
						let index = activities.indexOf(sel);
						let parentCandidate = null;
						if (index >= 1) {
							parentCandidate = activities[index - 1];
						}

						canDownGrade = canCreateChildOn(parentCandidate) && parentCandidate.ActivityTypeFk !== 5;
					}

					return canDownGrade;
				};

				function onDueDateChanged() {
					if (selectedSchedule && selectedSchedule.Id) {
						service.load();
					}
				}

				schedulingMainDueDateService.registerDueDateChanged(onDueDateChanged);

				service.getDueDate = function getDueDate() {
					return schedulingMainDueDateService.getPerformanceDueDateAsString();
				};

				service.takeOverActivities = function takeOverActivities(activities, markAsModified) {
					let modified = [];

					_.forEach(activities, function (act) {
						let loadedAct = data.getItemById(act.Id, data);

						if (loadedAct !== null && loadedAct !== undefined) {
							loadedAct.image = act.image;
							loadedAct.ActivityTypeFk = act.ActivityTypeFk;
							if (loadedAct.Activities.length === 0) {
								if (loadedAct.nodeInfo) {
									loadedAct.nodeInfo.children = false;
									loadedAct.nodeInfo.collapsed = true;
								}
								loadedAct.HasChildren = false;
							}
							loadedAct.PlannedStart = act.PlannedStart;
							loadedAct.PlannedFinish = act.PlannedFinish;
							loadedAct.PlannedDuration = act.PlannedDuration;
							loadedAct.PlannedCalendarDays = act.PlannedCalendarDays;
							loadedAct.ActualStart = act.ActualStart;
							loadedAct.ActualFinish = act.ActualFinish;
							loadedAct.ActualDuration = act.ActualDuration;
							loadedAct.ActualCalendarDays = act.ActualCalendarDays;
							loadedAct.ExecutionStarted = act.ExecutionStarted;
							loadedAct.ExecutionFinished = act.ExecutionFinished;
							loadedAct.CurrentStart = act.CurrentStart;
							loadedAct.CurrentFinish = act.CurrentFinish;
							loadedAct.CurrentDuration = act.CurrentDuration;
							loadedAct.CurrentCalendarDays = act.CurrentCalendarDays;
							loadedAct.EarliestStart = act.EarliestStart;
							loadedAct.LatestStart = act.LatestStart;
							loadedAct.EarliestFinish = act.EarliestFinish;
							loadedAct.LatestFinish = act.LatestFinish;
							loadedAct.ConstraintDate = act.ConstraintDate;
							loadedAct.Quantity = act.Quantity;
							loadedAct.RecourceFactor = act.RecourceFactor;
							loadedAct.PerformanceFactor = act.PerformanceFactor;
							loadedAct.PeriodQuantityPerformance = act.PeriodQuantityPerformance;
							loadedAct.DueDateQuantityPerformance = act.DueDateQuantityPerformance;
							loadedAct.PeriodWorkPerformance = act.PeriodWorkPerformance;
							loadedAct.DueDateWorkPerformance = act.DueDateWorkPerformance;
							loadedAct.PercentageCompletion = act.PercentageCompletion;
							loadedAct.RemainingActivityQuantity = act.RemainingActivityQuantity;
							loadedAct.RemainingActivityWork = act.RemainingActivityWork;
							loadedAct.LastProgressDate = act.LastProgressDate;
							loadedAct.HasCalculatedEnd = act.HasCalculatedEnd;
							loadedAct.HasCalculatedStart = act.HasCalculatedStart;
							loadedAct.IsAssignedToEstimate = act.IsAssignedToEstimate;
							loadedAct.Version = act.Version;
							loadedAct.IsAssignedToHammock = act.IsAssignedToHammock;
							loadedAct.RemainingDuration = act.RemainingDuration;
							loadedAct.EstimateHoursTotal = act.EstimateHoursTotal;
							if (act.ParentActivityFk === null && service.isTransientRootEntityActive()) {
								act.ParentActivityFk = $injector.get('schedulingMainConstantValues').activity.transientRootEntityId;
							}

							modified.push(loadedAct);

							platformDataServiceDataProcessorExtension.doProcessItem(loadedAct, data);
						}
					});

					if (markAsModified) {
						_.forEach(modified,
							function (mod) {
								service.markItemAsModified(mod);
							});
					} else {
						_.forEach(modified, function (mod) {
							service.fireItemModified(mod);
						});
					}
				};

				function mergePlanningChange(former, latest) {
					if (!!latest.StartDate || !!latest.EndDate) {
						former.StartDate = null;
						former.EndDate = null;
					}
					_.assign(former, latest);
				}

				service.calculateActivities = function calculateActivities(parameter, responseData, setModified) {
					let activities = [];
					if (_.isArray(responseData.Activities)) {
						activities = responseData.Activities;
					} else if (!!responseData.Activities && responseData) {
						activities = [responseData];
					}

					let allActivities = [];
					data.flatten(activities, allActivities, data.treePresOpt.childProp);
					platformDataServiceDataProcessorExtension.doProcessData(allActivities, data);

					let markAsModified = _.isNil(setModified) ? false : setModified;
					service.takeOverActivities(activities, markAsModified);
					if (!_.isNil(parameter)) {
						if (activityPlanningChange === null || activityPlanningChange === undefined) {
							activityPlanningChange = {};
						}
						mergePlanningChange(activityPlanningChange, parameter);
					}
				};

				service.mergeItemAfterTemplateHasBeenAssigned = function mergeItemAfterTemplateHasBeenAssigned(newItem) {
					let oldItem = data.getItemById(newItem.Id, data);
					data.mergeItemAfterSuccessfullUpdate(oldItem, newItem, true, data);

					data.markItemAsModified(oldItem, data);
				};

				service.updateWithPostProcess = function addPostProcess(postProces) {
					data.postProcess = postProces;
					return data.doUpdate(data)
						.then(function (result) {
								data.postProcess = null;
								return result;
							},
							function () {
								data.postProcess = null;
							});
				};

				service.mergeInActivityChange = function mergeInActivityChange(newItem) {
					let oldItem;
					platformDataServiceDataProcessorExtension.doProcessItem(newItem, data);
					oldItem = data.getItemById(newItem.Id, data);
					data.mergeItemAfterSuccessfullUpdate(oldItem, newItem, true, data);

					data.markItemAsModified(oldItem, data);
				};

				service.insertNewTask = function () {
					insertActivity = true;
					return service.createItem();
				};

				service.processActivity = function processActivity(activityId) {
					let activity = service.getItemById(activityId);
					schedulingMainModifyActivityProcessor.processItem(activity);
				};

				// Baseline messenger
				service.baselineCreated = new Platform.Messenger();
				service.registerBaselineCreated = function registerBaselineCreated(handler) {
					service.baselineCreated.register(handler);
				};
				service.unregisterBaselineCreated = function unregisterBaselineCreated(handler) {
					service.baselineCreated.unregister(handler);
				};

				service.getSettingsButtonConfig = function getSettingsButtonConfig() {
					return {
						id: 't2',
						caption: 'scheduling.main.activitySettings',
						tooltip: $injector.get('schedulingMainDueDateService').buildToolTip(),
						type: 'item',
						// iconClass: 'tlb-icons ico-date',
						fn: service.settingsDialog,
						disabled: function () {
							return false;
						}
					};
				};

				service.getLatestActivity = function (activityItem) {
					// get the up to date activity
					let isSameActivity = function (item) {
						return item.Id === activityItem.Id;
					};
					let platformDataServiceModificationTrackingExtension = $injector.get('platformDataServiceModificationTrackingExtension');
					let actualActivities = _.get(platformDataServiceModificationTrackingExtension.getModifications(service), ['Activities']);
					let actualActivity = _.isArray(actualActivities) ? actualActivities.find(isSameActivity) : undefined;
					return _.isUndefined(actualActivity) ? activityItem : actualActivity;
				};

				service.settingsDialog = function settingsDialog() {

					let title = $translate.instant('scheduling.main.activitySettings');
					let modalGenerateConfig = {
						dialogOptions: {
							headerTextKey: 'scheduling.main.activitySettings',
							templateUrl: globals.appBaseUrl + 'scheduling.main/templates/scheduling-icon-sorting-dialog.html',
							width: '700px',
							resizeable: true
						},
						title: title,
						dataItems: [],
						relations: {
							Create: false,
							RelationKindFk: 1
						},
						handleOK: function handleOK(result) {
							schedulingMainDueDateService.setPerformanceDueDate(result.dueDate);
							schedulingMainDueDateService.setPerformanceDescription(result.description);
							service.setTransientRootEntityEnable(result.enableTransientRootEntity);
							$http.post(globals.webApiBaseUrl +'scheduling/main/icons/saveicons', result.icons)
								.then(function (response) {
									service.gridRefresh();
								})
						}
					};

					modalGenerateConfig.scope = platformSidebarWizardConfigService.getCurrentScope();

					platformModalGridConfigService.setConfig(modalGenerateConfig);

					platformModalService.showDialog(modalGenerateConfig.dialogOptions).then(function (result) {
						if (result.yes) {
							modalGenerateConfig.handleOK(result.data);
						}
					});
				};

				data.extendSearchFilter = function extendSearchFilter(filterRequest) {
					if (schedulingMainDueDateService.hasDueDate()) {
						filterRequest.furtherFilters = filterRequest.furtherFilters || [];
						if (_.isArray(filterRequest.furtherFilters)) {
							filterRequest.furtherFilters.push({
								Token: 'INCLUDE_DUEDATE',
								Value: schedulingMainDueDateService.getPerformanceDueDateAsString()
							});
							if (service.isTransientRootEntityActive()) {
								filterRequest.furtherFilters.push({
									Token: 'INCLUDE_TRANSIENTROOTENTITY',
									Value: 'True'
								});
							}
						}
					}
				};

				service.asyncSetUserTransientRootEnable = function (enable) {
					return $http.post(globals.webApiBaseUrl + 'scheduling/main/activity/setusertransientrootenable?enable=' + enable, {});
				};

				service.asyncGetUserTransientRootEnable = function () {
					return $http.post(globals.webApiBaseUrl + 'scheduling/main/activity/getusertransientrootenable', {});
				};

				service.setTransientRootEntityEnable = function (enable) {
					if (transientRootEntityEnabled !== enable) {
						let isTransientRootEntityActivBeforeChangingEnableState = service.isTransientRootEntityActive();
						service.asyncSetUserTransientRootEnable(enable);
						transientRootEntityEnabled = enable;
						if (service.isTransientRootEntityActive() !== isTransientRootEntityActivBeforeChangingEnableState) {
							service.reload();
						}

					}
				};

				service.getTransientRootEntityEnable = function () {
					return transientRootEntityEnabled;
				};

				service.isTransientRootEntityActive = function () {
					return transientRootEntityEnabled && (!!schedulingSchedulePinnableEntityService.getPinned() || schedulingSchedulePresentService.isLoadingForPininng());
				};

				service.executeCompleteCommand = function executeCompleteCommand(completeData) {
					return $http.post(globals.webApiBaseUrl + 'scheduling/main/activity/executecomplete', completeData)
						.then(function (response) {
								service.takeOverActivities(response.data.Activities, false);
								takeOverRelationsShips(response.data);
								takeOverEvents(response.data);
								takeOverHammocks(response.data);
								removeDeletedPredecessorSuccessor(response.data);
							},
							function (/* error */) {
							});
				};

				function removeDeletedPredecessorSuccessor(data) {
					if (data.RelationshipsToDelete && _.isArray(data.RelationshipsToDelete)) {
						data.RelationshipsToDelete.forEach(rs => {
							let parent = _.find(service.getList(), function (item) {
								return item.Id === rs.ParentActivityFk;
							});
							let child = _.find(service.getList(), function (item) {
								return item.Id === rs.ChildActivityFk;
							});
							if (parent && _.isArray(parent.Successor)) {
								_.remove(parent.Successor, function (item) {
									return rs.Id === item.id;
								});
							}
							if (child && _.isArray(child.Predecessor)) {
								_.remove(child.Predecessor, function (item) {
									return rs.Id === item.id;
								});
							}
							service.gridRefresh();
						});

						refreshSubcontainers();
					}
				}

				function refreshSubcontainers() {
					let preservice = $injector.get('schedulingMainPredecessorRelationshipDataService');
					let sucservice = $injector.get('schedulingMainSuccessorRelationshipDataService');
					let $timeout = $injector.get('$timeout');

					preservice.load().then(function () {
						preservice.loadSubItemList().then(function () {
							$timeout(preservice.gridRefresh(), 0);
						});
					});
					sucservice.load().then(function () {
						sucservice.loadSubItemList().then(function () {
							$timeout(sucservice.gridRefresh(), 0);
						});
					});
				}
				service.createDeepCopy = function createDeepCopy() {
					let command = {
						Action: 13,
						EffectedItemId: service.getSelected().Id
					};

					$http.post(globals.webApiBaseUrl + 'scheduling/main/activity/execute', command)
						.then(function (response) {
								let transientRootEntityId = $injector.get('schedulingMainConstantValues').activity.transientRootEntityId;
								let copy = response.data.Activities[0];
								takeOverRelationsShips(response.data);
								takeOverEvents(response.data);
								takeOverHammocks(response.data);
								let creationData = {
									parent: null
								};
								if (copy.ParentActivityFk) {
									creationData.parent = data.getItemById(copy.ParentActivityFk, data);
								} else {
									if (service.isTransientRootEntityActive()) {
										copy.ParentActivityFk = transientRootEntityId;
										creationData.parent = service.getItemById(transientRootEntityId); // only available locally
									}
								}
								data.onCreateSucceeded(copy, data, creationData);
							},
							function ( /* error */) {
							});
				};

				/**
				 * @ngdoc function
				 * @name loadItemById
				 * @function
				 * @methodOf schedulingMainService
				 * @description Retrieves an activity by its ID, irrespective of whether or not it has been loaded
				 *              before.
				 * @returns {Promise<Object>} A promise that is resolved to the requested activity DTO.
				 */
				service.loadItemById = function (activityId) {
					let result = service.getItemById(activityId);
					if (result) {
						return $q.when(result);
					} else {
						return $http.get(globals.webApiBaseUrl + 'scheduling/main/activity/get?activityId=' + activityId).then(function (response) {
							if (response.data) {
								activityServiceOption.hierarchicalRootItem.dataProcessor.forEach(function (processor) {
									processor.processItem(response.data);
								});
								return response.data;
							} else {
								return $q.reject();
							}
						});
					}
				};

				service.getPinningContext = function () {
					let currentPinningContext = cloudDesktopPinningContextService.getContext();
					let pinnedProject = _.find(currentPinningContext, {token: 'project.main'});

					return pinnedProject;
				};

				function getItemByCode(code, schedule, activities) {
					const activity = schedule ? _.find(activities, {
						Code: code.value,
						ScheduleFk: schedule
					}) : _.find(activities, ['Code', code.value]);

					if (activity) {
						return activity;
					}

					const children = _.reduce(activities, (result, activity) => {
						if (activity.Activities.length > 0) {
							return result.concat(activity.Activities);
						}
						return result;
					}, []);

					if (children.length > 0) {
						return getItemByCode(code, activities);
					}

					return null;
				}

				service.getItemByCode = (code, schedule) => {
					return getItemByCode(code, schedule, serviceContainer.data.getUnfilteredList());
				};

				let schedulingMainFilters = [
					{
						key: 'scheduling-main-status-by-rubric-category-filter',
						fn: function (status, activity) {
							return status.RubricCategoryFk === activity.RubricCategoryFk;
						}
					}
				];

				basicsLookupdataLookupFilterService.registerFilter(schedulingMainFilters);
				service.asyncGetUserTransientRootEnable()
					.then(function (response) {
						transientRootEntityEnabled = _.isBoolean(response.data) ? response.data : false;
					});

				function setOrDeleteNodeInfo(activity) {
					if (!_.isNil(activity)) {
						let item = _.find(data.itemList, {Id: activity.Id});
						if (item && (item.HasChildren || item.Activities.length > 0)) {
							if (!item.nodeInfo) {
								item.nodeInfo = {children: true, collapsed: false};
							}
							if (!item.ParentActivityFk) {
								item.nodeInfo.level = 0;
								item.nodeInfo.children = true;
								item.nodeInfo.collapsed = false;
							} else {
								let oldParent = _.find(data.itemList, {Id: item.ParentActivityFk});
								if (!oldParent.nodeInfo){
									if (!oldParent.ParentActivityFk){
										oldParent.nodeInfo = {children: true, collapsed: false, level: 0};
									} else {
										let oldGrandParent = _.find(data.itemList, {Id: oldParent.ParentActivityFk});
										oldParent.nodeInfo = {children: true, collapsed: false};
										if (oldGrandParent) {
											oldParent.nodeInfo.level = oldGrandParent.nodeInfo.level + 1;
										}
									}
								}
								item.nodeInfo.level = oldParent.nodeInfo.level + 1;
								item.nodeInfo.collapsed = false;
								item.nodeInfo.children = true;
							}
							// activity.Activities.forEach(act => setOrDeleteNodeInfo(act));
						} else if (item && item.nodeInfo) {
							item.nodeInfo.children = false;
							item.nodeInfo.collapsed = true;
							item.HasChildren = false;
							// delete item.nodeInfo;
						}
					}
				}
				function mergeItem(oldItem, item, data) {
					let treeInfo = {};
					if (!oldItem || !oldItem.Id ){
						return;
					}
					if (data.saveItemChildInfo) {
						data.saveItemChildInfo(oldItem, treeInfo, data);
					}

					platformDataServiceDataProcessorExtension.doProcessItem(oldItem, data);
					platformDataServiceDataProcessorExtension.doProcessItem(item, data);
					angular.extend(oldItem, item);

					if (treeInfo.hasChildren) {
						data.reestablishItemChildInfo(oldItem, treeInfo, data);
					}
				}
				function takeInList(activities){
					_.forEach(activities, function (activity) {
						let parent = _.find(data.itemList, {Id: activity.ParentActivityFk});
						if (parent && parent.Id) {
							let oldItem = _.find(parent.Activities, {Id: activity.Id});
							if (oldItem) {
								mergeItem(oldItem, activity, data);
								let oldItemList = _.find(data.itemList, {Id: activity.Id});
								if (!oldItemList) {
									data.itemList.push(activity);
								} else {
									mergeItem(oldItemList, activity, data);
								}
							} else {
								parent.Activities.push(activity);
								data.itemList.push(activity);
								if (parent.ActivityTypeFk === 1) {
									parent.ActivityTypeFk = 2;
									parent.HasChildren = true;
									setOrDeleteNodeInfo(parent);
									platformDataServiceDataProcessorExtension.doProcessItem(parent, data);
								}
								platformDataServiceEntitySortExtension.sortBranchOfTree(parent.Activities, data);
							}
						} else {
							let oldItem = _.find(data.itemTree, {Id: activity.Id});
							if (oldItem) {
								mergeItem(oldItem, activity, data);
								let oldItemList = _.find(data.itemList, {Id: activity.Id});
								if (!oldItemList) {
									data.itemList.push(activity);
								} else {
									mergeItem(oldItemList, activity, data);
								}
							} else {
								data.itemTree.push(activity);
								platformDataServiceEntitySortExtension.sortBranchOfTree(data.itemTree, data);
								let oldItemList = _.find(data.itemList, {Id: activity.Id});
								if (!oldItemList) {
									data.itemList.push(activity);
								} else {
									mergeItem(oldItemList, activity, data);
								}
							}
						}
						setOrDeleteNodeInfo(activity);
						if (activity.Activities.length>0){
							takeInList(activity.Activities);
						}
					});
				}
				service.takeOverNewActivities = function takeOverNewActivities(activities) {
					if (activities && activities.length > 0) {
						let allActivities = [];
						data.flatten(activities, allActivities, data.treePresOpt.childProp);
						platformDataServiceDataProcessorExtension.doProcessData(allActivities, data);

						takeInList(activities);
						if (activities[0].ParentActivityFk) {
							let parent = _.find(data.itemList, {Id: activities[0].ParentActivityFk});
							if (parent && parent.Id && parent.nodeInfo) {
								parent.nodeInfo.collapsed = false;
								parent.nodeInfo.children = true;
								parent.HasChildren = true;
							}
						}
						// service.gridRefresh();
						// data.listLoaded.fire();
						data.dropped.fire();
					}
				};

				function deepRemoveEntityFromHierarchy(entity, parent, removeItem, data, service) {
					data.itemList = _.filter(data.itemList, function (item) {
						return item.Id !== entity.Id;
					});

					if (removeItem) {
						parent = parent || _.find(data.itemList, {Id: entity.ParentActivityFk});
						if (parent && parent.Id) {
							parent.Activities = _.filter(parent.Activities, function (child) {
								return child.Id !== entity.Id;
							});
							if (parent.Activities.length === 0){
								parent.ActivityTypeFk = 1;
								parent.nodeInfo.children = false;
								parent.nodeInfo.collapsed = true;
								parent.HasChildren = false;
							}
							platformDataServiceDataProcessorExtension.doProcessItem(parent, data);
						} else {
							data.itemTree = _.filter(data.itemTree, function (root) {
								return root.Id !== entity.Id;
							});
						}
						// setOrDeleteNodeInfo(parent);
					}

					if (entity.Activities && entity.Activities.length > 0) {
						angular.forEach(entity.Activities, function (child) {
							deepRemoveEntityFromHierarchy(child, entity, false, data, service);
						});
					}
				}
				service.moveItem = function (entities) {
					angular.forEach(entities, function (entity) {
						let parent = _.find(data.itemList, {Id: entity.ParentActivityFk});
						deepRemoveEntityFromHierarchy(entity, parent, true, data, service);
					});
					// serviceContainer.data.listLoaded.fire();
				};

				service.updateFromEstimate = function updateFromEstimate(activity, sum){
					if (activity.IsDurationEstimationDriven){
						var action = {
							Action: 25,
							UpdatePlannedDurationData: {
								Activity: activity,
								EstimateHoursTotal: sum
							}
						};

						$http.post(globals.webApiBaseUrl + 'scheduling/main/activity/execute', action
						).then(function (response) {
							if (!response.data.Valid && response.data.ValidationError.startsWith('Model:')) {
								if (!response.data.Valid) {
									platformDialogService.showMsgBox(response.data.ValidationError.replace('Model:',''), 'scheduling.main.modalInfoMessage', 'info');

								}
							}
							service.calculateActivities(null, response.data, true);
						});
					}
				};
				return service;
			}
		]);
})();
