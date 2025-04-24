/**
 * Created by nitsche on 30.04.2020
 */

(function (angular) {
	'use strict';
	var myModule = angular.module('logistic.dispatching');

	/**
	 * @ngdoc service
	 * @name logisticDispatchingPlantLocationReceivingDataService
	 * @description pprovides methods to access, create and update logistic dispatching  entities
	 */
	myModule.service('logisticDispatchingPlantLocationReceivingDataService', LogisticDispatchingPlantLocationReceivingDataService);

	LogisticDispatchingPlantLocationReceivingDataService.$inject = [
		'$injector', 'logisticJobLocationDataServiceFactory', 'logisticDispatchingHeaderDataService'];

	function LogisticDispatchingPlantLocationReceivingDataService(
		$injector, logisticJobLocationDataServiceFactory, logisticDispatchingHeaderDataService) {
		var self = this;
		var config = {
			serviceName: 'logisticDispatchingPlantLocationReceivingDataService',
			module: myModule,
			httpCRUD:{
				initReadData : function initReadData(readData) {
					let selected = logisticDispatchingHeaderDataService.getSelected();
					readData.JobFk = selected.Job2Fk;
				},
				endRead: 'listbyparent'
			},
			entityRole:{
				parentService: logisticDispatchingHeaderDataService
			}
		};
		var serviceContainer = logisticJobLocationDataServiceFactory.createService(
			config,
			self,
			'logisticDispatchingPlantLocationReceivingLayoutService',
			'logistic.dispatching.plantLocationReceivingListTitle',
			'logistic.dispatching.headerListTitle'
		);
		serviceContainer.data.Initialised = true;
	}
})(angular);
