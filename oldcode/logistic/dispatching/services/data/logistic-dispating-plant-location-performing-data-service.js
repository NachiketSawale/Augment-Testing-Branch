/**
 * Created by nitsche on 30.04.2020
 */

(function (angular) {
	'use strict';
	var myModule = angular.module('logistic.dispatching');

	/**
	 * @ngdoc service
	 * @name logisticDispatchingPlantLocationPerformingDataService
	 * @description pprovides methods to access, create and update logistic dispatching  entities
	 */
	myModule.service('logisticDispatchingPlantLocationPerformingDataService', LogisticDispatchingPlantLocationPerformingDataService);

	LogisticDispatchingPlantLocationPerformingDataService.$inject = [
		'$injector', 'logisticJobLocationDataServiceFactory', 'logisticDispatchingHeaderDataService'
	];

	function LogisticDispatchingPlantLocationPerformingDataService(
		$injector, logisticJobLocationDataServiceFactory, logisticDispatchingHeaderDataService
	) {
		var self = this;
		var config = {
			serviceName: 'logisticDispatchingPlantLocationPerformingDataService',
			module: myModule,
			httpCRUD:{
				initReadData : function initReadData(readData) {
					let selected = logisticDispatchingHeaderDataService.getSelected();
					readData.JobFk = selected.Job1Fk;
					readData.PlantIsPlanable = true;
				},
				endRead: 'listbyparentpaging'
			},
			entityRole:{
				parentService: logisticDispatchingHeaderDataService
			},
			presenter: {
				list: {
					enablePaging: true
				}
			}
		};
		let serviceContainer = logisticJobLocationDataServiceFactory.createService(
			config,
			self,
			'logisticDispatchingPlantLocationPerformingLayoutService',
			'logistic.dispatching.plantLocationPerformingListTitle',
			'logistic.dispatching.headerListTitle'
		);
		serviceContainer.data.Initialised = true;
		serviceContainer.service.onDetailGridSuccess = function onDetailGridSuccess(selecteItems) {
			let dropService = $injector.get('logisticDispatchingRecordDropService');
			if(dropService.canPastLocations2DispatchRecord(selecteItems)){
				$injector.get('logisticDispatchingRecordDropService').executeDropPlantStockRecord(selecteItems);
			}
		};
	}
})(angular);
