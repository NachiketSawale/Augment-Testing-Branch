/**
 * Created by baf on 2019-01-30
 */
(function (angular) {
	'use strict';
	var changeMainModule = angular.module('logistic.job');

	/**
	 * @ngdoc service
	 * @name logisticJobReservedForContainerService
	 * @function
	 *
	 * @description
	 *
	 */
	changeMainModule.service('logisticJobReservedForContainerService', LogisticJobReservedForContainerService);

	LogisticJobReservedForContainerService.$inject = ['platformDynamicContainerServiceFactory', 'logisticJobReservedForDataServiceFactory'];

	function LogisticJobReservedForContainerService(platformDynamicContainerServiceFactory, logisticJobReservedForDataServiceFactory) {
		this.prepareGridConfig = function prepareGridConfig(containerUid, scope, moduleCIS) {
			platformDynamicContainerServiceFactory.prepareGridConfig('Logistic.Job', logisticJobReservedForDataServiceFactory, containerUid, scope, moduleCIS);
		};

		this.prepareDetailConfig = function prepareDetailConfig(containerUid, scope, moduleCIS) {
			platformDynamicContainerServiceFactory.prepareDetailConfig('Logistic.Job', logisticJobReservedForDataServiceFactory, containerUid, scope, moduleCIS);
		};
	}
})(angular);