(function (angular) {
	'use strict';
	var changeMainModule = angular.module('logistic.job');

	/**
	 * @ngdoc service
	 * @name logisticJobCardContainerService
	 * @function
	 *
	 * @description
	 *
	 */
	changeMainModule.service('logisticJobCardContainerService', LogisticJobCardContainerService);

	LogisticJobCardContainerService.$inject = ['platformDynamicContainerServiceFactory', 'logisticJobCardDataServiceFactory'];

	function LogisticJobCardContainerService(platformDynamicContainerServiceFactory, logisticJobCardDataServiceFactory) {
		this.prepareGridConfig = function prepareGridConfig(containerUid, scope, moduleCIS) {
			platformDynamicContainerServiceFactory.prepareGridConfig('Logistic.Job', logisticJobCardDataServiceFactory, containerUid, scope, moduleCIS);
		};

		this.prepareDetailConfig = function prepareDetailConfig(containerUid, scope, moduleCIS) {
			platformDynamicContainerServiceFactory.prepareDetailConfig('Logistic.Job', logisticJobCardDataServiceFactory, containerUid, scope, moduleCIS);
		};
	}
})(angular);