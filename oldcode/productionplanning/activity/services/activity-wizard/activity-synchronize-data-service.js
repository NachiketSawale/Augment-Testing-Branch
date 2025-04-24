/**
 * Created by anl on 9/5/2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.activity';
	var masterModule = angular.module(moduleName);

	masterModule.factory('productionplanningActivitySynchronizeDataService', ActivitySynchronizeDataService);

	ActivitySynchronizeDataService.$inject = ['platformDataServiceFactory'];

	function ActivitySynchronizeDataService(platformDataServiceFactory) {
		var systemOption = {
			flatRootItem: {
				serviceName: 'productionplanningActivitySynchronizeDataService',
				httpRead: {
					route: globals.webApiBaseUrl + 'resource/master/resource/',
					endRead: 'listForMntActivity'
				},
				entityRole: {
					root: {
						itemName: 'Activities',
						moduleName: 'cloud.desktop.moduleDisplayNamePpsActivity'
						//handleUpdateDone: handleUpdateDone
					}
				},
				dataProcessor: [],
				presenter: {
					list: {
						incorporateDataRead: function (readData, data) { // jshint ignore:line
						},
						handleCreateSucceeded: function (item) { // jshint ignore:line
						}
					}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createNewComplete(systemOption);

		return serviceContainer.service;
	}
})(angular);