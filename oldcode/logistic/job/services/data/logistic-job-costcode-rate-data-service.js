/**
 * Created by leo on 12.03.2018
 */

(function (angular) {
	'use strict';
	var myModule = angular.module('logistic.job');

	/**
	 * @ngdoc service
	 * @name logisticJobCostCodeRateDataService
	 * @description pprovides methods to access, create and update logistic job Material Rate entities
	 */
	myModule.service('logisticJobCostCodeRateDataService', LogisticJobCostCodeRateDataService);

	LogisticJobCostCodeRateDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'logisticJobDataService'];

	function LogisticJobCostCodeRateDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, logisticJobDataService) {
		var self = this;
		var logisticJobCostCodeRateServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'logisticJobCostCodeRateDataService',
				entityNameTranslationID: 'logistic.job.costCodeRateListTitle',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'logistic/job/costcoderate/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = logisticJobDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = logisticJobDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'CostCodeRates', parentService: logisticJobDataService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(logisticJobCostCodeRateServiceOption, self);
		serviceContainer.data.Initialised = true;
	}
})(angular);
