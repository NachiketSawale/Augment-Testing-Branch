
(function () {
	/* global globals, _, Platform */
	'use strict';
	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('costGroupCatalogServiceFactory', ['$http','$injector','platformDataServiceFactory','cloudDesktopPinningContextService','basicsLookupdataLookupDescriptorService',
		function ($http,$injector,platformDataServiceFactory,cloudDesktopPinningContextService,basicsLookupdataLookupDescriptorService) {

			let mainService = {};

			function createCostGroupCatalogService(mainParentService,costGroupModuleType,ConfigModuleName){
				let service = {};
				let projectId = -1;
				let IsClearCostGrpNavgCategory = false;
				if( mainParentService.getSelectedProjectId){
					projectId = mainParentService.getSelectedProjectId();
				}

				function getSelectedProjectId(){
					return mainParentService.getSelectedProjectId ? mainParentService.getSelectedProjectId() : -1;
				}

				let data = null;
				let options={
					hierarchicalRootItem: {
						module: moduleName,
						serviceName: 'costGroupCatalogServiceFactory',
						httpRead: {
							route: globals.webApiBaseUrl + 'basics/costgroupcat/',
							endRead: 'listbyconfig',
							usePostForRead: true,
							initReadData: function initReadData(filterRequest) {

								projectId = getSelectedProjectId();
								if(!projectId || projectId <= 0){
									let projectContext = _.find(cloudDesktopPinningContextService.getContext(), {token: 'project.main'});
									if (projectContext) {
										projectId = projectContext.id;
									}
								}
								filterRequest.ProjectId  = projectId;
								filterRequest.ConfigModuleName  = ConfigModuleName.toLowerCase();
								filterRequest.costGroupModuleType  = costGroupModuleType.toLowerCase();
								return filterRequest;
							}
						},
						entityRole: {
							root: {
								addToLastObject: true,
								lastObjectModuleName: moduleName
							}
						},
						presenter:{
							list: {
								incorporateDataRead: function (readData) {

									let dataList = readData.PrjCostGroupCats.concat(readData.LicCostGroupCats);

									basicsLookupdataLookupDescriptorService.removeData('costGroupCatalogs');
									basicsLookupdataLookupDescriptorService.updateData('costGroupCatalogs',dataList);

									service.listLoaded.fire(readData);
									data = dataList;
									return readData;
								}
							}
						}
					}
				};

				let serviceContainer = platformDataServiceFactory.createNewComplete(options);
				service = serviceContainer.service;
				serviceContainer.data.supportUpdateOnSelectionChanging = false;

				service.listLoaded = new Platform.Messenger();
				service.selectionChanged = new Platform.Messenger();
				service.classByType = new Platform.Messenger();
				service.clearCostGrpNavgCategoryList = new Platform.Messenger();

				service.clearCostGroupWhenNoPinProject = new Platform.Messenger();

				let lookupData ={};
				let selectedItem = null;
				service.loadData = function loadData() {
					if(!projectId || projectId <= 0){
						projectId = getSelectedProjectId();
					}
					if(costGroupModuleType === 'Project' && ConfigModuleName !== 'QuantityTakeOff'){
						let projectContext = _.find(cloudDesktopPinningContextService.getContext(), {token: 'project.main'});
						if (!projectContext) {
							service.clearCostGroupWhenNoPinProject.fire();
							return;
						}
						projectId = projectContext.id;
						projectId = projectId=== -1 ? mainParentService.getSelectedProjectId():projectId;
						if(!projectId || projectId<=0){
							return;
						}
					}else if(ConfigModuleName === 'QuantityTakeOff'){
						projectId = mainParentService.getSelectedProjectId();
					}
					service.setProjectId(projectId);

					lookupData.loadDataPromise =  service.getCostGroupCat(projectId);
					lookupData.loadDataPromise.then(function () {
						lookupData.loadDataPromise  = null;
					});

				};

				service.getCostGroupCat = function getCostGroupCat (projectId) {
					let param = {
						ProjectId: projectId,
						ConfigModuleType:costGroupModuleType ? costGroupModuleType.toLowerCase():costGroupModuleType ,
						ConfigModuleName:ConfigModuleName ? ConfigModuleName.toLowerCase():ConfigModuleName
					};

					return $http.post(globals.webApiBaseUrl + 'basics/costgroupcat/listbyconfig', param)
						.then(function (response) {
							let dataList = [];
							if (response && response.data) {
								dataList = response.data.PrjCostGroupCats.concat(response.data.LicCostGroupCats);
								data = dataList;
							}

							basicsLookupdataLookupDescriptorService.removeData('costGroupCatalogs');
							basicsLookupdataLookupDescriptorService.updateData('costGroupCatalogs', dataList);
							service.listLoaded.fire(response.data);
						}
						);
				};

				service.getTree = function() {
					return data;
				};

				service.setTree = function(treeList){
					data = treeList;
				};
				service.setSelected = function(item) {
					selectedItem = item;
					service.selectionChanged.fire(item);
				};

				service.getSelected = function() {
					return selectedItem;
				};

				service.setProjectId = function setProjectId(pid){
					projectId  = pid;
				};

				service.getProjectId = function getProjectId(){
					return  projectId;
				};


				service.setclearCostGrpNavgCategory = function setclearCostGrpNavgCategory(value){
					IsClearCostGrpNavgCategory  = value;
				};

				service.getclearCostGrpNavgCategory = function setclearCostGrpNavgCategory(){
					return  IsClearCostGrpNavgCategory;
				};

				service.onContextUpdated = function onContextUpdated() {
					let treeList = service.getTree();

					let loadData = false;
					if (costGroupModuleType === 'Project') {

						let projectContext = _.find(cloudDesktopPinningContextService.getContext(), {token: 'project.main'});

						if(!projectContext){
							service.clearCostGroupWhenNoPinProject.fire();
							return;
						}

						if (projectId !== mainParentService.getSelectedProjectId() || _.size(treeList) <= 0) {
							loadData = true;
						}
					} else {
						if (_.size(treeList) <= 0) {
							loadData = true;
						}
					}

					if (loadData) {
						service.setSelected(null);
						service.clearCostGrpNavgCategoryList.fire();
						service.setclearCostGrpNavgCategory(true);
						if (_.isFunction(mainParentService.getSelectedProjectId)) {
							projectId = getSelectedProjectId();
						}
						if (projectId) {
							service.load(costGroupModuleType);
						}
					}
				};

				service.clearData = function (){
					data = [];
					basicsLookupdataLookupDescriptorService.removeData('costGroupCatalogs');
					service.listLoaded.fire({LicCostGroupCats:[], PrjCostGroupCats:[]});
				};

				return service;
			}

			function getService(){
				return mainService;
			}
			return {
				createCostGroupCatalogService :createCostGroupCatalogService,
				getService:getService
			};

		}]);
})();
