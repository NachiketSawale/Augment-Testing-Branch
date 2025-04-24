/**
 * Created by anl on 2/2/2017.
 */

(function (angular) {
	'use strict';

	/*global angular, Platform, moment, _, globals*/

	var moduleName = 'productionplanning.activity';
	var masterModule = angular.module(moduleName);

	masterModule.factory('productionplanningActivityActivityDataService', ActivityDataService);

	ActivityDataService.$inject = ['$injector',
		'platformDataServiceFactory',
		'basicsLookupdataLookupDescriptorService',
		'basicsCommonMandatoryProcessor',
		'platformDataServiceProcessDatesBySchemeExtension',
		'basicsLookupdataLookupFilterService',
		'$http',
		'platformDataServiceModificationTrackingExtension',
		'$q',
		'cloudDesktopPinningContextService',
		'productionplanningCommonStructureFilterService',
		'cloudDesktopSidebarService',
		'productionplanningMountingActivityResourceRequisitionLookupDataService',
		'transportplanningRequisitionResourceRequisitionLookupDataService',
		'cloudDesktopInfoService',
		'platformRuntimeDataService',
	   '$translate'];

	function ActivityDataService(
		$injector,
		platformDataServiceFactory,
		basicsLookupdataLookupDescriptorService,
		basicsCommonMandatoryProcessor,
		platformDataServiceProcessDatesBySchemeExtension,
		basicsLookupdataLookupFilterService,
		$http,
		platformDataServiceModificationTrackingExtension,
		$q,
		cloudDesktopPinningContextService,
		ppsCommonStructureFilterService,
		cloudDesktopSidebarService,
		activityResourceRequisitionLookupDataService,
		trsRequisitionResourceRequisitionLookupDataService,
		cloudDesktopInfoService,
		platformRuntimeDataService,
		$translate) {

		var prjPinCtxToken = cloudDesktopPinningContextService.tokens.projectToken;
		var mntReqPinCtxToken = cloudDesktopPinningContextService.tokens.ppsMntToken;
		var mntActPinCtxToken = cloudDesktopPinningContextService.tokens.ppsMntActToken;

		var report2productGUID = 'd747e68bb9544804bf5a908b714315ce';
		var report2ProductDataService,
			serviceContainer;


		var dateProcessor = platformDataServiceProcessDatesBySchemeExtension.createProcessor(
			{
				typeName: 'ActivityDto',
				moduleSubModule: 'ProductionPlanning.Activity'
			}
		);

		var serviceOption = {
			flatRootItem: {
				module: masterModule,
				serviceName: 'productionplanningActivityActivityDataService',
				entityNameTranslationID: 'productionplanning.activity.entityActivity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'productionplanning/activity/activity/',
					usePostForRead: true,
					endRead: 'listbyfiltered',
					endDelete: 'multidelete',
					extendSearchFilter: function extendSearchFilter(filterRequest) {
						filterRequest.orderBy = [{Field: 'Code'}];
						ppsCommonStructureFilterService.extendSearchFilterAssign('productionplanningActivityActivityDataService', filterRequest);
						ppsCommonStructureFilterService.setFilterRequest('productionplanningActivityActivityDataService', filterRequest);
					}
				},
				entityRole: {
					root: {
						itemName: 'Activities',
						moduleName: 'cloud.desktop.moduleDisplayNamePpsActivity',
						descField: 'DescriptionInfo.Translated',
						handleUpdateDone: handleUpdateDone,
						addToLastObject: true,
						lastObjectModuleName: moduleName,
						useIdentification: true
					}
				},
				dataProcessor: [dateProcessor,
					{
						processItem: function (item) {
							var fields = [
								{field: 'DateshiftMode', readonly: item.Version > 0},
								{field: 'Code', readonly: item.Version === 0}
							];
							platformRuntimeDataService.readonly(item, fields);
							if(item.Version === 0){
								// set code
								item.Code = $translate.instant('cloud.common.isGenerated');
							}
						}
					}],
				useItemFilter: true,
				entitySelection: {supportsMultiSelection: true},
				presenter: {
					list: {
						incorporateDataRead: function (readData, data) {
							basicsLookupdataLookupDescriptorService.attachData(readData.Lookups);
							var result = {
								FilterResult: readData.FilterResult,
								dtos: readData.Main || []
							};

							var dataRead = serviceContainer.data.handleReadSucceeded(result, data);
							return dataRead;
						},
						handleCreateSucceeded: function (item) {
							var context = cloudDesktopPinningContextService.getContext();
							if (context !== undefined && context !== null) {
								for (var i = 0; i < context.length; i++) {
									if (context[i].token === mntReqPinCtxToken) {
										item.MntRequisitionFk = context[i].id;
									}
									if (context[i].token === prjPinCtxToken) {
										item.ProjectId = context[i].id;
									}
								}
							}
							if (item.Version === 0 && item.EventTypeFk === 0) {
								item.PlannedStart = null;
								item.PlannedFinish = null;
								item.EarliestStart = null;
								item.EarliestFinish = null;
								item.LatestStart = null;
								item.LatestFinish = null;
							}
						},
						initCreationData: function (creationData) {
							var context = cloudDesktopPinningContextService.getContext();
							if (context !== undefined && context !== null) {
								for (var i = 0; i < context.length; i++) {
									if (context[i].token === mntReqPinCtxToken) {
										creationData.Pkey1 = context[i].id;
									}
									if (context[i].token === prjPinCtxToken) {
										creationData.Pkey2 = context[i].id;
									}
								}
							}
						}
					}
				},
				translation: {
					uid: 'productionplanningActivityActivityDataService',
					title: 'productionplanning.activity.entityActivity',
					columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
					dtoScheme: {
						typeName: 'ActivityDto',
						moduleSubModule: 'ProductionPlanning.Activity',
					},
				},
				sidebarWatchList: {active: true},
				sidebarSearch: {
					options: {
						moduleName: moduleName,
						enhancedSearchEnabled: true,
						enhancedSearchVersion: '2.0',
						pattern: '',
						pageSize: 100,
						useCurrentClient: null,
						includeNonActiveItems: false,
						showOptions: true,
						showProjectContext: false,
						withExecutionHints: true,
						pinningOptions: {
							isActive: true,
							showPinningContext: [
								{token: prjPinCtxToken, show: true},
								{token: mntReqPinCtxToken, show: true},
								{token: mntActPinCtxToken, show: true}
							],
							setContextCallback: setCurrentPinningContext
						}
					}
				},
				actions: {
					create: 'flat',
					canCreateCallBackFunc: canCreateCallBackFunc,
					delete: true
				}
			}
		};


		function handleUpdateDone(updateData, response, data) {
			//invoking handleOnUpdateSucceeded function at first, then do the extra things
			data.handleOnUpdateSucceeded(updateData, response, data, true);
			//refresh resource requisitons
			var refresh = false;
			var refreshTrsRequisitionResRequisitionDataService = false;
			var ppsEventId = 0;
			//used for refresh activity:resRequisition after create automatically
			if (response.Activity !== null && response.Activity.Version === 1) {
				refresh = true;
				ppsEventId = response.Activity.PpsEventFk;
			}
			//used for update filter of resRequisitionList in Reservation
			else if (response.ResRequisitionToSave || response.ResRequisitionToDelete) {
				refresh = true;
			}
			if (!refreshTrsRequisitionResRequisitionDataService && response.TrsRequisitionToSave !== null) {
				_.each(response.TrsRequisitionToSave, function (trsRequisitionComplete) {
					//used for update filter of resRequisitionList in Reservation
					if (trsRequisitionComplete.ResRequisitionToSave) {
						var service = $injector.get('productionplanningActivityTrsRequisitionResRequisitionDataService');
						_.each(trsRequisitionComplete.ResRequisitionToSave, function (resRequisitionComplete) {
							var oldItem = service.findItemToMerge(resRequisitionComplete);
							if (!oldItem) {
								refreshTrsRequisitionResRequisitionDataService = true;
							}
						});
					}
				});
			}
			if (refreshTrsRequisitionResRequisitionDataService) {
				$injector.get('productionplanningActivityTrsRequisitionResRequisitionDataService').load();
				trsRequisitionResourceRequisitionLookupDataService.resetCache();
			}
			if (refresh) {
				var service = $injector.get('productionplanningActivityResRequisitionDataService');
				ppsEventId = service.parentService().getSelected().PpsEventFk;
				service.loadResRequisition(ppsEventId);
				activityResourceRequisitionLookupDataService.resetCache();
			}
			clearAddedProduct();

			if (response && response.TrsRequisitionToSave) {
				if (_.find(response.TrsRequisitionToSave, {ReloadTrsGoodContainer: true})) {
					reloadService(data.childServices, 'TrsGoodDataService');
				}
				if (_.find(response.TrsRequisitionToSave, {ReloadTrsBundleContainer: true})) {
					reloadService(data.childServices, 'productionplanningActivityTrsRequisitionBundleDataService');
				}
				if (_.find(response.TrsRequisitionToSave, {ReloadMaterialReqContainer: true})) {
					reloadService(data.childServices, 'MatRequisitionDataService');
				}
				if (_.find(response.TrsRequisitionToSave, {ReloadResRequisitionContainer: true})) {
					reloadService(data.childServices, 'productionplanningActivityTrsRequisitionResRequisitionDataService');
				}
				if (_.find(response.TrsRequisitionToSave, {ReloadResReservationContainer: true})) {
					reloadService(data.childServices, 'productionplanningActivityTrsRequisitionDataServiceResReservationDataService');
					$injector.get('transportplanningRequisitionResourceRequisitionLookupDataService').resetCache({lookupType: 'transportplanningRequisitionResourceRequisitionLookupDataService'});//reset to set the lookup correctly
				}
			}
		}

		function reloadService(childServices, serviceName) {
			_.find(childServices, function (service) {
				if (service.getServiceName().endsWith(serviceName)) {
					service.clearCache();
					service.load();
					return true;
				} else {
					return reloadService(service.getChildServices(), serviceName);
				}
			});
		}

		function canCreateCallBackFunc() {
			var result = false;
			var context = cloudDesktopPinningContextService.getContext();
			if (context !== undefined && context !== null) {
				for (var i = 0; i < context.length; i++) {
					if (context[i].token === mntReqPinCtxToken) {
						result = true;
						break;
					}
				}
			}
			return result;
		}

		function setCurrentPinningContext(dataService) {
			var activity = dataService.getSelected();
			if (activity) {
				$q.when(basicsLookupdataLookupDescriptorService.getLookupItem('MntRequisition', activity.MntRequisitionFk)).then(function (requisition) {
					setPinningContext(activity.ProjectId, requisition, activity, dataService);
				});
			}
		}

		function setPinningContext(projectId, requisition, activity, dataService) {
			var projectPromise = $q.when(true);
			var pinningContext = [];
			if (angular.isNumber(projectId)) {
				projectPromise = cloudDesktopPinningContextService.getProjectContextItem(projectId).then(function (pinningItem) {
					pinningContext.push(pinningItem);
				});
			}

			if (requisition) {
				pinningContext.push(
					new cloudDesktopPinningContextService.PinningItem(mntReqPinCtxToken, requisition.Id,
						cloudDesktopPinningContextService.concate2StringsWithDelimiter(requisition.Code, requisition.DescriptionInfo.Translated, ' - '))
				);
			}

			if (activity) {
				pinningContext.push(
					new cloudDesktopPinningContextService.PinningItem(mntActPinCtxToken, activity.Id,
						cloudDesktopPinningContextService.concate2StringsWithDelimiter(activity.Code, activity.DescriptionInfo.Translated, ' - '))
				);
			}

			return $q.all([projectPromise]).then(
				function () {
					if (pinningContext.length > 0) {
						cloudDesktopPinningContextService.setContext(pinningContext, dataService);
						service.PinningContextChanged.fire();
					}
				});
		}


		var filters = [
			{
				key: 'productionplanning-mounting-activity-eventtype-filter',

				fn: function (item) {
					if (item) {
						return item.PpsEntityFk !== null && item.PpsEntityFk === 1;
					}
					return false;
				}
			}, {
				key: 'productionplanning-mounting-activity-controlling-unit-filter',
				fn: function (item, activity) {
					return item.PrjProjectFk === activity.ProjectId;
				}
			},
			{
				key: 'mnt-activity-psd-activity-filter',
				serverSide: true,
				fn: function (item) {
					return 'ProjectFk =' + item.ProjectId;
				}
			}];

		function clearAddedProduct() {
			report2ProductDataService = $injector.get('productionplanningActivityContainerInformationService')
				.getContainerInfoByGuid(report2productGUID).dataServiceName;
			if (report2ProductDataService) {
				report2ProductDataService.clearAddedProduct();
			}
		}

		serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);

		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			typeName: 'ActivityDto',
			moduleSubModule: 'ProductionPlanning.Activity',
			validationService: 'productionpalnningActivityActivityValidationService'
		});

		var service = serviceContainer.service; // jshint ignore:line

		service.PinningContextChanged = new Platform.Messenger();

		//Refresh activity-container then will clearAddedProduct() cache
		serviceContainer.service.registerListLoaded(function () {
			clearAddedProduct();
		});

		serviceContainer.service.registerFilter = function () {
			basicsLookupdataLookupFilterService.registerFilter(filters);
		};

		serviceContainer.service.unregisterFilter = function () {
			basicsLookupdataLookupFilterService.unregisterFilter(filters);
		};

		serviceContainer.service.navigateByActivity = function (activity) {
			if (activity && activity.MntRequisitionFk) {
				$http.get(globals.webApiBaseUrl + 'productionplanning/mounting/requisition/GetReqById?ReqId=' + activity.MntRequisitionFk).then(function (response) {
					var requisition = response.data.Main[0];
					if (requisition) {
						$q.when(setPinningContext(activity.ProjectId, requisition, activity)).then(function () {
							serviceContainer.service.refresh();
						});
					}
				});
			}
		};

		serviceContainer.service.navigateByActivityId = function (activityId) {
			if (_.isNumber(activityId)) {
				$http.get(globals.webApiBaseUrl + 'productionplanning/activity/activity/getById?activityId=' + activityId).then(function (response) {
					var activity = response.data;
					if (activity) {
						serviceContainer.service.navigateByActivity(activity);
					}
				});
			}
		};

		serviceContainer.service.navigateByMntRequisition = function (requisition) {
			if (requisition) {
				$http.get(globals.webApiBaseUrl + 'productionplanning/mounting/requisition/GetReqById?ReqId=' + requisition.Id).then(function (response) {
					var requisition = response.data.Main[0];
					if (requisition) {
						$q.when(setPinningContext(requisition.ProjectFk, requisition)).then(function () {
							serviceContainer.service.updateModuleHeaderInfo(null, null);
							serviceContainer.service.refresh();
						});
					}
				});
			}
		};

		serviceContainer.service.navigateByReport = function (report) {
			if (report) {
				$q.when(basicsLookupdataLookupDescriptorService.getLookupItem('MntActivity', report.ActivityFk)).then(function (activity) {
					$http.get(globals.webApiBaseUrl + 'productionplanning/mounting/requisition/GetReqById?ReqId=' + activity.MntRequisitionFk).then(function (response) {
						var requisition = response.data.Main[0];
						if (requisition) {
							$q.when(setPinningContext(requisition.ProjectFk, requisition, activity)).then(function () {
								$q.when(serviceContainer.service.refresh()).then(function () {
									serviceContainer.service.setSelected(activity);
								});
							});
						}
					});
				});
			}
		};

		// angular.extend(service, {
		// 	extendSearchFilterAssign: extendSearchFilterAssign
		// });

		// connect to filter service
		//ppsCommonStructureFilterService.setServiceToBeFiltered(service);
		ppsCommonStructureFilterService.setFilterFunction('productionplanningActivityActivityDataService', ppsCommonStructureFilterService.getCombinedFilterFunction); // default filter


		var lastFilter = null;

		service.getLastFilter = function () {
			return lastFilter;
		};

		service.getSelectedProjectId = function () {
			var projectId = cloudDesktopSidebarService.filterRequest.projectContextId;
			if (projectId === null) {
				return -1;
			} else {
				return projectId;
			}
		};

		/** Set Module Header Info*/
		service.setShowHeaderAfterSelectionChanged(function (activity /*, data*/) {
			if (activity !== null && !_.isEmpty(activity)) {
				var project = basicsLookupdataLookupDescriptorService.getLookupItem('Project', activity.ProjectId);//get from cache,but the lookup for porject is not completed(because with filter)
				if (!project) {
					var basicsLookupdataLookupDataService = $injector.get('basicsLookupdataLookupDataService');
					basicsLookupdataLookupDataService.getItemByKey('Project', activity.ProjectId).then(function (response) {
						project = response;
						basicsLookupdataLookupDescriptorService.updateData('Project', [project]);
						service.updateModuleHeaderInfo(project, activity);
					});
				} else {
					service.updateModuleHeaderInfo(project, activity);
				}
			} else {
				service.updateModuleHeaderInfo();
			}
		});

		service.updateModuleHeaderInfo = function (project, activity) {
			let entityHeaderObject = {};
			if (activity) {
				entityHeaderObject.project = {
					id: project.Id,
					description: cloudDesktopPinningContextService.concate2StringsWithDelimiter(project.ProjectNo, project.ProjectName, ' - ')
				}

				let mntRequisition = basicsLookupdataLookupDescriptorService.getLookupItem('MntRequisition', activity.MntRequisitionFk);
				entityHeaderObject.module = {
					id: mntRequisition.Id,
					description: cloudDesktopPinningContextService.concate2StringsWithDelimiter(mntRequisition.Code, mntRequisition.DescriptionInfo.Translated, ' - '),
					moduleName: moduleName
				}

				entityHeaderObject.lineItem = {
					description: cloudDesktopPinningContextService.concate2StringsWithDelimiter(activity.Code, activity.DescriptionInfo.Translated, ' - ')
				}
			}
			cloudDesktopInfoService.updateModuleInfo('cloud.desktop.moduleDisplayNamePpsActivity', entityHeaderObject);
		};

		service.updateActivityForFilterDragDrop = function (itemOnDragEnd) {
			service.markItemAsModified(itemOnDragEnd);
			service.update();
		};

		service.updateActivity = function (item) {
			$http.get(globals.webApiBaseUrl + 'productionplanning/activity/activity/updateactivity?PpsEventTypeFk=' + item.EventTypeFk).then(function (respond) {
				if (respond.data !== '') {
					var activity = respond.data;
					item.PlannedStart = moment.utc(activity.PlannedStart);
					item.PlannedFinish = moment.utc(activity.PlannedFinish);
					item.EarliestStart = moment.utc(activity.EarliestStart);
					item.EarliestFinish = moment.utc(activity.EarliestFinish);
					item.LatestStart = moment.utc(activity.LatestStart);
					item.LatestFinish = moment.utc(activity.LatestFinish);
					var validationService = $injector.get('productionpalnningActivityActivityValidationService');
					validationService.validateEntity(item);
					platformDataServiceModificationTrackingExtension.markAsModified(service, item, serviceContainer.data);
				}
			});
		};

		service.updateLocationInfo = function (item) {
			var locationCodeService = $injector.get('productionplanningCommonLocationInfoService');
			var location = basicsLookupdataLookupDescriptorService.getLookupItem('LocationInfo', item.PrjLocationFk);

			if (!location && item.PrjLocationFk !== null) {
				locationCodeService.handleNewLocation(item, service);
			}
		};

		return service;
	}
})(angular);