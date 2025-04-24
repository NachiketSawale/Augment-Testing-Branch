
(function () {
	'use strict';
	let moduleName = 'controlling.structure';
	let estimateMainModule = angular.module(moduleName);

	estimateMainModule.factory('controllingStructureProjectDataService', ['_', '$q', 'PlatformMessenger', 'platformDataServiceFactory','$http','platformContextService',
		'$injector','globals','controllingStructureCostGroupAssignmentDataService',
		function (_,$q,PlatformMessenger,platformDataServiceFactory,$http,platformContextService,$injector,globals,controllingStructureCostGroupAssignmentDataService) {
			let service = {};
			let allProject =[];
			let dataList = [];
			let isReadOnly = true;

			angular.extend(service, {
				listLoaded: new PlatformMessenger(),
				registerListLoaded: registerListLoaded,
				unregisterListLoaded: unregisterListLoaded,
				setList: setList,
				getList: getList,
				createItem: createItem,
				setIsReadOnly: setIsReadOnly,
				getIsReadOnly: getIsReadOnly
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

			function setList(projectIds) {
				dataList = [];
				if(!projectIds || !projectIds.length){
					service.setSelected(null);
					service.refreshGrid();
					return;
				}

				if(allProject.length){
					peocessDataList(projectIds);
					service.refreshGrid();
					service.setSelected(null);
				} else {
					$http.get(globals.webApiBaseUrl + 'controlling/structure/schedulerTask/getProjectByCompany',{
						params: {
							companyFk:platformContextService.clientId
						}
					}).then(function(response) {
						allProject = response.data;
						peocessDataList(projectIds);
						service.refreshGrid();
						service.setSelected(null);
					});
				}

				$injector.get('controllingStructureCostGroupAssignmentDataService').setDefaultCostGroupCatalogs(null);
			}

			function peocessDataList(projectIds) {
				_.forEach(projectIds,function (item) {
					let data = getProject(item);
					if(data){
						dataList.push(data);
					}
				});
			}

			function getProject(projectId) {
				let id = parseInt(projectId);
				let data = _.find(allProject, {Id: id});
				return data;
			}

			function getList() {
				return dataList;
			}

			service.showCreateDialog = function showCreateDialog() {
				$injector.get('controllingStructureProjectAddService').showDialog();
			};

			function createItem(items) {
				addItems(items);
				service.setSelected(items ? items[0] : -1);
				return $q.when(items);
			}

			function addItems(items) {
				if(!items){
					return;
				}

				angular.forEach(items, function(item){
					let matchItem = _.find(dataList, {Id: item.Id});
					if (!matchItem) {
						dataList.push(item);
					}
				});

				container.data.itemList = dataList;
				service.refreshGrid();
			}

			service.refreshGrid = function refreshGrid() {
				service.listLoaded.fire();
			};

			service.afterSetSelectedEntities = new PlatformMessenger();
			let baseSetSelected = service.setSelected;
			service.setSelected = function setSelected(entity) {
				baseSetSelected(entity);

				if(entity){
					controllingStructureCostGroupAssignmentDataService.setDefaultCostGroupCatalogs(entity.Id);
				}
			};

			service.refreshData =function () {
				service.setList([]);
				service.setSelected(null);
			};

			function getIsReadOnly() {
				return isReadOnly;
			}

			function setIsReadOnly(flag) {
				isReadOnly = flag;
			}

			let baseDeselect = service.deselect;
			service.deselect = function deselect() {
				baseDeselect();

				controllingStructureCostGroupAssignmentDataService.setDefaultCostGroupCatalogs(null);
			};


			return service;
		}]
	);
})();
