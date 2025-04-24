
(function () {
	'use strict';
	let moduleName = 'controlling.structure';
	let estimateMainModule = angular.module(moduleName);

	estimateMainModule.factory('controllingStructureCostGroupAssignmentDataService', ['_', '$q', 'PlatformMessenger', 'platformDataServiceFactory','$http','platformContextService',
		'$injector','basicsLookupdataLookupFilterService','platformRuntimeDataService',
		function (_,$q,PlatformMessenger,platformDataServiceFactory,$http,platformContextService,$injector,basicsLookupdataLookupFilterService,platformRuntimeDataService) {
			let service = {};
			let dataList = [];
			let classificationSize = 4;
			let classificationPrefix = 'Catalog ';
			let filters = [
				{
					key: 'controlling-structure-cost-group-assignment-lookup-selection-filter',
					serverSide: false,
					fn: function (item) {
						let codeGroupdCatalogField = 'Code';
						let codeGroupCatalogs = _.map(_.filter(getList(), codeGroupdCatalogField), codeGroupdCatalogField);
						return codeGroupCatalogs.includes(item.Code) === false;
					}}];

			angular.extend(service, {
				listLoaded: new PlatformMessenger(),
				registerListLoaded: registerListLoaded,
				unregisterListLoaded: unregisterListLoaded,
				setList: setList,
				getList: getList,
				registerFilters: registerFilters,
				unregisterFilters: unregisterFilters,
				setDataReadOnly:setDataReadOnly,
				setDefaultCostGroupCatalogs:setDefaultCostGroupCatalogs
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

			function registerFilters() {
				basicsLookupdataLookupFilterService.registerFilter(filters);
			}

			function unregisterFilters() {
				basicsLookupdataLookupFilterService.unregisterFilter(filters);
			}

			function registerListLoaded(callBackFn) {
				service.listLoaded.register(callBackFn);
			}

			function unregisterListLoaded(callBackFn) {
				service.listLoaded.unregister(callBackFn);
			}

			function processData() {
				for (let x = 0; x < classificationSize; x++) {
					let id = x + 1;
					dataList.push({
						Id: id,
						Classification: classificationPrefix + (id),
						Code: null
					});
				}
				let selectedJob = $injector.get('controllingStructureCurrentSchedulerJobDataService').getSelected();
				if(selectedJob){
					_.forEach(selectedJob.costGroupCats,function (item) {
						let cateLog = _.find(dataList,{Id:item.Id});
						cateLog.Code = item.Code;
					});
				}
			}

			function setDataReadOnly() {
				let isReadOnly = $injector.get('controllingStructureProjectDataService').getIsReadOnly();

				_.forEach(dataList,function (item) {
					let fields = [];
					_.forOwn(item, function (value, key) {
						let field = {field: key, readonly: isReadOnly};
						fields.push(field);
					});

					platformRuntimeDataService.readonly(item, fields);
				});
			}

			function setList() {
				dataList = [];
				processData();
				service.setDataReadOnly();
				service.refreshGrid();
			}

			function getList() {
				return dataList;
			}

			service.refreshGrid = function refreshGrid() {
				service.listLoaded.fire();
			};

			function setDefaultCostGroupCatalogs(projectId) {
				if(!$injector.get('controllingStructureProjectDataService').getIsReadOnly()){
					let controllingStructureCostGroupAssignmentLookupService = $injector.get('controllingStructureCostGroupAssignmentLookupService');
					controllingStructureCostGroupAssignmentLookupService.getList(projectId,true);
				}
			}

			service.refreshData =function () {
				service.setList(null);
				service.setSelected(null);
			};

			return service;
		}]
	);
})();
