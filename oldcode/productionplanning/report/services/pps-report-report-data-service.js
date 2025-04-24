/**
 * Created by anl on 1/22/2018.
 */


(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.report';
	var PpsReportModule = angular.module(moduleName);

	PpsReportModule.factory('productionplanningReportReportDataService', ReportDataService);

	ReportDataService.$inject = ['$injector', 'platformDataServiceFactory',
		'basicsLookupdataLookupDescriptorService',
		'basicsCommonMandatoryProcessor',
		'platformDataServiceProcessDatesBySchemeExtension',
		'productionplanningReportReportProcessor',
		'$q',
		'cloudDesktopPinningContextService',
		'$http',
		'productionplanningMountingRequisitionDataService',
		'cloudDesktopInfoService',
		'productionplanningReportContainerInformationService'];

	function ReportDataService($injector, platformDataServiceFactory,
							   basicsLookupdataLookupDescriptorService,
							   basicsCommonMandatoryProcessor,
							   platformDataServiceProcessDatesBySchemeExtension,
							   reportProcessor,
							   $q,
							   cloudDesktopPinningContextService,
							   $http,
							   reqDataService,
							   cloudDesktopInfoService,
							   reportContainerInformationService) {

		var prjPinCtxToken = cloudDesktopPinningContextService.tokens.projectToken;
		var mntReqPinCtxToken = cloudDesktopPinningContextService.tokens.ppsMntToken;
		var mntActPinCtxToken = cloudDesktopPinningContextService.tokens.ppsMntActToken;
		var mntRptPinCtxToken = cloudDesktopPinningContextService.tokens.ppsMntRptToken;

		var dateProcessor = platformDataServiceProcessDatesBySchemeExtension.createProcessor({
			typeName: 'ReportDto',
			moduleSubModule: 'ProductionPlanning.Report'
		});
		var serviceOption = {
			flatRootItem: {
				module: PpsReportModule,
				serviceName: 'productionplanningReportReportDataService',
				entityNameTranslationID: 'productionplanning.report.entityReport',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'productionplanning/report/report/',
					usePostForRead: true,
					endRead: 'filtered',
					extendSearchFilter: function extendSearchFilter(filterRequest) {
						filterRequest.orderBy = [{Field: 'StartTime', Desc: true}];
					},
					endDelete: 'multidelete'
				},
				entitySelection: {supportsMultiSelection: true},
				useItemFilter: true,
				entityRole: {
					root: {
						itemName: 'Reports',
						moduleName: 'cloud.desktop.moduleDisplayNamePpsReport',
						descField: 'DescriptionInfo.Translated',
						handleUpdateDone: handleUpdateDone,
						addToLastObject: true,
						useIdentification: true,
						lastObjectModuleName: moduleName
					}
				},
				dataProcessor: [dateProcessor, reportProcessor],
				presenter: {
					list: {
						incorporateDataRead: function (readData, data) {
							clearLocalContext();
							basicsLookupdataLookupDescriptorService.attachData(readData);
							var result = {
								FilterResult: readData.FilterResult,
								dtos: readData.dtos || []
							};

							return serviceContainer.data.handleReadSucceeded(result, data);
						},
						handleCreateSucceeded: function (item) {
							var context = cloudDesktopPinningContextService.getContext();
							if (context !== undefined && context !== null) {
								for (var i = 0; i < context.length; i++) {
									if (context[i].token === 'project.main') {
										item.ProjectId = context[i].id;
									}
									else if (context[i].token === 'productionplanning.activity') {
										item.ActivityFk = context[i].id;
									}
								}
							}
						}
					}
				},
				sidebarWatchList: {active: true},
				sidebarSearch: {
					options: {
						moduleName: moduleName,
						enhancedSearchEnabled: true,
						enhancedSearchVersion: '2.0',
						pattern: '',
						pageSize: 100,
						useCurrentClient: false,
						includeNonActiveItems: false,
						showOptions: false,
						showProjectContext: false,
						withExecutionHints: true,
						pinningOptions: {
							isActive: true,
							showPinningContext: [
								{token: prjPinCtxToken, show: true},
								{token: mntReqPinCtxToken, show: true},
								{token: mntActPinCtxToken, show: true},
								{token: mntRptPinCtxToken, show: true}
							],
							setContextCallback: setCurrentPinningContext
						}
					}
				},
				translation: {
					uid: 'productionplanningReportReportDataService',
					title: 'productionplanning.report.entityReport',
					columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}]
				},
				actions: {
					create: 'flat',
					canCreateCallBackFunc: canCreateCallBackFunc,
					delete: true,
					canDeleteCallBackFunc: canDeleteCallBackFunc
				}
			}
		};

		/* jshint -W003 */
		var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);

		/* custom cache for saving e.g. MntRequsition */
		var dataCache = {};
		var orgClearCache = serviceContainer.service.clearCache;
		serviceContainer.service.clearCache = function () {
			if (_.isFunction(orgClearCache)) {
				orgClearCache.apply(this, arguments);
			}
			dataCache = {};
		};

		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			typeName: 'ReportDto',
			moduleSubModule: 'ProductionPlanning.Report',
			validationService: 'productionpalnningReportReportValidationService',
			mustValidateFields: ['Code', 'ClerkFk']
		});

		serviceContainer.data.provideUpdateData = function (updateData) {
			updateData.MainItemId = updateData.EntitiesCount > 0 ? service.getIfSelectedIdElse(-1) : updateData.MainItemId;
		};

		function canDeleteCallBackFunc(selected){
			return selected.Deletable;
		}

		function canCreateCallBackFunc() {
			var result = false;
			var context = cloudDesktopPinningContextService.getContext();
			if (context !== undefined && context !== null) {
				for (var i = 0; i < context.length; i++) {
					if (context[i].token === 'productionplanning.activity') {
						result = true;
						break;
					}
				}
			}
			return result;
		}

		function clearLocalContext() {
			var reportProductContainerInfo = reportContainerInformationService.getContainerInfoByGuid('e584a2d7de02488590552a17db1bdd75');
			var report2productService = reportProductContainerInfo.dataServiceName;

			//If only open report container, report2product wont init and error shown
			if(angular.isDefined(report2productService)) {
				report2productService.clearAddedProduct();
			}
		}

		function handleUpdateDone(updateData, response, data) {
			//invoking handleOnUpdateSucceeded function at first, then do the extra things
			data.handleOnUpdateSucceeded(updateData, response, data, true);
			data.updateDone.fire(updateData);
			clearLocalContext();
		}

		function setCurrentPinningContext(dataService) {
			var report = dataService.getSelected();
			setReportPinningContext(report, dataService);
		}

		function getRequisitionById(reqId) {
			var key = 'MntRequisition' + reqId;
			var value = dataCache[key];
			var reqPromise = $q.when(value);
			if (_.isUndefined(value)) {
				reqPromise = reqDataService.getRequisitionById(reqId).then(function (requisition) {
					value = requisition;
					dataCache[key] = value;
					return requisition;
				});
			}
			return reqPromise;
		}

		function getActivityById(actId) {
			// search in cache
			var key = 'MntActivity' + actId;
			var value = dataCache[key];
			var actPromise = $q.when(value);
			if (_.isUndefined(value)) {
				// search in lookup cache
				var act = basicsLookupdataLookupDescriptorService.getLookupItem('MntActivity', actId);
				if (_.isNull(act)) {
					actPromise = $http.get(globals.webApiBaseUrl + 'productionplanning/activity/activity/getById?activityId=' + actId).then(function (response) {
						var activity = response.data;
						dataCache[key] = activity;
						return activity;
					});
				}
				else {
					actPromise = $q.when(act);
				}
			}
			return actPromise;
		}

		function setReportPinningContext(report, dataService) {
			if (report) {
				// $q.when(basicsLookupdataLookupDescriptorService.getLookupItem('MntActivity', report.ActivityFk)).then(function (activity) {
				// 	getRequisitionById(activity.MntRequisitionFk).then(function (requisition) {
				// 		setPinningContext(report.ProjectId, requisition, activity, report);
				// 	});
				// });

				setPinningContext(report.ProjectId, null, null, report, dataService);
			}
		}

		function setPinningContext(projectId, requisition, activity, report, dataService) {
			var pinningContext = [];
			if (report) {
				pinningContext.push(
					new cloudDesktopPinningContextService.PinningItem(mntRptPinCtxToken, report.Id,
						cloudDesktopPinningContextService.concate2StringsWithDelimiter(report.Code, report.DescriptionInfo.Translated, ' - '))
				);
			}

			if (activity) {
				pinningContext.push(
					new cloudDesktopPinningContextService.PinningItem(mntActPinCtxToken, activity.Id,
						cloudDesktopPinningContextService.concate2StringsWithDelimiter(activity.Code, activity.DescriptionInfo.Translated, ' - '))
				);
			}
			if (requisition) {
				pinningContext.push(
					new cloudDesktopPinningContextService.PinningItem(mntReqPinCtxToken, requisition.Id,
						cloudDesktopPinningContextService.concate2StringsWithDelimiter(requisition.Code, requisition.DescriptionInfo.Translated, ' - '))
				);
			}

			var projectPromise = $q.when(true);
			if (angular.isNumber(projectId)) {
				projectPromise = cloudDesktopPinningContextService.getProjectContextItem(projectId).then(function (pinningItem) {
					pinningContext.push(pinningItem);
				});
			}
			return $q.all([projectPromise]).then(
				function () {
					if (pinningContext.length > 0) {
						cloudDesktopPinningContextService.setContext(pinningContext, dataService);
					}
				});
		}

		var service = serviceContainer.service;

		serviceContainer.service.navigateToActivity = function (activity) {
			if (activity) {
				var key = 'MntActivity' + activity.Id;
				dataCache[key] = activity;
				getRequisitionById(activity.MntRequisitionFk).then(function (requisition) {
					setPinningContext(activity.ProjectId, requisition, activity).then(function () {
						serviceContainer.service.load();
					});
				});
			}
		};
		serviceContainer.service.navigatedByCode = function (report) {
			if (report) {
				getActivityById(report.ActivityFk).then(function (activity) {
					if (activity) {
						getRequisitionById(activity.MntRequisitionFk).then(function (requisition) {
							setPinningContext(report.ProjectId, requisition, activity, report).then(function () {
								serviceContainer.service.load();
							});
						});
					}
				});
			}
		};

		serviceContainer.service.onDataReaded = function () {
		};

		serviceContainer.service.isSelectedItemApproved = function () {
			if (!serviceContainer.service.getSelected()) {
				return false;
			}
			var status = basicsLookupdataLookupDescriptorService.getLookupItem('MntReportStatus', serviceContainer.service.getSelected().RepStatusFk);
			return status && status.IsApproved;
		};

		/** Set Module Header Info*/
		service.setShowHeaderAfterSelectionChanged(function (report /*, data*/) {
			if (report !== null && !_.isEmpty(report)) {
				var project = basicsLookupdataLookupDescriptorService.getLookupItem('Project', report.ProjectId);//get from cache,but the lookup for porject is not completed(because with filter)
				if (!project) {
					var basicsLookupdataLookupDataService = $injector.get('basicsLookupdataLookupDataService');
					basicsLookupdataLookupDataService.getItemByKey('Project', report.ProjectId).then(function (response) {
						project = response;
						basicsLookupdataLookupDescriptorService.updateData('Project', [project]);
						service.updateModuleHeaderInfo(project, report);
					});
				}
				else {
					service.updateModuleHeaderInfo(project, report);
				}
			}
			else{
				service.updateModuleHeaderInfo();
			}
		});

		service.updateModuleHeaderInfo = function (project, report) {
			let entityText = '';
			let entityHeaderObject = {};
			if (report) {
				entityText = cloudDesktopPinningContextService.concate2StringsWithDelimiter(project.ProjectNo, project.ProjectName, ' - ');
				entityHeaderObject.project = {
					id: project.Id,
					description: entityText
				}
				getActivityById(report.ActivityFk).then(function (mntActivity) {
					getRequisitionById(mntActivity.MntRequisitionFk).then(function (mntRequisition) {
						entityText = cloudDesktopPinningContextService.concate2StringsWithDelimiter(mntRequisition.Code, mntRequisition.DescriptionInfo.Translated, ' - ');
						entityHeaderObject.module = {
							id: mntRequisition.Id,
							description: entityText,
							moduleName: moduleName
						}
						entityText = cloudDesktopPinningContextService.concate2StringsWithDelimiter(mntActivity.Code, mntActivity.DescriptionInfo.Translated, ' - ');
						entityText += ' / ';
						entityText += cloudDesktopPinningContextService.concate2StringsWithDelimiter(report.Code, report.DescriptionInfo.Translated, ' - ');
						entityHeaderObject.lineItem = {
							description: entityText
						}

						cloudDesktopInfoService.updateModuleInfo('cloud.desktop.moduleDisplayNamePpsReport', entityHeaderObject);
					});
				});
			}
			else {
				cloudDesktopInfoService.updateModuleInfo('cloud.desktop.moduleDisplayNamePpsReport', entityText);
			}
		};

		return service;
	}
})(angular);