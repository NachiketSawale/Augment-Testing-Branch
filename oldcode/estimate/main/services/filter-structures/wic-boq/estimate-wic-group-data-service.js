(function () {
	/* global globals, _, Platform */
	'use strict';
	let moduleName = 'estimate.main';
	let estimateMainModule = angular.module(moduleName);

	estimateMainModule.factory('estimateWicGroupDataService',
		['$http','$injector','platformDataServiceFactory','cloudCommonGridService','basicsLookupdataLookupDescriptorService','estimateMainService','estimateProjectRateBookConfigDataService',
			function ($http,$injector,platformDataServiceFactory, cloudCommonGridService,basicsLookupdataLookupDescriptorService,estimateMainService,estimateProjectRateBookConfigDataService) {

				let service ={};
				let projectId = -1;

				if( estimateMainService.getSelectedProjectId){
					projectId = estimateMainService.getSelectedProjectId();
				}

				let options={
					hierarchicalRootItem: {
						module: moduleName,
						serviceName: 'estimateWicGroupDataService',
						/* httpCRUD: {route: globals.webApiBaseUrl + 'boq/wic/group/', entryRead: 'tree'},
                        presenter: {
                            tree: {
                                parentProp: 'WicCatGroupFk', childProp: 'WicCatGroups',
                                incorporateDataRead: function (readData, data) {

                                    basicsLookupdataLookupDescriptorService.removeData('WicCatGroups');
                                    basicsLookupdataLookupDescriptorService.updateData('WicCatGroups',readData);
                                    service.setTree(readData);
                                    //service.listLoaded.fire(readData);
                                    return serviceContainer.data.handleReadSucceeded(readData, data);
                                }
                            }
                        }, */
						entityRole: {
							root: {
								itemName: 'WicGroups',
								moduleName: 'cloud.desktop.moduleDisplayNameWIC',
								codeField: 'Code',
								descField: 'DescriptionInfo.Translated'
							}
						},
						useItemFilter: true,
						translation: {
							uid: 'estimateWicGroupDataService',
							title: 'Description',
							columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}]
						}
					}
				};

				let serviceContainer = platformDataServiceFactory.createNewComplete(options);
				service = serviceContainer.service;
				// let data = serviceContainer.data;
				let selectedWicGroup =   null;
				let wicGroupData  = [];

				service.listLoaded = new Platform.Messenger();
				service.selectionChanged = new Platform.Messenger();

				service.getSelectedWicGroup = function getSelectedWicGroup() {
					return selectedWicGroup;
				};


				service.clearSelectedWicGroup = function getSelectedWicGroup() {
					selectedWicGroup = null;
				};
				service.setSelectedWicGroup = function setSelectedWicGroup(item,isNoNeedQueryWicBoqItem) {
					selectedWicGroup = item;

					if(!isNoNeedQueryWicBoqItem){
						service.selectionChanged.fire(item);
					}
				};

				service.getTree = function() {
					return wicGroupData;
				};

				service.setTree = function(treeList){
					wicGroupData = treeList;
				};

				let lookupData ={};
				service.loadWicGroup = function loadWicGroup() {
					if(projectId) {
						if (!lookupData.loadDataPromise) {
							lookupData.loadDataPromise = $http.get(globals.webApiBaseUrl + 'boq/wic/group/tree').then(function (response) {
								// basicsLookupdataLookupDescriptorService.removeData('WicCatGroups');
								// basicsLookupdataLookupDescriptorService.updateData('WicCatGroups', response.data);

								let dataByMasterDataFilter = estimateProjectRateBookConfigDataService.getFilterData(response.data, 3);

								service.setTree(dataByMasterDataFilter);
								service.listLoaded.fire(dataByMasterDataFilter);
								lookupData.loadDataPromise = null;
							});
						}
					}
				};


				service.onContextUpdated = function onContextUpdated(){
					let treeList = service.getTree();
					if (projectId !== estimateMainService.getSelectedProjectId() || _.size(treeList)<=0) {
						service.setSelected(null);
						projectId = estimateMainService.getSelectedProjectId();

						if (projectId) {
							service.loadWicGroup();
						}
					}
				};

				service.getWicGroupTree  = function (currentWicGroup){
					if(currentWicGroup.WicGroupFk){

						let result = [];
						cloudCommonGridService.flatten(service.getTree(), result, 'WicGroups');

						let parent = _.find(result, {'Id': currentWicGroup.WicGroupFk});
						if(parent){
							if( parent.WicGroupFk){
								return service.getWicGroupTree(parent);
							}else{
								return parent;
							}
						}else{
							return parent;
						}
					}else{
						return currentWicGroup;
					}
				};

				return service;
			}]);
})();
