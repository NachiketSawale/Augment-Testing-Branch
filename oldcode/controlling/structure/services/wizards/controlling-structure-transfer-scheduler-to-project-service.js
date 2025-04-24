(function () {
	/* global globals */
	'use strict';

	let moduleName = 'controlling.structure';

	angular.module(moduleName).factory('controllingStructureTransferSchedulerTaskService', ['_','$injector', '$q', '$http', 'platformSchemaService', '$translate', 'platformTranslateService',
		'platformModalService', 'platformRuntimeDataService', 'platformDataValidationService', 'cloudDesktopSidebarService', 'qtoHeaderReadOnlyProcessor',
		'platformUserInfoService', 'basicsClerkUtilitiesService', 'platformContextService', 'estimateMainService','platformRuntimeDataService','PlatformMessenger',
		function (_,$injector, $q, $http, platformSchemaService, $translate, platformTranslateService,
			platformModalService, runtimeDataService, platformDataValidationService, cloudDesktopSidebarService, readOnlyProcessor,
			platformUserInfoService, basicsClerkUtilitiesService, platformContextService, estimateMainService,platformRuntimeDataService,PlatformMessenger) {

			let initDataItem = {versionType:true,okButtonFlag:true};
			let service = {};
			let selectJobEntity = null;

			let self = service;
			let controllingStructurePriorityValues = [
				{Id: 0, description: $translate.instant('controlling.structure.priority.highest')},
				{Id: 1, description: $translate.instant('controlling.structure.priority.high')},
				{Id: 2, description: $translate.instant('controlling.structure.priority.normal')},
				{Id: 3, description: $translate.instant('controlling.structure.priority.low')},
				{Id: 4, description: $translate.instant('controlling.structure.priority.lowest')}
			];

			let controllingStructurerepeatUnitValues =[
				{Id: 0, description: $translate.instant('controlling.structure.repeatUnit.none')},
				{Id: 1, description: $translate.instant('controlling.structure.repeatUnit.everyMinute')},
				{Id: 2, description: $translate.instant('controlling.structure.repeatUnit.hourly')},
				{Id: 3, description: $translate.instant('controlling.structure.repeatUnit.daily')},
				{Id: 4, description: $translate.instant('controlling.structure.repeatUnit.weekly')},
				{Id: 5, description: $translate.instant('controlling.structure.repeatUnit.monthly')}
			];

			let controllingStructureloggingLevelValues = [
				{Id: -1, description: $translate.instant('controlling.structure.logLevel.all')},
				{Id: 0, description: $translate.instant('controlling.structure.logLevel.off')},
				{Id: 1, description: $translate.instant('controlling.structure.logLevel.error')},
				{Id: 2, description: $translate.instant('controlling.structure.logLevel.warning')},
				{Id: 3, description: $translate.instant('controlling.structure.logLevel.info')},
				{Id: 4, description: $translate.instant('controlling.structure.logLevel.debug')}
			];

			service.afterSetSelectedJobEntities = new PlatformMessenger();
			service.setIsCreateDisabled = new PlatformMessenger();

			service.getFormConfig = function getFormConfig () {
				return {
					fid: 'controlling.structure.controllingStructureTransferSchedulerTask',
					version: '0.0.1',
					showGrouping: true,
					groups: [
						{
							gid: 'currentSchedulerJobList',
							header: 'Current Scheduler Job List',
							header$tr$: 'controlling.structure.transferSchedulerTaskWizard.groupTitle1',
							visible: true,
							isOpen: true,
							attributes: []
						},
						{
							gid: 'basicSettings',
							header: 'Basic Settings',
							header$tr$: 'controlling.structure.basicSettings',
							visible: true,
							isOpen: false,
							attributes: []
						},
						{
							gid: 'parameterConfigureDetail',
							header: 'Parameter Configure Detail',
							header$tr$: 'controlling.structure.transferSchedulerTaskWizard.groupTitle2',
							visible: true,
							isOpen: false,
							attributes: []
						}
					],
					rows: [
						{
							gid: 'currentSchedulerJobList',
							rid: 'currentSchedulerJobs',
							type: 'directive',
							model: 'JobItems',
							required: true,
							directive: 'controlling-Structure-Current-Scheduler-Job-Dialog',
							sortOrder: 1
						},
						{
							gid: 'basicSettings',
							rid: 'name',
							model: 'Name',
							sortOrder: 1,
							label$tr$: 'controlling.structure.job.name',
							type: 'description',
							domain: 'description',
							required: true
						},
						{
							gid: 'basicSettings',
							rid: 'description',
							model: 'Description',
							sortOrder: 2,
							label$tr$: 'controlling.structure.job.description',
							type: 'description',
							domain: 'description',
						},
						{
							gid: 'basicSettings',
							rid: 'startTime',
							model: 'StartTime',
							sortOrder: 3,
							label$tr$: 'controlling.structure.job.starttime',
							type: 'datetime',
							domain: 'datetime',
							required: true
						},
						{
							gid: 'basicSettings',
							rid: 'priority',
							model: 'Priority',
							sortOrder: 4,
							label$tr$: 'controlling.structure.priorityName',
							type: 'select',
							options: {
								displayMember: 'description',
								valueMember: 'Id',
								items: controllingStructurePriorityValues
							}
						},
						{
							gid: 'basicSettings',
							rid: 'repeatUnit',
							model: 'RepeatUnit',
							sortOrder: 5,
							label$tr$: 'controlling.structure.job.repeatunit',
							type: 'select',
							options: {
								displayMember: 'description',
								valueMember: 'Id',
								items: controllingStructurerepeatUnitValues
							}
						},
						{
							gid: 'basicSettings',
							rid: 'repeatCount',
							model: 'RepeatCount',
							sortOrder: 6,
							label$tr$: 'controlling.structure.repeatCount',
							type: 'integer',
							domain: 'integer',
						},
						{
							gid: 'basicSettings',
							rid: 'loggingLevel',
							model: 'LoggingLevel',
							sortOrder: 7,
							label$tr$: 'controlling.structure.loggingLevel',
							type: 'select',
							options: {
								displayMember: 'description',
								valueMember: 'Id',
								items: controllingStructureloggingLevelValues
							},
							required: true
						},
						{
							gid: 'basicSettings',
							rid: 'keepDuration',
							model: 'KeepDuration',
							sortOrder: 8,
							label$tr$: 'controlling.structure.keepDuration',
							type: 'integer',
							domain: 'integer',
							required: true
						},
						{
							gid: 'basicSettings',
							rid: 'keepCount',
							model: 'KeepCount',
							sortOrder: 9,
							label$tr$: 'controlling.structure.keepCount',
							type: 'integer',
							domain: 'integer',
							required: true
						},
						{
							gid: 'basicSettings',
							rid: 'targetGroup',
							model: 'TargetGroup',
							sortOrder: 10,
							label: 'Target Group',
							type: 'text',
							domain: 'text',
						},
						{
							gid: 'parameterConfigureDetail',
							rid: 'versionType',
							label$tr$: 'controlling.structure.LableCreateNewVersion',
							type: 'radio',
							model: 'versionType',
							options: {
								labelMember: 'Description',
								valueMember: 'Value',
								items: [
									{Id: 1, Description: $translate.instant('controlling.structure.LableCreateNewVersion'), Value : true},
								]},
							sortOrder: 1
						},
						{
							gid: 'parameterConfigureDetail',
							rid: 'companyFk',
							model: 'companyFk',
							label: 'Company',
							label$tr$: 'controlling.structure.company',
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							readonly: true,
							required: true,
							options: {
								lookupDirective: 'basics-company-company-lookup',
								descriptionMember: 'Code',
							},
							sortOrder: 2
						},
						{
							gid: 'parameterConfigureDetail',
							rid: 'projectFk',
							model: 'projectFk',
							label: 'project',
							label$tr$: 'controlling.structure.project',
							type: 'directive',
							directive: 'controlling-structure-project-dialog',
							readonly: false,
							sortOrder: 2
						},
						{
							gid: 'parameterConfigureDetail',
							rid: 'updatelineitemQuantity',
							label$tr$: 'controlling.structure.updateLineitemQuantities',
							type: 'directive',
							model: 'updatelineitemQuantity',
							directive: 'controlling-Structure-Update-Line-Item-Quantity-Checkbox',
							sortOrder: 4
						},
						{
							gid: 'parameterConfigureDetail',
							rid: 'updateSaleseRevenue',
							label$tr$: 'controlling.structure.updateSaleseRevenue',
							type: 'directive',
							model: 'updateRevenue',
							directive: 'controlling-Structure-Update-Sales-Revenue-Checkbox',
							sortOrder: 5
						},
						{
							gid: 'parameterConfigureDetail',
							rid: 'costGroupAssignment',
							label$tr$: 'controlling.structure.costGroupAssignment',
							type: 'directive',
							model: 'costGroupAssignment',
							directive: 'controlling-Structure-Cost-Group-Assignment',
							sortOrder: 6
						},]
				};

			};

			function createSchedulerTask(result) {
				let projects = $injector.get('controllingStructureProjectDataService').getList();
				if(projects.length){
					let projectIds = [];
					_.forEach(projects,function (item) {
						projectIds.push(item.Id);
					});
					result.projectIds = projectIds;
				}
				result.companyFk = platformContextService.clientCode;
				result.costGroupCats = $injector.get('controllingStructureCostGroupAssignmentDataService').getList();
				$http.post(globals.webApiBaseUrl + 'controlling/structure/schedulerTask/createSchedulerTask', result)
					.then(function (response) {
						if(response && !response.data){
							console.log(response);
						}
					});
			}

			self.showDialog = function showDialog() {
				$http.get(globals.webApiBaseUrl + 'controlling/structure/schedulerTask/getTransferSchedulerByCompany').then(function (result) {
					$injector.get('controllingStructureCurrentSchedulerJobDataService').setList(result.data);

					initDataItem.companyFk = platformContextService.clientId;
					initDataItem.Name = null;
					initDataItem.Description = null;
					initDataItem.StartTime = null;
					initDataItem.Priority = null;
					initDataItem.RepeatUnit = null;
					initDataItem.RepeatCount = null;
					initDataItem.LoggingLevel = null;
					initDataItem.KeepDuration = null;
					initDataItem.KeepCount = null;
					initDataItem.TargetGroup = null;
					initDataItem.insQtyUpdateFrom = -1;
					initDataItem.revenueUpdateFrom = -1;
					initDataItem.isUpdateLineItemQuantityDisabled = true;
					initDataItem.isUpdateRevenueDisabled = true;
					initDataItem.isCreateDisabled = true;
					initDataItem.isActive = false;

					service.setDataItemReadOnly(initDataItem);

					let config = {
						title: service.getDialogTitle(),
						dataItem: initDataItem,
						formConfiguration: service.getFormConfig(),
						handleOK: function handleOK(result) {
							createSchedulerTask(result.data);
						}
					};

					platformModalService.showDialog({
						headerText: service.getDialogTitle(),
						dataItem: initDataItem,
						templateUrl: globals.appBaseUrl + 'controlling.structure/templates/transfer-scheduler-task-for-project.html',
						backdrop: false,
						resizeable: true,
						width: '600px',
					}).then(function (result) {
						if(result.ok){
							config.handleOK(result);
						} else {
							if (config.handleCancel) {
								config.handleCancel (result);
							}
						}
					});
				});
			};

			service.getDialogTitle = function getDialogTitle() {
				return $translate.instant('controlling.structure.controllingStructureTransferSchedulerTask');
			};

			Object.defineProperties(service, {
				'dialogTitle': {
					get: function () {
						return '';}, enumerable: true
				}
			}
			);

			service.getFormConfiguration = function getFormConfiguration() {
				return service.formConfiguration;
			};

			service.setSelectJobEntity = function setSelectJobEntity (data) {
				selectJobEntity = angular.copy(data);
			};

			service.getSelectJobEntity = function getSelectJobEntity () {
				return selectJobEntity;
			};

			service.setDataItemReadOnly = function setDataItemReadOnly(data,isCreate) {
				let isReadOnly = !isCreate;

				let fields = [
					{field: 'Name', readonly: isReadOnly},
					{field: 'Description', readonly: isReadOnly},
					{field: 'StartTime', readonly: isReadOnly},
					{field: 'Priority', readonly: isReadOnly},
					{field: 'RepeatUnit', readonly: isReadOnly},
					{field: 'RepeatCount', readonly: isReadOnly},
					{field: 'LoggingLevel', readonly: isReadOnly},
					{field: 'KeepDuration', readonly: isReadOnly},
					{field: 'KeepCount', readonly: isReadOnly},
					{field: 'TargetGroup', readonly: isReadOnly},
				];

				platformRuntimeDataService.readonly(data, fields);
			};

			return service;
		}]);

})(angular);
