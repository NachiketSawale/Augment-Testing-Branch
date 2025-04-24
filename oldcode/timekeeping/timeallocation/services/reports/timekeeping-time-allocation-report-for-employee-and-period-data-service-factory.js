/**
 * Created by baf on 2021-10-08.
 */

(function (angular) {
	/* global globals */
	'use strict';

	const moduleName = 'timekeeping.timeallocation';

	/**
	 * @ngdoc service
	 * @name timekeepingTimeAllocationReportForEmployeeAndPeriodDataServiceFactory
	 * @description creates data services used in different belongs to container
	 */
	angular.module(moduleName).service('timekeepingTimeAllocationReportForEmployeeAndPeriodDataServiceFactory', TimekeepingTimeAllocationReportForEmployeeAndPeriodDataServiceFactory);

	TimekeepingTimeAllocationReportForEmployeeAndPeriodDataServiceFactory.$inject = ['_', '$q', '$http', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'timekeepingTimeallocationItemDataService', 'timekeepingTimeallocationHeaderDataService','SchedulingDataProcessTimesExtension', 'timekeepingTimeallocationConstantValues',
		'timekeepingRecordingRoundingDataService', 'platformDataServiceDataProcessorExtension','platformRuntimeDataService', 'platformDialogService','platformPermissionService',
		'permissions'];

	function TimekeepingTimeAllocationReportForEmployeeAndPeriodDataServiceFactory(_, $q, $http, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		timekeepingTimeallocationItemDataService, timekeepingTimeallocationHeaderDataService,SchedulingDataProcessTimesExtension, timekeepingTimeallocationConstantValues,
		timekeepingRecordingRoundingDataService, platformDataServiceDataProcessorExtension,platformRuntimeDataService, platformDialogService, platformPermissionService,
		permissions) {

		let instances = {};
		let isBreakContainerReadonly = false;

		let self = this;

		this.createDataService = function createDataService() {
			const dsName = self.getDataServiceName();

			var srv = instances[dsName];
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
			return 'timekeepingRecordingReportForEmployeeAndPeriodDataService';
		};

		function canCreate(){
			let result = false;
			let selectedItems = timekeepingTimeallocationItemDataService.getSelectedEntities();
			result = selectedItems.some(function(item){
				return item.RecordType === timekeepingTimeallocationConstantValues.types.employee.id;
			});
			return result;
		}

		this.doCreateDataService = function doCreateDataService(dsName) {
			var timekeepingTimeAllocationReportForEmployeeAndPeriodDataServiceOption = {
				flatNodeItem: {
					module: angular.module(moduleName),
					serviceName: dsName,
					entityNameTranslationID: 'timekeeping.employee.entityEmployee',
					httpRead: {
						route: globals.webApiBaseUrl + 'timekeeping/recording/report/', endRead: 'foremployeeandperiod', usePostForRead: true,
						initReadData: function (readData) {
							let items = timekeepingTimeallocationItemDataService.getSelectedEntities();
							let filters = [];
							let header = timekeepingTimeallocationHeaderDataService.getSelected();
							_.each(items, function (item) {
								if (item.RecordType === timekeepingTimeallocationConstantValues.types.employee.id) {
									filters.push({
										Employee: item.EmployeeFk,
										Period: header.PeriodFk,
										Date: header.AllocationDate,
										EndDate: header.Allocationenddate
									});
								}
							});
							readData.filters = filters;
						}
					},
					httpCreate: {
						route: globals.webApiBaseUrl + 'timekeeping/recording/report/', endCreate: 'createreportsfromallocation'
					},
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: 'ReportDto',
						moduleSubModule: 'Timekeeping.Recording'
					}),{ processItem: setReadonly },new SchedulingDataProcessTimesExtension(['BreakFrom', 'BreakTo','FromTimePartTime','ToTimePartTime'])],
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								let selectedHeader = timekeepingTimeallocationHeaderDataService.getSelected();
								let selectedItem = timekeepingTimeallocationItemDataService.getSelected();
								if (!selectedItem.EmployeeFk) {
									let selectedItems = timekeepingTimeallocationItemDataService.getSelectedEntities();
									if (selectedItems) {
										let item = _.find(selectedItems, function (item) {
											return !item.EtmPlantFk;
										});
										if (item) {
											selectedItem = item;
										}
									}
								}
								creationData.PeriodId = selectedHeader.PeriodFk;
								creationData.JobId = selectedHeader.JobFk;
								creationData.ProjectId = selectedHeader.ProjectFk;
								creationData.EmployeeId = selectedItem.EmployeeFk;
								creationData.RecordingId = selectedItem.RecordingFk || selectedHeader.RecordingFk || null;
								creationData.Date = selectedHeader.AllocationDate;
								creationData.HasToCreateRecording = false;
							},
							handleCreateSucceeded: function (newItem) {
								if (newItem.RecordingFk === 0 || newItem.SheetFk === 0) {
									let report = _.cloneDeep(newItem);
									$http.post(globals.webApiBaseUrl + 'timekeeping/recording/report/validatereportsfromallocation', [report]).then(function (response) {
										if (response.data) {
											if (!response.data.IsValid) {
												platformDialogService.showYesNoDialog(response.data.ErrorMsg, 'cloud.common.errorDialogTitle', 'yes', false).then(function (result) {
													if (result.yes) {
														if (response.data.Reports) {
															if (newItem.RecordingFk !== null || newItem.RecordingFk == 0 || newItem.SheetFk !== null || newItem.SheetFk == 0) {
																newItem.HasToCreateRecording = true;
															}
														}
													}
												});
											}
										}
									});
								}
							}
						}
					},
					actions: {delete: true, create: 'flat', canCreateCallBackFunc: canCreate, canDeleteCallBackFunc: canDelete },
					entitySelection: { supportsMultiSelection: true },
					entityRole: {
						node: {
							itemName: 'Reports',
							parentService: timekeepingTimeallocationItemDataService } }
				}
			};
			var timekeepingGroupId = null;
			let serviceContainer = platformDataServiceFactory.createNewComplete(timekeepingTimeAllocationReportForEmployeeAndPeriodDataServiceOption);
			serviceContainer.data.usesCache = false;
			timekeepingTimeallocationItemDataService.articleChanged.register(function (){
				serviceContainer.service.load();
			});
			function canDelete() {
				let result = canCreate();
				if (result) {
					let selected = serviceContainer.service.getSelected();
					if (selected && selected.IsReadOnly || selected && selected.UsedForTransaction) {
						result = false;
					}
				}
				return result;
			}

			function calculateHours(FromTime, ToTime, FromDate, ToDate) {
				let fromTimeString = moment(FromTime).format('HH:mm') + ':00';
				let toTimeString = moment(ToTime).format('HH:mm') + ':00';
				let fromDateString = moment(FromDate).format('YYYY-MM-DD');
				let toDateString = moment(ToDate).format('YYYY-MM-DD');
				let dt1 = new Date(fromDateString + ' ' + fromTimeString);
				let dt2 = new Date(toDateString + ' ' + toTimeString);
				return hoursDiff(dt1, dt2);
			}
			function hoursDiff(dt1, dt2) {
				let diffTime = (dt2.getTime() - dt1.getTime());
				let hoursDiff = diffTime / (1000 * 3600);
				return hoursDiff;
			}
			function setReadonly(entity) {
				let readonly = entity.ProjectActionFk !== null;
				let transactionreadonly = entity.UsedForTransaction;

				if (transactionreadonly || entity.IsReadOnly ) {
					platformRuntimeDataService.readonly(entity, true);
				} else {
					platformRuntimeDataService.readonly(entity, false);
					if (entity.IsBreaksAvailable) {
						if (!entity.IsOnlyOneBreak) {
							if (entity.BreakFrom !== null && entity.BreakTo !== null) {
								entity.BreakFrom = null;
								entity.BreakTo = null;
							}
						}
						let fields = [
							{field: 'BreakFrom', readonly: true},
							{field: 'BreakTo', readonly: true}
						];
						platformRuntimeDataService.readonly(entity, fields);
					} else {
						let fields = [
							{field: 'BreakFrom', readonly: false},
							{field: 'BreakTo', readonly: false}
						];
						platformRuntimeDataService.readonly(entity, fields);
						if (entity.breakFrom === null && entity.breakTo === null) {
							entity.Duration = calculateHours(entity.FromTimePartTime, entity.ToTimePartTime);
						}
					}
				}
				let fields = [
					{field: 'Duration', readonly: entity.IsReadOnly || transactionreadonly || (entity.Version !== 0 && entity.From !== null && entity.To !== null && !entity.From.isSame(entity.To))},
				];
				platformRuntimeDataService.readonly(entity, fields);
			}

			function setNewRoundingConfiguration (){
				let selected = timekeepingTimeallocationItemDataService.getSelected();
				if (selected && selected.RoundingConfigDetail && selected.TimekeepingGroupId !== timekeepingGroupId){
					timekeepingGroupId = selected.TimekeepingGroupId;
					timekeepingRecordingRoundingDataService.setRoundingConfigDetails(selected.RoundingConfigDetail);
				} else if (selected && (!selected.RoundingConfigDetail || selected.TimekeepingGroupId === 0)) {
					timekeepingGroupId = 0;
					timekeepingRecordingRoundingDataService.setRoundingConfigDetailDefault(selected.RoundingConfigDetail);
				}
			}
			timekeepingTimeallocationItemDataService.registerSelectionChanged(setNewRoundingConfiguration);

			let createMultipleDic = new Map();
			serviceContainer.service.createMultiple = function createMultiple(){
				serviceContainer.service.createItem().then(function(report){
					let selectedEntities = timekeepingTimeallocationItemDataService.getSelectedEntities();
					if (selectedEntities.length > 1) {
						// Filter out plants
						let entities = timekeepingTimeallocationItemDataService.getSelectedEntities().filter(function (entity) {
							return !entity.EtmPlantFk;
						});
						if (entities.length > 1) {
							createMultipleDic.set(report.Id, entities);
						}
					}
				});
			};

			serviceContainer.service.registerItemModified(function (e, item) {
				if (item) {
					item.IsModified = true;
				}
			});

			function setBreakContainer(){
				let selectedItem = serviceContainer.service.getSelected();
				const write = platformPermissionService.hasWrite('5d34ff4e0bf347e3976e6ef2079bf91d', false);
				if (selectedItem && (selectedItem.UsedForTransaction || selectedItem.IsReadOnly)) {
					if (!isBreakContainerReadonly || write) {
						platformPermissionService.restrict(['5d34ff4e0bf347e3976e6ef2079bf91d'], permissions.read);
						isBreakContainerReadonly = true;
					}
				} else if (isBreakContainerReadonly || !write) {
					platformPermissionService.restrict(['5d34ff4e0bf347e3976e6ef2079bf91d'], false);
					isBreakContainerReadonly = false;
				}
			}
			serviceContainer.service.registerSelectionChanged(function () {
				setBreakContainer()
			});

			serviceContainer.service.resetBreakContainer = function resetBreakContainer(){
				setBreakContainer();
			}

			serviceContainer.service.provideUpdateData = function provideUpdateData(updateData){
				if (createMultipleDic.size > 0) {
					createMultipleDic.forEach(function (selection, item ){
						_.forEach(updateData.TimeAllocationToSave, function(alloc) {
							let reportFound = _.find(alloc.ReportsToSave, function (entity) {
								return entity.MainItemId === item;
							});
							if (reportFound && reportFound.Reports) {
								_.forEach(selection, function (select) {
									if (select.EmployeeFk !== reportFound.Reports.EmployeeFk) {
										let reportCpy = _.cloneDeep(reportFound.Reports);
										reportCpy.Id = 0;
										reportCpy.EmployeeFk = select.EmployeeFk;
										reportCpy.RecordingFk = select.RecordingFk;
										alloc.ReportsToSave.push({MainItemId: reportCpy.Id, Reports: reportCpy});
									}
								});
							}
						});
					});
					createMultipleDic.clear();
				}
			};
			serviceContainer.service.canCreateMultiple = function canCreateMultiple(){
				let selectedEntities = timekeepingTimeallocationItemDataService.getSelectedEntities();
				let withEmployee = _.find(selectedEntities, function(select){
					return select.EmployeeFk;
				});
				return serviceContainer.service.canCreate && selectedEntities.length > 1 && withEmployee;
			};

			serviceContainer.service.takeOverReports = function takeOverReports(timeAllocations){
				let hasToRefresh = false;
				let lastReport;
				let employeeString = '';
				_.forEach(timeAllocations, function(alloc) {
					if (alloc.ReportsToSave) {
						_.forEach(alloc.ReportsToSave, function (entity) {
							let found = _.find(serviceContainer.data.itemList, function (item) {
								return entity.Reports.Id === item.Id;
							});
							if (_.isNil(found)) {
								platformDataServiceDataProcessorExtension.doProcessItem(entity.Reports, serviceContainer.data);
								serviceContainer.data.itemList.push(entity.Reports);
								lastReport = entity.Reports;
								hasToRefresh = true;
							}
						});
					}
					if (alloc.ErrorMessage && alloc.ErrorMessage.length > 0){
						employeeString += alloc.ErrorMessage;
					}
				});
				if (employeeString.length > 0) {
					let string = 'No report created because the selected time symbol is not available for: ' + employeeString;
					platformDialogService.showMsgBox(string, 'timekeeping.timeallocation.createMultiple', 'info');
				}

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
