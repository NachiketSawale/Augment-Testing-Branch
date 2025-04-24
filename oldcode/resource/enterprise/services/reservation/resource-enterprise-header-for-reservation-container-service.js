/**
 * Created by baf on 2021-10-22.
 */
(function (angular) {
	'use strict';
	let timeAllocationModule = angular.module('resource.enterprise');

	/**
	 * @ngdoc service
	 * @name resourceEnterpriseHeaderForReservationContainerService
	 * @function
	 *
	 * @description
	 *
	 */
	timeAllocationModule.service('resourceEnterpriseHeaderForReservationContainerService', ResourceEnterpriseHeaderForReservationContainerService);

	ResourceEnterpriseHeaderForReservationContainerService.$inject = ['platformModuleInitialConfigurationService', 'resourceEnterpriseHeaderForReservationLayoutServiceFactory'];

	function ResourceEnterpriseHeaderForReservationContainerService(platformModuleInitialConfigurationService, resourceEnterpriseHeaderForReservationLayoutServiceFactory) {
		this.prepareGridConfig = function prepareGridConfig(containerUid, scope, moduleCIS) {
			let modConf = platformModuleInitialConfigurationService.get('Resource.Enterprise');

			let config = resourceEnterpriseHeaderForReservationLayoutServiceFactory.prepareConfig(containerUid, scope, modConf);
			moduleCIS.takeDynamic(containerUid, config);
		};

		this.prepareDetailConfig = function prepareDetailConfig(containerUid, scope, moduleCIS) {
			let modConf = platformModuleInitialConfigurationService.get('Resource.Enterprise');

			let config = resourceEnterpriseHeaderForReservationLayoutServiceFactory.prepareConfig(containerUid, scope, modConf);
			moduleCIS.takeDynamic(containerUid, config);
		};
	}
})(angular);