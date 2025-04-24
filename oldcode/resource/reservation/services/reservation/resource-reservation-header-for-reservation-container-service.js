/**
 * Created by baf on 2021-10-22.
 */
(function (angular) {
	'use strict';
	let timeAllocationModule = angular.module('resource.reservation');

	/**
	 * @ngdoc service
	 * @name resourceReservationHeaderForReservationContainerService
	 * @function
	 *
	 * @description
	 *
	 */
	timeAllocationModule.service('resourceReservationHeaderForReservationContainerService', ResourceReservationHeaderForReservationContainerService);

	ResourceReservationHeaderForReservationContainerService.$inject = ['platformModuleInitialConfigurationService', 'resourceReservationHeaderForReservationLayoutServiceFactory'];

	function ResourceReservationHeaderForReservationContainerService(platformModuleInitialConfigurationService, resourceReservationHeaderForReservationLayoutServiceFactory) {
		this.prepareGridConfig = function prepareGridConfig(containerUid, scope, moduleCIS) {
			let modConf = platformModuleInitialConfigurationService.get('Resource.Reservation');

			let config = resourceReservationHeaderForReservationLayoutServiceFactory.prepareConfig(containerUid, scope, modConf);
			moduleCIS.takeDynamic(containerUid, config);
		};

		this.prepareDetailConfig = function prepareDetailConfig(containerUid, scope, moduleCIS) {
			let modConf = platformModuleInitialConfigurationService.get('Resource.Reservation');

			let config = resourceReservationHeaderForReservationLayoutServiceFactory.prepareConfig(containerUid, scope, modConf);
			moduleCIS.takeDynamic(containerUid, config);
		};
	}
})(angular);