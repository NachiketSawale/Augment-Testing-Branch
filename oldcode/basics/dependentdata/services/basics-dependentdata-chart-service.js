(function (angular) {

	'use strict';

	var moduleName = 'basics.dependentdata';
	var dependentDataModule = angular.module(moduleName);

	dependentDataModule.factory('basicsDependentDataChartService', ['$http', '$q', 'basicsDependentDataMainService', 'platformDataServiceFactory', 'platformRuntimeDataService', 'basicsLookupdataLookupDescriptorService', 'basicsDependentDataChartValidationService', 'basicsCommonMandatoryProcessor',

		function ($http, $q, basicsDependentDataMainService, platformDataServiceFactory, platformRuntimeDataService, lookupDescriptorService, basicsDependentDataChartValidationService, basicsCommonMandatoryProcessor) {

			var serviceFactoryOptions = {
				flatNodeItem: {
					module: dependentDataModule,
					serviceName: 'basicsDependentDataChartService',
					httpRead: {
						route: globals.webApiBaseUrl + 'basics/dependentdata/chart/', endRead: 'list'
					},
					httpCreate: {
						route: globals.webApiBaseUrl + 'basics/dependentdata/chart/', endCreate: 'createEntity'
					},
					httpDelete: {
						route: globals.webApiBaseUrl + 'basics/dependentdata/chart/', endDelete: 'delete'
					},
					httpUpdate: {
						route: globals.webApiBaseUrl + 'basics/dependentdata/chart/', endUpdate: 'update'
					},
					entityRole: {
						node: {itemName: 'DependentDataChart', parentService: basicsDependentDataMainService}
					},
					presenter: {
						list: {
							incorporateDataRead: function (readData, data) {
								lookupDescriptorService.attachData(readData);
								var result = serviceContainer.data.handleReadSucceeded(readData.Main, data);
								if (result && result.length > 0) {
									serviceContainer.service.goToFirst();
								}
								return result;

							},
							initCreationData: function initCreationData(creationData) {
								creationData.mainItemId = basicsDependentDataMainService.getSelected().Id;
							},
							handleCreateSucceeded: function handleCreateSucceeded(creationData) {
								creationData.Config = JSON.stringify({
									version: 1.0,
									title: {show: true, position: 'left', color: 3355443},
									legend: {show: true, position: 'left', color: 3355443},
									group: {enable: false},
									scale: {
										x: {
											type: 'linear',
											time: {dataFormat: 'MM/DD/YYY', unit: 'day'},
											customCategory: false,
											categorys: []
										}, y: {type: 'linear'}
									}
								});
							}
						}
					},
					actions: {
						delete: {},
						create: 'flat'
					},
					translation: {
						uid: 'basicsDependentDataChartService',
						title: 'Columns Translation',
						columns: [{header: 'cloud.common.entityDescription', field: 'TitleInfo'}],
						dtoScheme: { typeName: 'UserChartDto', moduleSubModule: 'Basics.DependentData' }
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(serviceFactoryOptions);
			var service = serviceContainer.service;

			var validator = basicsDependentDataChartValidationService(serviceContainer.service);

			serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'UserChartDto',
				moduleSubModule: 'Basics.DependentData',
				validationService: validator,
				mustValidateFields: ['DependentdatacolumnXFk', 'DependentdatacolumnYFk']
			});

			service.loadData = function (dependentDataId) {
				var deffered = $q.defer();
				var calls = [];
				calls.push($http.get(globals.webApiBaseUrl + 'basics/dependentdata/chartslist?dependentDataId=' + dependentDataId));
				calls.push($http.get(globals.webApiBaseUrl + 'basics/dependentdata/columnslist?dependentDataId=' + dependentDataId));
				$q.all(calls).then(function (response) {
					deffered.resolve(response);
				});
				return deffered.promise;
			};

			return service;

		}]);
})(angular);
