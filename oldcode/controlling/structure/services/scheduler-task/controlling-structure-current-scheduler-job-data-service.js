
(function () {
	'use strict';
	let moduleName = 'controlling.structure';
	let estimateMainModule = angular.module(moduleName);

	estimateMainModule.factory('controllingStructureCurrentSchedulerJobDataService', ['globals','_','$q','PlatformMessenger','platformDataServiceFactory','$injector','platformRuntimeDataService',
		'controllingStructureProjectDataService','platformGridAPI','$http',
		function (globals,_,$q,PlatformMessenger,platformDataServiceFactory,$injector,platformRuntimeDataService,controllingStructureProjectDataService,platformGridAPI,$http) {
			let service = {};
			let dataList = [];

			angular.extend(service, {
				listLoaded: new PlatformMessenger(),
				registerListLoaded: registerListLoaded,
				unregisterListLoaded: unregisterListLoaded,
				setList: setList,
				getList: getList,
				createItem: createItem,
				setSelectedRow: setSelectedRow
			});

			let serviceOption;
			serviceOption = {
				module: angular.module(moduleName),
				entitySelection: {},
				modification: {multi: {}}
			};

			let container = platformDataServiceFactory.createNewComplete(serviceOption);
			container.data.itemList = [];
			angular.extend(service, container.service);

			function registerListLoaded(callBackFn) {
				service.listLoaded.register(callBackFn);
			}

			function unregisterListLoaded(callBackFn) {
				service.listLoaded.unregister(callBackFn);
			}

			function setList(data) {
				dataList = [];
				if(!data.length){
					return;
				}
				// set totalEntity readOnly
				let allFieldsReadOnly = [];
				_.forOwn(data[0].JobEntity, function (value, key) {
					let field = {field: key, readonly: true};
					allFieldsReadOnly.push(field);
				});
				_.forEach(data, function (item) {
					let pushData = item.JobEntity;
					pushData.companyFk = item.CompanyFk;
					pushData.projectIds = item.ProjectIds;
					pushData.updatePlannedQty = item.updatePlannedQty;
					pushData.updateInstalledQty = item.updateInstalledQty;
					pushData.updateBillingQty = item.updateBillingQty;
					pushData.updateForecastingPlannedQty = item.updateForecastingPlannedQty;
					pushData.updateRevenue = item.updateRevenue;
					pushData.insQtyUpdateFrom = item.insQtyUpdateFrom;
					pushData.revenueUpdateFrom = item.revenueUpdateFrom;
					pushData.costGroupCats = item.costGroupCats;
					platformRuntimeDataService.readonly(pushData, allFieldsReadOnly);
					dataList.push(pushData);
				});
			}

			function getList() {
				return dataList;
			}

			function createItem() {
				service.setSelected(null);
				let controllingStructureTransferSchedulerTaskService = $injector.get('controllingStructureTransferSchedulerTaskService');
				controllingStructureTransferSchedulerTaskService.afterSetSelectedJobEntities.fire(null,true);
				controllingStructureTransferSchedulerTaskService.setIsCreateDisabled.fire(true);
				controllingStructureProjectDataService.setIsReadOnly(false);
				controllingStructureProjectDataService.setList(null);
			}

			function setSelectedRow(gridId) {
				let grid =  platformGridAPI.grids.element('id', gridId);
				if(grid){
					grid.instance.resetActiveCell();
					grid.instance.setSelectedRows([]);
				}
			}

			service.refreshGrid = function refreshGrid() {
				service.listLoaded.fire();
			};

			service.afterSetSelectedEntities = new PlatformMessenger();
			let baseSetSelected = service.setSelected;
			service.setSelected = function setSelected(entity) {
				baseSetSelected(entity);
				if(entity){
					let controllingStructureTransferSchedulerTaskService = $injector.get('controllingStructureTransferSchedulerTaskService');
					controllingStructureTransferSchedulerTaskService.afterSetSelectedJobEntities.fire(entity,false);
					controllingStructureProjectDataService.setIsReadOnly(true);
					controllingStructureProjectDataService.setList(entity.projectIds);
					controllingStructureTransferSchedulerTaskService.setIsCreateDisabled.fire(false);
					$injector.get('controllingStructureCostGroupAssignmentDataService').setList();
				}
			};

			service.refreshData =function () {
				service.setList([]);
				service.setSelected(null);
			};

			service.stopJob = function () {
				let selected = service.getSelected();
				return $http({
					method: 'Post',
					url: globals.webApiBaseUrl + 'services/scheduler/job/stopjob',
					params: {jobId: selected.Id}
				}).then(function (response) {
					selected.JobState = 6;
					service.setSelected(null);
					service.refreshGrid();
					service.setSelected(selected);
					return response.data;
				});
			};

			return service;
		}]
	);
})();
