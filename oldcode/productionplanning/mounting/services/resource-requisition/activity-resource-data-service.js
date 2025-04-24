/**
 * Created by anl on 9/20/2017.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.mounting';
	var masterModule = angular.module(moduleName);

	masterModule.factory('productionplanningMountingResourceForActivityDataService', ResourceForActivityDataService);

	ResourceForActivityDataService.$inject = [
		'$translate',
		'treeviewListDialogDataService',
		'basicsLookupdataLookupDescriptorService',
		'platformDataServiceFactory',
		'productionplanningMountingContainerInformationService',
		'productionplanningMountingActivityResourceProcessor'];
	function ResourceForActivityDataService($translate,
											dialogDataService,
											basicsLookupdataLookupDescriptorService,
											platformDataServiceFactory,
											mountingContainerInformationService,
											actResourceProcessor) {

		var activityGUID = '3a37c9d82f4e45c28ccd650f1fd2bc1f';
		var dynamicActivityService = mountingContainerInformationService.getContainerInfoByGuid(activityGUID).dataServiceName;

		var systemOption = {
			flatLeafItem: {
				serviceName: 'productionplanningMountingResourceForActivityDataService',
				httpRead: {
					route: globals.webApiBaseUrl + 'resource/master/resource/',
					endRead: 'listForMntActivity'
				},
				entityRole: {
					leaf: {
						itemName: 'ActResource',
						parentService: dynamicActivityService
					}
				},
				dataProcessor: [actResourceProcessor],
				presenter: {
					list: {
						incorporateDataRead: function (readData, data) {

							basicsLookupdataLookupDescriptorService.attachData(readData);
							var result = readData.Main ? {
								FilterResult: readData.FilterResult,
								dtos: readData.Main || []
							} : readData;
							return serviceContainer.data.handleReadSucceeded(result, data);
						}
					}
				},
				actions: {}
			}
		};

		/* jshint -W003 */
		var serviceContainer = platformDataServiceFactory.createNewComplete(systemOption);

		serviceContainer.data.setFilter = function (filter) {
			var parentItem = dynamicActivityService.getSelected();
			if (parentItem && angular.isDefined(parentItem.PpsEventFk)) {
				serviceContainer.data.filter = 'PpsEventId=' + parentItem.PpsEventFk;
			} else {
				serviceContainer.data.filter = filter;
			}
		};

		return serviceContainer.service;
	}
})(angular);
