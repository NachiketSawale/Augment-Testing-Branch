/**
 * Created by sfi on 9/2/2015.
 */
(function(angular){
	'use strict';
	var moduleName='basics.procurementconfiguration';
	angular.module(moduleName).factory('basicsProcurementConfiguration2TabDataService',
		['platformDataServiceFactory', 'basicsProcurementConfigurationModuleDataService',
			'basicsProcurementConfigHeaderDataService','basicsLookupdataLookupFilterService','$q',
			function (platformDataServiceFactory, moduleDataService,parentService,basicsLookupdataLookupFilterService,$q) {


				var filters = [
					{
						key: 'basics-procurement-configuration-module-tab-filter',
						serverSide: true,
						fn: function () {
							return 'ModuleFk = ' + moduleDataService.getIfSelectedIdElse();
						}
					}
				];

				basicsLookupdataLookupFilterService.registerFilter(filters);

				var serviceOption = {
					flatLeafItem: {
						httpCRUD: {
							endRead:'getlist',
							route: globals.webApiBaseUrl + 'basics/procurementconfiguration/configuration2tab/',
							initReadData: function (readData) {
								var moduleItem = moduleDataService.getSelected();
								var mainItem = parentService.getSelected();

								if (moduleDataService.hasSelection()) {
									readData.filter = '?moduleId=' + moduleItem.Id +'&mainItemId=' + mainItem.Id;

								}else{
									readData.filter = '?mainItemId=-1';
								}
							}
						},
						entityRole: {
							leaf: {
								itemName: 'PrcConfiguration2Tab',
								parentService: parentService,
								filterParent: function(data) {
									var parentId;
									if (moduleDataService.hasSelection()) {
										parentId = moduleDataService.getSelected().Id;
									}
									data.currentParentItem = parentService.getSelected();
									data.usesCache = false;
									return parentId;
								}
							}
						}
					}
				};
				var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
				var data = serviceContainer.data;
				var service = serviceContainer.service;

				data.doesRequireLoadAlways = true;//To be on the safe side, as I do not know if the basicsProcurementConfiguration2TabDataService data is needed somewhere else

            	  //Frank B., 2016-02-10: The line commented out is replaced by the three functions below.
            	  //This is necessary as basicsProcurementConfiguration2TabDataService load behavior depends on the moduleDataService
            	  //parentService.unregisterSelectionChanged(serviceContainer.data.loadSubItemList);
				service.loadSubItemList = function loadSubItemListFromService() {
                	return $q.when(data.itemList);//We do not want to load in the norml process
				};

				data.killRunningLoad = function killRunningLoadInInstanceData() {//We do not kill, as we use old event based loading, being connected for load
                	//not directly to the parent data service
				};

				data.killRunningLoad = function killRunningLoadInInstanceService() {//We do not kill, as we use old event based loading, being connected for load
                	//not directly to the parent data service
				};

				moduleDataService.registerSelectionChanged(serviceContainer.data.loadSubItemList);

				return service;
			}]);
})(angular);
