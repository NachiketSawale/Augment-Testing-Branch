/**
 * Created by anl on 3/29/2018.
 */

(function () {
	/*globals angular*/
	'use strict';

	var moduleName = 'productionplanning.report';

	angular.module(moduleName).service('productionplanningReportTimeSheetDataServiceFactory', TimeSheetDataService);

	TimeSheetDataService.$inject = ['basicsLookupdataLookupDescriptorService',
		'platformDataServiceProcessDatesBySchemeExtension',
		'platformDataServiceFactory',
		'basicsCommonMandatoryProcessor',
		'productionplanningReportTimeSheetValidationFactory',
		'ServiceDataProcessDatesExtension',
		'$injector',
		'$http',
		'productionplanningReportTimeSheetProcessor',
		'ProductionPlanningCommonUtcTimeProcessor',
		'_'];

	function TimeSheetDataService(basicsLookupdataLookupDescriptorService,
								  PlatformDataServiceProcessDatesBySchemeExtension,
								  platformDataServiceFactory,
								  basicsCommonMandatoryProcessor,
								  timeSheetValidationFactory,
								  ServiceDataProcessDatesExtension,
								  $injector,
								  $http,
								  reportTimeSheetProcessor,
								  ProductionPlanningCommonUtcTimeProcessor,
								  _) {

		var serviceCache = {};
		var self = this;

		//get service or create service by data-service name
		this.getService = function (templInfo, parentService, dialogConfig) {
			var dsName = self.getDataServiceName(templInfo);

			var srv = serviceCache[dsName];
			if (_.isNull(srv) || _.isUndefined(srv)) {
				srv = self.doCreateDataService(dsName, templInfo.moduleName, parentService, dialogConfig);
				serviceCache[dsName] = srv;
			}
			return srv;
		};

		this.getDataServiceName = function (templInfo) {
			return _.camelCase(templInfo.moduleName) + 'ReportTimeSheetDataService';
		};

		this.doCreateDataService = function (serviceName, moduleName, parentService, dialogConfig) {

			var utcTimeProcessor = new ProductionPlanningCommonUtcTimeProcessor(['StartTime', 'EndTime', 'BreakTime']);
			var serviceOption = {
				flatLeafItem: {
					module: angular.module(moduleName),
					serviceName: serviceName,
					entityNameTranslationID: 'productionplanning.report.entityTimeSheet',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'productionplanning/report/timesheet/',
						endRead: 'list'
					},
					entityRole: {
						leaf: {
							itemName: 'TimeSheet',
							parentService: parentService,
							parentFilter: 'ReportFk'
						}
					},
					presenter: {
						list: {
							incorporateDataRead: function (readData, data) {

								initActivityEntity();
								basicsLookupdataLookupDescriptorService.attachData(readData);
								var result = readData.Main ? {
									FilterResult: readData.FilterResult,
									dtos: readData.Main || []
								} : readData;

								return serviceContainer.data.handleReadSucceeded(result, data);
							},
							handleCreateSucceeded: function (newItem) {
								newItem.Date = serviceContainer.data.parentService.getSelected().StartTime;
							},
							initCreationData: function (creationData) {
								creationData.Pkey1 = parentService.getSelected().Id;
							}
						}
					},
					dataProcessor: [
						utcTimeProcessor,
						new ServiceDataProcessDatesExtension(['Date']),
						new PlatformDataServiceProcessDatesBySchemeExtension.createProcessor({
							typeName: 'TimeSheetDto',
							moduleSubModule: 'ProductionPlanning.Report'
						}),
						reportTimeSheetProcessor]
				}
			};

			/* jshint -W003 */
			var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);

			serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'TimeSheetDto',
				moduleSubModule: 'ProductionPlanning.Report',
				validationService: timeSheetValidationFactory.createValidationService(serviceContainer.service),
				mustValidateFields: ['Date', 'StartTime', 'EndTime']
			});

			serviceContainer.service.dialogConfig = dialogConfig;

			serviceContainer.service.ok = function ok(selectedItems) {
				if (!_.isEmpty(selectedItems)) {
					var poolResourceIds = [];
					//collect Info
					_.each(selectedItems, function (resource) {
						poolResourceIds.push(resource.Id);
					});
					var report = serviceContainer.data.parentService.getSelected();
					var entries = serviceContainer.service.getList();
					var request = {report: report, poolResourceIds: poolResourceIds, entries: entries};

					$http.post(globals.webApiBaseUrl + 'productionplanning/report/timesheet/handleDialogCreate', request).then(function (respond) {
						var items = respond.data;
						_.each(items, function (item) {
							serviceContainer.data.onCreateSucceeded(item, serviceContainer.data);
						});
					});
				}
			};

			serviceContainer.service.createDialog = function autoCreate() {
				$injector.get('treeviewListDialogDataService').showTreeview(serviceContainer);
			};

			var activityEntity = null;
			serviceContainer.service.GetActivityEntity = function () {
				return activityEntity;
			};

			function initActivityEntity() {
				var report = parentService.getSelected();
				if (report.Version > 0) {
					activityEntity = null;
					$http.get(globals.webApiBaseUrl + 'productionplanning/activity/activity/getById?activityId=' + report.ActivityFk).then(function (respond) {
						activityEntity = respond.data;
					});
				}
			}

			serviceContainer.service.updateHadBreak = function updateHadBreak(item) {
				if (item && !_.isNull(item.BreakTime)) {
					var _d = item.BreakTime._d;
					var hour = _d.getHours();
					var minute = _d.getMinutes();
					if (hour > 0 || minute > 0) {
						item.HadBreak = true;
						serviceContainer.service.gridRefresh();
					}
				}
			};

			serviceContainer.service.canCreate = function () {
				var hlp = parentService.getSelected() && !parentService.isSelectedItemApproved();
				return _.isNil(hlp) ? false : hlp;
			};

			serviceContainer.service.canDelete = function () {
				var hlp = serviceContainer.service.getSelected() && parentService.getSelected() && !parentService.isSelectedItemApproved();
				return _.isNil(hlp) ? false : hlp;
			};

			parentService.registerSelectionChanged(function () {
				reportTimeSheetProcessor.updateStatus(parentService.isSelectedItemApproved());
			});

			return serviceContainer.service;
		};

	}
})();