/**
 * Created by shen on 9/17/2023
 */

(function (angular) {
	'use strict';
	let moduleName = angular.module('logistic.dispatching');

	/**
	 * @ngdoc service
	 * @name logisticDispatchingRecordClaimHistoryContainerService
	 * @function
	 *
	 * @description
	 */
	moduleName.service('logisticDispatchingRecordClaimHistoryContainerService', LogisticDispatchingRecordClaimHistoryContainerService);

	LogisticDispatchingRecordClaimHistoryContainerService.$inject = ['platformModuleInitialConfigurationService', 'logisticDispatchingRecordClaimHistoryLayoutServiceFactory'];

	function LogisticDispatchingRecordClaimHistoryContainerService(platformModuleInitialConfigurationService, logisticDispatchingRecordClaimHistoryLayoutServiceFactory) {
		this.prepareGridConfig = function prepareGridConfig(containerUid, scope, moduleCIS) {
			let modConf = platformModuleInitialConfigurationService.get('Logistic.Dispatching');

			let config = logisticDispatchingRecordClaimHistoryLayoutServiceFactory.prepareConfig(containerUid, scope, modConf);
			moduleCIS.takeDynamic(containerUid, config);
		};

		this.prepareDetailConfig = function prepareDetailConfig(containerUid, scope, moduleCIS) {
			let modConf = platformModuleInitialConfigurationService.get('Logistic.Dispatching');

			let config = logisticDispatchingRecordClaimHistoryLayoutServiceFactory.prepareConfig(containerUid, scope, modConf);
			moduleCIS.takeDynamic(containerUid, config);
		};
	}
})(angular);