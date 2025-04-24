
(function (angular) {
	'use strict';

	var moduleName = 'controlling.structure';

	angular.module(moduleName).factory('controllingStructureCostGroupAssignmentLookupService', ['globals','_', '$q','$http', '$injector','controllingStructureTransferDataToBisDataService', 'basicsCostGroupCatalogConfigDataService',
		function (globals,_, $q, $http, $injector,controllingStructureTransferDataToBisDataService, basicsCostGroupCatalogConfigDataService) {

			let lookData = {
				projectId: null,
				costGroupCatalogList: [],
			};
			let filterRequest = {
				ExecutionHints: false,
				IncludeNonActiveItems:null,
				PageNumber: 0,
				PageSize:1000,
				Pattern:null,
				PinningContext:[],
				ProjectContextId:null,
				UseCurrentClient:null,
				filter:'',
				isReadingDueToRefresh:false
			};
			let matchValues = [];

			let service = {};
			let projectCostGroupCatalogService = null;

			function getCostGroupCatalogList(projectId) {
				let configModuleName = 'Estimate';

				if (!projectCostGroupCatalogService || projectId !== lookData.projectId) {
					projectCostGroupCatalogService = basicsCostGroupCatalogConfigDataService.getProjectCostGroupCatalogService(projectId);
				}
				projectCostGroupCatalogService = basicsCostGroupCatalogConfigDataService.getProjectCostGroupCatalogService(projectId);

				return projectCostGroupCatalogService.loadConfig(configModuleName);
			}

			function setControllingCostGroupCatalogs(data) {
				if (!data) {return;}

				let configurationAssign = data.configurationAssign ? data.configurationAssign : [];
				let enterpriseCostGroupCatalogList = [];
				let isControllingCatalog = function (costGroupCatalog , isProject) {
					let config = _.find(configurationAssign, function (item) {
						return isProject ? (item.Code === costGroupCatalog.Code) : (item.CostGroupCatalogFk === costGroupCatalog.Id);
					});

					return config && config.IsControlling;
				};

				if (data.licCostGroupCats) {
					_.forEach(data.licCostGroupCats, function (c) {
						if (isControllingCatalog(c)) {
							enterpriseCostGroupCatalogList.push(c);
						}
					});
				}
				if (data.prjCostGroupCats) {
					_.forEach(data.prjCostGroupCats, function (d) {
						if (isControllingCatalog(d, true)) {
							d.IsProjectCatalog = true;
							enterpriseCostGroupCatalogList.push(d);
						}
					});
				}

				lookData.costGroupCatalogList = enterpriseCostGroupCatalogList;
			}

			service.getList = function (projectId,isSetList) {
				let defer = $q.defer();
				let project = -1;
				if(isSetList === true){
					project = projectId ? projectId : -1;
				}else {
					let selectedProject = $injector.get('controllingStructureProjectDataService').getSelected();
					project = selectedProject ? selectedProject.Id : -1;
				}
				if(project === -1){
					if(project !== lookData.projectId){
						$http.post(globals.webApiBaseUrl + 'basics/costgroupcat/listfiltered', filterRequest)
							.then(function (response) {
								lookData.projectId = project;
								lookData.costGroupCatalogList = _.filter(response.data.dtos,function (dto) {
									return dto.IsLive === true;
								});
								defer.resolve(lookData.costGroupCatalogList);
							});
					}else {
						defer.resolve(lookData.costGroupCatalogList);
					}
				}else {
					getCostGroupCatalogList(project).then(function (data) {
						setControllingCostGroupCatalogs(data);
						lookData.projectId = project;
						defer.resolve(lookData.costGroupCatalogList);
					});
				}

				return defer.promise;
			};

			service.getItemById = function (value) {
				let item = null;

				if(matchValues.length){
					item = _.find(matchValues, {Code: value});
				}

				if(!item){
					if (lookData.costGroupCatalogList.length > 0) {
						item = _.find(lookData.costGroupCatalogList, {Code: value});
					}

					if(item){
						matchValues.push(item);
					}
				}

				return item;
			};


			service.getItemByIdAsync = function (value) {
				return service.getList().then(function () {
					return service.getItemById(value);
				});
			};

			service.getItemByKey = function (value) {
				return service.getItemById(value);
			};

			service.reLoad = function reLoad() {
				lookData.costGroupCatalogList.length = 0;
				if(lookData.projectId !== -1){
					projectCostGroupCatalogService.clear();
				}
				lookData.projectId = -2;

				return service.getList();
			};

			service.reSetMatchValues = function reSetMatchValues() {
				matchValues = [];
			};

			return service;
		}
	]);

})(angular);
