/**
 * Created by baf on 27.09.2018
 */

(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'resource.common';

	/**
	 * @ngdoc service
	 * @name resourceCommonLayoutHelperService
	 * @description provides methods for easily building user interface layouts
	 */
	angular.module(moduleName).service('resourceCommonPlantJobLocationFactory', ResourceCommonPlantJobLocationFactory);

	ResourceCommonPlantJobLocationFactory.$inject = ['_', 'platformDataServiceFactory', 'resourceCommonPlantJobLocationToolService'];

	function ResourceCommonPlantJobLocationFactory(_, platformDataServiceFactory, resourceCommonPlantJobLocationToolService) {
		var self = this;

		this.provideDataServiceOptions = function provideDataServiceOptions(dataServiceOptions, configuration) {
			var dsOptions = configuration.serviceOptions;
			var filterConfiguration = configuration.filterOptions;
			dataServiceOptions.flatLeafItem = {
				module: dsOptions.module,
				serviceName: dsOptions.name,
				entityNameTranslationID: dsOptions.translationID,
				httpRead: { route: globals.webApiBaseUrl + 'resource/equipment/allocation/',
					endRead: 'summarized',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = dsOptions.parentService.getSelected();
						resourceCommonPlantJobLocationToolService.initializeReadData(readData, filterConfiguration, selected);
					}},
				actions: {delete: false, create: false },
				entityRole: {
					leaf: { itemName: dsOptions.itemName, parentService: dsOptions.parentService}
				}
			};
		};

		this.createPlantJobLocationDataService = function createPlantJobLocationDataService(dataServiceOptions, configuration) {
			self.provideDataServiceOptions(dataServiceOptions, configuration);
			var serviceContainer = platformDataServiceFactory.createNewComplete(dataServiceOptions);

			configuration.filterOptions.service = serviceContainer.service;
			self.addPlantJobLocationInterface(serviceContainer, configuration);

			return serviceContainer;
		};

		this.addPlantJobLocationInterface = function addPlantJobLocationInterface(serviceContainer, configuration) {
			serviceContainer.service.getConfiguration = function getConfiguration() {

				return configuration.filterOptions;
			};
		};
	}
})(angular);
