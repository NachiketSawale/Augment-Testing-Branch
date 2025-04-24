/**
 * Created by lav on 01/06/2018.
 */
/* global angular, globals, _ */
(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.transport';

	angular.module(moduleName).factory('transportplanningTransportReturnPlantsSelectService', Service);

	Service.$inject = ['transportplanningTransportReturnResourcesCommonSelectService',
		'transportplanningTransportReturnResourcesUIService'];

	function Service(transportplanningTransportReturnResourcesCommonSelectService,
					 UIService) {

		var BaseService = transportplanningTransportReturnResourcesCommonSelectService;
		var service = new BaseService();

		service.customerOptions = {
			forPlants: true,
			grid2Title: 'transportplanning.transport.wizard.plants',
			grid3Title: 'transportplanning.transport.wizard.plantPlan',
			filterFormOptions: UIService.getFilterFormOptionsPlants()
		};

		service.getDeadline = function () {
			return this.scope.filterEntity.Deadline;
		};

		return service;
	}
})(angular);
