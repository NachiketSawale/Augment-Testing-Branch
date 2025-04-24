(function (angular) {
	'use strict';


	var module = 'transportplanning.requisition';

	/**
	 * @ngdoc service
	 * @name transportPlanningResourceReservationContainerService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(module).service('transportPlanningResourceReservationContainerService', TransportPlanningResourceReservationContainerService);

	TransportPlanningResourceReservationContainerService.$inject = ['platformModuleInitialConfigurationService', 'transportplanningResourceReservationLayoutServiceFactory'];

	function TransportPlanningResourceReservationContainerService(platformModuleInitialConfigurationService, transportplanningResourceReservationLayoutServiceFactory) {
		this.prepareGridConfig = function prepareGridConfig(containerUid, scope, moduleCIS, moduleName, parentService) {
			var modConf = platformModuleInitialConfigurationService.get(moduleName);

			var config = transportplanningResourceReservationLayoutServiceFactory.prepareConfig(containerUid, scope, modConf, parentService);
			moduleCIS.takeDynamic(containerUid, config);
		};

		this.prepareDetailConfig = function prepareDetailConfig(containerUid, scope, moduleCIS, moduleName, parentService) {
			var modConf = platformModuleInitialConfigurationService.get(moduleName);

			var config = transportplanningResourceReservationLayoutServiceFactory.prepareConfig(containerUid, scope, modConf, parentService);
			moduleCIS.takeDynamic(containerUid, config);
		};
	}
})(angular);