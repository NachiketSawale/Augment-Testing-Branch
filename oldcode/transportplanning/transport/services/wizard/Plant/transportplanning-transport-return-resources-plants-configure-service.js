/**
 * Created by lav on 12/3/2018.
 */
/* global angular */
(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.transport';

	angular.module(moduleName).factory('transportplanningTransportReturnResourcesPlantsConfigureService', Service);

	Service.$inject = ['transportplanningTransportReturnResourcesCommonConfigureService'];

	function Service(transportplanningTransportReturnResourcesCommonConfigureService) {

		var BaseService = transportplanningTransportReturnResourcesCommonConfigureService;
		var service = new BaseService();
		service.customerOptions = {
			forPlants: true,
			grid2Title: 'transportplanning.transport.wizard.plants'
		};
		return service;
	}
})(angular);