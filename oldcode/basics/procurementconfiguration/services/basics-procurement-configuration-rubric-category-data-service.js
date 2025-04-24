/**
 * Created by wuj on 8/31/2015.
 */


(function (angular) {
	'use strict';
	var moduleName = 'basics.procurementconfiguration';

	angular.module(moduleName).factory('basicsProcurementConfigurationRubricCategoryService',
		['platformDataServiceFactory', 'ServiceDataProcessArraysExtension', 'basicsProcurementConfigHeaderDataService', 'basicsLookupdataLookupDescriptorService', '$http',
			function (platformDataServiceFactory, ServiceDataProcessArraysExtension, parentService, basicsLookupdataLookupDescriptorService, $http) {

				const routeUrl = 'basics/procurementconfiguration/rubriccategary/';
				var serviceOption = {
					hierarchicalLeafItem: {
						httpRead: {
							route: globals.webApiBaseUrl + routeUrl,
							endRead: 'prcconfigurationtree',
							initReadData: function (readData) {
								var configurationTypeFk = parentService.getSelected().BasConfigurationTypeFk;
								readData.filter = '?configurationTypeId=' + configurationTypeFk;
							}
						},
						dataProcessor: [new ServiceDataProcessArraysExtension(['RubricCategoryEntities'])],
						presenter: {
							tree: {
								parentProp: 'RubricFk',
								childProp: 'RubricCategoryEntities',
								incorporateDataRead: incorporateDataRead
							}
						},
						entitySelection: {},
						entityRole: {
							leaf: {
								itemName: 'RubricCategoryTreeItem',
								parentService: parentService
							}
						},
						modification: {
							multi: {}
						},
						actions: {
							delete: false,
							create: false
						}
					}
				};

				var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);

				var service = serviceContainer.service;

				serviceContainer.service.getRubricCategoryIds = function getRubricCategoryIds() {
					var item = service.getSelected();
					var ids = [];
					if (!item) {
						return ids;
					}
					if (!item.HasChildren) {
						ids.push(item.Id);
					} else {
						angular.forEach(item.RubricCategoryEntities, function (rubricCategory) {
							ids.push(rubricCategory.Id);
						});
					}

					return ids;
				};


				//todo In angular js, refreshing the tree structure cannot record the current selected row.
				// angular needs to implement this function in the later stage
				parentService.updatedBasConfigurationType.register((e, configurationTypeFk) => {
					if (configurationTypeFk) {
						$http.get(globals.webApiBaseUrl + routeUrl + 'prcconfigurationtree/?configurationTypeId=' + configurationTypeFk).then(respond => {
							incorporateDataRead(respond.data, serviceContainer.data);
						});
					}
				});

				return service;

				function incorporateDataRead(readData, data) {
					basicsLookupdataLookupDescriptorService.attachData(readData);
					return serviceContainer.data.handleReadSucceeded(readData, data);
				}
			}]);
})(angular);


