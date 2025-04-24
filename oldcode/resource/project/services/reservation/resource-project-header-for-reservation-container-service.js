/**
 * Created by baf on 2021-10-22.
 */
(function (angular) {
	'use strict';
	let timeAllocationModule = angular.module('resource.project');

	/**
	 * @ngdoc service
	 * @name resourceProjectHeaderForReservationContainerService
	 * @function
	 *
	 * @description
	 *
	 */
	timeAllocationModule.service('resourceProjectHeaderForReservationContainerService', ResourceProjectHeaderForReservationContainerService);

	ResourceProjectHeaderForReservationContainerService.$inject = ['platformModuleInitialConfigurationService', 'resourceProjectHeaderForReservationLayoutServiceFactory'];

	function ResourceProjectHeaderForReservationContainerService(platformModuleInitialConfigurationService, resourceProjectHeaderForReservationLayoutServiceFactory) {
		this.prepareGridConfig = function prepareGridConfig(containerUid, scope, moduleCIS) {
			let modConf = platformModuleInitialConfigurationService.get('Resource.Project');

			let config = resourceProjectHeaderForReservationLayoutServiceFactory.prepareConfig(containerUid, scope, modConf);
			moduleCIS.takeDynamic(containerUid, config);
		};

		this.prepareDetailConfig = function prepareDetailConfig(containerUid, scope, moduleCIS) {
			let modConf = platformModuleInitialConfigurationService.get('Resource.Project');

			let config = resourceProjectHeaderForReservationLayoutServiceFactory.prepareConfig(containerUid, scope, modConf);
			moduleCIS.takeDynamic(containerUid, config);
		};
	}
})(angular);