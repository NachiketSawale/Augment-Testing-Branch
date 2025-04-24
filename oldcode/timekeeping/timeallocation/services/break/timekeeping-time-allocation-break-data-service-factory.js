/**
 * Created by Sudarshan on 2023-07-12.
 */

(function (angular) {
	/* global globals */
	'use strict';

	const moduleName = 'timekeeping.timeallocation';

	/**
	 * @ngdoc service
	 * @name timekeepingTimeAllocationBreakDataServiceFactory
	 * @description creates data services used in different belongs to container
	 */
	angular.module(moduleName).service('timekeepingTimeAllocationBreakDataServiceFactory', TimekeepingTimeAllocationBreakDataServiceFactory);

	TimekeepingTimeAllocationBreakDataServiceFactory.$inject = ['_','$injector', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'timekeepingTimeallocationItemDataService', 'timekeepingTimeallocationHeaderDataService','SchedulingDataProcessTimesExtension', 'timekeepingTimeallocationConstantValues',
		'timekeepingRecordingRoundingDataService', 'platformDataServiceDataProcessorExtension'];

	function TimekeepingTimeAllocationBreakDataServiceFactory(_, $injector,platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		timekeepingTimeallocationItemDataService, timekeepingTimeallocationHeaderDataService,SchedulingDataProcessTimesExtension, timekeepingTimeallocationConstantValues,
		timekeepingRecordingRoundingDataService, platformDataServiceDataProcessorExtension) {

		let instances = {};

		let self = this;
		let dataServiceName = $injector.get('timekeepingTimeAllocationReportForEmployeeAndPeriodDataServiceFactory').createDataService();
		this.createDataService = function createDataService() {
			const dsName = self.getDataServiceName();

			let srv = instances[dsName];
			if(_.isNil(srv)) {
				srv = self.doCreateDataService(dsName);
				instances[dsName] = srv;
			}

			return srv;
		};

		this.getNameInfix = function getNameInfix(templInfo) {
			return templInfo.dto;
		};

		this.getDataServiceName = function getDataServiceName() {
			return 'timekeepingRecordingReportBreakDataService';
		};

		function canCreateOrDelete(){
			let result = false;
			let selectedItems = $injector.get('timekeepingTimeAllocationReportForEmployeeAndPeriodDataServiceFactory').createDataService().getSelectedEntities();
			result = selectedItems.some(function(item){
				return item.RecordType === timekeepingTimeallocationConstantValues.types.employee.id;
			});
			return result;
		}

		this.doCreateDataService = function doCreateDataService(dsName) {
			let timekeepingTimeAllocationBreakDataServiceOption = {
				flatLeafItem: {
					module: angular.module(moduleName),
					serviceName: dsName,
					entityNameTranslationID: 'timekeeping.recording.recordingBreakListTitle',
					httpRead: {
						route: globals.webApiBaseUrl + 'timekeeping/recording/break/', endRead: 'listbyparent', usePostForRead: true,
						initReadData: function (readData) {
							let selectedItem = dataServiceName.getSelected();
							let items = timekeepingTimeallocationItemDataService.getSelectedEntities();
							let header = timekeepingTimeallocationHeaderDataService.getSelected();
							readData.PKey1 = selectedItem.Id;
							readData.Period = header.PeriodFk;
							readData.Employee = items[0].EmployeeFk;
							readData.Date = header.AllocationDate;
						}
					},
					httpCreate: {
						route: globals.webApiBaseUrl + 'timekeeping/recording/break/', endCreate: 'create'
					},
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: 'TimekeepingBreakDto',
						moduleSubModule: 'Timekeeping.Recording'
					}),new SchedulingDataProcessTimesExtension(['BreakStart','BreakEnd','FromTimeBreakTime', 'ToTimeBreakTime'])],
					presenter: { list: {
						initCreationData: function initCreationData(creationData) {
							let selectedDate = dataServiceName.getSelected();
							// creationData.PKey1 = selectedItem.Id;
							let selectedHeader = timekeepingTimeallocationHeaderDataService.getSelected();
							let selectedItem = timekeepingTimeallocationItemDataService.getSelected();
							creationData.PeriodId = selectedHeader.PeriodFk;
							creationData.JobId = selectedHeader.JobFk;
							creationData.ProjectId = selectedHeader.ProjectFk;
							creationData.EmployeeId = selectedItem.EmployeeFk;
							creationData.RecordingId = selectedItem.RecordingFk || selectedHeader.RecordingFk || null;
							creationData.Date = selectedHeader.AllocationDate;
							creationData.PKey1 = selectedDate.Id;
						}
					} },
					actions: {delete: true, create: 'flat' /* ,  canCreateCallBackFunc: canCreateOrDelete, canDeleteCallBackFunc: canCreateOrDelete */ },
					entitySelection: { supportsMultiSelection: true },
					entityRole: {
						leaf: { itemName: 'Breaks', parentService: dataServiceName } }
				}
			};
			let timekeepingGroupId = null;
			let serviceContainer = platformDataServiceFactory.createNewComplete(timekeepingTimeAllocationBreakDataServiceOption);
			serviceContainer.data.usesCache = false;

			serviceContainer.service.takeOverBreaks = function takeOverBreaks(timeAllocations){
				let hasToRefresh = false;
				let lastReport;
				_.forEach(timeAllocations, function(alloc) {
					if (alloc.EmployeeBreaksToSave && alloc.EmployeeBreaksToSave.length > 0) {
						_.forEach(alloc.EmployeeBreaksToSave, function (report) {
							let found = _.find(serviceContainer.data.itemList, function (item) {
								return report.Id === item.Id;
							});
							if (_.isNil(found)) {
								platformDataServiceDataProcessorExtension.doProcessItem(report, serviceContainer.data);
								serviceContainer.data.itemList.push(report);
								lastReport = report;
								hasToRefresh = true;
							}
						});
					}
				});
				if (hasToRefresh) {
					serviceContainer.service.gridRefresh();
					if (!_.isNil(lastReport)){
						serviceContainer.service.setSelected(lastReport);
					}
				}
			};
			return serviceContainer.service;
		};
	}
})(angular);
