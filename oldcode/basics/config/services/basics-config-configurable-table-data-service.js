
(function (angular) {
	/* global globals */
	'use strict';
	let myModule = angular.module('basics.config');

	/**
	 * @ngdoc service
	 * @name basicsConfigConfigurableTableDataService
	 * @description pprovides methods, create and update DataConfiguration entities
	 */
	myModule.service('basicsConfigConfigurableTableDataService', BasicsConfigConfigurableTableDataService);

	BasicsConfigConfigurableTableDataService.$inject = ['_', 'platformDataServiceFactory', 'basicsConfigMainService'];

	function BasicsConfigConfigurableTableDataService(_, platformDataServiceFactory, basicsConfigMainService) {
		var self = this;
		const basicsConfigConfigurableTableServiceOption = {
			module: myModule,
			serviceName: 'basicsConfigConfigurableTableDataService',
			entityNameTranslationID: 'basics.config.configDataConfigurationEntity',
			httpRead: {
				route: globals.webApiBaseUrl + 'basics/config/entitycreation/',
				endRead: 'configurable',
				initReadData: function initReadData(readData) {
					let selected = basicsConfigMainService.getSelected();
					readData.filter = '?module=' + selected.InternalName;
				}
			},
			presenter: { list: {
				incorporateDataRead(responseData, data) {
					return data.handleReadSucceeded(responseData.ConfigurableTables, data);
				}
			}},
			entityRole: {
				leaf: { itemName: 'ConfigurableTables', parentService: basicsConfigMainService }
			}
		};

		let serviceContainer = platformDataServiceFactory.createService(basicsConfigConfigurableTableServiceOption, self);
		serviceContainer.data.Initialised = true;

		self.getForTable = function getForTable(table) {
			return _.find(serviceContainer.data.itemList, function(entity) {
				return entity.Table === table;
			});
		};
	}
})(angular);
