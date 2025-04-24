(function (angular) {

	'use strict';

	var moduleName = 'basics.dependentdata';
	var dependentDataModule = angular.module(moduleName);

	dependentDataModule.factory('basicsDependentDataChartSeriesService', ['$http', '$q', 'basicsDependentDataChartService', 'platformDataServiceFactory',

		function ($http, $q, basicsDependentDataChartService, platformDataServiceFactory) {

			var serviceOption = {
				flatNodeItem: {
					module: dependentDataModule,
					serviceName: 'basicsDependentDataChartSeriesService',
					httpRead: {
						route: globals.webApiBaseUrl + 'basics/dependentdata/chartSeries/', endRead: 'list'
					},
					httpCreate: {
						route: globals.webApiBaseUrl + 'basics/dependentdata/chartSeries/', endCreate: 'createEntity'
					},
					httpDelete: {
						route: globals.webApiBaseUrl + 'basics/dependentdata/chartSeries/', endDelete: 'delete'
					},
					httpUpdate: {
						route: globals.webApiBaseUrl + 'basics/dependentdata/chartSeries/', endUpdate: 'update'
					},
					entityRole: {
						node: {itemName: 'DependentDataChartSeries', parentService: basicsDependentDataChartService}
					},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								var chartEntity = basicsDependentDataChartService.getSelected();
								//console.log(chartEntity);
								creationData.mainItemId = chartEntity.Id;
								creationData.ChartTypeFk = chartEntity.ChartTypeFk;
								creationData.DependentdatacolumnXFk = chartEntity.DependentdatacolumnXFk;
								creationData.DependentdatacolumnYFk = chartEntity.DependentdatacolumnYFk;
							}
						}
					},
					translation: {
						uid: 'basicsDependentDataChartSeriesService',
						title: 'Columns Translation',
						columns: [{header: 'cloud.common.entityDescription', field: 'LabelInfo'}],
						dtoScheme: { typeName: 'UserChartSeriesDto', moduleSubModule: 'Basics.DependentData' }
					}
				}
			};
			var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
			var service = serviceContainer.service;
			return service;

		}]);
})(angular);
