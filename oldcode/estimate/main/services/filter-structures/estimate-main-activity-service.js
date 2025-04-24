/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global Platform */
	'use strict';
	let moduleName = 'estimate.main';
	let estimateMainModule = angular.module(moduleName);
	/* jslint nomen:true */
	/* global globals, _ */

	/* jshint -W072 */ // many parameters because of dependency injection
	estimateMainModule.factory('estimateMainActivityService', ['$injector','moment','$timeout','platformDataServiceFactory', 'ServiceDataProcessArraysExtension', 'schedulingMainActivityImageProcessor', 'estimateMainCreationService',
		'estimateMainFilterService', 'estimateMainService', 'estimateMainFilterCommon', 'estMainRuleParamIconProcess','ServiceDataProcessDatesExtension','platformGridAPI','cloudCommonGridService',
		function (
			$injector,moment,$timeout,platformDataServiceFactory, ServiceDataProcessArraysExtension, schedulingMainActivityImageProcessor, estimateMainCreationService,
			estimateMainFilterService, estimateMainService, estimateMainFilterCommon, estMainRuleParamIconProcess,ServiceDataProcessDatesExtension,platformGridAPI,cloudCommonGridService) {

			let projectId = estimateMainService.getSelectedProjectId();
			let service = {},
				serviceContainer = {},
				vRoot = {},
				isReadData = false; // already send xhr to service
			let activityServiceOption = {
				hierarchicalRootItem: {
					module: estimateMainModule,
					serviceName: 'estimateMainActivityService',
					httpRead: {
						route: globals.webApiBaseUrl + 'scheduling/main/activity/',
						endRead: 'projectscheduleactivities',
						initReadData: function (readData) {
							let projectId = estimateMainService.getSelectedProjectId();
							if (projectId) {
								readData.filter = '?projectId=' + projectId;
							}
							isReadData = true; // mark sended xhr to service
							return readData;
						}
					},
					httpUpdate: {
						route: globals.webApiBaseUrl + 'estimate/main/lineitem/'
					},
					dataProcessor: [new ServiceDataProcessArraysExtension(['Activities']),new ServiceDataProcessDatesExtension(['PlannedStart','PlannedFinish']), schedulingMainActivityImageProcessor, estMainRuleParamIconProcess],
					useItemFilter: true,
					presenter: {
						tree: {
							parentProp: 'ParentActivityFk',
							childProp: 'Activities',
							incorporateDataRead: function (readData, data) {

								if (readData === null) {
									return data.handleReadSucceeded([], data);
								} else {
									let filterIds = estimateMainFilterService.getAllFilterIds();

									let multiSelect = false; // default single mode
									if (data.usingContainer && data.usingContainer[0]) {
										let existedGrid = platformGridAPI.grids.exist(data.usingContainer[0]);
										if (existedGrid) {
											let columns = platformGridAPI.columns.getColumns(data.usingContainer[0]);
											let markerColumn = _.find(columns, {'field': 'IsMarked'});
											if (markerColumn && markerColumn.editorOptions) {
												multiSelect = markerColumn.editorOptions.multiSelect;
											}
										}
									}

									if (filterIds.PSD_ACTIVITY && _.isArray(filterIds.PSD_ACTIVITY)) {
										let flatList = cloudCommonGridService.flatten(readData, [], 'Activities');
										let filterItem = _.filter(flatList, function (item) {
											return (multiSelect ? _.includes(filterIds.PSD_ACTIVITY, item.Id) : item.Id === filterIds.PSD_ACTIVITY[0]);
										});

										if (filterItem && _.isArray(filterItem) && filterItem[0]) {
											// IsMarked used by the UI config service as filter field
											_.each(filterItem, function (item) {
												item.IsMarked = true;
											});

											let grids = serviceContainer.data.usingContainer;
											_.each(grids, function (gridId) {
												if (gridId) {
													$timeout(function () {
														platformGridAPI.rows.scrollIntoViewByItem(gridId, filterItem[0]);
														service.setSelected(filterItem[0]);
													});
												}
											});
										}
									}

									service.addActivityVRoot(readData);
									readData.forEach((data)=>{
										data.Activities.forEach((Activity)=>{
											Activity.PlannedFinish=moment.utc(Activity.PlannedFinish);
											Activity.PlannedStart=moment.utc(Activity.PlannedStart);
										});
									});

									vRoot.Id = -1;
									vRoot.EstHeaderFk = estimateMainService.getSelectedEstHeaderId();
									vRoot.IsRoot = true;
									// add virtual root item containing all activities
									let estHeader = estimateMainService.getSelectedEstHeaderItem();
									if (estHeader) {
										vRoot.Code = estHeader.Code;
										vRoot.Description = estHeader.DescriptionInfo.Description;
										vRoot.EstHeaderFk = estHeader.Id;
										vRoot.IsRoot = true;
									}
									isReadData = false; // mark done xhr
									data.handleReadSucceeded([vRoot], data);
									if (estimateMainService.getHeaderStatus() || !estimateMainService.hasCreateUpdatePermission()) {
										if (data.itemList.length > 0) {
											_.forEach(data.itemList, function (item) {
												$injector.get('platformRuntimeDataService').readonly(item, [{ field: 'Rule', readonly: false }, { field: 'Param', readonly: false }]);
											});
										}
									}
									return data.itemList;
								}
							}
						}
					},
					entityRole: {root: {
						addToLastObject: true,
						lastObjectModuleName: moduleName,
						moduleName: 'Estimate Main',
						itemName: 'EstActivity',
						handleUpdateDone: function (updateData, response) {
							updateData.MainItemId = updateData.MainItemId < 0 ? null : updateData.MainItemId;
							estimateMainService.updateList(updateData, response);
						}
					}},
					actions: {} // no create/delete actions
				}
			};

			serviceContainer = platformDataServiceFactory.createNewComplete(activityServiceOption);
			service = serviceContainer.service;
			let allIds = [];

			serviceContainer.data.doUpdate = null;

			service.addEntityToModified = function (){};

			service.getContainerData =  function getContainerData() {
				return serviceContainer.data;
			};

			let ruleToDelete =[];

			service.setRuleToDelete =  function setRuleToDelete(value) {
				ruleToDelete = value;
			};

			service.getRuleToDelete =  function getRuleToDelete() {
				return ruleToDelete;
			};

			service.setFilter('projectId=' + projectId);

			// filter leading structure by line items
			estimateMainFilterService.addLeadingStructureFilterSupport(service, 'PsdActivityFk');

			// add virtual root item containing all activities
			service.addActivityVRoot = function addActivityVRoot(readData){
				vRoot = {
					Id: -1,
					Activities: [],
					ParentActivityFk: null,
					HasChildren: readData && readData.length > 0,
					image: 'ico-folder-estimate'
				};

				_.each(readData, function (item) {
					let schedule = {
						Id: 'schedule' + item.Schedule.Id,
						ScheduleId : item.Schedule.Id,
						Code: item.Schedule.Code,
						Description: (item.Schedule.DescriptionInfo) ? item.Schedule.DescriptionInfo.Translated: '',
						Activities: _.sortBy(item.Activities, 'Code'),
						HasChildren: item.Activities.length > 0,
						image: 'ico-schedule',
						ParentActivityFk: -1
					};
					_.each(item.Activities, function (item) {
						item.ParentActivityFk = schedule.Id;
					});
					vRoot.Activities.push(schedule);
				});
				return vRoot;
			};

			service.creatorItemChanged = function creatorItemChanged(e, item) {
				if (!_.isEmpty(item)) {
					estimateMainCreationService.addCreationProcessor('estimateMainActivityListController', function (creationItem) {
						// ActivityTypeFk, only assign Activities (Activity => ActivityTypeFk === 1)
						if (item.ActivityTypeFk === 1) {
							creationItem.PsdActivityFk = item.Id;

							if(creationItem.DescStructure === 2 || !creationItem.validStructure || !creationItem.DescAssigned){
								creationItem.DescriptionInfo = {
									Description: item.Description,
									DescriptionModified: false,
									DescriptionTr: null,
									Modified: false,
									OtherLanguages: null,
									Translated: item.Description,
									VersionTr: 0
								};
								creationItem.DescAssigned = creationItem.DescStructure === 2;
							}

							// from structure
							if(!creationItem.validStructure || creationItem.QtyTakeOverStructFk === 2){

								creationItem.Quantity = item.Quantity;

								creationItem.WqQuantityTarget = item.Quantity;
								creationItem.WqQuantityTargetDetail = item.Quantity;

								creationItem.QuantityTarget  = item.Quantity;
								creationItem.QuantityTargetDetail= item.Quantity;

								creationItem.BasUomTargetFk = creationItem.BasUomFk = item.QuantityUoMFk;
								creationItem.validStructure = true;
								creationItem.QtyTakeOverStructFk = 2;
							}
						}
					});
				}
				else {
					estimateMainCreationService.removeCreationProcessor('estimateMainActivityListController');
				}
			};

			service.filterActivityItem = new Platform.Messenger();
			service.registerFilterActivityItem = function (callBackFn) {
				service.filterActivityItem.register(callBackFn);
			};
			service.unregisterFilterActivityItem = function (callBackFn) {
				service.filterActivityItem.unregister(callBackFn);
			};

			service.markersChanged = function markersChanged(itemList) {
				let filterKey = 'PSD_ACTIVITY';
				let schedulingMainActivityTypes = $injector.get('schedulingMainActivityTypes');

				if (_.isArray(itemList) && _.size(itemList) > 0) {
					allIds = [];
					_.each(itemList, function (item) {
						// ActivityTypes: 1=(Regular)Activity, 2=SummaryActivity, 3=Milestone, 4=SubSchedule
						if (item.ActivityTypeFk === schedulingMainActivityTypes.Activity || item.ActivityTypeFk === schedulingMainActivityTypes.SubSchedule) { // (Regular)Activity or Subschedule Activity
							allIds.push(item.Id);
						} else if (item.ActivityTypeFk === schedulingMainActivityTypes.SummaryActivity || item.ActivityTypeFk === undefined) { // SummaryActivity
							// get all child activities
							let items = estimateMainFilterCommon.collectItems(item, 'Activities');
							let Ids = _.map(_.filter(items, function (i) { return i.ActivityTypeFk === 1; }), 'Id');
							allIds = allIds.concat(Ids);
						}
					});

					estimateMainFilterService.setFilterIds(filterKey, allIds);
					estimateMainFilterService.addFilter('estimateMainActivityListController', service,
						function (lineItem) {
							return allIds.indexOf(lineItem.PsdActivityFk) >= 0;
						},
						{id: filterKey, iconClass: 'tlb-icons ico-filter-activity', captionId: 'filterActivity'},
						'PsdActivityFk');

				} else {
					estimateMainFilterService.setFilterIds(filterKey, []);
					estimateMainFilterService.removeFilter('estimateMainActivityListController');
				}

				service.filterActivityItem.fire();
			};

			serviceContainer.data.provideUpdateData = function (updateData) {
				if(updateData && !updateData.MainItemId){
					updateData.MainItemId = service.getIfSelectedIdElse(-1);
				}
				return estimateMainService.getUpdateData(updateData);
			};

			service.loadActivyty = function (isFromNavigator) {
				// if project id change, then reload leading structure
				let activityList = service.getList();
				if (projectId !== estimateMainService.getSelectedProjectId() || activityList.length <= 0) {
					projectId = estimateMainService.getSelectedProjectId();
					service.setFilter('projectId=' + projectId);
					if (projectId && !isReadData) {
						service.load();
					}
				}else{
					let rootItem = _.find(activityList, {IsRoot : true});
					if(rootItem){
						let estHeader = estimateMainService.getSelectedEstHeaderItem();
						if (estHeader) {
							rootItem.Code = estHeader.Code;
							rootItem.Description = estHeader.DescriptionInfo.Translated;
							rootItem.EstHeaderFk = estHeader.Id;
						}
						service.fireItemModified(rootItem);
					}

					if(isFromNavigator === 'isForNagvitor'){
						service.load();
					}
				}
			};

			return service;
		}]);
})(angular);
