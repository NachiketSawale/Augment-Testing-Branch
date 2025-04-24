/**
 * Created by nit on 21.01.2018.
 */
(function (angular) {
	'use strict';
	var changeMainModule = angular.module('logistic.job');

	/**
	 * @ngdoc service
	 * @name logisticJobRequiredByContainerService
	 * @function
	 *
	 * @description
	 *
	 */
	changeMainModule.service('logisticJobRequiredByContainerService', LogisticJobRequiredByContainerService);

	LogisticJobRequiredByContainerService.$inject = ['platformDynamicContainerServiceFactory', 'logisticJobRequiredByDataServiceFactory'];

	function LogisticJobRequiredByContainerService(platformDynamicContainerServiceFactory, logisticJobRequiredByDataServiceFactory) {
		this.prepareGridConfig = function prepareGridConfig(containerUid, scope, moduleCIS) {
			platformDynamicContainerServiceFactory.prepareGridConfig('Logistic.Job', logisticJobRequiredByDataServiceFactory, containerUid, scope, moduleCIS);
		};

		this.prepareDetailConfig = function prepareDetailConfig(containerUid, scope, moduleCIS) {
			platformDynamicContainerServiceFactory.prepareDetailConfig('Logistic.Job', logisticJobRequiredByDataServiceFactory, containerUid, scope, moduleCIS);
		};
	}
})(angular);