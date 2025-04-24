/**
 * Created by zwz on 9/20/2019.
 */
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.engineering';
	//var angModule = angular.module(moduleName);

	angular.module(moduleName).factory('productionplanningEngineeringTaskReadonlyDataServiceFactory', DataService);
	DataService.$inject = ['$injector', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'platformDataServiceEntityReadonlyProcessor', 'ppsMasterDataServiceFactory', 'ppsMasterDataConfigurations', 'productionplanningEngineeringTaskProcessor'];
	function DataService($injector, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, platformDataServiceEntityReadonlyProcessor, ppsMasterDataServiceFactory, ppsMasterDataConfigurations, productionplanningEngineeringTaskProcessor) {
		var serviceCache = {}, serviceContainer;

		function createNewComplete(options) {
			var parentService = $injector.get(options.parentServiceName);
			var systemOption = {
				flatLeafItem: {
					serviceName: options.serviceName,
					httpRead: {
						route: globals.webApiBaseUrl + 'productionplanning/engineering/task/',
						endRead: options.endRead,
						initReadData: options.initReadData
					},
					entityRole: {
						leaf: {
							itemName: 'EngTask',
							parentService: parentService,
							parentFilter: options.parentFilter
						}
					},
					actions: {},
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: 'EngTaskDto',
						moduleSubModule: 'ProductionPlanning.Engineering'
					}), platformDataServiceEntityReadonlyProcessor, productionplanningEngineeringTaskProcessor],
					presenter: {
						list: {
							incorporateDataRead: function (readData, data) {
								var result = {
									FilterResult: readData.FilterResult,
									dtos: readData || []
								};
								//basicsLookupdataLookupDescriptorService.attachData(readData);
								return serviceContainer.data.handleReadSucceeded(result, data);
							}
						}
					}
				}
			};

			serviceContainer = platformDataServiceFactory.createNewComplete(systemOption);

			// register to masterDataService
			var masterDataServiceConfig = ppsMasterDataConfigurations.get('Event', {
				dataServiceContainer: serviceContainer,
				matchConfig: {
					'Id': 'PpsEventFk'
				}
			});
			ppsMasterDataServiceFactory.registerServiceToMasterDataService(masterDataServiceConfig);

			return serviceContainer.service;
		}

		function getService(options) {
			if (_.isNil(serviceCache[options.serviceName])) {
				serviceCache[options.serviceName] = createNewComplete(options);
			}
			return serviceCache[options.serviceName];
		}

		return {
			getService: getService
		};
	}
})(angular);

