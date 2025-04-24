/**
 * Created by baedeker on 2014-08-13
 */

(function (angular) {
	/* global JSZip globals, moduleContext */
	'use strict';

	/**
	 * @ngdoc factory
	 * @name scheduling.main.services:schedulingMainSidebarWizardService
	 * @description
	 * Provides wizard configuration and implementation of all scheduling wizards
	 *
	 * @example
	 * <div paltform-layout initial-layout="name of layout", layout-options="options"></div>
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('scheduling.main').factory('schedulingMainSidebarWizardService', ['_', 'platformSidebarWizardConfigService',
		'schedulingMainService', 'platformModalService', 'platformTranslateService', 'platformModalFormConfigService',
		'platformModalGridConfigService', '$injector', '$translate', '$http', '$q', 'platformSidebarWizardCommonTasksService',
		'projectLocationMainImageProcessor', 'basicsCommonChangeStatusService', 'platformRuntimeDataService',
		'documentProjectDocumentsStatusChangeService', '$log', '$rootScope', 'schedulingMainBaselineConfigurationService',
		'schedulingMainQuantityUnitDataOriginWizardService', 'platformDataServiceModificationTrackingExtension', 'schedulingMainGenerateRequisitionService',
		'schedulingExtSysPrimaveraService', 'platformCreateUuid', 'basicsLookupdataLookupFilterService',
		'productionpalnningActivityCreationWizardService', 'productionpalnningActivitySynchronizeWizardService', 'schedulingMainConstantValues',
		'basicsLookupdataSimpleLookupService', 'moment', 'platformWizardDialogService', 'servicesSchedulerUIFrequencyValues',

		function (_, platformSidebarWizardConfigService, schedulingMainService, platformModalService, platformTranslateService,
		          platformModalFormConfigService, platformModalGridConfigService, $injector, $translate, $http, $q,
		          platformSidebarWizardCommonTasksService, projectLocationMainImageProcessor, basicsCommonChangeStatusService,
		          platformRuntimeDataService, documentProjectDocumentsStatusChangeService, $log, $rootScope,
		          schedulingMainBaselineConfigurationService, schedulingMainQuantityUnitDataOriginWizardService, platformDataServiceModificationTrackingExtension, schedulingMainGenerateRequisitionService,
		          schedulingExtSysPrimaveraService, platformCreateUuid, basicsLookupdataLookupFilterService,
		          mntActivityCreationWizardService, activitySynchronizeWizardService, schedulingMainConstantValues,
		          basicsLookupdataSimpleLookupService, moment, platformWizardDialogService, servicesSchedulerUIFrequencyValues) {

			var service = {};

			var filters = [{
				key: 'scheduling-create-prc-package-configuration-filter',
				serverSide: true,
				fn: function () {
					return 'RubricFk = 31 And IsDefault = true';
				}
			}, {
				key: 'scheduling-prc-package-filter',
				serverSide: true,
				fn: function () {
					return {
						ProjectFk: moduleContext.loginProject,
						IsLive: true
					};
				}
			},
				{
					key: 'scheduling-procurement-package-clerk-filter',
					serverSide: true,
					fn: function () {
						return true;
						// return 'IsLive=true';
					}
				}
			];

			basicsLookupdataLookupFilterService.registerFilter(filters);

			function createLocTableEntry(loc, config, parentEntry) {
				var item = {
					useInSplit: true,
					item: loc,
					Id: loc.Id,
					Code: loc.Code,
					DescriptionInfo: loc.DescriptionInfo,
					Quantity: loc.Quantity,
					QuantityPercent: loc.QuantityPercent,
					Parent: loc.LocationParentFk,
					ParentEntity: parentEntry,
					Children: [],
					HasChildren: false
				};

				if (parentEntry) {
					parentEntry.Children.push(item);
				} else {
					config.dataItems.push(item);
				}

				_.forEach(loc.Locations, function (childLoc) {
					createLocTableEntry(childLoc, config, item);
				});
				if (item.Children.length > 0) {
					item.HasChildren = true;
				}
				projectLocationMainImageProcessor.processItem(item);
			}

			function createLocDTOEntries(parent, locs, count) {
				_.forEach(locs, function (childLoc) {
					var item;
					if (childLoc.useInSplit) {
						item = {
							LocID: childLoc.Id,
							Code: childLoc.Code,
							Quantity: childLoc.Quantity,
							Children: []
						};

						parent.Children.push(item);
						count += 1;

						count = createLocDTOEntries(item, childLoc.Children, count);
					} else {
						count = createLocDTOEntries(parent, childLoc.Children, count);
					}
				});

				return count;
			}

			service.createBaseline = function createBaseline() {
				var modalCreateBaselineConfig;
				var schedule = schedulingMainService.getSelectedSchedule();
				var title = 'scheduling.main.createBaseline';

				if (platformSidebarWizardCommonTasksService.assertSelection(schedule)) {
					modalCreateBaselineConfig = {
						dialogOptions: {height: '500px', width: '650px'},
						title: $translate.instant(title),
						dataItem: {
							description: '',
							remark: '',
							company: schedule.CompanyFk,
							scheduleCode: schedule.Code,
							schedule: schedule.Id
						},
						formConfiguration: {
							fid: 'scheduling.main.createBaseline',
							version: '0.2.4',
							showGrouping: false,
							groups: [
								{
									gid: 'baseGroup',
									attributes: ['setAlternativeActive']
								}
							],
							rows: [
								{
									gid: 'baseGroup',
									rid: 'description',
									label$tr$: 'cloud.common.entityDescription',
									type: 'inputselect',
									options: {
										serviceName: 'schedulingLookupBaselineSpecificationDataService',
										serviceDataFunction: 'getBaselineSpecs',
										valueMember: 'Description',
										displayMember: 'Description',
										inputDomain: 'description'
									},
									model: 'description',
									sortOrder: 1
								},
								{
									gid: 'baseGroup',
									rid: 'remark',
									label$tr$: 'cloud.common.entityRemark',
									type: 'remark',
									model: 'remark',
									sortOrder: 2
								},
								{
									gid: 'baseGroup',
									rid: 'schedule',
									label$tr$: 'scheduling.main.schedule',
									type: 'code',
									model: 'scheduleCode',
									readonly: true,
									sortOrder: 3
								},
								{
									gid: 'baseGroup',
									rid: 'schedule',
									label$tr$: 'scheduling.main.baseline',
									type: 'directive',
									directive: 'baseline-list-directive',
									model: 'baseline',
									sortOrder: 4
								}
							]
						},
						handleOK: function handleOK(result) {
							var action = {
								Action: 1,
								EffectedItemId: schedule.Id,
								Baselines: [{
									Description: result.data.description,
									Remark: result.data.remark,
									BasCompanyFk: result.data.company,
									PsdScheduleFk: result.data.schedule
								}]
							};
							if (platformDataServiceModificationTrackingExtension.hasModifications(schedulingMainService)) {
								schedulingMainService.updateWithPostProcess(action).then(function (response) {
									schedulingMainService.baselineCreated.fire(response.data);
									platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage(title);
								});
							} else {
								$http.post(globals.webApiBaseUrl + 'scheduling/main/activity/execute', action
								).then(function (response) {
									schedulingMainService.baselineCreated.fire(response.data);
									platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage(title);
								});
							}
						}
					};

					platformTranslateService.translateFormConfig(modalCreateBaselineConfig.formConfiguration);

					modalCreateBaselineConfig.scope = platformSidebarWizardConfigService.getCurrentScope();
					platformModalFormConfigService.showDialog(modalCreateBaselineConfig);

				}
			};

			service.createJobForImportMethod = function createJobForImportMethod() {
				function importFile(calculateSchedule, overWriteSchedule, overWriteScheduleQuantity, result) {
					let schedule = schedulingMainService.getSelectedSchedule();
					let scheduleId;
					if (schedule) {
						scheduleId = schedule.Id;
					}
					let fileUpload = angular.element('<input type="file" accept=".xml"/>');
					if (fileUpload) {
						fileUpload.bind('change', function () {
							let file = fileUpload[0].files[0];
							if (file !== undefined) {
								if (file.name.substr(file.name.lastIndexOf('.')).toLowerCase() !== '.xml') {
									platformModalService.showErrorBox('scheduling.main.importMSProjectError', 'scheduling.main.createJobForImportMethod');
								} else {
									let basicsCommonSimpleUploadService = $injector.get('basicsCommonSimpleUploadService');
									basicsCommonSimpleUploadService.uploadFile(file, {
										basePath: 'scheduling/main/importneu/',
										chunkSize: 1024 * 1024 * 10,
										customRequest: {
											InputUrl: file.name,
											ScheduleId: scheduleId,
											ProjectId: schedule.ProjectFk,
											Calculate: calculateSchedule,
											Overwrite: overWriteSchedule,
											OverwriteOnlyQuantity: overWriteScheduleQuantity,
											OriginalFileName: file.Name,
											JobRepeatCount: result.data.jobRepeatCount,
											JobRepeatUnit: result.data.jobRepeatUnit,
											StartDate: result.data.startTime.utc()

										}
									}).then(
											function (success) {
												let postData = {
													InputUrl: file.name,
													ScheduleId: scheduleId,
													ProjectId: schedule.ProjectFk,
													Calculate: calculateSchedule,
													Overwrite: overWriteSchedule,
													OverwriteOnlyQuantity: overWriteScheduleQuantity,
													OriginalFileName: file.Name,
													JobRepeatCount: result.data.jobRepeatCount,
													JobRepeatUnit: result.data.jobRepeatUnit,
													StartDate: result.data.startTime.utc()
												};
												$http.post(globals.webApiBaseUrl + 'scheduling/main/activity/createjobforimport', postData);

												$rootScope.$broadcast('asyncInProgress', false);
												$log.log(success);
												// success#
												let modalOptions = {
													headerTextKey: 'scheduling.main.createJobForImportMethod',
													bodyTextKey: success.Info,
													download: 'ImportProtocol-' + platformCreateUuid() + '.txt',
													showOkButton: true,
													showCancelButton: true,
													resizeable: true,
													height: '500px',
													bodyTemplateUrl: globals.appBaseUrl + 'scheduling.main/templates/importlogmessages.html',
													customButtons: [{
														id: 'saveAs',
														caption: $translate.instant('cloud.desktop.filterdefSaveSaveBnt'),
														autoClose: false,
														// cssClass: 'app-icons ico-test',
														fn: function (button, event, closeFn) {
															save(modalOptions);
															closeFn();
														}
													}]
												};

												let platformModalService = $injector.get('platformModalService');
												platformModalService.showDialog(modalOptions);
												schedulingMainService.load();
											},
											function (failure) {
												$rootScope.$broadcast('asyncInProgress', false);
												$log.log(failure);
												schedulingMainService.load();
											}
									);
								}
							}
						}).bind('destroy', function () {
							fileUpload.unbind('change');
						});
						fileUpload.click();
					}
				}

				let schedule = schedulingMainService.getSelectedSchedule();
				if (platformSidebarWizardCommonTasksService.assertSelection(schedule, 'scheduling.main.createJobForImportMethod')) {

					let entity = {
						calculateSchedule: false,
						overWriteSchedule: false,
						overWriteScheduleQuantity: false,
						InputUrl: '',
						ScheduleId: null,
						ProjectId: null,
						jobRepeatCount: null,
						jobRepeatUnit: null,
						startTime: moment()
					};

					let importFileConfig = {
						title: $translate.instant('scheduling.main.createJobForImportMethod'),
						// resizeable: true,
						dataItem: entity,
						formConfiguration: {
							fid: 'scheduling.main.importFileModal',
							version: '1.0.0',
							showGrouping: false,
							groups: [
								{
									gid: 'baseGroup',
									attributes: ['calculateschedule', 'overwriteschedule']
								}
							],
							rows: [
								{
									gid: 'baseGroup',
									rid: 'calculateSchedule',
									model: 'calculateSchedule',
									sortOrder: 2,
									label$tr$: 'scheduling.main.calculateSchedule',
									type: 'boolean'
								},
								{
									gid: 'baseGroup',
									rid: 'overwrite',
									model: 'overWriteSchedule',
									sortOrder: 1,
									label$tr$: 'scheduling.main.overWriteSchedule',
									type: 'boolean'
								},
								{
									gid: 'baseGroup',
									rid: 'repeatUnit',
									label: 'Repeat Unit',
									label$tr$: 'services.schedulerui.columns.repeatunit',
									type: 'select',
									model: 'jobRepeatUnit',
									options: {
										displayMember: 'description',
										valueMember: 'Id',
										items: [{Id: 0, description: 'None'},
											{Id: 1, description: 'Every Minute'},
											{Id: 2, description: 'Hourly'},
											{Id: 3, description: 'Daily'},
											{Id: 4, description: 'Weekly'},
											{Id: 5, description: 'Monthly'}],
									},
									sortOrder: 3
								}, {
									gid: 'baseGroup',
									rid: 'repeatCount',
									label: 'Repeat Count',
									label$tr$: 'services.schedulerui.columns.repeatcount',
									type: 'integer',
									model: 'jobRepeatCount',
									sortOrder: 4
								},
								{
									gid: 'baseGroup',
									rid: 'startTime',
									label: 'Start Time',
									label$tr$: 'services.schedulerui.columns.starttime',
									type: 'datetime',
									model: 'startTime',
									sortOrder: 5
								}

							]
						},
						handleOK: function handleOK(result) {// result not used
							importFile(entity.calculateSchedule, entity.overWriteSchedule, entity.overWriteScheduleQuantity, result);
						},
						handleCancel: function handleCancel() {// result not used
						}
					};

					platformTranslateService.translateFormConfig(importFileConfig.formConfiguration);
					platformModalFormConfigService.showDialog(importFileConfig);

				}
			};


			service.performanceSheet = function performanceSheet() {
				var performanceSheetConfig;
				var performanceSheetAction = 20;
				var selected = schedulingMainService.getSelected();
				var title = 'scheduling.main.applyPerformanceSheet';

				if (selected && !!selected.Id && !!selected.ScheduleFk) {
					performanceSheetConfig = {
						title: $translate.instant(title),
						dataItem: {
							Action: performanceSheetAction,
							ScheduleId: selected.ScheduleFk,
							PerformanceSheet: {
								NotStarted: true,
								Started: false,
								FinishedActivities: false
							}
						},
						formConfiguration: {
							fid: 'scheduling.main.performanceSheet',
							version: '0.2.4',
							showGrouping: false,
							groups: [
								{
									gid: 'baseGroup',
									attributes: ['PerformanceSheet.NotStarted', 'PerformanceSheet.Started', 'PerformanceSheet.FinishedActivities']
								}
							],
							rows: [
								{
									gid: 'baseGroup',
									rid: 'notstarted',
									label$tr$: 'scheduling.main.notStarted',
									type: 'boolean',
									model: 'PerformanceSheet.NotStarted',
									visible: true,
									sortOrder: 1
								},
								{
									gid: 'baseGroup',
									rid: 'started',
									label$tr$: 'scheduling.main.started',
									type: 'boolean',
									model: 'PerformanceSheet.Started',
									visible: true,
									sortOrder: 2
								},
								{
									gid: 'baseGroup',
									rid: 'finishedactivities',
									label$tr$: 'scheduling.main.finishedActivities',
									type: 'boolean',
									model: 'PerformanceSheet.FinishedActivities',
									sortOrder: 3
								}
							]
						},
						handleOK: function handleOK(actionDto) {
							$http.post(globals.webApiBaseUrl + 'scheduling/main/activity/execute', actionDto.data
							).then(function () {// response not used
								// schedulingMainService.reload();
								var modalOptions = {
									headerText: $translate.instant(title),
									bodyText: $translate.instant('scheduling.main.performanceSheetWasExecuted'),
									iconClass: 'ico-info'
								};
								platformModalService.showDialog(modalOptions);
								schedulingMainService.reload();
							});
						}
					};
					platformTranslateService.translateFormConfig(performanceSheetConfig.formConfiguration);
					platformModalFormConfigService.showDialog(performanceSheetConfig);
				} else {
					// Error MessageText
					var modalOptions = {
						headerText: $translate.instant(title),
						bodyText: $translate.instant('cloud.common.noCurrentSelection'),
						iconClass: 'ico-info'
					};
					platformModalService.showDialog(modalOptions);
				}

			};

			function assertBaselines(modalDeleteBaselineConfig) {
				var serv = $injector.get('schedulingMainBaselineService');
				return serv.load().then(function () {
					_.forEach(serv.getList(), function (baseline) {
						baseline.Delete = false;
						modalDeleteBaselineConfig.dataItems.push(baseline);
					});
				});
			}

			service.deleteBaseline = function deleteBaseline() {
				var modalDeleteBaselineConfig = {
					title: $translate.instant('scheduling.main.deleteBaseline'),
					dataItems: [],
					gridConfiguration: {}
				};
				var schedule = schedulingMainService.getSelectedSchedule();

				if (platformSidebarWizardCommonTasksService.assertSelection(schedule)) {
					assertBaselines(modalDeleteBaselineConfig).then(function () {
						if (modalDeleteBaselineConfig.dataItems.length === 0) {
							var modalOptions = {
								headerText: $translate.instant('scheduling.main.deleteBaseline'),
								bodyText: '',
								iconClass: 'ico-info'
							};
							modalOptions.bodyText = $translate.instant('scheduling.main.noBaseLinesMsg');
							platformModalService.showDialog(modalOptions);
						} else {
							var gridConf = schedulingMainBaselineConfigurationService.getStandardConfigForListView();
							modalDeleteBaselineConfig.gridConfiguration.columns = _.union([{
								field: 'Delete',
								editor: 'boolean',
								formatter: 'boolean',
								id: 'useinsplit',
								name: 'Delete',
								name$tr$: 'scheduling.main.entityDelete',
								toolTip: 'Delete',
								toolTip$tr$: 'scheduling.main.entityDelete'
							}], gridConf.columns);

							modalDeleteBaselineConfig.gridConfiguration.uuid = 'b752383d74574ad0bd8b7624a82057ff';
							modalDeleteBaselineConfig.gridConfiguration.version = '1.0.0';

							modalDeleteBaselineConfig.handleOK = function handleDeleteBaseline(result) {
								var action = {
									Action: 12,
									Baselines: _.filter(result.data, function (cand) {
										return cand.Delete;
									})
								};

								$http.post(globals.webApiBaseUrl + 'scheduling/main/activity/execute', action
								).then(function (response) {
									schedulingMainService.baselineCreated.fire(response.data);
									platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage('scheduling.main.deleteBaseline');
								});
							};

							platformTranslateService.translateGridConfig(modalDeleteBaselineConfig.gridConfiguration.columns);

							modalDeleteBaselineConfig.scope = platformSidebarWizardConfigService.getCurrentScope();
							platformModalGridConfigService.showDialog(modalDeleteBaselineConfig);
						}
					});
				}
			};

			service.splitActivityByLocations = function splitActivityByLocations() {
				var locMainService, locConfService, n, prjID, locGridConfig, modalSplitActivitiesByLocations;
				var activity = schedulingMainService.getSelected();
				var usedLocations;

				if (platformSidebarWizardCommonTasksService.assertSelection(activity, 'scheduling.main.splitActivityByLocations')) {
					modalSplitActivitiesByLocations = {
						dialogOptions: {
							headerTextKey: 'scheduling.main.splitActivityByLocations',
							templateUrl: globals.appBaseUrl + 'scheduling.main/templates/wizard/scheduling-location-wizard-dialog.html',
							width: '700px',
							resizeable: true
						},
						title: $translate.instant('scheduling.main.splitActivityByLocations'),
						dataItems: [],// location
						relations: {
							Create: true,
							RelationKindFk: 1,
							FixLagTime: 0,
							FixLagPercent: 0,
							VarLagTime: 0,
							VarLagPercent: 0
						},
						parentProp: 'Parent',
						childProp: 'Children',
						gridConfiguration: {
							uuid: 'F8CAA4AB734A42FFADDE0425E0CAA30B',
							version: '0.2.4',
							skipPermissionCheck: true,
							columns: [
								{
									field: 'useInSplit',
									editor: 'boolean',
									formatter: 'boolean',
									id: 'useinsplit',
									name: 'Use',
									name$tr$: 'scheduling.main.entityUse',
									toolTip: 'Use',
									toolTip$tr$: 'scheduling.main.entityUse'
								}
							]
						},
						tools: {
							showTitles: false,
							cssClass: 'tools',
							items: [
								{
									id: 'moveUp',
									caption: $translate.instant('procurement.pricecomparison.moveUp'),
									iconClass: 'tlb-icons ico-grid-row-up',
									type: 'item',
									fn: angular.noop
								},
								{
									id: 'moveDown',
									caption: $translate.instant('procurement.pricecomparison.moveDown'),
									iconClass: 'tlb-icons ico-grid-row-down',
									type: 'item',
									fn: angular.noop
								}
							]
						},
						handleMoveDown: function MoveLocationDown(gridApi, uid) {
							var row = gridApi.rows.selection({
								gridId: uid
							});
							row = _.isArray(row) ? row[0] : row;
							if (row && row.Id) {
								var siblings = null;
								if (row.ParentEntity && row.ParentEntity.Id) {
									siblings = row.ParentEntity.Children;
								} else {
									siblings = usedLocations;
								}
								var rowIndex = siblings.indexOf(row);
								if (rowIndex < siblings.length - 1) {
									siblings[rowIndex] = siblings[rowIndex + 1];
									siblings[rowIndex + 1] = row;

									gridApi.items.data(uid, usedLocations);
									gridApi.rows.selection({
										gridId: uid,
										rows: [row]
									});
								}
							}
						},
						handleMoveUp: function MoveLocationUp(gridApi, uid) {
							var row = gridApi.rows.selection({
								gridId: uid
							});
							row = _.isArray(row) ? row[0] : row;
							if (row && row.Id) {
								var siblings = null;
								if (row.ParentEntity && row.ParentEntity.Id) {
									siblings = row.ParentEntity.Children;
								} else {
									siblings = usedLocations;
								}
								var rowIndex = siblings.indexOf(row);
								if (rowIndex >= 1) {
									var prevRow = siblings[rowIndex - 1];
									siblings[rowIndex - 1] = row;
									siblings[rowIndex] = prevRow;

									gridApi.items.data(uid, usedLocations);
									gridApi.rows.selection({
										gridId: uid,
										rows: [row]
									});
								}
							}
						},
						handleOK: function handleOK(result) {

							var action = {
								Action: 2,
								EffectedItemId: activity.Id,
								Location: {
									LocID: 0,
									Code: '',
									Children: []
								},
								RelationShip: result.relData.Create ? result.relData : null
							};

							var locCount = createLocDTOEntries(action.Location, result.locData, 0);

							if (locCount > 0) {
								schedulingMainService.updateWithPostProcess(action);
							}
						}
					};

					locConfService = $injector.get('projectLocationStandardConfigurationService');

					locGridConfig = locConfService.getStandardConfigForListView();
					for (n = 0; n < 3; ++n) {
						modalSplitActivitiesByLocations.gridConfiguration.columns.push(locGridConfig.columns[n]);
					}

					prjID = schedulingMainService.getSelectedProjectId();
					locMainService = $injector.get('projectLocationMainService');
					locMainService.getLocationStructure(prjID).then(function (ret) {
						_.forEach(ret.data, function (loc) {
							createLocTableEntry(loc, modalSplitActivitiesByLocations);
						});

						platformTranslateService.translateGridConfig(modalSplitActivitiesByLocations.gridConfiguration);

						modalSplitActivitiesByLocations.scope = platformSidebarWizardConfigService.getCurrentScope();
						usedLocations = modalSplitActivitiesByLocations.dataItems;

						platformModalGridConfigService.setConfig(modalSplitActivitiesByLocations);

						platformModalService.showDialog(modalSplitActivitiesByLocations.dialogOptions).then(function (result) {
							if (result.yes) {
								modalSplitActivitiesByLocations.handleOK(result.data);
							}
						});
					});
				}
			};

			function save(customModalOptions) {
				var link;

				link = angular.element(document.querySelector('#downloadLink'));

				var arr = [];
				arr.push(customModalOptions.bodyText.replace(/<br\/>/g, '\n\r'));
				var blob = new Blob(arr);
				if (window.navigator.msSaveOrOpenBlob) {
					window.navigator.msSaveOrOpenBlob(blob, customModalOptions.download);
				} else {
					link[0].href = URL.createObjectURL(blob);
					link[0].download = customModalOptions.download;
					link[0].target = '_blank';
					link[0].click();// call click function
				}
			}

			service.importFromBaseline = function importFromBaseline() {
				var schedule = schedulingMainService.getSelectedSchedule();
				if (platformSidebarWizardCommonTasksService.assertSelection(schedule, 'scheduling.main.exportToMSProject')) {
					$http({
						method: 'GET',
						url: globals.webApiBaseUrl + 'scheduling/main/import/importfrombaseline?scheduleId=' + schedule.Id + '&projectId=' + schedule.ProjectFk
					})
							.then(function (success) {
										$rootScope.$broadcast('asyncInProgress', false);
										$log.log(success);
										// success#
										var modalOptions = {
											headerTextKey: 'scheduling.main.importFromBaseline',
											bodyTextKey: success.data,
											download: 'ImportProtocol-' + platformCreateUuid() + '.txt',
											showOkButton: true,
											showCancelButton: true,
											resizeable: true,
											height: '500px',
											bodyTemplateUrl: globals.appBaseUrl + 'scheduling.main/templates/importlogmessages.html',
											customButtons: [{
												id: 'saveAs',
												caption: $translate.instant('cloud.desktop.filterdefSaveSaveBnt'),
												autoClose: false,
												// cssClass: 'app-icons ico-test',
												fn: function (button, event, closeFn) {
													save(modalOptions);
													closeFn();
												}
											}]
										};

										platformModalService.showDialog(modalOptions);
										schedulingMainService.load();
									},
									function (failure) {
										$rootScope.$broadcast('asyncInProgress', false);
										$log.log(failure);
										schedulingMainService.load();
									}
							);
				}
			};

			service.importMSProject = function importMSProject() {
				function onSuccess(success) {
					// $rootScope.$broadcast('asyncInProgress', false);
					// $log.log(success);
					// success#
					let modalOptions = {
						headerTextKey: 'scheduling.main.importMSProject',
						bodyTextKey: success.Info,
						download: 'ImportProtocol-' + platformCreateUuid() + '.txt',
						showOkButton: true,
						showCancelButton: true,
						resizeable: true,
						height: '500px',
						bodyTemplateUrl: globals.appBaseUrl + 'scheduling.main/templates/importlogmessages.html',
						customButtons: [{
							id: 'saveAs',
							caption: $translate.instant('cloud.desktop.filterdefSaveSaveBnt'),
							autoClose: false,
							// cssClass: 'app-icons ico-test',
							fn: function (button, event, closeFn) {
								save(modalOptions);
								closeFn();
							}
						}]
					};

					platformModalService.showDialog(modalOptions);
					schedulingMainService.load();

				}

				function importFile(calculateSchedule, overWriteSchedule, overWriteScheduleQuantity) {
					let schedule = schedulingMainService.getSelectedSchedule();
					let scheduleId;
					if (schedule) {
						scheduleId = schedule.Id;
					}
					let fileUpload = angular.element('<input type="file" accept=".xml"/>');
					if (fileUpload) {
						fileUpload.bind('change', function () {
							let file = fileUpload[0].files[0];
							if (file !== undefined) {
								if (file.name.substr(file.name.lastIndexOf('.')).toLowerCase() !== '.xml') {
									platformModalService.showErrorBox('scheduling.main.importMSProjectError', 'scheduling.main.importMSProject');
								} else {
									let basicsCommonSimpleUploadService = $injector.get('basicsCommonSimpleUploadService');
									basicsCommonSimpleUploadService.uploadFile(file, {
										basePath: 'scheduling/main/importneu/',
										chunkSize: 1024 * 1024 * 10,
										customRequest: {
											ScheduleId: scheduleId,
											ProjectId: schedule.ProjectFk,
											Calculate: calculateSchedule,
											Overwrite: overWriteSchedule,
											OverwriteOnlyQuantity: overWriteScheduleQuantity,
											OriginalFileName: file.Name,
											StartImport: false
										}
									}).then(
											function (success) {
												// $rootScope.$broadcast('asyncInProgress', false);
												// $log.log(success);
												let textExisting = '';
												let textNew = '';
												_.forEach(success.AllCalendars, function (value, key) {
													if (value) {
														textExisting += key + '<br/>';
													} else {
														textNew += key + '<br/>';
													}
												});
												let modalOptions = {
													headerTextKey: 'scheduling.main.importMSProject',
													bodyTemplateUrl: globals.appBaseUrl + 'scheduling.main/templates/wizard/scheduling-import-activities-info-dialog.html',
													bodyText1: textExisting + '<br/>',
													bodyText2: textNew,
													showOkButton: true,
													okBtnText: $translate.instant('scheduling.main.okBtn'),
													showCancelButton: true,
													cancelBtnText: $translate.instant('scheduling.main.cancelBtn'),
													resizeable: true,
													height: '400px'
												};
												platformModalService.showDialog(modalOptions).then(function (result) {
													if (result && result.ok) {
														let file = fileUpload[0].files[0];
														basicsCommonSimpleUploadService.uploadFile(file, {
															basePath: 'scheduling/main/importneu/',
															chunkSize: 1024 * 1024 * 10,
															customRequest: {
																ScheduleId: scheduleId,
																ProjectId: schedule.ProjectFk,
																Calculate: calculateSchedule,
																Overwrite: overWriteSchedule,
																OverwriteOnlyQuantity: overWriteScheduleQuantity,
																OriginalFileName: file.Name,
																StartImport: true
															}
														}).then(function (success) {
																	onSuccess(success);
																},
																function (failure) {
																	// $rootScope.$broadcast('asyncInProgress', false);
																	// $log.log(failure);
																	schedulingMainService.load();
																}
														);
													}
												});
											});
								}
							}
						}).bind('destroy', function () {
							fileUpload.unbind('change');
						});
						fileUpload.click();
					}
				}

				let schedule = schedulingMainService.getSelectedSchedule();
				if (platformSidebarWizardCommonTasksService.assertSelection(schedule, 'scheduling.main.importMSProject')) {

					let entity = {
						calculateSchedule: false,
						overWriteSchedule: false,
						overWriteScheduleQuantity: false
					};

					let importFileConfig = {
						title: $translate.instant('scheduling.main.importMSProject'),
						// resizeable: true,
						dataItem: entity,
						formConfiguration: {
							fid: 'scheduling.main.importFileModal',
							version: '1.0.0',
							showGrouping: false,
							groups: [
								{
									gid: 'baseGroup',
									attributes: ['calculateschedule', 'overwriteschedule']
								}
							],
							rows: [
								{
									gid: 'baseGroup',
									rid: 'calculateSchedule',
									model: 'calculateSchedule',
									sortOrder: 2,
									label$tr$: 'scheduling.main.calculateSchedule',
									type: 'boolean'
								},
								{
									gid: 'baseGroup',
									rid: 'overwrite',
									model: 'overWriteSchedule',
									sortOrder: 1,
									label$tr$: 'scheduling.main.overWriteSchedule',
									type: 'boolean'
								}
							]
						},
						handleOK: function handleOK() {// result not used
							importFile(entity.calculateSchedule, entity.overWriteSchedule, entity.overWriteScheduleQuantity);
						},
						handleCancel: function handleCancel() {// result not used
						}
					};

					platformTranslateService.translateFormConfig(importFileConfig.formConfiguration);
					platformModalFormConfigService.showDialog(importFileConfig);

				}
			};

			service.exportToMSProject = function exportToMSProject() {
				var defer;
				var schedule = schedulingMainService.getSelectedSchedule();

				if (platformSidebarWizardCommonTasksService.assertSelection(schedule, 'scheduling.main.exportToMSProject')) {

					defer = $q.defer();
					$rootScope.$broadcast('asyncInProgress', true);
					$http.get(globals.webApiBaseUrl + 'scheduling/main/export/toproject?scheduleId=' + schedulingMainService.getSelectedSchedule().Id)
							.then(function (response) {

								$rootScope.$broadcast('asyncInProgress', false);
								var template, link, content, markup;
								defer.resolve(response.data);

								template = '<a id="downloadLink" href="" download="" style="visibility: hidden;"></a>';
								markup = angular.element(document.querySelector('#sidebar-wrapper'));
								markup.append(template);

								link = angular.element(document.querySelector('#downloadLink'));
								if (link !== undefined && link.length > 0 && (schedulingMainService !== null) && (schedulingMainService.getSelectedSchedule().Id > 0)) {
									// link[0].href = globals.webApiBaseUrl + 'scheduling/main/export/gettoproject?filename=' + response.data.Path;
									link[0].href = response.data;
									content = response.headers()['content-disposition'];
									link[0].download = content.substr(content.indexOf('filename=') + 9);
									// console.log(link[0].href);
									link[0].click();
								}

							}, function (error) {

								$rootScope.$broadcast('asyncInProgress', false);
								// console.log('fail to export data');
								defer.reject(error);
								defer = null;
							});
					return defer.promise;
				} else {
					return null;
				}
			};

			service.exportToITWOBaseline = function exportToITWOBaseline() {
				var schedule = schedulingMainService.getSelectedSchedule();
				var defer;

				if (platformSidebarWizardCommonTasksService.assertSelection(schedule, 'scheduling.main.exportToiTWO')) {

					defer = $q.defer();
					$rootScope.$broadcast('asyncInProgress', true);

					$http.get(globals.webApiBaseUrl + 'scheduling/main/export/toitwobaseline?scheduleId=' + schedulingMainService.getSelectedSchedule().Id)
							.then(function () {
								$rootScope.$broadcast('asyncInProgress', false);
								platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage('scheduling.main.exportToiTWO');
							}, function (error) {
								$rootScope.$broadcast('asyncInProgress', false);
								// console.log('fail to export data');
								defer.reject(error);
								defer = null;
							});
					return defer.promise;
				} else {
					return null;
				}
			};

			service.importPrimavera = function () {
				var schedule = schedulingMainService.getSelectedSchedule();
				schedulingExtSysPrimaveraService.importPrimavera(schedule);
			};

			service.exportToPrimavera = function () {
				var schedule = schedulingMainService.getSelectedSchedule();
				schedulingExtSysPrimaveraService.exportToPrimavera(schedule);
			};

			service.addProgressToScheduledActivities = function addProgressToScheduledActivities() {
				var modalAddProgressConfig;
				var schedule = schedulingMainService.getSelectedSchedule();
				var title = 'scheduling.main.addProgressToScheduleActivity';

				if (platformSidebarWizardCommonTasksService.assertSelection(schedule, 'scheduling.main.addProgressToScheduleActivity')) {
					modalAddProgressConfig = {
						title: $translate.instant(title),
						dataItem: {performancedate: '', portion: '', description: ''},
						formConfiguration: {
							fid: 'scheduling.main.addProgress',
							version: '0.2.4',
							showGrouping: false,
							groups: [
								{
									gid: 'baseGroup',
									attributes: ['setAlternativeActive']
								}
							],
							rows: [
								{
									gid: 'baseGroup',
									rid: 'performancedate',
									label$tr$: 'scheduling.main.entityPerformanceDate',
									type: 'dateutc',
									model: 'performancedate',
									sortOrder: 1
								},
								{
									gid: 'baseGroup',
									rid: 'portion',
									label$tr$: 'scheduling.main.entityPortion',
									type: 'integer',
									model: 'portion',
									sortOrder: 1
								},
								{
									gid: 'baseGroup',
									rid: 'description',
									label$tr$: 'cloud.common.entityDescription',
									type: 'description',
									model: 'description',
									sortOrder: 1
								}
							]
						},
						handleOK: function handleOK(result) {

							var action = {
								Action: 5,
								EffectedItemId: schedule.Id,
								CreateData: {
									ProgressReportDate: result.data.performancedate,
									Description: result.data.description,
									Portion: result.data.portion
								}
							};

							$http.post(globals.webApiBaseUrl + 'scheduling/main/activity/execute', action
							).then(function () {// response not used
								schedulingMainService.reload();
								platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage(title);
							});

						}
					};

					platformTranslateService.translateFormConfig(modalAddProgressConfig.formConfiguration);

					modalAddProgressConfig.scope = platformSidebarWizardConfigService.getCurrentScope();
					platformModalFormConfigService.showDialog(modalAddProgressConfig);
				}
			};

			service.changeActivityStateOfAllActivities = function changeActivityStateOfAllActivities() {

				var list, modalChangeStateActivitiesBySearch;
				var listIds = _.map(schedulingMainService.getList(), 'Id');
				if (listIds.length <= 0) {
					platformSidebarWizardCommonTasksService.showErrorNoSelection('scheduling.main.changeActivityStateOfAllActivities');
					return;
				}

				modalChangeStateActivitiesBySearch = {
					refreshMainService: false,
					title: $translate.instant('scheduling.main.changeActivityStateOfAllActivities'),
					dataItems: [],
					dialogOptions: {
						width: '700px',
						resizeable: true
					},
					gridConfiguration: {
						uuid: '5DF0D73A84CF47FA87B6E3388025A414',
						options: {idProperty: 'Code'},
						version: '0.2.4',
						skipPermissionCheck: true,
						columns: [
							{
								field: 'Icon',
								formatter: 'image',
								formatterOptions: {
									imageSelector: 'platformStatusIconService'
								},
								id: 'icon',
								name: 'Icon',
								name$tr$: 'cloud.common.entityIcon',
								width: 30,
								readonly: true
							},
							{
								field: 'Description',
								formatter: 'description',
								id: 'description',
								name: 'Description',
								name$tr$: 'cloud.common.entityDescription',
								readonly: true
							},
							{
								field: 'IsAutomatic',
								editor: 'boolean',
								formatter: 'boolean',
								id: 'isautomatic',
								name: 'Automatic',
								name$tr$: 'scheduling.main.isAutomatic',
								width: 50
							},
							{
								field: 'IsStarted',
								formatter: 'boolean',
								id: 'isstarted',
								name: 'Started',
								name$tr$: 'scheduling.main.isStarted',
								width: 50,
								readonly: true
							},
							{
								field: 'IsDelayed',
								formatter: 'boolean',
								id: 'isdelayed',
								name: 'Delayed',
								name$tr$: 'scheduling.main.isDelayed',
								width: 50,
								readonly: true
							},
							{
								field: 'IsAhead',
								formatter: 'boolean',
								id: 'isahead',
								name: 'Ahead',
								name$tr$: 'scheduling.main.isAhead',
								width: 50,
								readonly: true
							},
							{
								field: 'IsFinished',
								formatter: 'boolean',
								id: 'isfinished',
								name: 'Finished',
								name$tr$: 'scheduling.main.isFinished',
								width: 50,
								readonly: true
							},
							{
								field: 'IsFinishedDelayed',
								formatter: 'boolean',
								id: 'isfinisheddelayed',
								name: 'Finished Delayed',
								name$tr$: 'scheduling.main.isFinishedDelayed',
								width: 60,
								readonly: true
							}
						]
					},

					handleOK: function handleOK(result) {
						var action = {
							Action: 6,
							// ChangeActivityStateInfo: modalChangeStateActivitiesBySearch.dataItems,
							ChangeActivityStateInfo: result.data,
							ActivityIds: listIds
						};
						$http.post(globals.webApiBaseUrl + 'scheduling/main/activity/execute', action
						).then(function () {// response not used
							platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage('scheduling.main.changeActivityStateOfAllActivities');
							schedulingMainService.gridRefresh();
							schedulingMainService.load();
						});

					}
				};
				let schedule = schedulingMainService.getSelectedSchedule();
				$http.get(globals.webApiBaseUrl + 'scheduling/lookup/getallactivitystates', {
					params: { scheduleId: schedule.Id }
				}).then(function (response) {

					list = _.orderBy(response.data, ['Sorting', 'Code'], [true, true]);

					_.forEach(list, function (item) {
						var newItem = {
							Id: item.Id,
							Code: item.Code,
							Description: item.DescriptionInfo.Translated,
							Icon: item.Icon,
							IsAutomatic: item.Isautomatic,
							IsStarted: item.Isstarted,
							IsDelayed: item.Isdelayed,
							IsAhead: item.Isahead,
							IsFinished: item.Isfinished,
							IsFinishedDelayed: item.Isfinisheddelayed
						};
						var fields = [
							{
								field: 'IsAutomatic',
								readonly: !newItem.IsAutomatic
							}
						];
						platformRuntimeDataService.readonly(newItem, fields);
						modalChangeStateActivitiesBySearch.dataItems.push(newItem);

					});

					platformTranslateService.translateGridConfig(modalChangeStateActivitiesBySearch.gridConfiguration);

					modalChangeStateActivitiesBySearch.scope = platformSidebarWizardConfigService.getCurrentScope();
					platformModalGridConfigService.showDialog(modalChangeStateActivitiesBySearch);
				}, function () {
					// console.log('fail to load activitystate');
				});

			};

			service.criticalPath = function criticalPath() {
				var schedule = schedulingMainService.getSelectedSchedule();

				if (platformSidebarWizardCommonTasksService.assertSelection(schedule, 'scheduling.main.criticalPath')) {
					var action = {
						Action: 7,
						// ChangeActivityStateInfo: modalChangeStateActivitiesBySearch.dataItems,
						EffectedItemId: schedule.Id
					};

					schedulingMainService.updateWithPostProcess(action).then(function (result) {
						platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage('scheduling.main.criticalPath', result.ActionResult);

						return schedulingMainService.load();
					});
				}
			};

			service.rescheduleActivities = function rescheduleActivities() {

				let activity = schedulingMainService.getSelected();

				if (platformSidebarWizardCommonTasksService.assertSelection(activity, 'scheduling.main.rescheduleActivities')) {

					var action = {
						Action: 11,
						EffectedItemId: activity.ScheduleFk
					};

					$http.post(globals.webApiBaseUrl + 'scheduling/main/activity/execute', action)
							.then(function (response) {

								schedulingMainService.calculateActivities(null, response.data);
								schedulingMainService.reload();
								platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage('scheduling.main.rescheduleActivities');
							}, function () {
								console.log('fail to get next activity');
							});

				}
			};

			service.createResourceRequisitionForMaterial = function createResourceRequisitionForMaterial() {
				var activity = schedulingMainService.getSelected();
				if (platformSidebarWizardCommonTasksService.assertSelection(activity, 'scheduling.main.createResourceRequisitionForMaterial')) {
					var action = {
						Action: 18,
						EffectedItemId: activity.Id,
						CreateRequisitionByMaterial: true
					};

					$http.post(globals.webApiBaseUrl + 'scheduling/main/activity/execute', action)
							.then(function () {// response not used
								platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage('scheduling.main.createResourceRequisitionForMaterial');
							}, function () {
								console.log('fail to get next activity');
							});

				}
			};

			service.createResourceRequisitionForResResource = function createResourceRequisitionForResResource() {
				var activity = schedulingMainService.getSelected();
				if (platformSidebarWizardCommonTasksService.assertSelection(activity, 'scheduling.main.createResourceRequisitionForResResource')) {
					var action = {
						Action: 18,
						EffectedItemId: activity.Id,
						CreateRequisitionByResResource: true
					};

					$http.post(globals.webApiBaseUrl + 'scheduling/main/activity/execute', action)
							.then(function () {// response not used
								platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage('scheduling.main.createResourceRequisitionForResResource');
							}, function () {
								console.log('fail to get next activity');
							});

				}
			};
			service.createResourceRequisitionFromScheduling = function createResourceRequisitionFromScheduling() {
				let selectedEstimateHeader = schedulingMainService.getSelectedSchedule();
				let selectedActivities = schedulingMainService.getSelectedEntities();
				let dataItem = {
					selection: {
						fullScheduling: selectedEstimateHeader,
						activities: selectedActivities
					},
					processData: {
						processCostCodes: null,
						processMaterial: null,
						processPlant: null,
						processResResource: null
					},
					aggregation: {
						controllingUnit: null,
						procurementStructure: null
					}
				};

				let checkDisallowNextStep1 = function () {
					return !(!dataItem.selection.fullScheduling || !dataItem.selection.activities);
				};
				let checkDisallowNextStep2 = function () {
					return !(dataItem.processData.processCostCodes || dataItem.processData.processMaterial || dataItem.processData.processPlant || dataItem.processData.inclResources);
				};


				let step1Rows = [
					{
						gid: 'baseGroup',
						rid: 'selection',
						label: 'Create Requisition From',
						type: 'radio',
						model: 'selection',
						required: true,
						canFinish: true,
						options: {
							labelMember: 'Description',
							valueMember: 'Value',
							groupName: 'createResRequisitionSelection',
							items: [
								{
									Id: 1,
									Description: $translate.instant('scheduling.main.createResRequisitionFromSchedulingWizard.fullScheduling'),
									Value: 'fullScheduling'
								},
								{
									Id: 2,
									Description: $translate.instant('scheduling.main.createResRequisitionFromSchedulingWizard.activities'),
									Value: 'activities'
								}
							]
						}
					}
				];

				let step2Rows = [
					{
						gid: 'baseGroup',
						rid: 'processCostCodes',
						title: 'Process',
						label: 'Process Cost Codes to Resource Type',
						label$tr$: 'scheduling.main.createResRequisition',
						type: 'boolean',
						model: 'processData.processCostCodes',
						sortOrder: 1
					},
					{
						gid: 'baseGroup',
						rid: 'processMaterial',
						label: 'Process Material',
						label$tr$: 'scheduling.main.createResRequisition',
						type: 'boolean',
						model: 'processData.processMaterial',
						sortOrder: 2
					},
					{
						gid: 'baseGroup',
						rid: 'processPlant',
						label: 'Process Plant To Resource',
						label$tr$: 'scheduling.main.createResRequisition',
						type: 'boolean',
						model: 'processData.processPlant',
						sortOrder: 3
					},
					{
						gid: 'baseGroup',
						rid: 'processResResource',
						label: 'Process Resources',
						label$tr$: 'scheduling.main.createResRequisition',
						type: 'boolean',
						model: 'processData.processResResource',
						sortOrder: 4
					}
				];

				let step3Rows = [
					{
						gid: 'baseGroup',
						rid: 'controllingUnit',
						label: 'Controlling Unit',
						label$tr$: 'scheduling.main.createResRequisition',
						type: 'boolean',
						model: 'aggregation.controllingUnit',
						sortOrder: 1
					},
					{
						gid: 'baseGroup',
						rid: 'procurementStructure',
						label: 'Procurement Structure',
						label$tr$: 'scheduling.main.createResRequisition',
						type: 'boolean',
						model: 'aggregation.procurementStructure',
						sortOrder: 2
					},
				];

				let createResRequisitionWizard = {
					id: 'estimateWizard',
					title$tr$: 'scheduling.main.createResRequisitionFromSchedulingWizard.title',
					steps: [
						{
							id: 'selection',
							title$tr$: 'scheduling.main.createResRequisitionFromSchedulingWizard.step1Title',
							form: {
								fid: 'scheduling.main.createResRequisition',
								version: '1.0.0',
								showGrouping: false,
								skipPermissionsCheck: true,
								groups: [{
									gid: 'baseGroup',
									attributes: ['createResRequisitionFrom']
								}],
								rows: step1Rows
							},
							disallowBack: true,
							canFinish: false,
							watches: [{
								expression: 'selection',
								fn: function (info) {
									let checkSelection = _.find(info.wizard.steps[0].form.rows, {rid: 'selection'});
									switch (info.newValue) {
										case 'fullScheduling':
											checkSelection.required = true;
											info.wizard.steps[0].disallowNext = checkDisallowNextStep1();
											break;
										case 'activities':
											checkSelection.required = true;
											info.wizard.steps[0].disallowNext = checkDisallowNextStep1();
											break;
										default:
											console.log('Unexpected createRequisitionsValue "${info.newValue}"');
									}
									info.wizard.steps[0].disallowNext = info.wizard.steps[0].canFinish;
									info.scope.$broadcast('form-config-updated');
								}
							}]
						},
						{
							id: 'processData',
							title$tr$: 'scheduling.main.createResRequisitionFromSchedulingWizard.step2Title',
							form: {
								fid: 'scheduling.main.createResRequisition',
								version: '1.0.0',
								showGrouping: false,
								skipPermissionsCheck: true,
								groups: [
									{
										gid: 'baseGroup'
									}
								],
								rows: step2Rows
							},
							disallowBack: false,
							disallowNext: true,
							canFinish: false,
							watches: [{
								expression: 'processData',
								fn: function (info) {
									info.wizard.steps[1].disallowNext = checkDisallowNextStep2();
									info.scope.$broadcast('form-config-updated');
								},
								deep: true
							}],
							/*
							prepareStep: function prepareStep(info) {



								if(info.model.selection === 'fullScheduling' && selectedEstimateHeader === null){
									info.commands.goToPrevious();
									platformModalService.showErrorBox('scheduling.main.createResRequisitionFromSchedulingWizard.ErrorNoFullSchedulingSelected');
								}
								else if(info.model.selection === 'activities' && selectedActivities.length <= 0){
									info.commands.goToPrevious();
									platformModalService.showErrorBox('scheduling.main.createResRequisitionFromSchedulingWizard.ErrorNoActivitiesSelected');
								}
							}

							 */
						},
						{
							id: 'aggregation',
							title$tr$: 'scheduling.main.createResRequisitionFromSchedulingWizard.step3Title',
							form: {
								fid: 'scheduling.main.createResRequisition',
								version: '1.0.0',
								showGrouping: false,
								skipPermissionsCheck: true,
								groups: [
									{
										gid: 'baseGroup'
									}
								],
								rows: step3Rows
							},
							disallowBack: false,
							disallowNext: true,
							canFinish: true,
							watches: []
						}
					]
				};

				platformWizardDialogService.translateWizardConfig(createResRequisitionWizard);
				platformWizardDialogService.showDialog(createResRequisitionWizard, dataItem).then(function (result) {
					if (result.success) {
						const actions = {
							Action: 18,
							ScheduleId: schedulingMainService.getSelectedSchedule() !== null ? schedulingMainService.getSelectedSchedule().Id : null,
							ActivityIds: schedulingMainService.getSelectedEntities().length > 0 ? _.map(schedulingMainService.getSelectedEntities(), 'Id') : null,
							IsFullScheduling: result.data.selection === 'fullScheduling',
							IsSelectedActivities: result.data.selection === 'activities',
							CreateRequisitionByCostCode: result.data.processData.processCostCodes !== null ? result.data.processData.processCostCodes : false,
							CreateRequisitionByMaterial: result.data.processData.processMaterial !== null ? result.data.processData.processMaterial : false,
							CreateRequisitionByPlant: result.data.processData.processPlant !== null ? result.data.processData.processPlant : false,
							CreateRequisitionByResResource: result.data.processData.processResResource !== null ? result.data.processData.processResResource : false,
							GroupByControllingUnit: result.data.aggregation.controllingUnit !== null ? result.data.aggregation.controllingUnit : false,
							GroupByPrcStructure: result.data.aggregation.procurementStructure !== null ? result.data.aggregation.procurementStructure : false
						};

						$http.post(globals.webApiBaseUrl + 'scheduling/main/activity/execute', actions).then(function (result) {
							if (result.data.length > 0) {
								var modalOptions = {
									headerTextKey: 'scheduling.main.createResourceRequisitions',
									bodyTextKey: result.data,
									showOkButton: true,
									showCancelButton: true,
									resizeable: true,
									height: '500px',
									iconClass: 'info'
								};

								platformModalService.showDialog(modalOptions);

							} else {
								platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage(createResRequisitionWizard.title$tr$);
							}
						});
					}
				});
			};


			service.createResourceRequisitionForCostCode = function createResourceRequisitionForCostCode() {
				var activity = schedulingMainService.getSelected();
				if (platformSidebarWizardCommonTasksService.assertSelection(activity, 'scheduling.main.createResourceRequisitionForCostCode')) {
					var action = {
						Action: 18,
						EffectedItemId: activity.Id,
						CreateRequisitionByCostCode: true
					};

					$http.post(globals.webApiBaseUrl + 'scheduling/main/activity/execute', action)
							.then(function () {// response not used
								platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage('scheduling.main.createResourceRequisitionForCostCode');
							}, function () {
								console.log('fail to get next activity');
							});

				}
			};


			service.updateResourceRequisition = function updateResourceRequisition() {
				var schedule = schedulingMainService.getSelectedSchedule();

				if (platformSidebarWizardCommonTasksService.assertSelection(schedule, 'scheduling.main.updateResourceRequisition')) {

					var action = {
						Action: 21,
						EffectedItemId: schedule.Id,
					};

					$http.post(globals.webApiBaseUrl + 'scheduling/main/activity/execute', action)
							.then(function () {// response not used
								// reload requisition grid
								var requisitionService = $injector.get('schedulingMainRequiredByActivityLayoutServiceFactory').getDataService('97a08a10b54a4d609f49ebfb8b55a3e5');
								if (requisitionService) {
									requisitionService.loadSubItemList();
								}
								platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage('scheduling.main.updateResourceRequisition');
							}, function () {
								console.log('fail to get next activity');
							});

				}
			};

			service.createProcurementPackage = function createProcurementPackage() {

				var modalCreateProcurementPackage;
				var activity = schedulingMainService.getSelected();
				var prjId = schedulingMainService.getSelectedProjectId();

				if (platformSidebarWizardCommonTasksService.assertSelection(activity, 'scheduling.main.createPrcPackage')) {
					modalCreateProcurementPackage = {
						dataItem: {
							prcStructureFk: '',
							packageConfiguration: '',
							clerkPrcFk: '',
							packageDesc: '',
							subPackageDesc: ''
						},
						formConfiguration: {
							fid: 'scheduling.main.createPrcPackage',
							version: '0.2.4',
							showGrouping: false,
							groups: [
								{
									gid: 'baseGroup',
									attributes: ['setAlternativeActive']
								}
							],
							rows: [
								{
									gid: 'baseGroup',
									rid: 'prcStructureFk',
									label$tr$: 'scheduling.main.prcStructureFk',
									type: 'directive',
									model: 'prcStructureFk',
									label: 'Procurement Structure',
									// 'validator': validationService.validateDialogStructureFk,
									directive: 'basics-lookupdata-lookup-composite',
									options: {
										readOnly: true,
										lookupDirective: 'basics-procurementstructure-structure-dialog',
										descriptionMember: 'DescriptionInfo.Translated',
										lookupOptions: {
											initValueField: 'StructureCode',
											showClearButton: true
										}
									},
									sortOrder: 1
								},
								{
									gid: 'baseGroup',
									rid: 'portion',
									label$tr$: 'scheduling.main.packageConfiguration',
									type: 'directive',
									model: 'packageConfiguration',
									// 'validator': validationService.validateConfigurationFk,
									directive: 'basics-configuration-configuration-combobox',
									options: {
										filterKey: 'scheduling-create-prc-package-configuration-filter'
									},
									sortOrder: 2
								},
								{
									gid: 'baseGroup',
									rid: 'description',
									label$tr$: 'scheduling.main.clerkPrcFk',
									type: 'directive',
									model: 'clerkPrcFk',
									directive: 'basics-configuration-configuration-combobox',
									options: {
										filterKey: 'procurement-package-clerk-filter'
									},
									sortOrder: 3
								},
								{
									gid: 'baseGroup',
									rid: 'description',
									label$tr$: 'cloud.common.entityPackageDescription',
									type: 'description',
									model: 'packageDesc',
									sortOrder: 4
								},
								{
									gid: 'baseGroup',
									rid: 'description',
									label$tr$: 'cloud.common.entitySubPackageDescription',
									type: 'description',
									model: 'subPackageDesc',
									sortOrder: 5
								}
							]
						},
						handleOK: function handleOK(result) {

							var action = {
								Action: 17,
								ProcurementPackage: {
									ActivityId: activity.Id,
									PrjProjectFk: prjId,
									PrcStructureFk: result.data.prcStructureFk,
									PackageConfiguration: result.data.packageConfiguration,
									ClerkPrcFk: result.data.clerkPrcFk,
									PackageDesc: result.data.packageDesc,
									SubPackageDesc: result.data.subPackageDesc
								}
							};

							$http.post(globals.webApiBaseUrl + 'scheduling/main/activity/execute', action)
									.then(function () {

										platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage('scheduling.main.createPrcPackage');

									}, function () {
									});
						}
					};

					platformTranslateService.translateFormConfig(modalCreateProcurementPackage.formConfiguration);
					modalCreateProcurementPackage.scope = platformSidebarWizardConfigService.getCurrentScope();
					platformModalFormConfigService.showDialog(modalCreateProcurementPackage);

				}
			};

			service.createResourceRequisitions = function createResourceRequisitions() {
				schedulingMainGenerateRequisitionService.showCreateResourceRequisitionWizardDialog();
			};

			service.createMountingActivity = function createMountingActivity() {
				var selected = schedulingMainService.getSelectedEntities();
				var pinnedProject = schedulingMainService.getPinningContext();
				if (selected.length > 0) {
					$injector.get('basicsLookupdataLookupDescriptorService').loadData('EventType').then(function (response) {
						var result = _.find(response, function (eventType) {
							// PpsEntity=1 means mntActivity
							return eventType.PpsEntityFk === 1;
						});
						if (result) {
							if (selected.length === 1 || (selected.length > 1 && pinnedProject)) {
								mntActivityCreationWizardService.showGenerateMntActivityWizardDialog();
							} else {
								platformModalService.showDialog({
									headerTextKey: 'productionplanning.activity.activityWizard.actWizardTitle',
									bodyTextKey: 'productionplanning.activity.activityWizard.noPinnedProjectError',
									iconClass: 'ico-error'
								});
							}
						} else {
							mntActivityCreationWizardService.showInfoDialog('noDefEventTypeError');
						}
					});
				} else {
					mntActivityCreationWizardService.showInfoDialog('noSelectedError');
				}

			};

			service.synchronizeScheduleActivity = function synchronizeScheduleActivity() {
				var selectedItems = schedulingMainService.getSelectedEntities();
				if (selectedItems.length > 0) {
					activitySynchronizeWizardService.showActivitySynchronizeWizardDialog(selectedItems);
				} else {
					mntActivityCreationWizardService.showInfoDialog('noSelectedError');
				}
			};

			var basicsCommonChangeStatus;
			basicsCommonChangeStatus = function basicsCommonChangeStatus() {
				var bCCS = basicsCommonChangeStatusService.provideStatusChangeInstance(
						{
							refreshMainService: false,
							mainService: schedulingMainService,
							statusField: 'ActivityStateFk',
							descField: 'Description',
							projectField: 'ProjectFk',
							title: 'scheduling.main.changeActivityState',
							statusDisplayField: 'Description',
							statusName: 'scheduling',
							updateUrl: 'scheduling/main/activity/changestatus',
							statusProvider: function (entity) {
								let rubricCategoryFk = entity.Schedule && entity.Schedule.RubricCategoryFk
									? entity.Schedule.RubricCategoryFk
									: entity.RubricCategoryFk;
								return basicsLookupdataSimpleLookupService.refreshCachedData({
									valueMember: 'Id',
									displayMember: 'Description',
									lookupModuleQualifier: 'basics.customize.activitystate',

									filter: {
										customIntegerProperty: 'BAS_RUBRIC_CATEGORY_FK',
										field: 'RubricCategoryFk'
									}
								}).then(function (respond) {
									return _.filter(respond, function (item) {
										return (item.RubricCategoryFk === rubricCategoryFk && item.isLive) || (entity.ActivityStateFk === item.Id);
									});
								});
							},
							id: 13
						}
				);
				var fn = bCCS.fn;
				var newFn = function () {
					var selectedActivity = schedulingMainService.getSelected();
					if (selectedActivity && schedulingMainService.getSelected().ActivityTypeFk === schedulingMainConstantValues.activity.transientRootActivityTypeFk) {
						platformModalService.showMsgBox('scheduling.main.notPossibleChangeActivityStateOfRoot', 'scheduling.main.changeActivityState', 'info');
					} else {
						return fn();
					}
				};
				bCCS.fn = newFn;
				return bCCS;
			};
			service.basicsCommonChangeStatus = basicsCommonChangeStatus().fn;

			var documentProjectDocumentsStatusChange;
			documentProjectDocumentsStatusChange = function documentProjectDocumentsStatusChange() {
				return documentProjectDocumentsStatusChangeService.provideStatusChangeInstance(schedulingMainService, 'scheduling.main');
			};
			service.documentProjectDocumentsStatusChange = documentProjectDocumentsStatusChange().fn;

			var options = {
				translate: ''
			};

			var updatePlannedBySchedule = function updatePlannedBySchedule() {
				options.translate = 'Update Planned By Schedule';
				schedulingMainQuantityUnitDataOriginWizardService.updateQuantityUnitDataOrigin(options);
			};

			var updatePlannedByActivity = function updatePlannedByActivity() {
				options.translate = 'Update Planned By Activity';
				schedulingMainQuantityUnitDataOriginWizardService.updateQuantityUnitDataOrigin(options);
			};

			var updateInstalledBySchedule = function updateInstalledBySchedule() {
				options.translate = 'Update Installed By Schedule';
				schedulingMainQuantityUnitDataOriginWizardService.updateQuantityUnitDataOrigin(options);
			};

			var updateInstalledByActivity = function updateInstalledByActivity() {
				options.translate = 'Update Installed By Activity';
				schedulingMainQuantityUnitDataOriginWizardService.updateQuantityUnitDataOrigin(options);
			};

			var updateActivityQuantity = function updateActivityQuantity() {
				var selectedActivity = schedulingMainService.getSelected(),
						title = 'scheduling.main.updateActivityQuantity',
						msg = $translate.instant('scheduling.main.noCurrentActivitySelection');

				function updateQuantity(data) {
					$http.post(globals.webApiBaseUrl + 'scheduling/main/activity/updateactivityquantity', data).then(function (response) {
						schedulingMainService.calculateActivities(null, response.data);
						schedulingMainService.load().then(function () {
							schedulingMainService.setSelected({}).then(function () {
								schedulingMainService.setSelected(data.selectedItem);
								platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage('scheduling.main.updatedQuantity');
							});
						});
					});
				}

				var updateActivityQuantityConfig = {
					title: $translate.instant(title),
					dataItem: {
						scheduleScope: 'EntireSchedule',
						selectedItem: 'IsPes',
						isUpdateLineItem: false
					},
					formConfiguration: {
						fid: 'scheduling.main.updateActivityQuantity',
						version: '0.1.1',
						showGrouping: false,
						groups: [
							{
								gid: 'baseGroup',
								attributes: ['selecteditem']
							}
						],
						'overloads': {},
						rows: [
							{
								gid: 'baseGroup',
								rid: 'ScheduleScope',
								label: 'Select Schedule Scope',
								label$tr$: 'scheduling.main.selectScheduleScope',
								type: 'radio',
								model: 'scheduleScope',
								options: {
									labelMember: 'Description',
									valueMember: 'Value',
									groupName: 'selectActivityQuantityConfig',
									items: [
										{
											Id: 1,
											Description: $translate.instant('scheduling.main.entireSchedule'),
											Value: 'EntireSchedule'
										},
										{
											Id: 2,
											Description: $translate.instant('scheduling.main.selectedActivity'),
											Value: 'SelectedActivities'
										}
									]
								}
							},
							{
								gid: 'baseGroup',
								rid: 'updateActivityQuantity',
								label: 'Update Activity Quantity',
								label$tr$: 'scheduling.main.updateActivityQuantity',
								type: 'radio',
								model: 'selectedItem',
								options: {
									labelMember: 'Description',
									valueMember: 'Value',
									groupName: 'updateActivityQuantityConfig',
									items: [
										{Id: 1, Description: $translate.instant('scheduling.main.fromPes'), Value: 'IsPes'},
										{Id: 2, Description: $translate.instant('scheduling.main.fromWip'), Value: 'IsWip'}
									]
								},
								sortOrder: 1
							},
							{
								gid: 'baseGroup',
								rid: 'updateLineItemQuantity',
								label: 'Update LineItem Quantity',
								label$tr$: 'scheduling.main.updateLineItemQuantity',
								type: 'boolean',
								model: 'isUpdateLineItem',
								sortOrder: 2
							}
						]
					},
					handleOK: function handleOK(result) {
						if (result && result.ok && result.data) {
							var schedule = schedulingMainService.getSelectedSchedule();
							var postData = {
								'ScheduleId': selectedActivity ? selectedActivity.ScheduleFk : schedule ? schedule.Id : null,
								'IsWip': result.data.selectedItem === 'IsWip',
								'IsPes': result.data.selectedItem === 'IsPes',
								'IsUpdateLineItem': result.data.isUpdateLineItem
							};
							postData.selectedItem = schedulingMainService.getSelected();

							if (result.data.scheduleScope === 'SelectedActivities') {
								if (platformSidebarWizardCommonTasksService.assertSelection(selectedActivity, title, msg)) {
									var selectedItems = schedulingMainService.getSelectedEntities();
									postData.ActivityIds = selectedItems && selectedItems.length ? _.map(selectedItems, 'Id') : null;
									updateQuantity(postData);
								}
							} else {
								updateQuantity(postData);
							}
						}
					}
				};
				platformTranslateService.translateFormConfig(updateActivityQuantityConfig.formConfiguration);
				updateActivityQuantityConfig.scope = platformSidebarWizardConfigService.getCurrentScope();
				platformModalFormConfigService.showDialog(updateActivityQuantityConfig);
			};

			service.updateActivityQuantity = updateActivityQuantity;

			service.assignAllCUs = function assignAllCUs() {
				var schedule = schedulingMainService.getSelectedSchedule();

				if (platformSidebarWizardCommonTasksService.assertSelection(schedule, 'scheduling.main.assignCUsByTemplate')) {
					var dialogConfig = {
						title: 'scheduling.main.assignCUs',
						dataItem: {
							isByTemplate: true,
							isOverwriteCuInActivity: false,
							IsFromActivityToLineItem: false,
							isOverwriteCuInLineItem: false
						},
						formConfiguration: {
							fid: 'scheduling.main.assignCusByTemplate',
							version: '1.0.0',
							showGrouping: true,
							groups: [
								{
									gid: 'baseCU',
									header: 'Assign Controlling Units from Template in Activity',
									header$tr$: 'scheduling.main.assignCusByTemplate',
									isOpen: true,
									visible: true,
									sortOrder: 1
								},
								{
									gid: 'baseLI',
									header: 'Assign Controlling Units of Activity to belonging Line Items',
									header$tr$: 'scheduling.main.assignCusToLineItem',
									isOpen: true,
									visible: true,
									sortOrder: 2
								}
							],
							rows: [
								{
									gid: 'baseCU',
									rid: 'isByTemplate',
									label$tr$: 'scheduling.main.isByTemplate',
									type: 'boolean',
									model: 'isByTemplate',
									label: 'assign controlling units from template to activity',
									sortOrder: 1
								},
								{
									gid: 'baseCU',
									rid: 'isOverwriteCuInActivity',
									label$tr$: 'scheduling.main.isOverwriteCuInActivity',
									type: 'boolean',
									model: 'isOverwriteCuInActivity',
									label: 'overwrite existing controlling unit in activity',
									sortOrder: 2
								},
								{
									gid: 'baseLI',
									rid: 'isFromActivityToLineItem',
									label$tr$: 'scheduling.main.isFromActivityToLineItem',
									type: 'boolean',
									model: 'isFromActivityToLineItem',
									label: 'assign Controlling Unit to line items belonging to activity',
									sortOrder: 1
								},
								{
									gid: 'baseLI',
									rid: 'isOverwriteCuInLineItem',
									label$tr$: 'scheduling.main.isOverwriteCuInLineItem',
									type: 'boolean',
									model: 'isOverwriteCuInLineItem',
									label: 'overwrite existing controlling unit in line item',
									sortOrder: 2
								}
							]
						},
						handleOK: function handleOK(result) {

							var action = {
								Action: 10,
								ScheduleId: schedule.Id,
								AssignCUData: {
									IsByTemplate: result.data.isByTemplate,
									IsFromActivityToLineItem: result.data.isFromActivityToLineItem,
									IsOverwriteCuInActivity: result.data.isOverwriteCuInActivity,
									IsOverwriteCuInLineItem: result.data.isOverwriteCuInLineItem
								}
							};

							$http.post(globals.webApiBaseUrl + 'scheduling/main/activity/execute', action)
									.then(function () {

										platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage('scheduling.main.assignCusByTemplate');

									}, function () {
									});
						}
					};

					platformTranslateService.translateFormConfig(dialogConfig.formConfiguration);
					platformModalFormConfigService.showDialog(dialogConfig);
				}
			};

			function rescheduleUncompleteTask() {
				var selectedActivities = schedulingMainService.getSelectedEntities(),
						title = 'scheduling.main.rescheduleUncompleteActivitiesWizardTitle',
						msg = $translate.instant('scheduling.main.noCurrentActivitySelection');

				var rescheduleUncompleteTaskConfig = {
					title: $translate.instant(title),
					dataItem: {
						startDate: moment(),
						kind: 'Entire Schedule'
					},
					formConfiguration: {
						fid: 'scheduling.main.rescheduleUncompleteActivities',
						version: '0.1.1',
						showGrouping: false,
						groups: [
							{
								gid: 'baseGroup'
							}
						],
						'overloads': {},
						rows: [
							{
								gid: 'baseGroup',
								rid: 'startDate',
								label: 'Start Date',
								label$tr$: 'scheduling.main.startDate',
								type: 'dateutc',
								model: 'startDate',
								sortOrder: 1
							},
							{
								gid: 'baseGroup',
								rid: 'kind',
								label: 'Kind',
								label$tr$: 'scheduling.main.kind',
								type: 'radio',
								model: 'kind',
								options: {
									labelMember: 'Description',
									valueMember: 'Value',
									groupName: 'kindConfig',
									items: [
										{
											Id: 1,
											Description: $translate.instant('scheduling.main.entireSchedule'),
											Value: 'Entire Schedule'
										},
										{
											Id: 2,
											Description: $translate.instant('scheduling.main.selectedActivities'),
											Value: 'Selected Activities'
										}
									]
								},
								sortOrder: 2
							}
						]
					},
					handleOK: function handleOK(result) {
						if (result && result.ok && result.data) {
							var schedule = schedulingMainService.getSelectedSchedule();
							var action = {
								'Action': 22,
								'ScheduleId': selectedActivities ? selectedActivities[0].ScheduleFk : schedule ? schedule.Id : null,
								'RescheduleUncompleteTasks': {
									'IsEntireSchedule': result.data.kind === 'Entire Schedule',
									'StartDate': result.data.startDate
								}
							};
							if (result.data.kind === 'Selected Activities') {
								if (platformSidebarWizardCommonTasksService.assertSelection(selectedActivities[0], title, msg)) {
									action.RescheduleUncompleteTasks.Activities = selectedActivities;
								}
							}
							if (result.data.kind === 'Selected Activities' && action.RescheduleUncompleteTasks.Activities || result.data.kind === 'Entire Schedule') {
								$http.post(globals.webApiBaseUrl + 'scheduling/main/activity/execute', action)
										.then(function (response) {
											schedulingMainService.calculateActivities(null, response.data);
											schedulingMainService.reload();
											platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage('scheduling.main.rescheduleUncompleteActivitiesWizardTitle');

										}, function () {
										});
							}
						}
					}
				};
				platformTranslateService.translateFormConfig(rescheduleUncompleteTaskConfig.formConfiguration);
				// rescheduleUncompleteTaskConfig.scope = platformSidebarWizardConfigService.getCurrentScope();
				platformModalFormConfigService.showDialog(rescheduleUncompleteTaskConfig);
			}

			service.rescheduleUncompleteTask = rescheduleUncompleteTask;

			service.generateActivities = function generateActivities() {
				let schedule = schedulingMainService.getSelectedSchedule();

				if (platformSidebarWizardCommonTasksService.assertSelection(schedule, 'scheduling.main.generateActivitiesWizard.generateActivities')) {
					let title = $translate.instant('scheduling.main.generateActivitiesWizard.generateActivities');
					let modalGenerateConfig = {
						dialogOptions: {
							headerTextKey: 'scheduling.main.generateActivitiesWizard.generateActivities',
							templateUrl: globals.appBaseUrl + 'scheduling.main/templates/wizard/scheduling-generate-activities-wizard-dialog.html',
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

							let criteriaKind;
							let splitArray = _.split(result.generationData.criteria1, ' ');
							let idOfStructure = splitArray[1];
							switch (splitArray[0]) {
								case 'ESTIMATE':
									criteriaKind = 1;
									break;
								case 'BOQ':
									criteriaKind = 2;
									break;
								case 'LOCATION':
									criteriaKind = 3;
									break;
								case 'COSTGROUP':
									criteriaKind = 4;
									break;
							}
							let projectMainPinnableEntityService = $injector.get('projectMainPinnableEntityService');

							let projectId = projectMainPinnableEntityService.getPinned();
							if (projectId === null) {
								projectId = schedulingMainService.getSelectedProjectId();
							}
							let action = {
								Action: 23,
								ScheduleId: schedule.Id,
								GenerateActivitiesInfo: {
									Criteria1: {
										CriteriaKind: criteriaKind,
										IdOfStructure: idOfStructure,
										BOQLevel: criteriaKind === 2 && result.generationData.boqLevel !== null && result.generationData.boqLevel > 0
										&& result.generationData.boqLevel <= result.generationData.boqMaxLevel ? result.generationData.boqLevel : null
									},
									Criteria2: result.generationData.criteria2,
									FreeSchedule: result.generationData.isFreeOrEstimate === 'FreeSchedule',
									ProjectId: projectId,
									EstimateId: result.generationData.estimateFk,
									CreateRelations: result.relData.Create,
									RelationKind: result.relData.RelationKindFk,
									GenerationMode: result.generationData.hide ? 0 : result.generationData.updateOrGenerate === 'UpdateAndGenerate' ? 1 : 2
								}
							};
							if (criteriaKind === 3) {
								let lookupServ = $injector.get('projectLocationLookupDataService');
								lookupServ.resetCache({lookupType: 'projectLocationLookupDataService'});
							}
							if (platformDataServiceModificationTrackingExtension.hasModifications(schedulingMainService)) {
								schedulingMainService.updateWithPostProcess(action).then(function () {
									schedulingMainService.reload();
									platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage(title);
								});
							} else {
								$http.post(globals.webApiBaseUrl + 'scheduling/main/activity/execute', action
								).then(function (response) {
									schedulingMainService.reload();
									if (response.data && response.data.ActionResult.length > 0) {
										let modalOptions = {
											headerTextKey: title,
											bodyTextKey: response.data.ActionResult,
											showOkButton: true,
											showCancelButton: true,
											resizeable: true,
											height: '500px',
											iconClass: 'info'
										};
										platformModalService.showDialog(modalOptions);
									} else {
										platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage(title);
									}
								});
							}
						}
					};

					modalGenerateConfig.scope = platformSidebarWizardConfigService.getCurrentScope();

					platformModalGridConfigService.setConfig(modalGenerateConfig);

					platformModalService.showDialog(modalGenerateConfig.dialogOptions).then(function (result) {
						if (result.yes) {
							modalGenerateConfig.handleOK(result.data);
						}
					});
				}
			};

			service.synchronizeSchedules = function synchronizeSchedules() {
				let schedule = schedulingMainService.getSelectedSchedule();
				let title = 'scheduling.main.synchronizeSchedules';

				if (platformSidebarWizardCommonTasksService.assertSelection(schedule, 'scheduling.main.synchronizeSchedules')) {
					let action = {
						Action: 24,
						ScheduleId: schedule.Id
					};
					$http.post(globals.webApiBaseUrl + 'scheduling/main/activity/execute', action
					).then(function () {
						schedulingMainService.reload();
						platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage(title);
					});
				}
			};

			var schedulingWizardID = 'schedulingMainSidebarWizards';

			var schedulingWizardConfig = {
				showImages: true,
				showTitles: true,
				showSelected: true,
				cssClass: 'sidebarWizard',
				items: [
					{
						id: 1,
						text: 'Groupname - Wizzard',
						text$tr$: 'scheduling.main.wizardGroupname',
						groupIconClass: 'sidebar-icons ico-wiz-change-status',
						visible: true,
						subitems: [
							{
								id: 11,
								text: 'Create Baseline',
								text$tr$: 'scheduling.main.createBaseline',
								type: 'item',
								showItem: true,
								cssClass: 'rw md',
								fn: service.createBaseline
							},
							{
								id: 95,
								text: 'Create Job For Import Method',
								text$tr$: 'scheduling.main.createjobforimportmethod',
								type: 'item',
								showItem: true,
								cssClass: 'rw md',
								fn: service.createJobForImportMethod
							},
							{
								id: 12,
								text: 'Split Activity by Locations',
								text$tr$: 'scheduling.main.splitActivityByLocations',
								type: 'item',
								showItem: true,
								cssClass: 'md rw',
								fn: service.splitActivityByLocations
							},
							basicsCommonChangeStatus(),
							{
								id: 14,
								text: 'Change State of all Activities',
								text$tr$: 'scheduling.main.changeActivityStateOfAllActivities',
								type: 'item',
								showItem: true,
								cssClass: 'md rw',
								fn: service.changeActivityStateOfAllActivities
							},
							{
								id: 15,
								text: 'Export Schedule to iTWO',
								text$tr$: 'scheduling.main.exportToiTWO',
								type: 'item',
								showItem: true,
								cssClass: 'md rw',
								fn: service.exportToITWOBaseline
							},
							{
								id: 16,
								text: 'Export to MS Project',
								text$tr$: 'scheduling.main.exportToMSProject',
								type: 'item',
								showItem: true,
								cssClass: 'md rw',
								fn: service.exportToMSProject
							},
							{
								id: 17,
								text: 'Import from MS Project',
								text$tr$: 'scheduling.main.importMSProject',
								type: 'item',
								showItem: true,
								cssClass: 'md rw',
								fn: service.importMSProject
							},
							{
								id: 18,
								text: 'Record Progress As Scheduled',
								text$tr$: 'scheduling.main.addProgressToScheduleActivity',
								type: 'item',
								showItem: true,
								cssClass: 'md rw',
								fn: service.addProgressToScheduledActivities
							},
							{
								id: 19,
								text: 'Critical Path',
								text$tr$: 'scheduling.main.criticalPath',
								type: 'item',
								showItem: true,
								cssClass: 'md rw',
								fn: service.criticalPath
							},
							{
								id: 20,
								text: 'Assign Controlling Units',
								text$tr$: 'scheduling.main.assignCUsByTemplate',
								type: 'item',
								showItem: true,
								cssClass: 'md rw',
								fn: service.assignCUsByTemplate
							},
							{
								id: 21,
								text: 'Reschedule Activities',
								text$tr$: 'scheduling.main.rescheduleActivities',
								type: 'item',
								showItem: true,
								cssClass: 'md rw',
								fn: service.rescheduleActivities
							},
							{
								id: 22,
								text: 'Create Package',
								text$tr$: 'Create Package',
								isOpen: true,
								subitems: [
									{
										id: 221,
										text: 'Create Package',
										text$tr$: 'Create Package',
										type: 'item',
										showItem: true,
										cssClass: 'md rw',
										fn: service.createProcurementPackage
									}
								]
							},
							documentProjectDocumentsStatusChange(),
							{
								id: 88,
								text: 'Generic Wizard Test',
								text$tr$: '',
								type: 'item',
								showItem: true,
								cssClass: 'md rw',
								fn: function () {

								}
							},
							{
								id: 89,
								text: 'Update Planned By Schedule',
								text$tr$: '',
								type: 'item',
								showItem: true,
								cssClass: 'md rw',
								fn: updatePlannedBySchedule
							}, {
								id: 90,
								text: 'Update Planned By Activity',
								text$tr$: '',
								type: 'item',
								showItem: true,
								cssClass: 'md rw',
								fn: updatePlannedByActivity
							}, {
								id: 91,
								text: 'Update Installed By Schedule',
								text$tr$: '',
								type: 'item',
								showItem: true,
								cssClass: 'md rw',
								fn: updateInstalledBySchedule
							}, {
								id: 92,
								text: 'Update Installed By Activity',
								text$tr$: '',
								type: 'item',
								showItem: true,
								cssClass: 'md rw',
								fn: updateInstalledByActivity
							}, {
								id: 93,
								text: 'Update Activity Quantity',
								text$tr$: '',
								type: 'item',
								showItem: true,
								cssClass: 'md rw',
								fn: service.updateActivityQuantity
							}, {
								id: 94,
								text: 'Apply Performance Sheet',
								text$tr$: '',
								type: 'item',
								showItem: true,
								cssClass: 'md rw',
								fn: service.performanceSheet
							}
						]
					}
				]
			};

			var loadTranslations = function () {
				platformTranslateService.translateObject(schedulingWizardConfig, ['text']);

			};

			// register translation changed event
			platformTranslateService.translationChanged.register(loadTranslations);

			service.activate = function activate() {
				platformSidebarWizardConfigService.activateConfig(schedulingWizardID, schedulingWizardConfig);
			};

			service.deactivate = function deactivate() {
				platformSidebarWizardConfigService.deactivateConfig(schedulingWizardID);
			};

			service.updatePlannedLineItemQuantity = function updatePlannedQuantity() {
				let title = 'scheduling.main.wizardUpdateQuantity.updateLineItemQuantity';

				let lineItemQtyUpdateConfig = {
					title: $translate.instant(title),
					resizeable: true,
					dataItem: {
						scheduleScope: '2',
						updatePlannedQuantity: '1',
						considerScurve: false
					},
					formConfiguration: {
						fid: 'scheduling.main.wizardUpdateQuantity.updateLineItemQuantity',
						version: '0.1.1',
						showGrouping: false,
						groups: [
							{
								gid: 'baseGroup',
								attributes: ['selectedItem']
							}
						],
						'overloads': {},
						rows: [
							{
								gid: 'baseGroup',
								rid: 'SelectedItem',
								label: $translate.instant('scheduling.main.wizardUpdateQuantity.selectScheduleScope'),
								type: 'radio',
								model: 'scheduleScope',
								options: {
									labelMember: 'Description',
									valueMember: 'Value',
									groupName: 'lineItemQtyScheduleConfig',
									items: [
										{
											Id: 1,
											Description: $translate.instant('scheduling.main.wizardUpdateQuantity.entireSchedule'),
											Value: '2'
										},
										{
											Id: 2,
											Description: $translate.instant('scheduling.main.wizardUpdateQuantity.selectedActivities'),
											Value: '1'
										}
									]
								}
							},
							{
								gid: 'baseGroup',
								rid: 'updatePlannedQuantityConsiderScurve',
								label: $translate.instant('scheduling.main.wizardUpdateQuantity.considerScurve'),
								type: 'boolean',
								model: 'considerScurve'
							},
							{
								gid: 'baseGroup',
								rid: 'updatePlannedQuantity',
								label: $translate.instant('scheduling.main.wizardUpdateQuantity.selectQuantity'),
								type: 'radio',
								groupName: 'lineItemQtyUpdateConfig',
								model: 'updatePlannedQuantity',
								options: {
									labelMember: 'Description',
									valueMember: 'Value',
									groupName: 'lineItemQtyUpdateConfig',
									items: [
										{
											Id: 1,
											Description: $translate.instant('scheduling.main.wizardUpdateQuantity.updatePlannedQuantity'),
											Value: '1'
										},
										{
											Id: 2,
											Description: $translate.instant('scheduling.main.wizardUpdateQuantity.updateIQQuantity'),
											Value: '2'
										}
									]
								}
							}
						]
					},
					handleOK: function handleOK(result) {
						if (result && result.ok && result.data) {
							let selectedLineItem = schedulingMainService.getSelected();
							let postData = {
								'Action': 14,
								'ReferredEntityId': parseInt(result.data.updatePlannedQuantity),
								'ConsiderScurve': result.data.considerScurve,
							};
							let valueTwo = parseInt(result.data.scheduleScope);
							if (valueTwo === 1) {
								postData.EffectedItemId = selectedLineItem.Id;
							}
							else {
								postData.ScheduleId = selectedLineItem.ScheduleFk;
							}
							$http.post(globals.webApiBaseUrl + 'scheduling/main/activity/execute', postData).then(function() {
								platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage(lineItemQtyUpdateConfig.title);
							});
						}
					}
				};

				platformModalFormConfigService.showDialog(lineItemQtyUpdateConfig);
			};

			return service;
		}
	]);
})(angular);
