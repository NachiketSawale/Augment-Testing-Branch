(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name logisticCardPlantLocationDataService
	 * @function
	 *
	 * @description
	 * logisticCardPlantDataService is the data service for summarized plant allocation view records
	 */
	const moduleName = 'logistic.card';
	let logisticModule = angular.module(moduleName);

	logisticModule.service('logisticCardPlantLocationDataService', LogisticCardPlantLocationDataService);

	LogisticCardPlantLocationDataService.$inject = ['logisticJobLocationDataServiceFactory', 'logisticCardDataService'];

	function LogisticCardPlantLocationDataService(logisticJobLocationDataServiceFactory, logisticCardDataService) {
		const self = this;

		const config = {
			serviceName: 'logisticCardPlantLocationDataService',
			module: logisticModule,
			httpCRUD:{
				initReadData : function initReadData(readData) {
					let selected = logisticCardDataService.getSelected();
					readData.PlantFk = selected.PlantFk || 0;
				},
				endRead: 'listbyparentpaging'
			},
			entityRole:{
				parentService: logisticCardDataService
			},
			presenter: {
				list: {
					enablePaging: true
				}
			}
		};
		var serviceContainer = logisticJobLocationDataServiceFactory.createService(
			config,
			self,
			'logisticJobPlantLocation2LayoutService',
			'logistic.card.plantLocationListTitle',
			'logistic.common.cardEntity'
		);
	}
})(angular);
